"use client";

import { locales, type Locale } from "@/i18n/locales";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LangSwitcher() {
  const pathname = usePathname(); // e.g., /ja/products/123
  if (!pathname) return null;
  const [, current, ...rest] = pathname.split("/"); // ["", "ja", "products", "123"]

  return (
    <div>
      {locales.map((l: Locale) => {
        const href = `/${l}/${rest.join("/")}`;
        const active = current === l;
        return (
          <Link
            key={l}
            href={href}
            className={active ? "active" : ""}
            hrefLang={l}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
