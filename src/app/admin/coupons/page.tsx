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
import { Plus, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">
            Manage discount coupons for your store
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Coupon
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-sm text-muted-foreground">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            Create and manage discount coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min. Purchase</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No coupons found</p>
                    <Button asChild className="mt-4">
                      <Link href="/admin/coupons/new">Create your first coupon</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = new Date(coupon.endDate) <= new Date();
                  const isActive = coupon.isActive && !isExpired;

                  return (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                            {coupon.code}
                          </code>
                          <CopyCodeButton code={coupon.code} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {coupon.discountType === "PERCENTAGE"
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue.toNumber().toLocaleString("en-IN")}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {coupon.discountType === "PERCENTAGE" ? "Percentage" : "Fixed"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.minPurchase
                          ? `₹${coupon.minPurchase.toNumber().toLocaleString("en-IN")}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{coupon.usedCount} / {coupon.usageLimit || "∞"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {format(coupon.endDate, "PP")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className={
                            isActive
                              ? "bg-green-100 text-green-700"
                              : isExpired
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/coupons/${coupon.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DeleteCouponButton
                              couponId={coupon.id}
                              couponCode={coupon.code}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
