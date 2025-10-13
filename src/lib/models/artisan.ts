import { z } from "zod";

/**
 * 職人カード表示用DTO（一覧ページ用）
 */
export const ArtisanCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  photo_url: z.string().url().nullable(),
  created_at: z.string(),
});

export type ArtisanCard = z.infer<typeof ArtisanCardSchema>;

/**
 * フォールバック画像URL
 */
export const FALLBACK_ARTISAN_IMAGE =
  "https://via.placeholder.com/300x300?text=No+Photo";

/**
 * 画像URLのフォールバック処理
 */
export function getArtisanPhotoUrl(url: string | null): string {
  return url || FALLBACK_ARTISAN_IMAGE;
}
