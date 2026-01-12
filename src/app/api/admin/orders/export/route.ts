import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orders = await db.order.findMany({
            include: {
                user: true,
                address: true,
                items: {
                    include: {
                        product: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Define CSV headers
        const headers = [
            "Order ID",
            "Date",
            "Customer Name",
            "Customer Email",
            "Status",
            "Total",
            "Payment Method",
            "Payment Status",
            "Address",
            "Items",
        ];

        // Map orders to CSV rows
        const rows = orders.map((order) => {
            const itemsString = order.items
                .map((item) => `${item.product.name} (x${item.quantity})`)
                .join("; ");

            const addressString = `${order.address.address}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`;

            return [
                order.orderNumber,
                new Date(order.createdAt).toISOString(),
                order.user.name,
                order.user.email,
                order.status,
                order.total.toString(),
                order.paymentMethod,
                order.paymentStatus,
                `"${addressString}"`, // Quote address to handle commas
                `"${itemsString}"`, // Quote items to handle commas
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("[ORDERS_EXPORT]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
