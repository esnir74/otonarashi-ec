import { type Locale } from "@/i18n/locales";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  // メッセージを直接読み込んでメタデータを生成
  const messages = (await import(`@/messages/${lang}.json`)).default;
  const seo = messages.seo.products;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja/products",
        en: "https://otonarashi.jp/en/products",
        zh: "https://otonarashi.jp/zh/products",
      },
    },
  };
}

export const revalidate = 60;

export default async function ProductsPage({ params }: Props) {
  await params;

  return (
    <div className="min-h-[calc(100vh-var(--header-height,64px))] bg-white flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 tracking-wider animate-fade-slide-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
          Online Store
        </h1>
        <div className="w-24 h-px bg-gray-300 mx-auto animate-scale-x opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]"></div>
        <p className="text-lg md:text-xl text-gray-500 font-light tracking-wide animate-fade-slide-up opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards]">
          Coming Soon
        </p>
      </div>
    </div>
  );
}
