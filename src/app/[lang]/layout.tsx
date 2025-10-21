// src/app/[lang]/layout.tsx
import "@/app/globals.css";
import CartHydrator from "@/components/cart/CartHydrator";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Locale, locales } from "@/i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { readCartSnapshot } from "@/lib/cartCookie";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const snap = await readCartSnapshot();
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  // メッセージを読み込み
  const messages = (await import(`@/messages/${lang}.json`)).default;

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <Header initialCount={snap.items.length} />
      <CartHydrator initialSnapshot={snap} />
      <main className="flex-1 pt-[var(--header-height,64px)]">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
