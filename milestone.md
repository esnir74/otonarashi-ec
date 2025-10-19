# 🌸 オトナラシ EC システム開発マイルストーン計画（詳細版）

---

## 🏁 プロジェクト概要

**プロジェクト名:**  
ハナタバプロジェクト × オトナラシ（Otonarashi）

**目的:**  
着物アップサイクルブランド「オトナラシ」の公式 EC サイト構築。  
伝統と現代を融合させたアップサイクルファッションを世界に発信するため、  
“洗練されたブランド体験 × 社会的背景の可視化 × 安定した販売基盤” を実現する。

**運営:** ハナタバプロジェクト  
**ブランド:** オトナラシ  
**主要技術:** Next.js, Cloudflare Pages, Supabase, Stripe, SendGrid(KKE), Cloudinary  
**対応言語:** 日本語 / 英語 / 中国語  
**想定期間:** 約 40 日  
**目標ローンチ:** ベータ公開 → 本番公開（2 フェーズ展開）

---

## 🔶 マイルストーン一覧

| ID  | フェーズ                             | 期間目安 | 主な成果物                                                      |
| --- | ------------------------------------ | -------- | --------------------------------------------------------------- |
| M0  | キックオフ & 要件凍結                | 3 日     | 要件定義書・導線図・役割分担・環境変数一覧                      |
| M1  | 情報設計 & DB スキーマ               | 4 日     | ER 図・テーブル定義・Supabase 初期構築                          |
| M2  | 基盤セットアップ                     | 3 日     | 環境構築・連携確認（Cloudflare / Supabase / Stripe / SendGrid） |
| M3  | フロント枠組み & 多言語基盤          | 5 日     | Next.js 構成・ルーティング・i18n 設定・メタタグ出力             |
| M4  | 閲覧系ページ（商品・職人・お知らせ） | 6 日     | 商品/職人/ニュース一覧・詳細ページ・SOLD OUT 表示               |
| M5  | カート & カード決済フロー            | 6 日     | カート実装・Stripe Checkout 連携・Webhook 処理                  |
| M6  | 郵便振替決済（オフライン）           | 3 日     | pending 注文処理・入金確認・通知メール                          |
| M7  | 管理画面（Admin）                    | 6 日     | CRUD UI・翻訳タブ・画像アップロード・RLS 確認                   |
| M8  | 品質保証・SEO・法務整備              | 5 日     | E2E テスト・メタ設定・法務ページ                                |
| M9  | コンテンツ投入 & ローンチ            | 3 日     | 本番データ投入・DNS 切替・運用ドキュメント                      |

合計期間：**約 40 日（並行工程あり）**

---

## 🚩 各マイルストーン詳細

---

### **M0. キックオフ & 要件凍結（3 日）**

#### 目的

- 開発全体の方向性を明確化し、全メンバーが同じ地図を共有する。

#### 成果物

- `requirements.md`：ページ構成・導線・非機能要件
- 環境変数リスト（Stripe/SendGrid/Supabase）
- Figma 構成図（ユーザーフロー + ページ構成）
- 役割分担（デザイナー / 開発者 / 翻訳 / 運用）

#### 完了条件

- ドキュメントに署名（承認）
- GitHub リポジトリと Notion スペースを作成
- タスク管理テンプレート（Notion または Linear）準備完了

---

### **M1. 情報設計 & DB スキーマ（4 日）**

#### 目的

- Supabase にデータ構造を定義し、翻訳対応を含めた ER 設計を完了する。

#### 作業内容 1

1. ER 図作成（products, artisans, news, orders, pages, translations）
2. テーブル定義：
   - `products`（共通情報）
   - `product_translations`（title/description/lang）
   - `artisans` + `artisan_translations`
   - `news` + `news_translations`
   - `orders` / `order_items` / `pages`
3. RLS 方針：
   - 公開 View：SELECT のみ
   - 編集者：CRUD 可能（`editor`ロール）
4. ダミーデータ投入（10 件）
5. 一旦ローカルで supabase 動くようにする

#### 完了条件

- ER 図がチーム内レビュー済み
- Supabase に DDL 適用完了（SQL 確認）
- すべてのテーブルに多言語列または翻訳テーブル定義済み

---

### **M2. 基盤セットアップ（3 日）**

#### 目的

- 各クラウドサービスを連携し、開発・検証環境を整える。

#### 作業内容

- Cloudflare Pages 初期デプロイ（Next.js 接続）
- Supabase プロジェクト作成（Free）
- Stripe テストモード接続
- SendGrid(KKE)登録・ドメイン認証（SPF/DKIM）
- `.env.sample` の作成と共有

#### 完了条件

- すべての外部サービスが API 連携成功（テスト API レスポンス確認）
- ステージング URL 発行（Cloudflare Pages）
- SendGrid で 1 日 100 通メールテスト完了

---

### **M3. フロント枠組み & 多言語基盤（5 日）**

#### 目的

- Next.js の国際化構成を整備し、全ページ共通レイアウトを構築。

#### 作業内容

- `app/[lang]/layout.tsx` 構成
- `next-intl` 設定
- ルート URL `/ja /en /zh`
- メタタグ `hreflang` 自動出力
- i18n メッセージファイル（`messages/ja.json`等）
- ベースデザイン（ヘッダー／フッター／配色）

#### 完了条件

- 3 言語でトップページ（コンセプト）が SSR/ISR で表示
- Cloudflare Pages 上で言語切替が即時反映
- Lighthouse Score（Performance/SEO） ≧ 85

# 🌸 M3 内部分割マイルストーン

フェーズ名：フロント枠組み & 多言語基盤

---

## M3-1：フロント骨格構築（レイアウト＆デザイン基盤）

**期間目安：2 日**

### 🎯 目的

App Router 構成とベースデザイン（レイアウト・フォント・色・UI トーン）を固める。

### 🧩 作業内容

- Next.js App Router 構成整備
  - `/app/[lang]/layout.tsx`
  - `/app/[lang]/page.tsx`（仮トップ）
- Tailwind CSS / PostCSS 設定
- `globals.css` 作成（白 × 淡ベージュ × 墨色）
- 明朝体＋サンセリフフォント導入
- `<Header>` `<Footer>` `<Layout>` コンポーネント作成
- ページ共通の `<Container>` / `<Section>` コンポーネント整備

### ✅ 完了条件

- `/ja` にアクセスするとベースレイアウトが SSR で表示される
- デザインポリシー通りのトーン確認（背景・余白・フォント・配色）
- Lighthouse Performance ≥ 80

---

## M3-2：多言語対応（next-intl 統合 & ルーティング）

**期間目安：2 日**

### 🎯 目的

3 言語（日本語／英語／中国語）のルーティング・翻訳基盤を整備。

### 🧩 作業内容

- `next-intl` 導入
- `/messages/ja.json`, `/messages/en.json`, `/messages/zh.json` 作成
- `/app/[lang]/layout.tsx` に `NextIntlClientProvider` 統合
- 言語別パス `/ja`, `/en`, `/zh`
- `generateStaticParams` により言語自動ビルド
- `hreflang` メタ設定追加
- ヘッダーに言語切替トグル設置

### ✅ 完了条件

- 3 言語でトップページ表示が成功（翻訳文言反映）
- Cloudflare Pages プレビューで切替即時反映
- Lighthouse SEO ≥ 85

---

## M3-3：メタ情報 & SEO 最適化

**期間目安：1 日**

### 🎯 目的

各言語に適したタイトル／OGP／メタ情報を付与し、検索最適化を行う。

### 🧩 作業内容

- `generateMetadata()` 実装
- ページごとの `title`, `description`, `og:image`
- `<link rel="alternate" hreflang>` 自動出力
- OGP 画像テンプレート（共通ロゴ＋背景）設定
- `robots.txt`, `sitemap.xml` 自動生成（M8 に向け準備）

### ✅ 完了条件

- 各言語で OGP/メタ正しく出力
- Search Console で hreflang 警告なし
- Lighthouse SEO ≥ 90

---

## 🚩 M3 全体完了条件

- `/ja`, `/en`, `/zh` の 3 言語でトップページが SSR 表示
- Cloudflare Pages で言語切替・OGP 反映が即時確認可能
- デザイン・UX が outline.md に準拠

---

### **M4. 閲覧系ページ（商品・職人・お知らせ）（6 日）**

#### 目的

- 販売導線の土台となる閲覧系ページを実装。

#### 作業内容

- 商品一覧・詳細
  - SOLD OUT 対応
  - 職人リンク（この商品を作った人）
- 職人紹介ページ
  - 職人一覧／詳細（作業所・デザイナー紹介）
- お知らせ一覧／詳細
  - 一覧に戻る導線
- Cloudinary ローダー導入（画像最適化）

ここでメタデータ整える！！！！！！
メタ情報 & SEO 最適化（M3）

#### 完了条件

- 商品詳細 → 職人紹介／お知らせ詳細 → 一覧戻る導線が機能
- 画像最適化確認（AVIF/WebP 配信）
- 各ページが SSR/ISR で安定動作


### 簡易フロー
Request /ja/products?page=1&artisan=abc
   ↓ (Server Component)
Repository.getProducts(params, lang='ja')  // unstable_cache + tag 'products'
   ↓ (Supabase with RLS, anon key)
rows → Zod → Mapper（翻訳フォールバック、SOLD OUT判定、価格整形）
   ↓
UI（ProductGrid, Pagination）を描画


# M4 微細マイルストーン

## M4.1 ルーティング雛形 & ページ骨組み
- **目的**: URL/階層を固め、SSR/ISR方針を差し込む土台を作る  
- **範囲**:  
  - `/[lang]/(dynamic)/products`, `/products/[id]`  
  - `/[lang]/(dynamic)/artisans`, `/artisans/[id]`  
  - `/[lang]/(dynamic)/news`, `/news/[id]`  
  - `export const revalidate = 60`（暫定）/ `loading.tsx` / `not-found.tsx`
- **成果物**: 最小のpage.tsxとメタ定義、パンくず/戻る導線のダミー
- **DoD**: 3言語でルート遷移が404なく通る。Lighthouse エラーなし。
- **時間**: 0.5〜1日  
- **依存**: なし（最初に着手）

## M4.2 Repository 層（Supabaseクエリ）最小実装
- **目的**: UIからDB依存を切り離す契約を確立  
- **範囲**: `src/lib/repositories/*`
  - `getProducts({page, per, sort, filters}, lang)`  
  - `getProductById(id, lang)`  
  - `getArtisans({page, per}, lang)` / `getArtisanById`  
  - `getNews({page, per}, lang)` / `getNewsById|Slug`
  - `unstable_cache` + `tags: ['products'|'artisans'|'news']`
- **成果物**: 型付きの関数群、ダミーデータでの戻り検証
- **DoD**: 主要関数が型エラーなしでビルド通過、失敗時に`Result`型で理由が取れる
- **時間**: 1〜1.5日  
- **依存**: M1のスキーマ前提

## M4.3 Mapper/Domain 層（翻訳・SOLD OUT判定）
- **目的**: UIに優しい形へ整形（言語フォールバック・価格整形・在庫判定）  
- **範囲**: `src/lib/models/*`
  - `toProductCard`, `toProductDetail`, `toArtisanCard` など  
  - `lang`フォールバック（`zh→ja` 等）  
  - `isSoldOut` / `priceFormatted` / 日付フォーマット
- **成果物**: UI用DTOとZodスキーマ
- **DoD**: 欠損翻訳でjaに落ち、UI側はnull分岐不要
- **時間**: 0.5〜1日  
- **依存**: M4.2

## M4.4 一覧UI（Grid & Card）実装
- **目的**: 一覧が“見える&速い&読みやすい”状態へ  
- **範囲**:
  - `ProductCard/Grid`, `ArtisanCard/Grid`, `NewsCard/List`  
  - `Pagination`, `EmptyState`, `ErrorState`  
  - URLクエリ: `?page=&per=&sort=&artisan=&material=`
- **成果物**: 3ページの一覧テンプレ＋共通コンポーネント
- **DoD**: 3言語で一覧表示、空/エラー/ローディングが視覚確認できる
- **時間**: 1.5〜2日  
- **依存**: M4.3

## M4.5 詳細ページ（導線込み）
- **目的**: 商品の“伝わる”詳細、職人/お知らせの回遊導線  
- **範囲**:
  - `ProductDetail`: 写真・素材・サイズ・価格・SOLD OUT・「この商品を作った人」  
  - `ArtisanDetail`: プロフィール・「この職人の商品を見る」  
  - `NewsDetail`: 本文表示・「一覧に戻る」
- **成果物**: 3種類の詳細テンプレ＋回遊リンク
- **DoD**: 3言語で詳細が崩れず、リンクが正しく機能
- **時間**: 1.5日  
- **依存**: M4.4

## M4.6 Cloudinary 統合（最適化画像）
- **目的**: 画像の軽量化と質の担保  
- **範囲**:
  - `next.config.ts` ローダ設定  
  - `lib/image.ts`（幅/画質/format自動）  
  - カード/詳細の`next/image`差し替え
- **成果物**: AVIF/WebP配信、CLS最小化（w/h指定）
- **DoD**: 代表ページで画像が圧縮配信、Lighthouse Perf +10pt目安
- **時間**: 0.5日  
- **依存**: M4.4/4.5

## M4.7 i18n 仕上げ（固定文言&日付/通貨）
- **目的**: 3言語の体験を均一に  
- **範囲**:
  - `messages/{ja,en,zh}.json` キー整理  
  - 固定UI（見出し/ボタン/空状態）を `useTranslations()` 化  
  - 通貨フォーマット/日付ローカライズ
- **成果物**: 文言ファイルと適用済みUI
- **DoD**: 言語切替で固定文言/数値/日付が切り替わる
- **時間**: 0.5日  
- **依存**: M4.4/4.5

## M4.8 SEO/OGP・メタ（最低限）
- **目的**: 検索/シェアで破綻しない初期値  
- **範囲**:
  - `metadata`（title/description/alternates）  
  - 一覧のcanonical（ページング対応）  
  - 詳細のOGP（Cloudinaryテンプレ or 既存画像）
- **成果物**: メタタグ反映、`hreflang`はM3準拠
- **DoD**: 代表URLでOG検証OK、重複タイトルなし
- **時間**: 0.5日  
- **依存**: M4.5/4.6

## M4.9 アクセシビリティ/状態管理の磨き込み
- **目的**: 読みやすさ&操作性の底上げ  
- **範囲**:
  - `alt`/見出し階層/ランドマーク/フォーカス可視化  
  - ローディング`aria-live`、パンくず`nav[aria-label]`
- **成果物**: a11yチェックリスト準拠のUI
- **DoD**: Axe/Lighthouse Accessibility ≥ 90
- **時間**: 0.5日  
- **依存**: M4.4〜4.7

## M4.10 最小E2Eと計測仕込み
- **目的**: 壊れにくさ確認と将来の分析の布石  
- **範囲**:
  - Playwright（Smoke）：一覧→詳細→導線確認  
  - 主要ボタンに`data-analytics`属性（クリック計測の準備）
- **成果物**: `e2e/smoke.spec.ts`、GitHub Actionsジョブ（任意）
- **DoD**: CIでSmokeが通る、主要導線失敗時に赤くなる
- **時間**: 0.5〜1日  
- **依存**: M4全体

---

## 並行可能性・“切れる”中間ゴール
- **並行**:  
  - M4.2（Repo）と M4.4（一覧UI）の一部（モック）  
  - M4.6（Cloudinary）はUIベース完成後に短時間で差し替え  
- **中間公開（Beta Cut）**:  
  - **Cut-1**: M4.1〜4.4完了 → 一覧3種をまず公開（詳細は簡易版）  
  - **Cut-2**: M4.5/4.6/4.7 → 詳細＋画像最適化＋i18n仕上げ  
  - **Cut-3**: M4.8/4.9/4.10 → SEO/a11y/E2Eで硬化

---

## 全体の受け入れ条件（M4完了）
- 一覧/詳細（商品・職人・お知らせ）が**3言語で閲覧可**  
- **SOLD OUT**が一覧&詳細で正しく表示  
- 回遊導線：**商品→職人**／**職人→該当商品の一覧**／**お知らせ詳細→一覧**が機能  
- 画像はCloudinary最適化で配信  
- 空/エラー/ローディング/a11yが揃い、Lighthouse（Perf/SEO/Accessibility）≥ 85  
- `npm run build`/`start`成功、Smoke E2EがCI通過

---

## 付録：チェックリスト（Issue貼り付け用・抜粋）
- [ ] ルーティング雛形（6ルート）  
- [ ] Repo関数（6本）＋ `unstable_cache` タグ設定  
- [ ] Mapper（Card/Detail DTO + Zod）  
- [ ] Grid/Card/Empty/Error/Pagination  
- [ ] 詳細3種＋導線リンク  
- [ ] Cloudinaryローダ + image util  
- [ ] i18n文言（固定UI/通貨/日付）  
- [ ] metadata/canonical/OGP  
- [ ] a11y（alt/landmarks/focus/aria-live）  
- [ ] Playwright smoke（3言語×一覧→詳細→戻る）


---

### **M5. カート & カード決済フロー（6 日）**

#### 目的

- カート → 購入 → 決済 → 注文作成の一連フローを構築。

#### 作業内容

- ローカルカート（localStorage 保持）
- Checkout セッション作成（Supabase Edge Function）
- Stripe Checkout 呼び出し（言語付き）
- Webhook 処理：`checkout.session.completed`  
  → `orders`作成・在庫-1・メール送信

#### 完了条件

- テストカードで購入完了し、DB に注文記録が生成される
- 在庫が 1 減算される
- SendGrid でメール（各言語）送信確認済み
- すでにカートにその商品がある時、もう一度カートに入れられない

---
# カート＆購入フロー完成までの詳細マイルストーン

本ドキュメントは、Zustand を用いたゲストカート + 多通貨（JPY/USD/EUR）表示 + Stripe Checkout 連携構成を完成させるための詳細マイルストーンです。  
API レイヤーは `/api/fx-rate`（Redis キャッシュ付）を前提にしています。

---

## 📍 Milestone 1：Zustand カートストアの基盤構築

### 目的
- ゲストカート機能を実装（localStorage 永続化）
- `{ productId, quantity, variantKey? }` を保持
- 通貨選択と為替レートも状態管理

### タスク
- `store/cart.ts` を作成し、`persist` middleware で localStorage へ永続化。
- 型定義：
  - `CartItem = { id: string; name: string; priceJPY: number; quantity: number; variantKey?: string }`
  - `Currency = 'JPY' | 'USD' | 'EUR'`
  - `FxRate = { usdRate: number; eurRate: number } // いずれも 1 JPY あたり`
- Store state：
  - `items: CartItem[]`
  - `selectedCurrency: Currency`（初期値 `'JPY'`）
  - `fxRate: FxRate | null`
- Actions：`addItem`, `removeItem`, `updateQty`, `clearCart`, `setCurrency`, `setFxRate`。
- Derived selector：`cartTotal(currency)` → `sum(item.priceJPY * (currency === 'JPY' ? 1 : rate))`。

---

## 📍 Milestone 2：UI 統合（ドロワーカート）

### 目的
- 右側から開くドロワーでカート内容を表示（MGG のような UX）
- Add to Cart → ドロワーを自動オープンし、最新状態を反映

### タスク
- `CartDrawer` コンポーネントを作成（shadcn/ui の `Sheet` or Radix UI の `Dialog/Sheet`）。
- ヘッダーにカートアイコン＋バッジ（`items.length` または合計数量）。
- 行アイテム：サムネ、名前、数量変更、削除。
- 合計金額表示は `selectedCurrency` と `fxRate` に応じてリアルタイム換算。
- ドロワー内に通貨セレクタ（`JPY / USD / EUR`）。`setCurrency` を呼ぶ。

---

## 📍 Milestone 3：Checkout ページの構築

### 目的
- 通貨・レートを反映した金額を表示し、Stripe Hosted Checkout へ遷移

### タスク
- `app/checkout/page.tsx`（クライアントコンポーネント）でサマリー表示。
- 進むボタン押下時に `/api/fx-rate` を呼んで最新レートを確保（ズレ防止）。
- JPY 基準の小計/送料を換算：
  - `USD/EUR` は `Math.round(priceJPY * rate)` で最小通貨単位へ（Stripe は整数）。
- `/api/checkout` へ `{ items, currency, fxRate, totals }` を POST。

---

## 📍 Milestone 4：/api/checkout 実装（バックエンド）

### 目的
- Supabase で在庫・価格を再検証し、注文スナップショットを作成、Stripe セッションを作成

### タスク（例）
1. リクエストスキーマ検証（Zod 等）  
   - `currency in ['JPY','USD','EUR']`
   - `fxRate` は `usdRate/eurRate` の数値
2. Supabase から `product_id` 一覧で在庫/公開/価格を SELECT。未公開・在庫 0 は除外。
3. スナップショット作成（DB）：  
   - `order_items(unit_price_yen)` は **当時の JPY 価格** を固定保存。  
   - `orders` には内部 JPY 合計、支払通貨金額、`exchange_rate` と `timestamp` を保存。
4. Stripe `checkout.sessions.create`：
   - `currency`: ユーザー選択通貨
   - `line_items`: 換算済み `unit_amount`（整数）
   - `client_reference_id`: `order_number`
   - `success_url` / `cancel_url`
5. セッション URL を返却。

> **メモ**：多通貨の金額は整数（cent 等）に丸める。JPY は小数なし。

---

## 📍 Milestone 5：Success ページ / 最終確定

### 目的
- 戻り先で注文状態を確定し、カートをクリア

### タスク
- `app/success/page.tsx`：注文番号とローカライズメッセージ表示。
- `/api/checkout-status`：Stripe セッション ID を受け、`payment_intent.succeeded` を確認。OK なら `orders.status='paid'` を確定。
- フロントで `clearCart()` 実行。

---

## 📍 Milestone 6：運用・堅牢化

### 目的
- キャッシュ・為替・ログ・誤差対策で安定運用

### タスク
- Redis TTL：10〜30 分。`/api/fx-rate` は古いキャッシュでもフォールバック返却。
- 丸めルールの統一：
  - 表示：小数 2 桁（USD/EUR）
  - Stripe 渡し：整数（`Math.round`）
- 監査：`orders.exchange_rate`, `exchange_rate_timestamp` を必ず保存。
- ログ：外部 API 呼び出し回数、キャッシュヒット率、Stripe エラー率を記録。
- E2E テスト：Playwright/Jest で通貨切替〜決済フローを自動化。

---

## 📦 参考スニペット

### Zustand ストア（概要）

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Currency = "JPY" | "USD" | "EUR";
type FxRate = { usdRate: number; eurRate: number }; // どちらも 1 JPY あたり
type CartItem = { id: string; name: string; priceJPY: number; quantity: number; variantKey?: string };

type CartState = {
  items: CartItem[];
  selectedCurrency: Currency;
  fxRate: FxRate | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setCurrency: (c: Currency) => void;
  setFxRate: (r: FxRate) => void;
  totalIn: (c: Currency) => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedCurrency: "JPY",
      fxRate: null,
      addItem: (item) => set((s) => {
        const i = s.items.findIndex(x => x.id === item.id && x.variantKey === item.variantKey);
        if (i >= 0) {
          const next = [...s.items];
          next[i] = { ...next[i], quantity: next[i].quantity + item.quantity };
          return { items: next };
        }
        return { items: [...s.items, item] };
      }),
      removeItem: (id) => set((s) => ({ items: s.items.filter(x => x.id !== id) })),
      updateQty: (id, qty) => set((s) => ({ items: s.items.map(x => x.id === id ? { ...x, quantity: qty } : x) })),
      clearCart: () => set({ items: [] }),
      setCurrency: (c) => set({ selectedCurrency: c }),
      setFxRate: (r) => set({ fxRate: r }),
      totalIn: (c) => {
        const { items, fxRate } = get();
        const base = items.reduce((sum, it) => sum + it.priceJPY * it.quantity, 0);
        if (c === "JPY") return base;
        const rate = c === "USD" ? fxRate?.usdRate : fxRate?.eurRate;
        if (!rate) return base; // rate 未取得時は JPY のまま
        return Math.round(base * rate);
      }
    }),
    { name: "cart-store" }
  )
);
```

### `/api/fx-rate` 叩いて store を更新する例

```ts
async function refreshFx() {
  const res = await fetch("/api/fx-rate");
  const json = await res.json();
  if (json?.rate) {
    useCartStore.getState().setFxRate(json.rate);
  }
}
```

---

## ✅ 完成の定義（Definition of Done）

- カート追加 → ドロワー表示→ 通貨切替が即時反映される
- Checkout ページで最新レートが取得でき、金額が確定
- `/api/checkout` がスナップショットを保存し Stripe セッションを作成
- Success で注文確定、カートがクリアされる
- 主要ケース（JPY/USD/EUR、在庫切れ、Stripe キャンセル）を E2E テストで担保

---

## メモ
- JPY は最小単位が 1 円（小数なし）、USD/EUR は最小単位が 1 セント/1 ユーロセント（整数）。
- 丸めは **サーバ側で統一**（`Math.round`）し、UI と Stripe で不一致が出ないようにする。


### **M6. 郵便振替決済（オフライン）（3 日）**

#### 目的

- 非クレジット決済ユーザーに対応。

#### 作業内容

- `payment_method='postal_transfer'` で pending 注文作成
- 画面＆メールで振替口座・期限案内
- 管理画面で入金確認 → `status='paid'` 更新 → 通知送信

#### 完了条件

- pending→paid 更新でメール送信
- 試験注文で正しい在庫・金額反映

---

### **M7. 管理画面（Admin）（6 日）**

#### 目的

- 運用者がノーコードで商品・職人・ニュース・固定ページを更新できる UI を構築。

#### 作業内容

- `/admin` 実装（Next.js）
- Supabase Auth（メールリンク認証）
- 役割：`editor` / `fulfillment`
- CRUD 画面
  - 商品・職人・お知らせ・ページ
  - 多言語タブ入力
  - 画像アップロード（Storage）
- RLS テスト・監査ログ確認

#### 完了条件

- 編集者がログイン → 商品登録 → 翻訳追加 → 公開可能
- 操作履歴が監査テーブルに記録される
- RLS 誤設定なし（閲覧権限分離確認）

---

### **M8. 品質保証・SEO・法務（5 日）**

#### 目的

- 本番公開前に品質・法的要件をクリアする。

#### 作業内容

- E2E テスト（Playwright）：閲覧 → 決済 → 完了
- Lighthouse 測定（Performance, Accessibility, SEO）
- OGP/メタ設定（多言語）
- 規約・プライバシーポリシー・特商法ページ作成
- サイトマップ／robots.txt 生成

#### 完了条件

- 全テストケース合格
- Lighthouse 総合スコア ≥ 90
- 法務ページリンクをフッター設置済み
- Google Search Console 登録済み

---

### **M9. コンテンツ投入 & ローンチ（3 日）**

#### 目的

- 本番データの投入と運用移行。

#### 作業内容

- 商品データ登録（50 件想定）
- 翻訳入力（英語・中国語）
- Stripe 本番キー差し替え
- DNS 切替（Cloudflare）
- 運用手順書（商品追加・翻訳・返金対応）

#### 完了条件

- 実注文（テスト ¥0）で全処理通過
- SendGrid 送信確認
- バックアップ確認（Supabase 自動+手動）
- 公開アナウンス配信

---

## ⚙️ 並行可能な工程

- M4（閲覧系）と M6（郵便振替）は同時進行可
- コンテンツ制作（写真・翻訳）は M3 以降で併走可
- デザイン微調整（トーン&マナー）は随時反映

---

## 🚫 リスクと対策

| リスク                       | 影響 | 対応策                                |
| ---------------------------- | ---- | ------------------------------------- |
| Webhook 失敗による在庫不整合 | 高   | Supabase Functions でリトライ機構実装 |
| 翻訳漏れ                     | 中   | フォールバックを日本語に固定          |
| 法務ページ未整備             | 高   | M8 前半で専門家チェック               |
| メール到達率低下             | 中   | DKIM/SPF 検証と KKE 版 SendGrid 利用  |
| 無料枠のスリープ             | 中   | 本番前に Supabase Pro 切替            |

---

## 🧭 今後の拡張（ローンチ後）

- 職人別特集ページ
- コラボアイテム特設
- 顧客アカウント機能（Supabase Auth）
- 海外向け通貨・配送設定
- 動画コンテンツ（制作風景・インタビュー）

---

## 📑 運用概要

| 項目         | 内容                              |
| ------------ | --------------------------------- |
| 編集者       | ハナタバチーム（非エンジニア）    |
| 更新頻度     | 月 1〜2 回（商品・お知らせ）      |
| バックアップ | Supabase 自動＋手動エクスポート   |
| 監視         | Stripe Dashboard, Supabase Logs   |
| 固定費       | 約\$25/月（Supabase Pro）、他無料 |
| 決済手数料   | カード 3.6%、振替 1.5%            |
| 通信費       | Cloudflare CDN 無料枠内           |

---

## ✅ 全体ゴール

- 世界観と社会性を両立した EC サイトの立ち上げ
- 安定稼働かつ固定費月 ¥5,000 未満
- 商品閲覧から購入完了まで平均 5 秒以内
- 管理画面から翻訳・更新が可能
- ブランドとしての信頼向上（企業コラボ増加）

---

**このマイルストーン計画は「デザイン × 技術 × 運用」が一貫した軸で進行できるよう設計されています。**
