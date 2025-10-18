"use client";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>();
  const [piId, setPiId] = useState<string>();
  const [country, setCountry] = useState<string>("JP");
  const [sessionId, setSessionId] = useState<string>();
  const [updating, setUpdating] = useState(false);
  const [amount, setAmount] = useState<number>();
  const [error, setError] = useState<string>();

  // ここでstoreからとって、サーバーでcookie検証してからPaymentIntent作成
  const items = useMemo(
    () => [{ name: "Kimono Stole", unit_amount_yen: 12000, quantity: 1 }],
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function init() {
      try {
        const sessionRes = await fetch("/api/checkout/session", {
          method: "POST",
          signal: controller.signal,
        });
        if (!sessionRes.ok) {
          throw new Error(`session_fetch_failed:${sessionRes.status}`);
        }
        const sessionJson = (await sessionRes.json()) as {
          sessionId?: string;
        };
        const newSessionId = sessionJson.sessionId;
        if (!newSessionId) throw new Error("session_creation_failed");
        if (cancelled) return;
        setSessionId(newSessionId);

        const piRes = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ items, country: "JP", sessionId: newSessionId }),
        });
        if (cancelled) return;
        const piJson = await piRes.json();
        if (piRes.status === 401 || piRes.status === 403) {
          throw new Error("session_invalid");
        }
        if (!piRes.ok) {
          const reason = (piJson?.reason as string | undefined) ?? "";
          if (reason === "empty_cart") {
            setError(
              "カートが空です。商品を追加してからチェックアウトしてください。"
            );
            return;
          }
          if (reason === "product_not_found" || reason === "unavailable") {
            setError(
              "一部の商品が購入できません。カートを確認し、在庫状況を更新してください。"
            );
            return;
          }
          if (reason === "price_mismatch") {
            setError(
              "商品価格が更新されました。カートを再読み込みしてからもう一度お試しください。"
            );
            return;
          }
          throw new Error(`pi_create_failed:${piRes.status}`);
        }
        if (cancelled) return;
        const {
          clientSecret,
          piId,
          amount: totalAmount,
        } = piJson as {
          clientSecret?: string;
          piId?: string;
          amount?: number;
        };
        if (!clientSecret || !piId) {
          throw new Error("pi_response_missing_fields");
        }
        if (cancelled) return;
        setClientSecret(clientSecret as string);
        setPiId(piId as string);
        if (typeof totalAmount === "number") {
          setAmount(totalAmount);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error(error);
        setError(
          "チェックアウトを開始できませんでした。ページを再読み込みしてください。"
        );
      }
    }
    init();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [items]);

  // 住所変更で国が変わったら更新
  async function onAddressChangeAction(e: StripeAddressElementChangeEvent) {
    const newAddress = {
      country: e.value.address.country,
      city: e.value.address.city,
      line1: e.value.address.line1,
      line2: e.value.address.line2,
      postal_code: e.value.address.postal_code,
      state: e.value.address.state,
    };
    setCountry(newAddress.country || "JP");
    
    if (!piId || !sessionId) return;
    if (!e.complete && !e.value.address.country) return; // countryが入るまでは更新しない（チラつき防止）

    setUpdating(true);
    try {
      const res = await fetch("/api/update-shipping", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ piId, country: newAddress.country, sessionId }),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        console.error("[checkout] update-shipping failed", {
          status: res.status,
          piId,
          sessionId,
          response: data,
        });
        setError(
          "セッションが無効です。ページを再読み込みしてやり直してください。"
        );
        return;
      }
      if (!res.ok) {
        if (data?.reason === "empty_items") {
          setError(
            "カート情報を取得できませんでした。ページを再読み込みしてください。"
          );
        } else {
          setError(
            "送料の更新に失敗しました。時間を置いて再度お試しください。"
          );
        }
        return;
      }
      if (data.ok) {
        setAmount(data.amount);
        setError(undefined);
      } else if (data.reason === "session_mismatch") {
        setError(
          "セッションが無効です。ページを再読み込みしてやり直してください。"
        );
      } else {
        setError("送料の更新に失敗しました。時間を置いて再度お試しください。");
      }
    } catch (err) {
      console.error(err);
      setError("通信に失敗しました。時間を置いて再度お試しください。");
    } finally {
      setUpdating(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => location.reload()}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white"
        >
          再読み込み
        </button>
      </div>
    );
  }

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret, // Payment Element は client_secret で初期化して使う。:contentReference[oaicite:4]{index=4}
        appearance: { labels: "floating" },
        locale: "ja",
      }}
    >
      <CheckoutForm
        onAddressChangeAction={onAddressChangeAction}
        updating={updating}
        amount={amount}
      />
    </Elements>
  );
}
