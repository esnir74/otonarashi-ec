import type { Locale } from "@/i18n/locales";
import { findStaticNewsBySlug, getStaticNewsCards } from "@/lib/data/staticNews";
import type { NewsCard, NewsDetail } from "@/lib/models/news";
import { Result, ok, err } from "@/lib/types/result";

export async function getNews(
  lang: Locale
): Promise<Result<NewsCard[], Error>> {
  try {
    const news = getStaticNewsCards(lang);
    return ok(news);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    return err(error);
  }
}

export async function getLatestNews(
  lang: Locale,
  limit: number = 2
): Promise<Result<NewsCard[], Error>> {
  try {
    const news = getStaticNewsCards(lang).slice(0, limit);
    return ok(news);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    return err(error);
  }
}

export async function getNewsById(
  slug: string,
  lang: Locale
): Promise<Result<NewsDetail | null, Error>> {
  try {
    const news = findStaticNewsBySlug(lang, slug);
    return ok(news ?? null);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    return err(error);
  }
}
