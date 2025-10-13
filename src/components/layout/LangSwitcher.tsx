"use client";

import { locales } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LangSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => router.replace(pathname, { locale })}
          className="hover:underline"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
