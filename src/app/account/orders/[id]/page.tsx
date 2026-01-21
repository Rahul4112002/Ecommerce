"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/helpers";
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Glasses,
} from "lucide-react";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
        name: string;
        slug: string;
        image: string | null;
    };
    variant: {
        color: string;
        colorCode: string;
    } | null;
    lensOptions: {
        lensType: string;
        lensPackage: string;
        lensThickness: string;
        prescriptionOption: string;
        lensPrice: number;
    } | null;
}

interface TrackingEvent {
    status: string;
    message: string | null;
    createdAt: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentId: string | null;
    subtotal: number;
    discount: number;
    shippingCharge: number;
    total: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    address: {
        name: string;
        phone: string;
        address: string;
        landmark: string | null;
        city: string;
        state: string;
        pincode: string;
        type: string;
    };
    tracking: TrackingEvent[];
    coupon: {
        code: string;
        discountType: string;
        discountValue: number;
    } | null;
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

const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="w-4 h-4" />,
    CONFIRMED: <CheckCircle className="w-4 h-4" />,
    PROCESSING: <Package className="w-4 h-4" />,
    SHIPPED: <Truck className="w-4 h-4" />,
    DELIVERED: <CheckCircle className="w-4 h-4" />,
    CANCELLED: <XCircle className="w-4 h-4" />,
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const router = useRouter();
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            if (!res.ok) {
                router.push("/account/orders");
                return;
            }
            const data = await res.json();
            setOrder(data.order);
        } catch (error) {
            console.error("Failed to fetch order:", error);
            router.push("/account/orders");
        } finally {
            setLoading(false);
        }
    };

    const [cancelling, setCancelling] = useState(false);

    const handleCancelOrder = async () => {
        if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
            return;
        }

        setCancelling(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "cancel" }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to cancel order");
                return;
            }

            alert("Order cancelled successfully!");
            fetchOrder(); // Refresh order data
        } catch (error) {
            console.error("Failed to cancel order:", error);
            alert("Failed to cancel order. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/account/orders">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
                    <p className="text-sm text-muted-foreground">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <Badge className={`ml-auto ${statusColors[order.status]}`}>
                    {statusIcons[order.status]}
                    <span className="ml-1">{order.status}</span>
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="font-medium hover:text-primary"
                                        >
                                            {item.product.name}
                                        </Link>
                                        {item.variant && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: item.variant.colorCode }}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {item.variant.color}
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formatPrice(item.price)} × {item.quantity}
                                        </p>
                                        {/* Lens Options Display */}
                                        {item.lensOptions && (
                                            <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
                                                <div className="flex items-center gap-1 text-xs text-primary font-medium mb-1">
                                                    <Glasses className="w-3 h-3" />
                                                    Lens Customization
                                                </div>
                                                <div className="text-xs text-muted-foreground space-y-0.5">
                                                    <p>Type: {item.lensOptions.lensType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                                    <p>Package: {item.lensOptions.lensPackage?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                                    <p>Thickness: {item.lensOptions.lensThickness?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                                    <p>Prescription: {item.lensOptions.prescriptionOption === 'later' ? 'Will send later' : item.lensOptions.prescriptionOption === 'upload' ? 'Will upload' : 'None'}</p>
                                                    {item.lensOptions.lensPrice > 0 && (
                                                        <p className="text-primary font-medium">Lens Cost: {formatPrice(item.lensOptions.lensPrice)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatPrice(item.total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4" />

                        {/* Order Summary */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>
                                        Discount
                                        {order.coupon && (
                                            <span className="ml-1 text-xs">({order.coupon.code})</span>
                                        )}
                                    </span>
                                    <span>-{formatPrice(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>
                                    {order.shippingCharge === 0
                                        ? "FREE"
                                        : formatPrice(order.shippingCharge)}
                                </span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Delivery Address */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <p className="font-medium">{order.address.name}</p>
                            <p className="text-muted-foreground">{order.address.address}</p>
                            {order.address.landmark && (
                                <p className="text-muted-foreground">{order.address.landmark}</p>
                            )}
                            <p className="text-muted-foreground">
                                {order.address.city}, {order.address.state} -{" "}
                                {order.address.pincode}
                            </p>
                            <p className="mt-2">📞 {order.address.phone}</p>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Method</span>
                                <span className="font-medium">
                                    {order.paymentMethod === "COD"
                                        ? "Cash on Delivery"
                                        : "Online Payment"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge
                                    variant="outline"
                                    className={
                                        order.paymentStatus === "PAID"
                                            ? "text-green-600 border-green-600"
                                            : "text-yellow-600 border-yellow-600"
                                    }
                                >
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                            {order.paymentId && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment ID</span>
                                    <span className="font-mono text-xs">{order.paymentId}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Tracking */}
                    {order.tracking.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Order Tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.tracking.map((event, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="relative">
                                                <div className="w-3 h-3 bg-primary rounded-full" />
                                                {index < order.tracking.length - 1 && (
                                                    <div className="absolute top-3 left-1.5 w-0.5 h-full -translate-x-1/2 bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="font-medium text-sm">{event.status}</p>
                                                {event.message && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {event.message}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(event.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button variant="outline" asChild>
                    <Link href="/account/orders">← Back to Orders</Link>
                </Button>
                {order.status === "DELIVERED" && (
                    <Button variant="outline">Write a Review</Button>
                )}
                {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                    <Button
                        variant="destructive"
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                    >
                        {cancelling ? "Cancelling..." : "Cancel Order"}
                    </Button>
                )}
            </div>
        </div>
    );
}
