import ActionButton from "@/components/checkout/ActionButton";
import { ClearCartEffect } from "@/components/checkout/ClearCartEffect";
import { ResetCheckoutSessionEffect } from "@/components/checkout/ResetCheckoutSessionEffect";
import { RevalidateProductsEffect } from "@/components/checkout/RevalidateProductsEffect";
import type { Locale } from "@/i18n/locales";

type ActionKey = "checkout" | "products" | "reload" | "support";

type FailureConfig = {
  title: string;
  description: string;
  primary: ActionKey;
  secondary?: ActionKey;
  revalidate?: boolean;
  clearCart?: boolean;
};

type Props = {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ reason?: string }>;
};

const configs: Record<string, FailureConfig> = {
  out_of_stock: {
    title: "在庫が確保できませんでした",
    description:
      "ご注文商品の在庫が不足しているため決済を完了できませんでした。カートの内容をリセットしましたので、在庫状況を確認し、改めて商品をお選びください。",
    primary: "products",
    revalidate: true,
    clearCart: true,
  },
  payment_failed: {
    title: "決済を完了できませんでした",
    description:
      "カード会社から承認が得られませんでした。カード情報をご確認のうえ、別のカードで再度お試しください。",
    primary: "checkout",
    secondary: "support",
  },
  session_invalid: {
    title: "セッションが無効になりました",
    description:
      "一定時間が経過したか、別タブで操作された可能性があります。ページを再読み込みして、もう一度お手続きください。",
    primary: "reload",
    secondary: "support",
  },
  canceled: {
    title: "お支払いがキャンセルされました",
    description:
      "お支払い処理が完了していません。カートの中身は保持されていますので、再度お支払い手続きを行ってください。",
    primary: "checkout",
    secondary: "products",
  },
  empty_cart: {
    title: "カートが空です",
    description:
      "カートに商品がありません。商品一覧から購入したい商品を追加してから、再度チェックアウトを行ってください。",
    primary: "products",
  },
  price_mismatch: {
    title: "商品価格が更新されました",
    description:
      "カート内の商品価格が更新されたため支払いを完了できませんでした。最新の価格を確認し、もう一度お手続きをお願いいたします。",
    primary: "checkout",
    secondary: "products",
    revalidate: true,
  },
  missing_fx_rate: {
    title: "為替レートを取得できませんでした",
    description:
      "為替レートの取得に失敗しました。しばらく時間を置いてから、ページを再読み込みしてください。",
    primary: "reload",
    secondary: "support",
  },
  currency_mismatch: {
    title: "通貨設定に不整合があります",
    description:
      "通貨設定が正しくない可能性があります。ページを再読み込みしてから、再度お試しください。",
    primary: "checkout",
    secondary: "support",
  },
  checkout_error: {
    title: "決済処理中にエラーが発生しました",
    description:
      "一時的な問題により決済を完了できませんでした。時間を置いて再度お試しください。",
    primary: "checkout",
    secondary: "support",
  },
  default: {
    title: "お支払いを完了できませんでした",
    description:
      "決済処理中にエラーが発生しました。時間を置いてから再度お試しください。解決しない場合はサポートまでお問い合わせください。",
    primary: "checkout",
    secondary: "support",
  },
};

export default async function CheckoutFailurePage({
  params,
  searchParams,
}: Props) {
  const { lang } = await params;
  const query = await searchParams;
  const reason = query.reason ?? "default";
  const checkoutHref = `/${lang}/checkout`;
  const productsHref = `/${lang}/products`;
  const supportHref = "mailto:orders@example.com";

  const actionMap: Record<
    ActionKey,
    { label: string; href?: string; external?: boolean; reload?: boolean }
  > = {
    checkout: { label: "チェックアウトに戻る", href: checkoutHref },
    products: { label: "商品一覧を見る", href: productsHref },
    reload: { label: "ページを再読み込み", reload: true },
    support: { label: "お問い合わせ", href: supportHref, external: true },
  };

  const config = configs[reason] ?? configs.default;
  const primaryAction = actionMap[config.primary];
  const secondaryAction = config.secondary
    ? actionMap[config.secondary]
    : undefined;
  const shouldRevalidate = Boolean(config.revalidate);
  const shouldClearCart = Boolean(config.clearCart);

  return (
    <main className="bg-neutral-100 py-20">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white px-6 py-12 text-center shadow-lg">
        <ResetCheckoutSessionEffect />
        {shouldClearCart ? <ClearCartEffect /> : null}
        {shouldRevalidate ? <RevalidateProductsEffect /> : null}

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Checkout
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-900">
          {config.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          {config.description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ActionButton action={primaryAction} intent="primary" />
          <ActionButton action={secondaryAction} intent="secondary" />
        </div>

        <div className="mt-8 text-xs text-neutral-500">
          <p>
            ご不明点がございましたら、お手数ですが下記までお問い合わせください。
          </p>
          <a
            href="mailto:orders@example.com"
            className="font-medium text-neutral-900 underline"
          >
            orders@example.com
          </a>
        </div>
      </section>
    </main>
  );
}
