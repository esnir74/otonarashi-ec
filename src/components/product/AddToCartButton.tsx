"use client";

import { addToCartServer } from "@/app/actions/cart";
import { CartItem, useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

type Props = {
  item: CartItem;
  /** 売切/ComingSoonなどで無効化したい場合に使用 */
  disabled?: boolean;
  /** ボタン文言を差し替えたい場合に使用（例: "発売前です"） */
  label?: string;
};

export default function AddToCartButton({ item, disabled, label }: Props) {
  const t = useTranslations("product");
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const alreadyInCart = useCartStore((s) =>
    s.items.some((x) => x.id === item.id)
  );
  const openCart = useUIStore((s) => s.openCart);
  const [isPending, startTransition] = useTransition();

  const addToCart = async (it: CartItem) => {
    console.log("[AddToCart] Start addToCart", { item: it, alreadyInCart });

    if (alreadyInCart) {
      console.log("[AddToCart] Already in cart, opening drawer");
      openCart();
      return;
    }

    console.log("[AddToCart] Calling addToCartServer");
    const res = await addToCartServer(it); // 在庫確認＋Cookie更新（サーバ）
    console.log("[AddToCart] Server response:", res);

    syncFromServer(res.snapshot);

    if (!res.ok) {
      console.warn("[AddToCart] Server rejected add", res.reason);
    }

    console.log("[AddToCart] Opening cart drawer after sync");
    openCart();
  };

  const isDisabled = disabled || isPending;
  const text = alreadyInCart ? t("viewCart") : label ?? t("addToCart");

  return (
    <div className="space-y-2">
      <button
        className={[
          "w-full rounded-xl px-5 py-3 font-medium tracking-wide transition",
          "bg-slate-900 text-white hover:opacity-90",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-sm hover:shadow",
        ].join(" ")}
        disabled={isDisabled}
        onClick={() => startTransition(() => void addToCart(item))}
      >
        {text}
      </button>

      {alreadyInCart && (
        <p className="text-sm text-neutral-600">{t("inCartMessage")}</p>
      )}
    </div>
  );
}
