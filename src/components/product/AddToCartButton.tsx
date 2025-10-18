"use client";

import { addToCartServer } from "@/app/actions/cart";
import { CartItem, useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";

export default function AddToCartButton({ item }: { item: CartItem }) {
  const addLocal = useCartStore((s) => s.addItem);
  const alreadyInCart = useCartStore((s) =>
    s.items.some((x) => x.id === item.id)
  );
  const openCart = useUIStore((s) => s.openCart);

  const addToCart = async (item: CartItem) => {
    if (alreadyInCart) {
      openCart();
      return;
    }
    const res = await addToCartServer(item); // ✅ サーバで在庫確認＋Cookie更新
    if (res.ok) addLocal(item); // ✅ ローカルStoreも同期
    openCart();
  };

  return (
    <div className="space-y-2">
      <button
        className="px-5 py-3 bg-sumi text-white rounded-md hover:opacity-90 transition disabled:opacity-60"
        onClick={() => void addToCart(item)}
      >
        {alreadyInCart ? "カートを見る" : "Add to cart"}
      </button>
      {alreadyInCart && (
        <p className="text-sm text-neutral-600">カートに追加済です</p>
      )}
    </div>
  );
}
