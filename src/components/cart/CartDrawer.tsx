// components/cart/CartDrawer.tsx
"use client";

import {
  getProductTranslationsServer,
  removeFromCartServer,
  updateCartItemsServer,
} from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type TranslatedItem = {
  id: string;
  name: string;
  price: number;
  lang: string;
};

type CartItemUpdate = {
  id: string;
  name: string;
  lang: string;
};

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
  const updateItemName = useCartStore((s) => s.updateItemName);
  const total = useCartStore((s) => s.total());

  const [agreed, setAgreed] = useState(true); // MGG 風チェック。必要なら必須にしてもOK
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const isEmpty = items.length === 0;

  // 翻訳済みアイテム（現在の言語に合わせた商品名）
  const [translatedItems, setTranslatedItems] =
    useState<TranslatedItem[]>(items);

  const totalText = useMemo(() => fmtJPY(total), [total]);

  // 言語が異なる商品の翻訳を取得
  useEffect(() => {
    if (!open || items.length === 0) {
      setTranslatedItems(items);
      return;
    }

    // 現在の言語と異なる商品のIDを収集
    const needsTranslation = items.filter((item) => item.lang !== lang);

    if (needsTranslation.length === 0) {
      // 全て同じ言語ならそのまま
      setTranslatedItems(items);
      return;
    }

    // Server Action経由で翻訳を取得
    const fetchTranslations = async () => {
      try {
        const productIds = needsTranslation.map((item) => item.id);
        const translations = await getProductTranslationsServer(
          productIds,
          lang as "ja" | "en" | "zh"
        );

        // 翻訳情報を収集
        const updatesToServer: CartItemUpdate[] = [];

        needsTranslation.forEach((item) => {
          const translatedName = translations[item.id];
          if (translatedName) {
            updatesToServer.push({
              id: item.id,
              name: translatedName,
              lang,
            });
          }
        });

        // 先にCookie更新（サーバー側）
        if (updatesToServer.length > 0) {
          const serverResult = await updateCartItemsServer(updatesToServer);

          // サーバー更新成功後、ローカルストアも更新
          if (serverResult.ok) {
            updatesToServer.forEach((update) => {
              updateItemName(update.id, update.name, update.lang);
            });
          }
        }

        // 表示用に更新されたアイテムをセット
        const updated = items.map((item) => {
          if (item.lang === lang) {
            return item;
          }
          return {
            ...item,
            name: translations[item.id] || item.name,
          };
        });

        setTranslatedItems(updated);
      } catch (error) {
        console.error("Translation fetch error:", error);
        setTranslatedItems(items);
      }
    };

    void fetchTranslations();
  }, [open, items, lang]);

  // コンテンツの段階的表示：ドロワーが開いたら少し遅延して中身を表示
  useEffect(() => {
    if (open) {
      // ドロワーのスライドアニメーション後に中身を表示
      const timer = setTimeout(() => setShowContent(true), 400);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open]);

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 bg-white/95 backdrop-blur-md border-l border-neutral-200 shadow-xl flex flex-col animate-drawer-slide-in"
      >
        {/* Header - Fixed */}
        <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
          <SheetTitle
            className="text-2xl font-medium"
            style={{
              opacity: showContent ? 1 : 0,
              transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Your basket
          </SheetTitle>
        </SheetHeader>

        <Separator className="shrink-0" />

        {/* Scrollable product area */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-6 space-y-6">
            {isEmpty ? (
              <p
                className="text-sm text-neutral-500"
                style={{
                  opacity: showContent ? 1 : 0,
                  transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                カートは空です。
              </p>
            ) : (
              translatedItems.map((it, idx) => (
                <div
                  key={it.id}
                  className="space-y-4"
                  style={{
                    opacity: showContent ? 1 : 0,
                    transform: showContent
                      ? "translateY(0)"
                      : "translateY(12px)",
                    transition: `opacity 200ms cubic-bezier(0.16, 1, 0.3, 1) ${
                      idx * 80
                    }ms, transform 200ms cubic-bezier(0.16, 1, 0.3, 1) ${
                      idx * 80
                    }ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* サムネ（プレースホルダ） */}
                    <div className="h-20 w-20 shrink-0 rounded bg-neutral-100 border border-neutral-200" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-[15px] font-medium leading-tight">
                        {it.name}
                      </div>
                      <div className="mt-2 text-[15px] font-semibold">
                        {fmtJPY(it.price)}
                      </div>
                      {/* 数量は一点物なので固定1。UIだけMGG風にラインを表示 */}
                      <div className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-2">
                          <span>1</span>
                          <span className="i-lucide-chevron-down h-4 w-4 opacity-60" />
                        </div>
                        <button
                          onClick={() => void handleRemove(it.id)}
                          className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
                          disabled={removingId === it.id}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator className="shrink-0" />

        {/* Footer - Fixed */}
        <div
          className="px-6 py-6 space-y-4 shrink-0"
          style={{
            opacity: showContent ? 1 : 0,
            transition: `opacity 300ms cubic-bezier(0.16, 1, 0.3, 1) ${
              translatedItems.length * 80 + 100
            }ms`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">{totalText}</span>
          </div>

          <p className="text-[13px] text-neutral-500">
            Shipping is calculated at checkout.
          </p>

          <label className="flex items-start gap-2.5 text-[13px] text-neutral-700 leading-relaxed">
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

          <Button
            className="w-full h-12 text-base bg-[#23303B] hover:bg-[#1B2630] text-white"
            disabled={isEmpty || !agreed}
            onClick={() => useUIStore.getState().closeCart()}
          >
            <Link href={`${base}/checkout`}>Checkout</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
