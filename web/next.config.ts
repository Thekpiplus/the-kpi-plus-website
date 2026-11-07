import type { NextConfig } from "next";
import { LOCALE_PREFIXES, SOLUTION_SLUG_REDIRECTS } from "./lib/solution-slugs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "prisma"],
  // CMS editors post large FormData (localized JSON + media). Default 1 MB is too small.
  serverActions: {
    bodySizeLimit: "20mb",
  },
  async redirects() {
    return [
      {
        source: "/hotel-marketing",
        destination: "/insights/hotel-marketing",
        permanent: true,
      },
      ...LOCALE_PREFIXES.map((prefix) => ({
        source: `${prefix}/about`,
        destination: `${prefix}/about-us`,
        permanent: true,
      })),
      ...LOCALE_PREFIXES.map((prefix) => ({
        source: `${prefix}/contact`,
        destination: `${prefix}/contact-us`,
        permanent: true,
      })),
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
