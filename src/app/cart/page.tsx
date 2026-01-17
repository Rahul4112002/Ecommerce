"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore, CartItem } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/helpers";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Tag } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    // Simple coupon logic - can be extended with API
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
    toast.success("Coupon removed");
  };

  const handleWhatsAppOrder = () => {
    const itemsList = items
      .map((item) => `• ${item.name}${item.color ? ` (${item.color})` : ""} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
      .join("\n");

    const message = encodeURIComponent(
      `Hi! I'd like to place an order:\n\n` +
      `${itemsList}\n\n` +
      `Subtotal: ${formatPrice(subtotal)}\n` +
      `${discount > 0 ? `Discount: -${formatPrice(discount)}\n` : ""}` +
      `Shipping: ${shipping === 0 ? "FREE" : formatPrice(shipping)}\n` +
      `*Total: ${formatPrice(total)}*\n\n` +
      `Please confirm my order.`
    );

    window.open(`https://wa.me/918828489397?text=${message}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven&apos;t added any frames yet
        </p>
        <Button asChild size="lg">
          <Link href="/products">
            Start Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-card rounded-lg shadow-sm p-4 hidden md:grid grid-cols-12 gap-4 font-semibold text-sm text-muted-foreground border border-border">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            {items.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.variantId}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            {/* Clear Cart */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared");
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24 border border-border">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Have a coupon?</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-950/30 border border-green-800 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-700">{appliedCoupon}</span>
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
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Try: FIRST10, FLAT200
                </p>
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
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
                  <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(999 - subtotal)} more for free shipping
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50"
                  size="lg"
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                <p className="mb-2">🔒 Secure Checkout</p>
                <p>💳 COD Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  onRemove: (productId: string, variantId: string | undefined) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-12 md:col-span-6 flex gap-4">
          <div className="relative w-20 h-20 bg-background rounded-md overflow-hidden shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/products/${item.productId}`}
              className="font-medium hover:text-primary line-clamp-2"
            >
              {item.name}
            </Link>
            {item.color && (
              <p className="text-sm text-muted-foreground mt-1">Color: {item.color}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive p-0 h-auto mt-2 md:hidden"
              onClick={() => onRemove(item.productId, item.variantId)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>

        {/* Price */}
        <div className="col-span-4 md:col-span-2 text-center">
          <span className="md:hidden text-sm text-muted-foreground">Price: </span>
          {formatPrice(item.price)}
        </div>

        {/* Quantity */}
        <div className="col-span-4 md:col-span-2 flex justify-center">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="p-2 hover:bg-muted/50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 py-1 min-w-10 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="p-2 hover:bg-muted/50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="col-span-4 md:col-span-2 text-right">
          <span className="md:hidden text-sm text-muted-foreground">Total: </span>
          <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive ml-2 hidden md:inline-flex"
            onClick={() => onRemove(item.productId, item.variantId)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
