import type { MetadataRoute } from "next";
import { publishedDocuments } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";
import { insightByHref } from "@/lib/insights";
import { SITE, pages } from "@/lib/seo";

const PRIVATE = [/^\/admin/, /^\/crm/, /^\/partners/, /^\/login/, /^\/dashboard/];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const codePages = pages
    .filter((page) => !PRIVATE.some((pattern) => pattern.test(page.route)))
    .map((page) => {
      const insight = insightByHref(page.route);
      const isHome = page.route === "/" || page.route === "/en" || page.route === "/ru" || page.route === "/zh";
      const isInsight = page.route.includes("/insights");
      const isSolution = page.route.includes("/solutions/");

      return {
        url: page.canonical,
        lastModified: insight?.modified ?? "2026-09-26",
        changeFrequency: (isHome ? "weekly" : isInsight || isSolution ? "monthly" : "monthly") as "weekly" | "monthly",
        priority: isHome ? 1 : isSolution ? 0.8 : isInsight ? 0.7 : 0.6,
      };
    });

  const cmsDocs = await publishedDocuments().catch(() => []);
  const cmsPages = cmsDocs
    .filter((doc) => !doc.noindex)
    .map((doc) => {
      const path = documentPath(doc);
      return {
        url: doc.canonical || `${SITE}${path}`,
        lastModified: doc.updatedAt.toISOString().slice(0, 10),
        changeFrequency: "monthly" as const,
        priority: doc.kind === "insight" ? 0.7 : 0.6,
      };
    });

  return [...codePages, ...cmsPages];
}
