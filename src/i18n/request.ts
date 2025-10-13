// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

// まずは最小構成。あとで cookie や URL から動的に決めてもOK
export default getRequestConfig(async () => {
  const locale = "ja"; // とりあえず既定。後で動的化
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
