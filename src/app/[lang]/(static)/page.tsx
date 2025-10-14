import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "home", "");
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const tC = await getTranslations({ locale: lang, namespace: "common" });

  return (
    //
    <section >
      <div>
        <h1>{tC("brand")}</h1>
        <p>{tC("tagline")}</p>
      </div>
      <div>
        <a href="#products">
          <h3>Products</h3>
          <p>Unique upcycled items</p>
        </a>
        <a href="#artisans">
          <h3>Artisans</h3>
          <p>Welfare × Fashion</p>
        </a>
        <a href="#news">
          <h3>News</h3>
          <p>Events & collaborations</p>
        </a>
      </div>
    </section>
  );
}
