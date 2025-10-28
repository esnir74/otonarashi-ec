import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メンテナンス中 | Otonarashi",
};

export default function MaintenancePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-24">
      <div className="max-w-lg space-y-6 text-center">
        <h1 className="text-3xl font-serif text-gray-900 sm:text-4xl">
          ただいまメンテナンス中です
        </h1>
        <p className="text-base text-gray-600">
          ご不便をおかけして申し訳ありません。しばらくしてから再度アクセスしてください。
        </p>
        <p className="text-sm text-gray-400">We will be back shortly.</p>
      </div>
    </main>
  );
}
