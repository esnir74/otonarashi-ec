import ContactForm from "@/components/ContactForm";
import { type Locale } from "@/i18n/locales";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "contact" });
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
                {t("kanon.name")}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {t("kanon.address")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm md:text-base text-gray-700">
                {t("kanon.representative")}
              </p>
              <p className="text-sm md:text-base text-gray-700">
                {t("kanon.inquiry")}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-16"></div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="text-2xl md:text-3xl text-gray-900 text-center mb-12">
            {t("formTitle")}
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
                {t("hanataba.name")}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {t("hanataba.from")}
              </p>
            </div>

            <div>
              <p className="text-sm md:text-base text-gray-700 mb-4">
                {t("hanataba.representative")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm md:text-base text-gray-700">
                {t("hanataba.university")}
              </p>
              <p className="text-sm md:text-base text-gray-700">
                {t("hanataba.department")}
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
