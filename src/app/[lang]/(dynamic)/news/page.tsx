import { type Locale } from "@/i18n/locales";
import { getNews } from "@/lib/repositories/news";
import { isOk } from "@/lib/types/result";
import { Metadata } from "next";
import { NewsListItem } from "@/components/news/NewsListItem";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const messages = (await import(`@/messages/${lang}.json`)).default;
  const seo = messages.seo.news;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja/news",
        en: "https://otonarashi.jp/en/news",
        zh: "https://otonarashi.jp/zh/news",
      },
    },
  };
}

export const revalidate = 60;

export default async function NewsPage({ params }: Props) {
  const { lang } = await params;

  const result = await getNews(lang);

  if (!isOk(result)) {
    console.error("Failed to fetch news:", result.error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">News</h1>
          <p className="text-gray-600">Failed to load news.</p>
        </div>
      </div>
    );
  }

  const news = result.value;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-gray-800 mb-2">News</h1>
        </div>

        {/* ニュースリスト */}
        <div className="space-y-0">
          {news.map((item) => (
            <NewsListItem key={item.id} item={item} lang={lang} />
          ))}
        </div>

        {/* 最後のボーダー */}
        <div className="border-t border-gray-300"></div>
      </div>
    </div>
  );
}
