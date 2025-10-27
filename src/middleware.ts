import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { defaultLocale, locales } from "./i18n/locales";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // 常に /ja /en /zh を付ける
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin または /{locale}/admin を検出
  const isAdmin =
    pathname === "/admin" || /^\/(ja|en|zh)\/admin(\/|$)/.test(pathname);

  if (isAdmin) {
    return await updateSession(req);
  }

  // それ以外は next-intl に任せる
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // api, 静的ファイル, _next は除外
};
