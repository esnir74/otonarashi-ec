import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { getProductBySlug } from "@/lib/repositories/products";
import { isOk } from "@/lib/types/result";
import { Metadata } from "next";
import Image from "next/image";

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
    description: product.description.substring(0, 160) || `${product.name}｜¥${product.price_cents.toLocaleString()}｜一点ものの着物アップサイクル。`,
    openGraph: {
      title: product.name,
      description: `¥${product.price_cents.toLocaleString()} - ${product.name}`,
      images: product.main_image_url ? [product.main_image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang, slug } = await params;

  const result = await getProductBySlug(slug, lang);
  if (!isOk(result)) {
    console.error("Failed to fetch product:", result.error);
    return <div>Failed to load product.</div>;
  }

  const product = result.value;
  console.log(product);
  const isComingSoon = product.sale_start_at
    ? new Date(product.sale_start_at) > new Date()
    : false;

  // 発売日のフォーマット例: 10月05日 00:00 
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

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ¥{product.price_cents.toLocaleString()}</p>
      <p>Status: {product.status}</p>
      <p>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
      <p>
        {isComingSoon ? `Coming Soon : ${formattedDate}発売` : "Available Now"}
      </p>
      {product.main_image_url && (
        <div className="my-4 relative w-64 h-64">
          <Image
            src={product.main_image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 75vw, 100vw"
            placeholder={product.main_image_blur ? "blur" : "empty"}
            blurDataURL={product.main_image_blur || undefined}
            className="object-cover rounded-md"
          />
        </div>
      )}
      {product.sub_image_urls.length > 0 && (
        <div className="flex space-x-4 my-4">
          {product.sub_image_urls.map((url, index) => {
            const blurData = product.sub_image_blurs?.[index];
            return (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={url}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  sizes="200px"
                  placeholder={blurData ? "blur" : "empty"}
                  blurDataURL={blurData || undefined}
                  className="object-cover rounded-md"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
