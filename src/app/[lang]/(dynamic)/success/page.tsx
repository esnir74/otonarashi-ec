export const dynamic = "force-dynamic";

import { type Locale } from "@/i18n/locales";
import { ClearCartEffect } from "@/components/checkout/ClearCartEffect";
import { RevalidateProductsEffect } from "@/components/checkout/RevalidateProductsEffect";
import { getCheckoutStatus } from "@/lib/checkout";
import { createPageMetadata } from "@/lib/metadata";
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
  return createPageMetadata(lang, "success", "success");
}

export default async function SuccessPage({ params: paramsPromise, searchParams }: Props) {
  noStore();
  const { lang } = await paramsPromise;
  const query = await searchParams;

  const piId = query.pi_id;
  if (!piId) redirect(`/${lang}`);

  const status = await getCheckoutStatus(piId, { maxWaitMs: 800 });

  if (status === "ok") {
    console.log("ok detected on SuccessPage");
    return (
      <section id="success">
        <ClearCartEffect />
        <RevalidateProductsEffect />
        <h1>ご購入ありがとうございました。</h1>
        <p>
          ご不明点は <a href="mailto:orders@example.com">orders@example.com</a>{" "}
          まで。
        </p>
      </section>
    );
  }

  if (status === "out_of_stock") {
    console.warn("out_of_stock detected on SuccessPage");
    redirect(`/${lang}?canceled=true`);
  }

  // pending → すぐ描画し、最小クライアントでポーリングへ
  return (
    <section id="success">
      <h1>お支払いを確認中です…</h1>
      <PendingClient paymentIntentId={piId} cancelHref={`/${lang}?canceled=true`} />
    </section>
  );
}
