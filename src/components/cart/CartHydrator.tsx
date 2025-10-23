// components/cart/CartHydrator.tsx (Client Component)
"use client";
import type { CartSnapshot } from "@/lib/cartCookie";
import { useCartStore } from "@/store/cart";
import { useEffect, useRef } from "react";

export default function CartHydrator({
  initialSnapshot,
}: {
  initialSnapshot: CartSnapshot;
}) {
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const lastSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const applySnapshot = () => {
      if (cancelled) return;
      syncFromServer({
        items: initialSnapshot.items,
        updatedAt: initialSnapshot.updatedAt,
      });
      lastSignatureRef.current = signature(initialSnapshot);
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

  useEffect(() => {
    async function refetch() {
      try {
        const res = await fetch("/api/cart/snapshot", {
          cache: "no-store",
          signal: AbortSignal.timeout(3000), // 3秒でタイムアウト
        });
        if (!res.ok) return;
        const snap = (await res.json()) as CartSnapshot;
        const sig = signature(snap);
        if (sig !== lastSignatureRef.current) {
          syncFromServer({ items: snap.items, updatedAt: snap.updatedAt });
          lastSignatureRef.current = sig;
        }
      } catch {
        // フォーカス時の再取得失敗は無視（非致命的）
      }
    }

    const handleFocus = () => {
      void refetch();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [syncFromServer]);

  return null;
}

function signature(snapshot: CartSnapshot) {
  return `${snapshot.updatedAt}:${snapshot.items
    .map((item) => item.id)
    .join("|")}`;
}
