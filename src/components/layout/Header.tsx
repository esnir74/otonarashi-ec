// components/Header.tsx
"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./LangSwitcher";

const NAV_ITEMS = [
  { href: "", label: "Concept" },
  { href: "/products", label: "Products" },
  { href: "/artisans", label: "Artisans" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ initialCount }: { initialCount: number }) {
  const pathname = usePathname() || "/ja";
  const [, lang] = pathname.split("/");
  const base = `/${lang || "ja"}`;

  const count = useCartStore((s) => s.count());
  const openCart = useUIStore((s) => s.openCart);

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
      <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href={base} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Otonarashi logo"
              width={160}
              height={60}
              priority
              className="h-auto w-[160px] object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink key={href || "home"} href={`${base}${href}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* 右上：数字だけの丸バッジ（クリックでドロワー） */}
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white hover:opacity-90 transition"
          >
            <span className="text-[13px] font-medium" suppressHydrationWarning>
              {typeof window === "undefined" ? initialCount : count}
            </span>
          </button>

          <LangSwitcher />
        </div>
      </header>

      {/* ドロワーはレイアウト直下で常時マウント */}
      <CartDrawer />
    </>
  );
}
