// src/app/admin/_components/ImageUploader.tsx
"use client";

import { uploadProductImageVariants } from "@/lib/upload-product-images";
import { useState } from "react";

export default function ImageUploader({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const { imageId, variants, blurData } = await uploadProductImageVariants(
        productId,
        file
      );
      // 成功したらDB登録（サーバ側に依頼）
      const res = await fetch("/api/images/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, imageId, variants, blurData }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg("✓ アップロード完了しました。ページをリロードして確認してください。");
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setMsg(`✗ ${error.message ?? "アップロードに失敗しました。"}`);
      console.error("[ImageUploader] Error:", error);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input type="file" accept="image/webp" onChange={onChange} disabled={busy} />
      {busy && <span className="text-sm text-neutral-500">処理中…</span>}
      {msg && <span className="text-sm">{msg}</span>}
    </div>
  );
}
