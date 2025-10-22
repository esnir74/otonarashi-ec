// components/Header.tsx
"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import LangSwitcher from "./LangSwitcher";
import MobileMenu from "./MobileMenu";

const NAV_ITEMS = [
  { href: "", label: "Concept" },
  { href: "/products", label: "Products" },
  { href: "/aboutus", label: "About Us" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ initialCount }: { initialCount: number }) {
  const pathname = usePathname() || "/ja";
  const [, lang] = pathname.split("/");
  const base = `/${lang || "ja"}`;

  const count = useCartStore((s) => s.count());
  const openCart = useUIStore((s) => s.openCart);
  const openMenu = useUIStore((s) => s.openMenu);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof window === "undefined") return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${el.offsetHeight}px`
      );
    };

    let observer: ResizeObserver | null = null;

    updateHeight();

    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      observer = new ResizeObserver(updateHeight);
      observer.observe(el);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-1 text-sm tracking-wide transition-colors duration-200 ${
          active
            ? "text-sumi border-b border-sumi font-medium"
            : "text-neutral-500 hover:text-sumi"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        data-site-header
        className="fixed top-0 left-0 right-0 z-50 w-full border-neutral-200 bg-white/80 backdrop-blur-sm transition-all duration-500 ease-out"
      >
        <div className="container flex items-center justify-between px-3 md:px-6 py-2 md:py-4">
          <Link href={base} className="flex items-center gap-2">
            <Image
              src="/header_logo.webp"
              alt="Otonarashi logo"
              width={100}
              height={0}
              priority
              className="h-auto w-[120px] md:w-[160px] object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink key={href || "home"} href={`${base}${href}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop: Cart and language switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 transition"
            >
              <span
                className="text-[12px] font-medium"
                suppressHydrationWarning
              >
                {typeof window === "undefined" ? initialCount : count}
              </span>
            </button>
            <LangSwitcher />
          </div>

          {/* Mobile: Cart number and hamburger menu (right aligned) */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 transition"
            >
              <span
                className="text-[12px] font-medium"
                suppressHydrationWarning
              >
                {typeof window === "undefined" ? initialCount : count}
              </span>
            </button>
            <button
              onClick={openMenu}
              aria-label="Open menu"
              className="flex flex-col items-center justify-center w-8 h-8 gap-1.5"
            >
              <span className="w-6 h-0.5 bg-neutral-900 transition-all" />
              <span className="w-6 h-0.5 bg-neutral-900 transition-all" />
              <span className="w-6 h-0.5 bg-neutral-900 transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* ドロワーはレイアウト直下で常時マウント */}
      <CartDrawer />

      {/* モバイルメニュー */}
      <MobileMenu />
    </>
  );
}
