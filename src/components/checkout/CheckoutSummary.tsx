import Image from "next/image";
import { cn } from "@/lib/utils";

export type SummaryItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  imageUrl?: string | null;
  imageBlur?: string | null;
};

type Props = {
  items: SummaryItem[];
  subtotalYen: number;
  shippingYen?: number;
  totalYen?: number;
  shippingCalculated: boolean;
  className?: string;
  formatAmount: (amountYen: number) => string;
};

export function CheckoutSummary({
  items,
  subtotalYen,
  shippingYen,
  totalYen,
  shippingCalculated,
  className,
  formatAmount,
}: Props) {
  const hasItems = items.length > 0;
  const computedTotalYen =
    typeof totalYen === "number"
      ? totalYen
      : subtotalYen + (shippingYen ?? 0);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-neutral-900">ご注文内容</h2>

      <div className="mt-6 space-y-4">
        {hasItems ? (
          items.map((item) => {
            const quantity = item.quantity ?? 1;
            const itemTotalYen = item.price * quantity;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                  <Image
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    placeholder={item.imageBlur ? "blur" : "empty"}
                    blurDataURL={item.imageBlur ?? undefined}
                  />
                </div>
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      数量 {quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatAmount(itemTotalYen)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-6 text-sm text-neutral-600">
            カートに商品が入っていません。商品一覧に戻ってお買い物をお楽しみください。
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <span>小計</span>
          <span>{formatAmount(subtotalYen)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>送料</span>
          <span>
            {shippingCalculated && typeof shippingYen === "number"
              ? formatAmount(shippingYen)
              : "住所入力後に計算されます"}
          </span>
        </div>
        <div className="h-px bg-neutral-200" aria-hidden="true" />
        <div className="flex items-center justify-between text-base font-semibold text-neutral-900">
          <span>合計</span>
          <span>
            {shippingCalculated
              ? formatAmount(computedTotalYen)
              : "—"}
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          価格はすべて税込み表示です。
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <label className="text-xs font-medium text-neutral-700">
          クーポンコード
          <input
            type="text"
            placeholder="コードを入力"
            className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
          />
        </label>
        <button
          type="button"
          className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
        >
          適用する
        </button>
      </div>
    </aside>
  );
}
