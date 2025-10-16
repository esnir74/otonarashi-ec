"use client";

import { locales } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LangSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => router.replace(pathname, { locale })}
          className="px-2 py-1 text-xs md:text-sm text-neutral-500 hover:text-sumi transition-colors"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
