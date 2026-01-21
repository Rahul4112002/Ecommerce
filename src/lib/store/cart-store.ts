import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LensOptions {
  lensType: string;
  lensPackage: string;
  prescriptionOption: string;
  prescriptionImage?: string;
  lensThickness: string;
  totalLensPrice: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  color?: string;
  quantity: number;
  lensOptions?: LensOptions;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string, variantId?: string, lensType?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number, lensType?: string) => void;
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
        // Check for existing item with same product, variant, AND lens options
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId &&
            i.variantId === item.variantId &&
            i.lensOptions?.lensType === item.lensOptions?.lensType &&
            i.lensOptions?.lensPackage === item.lensOptions?.lensPackage &&
            i.lensOptions?.lensThickness === item.lensOptions?.lensThickness
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId &&
                i.variantId === item.variantId &&
                i.lensOptions?.lensType === item.lensOptions?.lensType
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

      removeItem: (productId, variantId, lensType) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId &&
                (lensType ? item.lensOptions?.lensType === lensType : true)
              )
          ),
        });
      },

      updateQuantity: (productId, variantId, quantity, lensType) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, lensType);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId &&
              item.variantId === variantId &&
              (lensType ? item.lensOptions?.lensType === lensType : true)
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
        return get().items.reduce((total, item) => {
          const itemPrice = item.price + (item.lensOptions?.totalLensPrice || 0);
          return total + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
