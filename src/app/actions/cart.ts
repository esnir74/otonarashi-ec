// app/actions/cart.ts (server action)
"use server";
import { Locale } from "@/i18n/locales";
import {
  CartSnapItem,
  CartSnapshot,
  readCartSnapshot,
  writeCartSnapshot,
} from "@/lib/cartCookie";
import { createClient } from "@/lib/supabaseClient"; // 既存のサーバ側クライアント
import { getMainImageUrl } from "@/lib/utils/imageUrl";
import type { ImageVariants } from "@/lib/models/product";

type CartResult = {
  ok: boolean;
  reason?: string;
  count: number;
  snapshot: CartSnapshot;
};

const buildResult = (
  snapshot: CartSnapshot,
  override?: Partial<Omit<CartResult, "snapshot">>
): CartResult => ({
  ok: true,
  count: snapshot.items.length,
  snapshot,
  ...override,
});

export async function addToCartServer(item: CartSnapItem): Promise<CartResult> {
  // 1) 在庫/公開の再検証（一点物なので存在チェックのみでもOK）
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      stock,
      status,
      product_images(variants, blur_data, is_main, sort)
    `
    )
    .eq("id", item.id)
    .single();

  if (error || !data || (data.stock ?? 0) <= 0 || data.status !== "published") {
    const snapshot = await readCartSnapshot();
    return buildResult(snapshot, { ok: false, reason: "UNAVAILABLE" });
  }

  let normalizedItem: CartSnapItem = {
    ...item,
    imageUrl: item.imageUrl ?? null,
    imageBlur: item.imageBlur ?? null,
  };

  const rawImages = data.product_images;
  if (rawImages) {
    const imagesArray = Array.isArray(rawImages) ? rawImages : [rawImages];
    const typedImages = imagesArray
      .filter(Boolean)
      .map((img) => ({
        variants: img.variants as ImageVariants,
        blur_data: img.blur_data as string | null,
        is_main: Boolean(img.is_main),
        sort: typeof img.sort === "number" ? img.sort : 0,
      }));

    if (typedImages.length > 0) {
      const mainUrl = getMainImageUrl(typedImages, "400");
      const sorted = [...typedImages].sort((a, b) => a.sort - b.sort);
      const mainBlur =
        typedImages.find((img) => img.is_main)?.blur_data ??
        sorted[0]?.blur_data ??
        null;

      normalizedItem = {
        ...normalizedItem,
        imageUrl: mainUrl ?? normalizedItem.imageUrl ?? null,
        imageBlur: mainBlur ?? normalizedItem.imageBlur ?? null,
      };
    }
  }

  // 2) Cookie のスナップショット更新（重複禁止）
  const snap = await readCartSnapshot();
  const existing = snap.items.find((x) => x.id === item.id);
  if (existing) {
    let mutated = false;
    if (!existing.imageUrl && normalizedItem.imageUrl) {
      existing.imageUrl = normalizedItem.imageUrl;
      mutated = true;
    }
    if (!existing.imageBlur && normalizedItem.imageBlur) {
      existing.imageBlur = normalizedItem.imageBlur;
      mutated = true;
    }
    if (mutated) {
      snap.updatedAt = Date.now();
      await writeCartSnapshot(snap);
    }
    return buildResult(snap, { ok: false, reason: "DUPLICATE" });
  }

  if (!snap.items.some((x) => x.id === item.id)) {
    snap.items.push(normalizedItem);
    snap.updatedAt = Date.now();
    await writeCartSnapshot(snap);
    return buildResult(snap);
  }

  return buildResult(snap, { ok: false, reason: "DUPLICATE" });
}

export async function removeFromCartServer(id: string): Promise<CartResult> {
  const snap = await readCartSnapshot();
  const newItems = snap.items.filter((x) => x.id !== id);
  if (newItems.length !== snap.items.length) {
    snap.items = newItems;
    snap.updatedAt = Date.now();
    await writeCartSnapshot(snap);
    return buildResult(snap);
  }
  return buildResult(snap, { ok: false, reason: "NOT_FOUND" });
}

export async function clearCartServer(): Promise<CartResult> {
  const snap = await readCartSnapshot();
  snap.items = [];
  snap.updatedAt = Date.now();
  await writeCartSnapshot(snap);
  return buildResult(snap);
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

  return buildResult(snap);
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
