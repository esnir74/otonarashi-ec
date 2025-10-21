import { getProducts } from "@/lib/repositories/products";
import { isOk } from "@/lib/types/result";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 統計情報を取得
  const productsResult = await getProducts("ja");
  const productsCount = isOk(productsResult) ? productsResult.value.length : 0;

  const stats = [
    { label: "商品数", value: productsCount, link: "/admin/products" },
    { label: "職人数", value: "-", link: "/admin/artisans" },
    { label: "お知らせ", value: "-", link: "/admin/news" },
    { label: "注文数", value: "-", link: "/admin/orders" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </Link>
        ))}
      </div>

      {/* クイックアクション */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <div className="text-4xl mb-2">+</div>
            <div className="text-sm font-medium text-gray-700">
              新規商品追加
            </div>
          </Link>
          <button
            disabled
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 cursor-not-allowed"
          >
            <div className="text-4xl mb-2">📰</div>
            <div className="text-sm font-medium">お知らせ投稿（未実装）</div>
          </button>
          <button
            disabled
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 cursor-not-allowed"
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="text-sm font-medium">職人追加（未実装）</div>
          </button>
        </div>
      </div>

      {/* 最近の活動 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">システム情報</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 画像アップロード: Supabase Storage</p>
          <p>• 画像最適化: 自動4サイズ生成（400/800/1600/2400px）</p>
          <p>• Blur Placeholder: 自動生成済み</p>
          <p>• 決済: Stripe（未実装）</p>
          <p>• メール送信: SendGrid（未実装）</p>
        </div>
      </div>
    </div>
  );
}
