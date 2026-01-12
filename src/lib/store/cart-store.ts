import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  color?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, id: crypto.randomUUID() }],
          });
        }
      },

      removeItem: (productId, variantId) => {
        set({ 
          items: get().items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ) 
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variantId === variantId 
              ? { ...item, quantity } 
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
