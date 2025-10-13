import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "artisans", "artisans");
}

export const revalidate = 60;

export default async function ArtisansPage() {
  return (
    <main className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
        Products
      </h1>
      <p className="text-sm text-neutral-500">
        （仮）このページはM4.2でデータ結線します。
      </p>
      {/* グリッドを当てる場所 */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="aspect-[4/5] bg-beige/60 rounded-xl" />
        <div className="aspect-[4/5] bg-beige/60 rounded-xl" />
        <div className="aspect-[4/5] bg-beige/60 rounded-xl" />
      </div>
    </main>
  );
}
