import { type Locale } from "@/i18n/locales";
import { getNewsById } from "@/lib/repositories/news";
import { isOk } from "@/lib/types/result";
import { Metadata } from "next";
import Image from "next/image";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const result = await getNewsById(slug, lang);

  if (!isOk(result) || !result.value) {
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

  const news = result.value;
  return {
    title: `${news.title} – Otonarashi`,
    description: news.body.substring(0, 160),
    alternates: {
      languages: {
        ja: `https://otonarashi.jp/ja/news/${slug}`,
        en: `https://otonarashi.jp/en/news/${slug}`,
        zh: `https://otonarashi.jp/zh/news/${slug}`,
      },
    },
    openGraph: {
      title: news.title,
      description: news.body.substring(0, 160),
      images: news.eyecatch_url ? [news.eyecatch_url] : [],
    },
  };
}

export const revalidate = 60;

export default async function NewsDetailPage({ params }: Props) {
  const { lang, slug } = await params;

  const result = await getNewsById(slug, lang);
  if (!isOk(result) || !result.value) {
    console.error("Failed to fetch news:", result);
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
    <article className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-12">
          {/* 日付とカテゴリ */}
          <div className="flex items-center gap-4 mb-6">
            <time className="text-sm text-gray-600">
              {news.published_at
                ? new Date(news.published_at)
                    .toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\//g, ".")
                : "2025.00.00"}
            </time>
            {news.category_name && (
              <span className="inline-block px-4 py-1 text-sm border border-gray-800 text-gray-800">
                {news.category_name}
              </span>
            )}
          </div>

          {/* タイトル */}
          <h1 className="text-4xl sm:text-5xl text-gray-800 leading-tight">
            {news.title}
          </h1>
        </header>

        {/* アイキャッチ画像 */}
        {news.eyecatch_url && (
          <div className="mb-12 relative w-full aspect-video">
            <Image
              src={news.eyecatch_url}
              alt={news.title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {/* 本文 */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: news.body }}
          />
        </div>

        {/* フッター */}
        <footer className="mt-16 pt-8 border-t border-gray-300">
          <a
            href={`/${lang}/news`}
            className="inline-block text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to News
          </a>
        </footer>
      </div>
    </article>
  );
}
