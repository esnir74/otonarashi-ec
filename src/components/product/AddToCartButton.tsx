"use client";

import { addToCartServer } from "@/app/actions/cart";
import { CartItem, useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useTransition } from "react";

type Props = {
  item: CartItem;
  /** 売切/ComingSoonなどで無効化したい場合に使用 */
  disabled?: boolean;
  /** ボタン文言を差し替えたい場合に使用（例: "発売前です"） */
  label?: string;
};

export default function AddToCartButton({ item, disabled, label }: Props) {
  const addLocal = useCartStore((s) => s.addItem);
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
    if (res.ok) addLocal(it); // ローカルStore同期
    openCart();
  };

  const isDisabled = disabled || isPending;
  const text = alreadyInCart ? "カートを見る" : label ?? "Add to cart";

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
        <p className="text-sm text-neutral-600">
          この商品はカートに入っています
        </p>
      )}
    </div>
  );
}
