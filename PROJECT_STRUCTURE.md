# オトナラシEC プロジェクト構成

更新日: 2025-10-18

## 📁 ディレクトリ構造

tailwindはバージョン３

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
│   │   │       ├── products/       # 商品関連
│   │   │       │   ├── page.tsx    # 商品一覧
│   │   │       │   ├── [slug]/
│   │   │       │   │   └── page.tsx # 商品詳細
│   │   │       │   ├── loading.tsx
│   │   │       │   └── not-found.tsx
│   │   │       ├── artisans/       # 職人紹介
│   │   │       │   ├── page.tsx    # 職人一覧
│   │   │       │   ├── loading.tsx
│   │   │       │   └── not-found.tsx
│   │   │       ├── news/           # お知らせ
│   │   │       │   ├── page.tsx    # お知らせ一覧
│   │   │       │   ├── [slug]/
│   │   │       │   │   └── page.tsx # お知らせ詳細
│   │   │       │   ├── loading.tsx
│   │   │       │   └── not-found.tsx
│   │   │       ├── contact/
│   │   │       │   └── page.tsx    # コンタクトフォーム
│   │   │       ├── chechout/
│   │   │       │   └── page.tsx    # 購入ページ
│   │   │       └── success/
│   │   │           ├── page.tsx    # 購入完了ページ（force-dynamic）
│   │   │           └── PendingClient.tsx
│   │   ├── admin/                  # 管理画面
│   │   │   ├── layout.tsx          # 管理画面レイアウト
│   │   │   ├── page.tsx            # 管理画面トップ
│   │   │   ├── products/           # 商品管理
│   │   │   │   ├── page.tsx        # 商品一覧（管理）
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # 商品編集
│   │   │   └── _components/
│   │   │       └── ImageUploader.tsx # 画像アップロードコンポーネント
│   │   ├── api/                    # API Routes
│   │   │   ├── checkout/
│   │   │   │   └── route.ts        # Stripe Checkout作成
│   │   │   ├── checkout-status/
│   │   │   │   └── route.ts        # 決済状況確認
│   │   │   └── images/             # 画像管理API
│   │   │       ├── sign/
│   │   │       │   └── route.ts    # 画像アップロード署名生成
│   │   │       └── save/
│   │   │           └── route.ts    # 画像保存処理
│   │   ├── success/                # レガシーページ（言語なし）
│   │   │   ├── page.tsx
│   │   │   └── PendingClient.tsx
│   │   ├── layout.tsx              # ルートレイアウト（HTML構造）
│   │   ├── page.tsx                # ルートページ（リダイレクト用）
│   │   └── fonts.ts                # フォント設定
│   ├── components/                 # Reactコンポーネント
│   │   ├── layout/                 # レイアウト関連
│   │   │   ├── Header.tsx          # ヘッダー（ナビゲーション + 言語切替）
│   │   │   ├── Footer.tsx          # フッター
│   │   │   └── LangSwitcher.tsx    # 言語切替UI
│   │   ├── product/                # 商品関連
│   │   │   └── ProductCardComponent.tsx  # 商品カード
│   │   └── news/                   # ニュース関連
│   │       └── NewsListItem.tsx    # ニュースリストアイテム
│   ├── i18n/                       # 国際化設定
│   │   ├── locales.ts              # サポート言語定義（ja, en, zh）
│   │   ├── routing.ts              # next-intlルーティング設定
│   │   ├── navigation.ts           # 多言語対応ナビゲーションヘルパー
│   │   └── request.ts              # next-intl リクエスト設定
│   ├── lib/                        # ユーティリティ・ライブラリ
│   │   ├── models/                 # データモデル（Zodスキーマ）
│   │   │   ├── product.ts          # 商品モデル
│   │   │   ├── artisan.ts          # 職人モデル
│   │   │   └── news.ts             # ニュースモデル
│   │   ├── repositories/           # データ取得層
│   │   │   ├── products.ts         # 商品データ取得
│   │   │   ├── artisans.ts         # 職人データ取得
│   │   │   └── news.ts             # ニュースデータ取得
│   │   ├── types/                  # 型定義
│   │   │   └── result.ts           # Result型（エラーハンドリング）
│   │   ├── utils/                  # ユーティリティ関数
│   │   │   ├── imageUrl.ts         # 画像URL生成ヘルパー
│   │   │   ├── calcShipping.ts     # 送料計算（EMS料金表ベース）
│   │   │   └── calcShipping.test.ts # 送料計算テスト
│   │   ├── stripe.ts               # Stripe SDK初期化
│   │   ├── supabaseClient.ts       # Supabase クライアント
│   │   ├── checkout.ts             # チェックアウト処理
│   │   ├── metadata.ts             # メタデータ生成
│   │   ├── i18n.ts                 # i18nユーティリティ
│   │   ├── image-resize.ts         # 画像リサイズ処理
│   │   ├── upload-product-images.ts # 商品画像アップロード
│   │   └── database.types.ts       # Supabase型定義
│   ├── messages/                   # 翻訳ファイル
│   │   ├── ja.json                 # 日本語
│   │   ├── en.json                 # 英語
│   │   └── zh.json                 # 中国語
│   └── middleware.ts               # Next.js Middleware（言語ルーティング）
├── .env.local                      # 環境変数（Git管理外）
├── next.config.ts                  # Next.js設定
├── tsconfig.json                   # TypeScript設定
├── tailwind.config.js              # Tailwind CSS設定
├── postcss.config.js               # PostCSS設定
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
| **画像ストレージ** | Supabase Storage |
| **メール送信** | SendGrid (Supabase Edge Functions経由) |
| **バリデーション** | Zod 4.1.12 |

---

## 🌐 多言語化の仕組み

### 1. URL構造
```
/ja         → 日本語トップ
/en         → 英語トップ
/zh         → 中国語トップ
/ja/checkout    → 日本語カート
/en/checkout    → 英語カート
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
● /[lang]/checkout    → /ja/checkout, /en/checkout, /zh/checkout
● /[lang]/success → /ja/success, /en/success, /zh/success
```

---

## 📦 主要ファイルの役割

| ファイル | 役割 |
|---------|------|
| `src/middleware.ts` | 言語プレフィックスの自動付与（`/` → `/ja`） |
| `src/i18n/request.ts` | next-intlの設定（URLから言語を動的取得） |
| `src/i18n/routing.ts` | ルーティング定義（defineRouting） |
| `src/i18n/navigation.ts` | 多言語対応ナビゲーションヘルパー（Link、redirect等） |
| `src/app/[lang]/layout.tsx` | **多言語レイアウトの中核**（Provider + Header/Footer） |
| `src/app/[lang]/(static)/layout.tsx` | 静的ページ用（`force-static`） |
| `src/app/[lang]/(dynamic)/layout.tsx` | 動的ページ用（デフォルトレンダリング） |
| `src/app/admin/layout.tsx` | 管理画面レイアウト |
| `src/app/admin/_components/ImageUploader.tsx` | 画像アップロードコンポーネント |
| `src/components/layout/LangSwitcher.tsx` | 言語切替UI（現在のパスを保持したまま言語変更） |
| `src/components/product/ProductCardComponent.tsx` | 商品カードコンポーネント |
| `src/components/news/NewsListItem.tsx` | ニュースリストアイテムコンポーネント |
| `src/lib/models/*.ts` | Zodスキーマによるデータモデル定義 |
| `src/lib/repositories/*.ts` | Supabaseからのデータ取得（キャッシュ付き） |
| `src/lib/types/result.ts` | Result型によるエラーハンドリング |
| `src/lib/utils/imageUrl.ts` | 画像URL生成ヘルパー |
| `src/lib/utils/calcShipping.ts` | 送料計算（国別・重量別EMS料金表） |
| `src/lib/utils/calcShipping.test.ts` | 送料計算ロジックのテスト |
| `src/lib/image-resize.ts` | 画像リサイズ処理 |
| `src/lib/upload-product-images.ts` | 商品画像アップロード処理 |
| `src/messages/*.json` | 翻訳データ（common, navなど） |

---

## 🎯 レンダリング戦略

| パス | 戦略 | 理由 |
|------|------|------|
| `/[lang]` (static) | **SSG** (`force-static`) | コンセプトページは完全静的 |
| `/[lang]/products` | **ISR** (`revalidate: 60`) | 商品一覧は60秒キャッシュ |
| `/[lang]/products/[slug]` | **ISR** (`revalidate: 60`) | 商品詳細は60秒キャッシュ |
| `/[lang]/artisans` | **ISR** (`revalidate: 60`) | 職人一覧は60秒キャッシュ |
| `/[lang]/news` | **ISR** (`revalidate: 60`) | お知らせ一覧は60秒キャッシュ |
| `/[lang]/news/[slug]` | **ISR** (`revalidate: 60`) | お知らせ詳細は60秒キャッシュ |
| `/[lang]/contact` | **SSG** | コンタクトフォームは静的 |
| `/[lang]/checkout` | **SSG** | カートUIは静的生成可能 |
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

## 📝 実装状況

### 完了
- [x] 商品一覧ページ（`/[lang]/products`）
- [x] 商品詳細ページ（`/[lang]/products/[slug]`）
- [x] 職人紹介ページ（`/[lang]/artisans`）
- [x] お知らせ一覧ページ（`/[lang]/news`）
- [x] お知らせ詳細ページ（`/[lang]/news/[slug]`）
- [x] コンタクトフォーム（`/[lang]/contact`）
- [x] カートページ（`/[lang]/checkout`）
- [x] 購入完了ページ（`/[lang]/success`）
- [x] 管理画面（`/admin`）
  - [x] 商品一覧・編集（`/admin/products`）
  - [x] 画像アップロード機能
- [x] API Routes
  - [x] Stripe Checkout作成（`/api/checkout`）
  - [x] 決済状況確認（`/api/checkout-status`）
  - [x] 為替レート取得（`/api/fx-rate`）
  - [x] PaymentIntent作成（`/api/create-payment-intent`）
  - [x] 配送先更新（`/api/update-shipping`）
  - [x] 画像管理（`/api/images/*`）
- [x] 送料計算ロジック
  - [x] EMS料金表ベース（5地帯・500g〜30kg）
  - [x] 国別ゾーン振り分け
  - [x] 商品重量合計計算
  - [x] テストカバレッジ完備

### 今後の実装予定
- [ ] 管理画面の機能拡張
  - [ ] 職人管理
  - [ ] お知らせ管理
  - [ ] 注文管理
- [ ] Supabase Edge Functions
  - [ ] Stripe Webhook処理
  - [ ] メール送信（SendGrid連携）

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
