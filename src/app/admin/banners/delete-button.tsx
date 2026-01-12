"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteButtonProps {
  bannerId: string;
}

export function DeleteButton({ bannerId }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      toast.success("Banner deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
