import { clearCartSnapshot } from "@/lib/cartCookie";

export const runtime = "nodejs";

export async function POST() {
  await clearCartSnapshot();
  return new Response(null, { status: 204 });
}
