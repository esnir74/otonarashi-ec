import { z } from "zod";
import type { Database } from "../database.types";

// Supabase型定義
type ProductStatus = Database["public"]["Enums"]["product_status"];

/**
 * 画像バリアントのスキーマ
 * Supabase Storageに保存された各サイズのWebP画像URL
 */
export const ImageVariantsSchema = z.object({
  "400": z.string().optional(),
  "800": z.string().optional(),
  "1600": z.string().optional(),
  "2400": z.string().optional(),
});

export type ImageVariants = z.infer<typeof ImageVariantsSchema>;

/**
 * product_imagesテーブルの行型スキーマ
 */
export const ProductImageSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  key: z.string(), // "products/{id}/variants/"
  variants: ImageVariantsSchema, // JSONBデータ
  blur_data: z.string().nullable(), // "data:image/webp;base64,..."
  is_main: z.boolean(),
  sort: z.number().int(),
  created_at: z.string(),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;

/**
 * 商品カード表示用DTO（一覧ページ用）
 */
export const ProductCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price_cents: z.number().int().positive(),
  main_image_url: z.string().nullable(),
  main_image_blur: z.string().nullable().optional(), // blur placeholder
  status: z.enum(["draft", "published", "archived"] as const),
  stock: z.number().int().nonnegative(),
  sale_start_at: z.string(),
});

export type ProductCard = z.infer<typeof ProductCardSchema>;

/**
 * 商品詳細表示用DTO
 */
export const ProductDetailSchema = ProductCardSchema.extend({
  description: z.string(),
  sku: z.string(),
  sub_image_urls: z.array(z.string()),
  sub_image_blurs: z.array(z.string()).optional(), // blur placeholders for sub images
  sale_start_at: z.string(), // ISO datetime
  created_at: z.string(),
  updated_at: z.string(),
  category_name: z.string().nullable(),
});

export type ProductDetail = z.infer<typeof ProductDetailSchema>;

/**
 * 商品ステータスが表示可能かチェック
 */
export function isProductAvailable(status: ProductStatus): boolean {
  return status === "published";
}

/**
 * 商品の在庫が残っているかチェック
 */
export function hasStock(product: { stock: number }): boolean {
  return product.stock > 0;
}

/**
 * 価格を表示用フォーマットに変換（円）
 */
export function formatPrice(price_cents: number): string {
  return `¥${(price_cents / 100).toLocaleString("ja-JP")}`;
}

/**
 * フォールバック画像URL
 */
export const FALLBACK_PRODUCT_IMAGE =
  "https://via.placeholder.com/400x500?text=No+Image";

/**
 * 画像URLのフォールバック処理
 */
export function getProductImageUrl(url: string | null): string {
  return url || FALLBACK_PRODUCT_IMAGE;
}
