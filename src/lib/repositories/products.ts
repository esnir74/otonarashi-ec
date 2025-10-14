import type { Locale } from "@/i18n/locales";
import { unstable_cache } from "next/cache";
import { ProductCard, ProductDetail, ImageVariants } from "../models/product";
import { createClient } from "../supabaseClient";
import { Result, err, ok } from "../types/result";
import { getMainImageUrl, getSubImageUrls } from "../utils/imageUrl";

/**
 * 商品一覧を取得（キャッシュ付き）
 * @param lang - ロケール (ja, en, zh)
 * @returns Result<ProductCard[], Error>
 */
export async function getProducts(
  lang: Locale
): Promise<Result<ProductCard[], Error>> {
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("products")
          .select(
            `
            id,
            slug,
            price_cents,
            status,
            stock,
            sale_start_at,
            product_translations!inner(title),
            product_images!inner(variants, blur_data, is_main, sort)
          `
          )
          .eq("product_translations.lang", lang)
          .eq("status", "published")
          .eq("product_images.is_main", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[getProducts] Supabase error:", error);
          return err(new Error(error.message));
        }

        if (!data) {
          return ok([]);
        }

        // データ変換: DB型 → DTO
        const products: ProductCard[] = data.map((row) => {
          // product_translations は配列で返ってくるが、inner join なので1件のみ
          const translation = Array.isArray(row.product_translations)
            ? row.product_translations[0]
            : row.product_translations;

          // product_images も同様
          const images = Array.isArray(row.product_images)
            ? row.product_images
            : [row.product_images];

          // 型アサーションで ImageVariants として扱う
          const typedImages = images.map((img) => ({
            variants: img.variants as ImageVariants,
            blur_data: img.blur_data,
            is_main: img.is_main,
            sort: img.sort,
          }));

          // メイン画像のblur_dataを取得
          const mainImage = typedImages.find((img) => img.is_main) || typedImages[0];

          return {
            id: row.id,
            slug: row.slug,
            name: translation?.title ?? "No title",
            price_cents: row.price_cents,
            main_image_url: getMainImageUrl(typedImages, "800"),
            main_image_blur: mainImage?.blur_data || null,
            status: row.status,
            stock: row.stock,
            sale_start_at: row.sale_start_at,
          };
        });

        return ok(products);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("[getProducts] Unexpected error:", error);
        return err(error);
      }
    },
    [`products-${lang}`],
    {
      tags: ["products"],
      revalidate: 60, // 60秒キャッシュ
    }
  );

  return cached();
}

/**
 * スラッグから商品詳細を取得（キャッシュ付き）
 * @param slug - 商品スラッグ
 * @param lang - ロケール
 * @returns Result<ProductDetail | null, Error>
 */
export async function getProductBySlug(
  slug: string,
  lang: Locale
): Promise<Result<ProductDetail, Error>> {
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("products")
          .select(
            `
            id,
            slug,
            sku,
            price_cents,
            status,
            stock,
            sale_start_at,
            created_at,
            updated_at,
            product_translations!inner(title, description),
            product_images(variants, blur_data, is_main, sort),
            product_category(name_ja, name_en, name_zh)
          `
          )
          .eq("slug", slug)
          .eq("product_translations.lang", lang)
          .order("sort", { referencedTable: "product_images", ascending: true })
          .single();

        if (error) {
          console.error("[getProductBySlug] Supabase error:", error);
          return err(new Error(error.message));
        }

        if (!data) {
          return err(new Error("Product not found"));
        }

        // データ変換: DB型 → DTO
        const translation = Array.isArray(data.product_translations)
          ? data.product_translations[0]
          : data.product_translations;

        const category = Array.isArray(data.product_category)
          ? data.product_category[0]
          : data.product_category;

        // 画像を取得して型変換
        const images = Array.isArray(data.product_images)
          ? data.product_images
          : data.product_images
          ? [data.product_images]
          : [];

        // 型アサーションで ImageVariants として扱う
        const typedImages = images.map((img) => ({
          variants: img.variants as ImageVariants,
          blur_data: img.blur_data,
          is_main: img.is_main,
          sort: img.sort,
        }));

        // メイン画像とサブ画像のblur_dataを取得
        const mainImage =
          typedImages.find((img) => img.is_main) ||
          typedImages.sort((a, b) => a.sort - b.sort)[0];
        const subImages = typedImages.filter((img) => !img.is_main);
        const subImageBlurs = subImages
          .sort((a, b) => a.sort - b.sort)
          .map((img) => img.blur_data)
          .filter((blur): blur is string => blur !== null);

        // カテゴリ名を言語に応じて取得
        const categoryName = category
          ? category[`name_${lang}` as keyof typeof category]
          : null;

        const product: ProductDetail = {
          id: data.id,
          slug: data.slug,
          name: translation?.title ?? "No title",
          description: translation?.description ?? "",
          price_cents: data.price_cents,
          main_image_url: getMainImageUrl(typedImages, "1600"),
          main_image_blur: mainImage?.blur_data || null,
          sub_image_urls: getSubImageUrls(typedImages, "800"),
          sub_image_blurs: subImageBlurs,
          status: data.status,
          stock: data.stock,
          sku: data.sku,
          sale_start_at: data.sale_start_at,
          created_at: data.created_at,
          updated_at: data.updated_at,
          category_name: categoryName as string | null,
        };

        return ok(product);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("[getProductBySlug] Unexpected error:", error);
        return err(error);
      }
    },
    [`product-${slug}-${lang}`],
    {
      tags: ["products", `product-${slug}`],
      revalidate: 60,
    }
  );

  return cached();
}
