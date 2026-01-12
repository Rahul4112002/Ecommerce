"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RefundButtonProps {
    orderId: string;
}

export function RefundButton({ orderId }: RefundButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRefund = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to refund order");
            }

            toast.success("Order refunded successfully");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Refund Order
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the order as CANCELLED and payment as REFUNDED.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRefund}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Refund
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
