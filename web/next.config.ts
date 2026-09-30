import type { NextConfig } from "next";
import { LOCALE_PREFIXES, SOLUTION_SLUG_REDIRECTS } from "./lib/solution-slugs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "prisma"],
  async redirects() {
    return [
      {
        source: "/hotel-marketing",
        destination: "/insights/hotel-marketing",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.thekpiplus.com" }],
        destination: "https://thekpiplus.com/:path*",
        permanent: true,
      },
      ...SOLUTION_SLUG_REDIRECTS.flatMap(([from, to]) =>
        LOCALE_PREFIXES.map((prefix) => ({
          source: `${prefix}/solutions/${from}`,
          destination: `${prefix}/solutions/${to}`,
          permanent: true,
        })),
      ),
    ];
  },
};

export default nextConfig;
