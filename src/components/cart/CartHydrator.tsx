// components/cart/CartHydrator.tsx (Client Component)
"use client";
import type { CartSnapshot } from "@/lib/cartCookie";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";

export default function CartHydrator({
  initialSnapshot,
}: {
  initialSnapshot: CartSnapshot;
}) {
  const setAll = useCartStore((s) => s.clearCart); // 使い回し: まず空に
  const add = useCartStore((s) => s.addItem);

  useEffect(() => {
    // SSRの cookie スナップショットからクライアント store を同期
    setAll();
    for (const it of initialSnapshot.items) add(it);
  }, [initialSnapshot, setAll, add]);

  return null;
}
