// src/lib/upload-product-images.ts
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { resizeTo, tinyBlurDataURL, type Variant } from "./image-resize";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getSignedUpload(path: string) {
  const res = await fetch("/api/images/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  console.log("getSignedUpload", res);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ path: string; token: string }>;
}

/**
 * @returns { imageId: string, variants: Record<string,string>, blurData: string }
 */
export async function uploadProductImageVariants(
  productId: string,
  file: File
) {
  // 0) ユニークな画像IDを生成（タイムスタンプ + ランダム）
  const imageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // 1) 4サイズ生成
  const targets: Variant[] = [400, 800, 1600, 2400];
  const blobs = await Promise.all(targets.map((w) => resizeTo(file, w)));
  const blurData = await tinyBlurDataURL(file);

  // 2) 署名URL→アップロード
  const variants: Record<string, string> = {};
  await Promise.all(
    targets.map(async (w, i) => {
      const path = `products/${productId}/${imageId}/${w}.webp`; // ← imageIdを追加
      const { token } = await getSignedUpload(path);
      const { data, error } = await supabase.storage
        .from("products")
        .uploadToSignedUrl(path, token, blobs[i], {
          contentType: "image/webp",
          upsert: true,
        });
      if (error) throw error;
      // 公開URL（ローカル／本番で自動切替）
      const publicUrl = supabase.storage.from("products").getPublicUrl(path)
        .data.publicUrl;
      variants[String(w)] = publicUrl;
    })
  );

  return { imageId, variants, blurData };
}
