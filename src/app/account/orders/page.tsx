"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/helpers";
import { Package, Eye, ChevronRight, ShoppingBag } from "lucide-react";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        slug: string;
        image: string | null;
    };
    variant: {
        color: string;
        colorCode: string;
    } | null;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    shippingCharge: number;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-gray-100 text-gray-800",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders?page=${page}&limit=5`);
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                    Looks like you haven&apos;t placed any orders yet.
                </p>
                <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    My Orders
                </h2>
            </div>

            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="font-semibold">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="font-semibold">{formatPrice(order.total)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={statusColors[order.status]}>
                                {order.status}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/account/orders/${order.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4">
                        <div className="space-y-4">
                            {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="font-medium hover:text-primary transition-colors line-clamp-1"
                                        >
                                            {item.product.name}
                                        </Link>
                                        {item.variant && (
                                            <p className="text-sm text-muted-foreground">
                                                Color: {item.variant.color}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Qty: {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <p className="text-sm text-muted-foreground">
                                    +{order.items.length - 3} more items
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 py-3 bg-gray-50 border-t flex justify-between items-center">
                        <div className="text-sm">
                            <span className="text-muted-foreground">Payment: </span>
                            <span className="font-medium">
                                {order.paymentMethod === "COD"
                                    ? "Cash on Delivery"
                                    : "Online Payment"}
                            </span>
                            {order.paymentStatus === "PAID" && (
                                <Badge variant="outline" className="ml-2 text-green-600">
                                    Paid
                                </Badge>
                            )}
                        </div>
                        <Link
                            href={`/account/orders/${order.id}`}
                            className="text-primary text-sm font-medium flex items-center hover:underline"
                        >
                            Track Order
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
