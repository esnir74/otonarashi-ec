// 重量は gram、返り値は JPY（整数）
// - JP は常に 600 円（重量無視）
// - 海外は 500g〜30,000g の統合テーブルを切り上げで参照
// - 30,000g を超える場合は 30,000g（30kg）の料金を採用
// - 国コードは ISO-3166 alpha-2（大文字/小文字どちらでも可）
// - マッピングに無い国は保守的に第5地帯へフォールバック

export type Zone = 1 | 2 | 3 | 4 | 5;

export const DOMESTIC_FLAT_JPY = 600;

/** 国→地帯（必要に応じて追加してください） */
const COUNTRY_TO_ZONE: Record<string, Zone> = {
  // 第1地帯：中国・韓国・台湾
  CN: 1, KR: 1, TW: 1,

  // 第2地帯：アジア（第1地帯以外の多く）
  HK: 2, MO: 2, TH: 2, VN: 2, ID: 2, SG: 2, MY: 2, PH: 2, BN: 2,
  LA: 2, KH: 2, MM: 2, BD: 2, IN: 2, NP: 2, LK: 2, PK: 2, BT: 2,
  MV: 2, MN: 2, KP: 2,

  // 第3地帯：オセアニア・カナダ・メキシコ・中近東・ヨーロッパ
  AU: 3, NZ: 3, CA: 3, MX: 3,
  AE: 3, SA: 3, QA: 3, KW: 3, OM: 3, BH: 3, TR: 3, IL: 3, JO: 3, IR: 3, IQ: 3, YE: 3,
  GB: 3, IE: 3, FR: 3, DE: 3, IT: 3, ES: 3, PT: 3, NL: 3, BE: 3, LU: 3, AT: 3, CH: 3,
  DK: 3, NO: 3, SE: 3, FI: 3, IS: 3, EE: 3, LV: 3, LT: 3, PL: 3, CZ: 3, SK: 3, HU: 3,
  SI: 3, HR: 3, RO: 3, BG: 3, GR: 3, CY: 3, MT: 3, RS: 3, BA: 3, MK: 3, AL: 3, MD: 3,
  UA: 3, BY: 3, RU: 3, GE: 3, AM: 3, AZ: 3,

  // 第4地帯：米国（海外領土含む）
  US: 4, GU: 4, PR: 4, VI: 4,

  // 第5地帯：中南米（MX除く）・アフリカ・その他
  BR: 5, AR: 5, CL: 5, CO: 5, PE: 5, VE: 5, EC: 5, UY: 5, PY: 5, BO: 5, CR: 5, PA: 5,
  DO: 5, NI: 5, GT: 5, SV: 5, HN: 5, HT: 5, CU: 5, JM: 5, TT: 5, BZ: 5, GY: 5, SR: 5,
  ZA: 5, EG: 5, MA: 5, TN: 5, DZ: 5, LY: 5, SD: 5, ET: 5, SO: 5, KE: 5, UG: 5, TZ: 5,
  RW: 5, BI: 5, MZ: 5, ZM: 5, ZW: 5, AO: 5, NA: 5, GH: 5, NG: 5, CM: 5, SN: 5, CI: 5,
  GA: 5, CG: 5, CD: 5, NE: 5, ML: 5, BF: 5, GM: 5, MR: 5, GQ: 5, ST: 5, BJ: 5, TG: 5,
  LR: 5, SL: 5, GN: 5, GW: 5,
};

function toZone(country: string): Zone {
  const code = (country || "").toUpperCase();
  return COUNTRY_TO_ZONE[code] ?? 5; // 不明は第5地帯
}

type Bracket = { limit_g: number; price_yen: number };
type ZoneRateMap = Record<Zone, Bracket[]>;

/**
 * 500g〜30,000g まで、提供CSVの金額を統合した単一テーブル（切り上げ用）
 * 各配列は limit_g の昇順（<= limit_g の最初の段でヒット）
 */
const ALL_RATES: ZoneRateMap = {
  1: [
    { limit_g: 500, price_yen: 1450 },
    { limit_g: 600, price_yen: 1600 },
    { limit_g: 700, price_yen: 1750 },
    { limit_g: 800, price_yen: 1900 },
    { limit_g: 900, price_yen: 2050 },
    { limit_g: 1000, price_yen: 2200 },
    { limit_g: 1250, price_yen: 2500 },
    { limit_g: 1500, price_yen: 2800 },
    { limit_g: 1750, price_yen: 3100 },
    { limit_g: 2000, price_yen: 3400 },
    { limit_g: 2500, price_yen: 3900 },
    { limit_g: 3000, price_yen: 4400 },
    { limit_g: 3500, price_yen: 4900 },
    { limit_g: 4000, price_yen: 5400 },
    { limit_g: 4500, price_yen: 5900 },
    { limit_g: 5000, price_yen: 6400 },
    { limit_g: 5500, price_yen: 6900 },
    { limit_g: 6000, price_yen: 7400 },
    { limit_g: 7000, price_yen: 8200 },
    { limit_g: 8000, price_yen: 9000 },
    { limit_g: 9000, price_yen: 9800 },
    { limit_g: 10000, price_yen: 10600 },
    { limit_g: 11000, price_yen: 11400 },
    { limit_g: 12000, price_yen: 12200 },
    { limit_g: 13000, price_yen: 13000 },
    { limit_g: 14000, price_yen: 13800 },
    { limit_g: 15000, price_yen: 14600 },
    { limit_g: 16000, price_yen: 15400 },
    { limit_g: 17000, price_yen: 16200 },
    { limit_g: 18000, price_yen: 17000 },
    { limit_g: 19000, price_yen: 17800 },
    { limit_g: 20000, price_yen: 18600 },
    { limit_g: 21000, price_yen: 19400 },
    { limit_g: 22000, price_yen: 20200 },
    { limit_g: 23000, price_yen: 21000 },
    { limit_g: 24000, price_yen: 21800 },
    { limit_g: 25000, price_yen: 22600 },
    { limit_g: 26000, price_yen: 23400 },
    { limit_g: 27000, price_yen: 24200 },
    { limit_g: 28000, price_yen: 25000 },
    { limit_g: 29000, price_yen: 25800 },
    { limit_g: 30000, price_yen: 26600 },
  ],
  2: [
    { limit_g: 500, price_yen: 1900 },
    { limit_g: 600, price_yen: 2150 },
    { limit_g: 700, price_yen: 2400 },
    { limit_g: 800, price_yen: 2650 },
    { limit_g: 900, price_yen: 2900 },
    { limit_g: 1000, price_yen: 3150 },
    { limit_g: 1250, price_yen: 3500 },
    { limit_g: 1500, price_yen: 3850 },
    { limit_g: 1750, price_yen: 4200 },
    { limit_g: 2000, price_yen: 4550 },
    { limit_g: 2500, price_yen: 5150 },
    { limit_g: 3000, price_yen: 5750 },
    { limit_g: 3500, price_yen: 6350 },
    { limit_g: 4000, price_yen: 6950 },
    { limit_g: 4500, price_yen: 7550 },
    { limit_g: 5000, price_yen: 8150 },
    { limit_g: 5500, price_yen: 8750 },
    { limit_g: 6000, price_yen: 9350 },
    { limit_g: 7000, price_yen: 10350 },
    { limit_g: 8000, price_yen: 11350 },
    { limit_g: 9000, price_yen: 12350 },
    { limit_g: 10000, price_yen: 13350 },
    { limit_g: 11000, price_yen: 14350 },
    { limit_g: 12000, price_yen: 15350 },
    { limit_g: 13000, price_yen: 16350 },
    { limit_g: 14000, price_yen: 17350 },
    { limit_g: 15000, price_yen: 18350 },
    { limit_g: 16000, price_yen: 19350 },
    { limit_g: 17000, price_yen: 20350 },
    { limit_g: 18000, price_yen: 21350 },
    { limit_g: 19000, price_yen: 22350 },
    { limit_g: 20000, price_yen: 23350 },
    { limit_g: 21000, price_yen: 24350 },
    { limit_g: 22000, price_yen: 25350 },
    { limit_g: 23000, price_yen: 26350 },
    { limit_g: 24000, price_yen: 27350 },
    { limit_g: 25000, price_yen: 28350 },
    { limit_g: 26000, price_yen: 29350 },
    { limit_g: 27000, price_yen: 30350 },
    { limit_g: 28000, price_yen: 31350 },
    { limit_g: 29000, price_yen: 32350 },
    { limit_g: 30000, price_yen: 33350 },
  ],
  3: [
    { limit_g: 500, price_yen: 3150 },
    { limit_g: 600, price_yen: 3400 },
    { limit_g: 700, price_yen: 3650 },
    { limit_g: 800, price_yen: 3900 },
    { limit_g: 900, price_yen: 4150 },
    { limit_g: 1000, price_yen: 4400 },
    { limit_g: 1250, price_yen: 5000 },
    { limit_g: 1500, price_yen: 5550 },
    { limit_g: 1750, price_yen: 6150 },
    { limit_g: 2000, price_yen: 6700 },
    { limit_g: 2500, price_yen: 7750 },
    { limit_g: 3000, price_yen: 8800 },
    { limit_g: 3500, price_yen: 9850 },
    { limit_g: 4000, price_yen: 10900 },
    { limit_g: 4500, price_yen: 11950 },
    { limit_g: 5000, price_yen: 13000 },
    { limit_g: 5500, price_yen: 14050 },
    { limit_g: 6000, price_yen: 15100 },
    { limit_g: 7000, price_yen: 17200 },
    { limit_g: 8000, price_yen: 19300 },
    { limit_g: 9000, price_yen: 21400 },
    { limit_g: 10000, price_yen: 23500 },
    { limit_g: 11000, price_yen: 25600 },
    { limit_g: 12000, price_yen: 27700 },
    { limit_g: 13000, price_yen: 29800 },
    { limit_g: 14000, price_yen: 31900 },
    { limit_g: 15000, price_yen: 34000 },
    { limit_g: 16000, price_yen: 36100 },
    { limit_g: 17000, price_yen: 38200 },
    { limit_g: 18000, price_yen: 40300 },
    { limit_g: 19000, price_yen: 42400 },
    { limit_g: 20000, price_yen: 44500 },
    { limit_g: 21000, price_yen: 46600 },
    { limit_g: 22000, price_yen: 48700 },
    { limit_g: 23000, price_yen: 50800 },
    { limit_g: 24000, price_yen: 52900 },
    { limit_g: 25000, price_yen: 55000 },
    { limit_g: 26000, price_yen: 57100 },
    { limit_g: 27000, price_yen: 59200 },
    { limit_g: 28000, price_yen: 61300 },
    { limit_g: 29000, price_yen: 63400 },
    { limit_g: 30000, price_yen: 65500 },
  ],
  4: [
    { limit_g: 500, price_yen: 3900 },
    { limit_g: 600, price_yen: 4180 },
    { limit_g: 700, price_yen: 4460 },
    { limit_g: 800, price_yen: 4740 },
    { limit_g: 900, price_yen: 5020 },
    { limit_g: 1000, price_yen: 5300 },
    { limit_g: 1250, price_yen: 5990 },
    { limit_g: 1500, price_yen: 6600 },
    { limit_g: 1750, price_yen: 7290 },
    { limit_g: 2000, price_yen: 7900 },
    { limit_g: 2500, price_yen: 9100 },
    { limit_g: 3000, price_yen: 10300 },
    { limit_g: 3500, price_yen: 11500 },
    { limit_g: 4000, price_yen: 12700 },
    { limit_g: 4500, price_yen: 13900 },
    { limit_g: 5000, price_yen: 15100 },
    { limit_g: 5500, price_yen: 16300 },
    { limit_g: 6000, price_yen: 17500 },
    { limit_g: 7000, price_yen: 19900 },
    { limit_g: 8000, price_yen: 22300 },
    { limit_g: 9000, price_yen: 24700 },
    { limit_g: 10000, price_yen: 27100 },
    { limit_g: 11000, price_yen: 29500 },
    { limit_g: 12000, price_yen: 31900 },
    { limit_g: 13000, price_yen: 34300 },
    { limit_g: 14000, price_yen: 36700 },
    { limit_g: 15000, price_yen: 39100 },
    { limit_g: 16000, price_yen: 41500 },
    { limit_g: 17000, price_yen: 43900 },
    { limit_g: 18000, price_yen: 46300 },
    { limit_g: 19000, price_yen: 48700 },
    { limit_g: 20000, price_yen: 51100 },
    { limit_g: 21000, price_yen: 53500 },
    { limit_g: 22000, price_yen: 55900 },
    { limit_g: 23000, price_yen: 58300 },
    { limit_g: 24000, price_yen: 60700 },
    { limit_g: 25000, price_yen: 63100 },
    { limit_g: 26000, price_yen: 65500 },
    { limit_g: 27000, price_yen: 67900 },
    { limit_g: 28000, price_yen: 70300 },
    { limit_g: 29000, price_yen: 72700 },
    { limit_g: 30000, price_yen: 75100 },
  ],
  5: [
    { limit_g: 500, price_yen: 3600 },
    { limit_g: 600, price_yen: 3900 },
    { limit_g: 700, price_yen: 4200 },
    { limit_g: 800, price_yen: 4500 },
    { limit_g: 900, price_yen: 4800 },
    { limit_g: 1000, price_yen: 5100 },
    { limit_g: 1250, price_yen: 5850 },
    { limit_g: 1500, price_yen: 6600 },
    { limit_g: 1750, price_yen: 7350 },
    { limit_g: 2000, price_yen: 8100 },
    { limit_g: 2500, price_yen: 9600 },
    { limit_g: 3000, price_yen: 11100 },
    { limit_g: 3500, price_yen: 12600 },
    { limit_g: 4000, price_yen: 14100 },
    { limit_g: 4500, price_yen: 15600 },
    { limit_g: 5000, price_yen: 17100 },
    { limit_g: 5500, price_yen: 18600 },
    { limit_g: 6000, price_yen: 20100 },
    { limit_g: 7000, price_yen: 22500 },
    { limit_g: 8000, price_yen: 24900 },
    { limit_g: 9000, price_yen: 27300 },
    { limit_g: 10000, price_yen: 29700 },
    { limit_g: 11000, price_yen: 32100 },
    { limit_g: 12000, price_yen: 34500 },
    { limit_g: 13000, price_yen: 36900 },
    { limit_g: 14000, price_yen: 39300 },
    { limit_g: 15000, price_yen: 41700 },
    { limit_g: 16000, price_yen: 44100 },
    { limit_g: 17000, price_yen: 46500 },
    { limit_g: 18000, price_yen: 48900 },
    { limit_g: 19000, price_yen: 51300 },
    { limit_g: 20000, price_yen: 53700 },
    { limit_g: 21000, price_yen: 56100 },
    { limit_g: 22000, price_yen: 58500 },
    { limit_g: 23000, price_yen: 60900 },
    { limit_g: 24000, price_yen: 63300 },
    { limit_g: 25000, price_yen: 65700 },
    { limit_g: 26000, price_yen: 68100 },
    { limit_g: 27000, price_yen: 70500 },
    { limit_g: 28000, price_yen: 72900 },
    { limit_g: 29000, price_yen: 75300 },
    { limit_g: 30000, price_yen: 77700 },
  ],
};

function lookupCeil(brackets: Bracket[], grams: number): number {
  if (!brackets || brackets.length === 0) {
    throw new Error("rate table is empty");
  }
  // 30,000g を超える場合は最後の段（30kg）を返す
  if (grams >= brackets[brackets.length - 1].limit_g) {
    return brackets[brackets.length - 1].price_yen;
  }
  for (let i = 0; i < brackets.length; i++) {
    if (grams <= brackets[i].limit_g) {
      return brackets[i].price_yen;
    }
  }
  // normally unreachable
  return brackets[brackets.length - 1].price_yen;
}

/** 重量(g)と国コードから送料（JPY）を返す（本番用） */
export function calcShippingYen(country: string, totalWeightGram: number): number {
  if (!country) throw new Error("country required");
  if (totalWeightGram <= 0) return 0;

  const iso = country.toUpperCase();

  // 国内は一律
  if (iso === "JP") return DOMESTIC_FLAT_JPY;

  const zone = toZone(iso);
  const table = ALL_RATES[zone];
  return lookupCeil(table, totalWeightGram);
}

/** 例：商品配列から総重量(g)を合計 */
export function sumWeightGram(items: { weight_gram: number; quantity: number }[]): number {
  return items.reduce(
    (s, it) => s + Math.max(0, Math.floor(it.weight_gram)) * Math.max(0, Math.floor(it.quantity)),
    0
  );
}
