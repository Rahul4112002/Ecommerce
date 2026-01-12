import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const order = await db.order.findUnique({
            where: { id },
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        // Update order status to CANCELLED and payment status to REFUNDED
        const updatedOrder = await db.order.update({
            where: { id },
            data: {
                status: "CANCELLED",
                paymentStatus: "REFUNDED",
                tracking: {
                    create: {
                        status: "REFUNDED",
                        message: "Order refunded by admin",
                    }
                }
            },
            include: {
                user: true,
            }
        });

        // TODO: Trigger email notification if needed

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("[ORDER_REFUND]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
