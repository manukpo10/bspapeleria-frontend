import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.itemId === item.itemId && i.type === item.type);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          });
        }
      },
      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        return Math.max(0, subtotal - discount);
      },
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'bs-cart-storage' }
  )
);
