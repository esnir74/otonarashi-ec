import { z } from "zod";

export const contactFormSchema = z
  .object({
    name: z.string().min(1, "お名前を入力してください"),
    companyName: z
      .string()
      .optional()
      .transform((value) => value?.trim() ?? ""),
    phone: z
      .string()
      .min(1, "電話番号を入力してください")
      .regex(
        /^[\d\-+()]+$/,
        "電話番号は数字、ハイフン、括弧、プラス記号のみ使用できます"
      ),
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("正しいメールアドレスを入力してください"),
    emailConfirmation: z
      .string()
      .min(1, "確認用メールアドレスを入力してください")
      .email("正しいメールアドレスを入力してください"),
    message: z.string().min(1, "お問い合わせ内容を入力してください"),
  })
  .refine((data) => data.email === data.emailConfirmation, {
    message: "メールアドレスが一致しません",
    path: ["emailConfirmation"],
  });

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormFormValues = z.input<typeof contactFormSchema>;
