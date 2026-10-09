"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === line.productId);
          if (existing) {
            const newQty = Math.min(existing.quantity + qty, line.stock);
            return {
              items: state.items.map((i) =>
                i.productId === line.productId ? { ...i, quantity: newQty } : i
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity: Math.min(qty, line.stock) }] };
        });
      },
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.quantity * i.price, 0),
    }),
    { name: "mobilekade-cart" }
  )
);
