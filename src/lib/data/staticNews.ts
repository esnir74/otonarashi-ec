import type { Locale } from "@/i18n/locales";
import { locales } from "@/i18n/locales";
import type { NewsCard, NewsDetail } from "@/lib/models/news";

type BaseNewsTranslation = {
  title: string;
  body: string;
  categoryName: string | null;
};

type BaseNewsItem = {
  id: string;
  slug: string;
  eyecatchUrl: string | null;
  publishedAt: string | null;
  status: "draft" | "published" | "archived";
  categorySlug: string | null;
  translations: Partial<Record<Locale, BaseNewsTranslation>>;
};

const baseNewsItems: BaseNewsItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "seasonal-collection-preview",
    eyecatchUrl: "/tmp/poster.webp",
    publishedAt: "2025-10-25T18:00:00+09:00",
    status: "published",
    categorySlug: null,
    translations: {
      ja: {
        title: "🎉10月26日、オトナラシデビュー！🎉",
        categoryName: "イベント",
        body: [
          "<p>みなさまこんにちは。</p>",
          "<p>オトナラシからイベント出店のお知らせです📢</p>",
          "<p></br/></p>",
          "<p>10月26日（土）に開催される</p>",
          "<p>「北山グリーンハロウィン」の物販ブースに出展します🎃</p>",
          "<p></br/></p>",
          "<p>今回が、オトナラシ初の販売会！</p>",
          "<p>実際に手に取ってご覧いただけます🌿</p>",
          "<p></br/></p>",
          "<p>お近くにお越しの際は、ぜひお立ち寄りください☺️</p>",
        ].join(""),
      },
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "atelier-open-day",
    eyecatchUrl: "/tmp/logo.webp",
    publishedAt: "2025-10-25T09:00:00+09:00",
    status: "published",
    categorySlug: null,
    translations: {
      ja: {
        title: "🌿オトナラシ公式Instagram、はじまりました！🌿",
        categoryName: "お知らせ",
        body: [
          "<p>みなさま、はじめまして。</p>",
          "<p>オトナラシのAttoです！</p>",
          "<p></br/></p>",
          "<p>このたび、オトナラシ公式Instagramアカウントを開設しました。</p>",
          "<p></br/></p>",
          "<p>これから、新商品のご紹介やイベント出展情報、</p>",
          "<p>そして製品づくりの裏側まで、たっぷりお届けしていきます。</p>",
          "<p></br/></p>",
          "<p>ぜひフォローしてくださいね〜🙌🏻</p>",
          "<p></br/></p>",
          '<p>👉 <a href="https://www.instagram.com/otonarashi_official/" target="_blank" rel="noopener noreferrer">@otonarashi_official</a></p>',
        ].join(""),
      },
    },
  },
];

function findTranslation(
  item: BaseNewsItem,
  locale: Locale
): BaseNewsTranslation {
  return (
    item.translations[locale] ??
    item.translations.ja ??
    Object.values(item.translations)[0]!
  );
}

function toNewsDetail(item: BaseNewsItem, locale: Locale): NewsDetail {
  const translation = findTranslation(item, locale);

  return {
    id: item.id,
    slug: item.slug,
    title: translation.title,
    eyecatch_url: item.eyecatchUrl,
    published_at: item.publishedAt,
    status: item.status,
    category_name: translation.categoryName,
    category_slug: item.categorySlug,
    body: translation.body,
  };
}

function toNewsCard(item: BaseNewsItem, locale: Locale): NewsCard {
  const detail = toNewsDetail(item, locale);
  const { body, category_slug, ...card } = detail;
  return card;
}

export function getStaticNewsCards(locale: Locale): NewsCard[] {
  const targetLocale = locales.includes(locale) ? locale : "ja";
  return baseNewsItems.map((item) => toNewsCard(item, targetLocale));
}

export function getStaticNewsDetails(locale: Locale): NewsDetail[] {
  const targetLocale = locales.includes(locale) ? locale : "ja";
  return baseNewsItems.map((item) => toNewsDetail(item, targetLocale));
}

export function findStaticNewsBySlug(
  locale: Locale,
  slug: string
): NewsDetail | null {
  const targetLocale = locales.includes(locale) ? locale : "ja";
  const baseItem = baseNewsItems.find((item) => item.slug === slug);
  if (!baseItem) return null;
  return toNewsDetail(baseItem, targetLocale);
}
