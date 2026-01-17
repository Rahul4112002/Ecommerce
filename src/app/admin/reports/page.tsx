import { db } from "@/lib/db";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

async function getReportsData() {
  const today = new Date();
  const last30Days = subDays(today, 30);
  const last60Days = subDays(today, 60);

  // Revenue data
  const currentPeriodOrders = await db.order.findMany({
    where: {
      createdAt: { gte: last30Days },
      status: { not: "CANCELLED" },
    },
    select: { total: true, createdAt: true },
  });

  const previousPeriodOrders = await db.order.findMany({
    where: {
      createdAt: { gte: last60Days, lt: last30Days },
      status: { not: "CANCELLED" },
    },
    select: { total: true },
  });

  const currentRevenue = currentPeriodOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );
  const previousRevenue = previousPeriodOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );
  const revenueChange =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  // Orders count
  const currentOrderCount = currentPeriodOrders.length;
  const previousOrderCount = previousPeriodOrders.length;
  const ordersChange =
    previousOrderCount > 0
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100
      : 0;

  // Average order value
  const currentAOV =
    currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;
  const previousAOV =
    previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;
  const aovChange =
    previousAOV > 0 ? ((currentAOV - previousAOV) / previousAOV) * 100 : 0;

  // New customers
  const newCustomers = await db.user.count({
    where: { createdAt: { gte: last30Days } },
  });
  const previousNewCustomers = await db.user.count({
    where: { createdAt: { gte: last60Days, lt: last30Days } },
  });
  const customersChange =
    previousNewCustomers > 0
      ? ((newCustomers - previousNewCustomers) / previousNewCustomers) * 100
      : 0;

  // Daily revenue for chart (last 7 days)
  const dailyRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: "CANCELLED" },
      },
      select: { total: true },
    });
    dailyRevenue.push({
      date: format(date, "MMM d"),
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
      orders: dayOrders.length,
    });
  }

  // Top selling products
  const topProducts = await db.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, price: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const topProductsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        select: { name: true, images: true },
      });
      return {
        ...item,
        name: product?.name || "Unknown Product",
        image: product?.images?.[0]?.url || null,
        revenue: item._sum.price || 0,
        quantity: item._sum.quantity || 0,
      };
    })
  );

  // Orders by status
  const ordersByStatus = await db.order.groupBy({
    by: ["status"],
    _count: true,
  });

  // Category performance
  const categoryPerformance = await db.orderItem.findMany({
    include: {
      product: {
        include: { category: true },
      },
    },
    where: {
      order: {
        createdAt: { gte: last30Days },
        status: { not: "CANCELLED" },
      },
    },
  });

  const categoryStats = categoryPerformance.reduce((acc, item) => {
    const categoryName = item.product.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = { revenue: 0, quantity: 0 };
    }
    acc[categoryName].revenue += Number(item.price) * item.quantity;
    acc[categoryName].quantity += item.quantity;
    return acc;
  }, {} as Record<string, { revenue: number; quantity: number }>);

  return {
    currentRevenue,
    revenueChange,
    currentOrderCount,
    ordersChange,
    currentAOV,
    aovChange,
    newCustomers,
    customersChange,
    dailyRevenue,
    topProducts: topProductsWithDetails,
    ordersByStatus,
    categoryStats: Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      ...stats,
    })),
  };
}

export default async function ReportsPage() {
  const data = await getReportsData();

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${data.currentRevenue.toLocaleString()}`,
      change: data.revenueChange,
      icon: IndianRupee,
      color: "bg-green-500/20 text-green-400",
    },
    {
      title: "Total Orders",
      value: data.currentOrderCount,
      change: data.ordersChange,
      icon: ShoppingCart,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      title: "Avg. Order Value",
      value: `₹${data.currentAOV.toFixed(0)}`,
      change: data.aovChange,
      icon: Package,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      title: "New Customers",
      value: data.newCustomers,
      change: data.customersChange,
      icon: Users,
      color: "bg-gold/20 text-gold",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-400",
    PROCESSING: "bg-blue-400",
    SHIPPED: "bg-purple-400",
    DELIVERED: "bg-green-400",
    CANCELLED: "bg-red-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-gray-400 mt-1">Last 30 days performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {stat.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(stat.change).toFixed(1)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Daily Revenue (Last 7 Days)
          </h2>
          <div className="space-y-4">
            {data.dailyRevenue.map((day) => {
              const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue), 1);
              const percentage = (day.revenue / maxRevenue) * 100;
              return (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{day.date}</span>
                    <span className="font-medium text-white">
                      ₹{day.revenue.toLocaleString()} ({day.orders} orders)
                    </span>
                  </div>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Orders by Status</h2>
          {data.ordersByStatus.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {data.ordersByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status.status] || "bg-gray-500"}`} />
                    <span className="text-gray-300 capitalize">{status.status.toLowerCase()}</span>
                  </div>
                  <span className="font-semibold text-white">{status._count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Selling Products</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center gap-4">
                  <div className="text-lg font-bold text-gray-500 w-6">#{index + 1}</div>
                  <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gold">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Performance */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Category Performance</h2>
          {data.categoryStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {data.categoryStats
                .sort((a, b) => b.revenue - a.revenue)
                .map((category) => {
                  const maxRevenue = Math.max(...data.categoryStats.map((c) => c.revenue), 1);
                  const percentage = (category.revenue / maxRevenue) * 100;
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-white">{category.name}</span>
                        <span className="text-gray-400">
                          ₹{category.revenue.toLocaleString()} • {category.quantity} items
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold via-gold/80 to-gold/60 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
