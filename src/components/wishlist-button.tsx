"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface WishlistButtonProps {
    productId: string;
    variant?: "default" | "icon" | "full";
    className?: string;
}

export function WishlistButton({ productId, variant = "default", className }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlistStore();
    const { data: session } = useSession();
    const isAdded = isInWishlist(productId);
    const [isLoading, setIsLoading] = useState(false);

    // Initial fetch on mount if logged in
    useEffect(() => {
        if (session?.user) {
            fetchWishlist();
        }
    }, [session, fetchWishlist]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a card link
        e.stopPropagation();

        if (!session) {
            toast.error("Please login to add to wishlist");
            return;
        }

        setIsLoading(true);
        await toggleWishlist(productId);
        setIsLoading(false);
    };

    if (variant === "icon") {
        return (
            <Button
                variant="ghost"
                size="icon"
                className={cn("rounded-full hover:bg-gray-100", className)}
                onClick={handleToggle}
                disabled={isLoading}
            >
                <Heart
                    className={cn(
                        "w-5 h-5 transition-colors",
                        isAdded ? "fill-red-500 text-red-500" : "text-gray-600"
                    )}
                />
            </Button>
        );
    }

    if (variant === "full") {
        return (
            <Button
                variant="outline"
                className={cn("w-full gap-2", className)}
                onClick={handleToggle}
                disabled={isLoading}
            >
                <Heart
                    className={cn(
                        "w-4 h-4 transition-colors",
                        isAdded ? "fill-red-500 text-red-500" : ""
                    )}
                />
                {isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("gap-2", className)}
            onClick={handleToggle}
            disabled={isLoading}
        >
            <Heart
                className={cn(
                    "w-4 h-4 transition-colors",
                    isAdded ? "fill-red-500 text-red-500" : ""
                )}
            />
            {isAdded ? "Saved" : "Save"}
        </Button>
    );
}
