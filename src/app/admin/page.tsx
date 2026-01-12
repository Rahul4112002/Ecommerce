import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

async function getDashboardStats() {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      recentOrders,
      lowStockProducts,
      recentUsers,
    ] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] } },
      }),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      db.product.findMany({
        where: { stock: { lte: 10 } },
        take: 5,
        orderBy: { stock: "asc" },
        select: { id: true, name: true, stock: true, slug: true },
      }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true, image: true },
      }),
    ]);

    // Calculate month-over-month growth (mock data for demo)
    const lastMonthOrders = await db.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total?.toNumber() || 0,
      pendingOrders,
      recentOrders,
      lowStockProducts,
      recentUsers,
      orderGrowth: lastMonthOrders > 0 ? 12.5 : 0, // Mock growth percentage
      isError: false,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      recentOrders: [],
      lowStockProducts: [],
      recentUsers: [],
      orderGrowth: 0,
      isError: true,
    };
  }
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

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  if (stats.isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-dashed bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Database Connection Error
        </h2>
        <p className="text-gray-500 max-w-md text-center">
          Could not connect to the database server. Please check your internet connection, database configuration, or restart the server.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/admin">Retry</Link>
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      description: "Total earnings",
      icon: IndianRupee,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: `${stats.lowStockProducts.length} low stock`,
      icon: Package,
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users",
      icon: Users,
      trend: "+15.3%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    stat.trendUp
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {stat.trendUp ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No orders yet
                </p>
              ) : (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          #{order.orderNumber}
                        </p>
                        <Badge
                          className={statusColors[order.status]}
                          variant="secondary"
                        >
                          {statusIcons[order.status]}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.user.name || order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{order.total.toNumber().toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(order.createdAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products running low on inventory</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStockProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  All products are well stocked! 🎉
                </p>
              ) : (
                stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.slug}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        product.stock <= 5
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {product.stock} left
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>New users who signed up</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 text-center"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <p className="font-medium mt-2 truncate w-full">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate w-full">
                    {user.email || "No email"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
