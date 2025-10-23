"use client";

import { addToCartServer } from "@/app/actions/cart";
import { CartItem, useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

type Props = {
  item: CartItem;
  /** ボタン文言を差し替えたい場合に使用（例: "発売前です"） */
  state: "preRelease" | "inStock" | "outOfStock";
};

export default function AddToCartButton({ item, state }: Props) {
  const t = useTranslations("product");
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const alreadyInCart = useCartStore((s) =>
    s.items.some((x) => x.id === item.id)
  );
  const openCart = useUIStore((s) => s.openCart);
  const [isPending, startTransition] = useTransition();

  const addToCart = async (it: CartItem) => {
    if (alreadyInCart) {
      openCart();
      return;
    }

    const res = await addToCartServer(it); // 在庫確認＋Cookie更新（サーバ）
    syncFromServer(res.snapshot);
    openCart();
  };

  const isDisabled = state !== "inStock" || isPending;
  const text = {
    preRelease: "COMING SOON",
    outOfStock: t("outOfStock"),
    inStock: alreadyInCart ? t("viewCart") : t("addToCart"),
  }[state];

  const buttonClass = [
    "w-full px-5 py-3 font-medium tracking-widest transition-colors duration-300 text-sm",
  ];

  if (state === "preRelease") {
    buttonClass.push("border-2 border-amber-400 text-amber-400 cursor-not-allowed");
  } else {
    buttonClass.push(
      "border-2 border-black text-black",
      "hover:bg-black hover:text-white",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
    );
  }

  return (
    <div className="space-y-2">
      {alreadyInCart && state === "inStock" && (
        <p className="text-sm text-neutral-600">{t("inCartMessage")}</p>
      )}
      <button
        className={buttonClass.join(" ")}
        disabled={isDisabled}
        onClick={() => startTransition(() => void addToCart(item))}
      >
        {text}
      </button>
    </div>
  );
}
