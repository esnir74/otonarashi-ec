import ProductCardComponent from "@/components/layout/ProductCardComponent";
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
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Products List</h1>
      <p className="text-gray-600 mb-6">Total: {products.length} items</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCardComponent key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
