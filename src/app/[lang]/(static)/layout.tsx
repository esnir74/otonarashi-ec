// src/app/[lang]/(static)/layout.tsx
import "@/app/globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { locales } from "@/i18n/locales";
import { NextIntlClientProvider } from "next-intl";

export const dynamic = "force-static";

// このレイアウト配下（= (static) グループ）をロケールごとに事前生成
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function StaticLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // メッセージはビルド時解決されるので静的化OK
  const messages = (await import(`@/messages/${lang}.json`)).default;

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <Header />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
