// store/cart.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number; // 日本円
  lang: string; // 追加時の言語
  imageUrl: string | null;
  imageBlur: string | null;
};

export type CartSnapshot = {
  items: CartItem[];
  updatedAt: number;
};

type CartState = {
  items: CartItem[];
  lastServerSync: number;

  // actions
  addItem: (item: CartItem) => boolean; // 一点物:追加できたら true / 既存で追加しなかったら false
  removeItem: (id: string) => void;
  clearCart: () => void;
  replaceItems: (
    items: CartItem[],
    options?: { source?: "server" | "client"; updatedAt?: number }
  ) => void;
  syncFromServer: (snapshot: CartSnapshot) => void;
  updateItemName: (id: string, name: string, lang: string) => void;

  // selectors
  total: () => number; // 合計金額(円)
  count: () => number; // 商品点数
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastServerSync: 0,

      // 一点物:すでにカートにある場合は追加しない
      addItem: (item) => {
        const exists = get().items.some((x) => x.id === item.id);
        if (exists) return false;
        set((s) => ({
          items: [
            ...s.items,
            {
              ...item,
              imageUrl: item.imageUrl ?? null,
              imageBlur: item.imageBlur ?? null,
            },
          ],
        }));
        return true;
      },

      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((x) => x.id !== id),
        })),

      clearCart: () => set({ items: [] }),
      replaceItems: (items, options) =>
        set((state) => {
          const isServer = options?.source === "server";
          const incomingUpdatedAt =
            isServer && typeof options?.updatedAt === "number"
              ? options.updatedAt
              : undefined;

          if (
            isServer &&
            typeof incomingUpdatedAt === "number" &&
            incomingUpdatedAt < state.lastServerSync
          ) {
            return state;
          }

          const normalizedItems = items.map((item) => ({
            ...item,
            imageUrl: item.imageUrl ?? null,
            imageBlur: item.imageBlur ?? null,
          }));

          return {
            items: normalizedItems,
            lastServerSync: isServer
              ? incomingUpdatedAt ?? state.lastServerSync
              : state.lastServerSync,
          };
        }),
      syncFromServer: (snapshot) => {
        get().replaceItems(snapshot.items, {
          source: "server",
          updatedAt: snapshot.updatedAt,
        });
      },
      updateItemName: (id, name, lang) =>
        set((state) => ({
          items: state.items.map((item) =>
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
        lastServerSync: state.lastServerSync,
      }),
      version: 2,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("[useCartStore] Failed to rehydrate state", error);
        }
      },
    }
  )
);
