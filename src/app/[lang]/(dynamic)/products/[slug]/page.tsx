import AddToCartButton from "@/components/product/AddToCartButton";
import ProductGallery from "@/components/product/ProductGallery";
import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { getProductBySlug } from "@/lib/repositories/products";
import { isOk } from "@/lib/types/result";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const result = await getProductBySlug(slug, lang);

  if (!isOk(result)) {
    return createPageMetadata(lang, "products", "products");
  }

  const product = result.value;
  return {
    title: `${product.name} – オトナラシ`,
    description:
      product.description.substring(0, 160) ||
      `${
        product.name
      }｜¥${product.price_yen.toLocaleString()}｜一点ものの着物アップサイクル。`,
    openGraph: {
      title: product.name,
      description: `¥${product.price_yen.toLocaleString()} - ${product.name}`,
      images: product.main_image_url ? [product.main_image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const t = await getTranslations({ locale: lang, namespace: "product" });

  const result = await getProductBySlug(slug, lang);
  if (!isOk(result)) {
    console.error("Failed to fetch product:", result.error);
    return (
      <div className="px-4 py-10 text-sm text-red-600">
        Failed to load product.
      </div>
    );
  }

  const product = result.value;

  const isComingSoon = product.sale_start_at
    ? new Date(product.sale_start_at) > new Date()
    : false;

  const formattedDate = product.sale_start_at
    ? new Date(product.sale_start_at).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  // 画像配列（メイン＋サブ）
  const images = [
    ...(product.main_image_url ? [product.main_image_url] : []),
    ...product.sub_image_urls,
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* ギャラリー（左） */}
        <ProductGallery
          images={images}
          productName={product.name}
          mainImageBlur={product.main_image_blur}
          subImageBlurs={product.sub_image_blurs}
        />

        {/* 情報（右） */}
        <aside className="lg:col-span-5">
          {/* タイトル＆価格（モバイル：上、デスクトップ：右カラム） */}
          <div className="mb-4">
            <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <div className="mt-1 text-lg lg:text-xl font-medium text-slate-900">
              ¥{product.price_yen.toLocaleString()}
            </div>
          </div>

          {/* Coming soon / 発売日 */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {isComingSoon ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                {t("comingSoon")}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                {t("inStock")}
              </span>
            )}

            {isComingSoon && formattedDate && (
              <span className="text-sm text-neutral-600">
                {t("releaseDate", { date: formattedDate })}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mb-6">
            <AddToCartButton
              item={{
                id: product.id,
                name: product.name,
                price: product.price_yen,
                lang,
              }}
              disabled={isComingSoon}
              label={isComingSoon ? t("preRelease") : undefined}
            />
          </div>

          {/* 説明 */}
          <div className="prose prose-neutral max-w-none text-sm leading-7 md:text-base">
            {product.description ? (
              <div
              // すでに整形済みテキストを想定。HTMLをそのまま差し込みたい場合はdangerouslySetInnerHTMLに変更
              >
                <p className="whitespace-pre-line">{product.description}</p>
              </div>
            ) : (
              <p className="text-neutral-500">{t("noDescription")}</p>
            )}
          </div>

          {/* 戻るリンク */}
          <div className="mt-10 border-t pt-6">
            <a
              href={`/${lang}/products`}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-800"
            >
              <span aria-hidden>←</span> {t("backToList")}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
