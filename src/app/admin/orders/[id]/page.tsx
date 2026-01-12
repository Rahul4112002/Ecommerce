import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck } from "lucide-react";
import { format } from "date-fns";
import { OrderStatusSelect } from "../status-select";

async function getOrder(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: {
          product: {
            include: { images: { take: 1 } },
          },
        },
      },
      address: true,
      coupon: true,
    },
  });
}

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {format(order.createdAt, "PPP 'at' p")}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                {order.items.length} item(s) in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg bg-gray-50"
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-white">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.variant}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{item.price.toNumber().toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p className="text-muted-foreground">{order.address.phone}</p>
                  <p className="text-muted-foreground">
                    {order.address.addressLine1}
                  </p>
                  {order.address.addressLine2 && (
                    <p className="text-muted-foreground">
                      {order.address.addressLine2}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.user.name || "Guest"}</p>
              <p className="text-sm text-muted-foreground">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-sm text-muted-foreground">{order.user.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="secondary"
                  className={paymentStatusColors[order.paymentStatus]}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm">{order.paymentId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toNumber().toLocaleString("en-IN")}</span>
              </div>
              {order.discount.toNumber() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toNumber().toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.coupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coupon</span>
                  <Badge variant="outline">{order.coupon.code}</Badge>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping.toNumber() === 0
                    ? "Free"
                    : `₹${order.shipping.toNumber().toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{order.tax.toNumber().toLocaleString("en-IN")}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.total.toNumber().toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono">{order.trackingNumber}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
