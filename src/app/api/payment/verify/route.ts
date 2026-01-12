import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendOrderConfirmation } from "@/lib/email";

// Generate unique order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EF${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            orderData
        } = await request.json();

        // Verify signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Payment verified, create order
        const { addressId, couponCode, items, notes } = orderData;

        // Verify address belongs to user
        const address = await db.address.findFirst({
            where: { id: addressId, userId: session.user.id },
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
            include: { variants: true },
        });

        if (products.length !== productIds.length) {
            return NextResponse.json(
                { error: "Some products are unavailable" },
                { status: 400 }
            );
        }

        // Calculate order items
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

            if (item.variantId) {
                const variant = product.variants.find((v) => v.id === item.variantId);
                if (variant?.price) {
                    price = Number(variant.price);
                }
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
                },
            });

            if (coupon) {
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

        const shippingCharge = subtotal >= 999 ? 0 : 99;
        const total = subtotal - discount + shippingCharge;

        // Create order with transaction
        const order = await db.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId: session.user.id,
                    addressId,
                    subtotal,
                    discount,
                    shippingCharge,
                    total,
                    status: "CONFIRMED",
                    paymentMethod: "RAZORPAY",
                    paymentStatus: "PAID",
                    paymentId: razorpayPaymentId,
                    couponId,
                    notes,
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
                            status: "Order Confirmed",
                            message: "Payment successful! Your order has been confirmed.",
                        },
                    },
                },
                include: {
                    address: true,
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
        }

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
            },
            message: "Payment verified and order created successfully",
        });
    } catch (error) {
        console.error("Payment Verify Error:", error);
        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        );
    }
}
