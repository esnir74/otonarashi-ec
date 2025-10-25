import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-stone-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            {/* 固定枠 + fill で寸法予約（CLS対策） */}
            <div className="relative w-[180px] h-[60px] md:w-[220px] md:h-[72px]">
              <Image
                src="/logo_with_bgcolor.webp"
                alt="オトナラシ"
                fill
                sizes="(max-width: 768px) 180px, 220px"
                className="object-contain block"
                loading="lazy"
                decoding="async"
              />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              『日常に、着物の彩りを』
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
              <p>加音西京極作業所の</p>
              <p>着物アップサイクルブランド</p>
              <p className="text-xs text-gray-500 pt-2">
                Produce with ハナタバプロジェクト
              </p>
            </div>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 tracking-wide">
              FOLLOW US
            </h4>
            <a
              href="https://www.instagram.com/otonarashi_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Instagram"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="text-sm">@otonarashi_official</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-12" />

        {/* Bottom Section */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mx-auto">
              本サイトが提供する情報、画像等を、権利者の許可なく複製、転用、販売などの二次利用することは固く禁じます。
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} オトナラシ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
