import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/locales";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // 常に /ja /en /zh を付ける
});

export const config = {
  matcher: ["/((?!api|_next|admin|.*\\..*).*)"], // api, 静的ファイル, _next は除外
};
