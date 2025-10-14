import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "54321" }, // ローカル
      { protocol: "https", hostname: "www.gstatic.com" },
      { protocol: "https", hostname: "www.learningcontainer.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    deviceSizes: [400, 640, 828, 1200, 1600, 2400],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
