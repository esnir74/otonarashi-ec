import ProductCardComponent from "@/components/product/ProductCardComponent";
import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/repositories/products";
import { isOk } from "@/lib/types/result";
import { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "products", "products");
}

export default async function ProductsPage({ params }: Props) {
  const { lang } = await params;

  // Repository経由でデータ取得
  const result = await getProducts(lang);

  if (!isOk(result)) {
    console.error("Failed to fetch products:", result.error);
    return (
      <div>
        <h1>Products</h1>
        <p>Failed to load products.</p>
      </div>
    );
  }

  const products = result.value;
  console.log(products);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー部分 - ロゴ */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-gray-800 my-7">Online Shop</h1>
      </div>

      {/* 商品グリッド */}
      <div className="px-6 md:px-12 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-0 gap-y-12 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCardComponent key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
