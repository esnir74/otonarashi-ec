import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/locales";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // adminパスへのアクセスをホームにリダイレクト
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};