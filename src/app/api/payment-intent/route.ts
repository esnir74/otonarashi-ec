import { COOKIE_NAME, verifySessionCookie } from "@/lib/checkout/session";
import {
  FxRate,
  SupportedCurrency,
  convertYenToMinorUnit,
  currencyToStripeCode,
} from "@/lib/checkout/currency";
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

type StoredItem = {
  id?: string;
  unit_amount_yen: number;
  quantity: number;
};

function calcShipping(country?: string) {
  const key = (country ?? "jp").toLowerCase();
  return SHIPPING_YEN[key] ?? SHIPPING_YEN.jp;
}

function parseItems(metadataValue: unknown): StoredItem[] | null {
  if (typeof metadataValue !== "string") return null;
  try {
    const parsed = JSON.parse(metadataValue) as StoredItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request) {
  const body = (await req.json()) as UpdatePaymentIntentBody;
  const {
    sessionId,
    piId,
    action,
    country,
    currency = "JPY",
    fxRate,
    address,
    contact,
  } = body;

  if (!sessionId || !piId) {
    return new Response(
      JSON.stringify({ ok: false, reason: "missing_parameters" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (action !== "recalculate_shipping") {
    return new Response(
      JSON.stringify({ ok: false, reason: "unsupported_action" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (currency !== "JPY") {
    if (!fxRate || typeof fxRate.usdRate !== "number" || typeof fxRate.eurRate !== "number") {
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
  if ((pi.metadata.session_id ?? "") !== sessionId) {
    console.error("[payment-intent] session mismatch", {
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
    return new Response(
      JSON.stringify({ ok: false, reason: "already_confirmed" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const storedItems = parseItems(pi.metadata.items_json);
  if (!storedItems || storedItems.length === 0) {
    return new Response(
      JSON.stringify({ ok: false, reason: "empty_items" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const subtotalYen = storedItems.reduce(
    (sum, item) => sum + item.unit_amount_yen * item.quantity,
    0
  );
  const shippingYen = calcShipping(country);
  const totalYen = subtotalYen + shippingYen;

  const expectedCurrencyCode = currencyToStripeCode(currency);
  if (pi.currency !== expectedCurrencyCode) {
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
    postal_code: address?.postalCode ?? existingAddress?.postal_code ?? undefined,
    state: address?.state ?? existingAddress?.state ?? undefined,
  };

  const shippingPayload: Stripe.PaymentIntentUpdateParams.Shipping = {
    address: shippingAddress,
    name: contact?.fullName?.trim() || pi.shipping?.name || "Customer",
    phone: contact?.phone?.trim() || pi.shipping?.phone || undefined,
  };

  const updated = await stripe.paymentIntents.update(piId, {
    amount: amountMinor,
    metadata: {
      ...pi.metadata,
      items_subtotal_yen: String(subtotalYen),
      shipping_yen: String(shippingYen),
      total_yen: String(totalYen),
      fx_rate_usd:
        currency !== "JPY" && fxRate ? String(fxRate.usdRate) : pi.metadata.fx_rate_usd,
      fx_rate_eur:
        currency !== "JPY" && fxRate ? String(fxRate.eurRate) : pi.metadata.fx_rate_eur,
    },
    shipping: shippingPayload,
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
