# オトナラシEC プロジェクト構成

更新日: 2025-10-13

## 📁 ディレクトリ構造

```
otonarashi-ec/
├── public/                         # 静的ファイル（画像、アイコンなど）
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── [lang]/                 # 多言語ルート（ja, en, zh）
│   │   │   ├── layout.tsx          # 言語別レイアウト（NextIntlClientProvider + Header/Footer）
│   │   │   ├── (static)/           # 静的ページ用Route Group
│   │   │   │   ├── layout.tsx      # force-static設定
│   │   │   │   └── page.tsx        # トップページ（コンセプト）
│   │   │   └── (dynamic)/          # 動的ページ用Route Group
│   │   │       ├── layout.tsx      # パススルーレイアウト
│   │   │       ├── cart/
│   │   │       │   └── page.tsx    # カートページ
│   │   │       └── success/
│   │   │           ├── page.tsx    # 購入完了ページ（force-dynamic）
│   │   │           └── PendingClient.tsx
│   │   ├── api/                    # API Routes
│   │   │   ├── checkout/
│   │   │   │   └── route.ts        # Stripe Checkout作成
│   │   │   └── checkout-status/
│   │   │       └── route.ts        # 決済状況確認
│   │   ├── success/                # レガシーページ（削除予定？）
│   │   │   ├── page.tsx
│   │   │   └── PendingClient.tsx
│   │   ├── layout.tsx              # ルートレイアウト（HTML構造）
│   │   ├── page.tsx                # デモページ（削除予定？）
│   │   ├── globals.css             # グローバルスタイル
│   │   ├── page.module.css
│   │   └── fonts.ts                # フォント設定
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx          # ヘッダー（ナビゲーション + 言語切替）
│   │       ├── Footer.tsx          # フッター
│   │       └── LangSwitcher.tsx    # 言語切替UI
│   ├── i18n/                       # 国際化設定
│   │   ├── locales.ts              # サポート言語定義（ja, en, zh）
│   │   ├── routing.ts              # next-intlルーティング設定
│   │   └── request.ts              # next-intl リクエスト設定
│   ├── lib/                        # ユーティリティ・ライブラリ
│   │   ├── stripe.ts               # Stripe SDK初期化
│   │   ├── supabaseClient.ts       # Supabase クライアント
│   │   ├── checkout.ts             # チェックアウト処理
│   │   └── database.types.ts       # Supabase型定義
│   ├── messages/                   # 翻訳ファイル
│   │   ├── ja.json                 # 日本語
│   │   ├── en.json                 # 英語
│   │   └── zh.json                 # 中国語
│   └── middleware.ts               # Next.js Middleware（言語ルーティング）
├── .env.local                      # 環境変数（Git管理外）
├── next.config.ts                  # Next.js設定
├── tsconfig.json                   # TypeScript設定
├── package.json                    # 依存パッケージ
├── CLAUDE.md                       # プロジェクト概要・仕様書
└── PROJECT_STRUCTURE.md            # このファイル
```

---

## 🔧 技術スタック

| 分類 | 技術 |
|------|------|
| **フレームワーク** | Next.js 15.5.4 (App Router) |
| **言語** | TypeScript 5 |
| **多言語化** | next-intl 4.3.12 |
| **決済** | Stripe 19.1.0 |
| **データベース** | Supabase (@supabase/supabase-js 2.75.0) |
| **ホスティング** | Cloudflare Pages |
| **画像最適化** | Cloudinary |
| **メール送信** | SendGrid (Supabase Edge Functions経由) |

---

## 🌐 多言語化の仕組み

### 1. URL構造
```
/ja         → 日本語トップ
/en         → 英語トップ
/zh         → 中国語トップ
/ja/cart    → 日本語カート
/en/cart    → 英語カート
```

### 2. 処理フロー
```
リクエスト
  ↓
middleware.ts（言語判定・リダイレクト）
  ↓
app/[lang]/layout.tsx
  ├─ URLから言語を取得（params.lang）
  ├─ messages/{lang}.jsonを読み込み
  └─ NextIntlClientProvider でラップ
      ├─ Header（言語切替UI含む）
      ├─ main（ページコンテンツ）
      └─ Footer
```

### 3. 静的生成
`generateStaticParams()` により、ビルド時に全言語バージョンを事前生成：
```
● /[lang]         → /ja, /en, /zh
● /[lang]/cart    → /ja/cart, /en/cart, /zh/cart
● /[lang]/success → /ja/success, /en/success, /zh/success
```

---

## 📦 主要ファイルの役割

| ファイル | 役割 |
|---------|------|
| `src/middleware.ts` | 言語プレフィックスの自動付与（`/` → `/ja`） |
| `src/i18n/request.ts` | next-intlの設定（URLから言語を動的取得） |
| `src/i18n/routing.ts` | ルーティング定義（defineRouting） |
| `src/app/[lang]/layout.tsx` | **多言語レイアウトの中核**（Provider + Header/Footer） |
| `src/app/[lang]/(static)/layout.tsx` | 静的ページ用（`force-static`） |
| `src/app/[lang]/(dynamic)/layout.tsx` | 動的ページ用（デフォルトレンダリング） |
| `src/components/layout/LangSwitcher.tsx` | 言語切替UI（現在のパスを保持したまま言語変更） |
| `src/messages/*.json` | 翻訳データ（common, navなど） |

---

## 🎯 レンダリング戦略

| パス | 戦略 | 理由 |
|------|------|------|
| `/[lang]` (static) | **SSG** (`force-static`) | コンセプトページは完全静的 |
| `/[lang]/cart` | **SSG** | カートUIは静的生成可能 |
| `/[lang]/success` | **SSR** (`force-dynamic`) | Stripe決済確認が必要（動的処理） |
| `/api/checkout` | **Dynamic** | Stripe APIコール |
| `/api/checkout-status` | **Dynamic** | Supabase DBクエリ |

---

## 🚀 ビルドコマンド

```bash
# 開発サーバー
npm run dev

# プロダクションビルド
npm run build

# ビルド結果の確認
npm run start
```

---

## 📝 今後の実装予定（milestone.mdより）

- [ ] 商品一覧ページ（`/[lang]/products`）
- [ ] 商品詳細ページ（`/[lang]/products/[id]`）
- [ ] 職人紹介ページ（`/[lang]/artisans`）
- [ ] お知らせページ（`/[lang]/news`）
- [ ] コンタクトフォーム（`/[lang]/contact`）
- [ ] 管理画面（`/admin`）

---

## 🔑 環境変数（.env.local）

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 📚 参考ドキュメント

- [Next.js App Router](https://nextjs.org/docs/app)
- [next-intl (App Router)](https://next-intl.dev/docs/getting-started/app-router)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

---

**このファイルは別のAIエージェントがプロジェクトを理解するためのスナップショットです。**
