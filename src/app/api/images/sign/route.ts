// src/app/api/images/sign/route.ts
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← SRキー（サーバ限定）
);

export async function cod(req: NextRequest) {
  const { path } = (await req.json()) as { path: string }; // 例: products/<pid>/variants/800.webp
  if (!path) return new Response("Bad Request", { status: 400 });

  const { data, error } = await supabaseAdmin.storage
    .from("products")
    .createSignedUploadUrl(path);

  if (error) return new Response(error.message, { status: 500 });

  return Response.json(data);
}
