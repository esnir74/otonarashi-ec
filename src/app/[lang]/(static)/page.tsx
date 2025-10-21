import HeroRing3D from "@/components/Home/HeroRing";
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
  { src: "/top/hero/1.png", alt: "Look 01" },
  { src: "/top/hero/2.png", alt: "Look 02" },
  { src: "/top/hero/3.png", alt: "Look 03" },
  { src: "/top/hero/4.png", alt: "Look 04" },
];

export default async function Page({ params }: Props) {
  const { lang } = await params;

  // Fetch latest news
  // const supabase = createClient();
  // const { data: newsData } = await supabase
  //   .from("news")
  //   .select(
  //     "id, slug, title, eyecatch_url, published_at, status, category_name"
  //   )
  //   .eq("status", "published")
  //   .order("published_at", { ascending: false })
  //   .limit(2);

  // const news = newsData || [];
  // 仮データ
  const news = [
    {
      id: "1",
      slug: "sample-news-1",
      title: "Sample News Title 1",
      eyecatch_url: "/top/top.png",
      published_at: "2024-06-01T00:00:00Z",
      status: "published",
      category_name: "General",
    },
    {
      id: "2",
      slug: "sample-news-2",
      title: "Sample News Title 2",
      eyecatch_url: "/top/top.png",
      published_at: "2024-05-25T00:00:00Z",
      status: "published",
      category_name: "Updates",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-var(--header-height,64px))] overflow-hidden bg-gradient-to-b from-stone-50 to-white">
        <div className="flex h-full w-full items-center justify-center">
          <HeroRing3D images={heroImages} imageSize={320} itemsPerCircle={4}>
            <></>
          </HeroRing3D>
        </div>
      </section>

      {/* Concept Section */}
      <section className="relative w-full pt-24 pb-48 px-3 bg-white overflow-hidden">
        <div className="absolute -right-40 top-[43rem] md:right-32 md:top-[36rem] w-72 md:w-[24rem] h-[26rem] md:h-[32rem] opacity-20 pointer-events-none">
          <Image
            src="/top/a.png"
            alt=""
            width={1000}
            height={600}
            className="object-cover"
          />
        </div>

        {/* 背景画像 - b.png (左下、反転) */}
        <div className="absolute -left-10 bottom-0 md:left-64 w-48 md:w-56 h-96 md:h-[28rem] opacity-20 pointer-events-none">
          <Image
            src="/top/b.png"
            alt=""
            fill
            className="object-contain object-bottom scale-x-[-1]"
          />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-16">
            {/* Introduction */}
            <div className="space-y-8">
              <p className="text-[0.85rem] md:text-xl text-gray-800 leading-relaxed">
                オトナラシは、ハナタバプロジェクトから誕生した
                <br />
                加賀西京極作業所の着物アップサイクルブランドです。
              </p>
            </div>

            {/* 音鳴らし Section */}
            <div className="py-2 px-12">
              <h3 className="flex items-center justify-center text-[0.85rem] md:text-lg tracking-widest text-gray-800">
                <span className="inline-block w-[2em] mr-[0.5em] border-t border-black" />
                音鳴らし
                <span className="inline-block ml-[0.2em] w-[2em] border-t border-black" />
              </h3>
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose">
                丁寧なほどきと、確かな縫製技術で、
                <br />
                着物文化に新たな音を鳴らします。
              </p>
            </div>

            {/* 大人らし Section */}
            <div className="px-12 pb-16">
              <h3 className="flex items-center justify-center text-[0.85rem] md:text-lg tracking-widest text-gray-800">
                <span className="inline-block w-[2em] mr-[0.5em] border-t border-black" />
                大人らし
                <span className="inline-block ml-[0.2em] w-[2em] border-t border-black" />
              </h3>
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose">
                上質さと、品格を纏うデザインで、
                <br />
                新しい着物スタイルを提案します。
              </p>
            </div>

            {/* Main Message */}
            <div className="pt-12">
              <h2 className="text-[1.46rem] md:text-4xl font-serif text-gray-900 leading-relaxed mb-16">
                もう一度、日常に着物の彩りを。
              </h2>
            </div>

            {/* Statistics - Center Aligned */}
            <div className="relative space-y-8 max-w-3xl mx-auto">
              {/* 現在〜のぼります */}
              <div className="relative text-center space-y-0">
                <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose">
                  現在、社会課題となっている衣類廃棄量は、
                </p>
                <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose">
                  年間およそ50万トンにものぼります。
                </p>
              </div>

              {/* そのうち〜6日 */}
              <div className="relative text-center space-y-3">
                <div>
                  <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose mb-0">
                    そのうち家庭から出る衣類の約85%は、
                  </p>
                  <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose mb-0">
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
                  <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose mb-0">
                    なかでも家庭のタンスに眠る着物は、
                  </p>
                  <p className="text-[0.85rem] md:text-base text-gray-700 leading-loose mb-0">
                    約8兆円分にのぼると報道されています。
                  </p>
                  <p className="text-[0.325rem] md:text-[0.75rem] text-gray-500">
                    日本経済新聞2024年1月5日
                  </p>
                </div>
              </div>

              <br />

              {/* 私たち〜以降 */}
              <div className="relative text-center space-y-0 pb-4">
                <p className="text-sm md:text-base text-gray-800 leading-loose">
                  私たちは、そんな着物を、
                </p>
                <p className="text-sm md:text-base text-gray-800 leading-loose">
                  日常になじむデザインへとアップサイクルし、
                </p>
                <p className="text-sm md:text-base text-gray-800 leading-loose">
                  "日常で着物を楽しむ文化"をもう一度取り戻します。
                </p>

                <p className="text-sm md:text-base text-gray-800 leading-loose pt-8">
                  そして、新しい形の着物スタイルを、
                </p>
                <p className="text-sm md:text-base text-gray-800 leading-loose">
                  この京都から世界へ発信していきます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="relative w-full aspect-square md:h-screen">
        <Image
          src="/top/top.png"
          alt="Products"
          fill
          className="object-cover"
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
                src="/top/about_us.png"
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

            <div className="space-y-8 max-w-3xl mx-auto">
              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose">
                この世界に、二つとして同じものはありません。
              </p>

              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose">
                オトナラシの製品となる着物は、
                <br />
                地域の方々から譲り受けた一着を、
                <br />
                丁寧にほどき、再び縫い合わせて生まれ変わらせています。
              </p>

              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose">
                柄も、風合いも、それぞれが唯一無二。
              </p>

              <p className="text-[0.85rem] md:text-lg text-gray-700 leading-loose font-medium">
                オトナラシのアイテムは、
                <br />
                この世にたったひとつしかない特別なものです。
              </p>
            </div>

            <div className="pt-8">
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
      {news.length > 0 && (
        <section className="w-full py-24 bg-stone-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-16">
              News
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {news.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/${lang}/news/${item.slug}`}
                  className={`group block bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                    index === 1 ? "hidden md:block" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {item.eyecatch_url ? (
                      <Image
                        src={item.eyecatch_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <time className="text-sm text-gray-600">
                      {item.published_at
                        ? new Date(item.published_at)
                            .toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(/\//g, ".")
                        : "2025.00.00"}
                    </time>
                    <h3 className="text-lg text-gray-900 font-medium leading-relaxed group-hover:text-gray-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href={`/${lang}/news`}
                className="inline-block border-2 border-gray-800 text-gray-800 px-12 py-4 hover:bg-gray-800 hover:text-white transition-colors duration-300 text-sm tracking-widest"
              >
                More News
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="relative w-full aspect-square md:h-[70vh]">
        <Image src="/top/top.png" alt="Contact" fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-8 text-white">
            <h2 className="text-4xl md:text-5xl font-serif">Contact us</h2>
            <Link
              href={`/${lang}/contact`}
              className="inline-block border-2 border-white text-white px-12 py-4 hover:bg-white hover:text-gray-900 transition-colors duration-300 text-sm tracking-widest"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
