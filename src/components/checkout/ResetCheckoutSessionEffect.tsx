"use client";

import { useEffect, useRef } from "react";

type Props = {
  trigger?: boolean;
};

export function ResetCheckoutSessionEffect({ trigger = true }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;
    void fetch("/api/checkout/session/clear", {
      method: "POST",
      cache: "no-store",
    }).catch((error) => {
      console.error("[ResetCheckoutSessionEffect] failed", error);
      firedRef.current = false;
    });
  }, [trigger]);

  return null;
}

export default ResetCheckoutSessionEffect;
