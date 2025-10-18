// app/actions/cart.ts (server action)
"use server";
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
