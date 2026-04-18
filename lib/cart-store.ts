"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Phone } from "@/types";

interface CartState {
  items: Phone[];
  addItem: (phone: Phone) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (phone) => {
        if (!get().isInCart(phone.id)) {
          set((state) => ({ items: [...state.items, phone] }));
        }
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== id) })),
      clearCart: () => set({ items: [] }),
      isInCart: (id) => get().items.some((p) => p.id === id),
    }),
    { name: "vv-phone-cart" }
  )
);
