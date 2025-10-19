// lib/checkout-status.ts
import { createClient } from "@supabase/supabase-js";
import { stripe } from "./stripe";

// ★ サーバ専用キーを使う（RLS設計に合わせて）
//   クライアント向けの supabaseClient（NEXT_PUBLIC_...）は使わないこと
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // read/必要最小権限
  { auth: { persistSession: false } }
);

export type CheckoutStatus = "ok" | "out_of_stock" | "pending";

type Options = {
  /** サーバ側の初期判定で待つ最大時間（ms）。0なら即時判定のみ。既定 800ms */
  maxWaitMs?: number;
  /** ループ周期（ms）。既定 1200ms */
  intervalMs?: number;
};

export async function getCheckoutStatus(
  paymentIntentId: string,
  opts: Options = {}
): Promise<CheckoutStatus> {
  const { maxWaitMs = 800, intervalMs = 1200 } = opts;

  const start = Date.now();
  const until = start + maxWaitMs;

  do {
    const status = await computeOnce(paymentIntentId);
    if (status !== "pending") return status;

    if (Date.now() >= until || maxWaitMs <= 0) break;
    const remain = Math.min(intervalMs, until - Date.now());
    if (remain > 0) await sleep(remain);
  } while (Date.now() < until);

  return "pending";
}

export async function computeOnce(piId: string): Promise<CheckoutStatus> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(piId);
    const orderNumber = paymentIntent.metadata?.order_number ?? null;

    if (orderNumber) {
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (error) {
        console.error("orders lookup error", error);
      }
      if (data) return "ok";
    }

    if (paymentIntent.status === "canceled") {
      return "out_of_stock";
    }

    if (paymentIntent.status === "succeeded") {
      return "ok";
    }

    return "pending";
  } catch (error: any) {
    if (error?.statusCode === 404) {
      console.warn("PaymentIntent not found", { piId });
      return "pending";
    }
    console.error("computeOnce error", error);
    return "pending";
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
