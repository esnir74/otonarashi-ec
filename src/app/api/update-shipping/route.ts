// POST { piId: string, country: string }
import { COOKIE_NAME, verifySessionCookie } from "@/lib/checkout/session";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import { Stripe } from "stripe";
const SHIPPING_YEN: Record<string, number> = { jp: 400, us: 1000 };

function calcSubtotal(items: { unit_amount_yen: number; quantity: number }[]) {
  return items.reduce(
    (sum, item) => sum + item.unit_amount_yen * item.quantity,
    0
  );
}

export async function POST(req: Request) {
  const { piId, country, sessionId } = await req.json();
  const store = await cookies();
  const signed = store.get(COOKIE_NAME)?.value ?? null;
  const verifiedToken = verifySessionCookie(signed);
  if (!sessionId || !verifiedToken || verifiedToken !== sessionId) {
    return new Response(
      JSON.stringify({ ok: false, reason: "invalid_session" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
  const pi = await stripe.paymentIntents.retrieve(piId);

  // すでに確認済み(=requires_capture など)なら金額は変えない
  if (
    pi.status !== "requires_payment_method" &&
    pi.status !== "requires_confirmation"
  ) {
    return new Response(
      JSON.stringify({ ok: false, reason: "already_confirmed" }),
      { status: 400 }
    );
  }

  if ((pi.metadata.session_id ?? "") !== sessionId) {
    console.error("[update-shipping] session_mismatch", {
      piId,
      piMetadataSessionId: pi.metadata.session_id,
      requestSessionId: sessionId,
      cookieSessionId: verifiedToken,
    });
    return new Response(
      JSON.stringify({
        ok: false,
        reason: "session_mismatch",
        debug: {
          piMetadataSessionId: pi.metadata.session_id,
          requestSessionId: sessionId,
          cookieSessionId: verifiedToken,
        },
      }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }

  const items = JSON.parse((pi.metadata.items_json ?? "[]") as string) as {
    product_id?: string;
    unit_amount_yen: number;
    quantity: number;
    weight_grams?: number;
  }[];
  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ ok: false, reason: "empty_items" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const subtotal = calcSubtotal(items);
  const shipping =
    SHIPPING_YEN[(country ?? "jp").toLowerCase()] ?? SHIPPING_YEN.jp;
  const amount = subtotal + shipping;

  const params: Stripe.PaymentIntentUpdateParams = {
    amount,
    metadata: { ...pi.metadata, shipping_yen: String(shipping) },
    shipping: { address: { country: country.toUpperCase() }, name: "ffffff" }, // ついでに保存
  };

  const updated = await stripe.paymentIntents.update(piId, {
    amount,
    metadata: { ...pi.metadata, shipping_yen: String(shipping) },
    shipping: {
      address: { country: country.toUpperCase(), city: "Tokyo" },
      name: "ffffff",
    }, // ついでに保存
  }); // 確認前の PaymentIntent は amount 更新が可能。:contentReference[oaicite:2]{index=2}

  return new Response(JSON.stringify({ ok: true, amount, shipping }));
}
