import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              オトナラシ 管理画面
            </h1>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              サイトを表示 →
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  ダッシュボード
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                >
                  商品管理
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/artisans"
                  className="block px-4 py-2 text-gray-400 rounded-md cursor-not-allowed"
                >
                  職人管理（未実装）
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/news"
                  className="block px-4 py-2 text-gray-400 rounded-md cursor-not-allowed"
                >
                  お知らせ管理（未実装）
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className="block px-4 py-2 text-gray-400 rounded-md cursor-not-allowed"
                >
                  注文管理（未実装）
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
