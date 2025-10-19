// app/api/checkout-status/route.ts
import { computeOnce } from "@/lib/checkout";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Client用の軽量API（1回判定だけ返す）
export async function GET(req: NextRequest) {
  const piId = req.nextUrl.searchParams.get("pi_id");
  if (!piId) {
    return Response.json({ error: "missing pi_id" }, { status: 400 });
  }

  const status = await computeOnce(piId);
  return Response.json({ status });
}
