import type { MetadataRoute } from "next";
import { publishedDocuments } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";
import { insightByHref } from "@/lib/insights";
import { SITE, pages, type SeoEntry } from "@/lib/seo";

const PRIVATE = [/^\/admin/, /^\/crm/, /^\/partners/, /^\/login/, /^\/dashboard/];

function isRedirectedLegacy(url: string) {
  try {
    const path = new URL(url).pathname.replace(/\/$/, "") || "/";
    return (
      path === "/about" ||
      path === "/contact" ||
      /^\/(en|ru|zh)\/(about|contact)$/.test(path)
    );
  } catch {
    return false;
  }
}

function languageAlternates(page: SeoEntry): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = {};
  for (const alt of page.alternates || []) {
    if (!alt?.hreflang || !alt?.href) continue;
    languages[alt.hreflang] = alt.href;
  }
  // Thai is the default locale — always expose x-default to the Thai canonical.
  const thai =
    languages.th ||
    page.alternates?.find((alt) => alt.hreflang === "th")?.href ||
    (page.language === "th" ? page.canonical : undefined);
  if (thai) languages["x-default"] = thai;
  if (!Object.keys(languages).length) return undefined;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const codePages = pages
    .filter((page) => !PRIVATE.some((pattern) => pattern.test(page.route)))
    .filter((page) => !isRedirectedLegacy(page.canonical))
    .map((page) => {
      const insight = insightByHref(page.route);
      const isHome = page.route === "/" || page.route === "/en" || page.route === "/ru" || page.route === "/zh";
      const isInsight = page.route.includes("/insights");
      const isSolution = page.route.includes("/solutions/");

      return {
        url: page.canonical,
        lastModified: insight?.updatedAt || insight?.publishedAt || "2026-09-26",
        changeFrequency: (isHome ? "weekly" : isInsight || isSolution ? "monthly" : "monthly") as
          | "weekly"
          | "monthly",
        priority: isHome ? 1 : isSolution ? 0.8 : isInsight ? 0.7 : 0.6,
        alternates: languageAlternates(page),
      };
    });

  const cmsDocs = await publishedDocuments().catch(() => []);
  const cmsPages = cmsDocs
    .filter((doc) => !doc.noindex)
    .map((doc) => {
      const path = documentPath(doc);
      return {
        url: (doc.canonical || `${SITE}${path}`)
          .replace(/\/about$/, "/about-us")
          .replace(/\/contact$/, "/contact-us"),
        lastModified: doc.updatedAt.toISOString().slice(0, 10),
        changeFrequency: "monthly" as const,
        priority: doc.kind === "insight" ? 0.7 : 0.6,
      };
    });

  const seen = new Set(codePages.map((item) => item.url));
  return [
    ...codePages,
    ...cmsPages.filter((item) => !seen.has(item.url) && !isRedirectedLegacy(item.url)),
  ];
}
