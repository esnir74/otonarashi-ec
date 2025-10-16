import { type Locale } from "@/i18n/locales";
import { Metadata } from "next";
import { createTranslator } from "next-intl";
import { getMessages } from "./i18n";

/**
 * ページ用メタデータを生成するヘルパー関数
 * @param lang - ロケール (ja, en, zh)
 * @param key - 翻訳キー (seo.{key}.title, seo.{key}.description)
 * @param path - URLパス (products, artisans, news など。空文字の場合はルートパス)
 * @returns Metadata オブジェクト
 */
export async function createPageMetadata(
  lang: Locale,
  key: string,
  path: string
): Promise<Metadata> {
  const messages = await getMessages(lang);
  const t = createTranslator({ locale: lang, messages });

  // pathが空の場合はルートパス、それ以外は /path の形式
  const fullPath = path ? `/${path}` : "";

  return {
    title: t(`seo.${key}.title`),
    description: t(`seo.${key}.description`),
    alternates: {
      languages: {
        ja: `https://otonarashi.jp/ja${fullPath}`,
        en: `https://otonarashi.jp/en${fullPath}`,
        zh: `https://otonarashi.jp/zh${fullPath}`,
      },
    },
  };
}
