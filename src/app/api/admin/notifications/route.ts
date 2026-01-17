import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notifications: Array<{
            id: string;
            type: string;
            title: string;
            message: string;
            createdAt: Date;
        }> = [];

        // Get recent orders (last 24 hours)
        const recentOrders = await db.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { createdAt: "desc" },
            take: 3,
            include: {
                user: { select: { name: true, email: true } },
            },
        });

        recentOrders.forEach((order) => {
            notifications.push({
                id: `order-${order.id}`,
                type: "order",
                title: `New Order #${order.orderNumber}`,
                message: `Order worth ₹${order.total.toNumber().toLocaleString("en-IN")} from ${order.user.name || order.user.email}`,
                createdAt: order.createdAt,
            });
        });

        // Get low stock products
        const lowStockProducts = await db.product.findMany({
            where: {
                stock: { lte: 5 },
                isActive: true,
            },
            orderBy: { stock: "asc" },
            take: 3,
            select: { id: true, name: true, stock: true, updatedAt: true },
        });

        lowStockProducts.forEach((product) => {
            notifications.push({
                id: `stock-${product.id}`,
                type: "stock",
                title: "Low Stock Alert",
                message: `${product.name} is running low (${product.stock} left)`,
                createdAt: product.updatedAt,
            });
        });

        // Sort by date
        notifications.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ notifications: notifications.slice(0, 10) });
    } catch (error) {
        console.error("Notifications API error:", error);
        return NextResponse.json({ notifications: [] });
    }
}
