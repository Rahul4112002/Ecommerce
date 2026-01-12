"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteCouponButtonProps {
  couponId: string;
  couponCode: string;
}

export function DeleteCouponButton({ couponId, couponCode }: DeleteCouponButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete coupon");
      }

      toast.success("Coupon deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        className="text-red-600"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the coupon &quot;{couponCode}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
