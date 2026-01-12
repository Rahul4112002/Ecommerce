import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

interface WishlistItem {
    id: string; // Product Id is generally better for client check
    productId: string;
}

interface WishlistStore {
    items: string[]; // Store Product IDs
    isLoading: boolean;
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    (set, get) => ({
        items: [],
        isLoading: false,

        fetchWishlist: async () => {
            set({ isLoading: true });
            try {
                const response = await fetch("/api/wishlist");
                if (response.ok) {
                    const data = await response.json();
                    // Extract product IDs
                    const productIds = data.items.map((item: any) => item.product.id);
                    set({ items: productIds });
                }
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                set({ isLoading: false });
            }
        },

        toggleWishlist: async (productId: string) => {
            const isAdded = get().items.includes(productId);

            // Optimistic update
            if (isAdded) {
                set({ items: get().items.filter(id => id !== productId) });
            } else {
                set({ items: [...get().items, productId] });
            }

            try {
                const response = await fetch("/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId }),
                });

                if (!response.ok) {
                    // Revert on failure
                    if (isAdded) {
                        set({ items: [...get().items, productId] });
                    } else {
                        set({ items: get().items.filter(id => id !== productId) });
                    }
                    if (response.status === 401) {
                        toast.error("Please login to use wishlist");
                    } else {
                        toast.error("Failed to update wishlist");
                    }
                } else {
                    const data = await response.json();
                    toast.success(data.message);
                }
            } catch (error) {
                // Revert
                if (isAdded) {
                    set({ items: [...get().items, productId] });
                } else {
                    set({ items: get().items.filter(id => id !== productId) });
                }
                toast.error("Something went wrong");
            }
        },

        isInWishlist: (productId: string) => {
            return get().items.includes(productId);
        }
    })
);
