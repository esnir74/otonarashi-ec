// store/cart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number; // 日本円
  lang: string; // 追加時の言語
};

type CartState = {
  items: CartItem[];

  // actions
  addItem: (item: CartItem) => boolean; // 一点物:追加できたら true / 既存で追加しなかったら false
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateItemName: (id: string, name: string, lang: string) => void; // 翻訳後の名前と言語を更新

  // selectors
  total: () => number; // 合計金額(円)
  count: () => number; // 商品点数
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // 一点物:すでにカートにある場合は追加しない
      addItem: (item) => {
        const exists = get().items.some((x) => x.id === item.id);
        if (exists) return false;
        set((s) => ({ items: [...s.items, item] }));
        return true;
      },

      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((x) => x.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      updateItemName: (id, name, lang) =>
        set((s) => ({
          items: s.items.map((item) =>
            item.id === id ? { ...item, name, lang } : item
          ),
        })),

      total: () => get().items.reduce((sum, it) => sum + it.price, 0),

      count: () => get().items.length,
    }),
    {
      name: "cart-v1",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
