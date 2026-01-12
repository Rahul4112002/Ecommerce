import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single order details
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const order = await db.order.findFirst({
            where: {
                id,
                userId: session.user.id
            },
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
                tracking: {
                    orderBy: { createdAt: "desc" },
                },
                coupon: {
                    select: { code: true, discountType: true, discountValue: true },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Format order
        const formattedOrder = {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            paymentId: order.paymentId,
            subtotal: Number(order.subtotal),
            discount: Number(order.discount),
            shippingCharge: Number(order.shippingCharge),
            total: Number(order.total),
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                price: Number(item.price),
                total: Number(item.price) * item.quantity,
                product: {
                    name: item.product.name,
                    slug: item.product.slug,
                    image: item.product.images[0]?.url || null,
                },
                variant: item.variant
                    ? { color: item.variant.color, colorCode: item.variant.colorCode }
                    : null,
            })),
            address: {
                name: order.address.name,
                phone: order.address.phone,
                address: order.address.address,
                landmark: order.address.landmark,
                city: order.address.city,
                state: order.address.state,
                pincode: order.address.pincode,
                type: order.address.type,
            },
            tracking: order.tracking.map((t) => ({
                status: t.status,
                message: t.message,
                createdAt: t.createdAt,
            })),
            coupon: order.coupon
                ? {
                    code: order.coupon.code,
                    discountType: order.coupon.discountType,
                    discountValue: Number(order.coupon.discountValue),
                }
                : null,
        };

        return NextResponse.json({ order: formattedOrder });
    } catch (error) {
        console.error("Order GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}
