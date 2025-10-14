// src/lib/image-resize.ts
export type Variant = 400 | 800 | 1600 | 2400;

export async function resizeTo(file: File, width: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const ratio = width / bitmap.width;
  const w = width;
  const h = Math.round(bitmap.height * ratio);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await canvas.convertToBlob({
    type: "image/webp",
    quality: 0.85,
  });
  bitmap.close();
  return blob;
}

export async function tinyBlurDataURL(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const w = 20;
  const h = Math.max(1, Math.round((bitmap.height / bitmap.width) * 20));
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.5 });
  const buf = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  bitmap.close();
  return `data:image/webp;base64,${base64}`;
}
