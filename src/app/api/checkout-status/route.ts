// app/api/checkout-status/route.ts
import { computeOnce } from "@/lib/checkout";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Client用の軽量API（1回判定だけ返す）
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "missing session_id" }, { status: 400 });
  }

  const status = await computeOnce(sessionId);
  return Response.json({ status });
}
