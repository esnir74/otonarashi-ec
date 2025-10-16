import type { Locale } from "@/i18n/locales";
import { unstable_cache } from "next/cache";
import { ArtisanCard } from "../models/artisan";
import { createClient } from "../supabaseClient";
import { Result, err, ok } from "../types/result";

/**
 * 職人一覧を取得（キャッシュ付き）
 * @param lang - ロケール (ja, en, zh)
 * @returns Result<ArtisanCard[], Error>
 */
export async function getArtisans(
  lang: Locale
): Promise<Result<ArtisanCard[], Error>> {
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("artisans")
          .select(
            `
            id,
            slug,
            photo_url,
            created_at,
            artisan_translations (
              name,
              lang
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[getArtisans] Supabase error:", error);
          return err(new Error(error.message));
        }

        if (!data) {
          return ok([]);
        }

        const artisans: ArtisanCard[] = data.map((item) => ({
          id: item.id,
          slug: item.slug,
          name:
            item.artisan_translations.find((trans) => trans.lang === lang)
              ?.name ||
            item.artisan_translations.find((trans) => trans.lang === "ja")
              ?.name ||
            "",
          photo_url: item.photo_url,
          created_at: item.created_at,
        }));

        return ok(artisans);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        console.error("[getArtisans] Unexpected error:", error);
        return err(error);
      }
    },
    [`artisans-${lang}`],
    {
      tags: ["artisans"],
      revalidate: 60, // 60秒キャッシュ
    }
  );

  return cached();
}
