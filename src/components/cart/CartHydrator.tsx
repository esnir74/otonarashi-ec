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
  const syncFromServer = useCartStore((s) => s.syncFromServer);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const applySnapshot = () => {
      if (cancelled) return;
      syncFromServer({
        items: initialSnapshot.items,
        updatedAt: initialSnapshot.updatedAt,
      });
    };

    if (useCartStore.persist.hasHydrated?.()) {
      applySnapshot();
    } else {
      unsubscribe = useCartStore.persist.onFinishHydration?.(() => {
        applySnapshot();
      });
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [initialSnapshot, syncFromServer]);

  return null;
}
