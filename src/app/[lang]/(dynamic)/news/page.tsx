import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "news", "news");
}

export default function NewsPage() {
  return <div>News List</div>;
}
