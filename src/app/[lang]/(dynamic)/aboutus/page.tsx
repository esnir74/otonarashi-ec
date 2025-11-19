import { type Locale } from "@/i18n/locales";
import { readHeroBlur } from "@/lib/utils/readHeroBlur";
import { Metadata } from "next";
import Image from "next/image";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const messages = (await import(`@/messages/${lang}.json`)).default;
  const seo = messages.seo.aboutus;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja/aboutus",
        en: "https://otonarashi.jp/en/aboutus",
        zh: "https://otonarashi.jp/zh/aboutus",
      },
    },
  };
}

export const revalidate = 60;

export default async function AboutUsPage({ params }: Props) {
  await params;
  const blurHero = readHeroBlur("public/aboutus/hero_blur_base64.txt");

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-16 pt-24 px-6">
          About Us
        </h2>

        {/* Team Photo */}
        <div
          className="relative w-full overflow-hidden mb-16"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src="/aboutus/group_with_hanataba.webp"
            alt="Our Team"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            fetchPriority="high"
            placeholder={blurHero ? "blur" : "empty"}
            blurDataURL={blurHero}
          />
        </div>

        {/* Content */}
        <div className="text-center space-y-12 px-6 pb-24">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-12">
            一点ずつ、丁寧に。
          </h2>

          <div className="space-y-8 md:space-y-12 max-w-3xl mx-auto">
            <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
              この世界に、二つとして同じものはありません。
            </p>

            <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose md:leading-[2.5]">
              オトナラシの製品となる着物は、
              <br />
              地域の方々などから寄贈していただいたものです。
              <br />
              思い出のつまったもの、
              <br />
              なつかしいあの人を思い出すものなど、
              <br />
              1 着 1 着にかけがえのないストーリーがあります。
              <br />
              その着物に新たな息吹をふきこんでいます。
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
        </div>
      </div>

      {/* Member Section */}
      <div className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-24">
            Member
          </h2> */}
          {/* Members Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-20 mb-16">
            {[
              { src: "/aboutus/members/kanon_shin.webp", name: "kanon shin" },
              { src: "/aboutus/members/kanon_riyon.webp", name: "kanon riyon" },
              { src: "/aboutus/members/kanon_take.webp", name: "kanon take" },
              { src: "/aboutus/members/kanon_fumi.webp", name: "kanon fumi" },
              { src: "/aboutus/members/atto.webp", name: "Atto" },
              { src: "/aboutus/members/maaru.webp", name: "MAARU" },
            ].map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                  <Image
                    src={member.src}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
                    placeholder="blur"
                    blurDataURL="/aboutus/members/blur_placeholder.webp" // 省略可
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                  {member.name}
                </h3>
              </div>
            ))}
          </div> */}

          {/* Team Photo - Kanon Cheerful */}
          <div className="mb-16 w-full max-w-md mx-auto">
            <div className="relative w-full overflow-hidden bg-gray-100">
              <Image
                src="/aboutus/kanon_cheerful.webp"
                alt="加音西京極作業所の縫製チーム"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 90vw, 448px"
              />
            </div>
          </div>

          {/* Team Description */}
          <div className="text-center space-y-12 max-w-3xl mx-auto mb-24">
            <h3 className="text-[1.02rem] md:text-[1.2rem] font-bold text-gray-900">
              加音が縫製しています
            </h3>
            <div className="space-y-8 md:space-y-12">
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                加音西京極作業所で
                <br />
                オトナラシの製品をつくっています。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                加音西京極作業所は、
                <br />
                発達障害のある方が通われている作業所です。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                一針一針、
                <br />
                丁寧な手作業で仕上げています。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                縫製はメンバーの特性を活かした楽しい仕事です。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                オトナラシの製品づくりは
                <br />
                EXPO2025 大阪関西万博での
                <br />
                展示を足がかりに誕生しました。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                この誕生にはハナタバプロジェクトによる
                <br />
                プロデュース支援を受けました。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                この活動は公益財団法人東芝国際交流財団様からの
                <br />
                助成金で運営しています。
              </p>
            </div>
          </div>

          {/* Producer Photo - Hanataba */}
          {/* <div className="mb-16 w-full max-w-md mx-auto">
            <div className="relative w-full overflow-hidden bg-gray-100">
              <Image
                src="/aboutus/hanataba.webp"
                alt="ハナタバプロジェクト"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 90vw, 448px"
              />
            </div>
          </div> */}

          {/* Producer Section */}
          {/* <div className="text-center space-y-12 max-w-3xl mx-auto pb-24">
            <h3 className="text-[1.02rem] md:text-[1.2rem] font-bold text-gray-900">
              私たちがプロデュースしています
            </h3>
            <div className="space-y-8 md:space-y-12">
              <p className="text-[0.76rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                ハナタバプロジェクトの企画・デザインを担当しています。
              </p>
              <p className="text-[0.76rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                縫製チームの高い技術と、
                <br />
                着物の個性を生かしたデザインを生み出しています。
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
