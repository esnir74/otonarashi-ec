import type { Locale } from "@/i18n/locales";
import { unstable_cache } from "next/cache";
import { NewsCard, NewsDetail } from "../models/news";
import { createClient } from "../supabaseClient";
import { Result, err, ok } from "../types/result";

/**
 * お知らせ一覧を取得（キャッシュ付き）
 * @param lang - ロケール (ja, en, zh)
 * @returns Result<NewsCard[], Error>
 */
export async function getNews(
  lang: Locale
): Promise<Result<NewsCard[], Error>> {
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("news")
          .select(
            `
            id,
            slug,
            eyecatch_url,
            published_at,
            status,
            news_translations!inner(title, lang),
            news_category(name_ja, name_en, name_zh)
          `
          )
          .eq("news_translations.lang", lang)
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (error) {
          console.error("[getNews] Supabase error:", error);
          return err(new Error(error.message));
        }

        if (!data) {
          return ok([]);
        }
        // タイトルが存在しない場合はそのデータだけスキップする
        const news: NewsCard[] = data.flatMap((item) => {
          const trans = item.news_translations[0];
          const title = trans?.title;
          if (!title) return []; // ← 本当にスキップ（要素を入れない）

          const category = (() => {
            switch (lang) {
              case "ja":
                return item.news_category?.name_ja || "";
              case "en":
                return item.news_category?.name_en || "";
              case "zh":
                return item.news_category?.name_zh || "";
              default:
                return item.news_category?.name_ja || "";
            }
          })();

          return [
            {
              id: item.id,
              slug: item.slug,
              eyecatch_url: item.eyecatch_url,
              published_at: item.published_at,
              category_name: category,
              status: item.status,
              title,
            },
          ];
        });

        return ok(news);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("[getNews] Unexpected error:", error);
        return err(error);
      }
    },
    [`news-${lang}`],
    {
      tags: ["news"],
      revalidate: 60, // 60秒キャッシュ
    }
  );

  return cached();
}

/**
 * 最新のお知らせを上位から取得（キャッシュ付き）
 * @param lang - ロケール (ja, en, zh)
 * @param limit - 最大取得件数
 */
export async function getLatestNews(
  lang: Locale,
  limit: number = 2
): Promise<Result<NewsCard[], Error>> {
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("news")
          .select(
            `
            id,
            slug,
            eyecatch_url,
            published_at,
            status,
            news_translations!inner(title, lang),
            news_category(name_ja, name_en, name_zh)
          `
          )
          .eq("news_translations.lang", lang)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.error("[getLatestNews] Supabase error:", error);
          return err(new Error(error.message));
        }

        if (!data) {
          return ok([]);
        }

        const news: NewsCard[] = data.flatMap((item) => {
          const trans = item.news_translations[0];
          const title = trans?.title;
          if (!title) return [];

          const category = (() => {
            switch (lang) {
              case "ja":
                return item.news_category?.name_ja || "";
              case "en":
                return item.news_category?.name_en || "";
              case "zh":
                return item.news_category?.name_zh || "";
              default:
                return item.news_category?.name_ja || "";
            }
          })();

          return [
            {
              id: item.id,
              slug: item.slug,
              eyecatch_url: item.eyecatch_url,
              published_at: item.published_at,
              category_name: category,
              status: item.status,
              title,
            },
          ];
        });

        return ok(news);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("[getLatestNews] Unexpected error:", error);
        return err(error);
      }
    },
    [`latest-news-${lang}-${limit}`],
    {
      tags: ["news", "latest-news"],
      revalidate: 60,
    }
  );

  return cached();
}

/**
 * スラッグからお知らせ詳細を取得（キャッシュ付き）
 * @param slug - お知らせスラッグ
 * @param lang - ロケール
 * @returns Result<NewsDetail | null, Error>
 */
export async function getNewsById(
  slug: string,
  lang: Locale
): Promise<Result<NewsDetail | null, Error>> {
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("news")
          .select(
            `
            *,
            news_translations!inner(title, body, lang),
            news_category(name_ja, name_en, name_zh, slug)
          `
          )
          .eq("slug", slug)
          .eq("news_translations.lang", lang)
          .single();

        if (error) {
          console.error("[getNewsById] Supabase error:", error);
          return err(new Error(error.message));
        }

        if (!data) {
          return err(new Error("News not found"));
        }

        const category = (() => {
          switch (lang) {
            case "ja":
              return data.news_category?.name_ja || "";
            case "en":
              return data.news_category?.name_en || "";
            case "zh":
              return data.news_category?.name_zh || "";
            default:
              return data.news_category?.name_ja || "";
          }
        })();

        const newsDetail: NewsDetail = {
          id: data.id,
          slug: data.slug,
          title: data.news_translations[0]?.title || "",
          eyecatch_url: data.eyecatch_url,
          published_at: data.published_at,
          status: data.status,
          category_name: category,
          category_slug: data.news_category?.slug || "",
          body: data.news_translations[0]?.body || "",
        };

        return ok(newsDetail);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("[getNewsById] Unexpected error:", error);
        return err(error);
      }
    },
    [`news-${slug}-${lang}`],
    {
      tags: ["news", `news-${slug}`],
      revalidate: 60,
    }
  );

  return cached();
}
