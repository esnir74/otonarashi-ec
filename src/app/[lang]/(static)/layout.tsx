import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const dynamic = "force-static";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "home", "");
}

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
