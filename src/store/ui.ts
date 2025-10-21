import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      cartOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      toggleCart: () => set({ cartOpen: !get().cartOpen }),
      menuOpen: false,
      openMenu: () => set({ menuOpen: true }),
      closeMenu: () => set({ menuOpen: false }),
      toggleMenu: () => set({ menuOpen: !get().menuOpen }),
    }),
    {
      name: "ui-store",
      partialize: (s) => ({
        /* cartOpen は永続化しない */
      }),
    }
  )
);
