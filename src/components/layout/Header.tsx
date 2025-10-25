// components/Header.tsx
"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import MobileMenu from "./MobileMenu";

const NAV_ITEMS = [
  { href: "", label: "Home" },
  { href: "/products", label: "Online Store" },
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

  // ヘッダー高さをCSS変数へ（ページ側でオフセットに使う想定）
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

    if ("ResizeObserver" in window) {
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
        // 高さを固定してCLSを防ぐ
        className="fixed top-0 left-0 right-0 z-50 w-full h-14 md:h-16 border-neutral-200 bg-white/80 backdrop-blur-sm transition-all duration-500 ease-out"
      >
        <div className="container flex h-full items-center justify-between px-3 md:px-6">
          <Link href={base} className="flex items-center gap-2">
            <div className="relative h-9 md:h-10 w-[120px] md:w-[160px]">
              <Image
                src="/header_logo.webp"
                alt="Otonarashi logo"
                fill
                sizes="(max-width: 768px) 120px, 160px"
                className="object-contain"
                priority={false}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink key={href || "home"} href={`${base}${href}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop: Cart + Lang */}
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
            {/* <LangSwitcher /> */}
          </div>

          {/* Mobile: Cart + Hamburger */}
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
