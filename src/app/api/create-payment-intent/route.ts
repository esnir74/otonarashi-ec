// POST { country?: string, sessionId: string }
import {
  FxRate,
  SupportedCurrency,
  convertYenToMinorUnit,
  currencyToStripeCode,
} from "@/lib/checkout/currency";
import {
  PaymentIntentMetadataInput,
  buildPaymentIntentMetadata,
} from "@/lib/checkout/metadataSchema";
import { COOKIE_NAME, verifySessionCookie } from "@/lib/checkout/session";
import { validateCartSnapshot } from "@/lib/checkout/validateCart";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";

const SHIPPING_YEN: Record<string, number> = { jp: 400, us: 1000 };

type CreatePaymentIntentBody = {
  sessionId: string;
  country?: string;
  lang?: "ja" | "en" | "zh";
  currency?: SupportedCurrency;
  fxRate?: FxRate;
  replacePiId?: string;
};

export type StripeItems = Array<{
  id: string; // 任意の自前ID（SKU等）
  unit_amount_yen: number; // 最小通貨単位（JPYなら円、USDならセント）
  name: string;
  quantity: number;
}>;

function calcShipping(country?: string) {
  const key = (country ?? "jp").toLowerCase();
  return SHIPPING_YEN[key] ?? SHIPPING_YEN.jp;
}

export async function POST(req: Request) {
  console.log("[PaymentIntent] POST request received");

  const body = (await req.json()) as CreatePaymentIntentBody;
  const {
    country,
    sessionId,
    lang,
    currency = "JPY",
    fxRate,
    replacePiId,
  } = body;
  console.log("[PaymentIntent] Request body:", body);

  if (!sessionId) {
    return new Response(
      JSON.stringify({ ok: false, reason: "missing_session" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (currency !== "JPY") {
    if (
      !fxRate ||
      typeof fxRate.usdRate !== "number" ||
      typeof fxRate.eurRate !== "number"
    ) {
      return new Response(
        JSON.stringify({ ok: false, reason: "missing_fx_rate" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  }

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
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
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
  const totalYen = amount;

  const orderNumber = `OR-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;

  const metadataInput: PaymentIntentMetadataInput = {
    session_id: sessionId,
    order_number: orderNumber,
    items_json: JSON.stringify(items),
    items_subtotal_yen: String(subtotal),
    shipping_yen: String(shipping),
    total_yen: String(totalYen),
    payment_method: "card",
    exchange_rate_timestamp: new Date().toISOString(),
    ...(lang ? { lang } : {}),
    ...(currency !== "JPY" && fxRate
      ? {
          fx_rate_usd: String(fxRate.usdRate),
          fx_rate_eur: String(fxRate.eurRate),
        }
      : {}),
  };
  const stripeMetadata = buildPaymentIntentMetadata(metadataInput);

  if (replacePiId) {
    try {
      const existing = await stripe.paymentIntents.retrieve(replacePiId);
      if (existing.metadata.session_id === sessionId) {
        if (
          existing.status !== "canceled" &&
          existing.status !== "succeeded" &&
          existing.status !== "requires_capture"
        ) {
          await stripe.paymentIntents.cancel(replacePiId, {
            cancellation_reason: "abandoned",
          });
        }
      } else {
        console.warn("[PaymentIntent] replacePiId session mismatch", {
          replacePiId,
          existingSession: existing.metadata.session_id,
          requestSessionId: sessionId,
        });
      }
    } catch (error) {
      console.error("[PaymentIntent] Failed to cancel existing PI", error);
    }
  }

  let amountMinor: number;
  try {
    amountMinor = convertYenToMinorUnit(amount, currency, fxRate);
  } catch (error) {
    console.error("[PaymentIntent] FX conversion failed", error);
    return new Response(
      JSON.stringify({ ok: false, reason: "fx_conversion_failed" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  console.log("[PaymentIntent] Creating Stripe PaymentIntent:", {
    amountYen: amount,
    amountMinor,
    subtotal,
    shipping,
    currency,
    orderNumber,
    itemsCount: items.length,
  });

  const pi = await stripe.paymentIntents.create({
    amount: amountMinor,
    currency: currencyToStripeCode(currency),
    capture_method: "manual", // 後で webhook 側で capture する前提
    automatic_payment_methods: { enabled: true },
    metadata: stripeMetadata,
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
      currency,
      amountMinor: pi.amount,
      subtotalYen: subtotal,
      shippingYen: shipping,
      totalYen,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}
