import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/Analytics";
import { ConsentDefaults } from "@/components/ConsentDefaults";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thekpiplus.com"),
  title: {
    default: "The KPI Plus",
    template: "%s",
  },
  description: "Hospitality performance and growth partner based in Phuket.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: {
    types: {
      "application/rss+xml": "https://thekpiplus.com/insights/rss.xml",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B6660",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <ConsentDefaults />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="preload"
          href="/fonts/noto-sans-thai/NotoSansThai.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
