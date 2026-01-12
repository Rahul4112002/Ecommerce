import { CouponForm } from "../coupon-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Coupon</h1>
          <p className="text-muted-foreground">
            Create a new discount coupon for your store
          </p>
        </div>
      </div>

      <CouponForm />
    </div>
  );
}
