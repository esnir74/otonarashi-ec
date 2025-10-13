import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 任意の外部ドメインを許可する場合
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
// もし request.ts を別パスに置いたなら、ここで明示:
// './path/to/request.ts'

export default withNextIntl(nextConfig);
