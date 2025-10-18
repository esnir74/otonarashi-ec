// POST { country?: string, sessionId: string }
import { COOKIE_NAME, verifySessionCookie } from "@/lib/checkout/session";
import { validateCartSnapshot } from "@/lib/checkout/validateCart";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";

const SHIPPING_YEN: Record<string, number> = { jp: 400, us: 1000 };

export type StripeItems = Array<{
  id: string; // 任意の自前ID（SKU等）
  unit_amount_yen: number; // 最小通貨単位（JPYなら円、USDならセント）
  name: string;
  quantity: number;
}>;

export type StripeMetadata = {
  session_id: string;
  order_number: string;
  items_json: string; // Items配列のJSON文字列
  shipping_yen?: string; // 送料（JPY最小通貨単位）
  lang?: "ja" | "en" | "zh";
  org_name?: string; // 任意
  exchange_rate?: string; // 為替レート
  exchange_rate_timestamp?: string; // 為替レートのタイムスタンプ
};

function calcShipping(country?: string) {
  const key = (country ?? "jp").toLowerCase();
  return SHIPPING_YEN[key] ?? SHIPPING_YEN.jp;
}

export async function POST(req: Request) {
  console.log("[PaymentIntent] POST request received");

  const { country, sessionId, lang } = await req.json();
  console.log("[PaymentIntent] Request body:", { country, sessionId, lang });

  const store = await cookies();
  const signed = store.get(COOKIE_NAME)?.value ?? null;
  console.log("[PaymentIntent] Cookie check:", {
    cookieName: COOKIE_NAME,
    hasCookie: !!signed,
    cookieLength: signed?.length,
  });

  const verifiedToken = verifySessionCookie(signed);
  console.log("[PaymentIntent] Session verification:", {
    verifiedToken,
    requestSessionId: sessionId,
    matches: verifiedToken === sessionId,
  });

  if (!sessionId || !verifiedToken || verifiedToken !== sessionId) {
    console.error("[PaymentIntent] Session validation FAILED:", {
      hasSessionId: sessionId,
      hasVerifiedToken: verifiedToken,
      matches: verifiedToken === sessionId,
    });
    return new Response(
      JSON.stringify({ ok: false, reason: "invalid_session" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  console.log("[PaymentIntent] Session validated successfully");

  const validation = await validateCartSnapshot();
  console.log("[PaymentIntent] Cart validation result:", validation);

  if (!validation.ok) {
    console.error("[PaymentIntent] Cart validation FAILED:", validation.reason);
    const statusMap = {
      empty_cart: 400,
      product_not_found: 409,
      unavailable: 409,
      price_mismatch: 409,
    } as const;
    return new Response(
      JSON.stringify({ ok: false, reason: validation.reason }),
      {
        status: statusMap[validation.reason],
        headers: { "content-type": "application/json" },
      }
    );
  }

  console.log(
    "[PaymentIntent] Cart validated, items:",
    validation.items.length
  );

  const items: StripeItems = validation.items.map((item) => ({
    id: item.id,
    name: item.name,
    unit_amount_yen: item.unitPriceYen,
    quantity: item.quantity,
  }));

  const subtotal = validation.subtotalYen;
  const shipping = calcShipping(country);
  const amount = subtotal + shipping;

  const orderNumber = `OR-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;

  const metadata: StripeMetadata = {
    session_id: sessionId,
    order_number: orderNumber,
    items_json: JSON.stringify(items),
    lang,
    shipping_yen: undefined,
    org_name: undefined,
    exchange_rate: undefined,
    exchange_rate_timestamp: undefined,
  };

  console.log("[PaymentIntent] Creating Stripe PaymentIntent:", {
    amount,
    subtotal,
    shipping,
    orderNumber,
    itemsCount: items.length,
  });

  const pi = await stripe.paymentIntents.create({
    amount, // JPY の最小単位（円）
    currency: "jpy",
    capture_method: "manual", // 後で webhook 側で capture する前提
    automatic_payment_methods: { enabled: true },
    metadata: metadata,
  }); // 手動キャプチャは PaymentIntent で capture_method: 'manual' を指定。:contentReference[oaicite:1]{index=1}

  console.log("[PaymentIntent] PaymentIntent created successfully:", {
    piId: pi.id,
    amount: pi.amount,
    status: pi.status,
  });

  return new Response(
    JSON.stringify({
      ok: true,
      clientSecret: pi.client_secret,
      piId: pi.id,
      amount,
      subtotal,
      shipping,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}
