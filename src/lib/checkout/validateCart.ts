import { readCartSnapshot } from "@/lib/cartCookie";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type ValidatedCartItem = {
  id: string;
  name: string;
  quantity: number;
  unitPriceYen: number;
  weightGrams: number;
};

export type CartValidationFailure =
  | { ok: false; reason: "empty_cart" }
  | { ok: false; reason: "product_not_found"; productId: string }
  | { ok: false; reason: "unavailable"; productId: string }
  | { ok: false; reason: "price_mismatch"; productId: string };

export type CartValidationResult =
  | {
      ok: true;
      items: ValidatedCartItem[];
      subtotalYen: number;
      totalWeightGrams: number;
    }
  | CartValidationFailure;

/**
 * HTTP クッキーに保存された cart snapshot を読み出し、
 * Supabase から最新の在庫・価格情報を取得して妥当性を検証する。
 */
export async function validateCartSnapshot(): Promise<CartValidationResult> {
  const snap = await readCartSnapshot();

  if (snap.items.length === 0) {
    return { ok: false, reason: "empty_cart" };
  }

  const ids = snap.items.map((item) => item.id);
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id, price_yen, stock, status, weight_grams")
    .in("id", ids);

  if (error) {
    console.error("[validateCartSnapshot] products fetch error:", error);
    return { ok: false, reason: "product_not_found", productId: ids[0] };
  }

  const productsById = new Map(
    (data ?? []).map((row) => [
      row.id,
      {
        priceYen: row.price_yen,
        stock: row.stock,
        status: row.status,
        weight: row.weight_grams,
      },
    ])
  );

  const validated: ValidatedCartItem[] = [];

  for (const item of snap.items) {
    const product = productsById.get(item.id);
    if (!product) {
      return { ok: false, reason: "product_not_found", productId: item.id };
    }

    if (product.status !== "published" || (product.stock ?? 0) <= 0) {
      return { ok: false, reason: "unavailable", productId: item.id };
    }

    if (product.priceYen !== item.price) {
      return { ok: false, reason: "price_mismatch", productId: item.id };
    }

    validated.push({
      id: item.id,
      name: item.name,
      quantity: 1,
      unitPriceYen: product.priceYen,
      weightGrams: product.weight ?? 0,
    });
  }

  const subtotalYen = validated.reduce(
    (sum, it) => sum + it.unitPriceYen * it.quantity,
    0
  );
  const totalWeightGrams = validated.reduce(
    (sum, it) => sum + it.weightGrams * it.quantity,
    0
  );

  return {
    ok: true,
    items: validated,
    subtotalYen,
    totalWeightGrams,
  };
}
