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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Ticket } from "lucide-react";
import { format } from "date-fns";
import { DeleteCouponButton } from "./delete-button";
import { CopyCodeButton } from "./copy-button";

async function getCoupons() {
  return db.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
    },
  });
}

export default async function CouponsPage() {
  const coupons = await getCoupons();

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive && new Date(c.endDate) > new Date()).length,
    expired: coupons.filter((c) => new Date(c.endDate) <= new Date()).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Coupons</h1>
          <p className="text-gray-400">
            Manage discount coupons for your store
          </p>
        </div>
        <Button className="bg-gold text-black hover:bg-gold/90" asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Coupon
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <p className="text-sm text-gray-400">Total Coupons</p>
              </div>
              <Ticket className="h-8 w-8 text-gold/60" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <p className="text-sm text-gray-400">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-400">{stats.expired}</div>
            <p className="text-sm text-gray-400">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Coupons</CardTitle>
          <CardDescription className="text-gray-400">
            Create and manage discount coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Code</TableHead>
                  <TableHead className="text-gray-400">Discount</TableHead>
                  <TableHead className="text-gray-400">Min. Purchase</TableHead>
                  <TableHead className="text-gray-400">Usage</TableHead>
                  <TableHead className="text-gray-400">Valid Until</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={7} className="text-center py-8">
                      <Ticket className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No coupons found</p>
                      <Button className="mt-4 bg-gold text-black hover:bg-gold/90" asChild>
                        <Link href="/admin/coupons/new">Create your first coupon</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired = new Date(coupon.endDate) <= new Date();
                    const isActive = coupon.isActive && !isExpired;

                    return (
                      <TableRow key={coupon.id} className="border-gray-800 hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-800 px-2 py-1 rounded font-mono text-sm text-gold">
                              {coupon.code}
                            </code>
                            <CopyCodeButton code={coupon.code} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {coupon.discountType === "PERCENTAGE"
                                ? `${coupon.discountValue}%`
                                : `₹${coupon.discountValue.toNumber().toLocaleString("en-IN")}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {coupon.discountType === "PERCENTAGE" ? "Percentage" : "Fixed"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {coupon.minPurchase
                            ? `₹${coupon.minPurchase.toNumber().toLocaleString("en-IN")}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {coupon.usedCount} / {coupon.usageLimit || "∞"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {format(coupon.endDate, "PP")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              isActive
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : isExpired
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            }
                          >
                            {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                              <DropdownMenuItem asChild className="hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                                <Link href={`/admin/coupons/${coupon.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DeleteCouponButton couponId={coupon.id} couponCode={coupon.code} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {coupons.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No coupons found</p>
              </div>
            ) : (
              coupons.map((coupon) => {
                const isExpired = new Date(coupon.endDate) <= new Date();
                const isActive = coupon.isActive && !isExpired;

                return (
                  <div key={coupon.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-800 px-3 py-1 rounded font-mono text-gold">
                        {coupon.code}
                      </code>
                      <Badge
                        className={
                          isActive
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : isExpired
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-white font-medium">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue.toNumber().toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Valid Until</span>
                      <span className="text-gray-300">{format(coupon.endDate, "PP")}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/admin/coupons/${coupon.id}/edit`}
                        className="flex-1 text-center py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 text-sm"
                      >
                        Edit
                      </Link>
                      <CopyCodeButton code={coupon.code} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
