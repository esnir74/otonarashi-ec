// app/success/PendingClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckoutSuccessContent } from "@/components/checkout/CheckoutSuccessContent";

type Status = "pending" | "ok" | "out_of_stock";
type Props = {
  paymentIntentId: string;
  softTimeoutMs?: number; // 既定 15000
  hardTimeoutMs?: number; // 既定 180000
  pollIntervalMs?: number; // 既定 2000
  cancelHref?: string;
  lang: string;
};

export default function PendingClient({
  paymentIntentId,
  softTimeoutMs = 15_000,
  hardTimeoutMs = 180_000,
  pollIntervalMs = 2_000,
  cancelHref = "/checkout/failure?reason=out_of_stock",
  lang,
}: Props) {
  const [status, setStatus] = useState<Status>("pending");
  const [softTimedOut, setSoftTimedOut] = useState(false);
  const t0 = useRef<number>(Date.now());

  const elapsed = useMemo(() => Date.now() - t0.current, [status]);

  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const res = await fetch(
          `/api/checkout-status?pi_id=${encodeURIComponent(paymentIntentId)}`,
          {
            cache: "no-store",
          }
        );
        const data = (await res.json()) as { status?: Status };
        if (!alive) return;

        if (data.status === "ok") {
          console.log("Payment confirmed on client after", elapsed, "ms");
          setStatus("ok");
          return;
        }
        if (data.status === "out_of_stock") {
          // すぐリダイレクト
          window.location.href = cancelHref;
          return;
        }

        // pending のまま
        const now = Date.now();
        const dt = now - t0.current;

        if (dt >= hardTimeoutMs) {
          setSoftTimedOut(false);
          return; // 以降は自動ポーリング停止（ユーザーに任せる）
        }

        if (dt >= softTimeoutMs) {
          setSoftTimedOut(true); // 追加導線を出す
        }

        setTimeout(tick, pollIntervalMs);
      } catch {
        // 通信エラーは“待ち”継続（ユーザーに制御を返すためソフトTimeoutへ）
        const now = Date.now();
        const dt = now - t0.current;
        if (dt >= softTimeoutMs) setSoftTimedOut(true);
        setTimeout(tick, pollIntervalMs);
      }
    }

    // 最初の一発
    const id = setTimeout(tick, pollIntervalMs);

    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [paymentIntentId, softTimeoutMs, hardTimeoutMs, pollIntervalMs]);

  // 表示
  if (status === "ok") {
    return <CheckoutSuccessContent lang={lang} />;
  }

  // pending 中のUI（段階的に案内を追加）
  return (
    <div>
      <p>お支払いを確認中です… 通常は数秒で完了します。</p>

      {softTimedOut && (
        <div>
          <p>サーバー処理に時間がかかっています。</p>
          <div>
            <p>
              2分経過後もページが切り替わらない場合は、メールが届いているか確認をお願いいたします。
            </p>
            <p>
              ※ 2分経過後も
              メールが届かない場合は、支払いが完了していない可能性があります。お手数ですが、下記のメールアドレスまでお問い合わせください。
            </p>
            <a href="mailto:orders@example.com">orders@example.com</a>
            <p>
              二重購入防止のため、再購入はしないでください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
