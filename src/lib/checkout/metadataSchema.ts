import { z } from "zod";
export const paymentIntentItemSchema = z.object({
  id: z.string().min(1, "id is required"),
  unit_amount_yen: z.number().int().nonnegative(),
  name: z.string().min(1, "name is required"),
  quantity: z.number().int().positive(),
});

export const paymentIntentMetadataSchema = z.object({
  session_id: z.string().min(1),
  order_number: z.string().min(1),
  items_subtotal_amount: z.number(),
  shipping_amount: z.number(),
  items: z.array(paymentIntentItemSchema),
  items_subtotal_yen: z.int(),
  shipping_yen: z.int(),
  total_yen: z.int(),
  payment_method: z.enum(["card", "postal_transfer"]),
  lang: z.enum(["ja", "en", "zh"]),
  org_name: z.string().optional(),
  fx_rate: z.number(),
  exchange_rate_timestamp: z.string().refine(
    (value) => {
      if (!value) return true;
      const time = Date.parse(value);
      return Number.isFinite(time);
    },
    { message: "exchange_rate_timestamp must be ISO8601 string" }
  ),
});

export type PaymentIntentItem = z.infer<typeof paymentIntentItemSchema>;

export type PaymentIntentMetadataInput = z.input<
  typeof paymentIntentMetadataSchema
>;

export function buildPaymentIntentMetadata(
  input: PaymentIntentMetadataInput
): Record<string, string> {
  const metadata = paymentIntentMetadataSchema.parse(input);
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (key === "items") {
      // items配列はJSON文字列として保存
      result.items_json = JSON.stringify(value);
    } else if (typeof value === "string") {
      result[key] = value;
    } else if (typeof value === "number") {
      result[key] = String(value);
    }
  }
  return result;
}
