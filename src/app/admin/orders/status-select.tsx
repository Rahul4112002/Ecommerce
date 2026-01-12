"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

const statuses = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-600" },
  { value: "PROCESSING", label: "Processing", icon: Package, color: "text-blue-600" },
  { value: "SHIPPED", label: "Shipped", icon: Truck, color: "text-purple-600" },
  { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "text-green-600" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-600" },
];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const currentStatusData = statuses.find((s) => s.value === status);

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentStatusData && (
              <currentStatusData.icon className={`h-4 w-4 ${currentStatusData.color}`} />
            )}
            <span>{currentStatusData?.label || status}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            <div className="flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span>{s.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
