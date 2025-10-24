import { type Locale } from "@/i18n/locales";
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

  return (
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
        </div>
      </div>

      {/* Member Section */}
      <div className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-24">
            Member
          </h2>

          {/* Members Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-20 mb-16">
            {/* kano shin */}
            <div className="flex flex-col items-center">
              <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                <Image
                  src="/aboutus/members/kanon_shin.webp"
                  alt="Kanon Shin"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                kanon shin
              </h3>
            </div>

            {/* kanon riyon */}
            <div className="flex flex-col items-center">
              <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                <Image
                  src="/aboutus/members/kanon_riyon.webp"
                  alt="kanon riyon"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                kanon riyon
              </h3>
            </div>

            {/* kanon take */}
            <div className="flex flex-col items-center">
              <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                <Image
                  src="/aboutus/members/kanon_take.webp"
                  alt="kanon take"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                kanon take
              </h3>
            </div>

            {/* kanon fumi */}
            <div className="flex flex-col items-center">
              <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                <Image
                  src="/aboutus/members/kanon_fumi.webp"
                  alt="kanon fumi"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                kanon fumi
              </h3>
            </div>

            {/* Atto */}
            <div className="flex flex-col items-center">
              <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                <Image
                  src="/aboutus/members/atto.webp"
                  alt="Atto"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                Atto
              </h3>
            </div>

            {/* MAARU */}
            <div className="flex flex-col items-center">
              <div className="relative w-[85%] aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 mx-auto">
                <Image
                  src="/aboutus/members/maaru.webp"
                  alt="MAARU"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 text-center">
                MAARU
              </h3>
            </div>
          </div>

          {/* Additional Members Text */}
          <div className="text-center mb-24">
            <p className="text-[0.85rem] md:text-base text-gray-700">
              他にもたくさんのメンバーが製品づくりに携わっています。
            </p>
          </div>

          {/* Team Photo - Kanon Cheerful */}
          <div className="mb-16 w-full max-w-md mx-auto">
            <div className="relative w-full overflow-hidden bg-gray-100">
              <Image
                src="/aboutus/kanon_cheerful.webp"
                alt="加音西京極作業所の縫製チーム"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Team Description */}
          <div className="text-center space-y-12 max-w-3xl mx-auto mb-24">
            <h3 className="text-[1.02rem] md:text-[1.2rem] font-bold text-gray-900">
              私たちが縫製しています
            </h3>
            <div className="space-y-8 md:space-y-12">
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                オトナラシの製品の品質を支えているのは、
                <br />
                加音西京極作業所の縫製チームです。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                一針一針、
                <br />
                丁寧な手仕事で仕上げています。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                メンバーは、高い技術と集中力を持つ
                <br />
                縫製のプロフェッショナルたちです。
              </p>
            </div>
          </div>

          {/* Producer Photo - Hanataba */}
          <div className="mb-16 w-full max-w-md mx-auto">
            <div className="relative w-full overflow-hidden bg-gray-100">
              <Image
                src="/aboutus/hanataba.webp"
                alt="ハナタバプロジェクト"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Producer Section */}
          <div className="text-center space-y-12 max-w-3xl mx-auto pb-24">
            <h3 className="text-[1.02rem] md:text-[1.2rem] font-bold text-gray-900">
              私たちがプロデュースしています
            </h3>
            <div className="space-y-8 md:space-y-12">
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                ハナタバプロジェクトの企画・デザインを担当しています。
              </p>
              <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose md:leading-relaxed">
                縫製チームの高い技術と、
                <br />
                着物の個性を生かしたデザインを生み出しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
