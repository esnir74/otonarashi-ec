import { COOKIE_NAME } from "@/lib/checkout/session";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return new Response(null, { status: 204 });
}
