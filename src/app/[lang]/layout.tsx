// src/app/[lang]/layout.tsx
import "@/app/globals.css";
import CartHydrator from "@/components/cart/CartHydrator";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Locale, locales } from "@/i18n/locales";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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
  const store = await cookies();
  const c = store.get("cart_snapshot_v1")?.value;
  const snap = c ? JSON.parse(c) : { items: [], updatedAt: 0 };
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  // メッセージを読み込み
  const messages = (await import(`@/messages/${lang}.json`)).default;

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <Header initialCount={snap.items.length} />
      <CartHydrator initialSnapshot={snap} />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
