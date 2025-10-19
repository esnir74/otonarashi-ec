"use client";

import { ClearCartEffect } from "@/components/checkout/ClearCartEffect";
import { RevalidateProductsEffect } from "@/components/checkout/RevalidateProductsEffect";
import ActionButton from "./ActionButton";

type Props = {
  lang: string;
};

export function CheckoutSuccessContent({ lang }: Props) {
  const productsHref = `/${lang}/products`;
  const homeHref = `/${lang}`;
  const supportHref = "mailto:orders@example.com";

  return (
    <main className="bg-neutral-100 py-20">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white px-6 py-12 text-center shadow-lg">
        <ClearCartEffect />
        <RevalidateProductsEffect />

        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Checkout
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-900">
          ご購入ありがとうございました。
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          ご注文内容の確認メールをお送りしました。
          <br />
          内容にお間違いがないかご確認ください。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ActionButton
            intent="primary"
            action={{
              label: "商品一覧を見る",
              href: productsHref,
            }}
          />
          <ActionButton
            intent="secondary"
            action={{
              label: "トップページへ戻る",
              href: homeHref,
            }}
          />
        </div>

        <div className="mt-8 rounded-xl bg-neutral-50 px-6 py-5 text-left text-sm text-neutral-600">
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              確認メールが届いていない場合は迷惑メールフォルダをご確認ください。
            </li>
            <li>
              ご注文内容に関するお問い合わせは、下記のメールアドレスまでご連絡ください。
            </li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-neutral-500">
          <p>サポート窓口:</p>
          <a
            href={supportHref}
            className="font-medium text-neutral-900 underline"
          >
            orders@example.com
          </a>
        </div>
      </section>
    </main>
  );
}

export default CheckoutSuccessContent;
