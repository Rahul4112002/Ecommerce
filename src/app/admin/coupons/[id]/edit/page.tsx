import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CouponForm } from "../../coupon-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

async function getCoupon(id: string) {
  return db.coupon.findUnique({
    where: { id },
  });
}

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coupon = await getCoupon(id);

  if (!coupon) {
    notFound();
  }

  const initialData = {
    id: coupon.id,
    code: coupon.code,
    description: coupon.description || "",
    discountType: coupon.discountType as "PERCENTAGE" | "FIXED",
    discountValue: coupon.discountValue.toNumber(),
    minPurchase: coupon.minPurchase?.toNumber() ?? "",
    maxDiscount: coupon.maxDiscount?.toNumber() ?? "",
    usageLimit: coupon.usageLimit ?? "",
    startDate: format(coupon.startDate, "yyyy-MM-dd"),
    endDate: format(coupon.endDate, "yyyy-MM-dd"),
    isActive: coupon.isActive,
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Coupon</h1>
          <p className="text-muted-foreground">
            Update coupon: {coupon.code}
          </p>
        </div>
      </div>

      <CouponForm initialData={initialData} />
    </div>
  );
}
