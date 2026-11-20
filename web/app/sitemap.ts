import type { MetadataRoute } from "next";
import { publishedDocuments } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";
import { insightByHref } from "@/lib/insights";
import { existingLanguageAlternates, SITE, pages, type SeoEntry } from "@/lib/seo";

const PRIVATE = [/^\/admin/, /^\/crm/, /^\/partners/, /^\/login/, /^\/dashboard/];

/** Force absolute https URLs — CMS canonicals may be stored as paths like `/solutions`. */
function absoluteUrl(value: string) {
  const raw = value.trim();
  if (!raw) return SITE;
  try {
    if (/^https?:\/\//i.test(raw)) return new URL(raw).toString().replace(/\/$/, "") || SITE;
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return new URL(path, SITE).toString().replace(/\/$/, "") || SITE;
  } catch {
    return `${SITE}${raw.startsWith("/") ? raw : `/${raw}`}`.replace(/\/$/, "") || SITE;
  }
}

function isRedirectedLegacy(url: string) {
  try {
    const path = new URL(absoluteUrl(url)).pathname.replace(/\/$/, "") || "/";
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
  const languages = existingLanguageAlternates(page);
  if (!Object.keys(languages).length) return undefined;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const codePages = pages
    .filter((page) => !PRIVATE.some((pattern) => pattern.test(page.route)))
    .filter((page) => !isRedirectedLegacy(page.canonical))
    .map((page) => {
      const insight = insightByHref(page.route);
      return {
        url: absoluteUrl(page.canonical),
        lastModified: insight?.updatedAt || insight?.publishedAt || undefined,
        alternates: languageAlternates(page),
      };
    });

  const cmsDocs = await publishedDocuments().catch(() => []);
  const cmsPages = cmsDocs
    .filter((doc) => !doc.noindex)
    .map((doc) => {
      const path = documentPath(doc);
      const raw = (doc.canonical || `${SITE}${path}`)
        .replace(/\/about$/, "/about-us")
        .replace(/\/contact$/, "/contact-us");
      return {
        url: absoluteUrl(raw),
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
