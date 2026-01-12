"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/helpers";
import { toast } from "sonner";
import {
    MapPin,
    Plus,
    CreditCard,
    Truck,
    ShoppingBag,
    ArrowLeft,
    Check,
    Loader2,
    Home,
    Building2,
    MapPinned,
} from "lucide-react";

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    type: "HOME" | "OFFICE" | "OTHER";
    isDefault: boolean;
}

const addressTypeIcons = {
    HOME: Home,
    OFFICE: Building2,
    OTHER: MapPinned,
};

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { items, getTotalPrice, clearCart } = useCartStore();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("COD");
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState<{
        name: string;
        phone: string;
        address: string;
        landmark: string;
        city: string;
        state: string;
        pincode: string;
        type: "HOME" | "OFFICE" | "OTHER";
        isDefault: boolean;
    }>({
        name: "",
        phone: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        type: "HOME",
        isDefault: false,
    });

    const subtotal = getTotalPrice();
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        }
    }, [status, router]);

    // Fetch addresses
    useEffect(() => {
        if (session?.user?.id) {
            fetchAddresses();
        }
    }, [session]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/address");
            const data = await res.json();
            if (data.addresses) {
                setAddresses(data.addresses);
                // Select default address
                const defaultAddr = data.addresses.find((a: Address) => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                } else if (data.addresses.length > 0) {
                    setSelectedAddressId(data.addresses[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async () => {
        try {
            const res = await fetch("/api/address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAddress),
            });

            if (!res.ok) {
                throw new Error("Failed to add address");
            }

            const data = await res.json();
            setAddresses([...addresses, data.address]);
            setSelectedAddressId(data.address.id);
            setShowAddressForm(false);
            setNewAddress({
                name: "",
                phone: "",
                address: "",
                landmark: "",
                city: "",
                state: "",
                pincode: "",
                type: "HOME",
                isDefault: false,
            });
            toast.success("Address added successfully");
        } catch (error) {
            toast.error("Failed to add address");
        }
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        // Simple coupon logic - matches cart page
        if (couponCode.toUpperCase() === "FIRST10") {
            setDiscount(subtotal * 0.1);
            setAppliedCoupon(couponCode.toUpperCase());
            toast.success("Coupon applied! 10% discount");
        } else if (couponCode.toUpperCase() === "FLAT200") {
            setDiscount(200);
            setAppliedCoupon(couponCode.toUpperCase());
            toast.success("Coupon applied! ₹200 off");
        } else {
            toast.error("Invalid coupon code");
        }
    };

    const handleRemoveCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setSubmitting(true);

        try {
            const orderData = {
                addressId: selectedAddressId,
                paymentMethod,
                couponCode: appliedCoupon,
                items: items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
            };

            if (paymentMethod === "RAZORPAY") {
                // Handle Razorpay payment
                const res = await fetch("/api/payment/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: total, orderData }),
                });

                if (!res.ok) {
                    throw new Error("Failed to create payment");
                }

                const data = await res.json();

                // Load Razorpay script and open checkout
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => {
                    const options = {
                        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                        amount: data.amount,
                        currency: "INR",
                        name: "LeeHit Eyewear",
                        description: "Order Payment",
                        order_id: data.razorpayOrderId,
                        handler: async function (response: {
                            razorpay_payment_id: string;
                            razorpay_order_id: string;
                            razorpay_signature: string;
                        }) {
                            // Verify payment
                            const verifyRes = await fetch("/api/payment/verify", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpaySignature: response.razorpay_signature,
                                    orderData,
                                }),
                            });

                            if (verifyRes.ok) {
                                const result = await verifyRes.json();
                                clearCart();
                                router.push(`/order-success/${result.order.id}`);
                            } else {
                                toast.error("Payment verification failed");
                            }
                        },
                        prefill: {
                            name: session?.user?.name || "",
                            email: session?.user?.email || "",
                        },
                        theme: {
                            color: "#000000",
                        },
                    };

                    // @ts-ignore
                    const razorpay = new window.Razorpay(options);
                    razorpay.open();
                };
                document.body.appendChild(script);
                setSubmitting(false);
            } else {
                // COD order
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Failed to create order");
                }

                const data = await res.json();
                clearCart();
                router.push(`/order-success/${data.order.id}`);
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to place order");
            setSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                <p className="text-muted-foreground mb-6">
                    Add some items to checkout
                </p>
                <Button asChild size="lg">
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/cart">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Address & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Delivery Address</h2>
                                </div>
                                <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add New Address</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 mt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Full Name</Label>
                                                    <Input
                                                        value={newAddress.name}
                                                        onChange={(e) =>
                                                            setNewAddress({ ...newAddress, name: e.target.value })
                                                        }
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Phone Number</Label>
                                                    <Input
                                                        value={newAddress.phone}
                                                        onChange={(e) =>
                                                            setNewAddress({ ...newAddress, phone: e.target.value })
                                                        }
                                                        placeholder="9876543210"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Address</Label>
                                                <Input
                                                    value={newAddress.address}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, address: e.target.value })
                                                    }
                                                    placeholder="House No, Street, Area"
                                                />
                                            </div>
                                            <div>
                                                <Label>Landmark (Optional)</Label>
                                                <Input
                                                    value={newAddress.landmark}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, landmark: e.target.value })
                                                    }
                                                    placeholder="Near..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label>City</Label>
                                                    <Input
                                                        value={newAddress.city}
                                                        onChange={(e) =>
                                                            setNewAddress({ ...newAddress, city: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>State</Label>
                                                    <Input
                                                        value={newAddress.state}
                                                        onChange={(e) =>
                                                            setNewAddress({ ...newAddress, state: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Pincode</Label>
                                                    <Input
                                                        value={newAddress.pincode}
                                                        onChange={(e) =>
                                                            setNewAddress({ ...newAddress, pincode: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Address Type</Label>
                                                <Select
                                                    value={newAddress.type}
                                                    onValueChange={(value: "HOME" | "OFFICE" | "OTHER") =>
                                                        setNewAddress({ ...newAddress, type: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="HOME">Home</SelectItem>
                                                        <SelectItem value="OFFICE">Office</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button onClick={handleAddAddress} className="w-full">
                                                Save Address
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No addresses saved. Add a new address to continue.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {addresses.map((addr) => {
                                        const Icon = addressTypeIcons[addr.type];
                                        return (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id
                                                            ? "border-primary bg-primary"
                                                            : "border-gray-300"
                                                            }`}
                                                    >
                                                        {selectedAddressId === addr.id && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium">{addr.name}</span>
                                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                                                <Icon className="w-3 h-3" />
                                                                {addr.type}
                                                            </span>
                                                            {addr.isDefault && (
                                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {addr.address}
                                                            {addr.landmark && `, ${addr.landmark}`}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {addr.city}, {addr.state} - {addr.pincode}
                                                        </p>
                                                        <p className="text-sm mt-1">📞 {addr.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold">Payment Method</h2>
                            </div>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "COD"
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD"
                                                ? "border-primary bg-primary"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {paymentMethod === "COD" && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium">Cash on Delivery</span>
                                            <p className="text-sm text-muted-foreground">
                                                Pay when your order arrives
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod("RAZORPAY")}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "RAZORPAY"
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "RAZORPAY"
                                                ? "border-primary bg-primary"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {paymentMethod === "RAZORPAY" && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium">Pay Online</span>
                                            <p className="text-sm text-muted-foreground">
                                                Credit/Debit Card, UPI, Net Banking
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                                {items.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.variantId}`}
                                        className="flex gap-3"
                                    >
                                        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-1">
                                                {item.name}
                                            </p>
                                            {item.color && (
                                                <p className="text-xs text-muted-foreground">
                                                    Color: {item.color}
                                                </p>
                                            )}
                                            <p className="text-sm">
                                                {formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Coupon */}
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="font-medium text-green-700">
                                            {appliedCoupon}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveCoupon}
                                        className="text-red-500 hover:text-red-600 h-auto p-1"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2 mb-4">
                                    <Input
                                        placeholder="Coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={handleApplyCoupon}>
                                        Apply
                                    </Button>
                                </div>
                            )}

                            {/* Totals */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(shipping)
                                        )}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-lg font-bold mb-6">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={submitting || !selectedAddressId}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : paymentMethod === "COD" ? (
                                    "Place Order"
                                ) : (
                                    "Pay Now"
                                )}
                            </Button>

                            {/* Trust Badges */}
                            <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground space-y-1">
                                <p className="flex items-center justify-center gap-1">
                                    <Truck className="w-3 h-3" /> Free shipping on orders above
                                    ₹999
                                </p>
                                <p>🔒 Secure checkout • 7 days return</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
