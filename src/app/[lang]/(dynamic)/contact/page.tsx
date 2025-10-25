import ContactForm from "@/components/ContactForm";
import { type Locale } from "@/i18n/locales";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const messages = (await import(`@/messages/${lang}.json`)).default;
  const seo = messages.seo.contact;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ja: "https://otonarashi.jp/ja/contact",
        en: "https://otonarashi.jp/en/contact",
        zh: "https://otonarashi.jp/zh/contact",
      },
    },
  };
}

export default function ContactPage() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
            Contact
          </h1>
          <div className="w-24 h-px bg-gray-300 mx-auto"></div>
        </div>

        {/* Company Information */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="space-y-6 text-left">
            <div className="mb-2">
              <p className="text-lg md:text-xl font-medium text-gray-900">
                加音西京極作業所
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                〒615-0863 京都市右京区西京極堤町24
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm md:text-base text-gray-700">
                代表者：北村雅子
              </p>
              <p className="text-sm md:text-base text-gray-700">
                お問い合わせは以下のフォームよりお寄せください。
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-16"></div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="text-2xl md:text-3xl text-gray-900 text-center mb-12">
            お問い合わせフォーム
          </h2>
          <ContactForm />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-16"></div>

        {/* Project Representative Information */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6 text-left">
            <div className="mb-2">
              <p className="text-lg md:text-xl font-medium text-gray-900">
                ハナタバプロジェクト
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                From：Office＠
              </p>
            </div>

            <div>
              <p className="text-sm md:text-base text-gray-700 mb-4">
                ハナタバプロジェクト 代表
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm md:text-base text-gray-700">
                京都光華女子大学
              </p>
              <p className="text-sm md:text-base text-gray-700">
                キャリア形成学部 キャリア形成学科４年
              </p>
              <p className="text-base md:text-lg text-gray-900 font-medium">
                坂本 遼香 | Sakamoto Haruka
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-sm md:text-base text-gray-700">
                <span className="text-gray-500">TEL：</span>090-5463-0047
              </p>
              <p className="text-sm md:text-base text-gray-700">
                <span className="text-gray-500">Email：</span>
                <a
                  href="mailto:hanataba.proj@gmail.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  hanataba.proj@gmail.com
                </a>
              </p>
              <p className="text-sm md:text-base text-gray-700">
                <span className="text-gray-500">SNS：</span>
                <a
                  href="https://instagram.com/hanataba_project_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  @hanataba_project_
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
