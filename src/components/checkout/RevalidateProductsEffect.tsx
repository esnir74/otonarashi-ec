"use client";

import { useEffect, useRef } from "react";

type Props = {
  trigger?: boolean;
};

export function RevalidateProductsEffect({ trigger = true }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;
    void fetch("/api/revalidate/products", {
      method: "POST",
      cache: "no-store",
    }).catch((error) => {
      console.error("[RevalidateProductsEffect] failed", error);
      firedRef.current = false;
    });
  }, [trigger]);

  return null;
}

export default RevalidateProductsEffect;
