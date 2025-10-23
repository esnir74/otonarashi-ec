# otonarashi.com Infrastructure (Infra/README)

> Status: **Active**  
> Last updated: 2025-10-23 (JST)

本ドキュメントは **otonarashi.com** のインフラ構成を、運用・引き継ぎ・監査向けに詳細化したものです。  
Web は **Cloudflare Workers**、メール送信は **Resend** を利用。DNS の権威は **Cloudflare** に移管済み。  
受信メールボックスは現状不要（送信専用）です。

---

## 1. High-level Overview

```
[ Registrar ]
  Onamae.com
      └─ Domain ownership only
         (no DNS here)

[ Authoritative DNS / CDN / TLS ]
  Cloudflare
  ├─ NS: jamie.ns.cloudflare.com / odin.ns.cloudflare.com
  ├─ DNS zone: otonarashi.com
  ├─ HTTPS/Edge certs (Universal SSL)
  └─ Proxy/CDN (orange cloud) for web

[ Web Hosting ]
  Cloudflare Workers
  └─ Worker: otonarashi-ec
     Route: otonarashi-ec.esnir74.workers.dev
     Custom domains:
       - otonarashi.com
       - www.otonarashi.com

[ Transactional Email (outbound only) ]
  Resend
  ├─ Subdomain for sending: send.otonarashi.com
  ├─ SPF/DKIM records in Cloudflare DNS
  └─ MX (bounce/feedback) for send.*
```

---

## 2. Current DNS Records (Cloudflare)

> すべて Cloudflare の DNS で管理（お名前.com には **NS 以外のレコードを置かない**）

### 2.1 Web (A/CNAME)

|  Type | Name | Content                             | Proxy | TTL  | Notes                                     |
| ----: | ---- | ----------------------------------- | :---: | :--: | ----------------------------------------- |
| CNAME | @    | `otonarashi-ec.esnir74.workers.dev` |  🟠   | Auto | ルートを Workers へ（Custom Domain 必須） |
| CNAME | www  | `otonarashi-ec.esnir74.workers.dev` |  🟠   | Auto | www も Workers へ                         |

- 🟠 = Proxy **ON**（オレンジ雲）。Web は Cloudflare 経由で配信。
- Workers 側で **Custom Domain** として `otonarashi.com` / `www.otonarashi.com` を必ず追加すること（SSL 自動発行のため）。

### 2.2 Mail (Resend: SPF/DKIM/DMARC/MX)

| Type | Name               | Content / Value                                 | Proxy | TTL  | Purpose                               |
| ---: | ------------------ | ----------------------------------------------- | :---: | :--: | ------------------------------------- |
|  TXT | send               | `v=spf1 include:amazonses.com ~all`             |  ⚪   | Auto | SPF：Resend (Amazon SES) 許可         |
|  TXT | resend.\_domainkey | `v=DKIM1; k=rsa; p=...`                         |  ⚪   | Auto | DKIM：Resend が提示する公開鍵         |
|  TXT | \_dmarc            | `v=DMARC1; p=none;`                             |  ⚪   | Auto | DMARC：現状学習モード（後述で強化可） |
|   MX | send               | `10 feedback-smtp.ap-northeast-1.amazonses.com` |  ⚪   | Auto | バウンス/フィードバック受領用         |

- ⚪ = Proxy **OFF**（灰雲 / DNS only）。**メール関連は必ず DNS only** にすること。
- DKIM の `p=` 値は Resend ダッシュボードの最新値をそのまま貼る。Name は **`resend._domainkey`**（Cloudflare が末尾のドメインを自動付与）。

---

## 3. Cloudflare 設定の要点

- **Nameserver**: `jamie.ns.cloudflare.com` / `odin.ns.cloudflare.com` をお名前.com 側に設定（DNSSEC は切替前に OFF 推奨、必要なら Cloudflare に移して再度 ON）。
- **SSL/TLS**: Overview → mode は **Full** もしくは **Full (strict)**。Universal SSL **ON**。
- **DNS Proxy**:
  - Web（@/www）= **ON（🟠）**
  - Email（SPF/DKIM/DMARC/MX）= **OFF（⚪）**
- **Workers**: 該当 Worker の **Custom Domains** に `otonarashi.com` / `www.otonarashi.com` を追加済みであること。Route/Triggers も確認。

---

## 4. Resend 設定の要点

- ドメイン認証：Resend → Domains → **Add domain** → 指示された `SPF/DKIM/MX` を Cloudflare DNS に追加し **Verified** へ。
- 送信：`from: "Otonarashi <no-reply@otonarashi.com>"` 形式。サブドメイン `send.*` は認証用途（送信元ドメインの評価分離）。
- 受信は不要（現状）。受信したい場合は別途メールホスティングを手配するか、Resend Inbound（Webhook）で自前処理。

---

## 5. Runbook（運用手順）

### 5.1 デプロイ（Web/Workers）

1. Worker ソース更新 → `wrangler deploy` or Dashboard でデプロイ
2. 正常性チェック：`curl -I https://otonarashi.com` → `HTTP/2 200` & `cf-ray` ヘッダ確認
3. キャッシュ挙動：Cloudflare Cache → Development Mode で無効化して差分確認（必要時）

### 5.2 DNS 変更（追加/修正）

1. Cloudflare DNS にて対象レコードを追加/編集
2. メール関連は必ず DNS only（灰雲）。Web は Proxy ON（オレンジ）。
3. 伝播確認：`dig +short <name> TXT|MX|CNAME` / `nslookup`
4. 影響調査：`https://dns.google/resolve?name=<name>&type=<TYPE>`

### 5.3 Resend ドメイン検証が通らない時

- `send.*` に **NS レコードを置かない**（サブ委任すると検証失敗しやすい）
- DKIM の Name は `resend._domainkey`（末尾にドメインを重ねない）
- SPF は 1 レコードに統合（複数 SPF は PermError）
- 30〜60 分待っても未検証なら TTL/タイプ/書式の再確認

### 5.4 インシデント（Cloudflare 522/525/526 等）

- **522 (Connection timed out)**:
  - NS 切替直後 → **待機**（伝播＆証明書発行）
  - Workers に Custom Domain 未登録 → **登録**
  - CNAME 誤り → **修正**
- **525/526 (SSL Handshake / Invalid cert)**:
  - SSL/TLS Mode を **Full/Full strict** に、Universal SSL **ON**
  - Edge Certificates の Active 状態確認

---

## 6. セキュリティ・ポリシー

- **DMARC 強化**（段階的）  
  初期: `v=DMARC1; p=none;`  
  段階 2: `v=DMARC1; p=quarantine; rua=mailto:rin@otonarashi.com;`  
  最終: `v=DMARC1; p=reject; rua=mailto:rin@otonarashi.com;`
- **CAA レコード追加（推奨）**  
  不正証明書発行防止：
  ```
  Type: CAA
  Name: @
  Value: 0 issue "letsencrypt.org"
  ```
- **DNSSEC**: Cloudflare 管理下で ON（お名前.com 側では OFF）。
- **Zero Trust**: 管理ログインは 2FA 有効化済み。

---

## 7. Notes

- お名前.com は現在「レジストラ」としてのみ利用。  
  DNS 管理は Cloudflare 側で統一。
- メール受信が必要になった場合、Resend Inbound / Zoho Mail / Google Workspace 等で MX を変更可能。
- Cloudflare の Free プラン範囲内で運用中（Workers 100k req/day 無料枠）。
