// app/api/checkout/route.ts
import { stripe, StripeType } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  currency: string; // 例: "jpy"
  locale: "ja" | "en" | "zh"; // 例: "ja"
  items: Array<{
    id: string; // 任意の自前ID（SKU等）
    unit_amount: number; // 最小通貨単位（JPYなら円、USDならセント）
    name: string;
    description?: string;
    image?: string; // 先頭1枚がCheckoutで表示されます
    quantity: number;
  }>;
};



export type StripeItems = Array<{
  id: string; // 任意の自前ID（SKU等）
  unit_amount_yen: number; // 最小通貨単位（JPYなら円、USDならセント）
  name: string;
  quantity: number;
}>;

export type StripeMetadata = {
  order_number: string;
  items_json: string; // Items配列のJSON文字列
  shipping_yen?: string; // 送料（JPY最小通貨単位）
  lang?: "ja" | "en" | "zh";
  org_name?: string; // 任意
  exchange_rate?: string; // 為替レート
  exchange_rate_timestamp?: string; // 為替レートのタイムスタンプ
}

export async function POST(req: NextRequest) {
  try {
    // 同一オリジンなら header から、なければ URL から取得
    const origin =
      req.headers.get("origin") ??
      new URL(req.url).origin ??
      "http://localhost:3000";

    // ← フォームPOST（application/x-www-form-urlencoded）から受け取る
    const form = await req.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { currency, locale, items } = JSON.parse(raw) as RequestBody;

    const orderNumber = `OR-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;
    // line_items を動的に組み立て
    const line_items: StripeType.Checkout.SessionCreateParams.LineItem[] =
      items.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency, // 全体通貨を統一
          unit_amount: it.unit_amount,
          product_data: {
            name: it.name,
            description: it.description,
            images: it.image ? [it.image] : undefined,
            // 既存 Product を使うなら product: 'prod_xxx' を利用
          },
        },
      }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: locale, // "ja", "en" など
      line_items,
      success_url: `${origin}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/?canceled=true`,
      currency,
      payment_intent_data: { capture_method: "manual" },
      metadata: {
        order_number: orderNumber,
        lang: locale,
        // itemsは文字列で（WebhookでJSON.parse）
        items_json: JSON.stringify(
          items.map((i) => ({
            id: i.id,
            name: i.name,
            unit_amount: i.unit_amount,
            quantity: i.quantity,
          }))
        ),
      },
    });

    // フォームPOSTなのでリダイレクトでそのまま Stripe へ遷移させる
    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const e = err as StripeType.errors.StripeError;
    return NextResponse.json(
      { error: e.message ?? "Checkout create failed" },
      { status: e.statusCode || 500 }
    );
  }
}
