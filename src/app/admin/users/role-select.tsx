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
import { Shield, User } from "lucide-react";

const roles = [
  { value: "USER", label: "Customer", icon: User },
  { value: "ADMIN", label: "Admin", icon: Shield },
];

interface UserRoleSelectProps {
  userId: string;
  currentRole: string;
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (newRole: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      setRole(newRole);
      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  const currentRoleData = roles.find((r) => r.value === role);

  return (
    <Select
      value={role}
      onValueChange={handleRoleChange}
      disabled={loading}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentRoleData && (
              <currentRoleData.icon className="h-4 w-4" />
            )}
            <span>{currentRoleData?.label || role}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {roles.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            <div className="flex items-center gap-2">
              <r.icon className="h-4 w-4" />
              <span>{r.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
