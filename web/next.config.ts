import type { NextConfig } from "next";
import { LOCALE_PREFIXES, SOLUTION_SLUG_REDIRECTS } from "./lib/solution-slugs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 160, 256, 384],
  },
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "@google-analytics/data",
    "google-gax",
    "@grpc/grpc-js",
    "protobufjs",
  ],
  // Next 15.5 keeps these under experimental; top-level serverActions is rejected.
  // CMS editors post large FormData (localized JSON + media). Default 1 MB is too small.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    middlewareClientMaxBodySize: "20mb",
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    const immutableYear = {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    };
    return [
      { source: "/:path*", headers: security },
      { source: "/media/:path*", headers: [immutableYear] },
      { source: "/brand/:path*", headers: [immutableYear] },
      { source: "/fonts/:path*", headers: [immutableYear] },
      { source: "/favicon.webp", headers: [immutableYear] },
      { source: "/favicon.svg", headers: [immutableYear] },
    ];
  },
  async redirects() {
    return [
      /* Legacy raster image extensions → WebP */
      { source: "/favicon.png", destination: "/favicon.webp", permanent: true },
      { source: "/media/:path*.jpg", destination: "/media/:path*.webp", permanent: true },
      { source: "/media/:path*.jpeg", destination: "/media/:path*.webp", permanent: true },
      { source: "/media/:path*.png", destination: "/media/:path*.webp", permanent: true },
      { source: "/brand/:path*.jpg", destination: "/brand/:path*.webp", permanent: true },
      { source: "/brand/:path*.jpeg", destination: "/brand/:path*.webp", permanent: true },
      { source: "/brand/:path*.png", destination: "/brand/:path*.webp", permanent: true },
      /* KPI blog batch redirects */
      {
        source: "/10-hotel-marketing-strategies",
        destination: "/insights/10-hotel-marketing-strategies",
        permanent: true,
      },
      {
        source: "/en/10-hotel-marketing-strategies",
        destination: "/en/insights/10-hotel-marketing-strategies",
        permanent: true,
      },
      {
        source: "/7-hotel-marketing-methods",
        destination: "/insights/7-hotel-marketing-methods",
        permanent: true,
      },
      {
        source: "/en/7-hotel-marketing-methods",
        destination: "/en/insights/7-hotel-marketing-methods",
        permanent: true,
      },
      {
        source: "/hotel-branding",
        destination: "/insights/hotel-branding",
        permanent: true,
      },
      {
        source: "/en/hotel-branding",
        destination: "/en/insights/hotel-branding",
        permanent: true,
      },
      {
        source: "/hotel-local-seo",
        destination: "/insights/hotel-local-seo",
        permanent: true,
      },
      {
        source: "/en/hotel-local-seo",
        destination: "/en/insights/hotel-local-seo",
        permanent: true,
      },
      {
        source: "/what-is-hotel-marketing",
        destination: "/insights/hotel-marketing",
        permanent: true,
      },
      {
        source: "/what-is-hotel-marketing/",
        destination: "/insights/hotel-marketing",
        permanent: true,
      },
      {
        source: "/hotel-marketing",
        destination: "/insights/hotel-marketing",
        permanent: true,
      },
      {
        source: "/en/hotel-marketing",
        destination: "/en/insights/hotel-marketing",
        permanent: true,
      },
      {
        source: "/กลยุทธ์การตลาดโรงแรมปี-2",
        destination: "/insights/hotel-marketing-plan-2027",
        permanent: true,
      },
      {
        source: "/กลยุทธ์การตลาดโรงแรมปี-2/",
        destination: "/insights/hotel-marketing-plan-2027",
        permanent: true,
      },
      {
        source: "/hotel-marketing-plan-2027",
        destination: "/insights/hotel-marketing-plan-2027",
        permanent: true,
      },
      {
        source: "/en/hotel-marketing-plan-2027",
        destination: "/en/insights/hotel-marketing-plan-2027",
        permanent: true,
      },
      {
        source: "/hotel-organizational-structure",
        destination: "/insights/hotel-organizational-structure",
        permanent: true,
      },
      {
        source: "/hotel-organizational-structure/",
        destination: "/insights/hotel-organizational-structure",
        permanent: true,
      },
      {
        source: "/en/hotel-organizational-structure",
        destination: "/en/insights/hotel-organizational-structure",
        permanent: true,
      },
      {
        source: "/hotel-rate-parity",
        destination: "/insights/hotel-rate-parity",
        permanent: true,
      },
      {
        source: "/en/hotel-rate-parity",
        destination: "/en/insights/hotel-rate-parity",
        permanent: true,
      },
      {
        source: "/การสร้างรีวิวและการมีส",
        destination: "/insights/hotel-review-management",
        permanent: true,
      },
      {
        source: "/การสร้างรีวิวและการมีส/",
        destination: "/insights/hotel-review-management",
        permanent: true,
      },
      {
        source: "/hotel-review-management",
        destination: "/insights/hotel-review-management",
        permanent: true,
      },
      {
        source: "/en/hotel-review-management",
        destination: "/en/insights/hotel-review-management",
        permanent: true,
      },
      {
        source: "/hotel-seo",
        destination: "/insights/hotel-seo",
        permanent: true,
      },
      {
        source: "/en/hotel-seo",
        destination: "/en/insights/hotel-seo",
        permanent: true,
      },
      {
        source: "/hotel-social-media",
        destination: "/insights/hotel-social-media",
        permanent: true,
      },
      {
        source: "/en/hotel-social-media",
        destination: "/en/insights/hotel-social-media",
        permanent: true,
      },
      {
        source: "/hotel-business-what-to-be-careful-of-social-media-posts",
        destination: "/insights/hotel-social-media-mistakes",
        permanent: true,
      },
      {
        source: "/hotel-business-what-to-be-careful-of-social-media-posts/",
        destination: "/insights/hotel-social-media-mistakes",
        permanent: true,
      },
      {
        source: "/hotel-social-media-mistakes",
        destination: "/insights/hotel-social-media-mistakes",
        permanent: true,
      },
      {
        source: "/en/hotel-social-media-mistakes",
        destination: "/en/insights/hotel-social-media-mistakes",
        permanent: true,
      },
      {
        source: "/hotel-website-content",
        destination: "/insights/hotel-website-content",
        permanent: true,
      },
      {
        source: "/en/hotel-website-content",
        destination: "/en/insights/hotel-website-content",
        permanent: true,
      },
      {
        source: "/เพิ่มยอดจองโรงแรมผ่านก",
        destination: "/insights/increase-hotel-bookings-from-google",
        permanent: true,
      },
      {
        source: "/เพิ่มยอดจองโรงแรมผ่านก/",
        destination: "/insights/increase-hotel-bookings-from-google",
        permanent: true,
      },
      {
        source: "/increase-hotel-bookings-from-google",
        destination: "/insights/increase-hotel-bookings-from-google",
        permanent: true,
      },
      {
        source: "/en/increase-hotel-bookings-from-google",
        destination: "/en/insights/increase-hotel-bookings-from-google",
        permanent: true,
      },
      {
        source: "/small-hotel-marketing-and-operations",
        destination: "/insights/small-hotel-marketing-and-operations",
        permanent: true,
      },
      {
        source: "/en/small-hotel-marketing-and-operations",
        destination: "/en/insights/small-hotel-marketing-and-operations",
        permanent: true,
      },
      {
        source: "/what-is-otas-and-how-to-help-hotel",
        destination: "/insights/what-is-ota",
        permanent: true,
      },
      {
        source: "/what-is-otas-and-how-to-help-hotel/",
        destination: "/insights/what-is-ota",
        permanent: true,
      },
      {
        source: "/what-is-ota",
        destination: "/insights/what-is-ota",
        permanent: true,
      },
      {
        source: "/en/what-is-ota",
        destination: "/en/insights/what-is-ota",
        permanent: true,
      },
      {
        source: "/hotel-marketing",
        destination: "/insights/hotel-marketing",
        permanent: true,
      },
      {
        source: "/hotel-branding",
        destination: "/insights/hotel-branding",
        permanent: true,
      },
      {
        source: "/en/hotel-branding",
        destination: "/en/insights/hotel-branding",
        permanent: true,
      },
      /* Blog articles are TH + EN only — RU/ZH article URLs fall back to English. */
      {
        source: "/ru/insights/:slug",
        destination: "/en/insights/:slug",
        permanent: false,
      },
      {
        source: "/zh/insights/:slug",
        destination: "/en/insights/:slug",
        permanent: false,
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
