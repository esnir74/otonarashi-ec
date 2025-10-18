// components/cart/CartDrawer.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  clearCartServer,
  removeFromCartServer,
} from "@/app/actions/cart";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const fmtJPY = (n: number) =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(
    n
  );

export default function CartDrawer() {
  const pathname = usePathname() || "/ja";
  const [, lang] = pathname.split("/");
  const base = `/${lang || "ja"}`;

  const open = useUIStore((s) => s.cartOpen);
  const onOpenChange = (v: boolean) =>
    v ? useUIStore.getState().openCart() : useUIStore.getState().closeCart();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total());

  const [agreed, setAgreed] = useState(true); // MGG 風チェック。必要なら必須にしてもOK
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const isEmpty = items.length === 0;

  const totalText = useMemo(() => fmtJPY(total), [total]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      const res = await removeFromCartServer(id);
      if (res.ok) {
        removeItem(id);
        return;
      }
      if (res.reason === "NOT_FOUND") {
        removeItem(id);
      }
    } catch {
      removeItem(id);
    } finally {
      setRemovingId((current) => (current === id ? null : current));
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      const res = await clearCartServer();
      if (res.ok) clearCart();
    } catch {
      clearCart();
    } finally {
      setClearing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 bg-white border-l border-neutral-200 shadow-xl"
      >
        <SheetHeader className="px-6 pt-6 pb-3">
          <SheetTitle className="text-[22px] font-semibold tracking-wide">
            Your basket
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <ScrollArea className="h-[calc(100dvh-240px)]">
          <div className="px-6 py-5 space-y-5">
            {isEmpty ? (
              <p className="text-sm text-neutral-500">カートは空です。</p>
            ) : (
              items.map((it) => (
                <div key={it.id} className="flex items-start gap-4">
                  {/* サムネ（プレースホルダ） */}
                  <div className="h-20 w-20 shrink-0 rounded-md bg-neutral-100 border border-neutral-200" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium leading-5">
                      {it.name}
                    </div>

                    {/* MGG風の薄いサブ情報 */}
                    <div className="mt-1 space-y-0.5 text-[13px] text-neutral-600">
                      <div>Colour: —</div>
                      <div>Size: —</div>
                    </div>

                    <div className="mt-2 text-[15px] font-semibold">
                      {fmtJPY(it.price)}
                    </div>

                    {/* 数量は一点物なので固定1。UIだけMGG風にラインを表示 */}
                    <div className="mt-3 flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2">
                        <span>1</span>
                        <span className="i-lucide-chevron-down h-4 w-4 opacity-60" />
                      </div>
                      <button
                        onClick={() => void handleRemove(it.id)}
                        className="text-neutral-600 hover:text-sumi underline underline-offset-2"
                        disabled={removingId === it.id}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-2 h-px w-full bg-neutral-200" />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* フッター（合計/規約/Checkout） */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-semibold">Total</span>
            <span className="text-[18px] font-semibold">{totalText}</span>
          </div>

          <p className="text-[13px] text-neutral-600">
            Shipping is calculated at checkout.
          </p>

          <label className="flex items-start gap-2 text-[13px] text-neutral-700 leading-5">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-neutral-300"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the <a className="underline">Shipping</a> and{" "}
              <a className="underline">Returns &amp; Refunds</a> policies, the{" "}
              <a className="underline">Terms &amp; Conditions of Sale</a>, and
              the <a className="underline">Privacy &amp; Cookies Policy</a>.
            </span>
          </label>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-1/3"
              onClick={() => void handleClear()}
              disabled={isEmpty || clearing}
            >
              クリア
            </Button>
            <Button
              asChild
              className="w-2/3 h-12 text-base bg-[#23303B] hover:bg-[#1B2630] text-white"
              disabled={isEmpty || !agreed}
              onClick={() => useUIStore.getState().closeCart()}
            >
              <Link href={`${base}/checkout`}>Checkout</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
