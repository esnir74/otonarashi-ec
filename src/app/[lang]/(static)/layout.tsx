import { type Locale } from "@/i18n/locales";
import { getMessages } from "@/lib/i18n";
import type { Metadata } from "next";
import { createTranslator } from "next-intl";

export const dynamic = "force-static";

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ps = await params;
  const messages = await getMessages(ps.lang);
  const t = createTranslator({ locale: ps.lang, messages });

  return {
    title: t("seo.home.title"),
    description: t("seo.home.description"),
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja",
        en: "https://otonarashi.jp/en",
        zh: "https://otonarashi.jp/zh",
      },
    },
  };
}

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
