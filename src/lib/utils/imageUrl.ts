import { ImageVariants } from "../models/product";

export type ImageSize = "400" | "800" | "1600" | "2400";

/**
 * variantsから指定サイズの画像URLを取得（フォールバック付き）
 * @param variants - 画像バリアントオブジェクト
 * @param preferredSize - 優先サイズ（デフォルト: "800"）
 * @returns 画像URL、または取得できない場合はnull
 */
export function getImageUrl(
  variants: ImageVariants | null | undefined,
  preferredSize: ImageSize = "800"
): string | null {
  // バリデーション
  if (!variants || typeof variants !== "object") {
    console.warn("[getImageUrl] Invalid variants:", variants);
    return null;
  }

  // 優先サイズを試す
  if (variants[preferredSize]) {
    return variants[preferredSize];
  }

  // フォールバック: 小→大の順で探す
  const fallbackOrder: ImageSize[] = ["400", "800", "1600", "2400"];
  for (const size of fallbackOrder) {
    if (variants[size]) {
      return variants[size];
    }
  }

  return null;
}

/**
 * 複数画像から全URLを取得（指定サイズ、ソート順を保持）
 * @param images - 画像配列
 * @param size - 取得するサイズ（デフォルト: "800"）
 * @returns 画像URL配列
 */
export function getImageUrls(
  images: Array<{ variants: ImageVariants; sort: number }>,
  size: ImageSize = "800"
): string[] {
  return images
    .sort((a, b) => a.sort - b.sort)
    .map((img) => getImageUrl(img.variants, size))
    .filter((url): url is string => url !== null);
}

/**
 * メイン画像を取得（is_main=trueまたは最初の画像）
 * @param images - 画像配列
 * @param size - 取得するサイズ（デフォルト: "800"）
 * @returns メイン画像URL、またはnull
 */
export function getMainImageUrl(
  images: Array<{ variants: ImageVariants; is_main: boolean; sort: number }>,
  size: ImageSize = "800"
): string | null {
  // is_main=trueの画像を探す
  const mainImage = images.find((img) => img.is_main);
  if (mainImage) {
    return getImageUrl(mainImage.variants, size);
  }

  // フォールバック: sort順で最初の画像
  const sortedImages = [...images].sort((a, b) => a.sort - b.sort);
  return sortedImages.length > 0
    ? getImageUrl(sortedImages[0].variants, size)
    : null;
}

/**
 * メイン画像以外のサブ画像URLを取得
 * @param images - 画像配列
 * @param size - 取得するサイズ（デフォルト: "800"）
 * @returns サブ画像URL配列
 */
export function getSubImageUrls(
  images: Array<{ variants: ImageVariants; is_main: boolean; sort: number }>,
  size: ImageSize = "800"
): string[] {
  const subImages = images.filter((img) => !img.is_main);
  return getImageUrls(subImages, size);
}
