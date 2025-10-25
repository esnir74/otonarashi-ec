import { type Locale } from "@/i18n/locales";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const messages = (await import(`@/messages/${lang}.json`)).default;
  const seo = messages.seo.checkout;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja/checkout",
        en: "https://otonarashi.jp/en/checkout",
        zh: "https://otonarashi.jp/zh/checkout",
      },
    },
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
