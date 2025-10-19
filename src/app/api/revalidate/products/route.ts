import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";

export async function POST() {
  try {
    revalidateTag("products");
    revalidateTag("product-detail");
    revalidatePath("/(lang)/(dynamic)/products", "layout");
    revalidatePath("/(lang)/(dynamic)/products", "page");
    revalidatePath("/", "page");
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[revalidate/products] failed", error);
    return new Response("failed", { status: 500 });
  }
}
