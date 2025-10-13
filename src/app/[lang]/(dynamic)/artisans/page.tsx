import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { getArtisans } from "@/lib/repositories/artisans";
import { isOk } from "@/lib/types/result";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "artisans", "artisans");
}

export const revalidate = 60;

export default async function ArtisansPage({ params }: Props) {
  const { lang } = await params;

  // Repository経由でデータ取得
  const result = await getArtisans(lang);

  if (!isOk(result)) {
    console.error("Failed to fetch artisans:", result.error);
    return (
      <main className="container py-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Artisans
        </h1>
        <p className="text-sm text-neutral-500">Failed to load artisans.</p>
      </main>
    );
  }

  const artisans = result.value;
  console.log(artisans);

  return (
    <main className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
        Artisans
      </h1>
      <p className="text-sm text-neutral-500">
        Total: {artisans.length} artisans
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
