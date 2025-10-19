// calcShipping.test.ts
import { describe, test, expect } from "vitest";
import { calcShippingYen, sumWeightGram } from "./calcShipping";

describe("calcShippingYen（EMS表完全一致テスト）", () => {
  test("JP: 常に600円", () => {
    expect(calcShippingYen("JP", 100)).toBe(600);
    expect(calcShippingYen("JP", 50000)).toBe(600);
  });

  test("第1地帯（CN, KR, TW）", () => {
    expect(calcShippingYen("CN", 500)).toBe(1450);
    expect(calcShippingYen("KR", 980)).toBe(2200);
    expect(calcShippingYen("TW", 1900.5)).toBe(3400);
    expect(calcShippingYen("CN", 3000)).toBe(4400);
    expect(calcShippingYen("CN", 4902.4)).toBe(6400);
    expect(calcShippingYen("CN", 8888)).toBe(9800);
    expect(calcShippingYen("CN", 20000)).toBe(18600);
    expect(calcShippingYen("CN", 30000)).toBe(26600);
    expect(calcShippingYen("CN", 50000)).toBe(26600); // 上限30kg適用
  });

  test("第2地帯（HK, TH, IN など）", () => {
    expect(calcShippingYen("HK", 500)).toBe(1900);
    expect(calcShippingYen("TH", 750)).toBe(2650); // 800g上限に切り上げ
    expect(calcShippingYen("SG", 1200)).toBe(3500);
    expect(calcShippingYen("IN", 2500)).toBe(5150);
    expect(calcShippingYen("VN", 5000)).toBe(8150);
    expect(calcShippingYen("MY", 10000)).toBe(13350);
    expect(calcShippingYen("PH", 20000)).toBe(23350);
    expect(calcShippingYen("ID", 30000)).toBe(33350);
    expect(calcShippingYen("BD", 40000)).toBe(33350); // 上限30kg適用
  });

  test("第3地帯（AU, CA, EU など）", () => {
    expect(calcShippingYen("AU", 500)).toBe(3150);
    expect(calcShippingYen("GB", 800)).toBe(3900);
    expect(calcShippingYen("FR", 1500)).toBe(5550);
    expect(calcShippingYen("DE", 2000)).toBe(6700);
    expect(calcShippingYen("CA", 5000)).toBe(13000);
    expect(calcShippingYen("NZ", 10000)).toBe(23500);
    expect(calcShippingYen("IT", 20000)).toBe(44500);
    expect(calcShippingYen("ES", 30000)).toBe(65500);
    expect(calcShippingYen("RU", 35000)).toBe(65500); // 上限30kg適用
  });

  test("第4地帯（US, GU など）", () => {
    expect(calcShippingYen("US", 500)).toBe(3900);
    expect(calcShippingYen("GU", 900)).toBe(5020);
    expect(calcShippingYen("PR", 1500)).toBe(6600);
    expect(calcShippingYen("US", 3000)).toBe(10300);
    expect(calcShippingYen("US", 7000)).toBe(19900);
    expect(calcShippingYen("US", 15000)).toBe(39100);
    expect(calcShippingYen("VI", 25000)).toBe(63100);
    expect(calcShippingYen("US", 30000)).toBe(75100);
    expect(calcShippingYen("US", 50000)).toBe(75100); // 上限30kg適用
  });

  test("第5地帯（BR, ZA, 不明国など）", () => {
    expect(calcShippingYen("BR", 500)).toBe(3600);
    expect(calcShippingYen("AR", 1000)).toBe(5100);
    expect(calcShippingYen("ZA", 2000)).toBe(8100);
    expect(calcShippingYen("EG", 5000)).toBe(17100);
    expect(calcShippingYen("NG", 10000)).toBe(29700);
    expect(calcShippingYen("CL", 20000)).toBe(53700);
    expect(calcShippingYen("CO", 30000)).toBe(77700);
    expect(calcShippingYen("KE", 40000)).toBe(77700); // 上限30kg適用
    expect(calcShippingYen("XX", 1000)).toBe(5100); // 不明国も第5地帯
  });

});

describe("sumWeightGram", () => {
  test("空配列は0", () => {
    expect(sumWeightGram([])).toBe(0);
  });

  test("単一商品", () => {
    expect(sumWeightGram([{ weight_gram: 500, quantity: 1 }])).toBe(500);
    expect(sumWeightGram([{ weight_gram: 300, quantity: 2 }])).toBe(600);
    expect(sumWeightGram([{ weight_gram: 1500, quantity: 3 }])).toBe(4500);
  });

  test("複数商品の合計", () => {
    expect(
      sumWeightGram([
        { weight_gram: 500, quantity: 1 },
        { weight_gram: 300, quantity: 2 },
        { weight_gram: 1000, quantity: 1 },
      ])
    ).toBe(2100); // 500 + 600 + 1000
  });

  test("小数は切り捨て", () => {
    expect(sumWeightGram([{ weight_gram: 500.9, quantity: 1 }])).toBe(500);
    expect(sumWeightGram([{ weight_gram: 300.5, quantity: 2.7 }])).toBe(600); // floor(300.5) * floor(2.7)
  });

  test("負の値は0扱い", () => {
    expect(sumWeightGram([{ weight_gram: -100, quantity: 1 }])).toBe(0);
    expect(sumWeightGram([{ weight_gram: 500, quantity: -2 }])).toBe(0);
    expect(sumWeightGram([{ weight_gram: -100, quantity: -2 }])).toBe(0);
  });

  test("実際のカート例", () => {
    // 着物リメイクシャツ2枚 + スカーフ1枚
    expect(
      sumWeightGram([
        { weight_gram: 350, quantity: 2 }, // シャツ
        { weight_gram: 80, quantity: 1 },  // スカーフ
      ])
    ).toBe(780);
  });
});
