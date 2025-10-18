"use client";

import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import { useMemo, useState } from "react";

type Props = {
  onAddressChangeAction: (event: StripeAddressElementChangeEvent) => void;
  updating: boolean;
  amount?: number;
};

export function CheckoutForm({ onAddressChangeAction, updating, amount }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();

  const formattedAmount = useMemo(() => {
    if (typeof amount !== "number") return "合計計算中…";
    return `合計: ¥${amount.toLocaleString()}`;
  }, [amount]);

  const disabled = submitting || updating || !stripe || !elements;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage(undefined);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/thanks` },
    }); // Payment Element から支払い情報を収集して PaymentIntent を確認。:contentReference[oaicite:5]{index=5}

    if (error) {
      setMessage(error.message ?? "支払い処理でエラーが発生しました。");
    } else {
      setMessage(
        "決済処理を完了しています。数秒経っても画面が遷移しない場合は再読み込みしてください。"
      );
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["JP", "US"], // 対応国のみ表示。:contentReference[oaicite:6]{index=6}
          fields: { phone: "always" },
        }}
        onChange={onAddressChangeAction}
      />

      <PaymentElement />

      <div className="text-sm text-neutral-600">
        {updating ? "送料を更新しています…" : formattedAmount}
      </div>

      {message ? (
        <p className="text-sm text-red-600">{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {submitting ? "決済処理中…" : "支払う"}
      </button>
    </form>
  );
}
