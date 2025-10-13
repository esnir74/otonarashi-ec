import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();
// もし request.ts を別パスに置いたなら、ここで明示:
// './path/to/request.ts'

export default withNextIntl(nextConfig);
