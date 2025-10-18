import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "home", "");
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const brand = "オトナラシ";
  const tagline = "日常に、着物の彩りを";

  return (
    <section>
      <div>
        <h1>{brand}</h1>
        <p>{tagline}</p>
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
