"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  const tNav = useTranslations("nav");
  const pathname = usePathname() || "/ja";
  const [, lang] = pathname.split("/"); // "", "ja", ...
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
      <Link href={href} className={active ? "active" : ""}>
        {children}
      </Link>
    );
  };

  return (
    <header>
      <div>
        <Link href={base}>Otonarashi</Link>
        <nav>
          <NavLink href={`${base}`}>{tNav("concept")}</NavLink>
          <NavLink href={`${base}/products`}>{tNav("products")}</NavLink>
          <NavLink href={`${base}/artisans`}>{tNav("artisans")}</NavLink>
          <NavLink href={`${base}/news`}>{tNav("news")}</NavLink>
          <NavLink href={`${base}/contact`}>{tNav("contact")}</NavLink>
          <NavLink href={`${base}/cart`}>{tNav("cart")}</NavLink>
        </nav>
        <LangSwitcher />
      </div>
    </header>
  );
}
