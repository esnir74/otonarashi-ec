import {
  FxRate,
  SupportedCurrency,
  convertYenToMinorUnit,
  currencyToStripeCode,
} from "@/lib/checkout/currency";
import {
  PaymentIntentItem,
  PaymentIntentMetadataInput,
  buildPaymentIntentMetadata,
} from "@/lib/checkout/metadataSchema";
import { COOKIE_NAME, verifySessionCookie } from "@/lib/checkout/session";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import type { Stripe } from "stripe";

const SHIPPING_YEN: Record<string, number> = { jp: 400, us: 1000 };

type UpdatePaymentIntentBody = {
  sessionId: string;
  piId: string;
  action: "recalculate_shipping";
  country?: string;
  currency?: SupportedCurrency;
  fxRate?: FxRate;
  fxRateTimestamp?: string;
  lang?: "ja" | "en" | "zh";
  address?: {
    country?: string;
    city?: string;
    line1?: string;
    line2?: string;
    postalCode?: string;
    state?: string;
  };
  contact?: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
};

function calcShipping(country?: string) {
  const key = (country ?? "jp").toLowerCase();
  return SHIPPING_YEN[key] ?? SHIPPING_YEN.jp;
}

function parseItems(metadataValue: unknown): PaymentIntentItem[] | null {
  if (typeof metadataValue !== "string") return null;
  try {
    const parsed = JSON.parse(metadataValue) as PaymentIntentItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request) {
  console.log("[payment-intent PATCH] Request received");
  const body = (await req.json()) as UpdatePaymentIntentBody;
  console.log("[payment-intent PATCH] Request body:", {
    sessionId: body.sessionId,
    piId: body.piId,
    action: body.action,
    country: body.country,
    currency: body.currency,
    hasFxRate: !!body.fxRate,
    hasAddress: !!body.address,
    hasContact: !!body.contact,
  });

  const {
    sessionId,
    piId,
    action,
    country,
    currency = "JPY",
    fxRate,
    fxRateTimestamp,
    lang,
    address,
    contact,
  } = body;

  if (!sessionId || !piId) {
    console.error("[payment-intent PATCH] Missing parameters:", {
      hasSessionId: !!sessionId,
      hasPiId: !!piId,
    });
    return new Response(
      JSON.stringify({ ok: false, reason: "missing_parameters" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (action !== "recalculate_shipping") {
    console.error("[payment-intent PATCH] Unsupported action:", action);
    return new Response(
      JSON.stringify({ ok: false, reason: "unsupported_action" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (currency !== "JPY") {
    if (
      !fxRate ||
      typeof fxRate.usdRate !== "number" ||
      typeof fxRate.eurRate !== "number"
    ) {
      console.error("[payment-intent PATCH] Missing or invalid FX rate:", {
        currency,
        fxRate,
      });
      return new Response(
        JSON.stringify({ ok: false, reason: "missing_fx_rate" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  }

  const store = await cookies();
  const signed = store.get(COOKIE_NAME)?.value ?? null;
  const verifiedToken = verifySessionCookie(signed);
  if (!verifiedToken || verifiedToken !== sessionId) {
    return new Response(
      JSON.stringify({ ok: false, reason: "invalid_session" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  const pi = await stripe.paymentIntents.retrieve(piId);
  console.log("[payment-intent PATCH] Retrieved PaymentIntent:", {
    piId: pi.id,
    status: pi.status,
    currency: pi.currency,
    amount: pi.amount,
    metadataSessionId: pi.metadata.session_id,
  });

  if ((pi.metadata.session_id ?? "") !== sessionId) {
    console.error("[payment-intent PATCH] session mismatch", {
      piId,
      metadataSession: pi.metadata.session_id,
      requestSessionId: sessionId,
    });
    return new Response(
      JSON.stringify({ ok: false, reason: "session_mismatch" }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }

  if (
    pi.status !== "requires_payment_method" &&
    pi.status !== "requires_confirmation"
  ) {
    console.error("[payment-intent PATCH] Invalid status:", {
      piId,
      status: pi.status,
      expected: ["requires_payment_method", "requires_confirmation"],
    });
    return new Response(
      JSON.stringify({ ok: false, reason: "already_confirmed" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const storedItems = parseItems(pi.metadata.items_json);
  console.log("[payment-intent PATCH] Parsed items:", {
    itemsJson: pi.metadata.items_json,
    parsedCount: storedItems?.length ?? 0,
  });

  if (!storedItems || storedItems.length === 0) {
    console.error("[payment-intent PATCH] Empty or invalid items:", {
      piId,
      itemsJson: pi.metadata.items_json,
      storedItems,
    });
    return new Response(JSON.stringify({ ok: false, reason: "empty_items" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const subtotalYen = storedItems.reduce(
    (sum, item) => sum + item.unit_amount_yen * item.quantity,
    0
  );
  const shippingYen = calcShipping(country);
  const totalYen = subtotalYen + shippingYen;

  const expectedCurrencyCode = currencyToStripeCode(currency);
  if (pi.currency !== expectedCurrencyCode) {
    console.error("[payment-intent PATCH] Currency mismatch:", {
      piId,
      piCurrency: pi.currency,
      requestCurrency: currency,
      expectedCode: expectedCurrencyCode,
    });
    return new Response(
      JSON.stringify({ ok: false, reason: "currency_mismatch" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  let amountMinor: number;
  try {
    amountMinor = convertYenToMinorUnit(totalYen, currency, fxRate);
  } catch (error) {
    console.error("[payment-intent] FX conversion failed", error);
    return new Response(
      JSON.stringify({ ok: false, reason: "fx_conversion_failed" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const existingAddress = pi.shipping?.address;
  const shippingAddress: Stripe.AddressParam = {
    country: (address?.country ?? country ?? "jp").toUpperCase(),
    city: address?.city ?? existingAddress?.city ?? undefined,
    line1: address?.line1 ?? existingAddress?.line1 ?? undefined,
    line2: address?.line2 ?? existingAddress?.line2 ?? undefined,
    postal_code:
      address?.postalCode ?? existingAddress?.postal_code ?? undefined,
    state: address?.state ?? existingAddress?.state ?? undefined,
  };

  const shippingPayload: Stripe.PaymentIntentUpdateParams.Shipping = {
    address: shippingAddress,
    name: contact?.fullName?.trim() || pi.shipping?.name || "Customer",
    phone: contact?.phone?.trim() || pi.shipping?.phone || undefined,
  };

  const rateMap = {
    JPY: 1,
    USD: fxRate?.usdRate,
    EUR: fxRate?.eurRate,
  } as const;

  const email = contact?.email?.trim() || undefined;

  const metadataInput: PaymentIntentMetadataInput = {
    session_id: pi.metadata.session_id,
    order_number: pi.metadata.order_number,
    items_subtotal_amount: 0,
    shipping_amount: 0,
    items: storedItems,
    payment_method: pi.metadata.payment_method as "card" | "postal_transfer",
    lang: lang ?? (pi.metadata.lang as "ja" | "en" | "zh"),
    exchange_rate_timestamp:
      fxRateTimestamp ?? pi.metadata.exchange_rate_timestamp,
    items_subtotal_yen: subtotalYen,
    shipping_yen: shippingYen,
    total_yen: totalYen,
    fx_rate: rateMap[currency] ?? 1,
  };

  const stripeMetadata = buildPaymentIntentMetadata(metadataInput);

  console.log("[payment-intent PATCH] Updating PaymentIntent:", {
    piId,
    amountMinor,
    subtotalYen,
    shippingYen,
    totalYen,
    email,
  });

  const updated = await stripe.paymentIntents.update(piId, {
    amount: amountMinor,
    receipt_email: email,
    metadata: stripeMetadata,
    shipping: shippingPayload,
  });

  console.log("[payment-intent PATCH] Update successful:", {
    piId: updated.id,
    amount: updated.amount,
    status: updated.status,
  });

  return new Response(
    JSON.stringify({
      ok: true,
      currency,
      amountMinor: updated.amount,
      subtotalYen,
      shippingYen,
      totalYen,
    }),
    { headers: { "content-type": "application/json" } }
  );
}
