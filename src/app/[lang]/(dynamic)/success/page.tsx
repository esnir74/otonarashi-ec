export const dynamic = "force-dynamic";

import { type Locale } from "@/i18n/locales";
import { CheckoutSuccessContent } from "@/components/checkout/CheckoutSuccessContent";
import { getCheckoutStatus } from "@/lib/checkout";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import PendingClient from "./PendingClient";

type Props = {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ pi_id?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const messages = (await import(`@/messages/${lang}.json`)).default;
  const seo = messages.seo.success;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja/success",
        en: "https://otonarashi.jp/en/success",
        zh: "https://otonarashi.jp/zh/success",
      },
    },
  };
}

export default async function SuccessPage({ params: paramsPromise, searchParams }: Props) {
  noStore();
  const { lang } = await paramsPromise;
  const query = await searchParams;

  const piId = query.pi_id;
  if (!piId) redirect(`/${lang}`);

  const status = await getCheckoutStatus(piId, { maxWaitMs: 800 });

  if (status === "ok") {
    return <CheckoutSuccessContent lang={lang} />;
  }

  if (status === "abandoned") {
    redirect(`/${lang}/checkout/failure?reason=abandoned`);
  }

  // pending → すぐ描画し、最小クライアントでポーリングへ
  return (
    <section id="success">
      <h1>お支払いを確認中です…</h1>
      <PendingClient
        paymentIntentId={piId}
        cancelHref={`/${lang}/checkout/failure?reason=abandoned`}
        lang={lang}
      />
    </section>
  );
}
