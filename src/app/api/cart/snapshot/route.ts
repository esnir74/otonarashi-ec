import { readCartSnapshot } from "@/lib/cartCookie";

export const runtime = "nodejs";

export async function GET() {
  const snapshot = await readCartSnapshot();
  return Response.json(snapshot);
}
