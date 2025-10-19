export type SupportedCurrency = "JPY" | "USD" | "EUR";

export type FxRate = {
  /** USD per 1 JPY */
  usdRate: number;
  /** EUR per 1 JPY */
  eurRate: number;
};

function assertFxRate(
  currency: SupportedCurrency,
  fxRate: FxRate | undefined
): asserts fxRate is FxRate {
  if (currency === "JPY") return;
  if (!fxRate) {
    throw new Error("FX rate is required for non-JPY currency");
  }
}

export function currencyToStripeCode(currency: SupportedCurrency): string {
  return currency.toLowerCase();
}

export function convertYenToCurrencyValue(
  amountYen: number,
  currency: SupportedCurrency,
  fxRate?: FxRate
): number {
  if (currency === "JPY") return amountYen;
  assertFxRate(currency, fxRate);
  const rate = currency === "USD" ? fxRate.usdRate : fxRate.eurRate;
  return amountYen * rate;
}

export function convertYenToMinorUnit(
  amountYen: number,
  currency: SupportedCurrency,
  fxRate?: FxRate
): number {
  if (currency === "JPY") {
    return Math.round(amountYen);
  }
  assertFxRate(currency, fxRate);
  const value = convertYenToCurrencyValue(amountYen, currency, fxRate);
  const multiplier = 100; // USD / EUR → 2 decimal places
  return Math.round(value * multiplier);
}

export function formatAmountFromYen(
  amountYen: number,
  currency: SupportedCurrency,
  fxRate?: FxRate
): string {
  const locale =
    currency === "JPY" ? "ja-JP" : currency === "USD" ? "en-US" : "de-DE";
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
  const displayValue = convertYenToCurrencyValue(amountYen, currency, fxRate);
  return formatter.format(displayValue);
}
