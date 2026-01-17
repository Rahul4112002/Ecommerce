import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface OrderSuccessPageProps {
    params: Promise<{ id: string }>;
}

async function getOrder(id: string, userId: string) {
    const order = await db.order.findFirst({
        where: { id, userId },
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
                        select: { color: true },
                    },
                },
            },
            address: true,
        },
    });

    return order;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
        notFound();
    }

    const order = await getOrder(id, session.user.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-green-600 mb-2">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-muted-foreground">
                            Thank you for your order. We&apos;ll send you a confirmation email shortly.
                        </p>
                    </div>

                    {/* Order Info Card */}
                    <div className="bg-card rounded-lg shadow-sm p-6 mb-6 border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="text-xl font-bold">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-md p-3">
                            <Package className="w-5 h-5" />
                            <span className="font-medium">
                                Estimated Delivery: 5-7 business days
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="font-semibold text-lg mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                        {item.product.images[0]?.url && (
                                            <img
                                                src={item.product.images[0].url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        {item.variant && (
                                            <p className="text-sm text-muted-foreground">
                                                Color: {item.variant.color}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                            </div>
                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{Number(order.discount).toLocaleString("en-IN")}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>
                                    {Number(order.shippingCharge) === 0
                                        ? "FREE"
                                        : `₹${Number(order.shippingCharge).toLocaleString("en-IN")}`}
                                </span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Delivery Address</h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p className="font-medium text-foreground">{order.address.name}</p>
                                <p>{order.address.address}</p>
                                {order.address.landmark && <p>{order.address.landmark}</p>}
                                <p>
                                    {order.address.city}, {order.address.state} - {order.address.pincode}
                                </p>
                                <p className="mt-2">📞 {order.address.phone}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Payment Details</h3>
                            </div>
                            <div className="text-sm">
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="font-medium">
                                        {order.paymentMethod === "COD"
                                            ? "Cash on Delivery"
                                            : order.paymentMethod === "RAZORPAY"
                                                ? "Online Payment"
                                                : order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span
                                        className={`font-medium ${order.paymentStatus === "PAID"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                            }`}
                                    >
                                        {order.paymentStatus === "PAID" ? "Paid" : "Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild className="flex-1">
                            <Link href="/account/orders">
                                <Package className="w-4 h-4 mr-2" />
                                View All Orders
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/products">
                                Continue Shopping
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>

                    {/* Help Section */}
                    <div className="text-center mt-8 text-sm text-muted-foreground">
                        <p>
                            Need help?{" "}
                            <Link href="/contact" className="text-primary hover:underline">
                                Contact Support
                            </Link>{" "}
                            or call us at{" "}
                            <a href="tel:+918828489397" className="text-primary hover:underline">
                                +91 88284 89397
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
