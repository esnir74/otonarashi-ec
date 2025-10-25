import type { Locale } from "@/i18n/locales";
import { getLatestNews } from "@/lib/repositories/news";
import { isOk } from "@/lib/types/result";
import Image from "next/image";
import Link from "next/link";

type HomeNewsSectionProps = {
  lang: Locale;
  maxItems?: number;
};

export default async function HomeNewsSection({
  lang,
  maxItems = 2,
}: HomeNewsSectionProps) {
  const result = await getLatestNews(lang, maxItems);

  if (!isOk(result)) {
    console.error("[HomeNewsSection] Failed to fetch latest news:", result.error);
    return null;
  }

  const news = result.value.slice(0, maxItems);

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-16">
          News
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {news.map((item, index) => (
            <Link
              key={item.id}
              href={`/${lang}/news/${item.slug}`}
              className={`group block bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                index === 1 ? "hidden md:block" : ""
              }`}
            >
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {item.eyecatch_url ? (
                  <Image
                    src={item.eyecatch_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                <time className="text-sm text-gray-600">
                  {item.published_at
                    ? new Date(item.published_at)
                        .toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\//g, ".")
                    : "2025.00.00"}
                </time>
                <h3 className="text-lg text-gray-900 font-medium leading-relaxed group-hover:text-gray-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${lang}/news`}
            className="inline-block border-2 border-gray-800 text-gray-800 px-12 py-4 hover:bg-gray-800 hover:text-white transition-colors duration-300 text-sm tracking-widest"
          >
            More News
          </Link>
        </div>
      </div>
    </section>
  );
}
