// app/actions/cart.ts (server action)
"use server";
import { Locale } from "@/i18n/locales";
import {
  CartSnapItem,
  readCartSnapshot,
  writeCartSnapshot,
} from "@/lib/cartCookie";
import { createClient } from "@/lib/supabaseClient"; // 既存のサーバ側クライアント

type CartResult =
  | {
      ok: true;
      count: number;
      snapshot: { items: CartSnapItem[]; updatedAt: number };
    }
  | { ok: false; reason: string };

export async function addToCartServer(item: CartSnapItem): Promise<CartResult> {
  // 1) 在庫/公開の再検証（一点物なので存在チェックのみでもOK）
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, stock, status")
    .eq("id", item.id)
    .single();

  if (error || !data || (data.stock ?? 0) <= 0 || data.status !== "published") {
    return { ok: false as const, reason: "UNAVAILABLE" };
  }

  // 2) Cookie のスナップショット更新（重複禁止）
  const snap = await readCartSnapshot();
  if (!snap.items.some((x) => x.id === item.id)) {
    snap.items.push(item);
    snap.updatedAt = Date.now();
    await writeCartSnapshot(snap);
    return { ok: true as const, count: snap.items.length, snapshot: snap };
  } else {
    return { ok: false as const, reason: "DUPLICATE" };
  }
}

export async function removeFromCartServer(id: string): Promise<CartResult> {
  const snap = await readCartSnapshot();
  const newItems = snap.items.filter((x) => x.id !== id);
  if (newItems.length !== snap.items.length) {
    snap.items = newItems;
    snap.updatedAt = Date.now();
    await writeCartSnapshot(snap);
    return { ok: true as const, count: snap.items.length, snapshot: snap };
  }
  return { ok: false as const, reason: "NOT_FOUND" };
}

export async function clearCartServer(): Promise<CartResult> {
  const snap = await readCartSnapshot();
  snap.items = [];
  snap.updatedAt = Date.now();
  await writeCartSnapshot(snap);
  return { ok: true as const, count: 0, snapshot: snap };
}

type CartItemUpdate = {
  id: string;
  name: string;
  lang: string;
};

/**
 * カート内商品の名前と言語を一括更新（翻訳同期用）
 */
export async function updateCartItemsServer(
  updates: CartItemUpdate[]
): Promise<CartResult> {
  const snap = await readCartSnapshot();

  let updated = false;
  for (const update of updates) {
    const item = snap.items.find((x) => x.id === update.id);
    if (item) {
      // 言語が異なる場合のみ更新（無駄な書き込み防止）
      if (item.lang !== update.lang || item.name !== update.name) {
        item.name = update.name;
        item.lang = update.lang;
        updated = true;
      }
    }
  }

  if (updated) {
    snap.updatedAt = Date.now();
    await writeCartSnapshot(snap);
  }

  return { ok: true as const, count: snap.items.length, snapshot: snap };
}

/**
 * 商品の多言語名を一括取得
 * @param productIds - 商品IDの配列
 * @param lang - 取得する言語
 * @returns product_id → title のマップ
 */
export async function getProductTranslationsServer(
  productIds: string[],
  lang: Locale
): Promise<Record<string, string>> {
  if (productIds.length === 0) {
    return {};
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_translations")
    .select("product_id, title")
    .eq("lang", lang)
    .in("product_id", productIds);

  if (error) {
    console.error("[getProductTranslationsServer] error:", error);
    throw new Error("Failed to fetch translations");
  }

  const translations: Record<string, string> = {};
  data?.forEach((row) => {
    translations[row.product_id] = row.title;
  });

  return translations;
}
