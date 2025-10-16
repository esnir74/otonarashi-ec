import { createClient } from "@/lib/supabaseClient";
import { isOk } from "@/lib/types/result";
import ImageUploader from "../../_components/ImageUploader";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;

  // 商品情報を取得
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_translations!inner(title, description, lang),
      product_images(id, variants, blur_data, is_main, sort, key)
    `
    )
    .eq("id", id)
    .eq("product_translations.lang", "ja")
    .single();

  if (error || !product) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">商品編集</h1>
        <p className="text-red-600">商品の読み込みに失敗しました。</p>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          ← 商品一覧に戻る
        </Link>
      </div>
    );
  }

  const translation = Array.isArray(product.product_translations)
    ? product.product_translations[0]
    : product.product_translations;

  const images = Array.isArray(product.product_images)
    ? product.product_images
    : product.product_images
    ? [product.product_images]
    : [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-blue-600 hover:underline text-sm"
        >
          ← 商品一覧に戻る
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">商品編集</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">基本情報</h2>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">商品ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{product.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">スラッグ</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.slug}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">商品名</dt>
            <dd className="mt-1 text-sm text-gray-900">{translation?.title}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">説明</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {translation?.description}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">価格</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ¥{product.price_cents.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">在庫</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === "published"
                      ? "bg-green-100 text-green-800"
                      : product.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status}
                </span>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">画像管理</h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            新しい画像をアップロード
          </h3>
          <ImageUploader productId={product.id} />
          <p className="text-xs text-gray-500 mt-2">
            ※ 画像は自動的に4サイズ（400/800/1600/2400px）に最適化されます
          </p>
        </div>

        {images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              登録済み画像 ({images.length}件)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images
                .sort((a, b) => a.sort - b.sort)
                .map((img) => {
                  const variants =
                    typeof img.variants === "object" && img.variants !== null
                      ? (img.variants as Record<string, string>)
                      : {};
                  const thumbUrl = variants["400"] || variants["800"];

                  return (
                    <div
                      key={img.id}
                      className={`relative border-2 rounded-lg p-2 ${
                        img.is_main ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      {img.is_main && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          メイン
                        </span>
                      )}
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={`Product image ${img.sort}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                          No Preview
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        Sort: {img.sort}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Link
          href={`/ja/products/${product.slug}`}
          target="_blank"
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
        >
          プレビュー
        </Link>
        <button
          disabled
          className="bg-gray-300 text-gray-500 px-6 py-2 rounded-md cursor-not-allowed"
        >
          編集機能（未実装）
        </button>
      </div>
    </div>
  );
}
