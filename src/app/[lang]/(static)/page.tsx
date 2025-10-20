import HeroRing3D from "@/components/Home/HeroRing";
import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Image from "next/image";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "home", "");
}

const heroImages = [
  { src: "/hero/aa.png", alt: "Look 01" },
  { src: "/hero/aa.png", alt: "Look 02" },
  { src: "/hero/aa.png", alt: "Look 03" },
  { src: "/hero/aa.png", alt: "Look 04" },
  { src: "/hero/aa.png", alt: "Look 05" },
  { src: "/hero/aa.png", alt: "Look 06" },
];

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const brand = "オトナラシ";
  const tagline = "日常に、着物の彩りを";

  return (
    <section>
      <main>
        <HeroRing3D
          images={heroImages}
          imageSize={280}
          itemsPerCircle={12} // 1周に6枚配置
        >
          <div>
            <Image
              src="/logo_transparent.png"
              alt="Otonarashi Large Logo"
              width={300}
              height={100}
              className="mb-6"
            />
          </div>
        </HeroRing3D>
      </main>
    </section>
  );
}
