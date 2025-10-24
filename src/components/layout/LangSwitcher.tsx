"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

const displayLocales = ["ja", "en"] as const;

export default function LangSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {displayLocales.map((locale, index) => (
        <div key={locale} className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => router.replace(pathname, { locale })}
            className="px-2 py-1 text-xs md:text-sm text-neutral-500 hover:text-sumi transition-colors"
            aria-label={`Switch to ${locale === "ja" ? "Japanese" : "English"}`}
          >
            {locale.toUpperCase()}
          </button>
          {index < displayLocales.length - 1 && (
            <span className="text-neutral-400">/</span>
          )}
        </div>
      ))}
    </div>
  );
}
