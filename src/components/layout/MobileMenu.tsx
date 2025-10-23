"use client";

import { useUIStore } from "@/store/ui";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "", label: "Home" },
  { href: "/products", label: "Online Store" },
  { href: "/aboutus", label: "About Us" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const closeMenu = useUIStore((s) => s.closeMenu);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      closeMenu();
      setPendingHref(null);
    }
  }, [closeMenu, pathname, pendingHref]);

  const handleClose = () => {
    setPendingHref(null);
    closeMenu();
  };

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    event.preventDefault();

    if (pathname === href) {
      handleClose();
      return;
    }

    setPendingHref(href);
    router.push(href);
  };

  const handleLanguageSwitch = (locale: string) => {
    const newPath = pathname.replace(/^\/[^\/]+/, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-sm transition-opacity duration-500 ${
        menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`container h-full flex flex-col py-6 transition-transform duration-500 ${
          menuOpen ? "translate-y-0" : "translate-y-8"
        }`}
      >
        {/* Top section: Language switcher and close button */}
        <div className="flex items-start justify-between mb-12">
          {/* Language toggle buttons */}
          <div className="flex gap-0">
            <button
              onClick={() => handleLanguageSwitch("ja")}
              className={`px-4 py-2 text-sm border border-neutral-900 transition-colors ${
                currentLocale === "ja"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              JP
            </button>
            <button
              onClick={() => handleLanguageSwitch("en")}
              className={`px-4 py-2 text-sm border border-neutral-900 border-l-0 transition-colors ${
                currentLocale === "en"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              EN
            </button>
          </div>

          {/* Close button (X) */}
          <button
            onClick={handleClose}
            aria-label="Close menu"
            className="text-neutral-900 hover:opacity-70 transition"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="8" y1="8" x2="24" y2="24" />
              <line x1="24" y1="8" x2="8" y2="24" />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-8">
          {NAV_ITEMS.map(({ href, label }) => {
            const base = `/${currentLocale}`;
            const fullHref = `${base}${href}`;
            return (
              <Link
                key={href || "home"}
                href={fullHref}
                onClick={(event) => handleNavigate(event, fullHref)}
                className="text-3xl font-light tracking-wide text-neutral-900 hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
