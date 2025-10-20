import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";

/**
 * Revalidate product listing and detail caches.
 * Accepts an optional JSON body with a `slug` or `slugs` array to target
 * specific product detail caches in addition to the global tags.
 */
export async function POST(request: Request) {
  try {
    const revalidateSlugs: string[] = [];

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const payload = await request.json();

        if (typeof payload?.slug === "string") {
          revalidateSlugs.push(payload.slug);
        }

        if (Array.isArray(payload?.slugs)) {
          for (const slug of payload.slugs) {
            if (typeof slug === "string") {
              revalidateSlugs.push(slug);
            }
          }
        }
      } catch (parseError) {
        console.warn("[revalidate/products] failed to parse body", parseError);
      }
    }

    revalidateTag("products");
    revalidateTag("product-detail");

    for (const slug of revalidateSlugs) {
      revalidateTag(`product-${slug}`);
      revalidatePath(`/(lang)/(dynamic)/products/${slug}`, "page");
    }

    revalidatePath("/(lang)/(dynamic)/products", "layout");
    revalidatePath("/(lang)/(dynamic)/products", "page");
    revalidatePath("/", "page");

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[revalidate/products] failed", error);
    return new Response("failed", { status: 500 });
  }
}
