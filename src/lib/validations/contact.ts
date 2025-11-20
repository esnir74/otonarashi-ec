import { z } from "zod";

export const createContactFormSchema = (t: (key: string) => string) => {
  return z
    .object({
      name: z.string().min(1, t("validation.nameRequired")),
      companyName: z
        .string()
        .optional()
        .transform((value) => value?.trim() ?? ""),
      phone: z
        .string()
        .min(1, t("validation.phoneRequired"))
        .regex(/^[\d\-+()]+$/, t("validation.phoneInvalid")),
      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .email({ message: t("validation.emailInvalid") }),
      emailConfirmation: z
        .string()
        .min(1, t("validation.emailConfirmationRequired"))
        .email({ message: t("validation.emailInvalid") }),
      message: z.string().min(1, t("validation.messageRequired")),
    })
    .refine((data) => data.email === data.emailConfirmation, {
      message: t("validation.emailMismatch"),
      path: ["emailConfirmation"],
    });
};

export type ContactFormSchema = ReturnType<typeof createContactFormSchema>;
export type ContactFormData = z.infer<ContactFormSchema>;
export type ContactFormFormValues = z.input<ContactFormSchema>;

// Default schema for server-side validation (Japanese)
export const contactFormSchema = createContactFormSchema((key) => {
  const messages: Record<string, string> = {
    "validation.nameRequired": "お名前を入力してください",
    "validation.phoneRequired": "電話番号を入力してください",
    "validation.phoneInvalid": "電話番号は数字、ハイフン、括弧、プラス記号のみ使用できます",
    "validation.emailRequired": "メールアドレスを入力してください",
    "validation.emailInvalid": "正しいメールアドレスを入力してください",
    "validation.emailConfirmationRequired": "確認用メールアドレスを入力してください",
    "validation.emailMismatch": "メールアドレスが一致しません",
    "validation.messageRequired": "お問い合わせ内容を入力してください",
  };
  return messages[key] || key;
});
