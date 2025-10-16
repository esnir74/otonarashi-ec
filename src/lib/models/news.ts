import { z } from "zod";
import type { Database } from "../database.types";

// Supabase型定義
type NewsRow = Database["public"]["Tables"]["news"]["Row"];
type NewsStatus = Database["public"]["Enums"]["news_status"];

/**
 * お知らせカード表示用DTO（一覧ページ用）
 */
export const NewsCardSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  eyecatch_url: z.string().url().nullable(),
  published_at: z.string().nullable(), // ISO datetime
  status: z.enum(["draft", "published", "archived"] as const),
  category_name: z.string().nullable(),
});

export type NewsCard = z.infer<typeof NewsCardSchema>;

/**
 * お知らせ詳細表示用DTO
 */
export const NewsDetailSchema = NewsCardSchema.extend({
  body: z.string(),
  category_slug: z.string().nullable(),
});

export type NewsDetail = z.infer<typeof NewsDetailSchema>;

/**
 * お知らせステータスが表示可能かチェック
 */
export function isNewsPublished(status: NewsStatus): boolean {
  return status === "published";
}

/**
 * 公開日時をフォーマット
 */
export function formatPublishedDate(
  published_at: string | null,
  locale: string = "ja-JP"
): string {
  if (!published_at) return "-";
  const date = new Date(published_at);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * フォールバック画像URL
 */
export const FALLBACK_NEWS_IMAGE =
  "https://via.placeholder.com/800x400?text=No+Image";

/**
 * 画像URLのフォールバック処理
 */
export function getNewsEyecatchUrl(url: string | null): string {
  return url || FALLBACK_NEWS_IMAGE;
}
