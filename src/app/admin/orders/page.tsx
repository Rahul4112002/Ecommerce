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
import { Eye, Clock, Package, Truck, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { OrderStatusSelect } from "./status-select";
import { ExportButton } from "./export-button";

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
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4" />,
  PROCESSING: <Package className="h-4 w-4" />,
  SHIPPED: <Truck className="h-4 w-4" />,
  DELIVERED: <CheckCircle className="h-4 w-4" />,
  CANCELLED: <XCircle className="h-4 w-4" />,
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PAID: "bg-green-500/20 text-green-400 border-green-500/30",
  FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400">
            Manage and track customer orders
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-sm text-gray-400">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <p className="text-sm text-gray-400">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">{stats.processing}</div>
            <p className="text-sm text-gray-400">Processing</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-400">{stats.shipped}</div>
            <p className="text-sm text-gray-400">Shipped</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 col-span-2 md:col-span-1">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">{stats.delivered}</div>
            <p className="text-sm text-gray-400">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Orders</CardTitle>
          <CardDescription className="text-gray-400">
            View and manage customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Order ID</TableHead>
                  <TableHead className="text-gray-400">Customer</TableHead>
                  <TableHead className="text-gray-400">Items</TableHead>
                  <TableHead className="text-gray-400">Total</TableHead>
                  <TableHead className="text-gray-400">Payment</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-4">
                        <ShoppingCart className="h-12 w-12 text-gray-600" />
                        <p className="text-gray-400">No orders yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <p className="font-medium text-white">#{order.orderNumber}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{order.user.name || "Guest"}</p>
                          <p className="text-sm text-gray-400">{order.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="truncate text-gray-300">
                            {order.items.map((item) => item.product.name).join(", ")}
                          </p>
                          <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gold">
                          ₹{order.total.toNumber().toLocaleString("en-IN")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[order.paymentStatus]}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-400">
                          {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800" asChild>
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
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <ShoppingCart className="h-12 w-12 text-gray-600" />
                <p className="text-gray-400">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-400">{order.user.name || order.user.email}</p>
                    </div>
                    <p className="font-bold text-gold">
                      ₹{order.total.toNumber().toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusColors[order.status]}>
                      {statusIcons[order.status]}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                    <Badge className={paymentStatusColors[order.paymentStatus]}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                    </p>
                    <Button variant="ghost" size="sm" className="text-gold hover:bg-gold/10" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
