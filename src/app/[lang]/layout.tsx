// src/app/[lang]/layout.tsx
import { Locale, locales } from "@/i18n/locales";
import { notFound } from "next/navigation";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  return <>{children}</>;
}
