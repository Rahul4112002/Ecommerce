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

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  if (stats.isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Database Connection Error
        </h2>
        <p className="text-gray-400 max-w-md text-center">
          Could not connect to the database server. Please check your internet connection, database configuration, or restart the server.
        </p>
        <Button variant="outline" className="mt-6 border-gold text-gold hover:bg-gold/10" asChild>
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
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-gold/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    stat.trendUp
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
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
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-gray-400">Latest orders from your store</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gold/10" asChild>
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No orders yet
                </p>
              ) : (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white truncate">
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
                      <p className="text-sm text-gray-400 truncate">
                        {order.user.name || order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gold">
                        ₹{order.total.toNumber().toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">
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
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Low Stock Alert</CardTitle>
              <CardDescription className="text-gray-400">Products running low on inventory</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gold/10" asChild>
              <Link href="/admin/products">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.lowStockProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  All products are well stocked! 🎉
                </p>
              ) : (
                stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-sm text-gray-400">
                        SKU: {product.slug}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        product.stock <= 5
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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
        <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Users</CardTitle>
              <CardDescription className="text-gray-400">New users who signed up</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gold/10" asChild>
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
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-center hover:border-gold/30 transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg border border-gold/30">
                    {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <p className="font-medium mt-2 truncate w-full text-white">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate w-full">
                    {user.email || "No email"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
