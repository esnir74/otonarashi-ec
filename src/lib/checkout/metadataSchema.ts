import { z } from "zod";

const integerString = z
  .string()
  .regex(/^\d+$/, { message: "Must be a non-negative integer string" });

const decimalString = z
  .string()
  .regex(/^\d+(\.\d+)?$/, { message: "Must be a positive decimal string" });

export const paymentIntentItemSchema = z.object({
  id: z.string().min(1, "id is required"),
  unit_amount_yen: z.number().int().nonnegative(),
  name: z.string().min(1, "name is required"),
  quantity: z.number().int().positive(),
});

export const paymentIntentItemsSchema = z
  .array(paymentIntentItemSchema)
  .min(1, "items must not be empty");

export const paymentIntentMetadataSchema = z.object({
  session_id: z.string().min(1),
  order_number: z.string().min(1),
  items_json: z
    .string()
    .min(2)
    .superRefine((value, ctx) => {
      try {
        const parsed = JSON.parse(value);
        const result = paymentIntentItemsSchema.safeParse(parsed);
        if (!result.success) {
          result.error.issues.forEach((issue) =>
            ctx.addIssue({
              code: "custom",
              message: issue.message,
              path: ["items_json", ...(issue.path ?? [])],
            })
          );
        }
      } catch (error) {
        ctx.addIssue({
          code: "custom",
          message: "items_json must be valid JSON",
        });
      }
    }),
  items_subtotal_yen: integerString,
  shipping_yen: integerString,
  total_yen: integerString,
  payment_method: z.enum(["card", "bank_transfer"]).optional(),
  lang: z.enum(["ja", "en", "zh"]).optional(),
  org_name: z.string().optional(),
  fx_rate_usd: decimalString.optional(),
  fx_rate_eur: decimalString.optional(),
  exchange_rate_timestamp: z
    .string()
    .refine(
      (value) => {
        if (!value) return true;
        const time = Date.parse(value);
        return Number.isFinite(time);
      },
      { message: "exchange_rate_timestamp must be ISO8601 string" }
    )
    .optional(),
});

export type PaymentIntentMetadataInput = z.input<
  typeof paymentIntentMetadataSchema
>;
export type PaymentIntentMetadata = z.output<
  typeof paymentIntentMetadataSchema
>;

export type PaymentIntentItem = z.infer<typeof paymentIntentItemSchema>;

export type StripeMetadataLike = Record<string, string | null | undefined>;

export type PaymentIntentMetadataValidationSuccess = {
  ok: true;
  metadata: PaymentIntentMetadata;
  items: PaymentIntentItem[];
  numbers: {
    itemsSubtotalYen: number;
    shippingYen: number;
    totalYen: number;
    fxRateUsd?: number;
    fxRateEur?: number;
  };
};

export type PaymentIntentMetadataValidationFailure = {
  ok: false;
  reason: "metadata_invalid" | "items_invalid" | "items_json_invalid";
  issues?: z.ZodIssue[];
  cause?: unknown;
};

function parseItemsJson(itemsJson: string): PaymentIntentItem[] {
  const parsed = JSON.parse(itemsJson);
  return paymentIntentItemsSchema.parse(parsed);
}

export function buildPaymentIntentMetadata(
  input: PaymentIntentMetadataInput
): Record<string, string> {
  const metadata = paymentIntentMetadataSchema.parse(input);
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}

type ValidatePaymentIntentArgsParams = {
  metadata: StripeMetadataLike;
  currency: string | null | undefined;
};

export type PaymentIntentValidationSuccess = {
  ok: true;
  metadata: PaymentIntentMetadata;
  items: PaymentIntentItem[];
  numbers: {
    itemsSubtotalYen: number;
    shippingYen: number;
    totalYen: number;
    fxRate: number;
  };
};

export type PaymentIntentValidationFailure =
  | PaymentIntentMetadataValidationFailure
  | { ok: false; reason: "missing_fx_rate" | "unsupported_currency" };

export type PaymentIntentValidationResult =
  | PaymentIntentValidationSuccess
  | PaymentIntentValidationFailure;

function parseAndValidateMetadata(
  rawMetadata: StripeMetadataLike
):
  | PaymentIntentMetadataValidationSuccess
  | PaymentIntentMetadataValidationFailure {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawMetadata)) {
    if (typeof value === "string") {
      cleaned[key] = value;
    }
  }

  const parsed = paymentIntentMetadataSchema.safeParse(cleaned);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "metadata_invalid",
      issues: parsed.error.issues,
    };
  }

  let items: PaymentIntentItem[];
  try {
    items = parseItemsJson(parsed.data.items_json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        reason: "items_invalid",
        issues: error.issues,
      };
    }
    return {
      ok: false,
      reason: "items_json_invalid",
      cause: error,
    };
  }

  const numbers = {
    itemsSubtotalYen: Number.parseInt(parsed.data.items_subtotal_yen, 10),
    shippingYen: Number.parseInt(parsed.data.shipping_yen, 10),
    totalYen: Number.parseInt(parsed.data.total_yen, 10),
    fxRateUsd: parsed.data.fx_rate_usd
      ? Number.parseFloat(parsed.data.fx_rate_usd)
      : undefined,
    fxRateEur: parsed.data.fx_rate_eur
      ? Number.parseFloat(parsed.data.fx_rate_eur)
      : undefined,
  };

  return { ok: true, metadata: parsed.data, items, numbers };
}

const SUPPORTED_CURRENCIES = new Set(["JPY", "USD", "EUR"]);

export function validatePaymentIntentArgs({
  metadata,
  currency,
}: ValidatePaymentIntentArgsParams): PaymentIntentValidationResult {
  const metaResult = parseAndValidateMetadata(metadata);
  if (!metaResult.ok) return metaResult;

  const normalizedCurrency = (currency ?? "JPY").toUpperCase();
  if (!SUPPORTED_CURRENCIES.has(normalizedCurrency)) {
    return { ok: false, reason: "unsupported_currency" };
  }

  let fxRate = 1;
  if (normalizedCurrency !== "JPY") {
    const rate =
      normalizedCurrency === "USD"
        ? metaResult.numbers.fxRateUsd
        : metaResult.numbers.fxRateEur;
    if (!rate || rate <= 0) {
      return { ok: false, reason: "missing_fx_rate" };
    }
    fxRate = rate;
  }

  return {
    ok: true,
    metadata: metaResult.metadata,
    items: metaResult.items,
    numbers: {
      itemsSubtotalYen: metaResult.numbers.itemsSubtotalYen,
      shippingYen: metaResult.numbers.shippingYen,
      totalYen: metaResult.numbers.totalYen,
      fxRate,
    },
  };
}
