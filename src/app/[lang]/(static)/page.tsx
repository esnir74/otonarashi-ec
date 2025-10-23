import HeroRing3D from "@/components/Home/HeroRing";
import HomeNewsSection from "@/components/Home/HomeNewsSection";
import { type Locale } from "@/i18n/locales";
import { createPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata(lang, "home", "");
}

const heroImages = [
  { src: "/top/hero/1.webp", alt: "Look 01" },
  { src: "/top/hero/2.webp", alt: "Look 02" },
  { src: "/top/hero/3.webp", alt: "Look 03" },
  { src: "/top/hero/4.webp", alt: "Look 04" },
  { src: "/top/hero/5.webp", alt: "Look 05" },
];

export default async function Page({ params }: Props) {
  const { lang } = await params;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-var(--header-height,64px))] overflow-hidden bg-white">
        <div className="flex h-full w-full items-center justify-center">
          <HeroRing3D images={heroImages} imageSize={320} itemsPerCircle={5}>
            <></>
          </HeroRing3D>
        </div>
      </section>

      {/* Concept Section */}
      <section className="relative w-full pt-24 pb-48 px-3 bg-white overflow-hidden">
        <div className="absolute -right-40 top-[31rem] md:right-32 md:top-[36rem] w-72 md:w-[24rem] h-[26rem] md:h-[32rem] opacity-20 pointer-events-none">
          <Image
            src="/top/background/facing_right.webp"
            alt=""
            width={1000}
            height={600}
            className="object-cover"
          />
        </div>

        {/* 背景画像 - b.webp (左下、反転) */}
        <div className="absolute -left-10 bottom-0 md:left-64 w-48 md:w-56 h-96 md:h-[28rem] opacity-20 pointer-events-none">
          <Image
            src="/top/background/leg_raised.webp"
            alt=""
            fill
            className="object-contain object-bottom scale-x-[-1]"
          />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-16">
            {/* Introduction */}
            <div className="relative text-center pb-20">
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] pb-2">
                確かな縫製技術で着物文化に新たな音を鳴らし、
              </p>
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] pb-2">
                大人らしさと品格を纏う、
              </p>
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
                新しい着物スタイルを京都から世界に提案します。
              </p>
            </div>

            {/* Main Message */}
            <div className="pt-12">
              <h2 className="text-[1.46rem] md:text-4xl font-serif text-gray-900 leading-relaxed mb-16">
                もう一度、日常に着物の彩りを。
              </h2>
            </div>

            {/* Statistics - Center Aligned */}
            <div className="relative space-y-8 md:space-y-12 max-w-3xl mx-auto">
              {/* 現在〜のぼります */}
              <div className="relative text-center space-y-0">
                <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
                  現在、社会課題となっている衣類廃棄量は、
                </p>
                <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
                  年間およそ50万トン。
                </p>
              </div>

              {/* そのうち〜6日 */}
              <div className="relative text-center space-y-3 md:space-y-5">
                <div>
                  <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] mb-0">
                    そのうち家庭から出る衣類の約85%は、
                  </p>
                  <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] mb-0">
                    まだ着られる「退蔵品」とされています。
                  </p>
                  <p className="text-[0.325rem] md:text-[0.75rem] text-gray-500 mb-0">
                    2023年に排出された新品衣類のうち、退蔵由来の割合
                  </p>
                  <p className="text-[0.325rem] md:text-[0.75rem] text-gray-500">
                    環境省「令和６年度消費者アンケート（ストック調査）」に基づく
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] mb-0">
                    なかでも家庭のタンスに眠る着物は、
                  </p>
                  <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] mb-0">
                    約8兆円分にのぼると報道されています。
                  </p>
                  <p className="text-[0.325rem] md:text-[0.75rem] text-gray-500">
                    日本経済新聞2024年1月5日
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] mb-0">
                    このままでは、大切に保管している着物も、{" "}
                  </p>
                  <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] mb-0">
                    いずれは廃棄物となってしまうかもしれません。
                  </p>
                </div>
              </div>

              <br />

              {/* 私たち〜以降 */}
              <div className="relative text-center space-y-0 pb-4">
                <p className="text-[0.85rem] md:text-lg text-gray-800 leading-loose md:leading-[2.5]">
                  私たちは、そんな着物をアップサイクルし、
                </p>
                <p className="text-[0.85rem] md:text-lg text-gray-800 leading-loose md:leading-[2.5]">
                  もう一度、日常に着物の彩りを取り戻したいと考えています。
                </p>

                <p className="text-[0.85rem] md:text-lg text-gray-800 leading-loose md:leading-[2.5] pt-8">
                  着物をモードに着こなす文化を京都から世界へ。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="relative w-full aspect-square md:h-screen opacity-100">
        <Image
          src="/top/online_shop/tower.webp"
          alt="Products"
          fill
          className="object-cover "
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-8 text-white">
            <h2 className="text-5xl md:text-6xl font-serif tracking-wide">
              Online Store
            </h2>
            <Link
              href={`/${lang}/products`}
              className="inline-block border-2 border-white text-white px-12 py-4 hover:bg-white hover:text-gray-900 transition-colors duration-300 text-sm tracking-widest"
            >
              More
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full bg-white">
        <div className="w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-16 pt-24 px-6">
            About Us
          </h2>
          {/* Team Photo */}
          <div className="mb-16 w-full">
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-gray-100">
              <Image
                src="/aboutus/group_with_hanataba.webp"
                alt="Our Team"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-12 px-6 pb-24">
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-14 md:mb-18">
              一点ずつ、丁寧に。
            </h2>

            <div className="space-y-8 md:space-y-12 max-w-3xl mx-auto">
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
                この世界に、二つとして同じものはありません。
              </p>

              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
                オトナラシの製品となる着物は、
                <br />
                地域の方々から譲り受けた一着を、
                <br />
                丁寧にほどき、再び縫い合わせて生まれ変わらせています。
              </p>

              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
                柄も、風合いも、それぞれが唯一無二。
              </p>

              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5] font-medium">
                オトナラシのアイテムは、
                <br />
                この世にたったひとつしかない特別なものです。
              </p>
            </div>

            <div className="">
              <Link
                href={`/${lang}/aboutus`}
                className="inline-block border-2 border-gray-800 text-gray-800 px-12 py-4 hover:bg-gray-800 hover:text-white transition-colors duration-300 text-sm tracking-widest"
              >
                More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <HomeNewsSection lang={lang} />

      {/* Contact Section */}
      <section className="w-full py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            Contact us
          </h2>
          <Link
            href={`/${lang}/contact`}
            className="inline-block border-2 border-gray-800 text-gray-800 px-12 py-4 hover:bg-gray-800 hover:text-white transition-colors duration-300 text-sm tracking-widest"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
