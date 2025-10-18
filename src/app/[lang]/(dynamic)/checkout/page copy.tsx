// app/page.tsx
import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "checkout", "checkout");
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  if (canceled) {
    console.log("Order canceled -- continue to shop around.");
  }

  // 送りたい内容（固定値の例）
  const payload = {
    currency: "jpy",
    locale: "ja",
    items: [
      {
        id: "d0fb9947-5a9f-44c5-8161-2ff6f7b3112e",
        unit_amount: 3800, // 3,800円
        name: "着物アップサイクル トートバッグ",
        description: "着物生地を再構築した一点もののトートバッグ",
        image:
          "https://pleased-rose-4nfebgyj2u.edgeone.app/PXL_20250904_154528784.jpg",
        quantity: 1,
      },
      //   {
      //     id: "5bbe8097-0185-4b36-9d7b-ca87ed3e0eb7",
      //     unit_amount: 1200, // 1,200円
      //     name: "シルクポーチ",
      //     description: "端切れ素材を使用した小物入れ",
      //     image:
      //       "https://plastic-orange-nj499nnl5x.edgeone.app/PXL_20250904_165759826.jpg",
      //     quantity: 1,
      //   },
    ],
  };

  return (
    <div>
      <main>
        <form action="/api/checkout" method="POST">
          {/* JSON を hidden に詰めて送る */}
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(payload)}
            readOnly
          />
          <section>
            <button type="submit" role="link">
              Checkout
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}
