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
    <section>
      <div>
        <h1>{tC("brand")}</h1>
        <p>{tC("tagline")}</p>
      </div>
      <div>
        <div>
          <a href={`/${lang}/products`}>
            <h3>Products</h3>
            <p>Unique upcycled items</p>
          </a>
        </div>

        <div>
          <a href={`/${lang}/artisans`}>
            <h3>Artisans</h3>
            <p>Welfare × Fashion</p>
          </a>
        </div>
      </div>
    </section>
  );
}
