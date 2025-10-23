"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export type AddressUpdate = {
  complete: boolean;
  address: {
    country?: string;
    city?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  contact: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
};

type PaymentMethod = "card" | "bank_transfer";

type Props = {
  onAddressChangeAction: (payload: AddressUpdate) => void;
  updating: boolean;
  amountLabel: string;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
  lang: string;
  piId: string;
  onPaymentFailure?: (reason: string) => void;
};

function mapConfirmPaymentError(error: StripeError): string {
  const code = error.code;
  if (
    error.type === "card_error" ||
    code === "card_declined" ||
    code === "payment_intent_authentication_failure" ||
    code === "payment_method_unactivated"
  ) {
    return "payment_failed";
  }
  if (
    code === "payment_canceled" ||
    code === "payment_intent_unexpected_state" ||
    code === "expired_card"
  ) {
    return "canceled";
  }
  if (code === "expired_session" || code === "payment_intent_incompatible_client") {
    return "session_invalid";
  }
  return "checkout_error";
}

export function CheckoutForm({
  onAddressChangeAction,
  updating,
  amountLabel,
  onPaymentMethodChange,
  lang,
  piId,
  onPaymentFailure,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const normalizedLang = lang || "ja";

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [address, setAddress] = useState({
    country: "JP",
    postalCode: "",
    prefecture: "",
    city: "",
    line1: "",
    line2: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onAddressChangeAction({
        complete:
          Boolean(address.country) &&
          Boolean(address.postalCode) &&
          Boolean(address.prefecture) &&
          Boolean(address.city) &&
          Boolean(address.line1),
        address: {
          country: address.country,
          postal_code: address.postalCode,
          state: address.prefecture,
          city: address.city,
          line1: address.line1,
          line2: address.line2 || undefined,
        },
        contact: {
          fullName: `${contact.lastName} ${contact.firstName}`.trim(),
          phone: contact.phone.trim() || undefined,
          email: contact.email.trim() || undefined,
        },
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [address, contact, onAddressChangeAction]);

  useEffect(() => {
    onPaymentMethodChange?.(paymentMethod);
  }, [paymentMethod, onPaymentMethodChange]);

  const contactValid =
    contact.email.trim() &&
    contact.phone.trim() &&
    contact.firstName.trim() &&
    contact.lastName.trim();

  const addressValid =
    address.country &&
    address.postalCode.trim() &&
    address.prefecture.trim() &&
    address.city.trim() &&
    address.line1.trim();

  const cardReady =
    paymentMethod === "card" ? Boolean(stripe) && Boolean(elements) : true;

  const disabled =
    submitting || updating || !contactValid || !addressValid || !cardReady;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(undefined);

    if (!piId) {
      onPaymentFailure?.("session_invalid");
      setMessage("決済セッションが無効です。ページを再読み込みしてください。");
      setSubmitting(false);
      return;
    }

    const fullName = `${contact.lastName} ${contact.firstName}`.trim();

    if (paymentMethod === "card") {
      if (!stripe || !elements) {
        setMessage(
          "カード決済の初期化に失敗しました。時間をおいて再試行してください。"
        );
        setSubmitting(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${
            window.location.origin
          }/${normalizedLang}/success?pi_id=${encodeURIComponent(piId)}`,
          payment_method_data: {
            billing_details: {
              name: undefined,
              email: contact.email,
              phone: contact.phone,
            },
          },
        },
      }); // Payment Element から支払い情報を収集して PaymentIntent を確認。:contentReference[oaicite:5]{index=5}

      if (error) {
        const failureReason = mapConfirmPaymentError(error);
        if (onPaymentFailure) {
          onPaymentFailure(failureReason);
          setSubmitting(false);
          return;
        }
        setMessage(error.message ?? "支払い処理でエラーが発生しました。");
      } else {
        setMessage(
          "決済処理を完了しています。画面が切り替わらない場合は数秒後に再読み込みしてください。"
        );
      }
    } else {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setMessage(
          "郵便振込でのご注文を受け付けました。担当者より振込先情報をメールでご案内いたします。"
        );
      } catch (error) {
        console.error("[checkout] bank transfer failed", error);
        setMessage(
          "郵便振込でのご注文に失敗しました。時間をおいて再度お試しください。"
        );
      }
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">連絡先</h2>
          <button
            type="button"
            className="text-sm font-medium text-neutral-500 underline underline-offset-4 transition hover:text-neutral-700"
          >
            ログイン
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">メールアドレス</span>
            <input
              type="email"
              required
              value={contact.email}
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="example@otonarashi.jp"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">電話番号</span>
            <input
              type="tel"
              required
              value={contact.phone}
              onChange={(event) =>
                setContact((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              placeholder="080-0000-0000"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">配送先</h2>
        <div className="mt-6 grid gap-4">
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">国 / 地域</span>
            <select
              value={address.country}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  country: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            >
              <option value="JP">日本</option>
              <option value="US">アメリカ合衆国</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-neutral-700">
              <span className="mb-2 block font-medium">姓</span>
              <input
                type="text"
                required
                value={contact.lastName}
                onChange={(event) =>
                  setContact((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
              />
            </label>
            <label className="text-sm text-neutral-700">
              <span className="mb-2 block font-medium">名</span>
              <input
                type="text"
                required
                value={contact.firstName}
                onChange={(event) =>
                  setContact((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
              />
            </label>
          </div>
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">郵便番号</span>
            <input
              type="text"
              required
              value={address.postalCode}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  postalCode: event.target.value,
                }))
              }
              placeholder="100-0001"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">都道府県</span>
            <input
              type="text"
              required
              value={address.prefecture}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  prefecture: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">市区町村</span>
            <input
              type="text"
              required
              value={address.city}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  city: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">町村番地</span>
            <input
              type="text"
              required
              value={address.line1}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  line1: event.target.value,
                }))
              }
              placeholder="千代田1-1-1 オトナラシビル 101"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="text-sm text-neutral-700">
            <span className="mb-2 block font-medium">
              建物名・部屋番号（任意）
            </span>
            <input
              type="text"
              value={address.line2}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  line2: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">配送方法</h2>
        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-5 text-sm text-neutral-600">
          {updating
            ? "送料を再計算しています…"
            : "配送先住所を入力すると送料が表示されます。"}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">支払い方法</h2>
        <p className="mt-2 text-sm text-neutral-600">
          すべての取引は安全に暗号化されます。
        </p>

        <div
          role="radiogroup"
          aria-label="支払い方法"
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          {(
            [
              {
                value: "card",
                label: "クレジットカード",
                description: "Visa / Mastercard / Amex / JCB",
              },
              {
                value: "bank_transfer",
                label: "郵便振込（後払い）",
                description: "商品到着後7日以内にご入金ください",
              },
            ] satisfies Array<{
              value: PaymentMethod;
              label: string;
              description: string;
            }>
          ).map((option) => {
            const selected = paymentMethod === option.value;
            return (
              <label
                key={option.value}
                className={`relative flex cursor-pointer flex-col rounded-lg border px-4 py-3 transition ${
                  selected
                    ? "border-neutral-900 bg-white shadow-sm"
                    : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={selected}
                  onChange={() => setPaymentMethod(option.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-neutral-900">
                  {option.label}
                </span>
                <span className="mt-1 text-xs text-neutral-500">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-6">
          {paymentMethod === "card" ? (
            <div className="space-y-4">
              <PaymentElement options={{ layout: "tabs" }} />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-5 py-6 text-sm leading-relaxed text-neutral-700">
              <p className="font-medium text-neutral-900">
                郵便振込をご利用の場合
              </p>
              <ul className="mt-3 space-y-2 text-neutral-600">
                <li>
                  ・ご注文確定後に振込先口座とお支払い期限をメールでお送りします。
                </li>
                <li>
                  ・商品は通常2営業日以内に発送し、到着後7日以内にご入金ください。
                </li>
                <li>
                  ・振込手数料は恐れ入りますがお客様負担でお願いいたします。
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {message ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">
          {updating ? "送料を再計算中です…" : amountLabel}
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {submitting
            ? paymentMethod === "card"
              ? "決済処理中…"
              : "送信中…"
            : paymentMethod === "card"
            ? "カードで支払う"
            : "郵便振込で注文を確定する"}
        </button>
      </div>
    </form>
  );
}
