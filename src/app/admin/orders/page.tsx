import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { OrderStatusSelect } from "./status-select";

async function getOrders() {
  return db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      address: true,
    },
  });
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4" />,
  PROCESSING: <Package className="h-4 w-4" />,
  SHIPPED: <Truck className="h-4 w-4" />,
  DELIVERED: <CheckCircle className="h-4 w-4" />,
  CANCELLED: <XCircle className="h-4 w-4" />,
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            <p className="text-sm text-muted-foreground">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            View and manage customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No orders yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user.name || "Guest"}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="truncate">
                          {order.items.map((item) => item.product.name).join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item(s)
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        ₹{order.total.toNumber().toLocaleString("en-IN")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={paymentStatusColors[order.paymentStatus]}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {formatDistanceToNow(order.createdAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
