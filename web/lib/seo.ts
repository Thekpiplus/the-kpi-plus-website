import { isAuditFocus } from "@/lib/audit";
import seoManifest from "@/content/seo-manifest.json";

export type Locale = "th" | "en" | "ru" | "zh";

export type SeoEntry = {
  route: string;
  language: string;
  title: string;
  description: string;
  canonical: string;
  alternates: { hreflang: string; href: string }[];
  ogImage?: string;
  ogUrl?: string;
};

export const SITE = "https://thekpiplus.com";

export const BRAND_NAME = {
  th: "เดอะ เคพีไอ พลัส",
  en: "The KPI Plus",
} as const;

export const LEGAL_NAME = {
  th: "บริษัท เดอะ เคพีไอ พลัส จำกัด",
  en: "The KPI Plus Co., Ltd.",
} as const;

export function brandName(locale: Locale) {
  return locale === "th" ? BRAND_NAME.th : BRAND_NAME.en;
}

export function legalName(locale: Locale) {
  return locale === "th" ? LEGAL_NAME.th : LEGAL_NAME.en;
}

export const pages = seoManifest as SeoEntry[];
export const pageByRoute = new Map(pages.map((page) => [page.route, page]));

export function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return "zh";
  return "th";
}

export function barePath(pathname: string) {
  const stripped = pathname.replace(/^\/(en|ru|zh)(?=\/|$)/, "");
  return stripped || "/";
}

export function localizePath(pathname: string, locale: Locale) {
  const bare = barePath(pathname);
  if (locale === "th") return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/**
 * Blog articles exist in Thai and English only.
 * RU/ZH readers fall back to the English article when it exists.
 */
export function insightArticleHref(href: string, locale: Locale): string | null {
  const bare = barePath(href);
  if (bare === "/insights" || !bare.startsWith("/insights/")) return null;
  const slug = bare.slice("/insights/".length).split("/")[0];
  if (!slug) return null;

  const th = `/insights/${slug}`;
  const en = `/en/insights/${slug}`;

  if (locale === "th") return pageByRoute.has(th) ? th : pageByRoute.has(en) ? en : null;
  // en, ru, zh → prefer English article content
  if (pageByRoute.has(en)) return en;
  if (pageByRoute.has(th)) return th;
  return null;
}

export function switchLocale(pathname: string, locale: Locale) {
  const bare = barePath(pathname);

  // Insight articles: TH ↔ EN; RU/ZH switch lands on English article content.
  if (bare.startsWith("/insights/")) {
    const article = insightArticleHref(bare, locale);
    if (article) return article;
    const insights = localizePath("/insights", locale);
    if (pageByRoute.has(insights)) return insights;
  }

  const candidate = localizePath(pathname, locale);
  if (pageByRoute.has(candidate)) return candidate;

  if (bare === "/insights" || bare.startsWith("/insights")) {
    const insights = localizePath("/insights", locale);
    if (pageByRoute.has(insights)) return insights;
  }
  if (bare.startsWith("/case-studies")) {
    const localized = localizePath(bare, locale);
    if (pageByRoute.has(localized)) return localized;
    const index = localizePath("/case-studies", locale);
    if (pageByRoute.has(index)) return index;
  }
  if (bare.startsWith("/solutions")) {
    const solutions = localizePath("/solutions", locale);
    if (pageByRoute.has(solutions)) return solutions;
  }
  if (locale === "th" && pageByRoute.has(bare)) return bare;
  return homeHref(locale);
}

export function homeHref(locale: Locale) {
  if (locale === "th") return "/";
  const home = `/${locale}`;
  return pageByRoute.has(home) ? home : localizePath("/", locale);
}

export function existingHref(href: string, locale: Locale): string | null {
  if (
    href.startsWith("/#") ||
    href.startsWith("#") ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  const bare = barePath(href);
  if (bare.startsWith("/insights/")) {
    return insightArticleHref(bare, locale);
  }

  const localized = localizePath(href, locale);
  if (pageByRoute.has(localized)) return localized;

  if (bare.startsWith("/case-studies/")) {
    const slug = bare.slice("/case-studies/".length).split("/")[0];
    if (slug && pageByRoute.has(localizePath(`/case-studies/${slug}`, "th"))) {
      return localized;
    }
  }
  if (bare.startsWith("/tools") && pageByRoute.has(bare)) return bare;
  return null;
}

export function auditHref(locale: Locale, focus?: string) {
  const home = homeHref(locale);
  if (isAuditFocus(focus)) return `${home}?focus=${focus}#audit`;
  return `${home}#audit`;
}

export function solutionsIndexHref(locale: Locale) {
  return (
    existingHref("/solutions", locale) ??
    existingHref("/solutions/revenue-commercial-management", locale) ??
    "/solutions"
  );
}

export function resolvePageHref(href: string, locale: Locale): string | null {
  if (!href) return null;
  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")) {
    return href;
  }
  if (href.includes("#audit")) {
    const focus = href.match(/(?:[?&#]focus=)([a-z]+)/i)?.[1];
    return auditHref(locale, focus);
  }

  const [path = "/", hash = ""] = href.split("#");
  const bare = barePath(path);
  if (bare === "/solutions" || bare === "/") {
    return bare === "/" ? homeHref(locale) : solutionsIndexHref(locale);
  }

  const resolved = existingHref(path, locale);
  return resolved ? `${resolved}${hash ? `#${hash}` : ""}` : null;
}

export function htmlLang(locale: Locale) {
  if (locale === "zh") return "zh-Hant";
  return locale;
}

/** Keep only alternates whose path exists in the SEO manifest (drops /en/tools 404s, etc.). */
export function existingLanguageAlternates(page: SeoEntry): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const alt of page.alternates || []) {
    if (!alt?.hreflang || !alt?.href) continue;
    try {
      const path = new URL(alt.href, SITE).pathname.replace(/\/$/, "") || "/";
      if (!pageByRoute.has(path)) continue;
      languages[alt.hreflang] = alt.href;
    } catch {
      // skip invalid href
    }
  }
  const thai =
    languages.th ||
    page.alternates?.find((alt) => alt.hreflang === "th")?.href ||
    (page.language === "th" || page.language === "th-TH" ? page.canonical : undefined);
  if (thai) languages["x-default"] = thai;
  return languages;
}

export function metadataFor(
  route: string,
  extra?: {
    type?: "website" | "article";
    published?: string;
    modified?: string;
    image?: string;
    imageAlt?: string;
  },
) {
  const page = pageByRoute.get(route);
  const locale = localeFromPath(route);
  const title = page?.title ?? brandName(locale);
  const description = page?.description ?? "";
  const canonical = page?.canonical ?? `${SITE}${route === "/" ? "" : route}`;
  const ogImage = extra?.image
    ? extra.image.startsWith("http")
      ? extra.image
      : `${SITE}${extra.image}`
    : (page?.ogImage ?? `${SITE}/media/the-kpi-plus-performance-hero_2f986b5f.jpg`);
  const languages = page
    ? existingLanguageAlternates(page)
    : locale === "th"
      ? { th: canonical, "x-default": canonical }
      : {};

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: extra?.type === "article" ? ("article" as const) : ("website" as const),
      title,
      description,
      url: page?.ogUrl ?? canonical,
      siteName: brandName(locale),
      locale: htmlLang(locale) === "zh-Hant" ? "zh_TW" : htmlLang(locale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: extra?.imageAlt ?? title }],
      ...(extra?.type === "article"
        ? {
            publishedTime: extra.published,
            modifiedTime: extra.modified,
            authors: [locale === "th" ? "ทีมบรรณาธิการ เดอะ เคพีไอ พลัส" : "The KPI Plus Editorial Team"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImage],
    },
    other: {
      "theme-color": "#0B6660",
    },
  };
}
