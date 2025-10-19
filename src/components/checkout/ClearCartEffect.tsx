"use client";

import { useCartStore } from "@/store/cart";
import { useEffect, useRef } from "react";

type Props = {
  trigger?: boolean;
};

export function ClearCartEffect({ trigger = true }: Props) {
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!trigger || clearedRef.current) return;
    try {
      useCartStore.getState().clearCart();
      clearedRef.current = true;
      console.log("[ClearCartEffect] Cart cleared");
    } catch (error) {
      console.error("[ClearCartEffect] failed to clear cart", error);
    }
  }, [trigger]);

  return null;
}

export default ClearCartEffect;
