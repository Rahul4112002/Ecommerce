import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrderSchema } from "@/lib/order-validations";
import { Prisma } from "@prisma/client";
import { sendOrderConfirmation } from "@/lib/email";

// Generate unique order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EF${timestamp}${random}`;
}

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            db.order.findMany({
                where: { userId: session.user.id },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    slug: true,
                                    images: { take: 1, select: { url: true } },
                                },
                            },
                            variant: {
                                select: { color: true, colorCode: true },
                            },
                        },
                    },
                    address: true,
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db.order.count({ where: { userId: session.user.id } }),
        ]);

        // Format orders
        const formattedOrders = orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            subtotal: Number(order.subtotal),
            discount: Number(order.discount),
            shippingCharge: Number(order.shippingCharge),
            total: Number(order.total),
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                price: Number(item.price),
                product: {
                    name: item.product.name,
                    slug: item.product.slug,
                    image: item.product.images[0]?.url || null,
                },
                variant: item.variant
                    ? { color: item.variant.color, colorCode: item.variant.colorCode }
                    : null,
            })),
            address: order.address,
        }));

        return NextResponse.json({
            orders: formattedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Orders GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

// POST - Create new order
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { addressId, paymentMethod, couponCode, notes, items } = body;

        // Validate basic order data
        const validatedData = createOrderSchema.parse({
            addressId,
            paymentMethod,
            couponCode,
            notes,
        });

        // Validate items exist
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        // Verify address belongs to user
        const address = await db.address.findFirst({
            where: { id: validatedData.addressId, userId: session.user.id },
        });

        if (!address) {
            return NextResponse.json(
                { error: "Invalid address" },
                { status: 400 }
            );
        }

        // Fetch products and calculate totals
        const productIds = items.map((item: { productId: string }) => item.productId);
        const products = await db.product.findMany({
            where: { id: { in: productIds }, isActive: true },
            include: {
                variants: true,
            },
        });

        if (products.length !== productIds.length) {
            return NextResponse.json(
                { error: "Some products are unavailable" },
                { status: 400 }
            );
        }

        // Calculate order items and validate stock
        let subtotal = 0;
        const orderItems: {
            productId: string;
            variantId: string | null;
            quantity: number;
            price: number;
        }[] = [];

        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) continue;

            let price = Number(product.price);
            let stockToCheck = product.stock;

            // If variant selected, check variant stock and price
            if (item.variantId) {
                const variant = product.variants.find((v) => v.id === item.variantId);
                if (!variant) {
                    return NextResponse.json(
                        { error: `Invalid variant for ${product.name}` },
                        { status: 400 }
                    );
                }
                stockToCheck = variant.stock;
                if (variant.price) {
                    price = Number(variant.price);
                }
            }

            // Check stock
            if (stockToCheck < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            subtotal += price * item.quantity;
            orderItems.push({
                productId: item.productId,
                variantId: item.variantId || null,
                quantity: item.quantity,
                price,
            });
        }

        // Apply coupon if provided
        let discount = 0;
        let couponId: string | null = null;

        if (couponCode) {
            const coupon = await db.coupon.findFirst({
                where: {
                    code: couponCode.toUpperCase(),
                    isActive: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() },
                    OR: [
                        { usageLimit: null },
                        { usageLimit: { gt: db.coupon.fields.usedCount } },
                    ],
                },
            });

            if (coupon) {
                // Check minimum purchase
                if (coupon.minPurchase && subtotal < Number(coupon.minPurchase)) {
                    return NextResponse.json(
                        { error: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon` },
                        { status: 400 }
                    );
                }

                // Calculate discount
                if (coupon.discountType === "PERCENTAGE") {
                    discount = subtotal * (Number(coupon.discountValue) / 100);
                    if (coupon.maxDiscount) {
                        discount = Math.min(discount, Number(coupon.maxDiscount));
                    }
                } else {
                    discount = Number(coupon.discountValue);
                }

                couponId = coupon.id;
            }
        }

        // Calculate shipping
        const shippingCharge = subtotal >= 999 ? 0 : 99;
        const total = subtotal - discount + shippingCharge;

        // Create order with transaction
        const order = await db.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId: session.user.id,
                    addressId: validatedData.addressId,
                    subtotal,
                    discount,
                    shippingCharge,
                    total,
                    status: "PENDING",
                    paymentMethod: validatedData.paymentMethod,
                    paymentStatus: validatedData.paymentMethod === "COD" ? "PENDING" : "PENDING",
                    couponId,
                    notes: validatedData.notes,
                    items: {
                        create: orderItems.map((item) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                    tracking: {
                        create: {
                            status: "Order Placed",
                            message: "Your order has been placed successfully",
                        },
                    },
                },
                include: {
                    address: true, // Include address for email
                    items: {
                        include: {
                            product: { select: { name: true } },
                        },
                    },
                },
            });

            // Update stock
            for (const item of orderItems) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Update coupon usage
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } },
                });
            }

            return newOrder;
        });

        // Send confirmation email
        try {
            await sendOrderConfirmation(order, session.user);
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                total: Number(order.total),
                paymentMethod: order.paymentMethod,
            },
            message: "Order created successfully",
        }, { status: 201 });

    } catch (error) {
        console.error("Order POST Error:", error);
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid order data" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
