import Link from "next/link";
import { type Locale } from "@/i18n/locales";
import { NewsCard } from "@/lib/models/news";

type Props = {
  item: NewsCard;
  lang: Locale;
};

export function NewsListItem({ item, lang }: Props) {
  return (
    <Link
      href={`/${lang}/news/${item.slug}`}
      className="block border-t border-gray-300 hover:bg-gray-50 transition-colors"
    >
      <div className="py-8 px-4 sm:px-6">
        {/* 日付とカテゴリ */}
        <div className="flex items-center gap-4 mb-3">
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
          {item.category_name && (
            <span className="inline-block px-4 py-1 text-sm border border-gray-800 text-gray-800">
              {item.category_name}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h2 className="text-lg text-gray-800 leading-relaxed">
          {item.title}
        </h2>
      </div>
    </Link>
  );
}
