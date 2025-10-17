"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  const tNav = useTranslations("nav");
  const pathname = usePathname() || "/ja";
  const [, lang] = pathname.split("/");
  const base = `/${lang || "ja"}`;

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
    <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-4">
        {/* === ロゴ === */}
        <Link href={base} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="オトナラシ ロゴ"
            width={160}
            height={60}
            priority
            className="h-auto w-[160px] object-contain"
          />
        </Link>

        {/* === ナビゲーション === */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href={`${base}`}>{tNav("concept")}</NavLink>
          <NavLink href={`${base}/products`}>{tNav("products")}</NavLink>
          <NavLink href={`${base}/artisans`}>{tNav("artisans")}</NavLink>
          <NavLink href={`${base}/news`}>{tNav("news")}</NavLink>
          <NavLink href={`${base}/contact`}>{tNav("contact")}</NavLink>
          <NavLink href={`${base}/checkout`}>{tNav("checkout")}</NavLink>
        </nav>

        {/* === 言語切り替え === */}
        <LangSwitcher />
      </div>
    </header>
  );
}
