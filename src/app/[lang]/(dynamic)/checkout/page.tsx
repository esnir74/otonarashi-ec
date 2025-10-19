"use client";

import {
  AddressUpdate,
  CheckoutForm,
} from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { type Locale } from "@/i18n/locales";
import {
  formatAmountFromYen,
  FxRate,
  SupportedCurrency,
} from "@/lib/checkout/currency";
import { useCartStore } from "@/store/cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementLocale } from "@stripe/stripe-js";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CURRENCY_OPTIONS: Array<{
  value: SupportedCurrency;
  label: string;
  suffix: string;
}> = [
  { value: "JPY", label: "JPY", suffix: "¥" },
  { value: "USD", label: "USD", suffix: "$" },
  { value: "EUR", label: "EUR", suffix: "€" },
];

type FxRateResponse = {
  rate: FxRate;
};

type PaymentIntentResponse = {
  ok: true;
  clientSecret: string;
  piId: string;
  currency: SupportedCurrency;
  amountMinor: number;
  subtotalYen: number;
  shippingYen: number;
  totalYen: number;
};

type PaymentIntentUpdateResponse = {
  ok: true;
  currency: SupportedCurrency;
  amountMinor: number;
  subtotalYen: number;
  shippingYen: number;
  totalYen: number;
};

function mapCreateIntentFailure(reason: string) {
  switch (reason) {
    case "empty_cart":
      return "empty_cart";
    case "product_not_found":
    case "unavailable":
      return "out_of_stock";
    case "price_mismatch":
      return "price_mismatch";
    case "missing_fx_rate":
      return "missing_fx_rate";
    case "invalid_session":
      return "session_invalid";
    default:
      return "checkout_error";
  }
}

function mapUpdateShippingFailure(reason: string) {
  switch (reason) {
    case "empty_items":
      return "empty_cart";
    case "session_mismatch":
      return "session_invalid";
    case "currency_mismatch":
      return "currency_mismatch";
    case "fx_conversion_failed":
    case "missing_fx_rate":
      return "missing_fx_rate";
    default:
      return "checkout_error";
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams<{ lang: Locale }>();
  const currentLang: StripeElementLocale = params?.lang ?? "ja";
  const cartItems = useCartStore((state) => state.items);

  const summaryItems = useMemo(
    () =>
      cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      })),
    [cartItems]
  );

  const fallbackSubtotal = useMemo(
    () =>
      summaryItems.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
      ),
    [summaryItems]
  );

  const [sessionId, setSessionId] = useState<string>();
  const [piId, setPiId] = useState<string>();
  const [piToReplace, setPiToReplace] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>();

  const [country, setCountry] = useState<string>("JP");
  const [currency, setCurrency] = useState<SupportedCurrency>("JPY");
  const [fxRate, setFxRate] = useState<FxRate>();
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState<string>();

  const [subtotalYen, setSubtotalYen] = useState<number>();
  const [shippingYen, setShippingYen] = useState<number>();
  const [totalYen, setTotalYen] = useState<number>();

  const [updating, setUpdating] = useState(false);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [error, setError] = useState<string>();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const failurePath = useCallback(
    (reason: string) =>
      `/${currentLang}/checkout/failure?reason=${encodeURIComponent(reason)}`,
    [currentLang]
  );

  const redirectToFailure = useCallback(
    (reason: string) => {
      setError(undefined);
      router.replace(failurePath(reason));
    },
    [router, failurePath]
  );

  const shippingCalculated = typeof shippingYen === "number";
  const subtotalYenValue = subtotalYen ?? fallbackSubtotal;
  const shippingYenValue = shippingYen ?? 0;
  const totalYenValue = shippingCalculated
    ? totalYen ?? subtotalYenValue + shippingYenValue
    : subtotalYenValue;

  const formatAmount = useCallback(
    (yen: number) => {
      try {
        return formatAmountFromYen(yen, currency, fxRate);
      } catch {
        return "—";
      }
    },
    [currency, fxRate]
  );

  const totalDisplay = shippingCalculated ? formatAmount(totalYenValue) : "—";

  const amountLabel = useMemo(() => {
    if (creatingIntent) return "決済金額を準備しています…";
    if (shippingCalculated) return `合計 ${formatAmount(totalYenValue)}`;
    return "合計を計算しています…";
  }, [creatingIntent, shippingCalculated, formatAmount, totalYenValue]);

  useEffect(() => {
    let cancelled = false;
    async function fetchFx() {
      setFxLoading(true);
      try {
        const res = await fetch("/api/fx-rate");
        if (!res.ok) throw new Error("fx_failed");
        const data = (await res.json()) as FxRateResponse;
        if (!cancelled) {
          setFxRate(data.rate);
          setFxError(undefined);
        }
      } catch (caught) {
        console.error("[checkout] fx-rate fetch failed", caught);
        if (!cancelled) {
          setFxError(
            "為替レートを取得できませんでした。時間を置いて再度お試しください。"
          );
        }
      } finally {
        if (!cancelled) setFxLoading(false);
      }
    }

    void fetchFx();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (sessionId) return;

    const controller = new AbortController();
    let cancelled = false;

    async function createSession() {
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
        if (!cancelled) {
          setSessionId(newSessionId);
        }
      } catch (caughtError) {
        if (cancelled) return;
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }
        console.error(caughtError);
        setError(
          "チェックアウトを開始できませんでした。ページを再読み込みしてください。"
        );
      }
    }

    void createSession();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    if (clientSecret) return;
    if (currency !== "JPY" && !fxRate) return;

    const controller = new AbortController();
    let cancelled = false;

    async function createPaymentIntent() {
      setCreatingIntent(true);
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            country,
            sessionId,
            currency,
            fxRate: currency === "JPY" ? undefined : fxRate,
            replacePiId: piToReplace,
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 401 || res.status === 403) {
          redirectToFailure("session_invalid");
          return;
        }
        if (!res.ok) {
          const failureReason = mapCreateIntentFailure(
            (data?.reason as string | undefined) ?? ""
          );
          redirectToFailure(failureReason);
          return;
        }
        const payload = data as PaymentIntentResponse;
        setClientSecret(payload.clientSecret);
        setPiId(payload.piId);
        setSubtotalYen(payload.subtotalYen);
        setShippingYen(payload.shippingYen);
        setTotalYen(payload.totalYen);
        setPiToReplace(undefined);
        setError(undefined);
      } catch (caughtError) {
        if (cancelled) return;
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }
        console.error(caughtError);
        redirectToFailure("checkout_error");
      } finally {
        if (!cancelled) setCreatingIntent(false);
      }
    }

    void createPaymentIntent();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [sessionId, clientSecret, currency, fxRate, country, piToReplace, redirectToFailure]);

  const onAddressChangeAction = useCallback(
    async (update: AddressUpdate) => {
      const nextCountry = update.address.country || "JP";
      setCountry(nextCountry);

      if (!piId || !sessionId) return;
      if (!update.complete && !update.address.country) return;
      if (creatingIntent) return;
      if (currency !== "JPY" && !fxRate) return;

      setUpdating(true);
      const payloadAddress = {
        country: update.address.country ?? undefined,
        postalCode: update.address.postal_code ?? undefined,
        state: update.address.state ?? undefined,
        city: update.address.city ?? undefined,
        line1: update.address.line1 ?? undefined,
        line2: update.address.line2 ?? undefined,
      };
      const payloadContact = {
        fullName: update.contact.fullName ?? undefined,
        phone: update.contact.phone ?? undefined,
        email: update.contact.email ?? undefined,
      };
      try {
        const res = await fetch("/api/payment-intent", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "recalculate_shipping",
            piId,
            sessionId,
            country: nextCountry,
            currency,
            fxRate: currency === "JPY" ? undefined : fxRate,
            address: payloadAddress,
            contact: payloadContact,
          }),
        });
        const data = await res.json();
        if (res.status === 401 || res.status === 403) {
          console.error("[checkout] payment-intent update failed", {
            status: res.status,
            piId,
            sessionId,
            response: data,
          });
          redirectToFailure("session_invalid");
          return;
        }
        if (!res.ok) {
          const failureReason = mapUpdateShippingFailure(
            (data?.reason as string | undefined) ?? ""
          );
          redirectToFailure(failureReason);
          return;
        }

        const payload = data as PaymentIntentUpdateResponse;
        setSubtotalYen(payload.subtotalYen);
        setShippingYen(payload.shippingYen);
        setTotalYen(payload.totalYen);
        setError(undefined);
      } catch (caughtError) {
        console.error(caughtError);
        redirectToFailure("checkout_error");
      } finally {
        setUpdating(false);
      }
    },
    [piId, sessionId, creatingIntent, currency, fxRate, redirectToFailure]
  );

  const handleCurrencyChange = useCallback(
    (nextCurrency: SupportedCurrency) => {
      if (nextCurrency === currency) return;
      if (nextCurrency !== "JPY" && !fxRate) {
        return;
      }

      setCurrency(nextCurrency);
      setPiToReplace(piId);
      setClientSecret(undefined);
      setPiId(undefined);
      setSubtotalYen(undefined);
      setShippingYen(undefined);
      setTotalYen(undefined);
    },
    [currency, fxRate, piId]
  );

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-neutral-900">
            チェックアウトの準備中にエラーが発生しました
          </h1>
          <p className="mt-3 text-sm text-neutral-600">{error}</p>
          <button
            type="button"
            onClick={() => location.reload()}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            ページを再読み込み
          </button>
        </div>
      </main>
    );
  }

  if (!clientSecret || !sessionId || !piId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-600">
          チェックアウトを準備しています…
        </p>
      </main>
    );
  }

  return (
    <main className="bg-neutral-100 pb-16 pt-10">
      <div className="container">
        <header className="mb-8 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            OTONARASHI Checkout
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900">
            ご注文内容の確認とお支払い
          </h1>
          <p className="text-sm text-neutral-600">
            ご連絡先と配送先をご入力の上、お支払い方法をお選びください。
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <label
            htmlFor="currency-select"
            className="text-sm font-medium text-neutral-700"
          >
            表示通貨
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(event) =>
              handleCurrencyChange(event.target.value as SupportedCurrency)
            }
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
            disabled={creatingIntent || updating || fxError !== undefined}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} disabled={option.value !== "JPY" && !fxRate}>
                {option.label} {option.suffix}
              </option>
            ))}
          </select>
          {fxLoading ? (
            <span className="text-xs text-neutral-500">
              為替レートを取得中…
            </span>
          ) : fxError ? (
            <span className="text-xs text-red-500">{fxError}</span>
          ) : null}
        </div>

        <div className="mb-8 lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((state) => !state)}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-left text-sm font-medium text-neutral-900 shadow-sm"
          >
            <span>注文内容</span>
            <span className="text-base font-semibold">{totalDisplay}</span>
          </button>
          {summaryOpen ? (
            <CheckoutSummary
              className="mt-4"
              items={summaryItems}
              subtotalYen={subtotalYenValue}
              shippingYen={shippingYen}
              totalYen={shippingCalculated ? totalYenValue : undefined}
              shippingCalculated={shippingCalculated}
              formatAmount={formatAmount}
            />
          ) : null}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#111111",
                  colorText: "#111111",
                  borderRadius: "12px",
                },
              },
              locale: currentLang,
            }}
          >
            <CheckoutForm
              onAddressChangeAction={onAddressChangeAction}
              updating={updating}
              amountLabel={amountLabel}
              lang={currentLang}
              piId={piId}
              onPaymentFailure={redirectToFailure}
            />
          </Elements>

          <CheckoutSummary
            className="hidden lg:block"
            items={summaryItems}
            subtotalYen={subtotalYenValue}
            shippingYen={shippingYen}
            totalYen={shippingCalculated ? totalYenValue : undefined}
            shippingCalculated={shippingCalculated}
            formatAmount={formatAmount}
          />
        </div>
      </div>
    </main>
  );
}
