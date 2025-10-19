// app/api/fx-rate/route.ts
import { getRedisClient } from "@/lib/redis";

type FxRate = {
  eurRate: number; // EUR per 1 JPY
  usdRate: number; // USD per 1 JPY
};

type ApiLayerLiveResponse = {
  success: boolean;
  terms?: string;
  privacy?: string;
  timestamp?: number;
  source: "USD";
  quotes: {
    USDEUR: number;
    USDJPY: number;
  };
};

function isFxRate(v: unknown): v is FxRate {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.eurRate === "number" &&
    Number.isFinite(r.eurRate) &&
    typeof r.usdRate === "number" &&
    Number.isFinite(r.usdRate)
  );
}

function parseFxRateJSON(text: string): FxRate | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return isFxRate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isApiLayerLiveResponse(d: unknown): d is ApiLayerLiveResponse {
  if (typeof d !== "object" || d === null) return false;
  const o = d as Record<string, unknown>;
  if (o.success !== true) return false;
  if (o.source !== "USD") return false;
  const q = o.quotes as unknown;
  if (typeof q !== "object" || q === null) return false;
  const qq = q as Record<string, unknown>;
  return (
    typeof qq.USDEUR === "number" &&
    Number.isFinite(qq.USDEUR) &&
    typeof qq.USDJPY === "number" &&
    Number.isFinite(qq.USDJPY)
  );
}

export async function GET(_req: Request) {
  // デバッグ用
  // throw new Error("FX rate fetch test error");
  const tmp = `{"eurRate": 0.005696201458033063,
"usdRate": 0.0066521872940628335
}`;

  const demoRate = parseFxRateJSON(tmp);
  if (demoRate) {
    return Response.json({ rate: demoRate, cached: true, source: "redis" });
  }

  const redis = await getRedisClient();

  const key = `fx:JPY`;
  const cached = await redis.get(key);

  if (cached !== null) {
    console.log("FX rate found in Redis cache:", cached);
    const rate = parseFxRateJSON(cached);
    if (rate) {
      return Response.json({ rate, cached: true, source: "redis" });
    }
    // 壊れキャッシュは削除
    await redis.del(key);
  }

  const accessKey = process.env.EXCHANGERATE_API_KEY;
  const baseUrl = "https://api.exchangerate.host/live";
  if (!accessKey) return new Response("Missing API key", { status: 500 });

  const url = `${baseUrl}?access_key=${accessKey}&currencies=EUR,JPY`;

  let jsonUnknown: unknown;
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return new Response("Failed to fetch FX API", { status: 502 });
    jsonUnknown = await res.json();
  } catch {
    return new Response("FX API request failed", { status: 502 });
  }

  if (!isApiLayerLiveResponse(jsonUnknown)) {
    return new Response("Invalid response from FX API", { status: 500 });
  }

  const { USDEUR, USDJPY } = jsonUnknown.quotes;

  // JPY 基準へ変換（1 JPY あたり）
  const eurRate = USDEUR / USDJPY;
  const usdRate = 1 / USDJPY;

  const rate: FxRate = { eurRate, usdRate };

  try {
    await redis.set(key, JSON.stringify(rate), { EX: 600 }); // 10分キャッシュ
  } catch {
    console.error("Failed to cache FX rate in Redis");
    // キャッシュ書き込み失敗は致命ではないため握りつぶし
  }

  return Response.json({ rate, cached: false, source: "api" });
}
