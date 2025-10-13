// src/app/[lang]/(dynamic)/layout.tsx
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { NextIntlClientProvider } from "next-intl";

export default async function DynamicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // 翻訳メッセージ
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`@/messages/${lang}.json`)).default;
  } catch {
    messages = (await import(`@/messages/ja.json`)).default;
  }

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <Header />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
