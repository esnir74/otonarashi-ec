// src/app/api/images/save/route.ts
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SRキー
);

export async function POST(req: NextRequest) {
  const { productId, imageId, variants, blurData } = (await req.json()) as {
    productId: string;
    imageId: string;
    variants: Record<string, string>;
    blurData?: string | null;
  };
  if (!productId || !imageId || !variants)
    return new Response("Bad Request", { status: 400 });

  // 既存の画像数を取得してソート順を決定
  const { data: existingImages } = await supabaseAdmin
    .from("product_images")
    .select("sort")
    .eq("product_id", productId)
    .order("sort", { ascending: false })
    .limit(1);

  const nextSort = existingImages?.[0]?.sort ? existingImages[0].sort + 1 : 1;

  // 最初の画像の場合のみis_main=trueに設定
  const { data: imageCount } = await supabaseAdmin
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const isFirstImage = (imageCount as unknown as { count: number })?.count === 0;

  // product_images に1行登録
  const { error } = await supabaseAdmin.from("product_images").insert({
    product_id: productId,
    key: `products/${productId}/${imageId}/`, // imageIdを含むパス
    variants: variants as unknown as Database["public"]["Tables"]["product_images"]["Insert"]["variants"],
    blur_data: blurData ?? null,
    is_main: isFirstImage, // 最初の画像のみメインに設定
    sort: nextSort,
  });

  if (error) return new Response(error.message, { status: 500 });

  // 一覧キャッシュを即時更新（任意）
  revalidateTag("products");

  return Response.json({ ok: true });
}
