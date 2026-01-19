import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, CreditCard, ArrowRight, Phone } from "lucide-react";
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
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-2">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-400">
                            Thank you for your order. We&apos;ll send you a confirmation email shortly.
                        </p>
                    </div>

                    {/* Order Info Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-lg p-6 mb-6 border border-gold/30">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400">Order Number</p>
                                <p className="text-xl font-bold text-gold">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Order Date</p>
                                <p className="font-medium text-white">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-gold/10 text-gold rounded-lg p-3 border border-gold/20">
                            <Truck className="w-5 h-5" />
                            <span className="font-medium">
                                Estimated Delivery: 5-7 business days
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-lg p-6 mb-6 border border-gray-800">
                        <h2 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-gold" />
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-gray-800/50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product.images[0]?.url && (
                                            <img
                                                src={item.product.images[0].url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate">{item.product.name}</p>
                                        {item.variant && (
                                            <p className="text-sm text-gray-400">
                                                Color: {item.variant.color}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-400">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gold">
                                            ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4 bg-gray-700" />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                            </div>
                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-green-500">
                                    <span>Discount</span>
                                    <span>-₹{Number(order.discount).toLocaleString("en-IN")}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Shipping</span>
                                <span className={Number(order.shippingCharge) === 0 ? "text-green-500" : "text-white"}>
                                    {Number(order.shippingCharge) === 0
                                        ? "FREE"
                                        : `₹${Number(order.shippingCharge).toLocaleString("en-IN")}`}
                                </span>
                            </div>
                            <Separator className="my-2 bg-gray-700" />
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-gold">₹{Number(order.total).toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Delivery Address */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-lg p-5 border border-gray-800">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-gold" />
                                </div>
                                <h3 className="font-semibold text-white">Delivery Address</h3>
                            </div>
                            <div className="text-sm space-y-1">
                                <p className="font-medium text-gold">{order.address.name}</p>
                                <p className="text-gray-400">{order.address.address}</p>
                                {order.address.landmark && <p className="text-gray-400">{order.address.landmark}</p>}
                                <p className="text-gray-400">
                                    {order.address.city}, {order.address.state} - {order.address.pincode}
                                </p>
                                <p className="mt-2 flex items-center gap-1 text-gray-300">
                                    <Phone className="w-3 h-3" />
                                    {order.address.phone}
                                </p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-lg p-5 border border-gray-800">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-gold" />
                                </div>
                                <h3 className="font-semibold text-white">Payment Details</h3>
                            </div>
                            <div className="text-sm space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Method</span>
                                    <span className="font-medium text-white bg-gray-800 px-3 py-1 rounded-full text-xs">
                                        {order.paymentMethod === "COD"
                                            ? "Cash on Delivery"
                                            : order.paymentMethod === "RAZORPAY"
                                                ? "Online Payment"
                                                : order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Status</span>
                                    <span
                                        className={`font-medium px-3 py-1 rounded-full text-xs ${order.paymentStatus === "PAID"
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-yellow-500/20 text-yellow-500"
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
                        <Button asChild className="flex-1 bg-gold hover:bg-gold-light text-black font-semibold">
                            <Link href="/account/orders">
                                <Package className="w-4 h-4 mr-2" />
                                View All Orders
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1 border-gray-700 hover:bg-gray-800 text-white">
                            <Link href="/products">
                                Continue Shopping
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>

                    {/* Help Section */}
                    <div className="text-center mt-8 text-sm text-gray-500 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                        <p>
                            Need help?{" "}
                            <Link href="/contact" className="text-gold hover:underline">
                                Contact Support
                            </Link>{" "}
                            or call us at{" "}
                            <a href="tel:+918828489397" className="text-gold hover:underline">
                                +91 88284 89397
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
