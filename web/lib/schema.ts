import { COMPANY, type CompanyContact } from "./company";
import type { FaqItem } from "./faqs";
import type { InsightPost } from "./insights";
import { uiCopy } from "./nav";
import { pageKind } from "./page-types";
import { SITE, brandName, htmlLang, legalName, localizePath, type Locale } from "./seo";

const ORG_ID = `${SITE}/#organization`;

function postalAddress(company: CompanyContact) {
  return {
    "@type": "PostalAddress",
    streetAddress: "58/15 E Chaofah Rd, Talat Nuea",
    addressLocality: "Mueang Phuket",
    addressRegion: "Phuket",
    postalCode: "83000",
    addressCountry: "TH",
    name: company.addressEn,
  };
}

export function organizationSchema(locale: Locale = "en", company: CompanyContact = COMPANY) {
  const name = brandName(locale);
  const telephone = company.phones[0]?.display.replace(/\s+/g, "-") ?? "";
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name,
    alternateName: locale === "th" ? "The KPI Plus" : "เดอะ เคพีไอ พลัส",
    legalName: legalName(locale),
    url: SITE,
    logo: `${SITE}/brand/KPIPlus_Symbol_FullColor.png`,
    image: `${SITE}/media/the-kpi-plus-founders_f4c8516e.webp`,
    email: company.email,
    telephone,
    slogan: "Better Decisions. Better Hotel Performance.",
    description:
      "Hospitality Performance Partner helping hotels in Thailand grow through revenue management, demand, distribution, and direct booking.",
    areaServed: { "@type": "Country", name: "Thailand" },
    knowsAbout: [
      "Hotel revenue management",
      "OTA and distribution",
      "Direct booking",
      "Hotel digital marketing",
      "Hospitality technology",
    ],
    address: postalAddress(company),
    sameAs: Object.values(company.social).filter(Boolean),
  };
}

export function localBusinessSchema(locale: Locale = "th", company: CompanyContact = COMPANY) {
  const telephone = company.phones[0]?.display.replace(/\s+/g, "-") ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}/#localbusiness`,
    name: brandName(locale),
    url: SITE,
    image: `${SITE}/media/the-kpi-plus-founders_f4c8516e.webp`,
    email: company.email,
    telephone,
    parentOrganization: { "@id": ORG_ID },
    address: postalAddress(company),
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.geo.latitude,
      longitude: company.geo.longitude,
    },
    areaServed: { "@type": "Country", name: "Thailand" },
  };
}

export function webSiteSchema(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: brandName(locale),
    url: SITE,
    inLanguage: ["th", "en", "ru", "zh-Hant"],
    publisher: { "@id": ORG_ID },
  };
}

export function webPageSchema(input: {
  route: string;
  title: string;
  description: string;
  canonical: string;
  locale: Locale;
}) {
  const kind = pageKind(input.route);
  const type =
    kind === "about"
      ? "AboutPage"
      : kind === "contact"
        ? "ContactPage"
        : kind === "insightsIndex" || kind === "solutionsIndex" || kind === "caseStudies"
          ? "CollectionPage"
          : "WebPage";

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${input.canonical}#webpage`,
    url: input.canonical,
    name: input.title,
    description: input.description,
    inLanguage: htmlLang(input.locale),
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function faqSchema(items: FaqItem[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function serviceSchema(input: { name: string; description: string; canonical: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.canonical,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Thailand" },
    serviceType: input.name,
  };
}

export function howToSchema(input: { name: string; description: string; steps: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

function crumbLabel(path: string, locale: Locale, fallback: string) {
  const t = uiCopy(locale);
  const labels: Record<string, string> = {
    "/solutions": t.solutions,
    "/insights": t.insights,
    "/case-studies": t.caseStudies,
    "/about-us": t.about,
    "/contact-us": t.contact,
    "/approach": t.approach,
    "/associations": t.partners,
    "/tools": t.tools,
    "/partner": locale === "th" ? "สมัครเป็น Partner" : t.partners,
    "/privacy": t.privacy,
    "/cookies": t.cookies,
  };
  return labels[path] ?? fallback;
}

export function crumbsFor(route: string, locale: Locale, title: string) {
  const t = uiCopy(locale);
  const home = locale === "th" ? "/" : `/${locale}`;
  const homeLabel: Record<Locale, string> = { th: "หน้าแรก", en: "Home", ru: "Главная", zh: "首頁" };
  const items = [{ name: homeLabel[locale], href: home }];
  if (route === "/" || route === home) return items;

  const insightsHref = localizePath("/insights", locale);
  if (route === insightsHref || route === "/insights") {
    items.push({ name: t.insights, href: insightsHref });
    return items;
  }
  if (route.startsWith("/insights/") || route.includes("/insights/")) {
    items.push({ name: t.insights, href: insightsHref });
    items.push({ name: title.split("|")[0].trim(), href: route });
    return items;
  }

  const parts = route.split("/").filter(Boolean);
  let acc = "";
  parts.forEach((part, index) => {
    acc += `/${part}`;
    if ((part === "en" || part === "ru" || part === "zh") && index === 0) return;
    const last = index === parts.length - 1;
    const bare = acc.replace(/^\/(en|ru|zh)(?=\/|$)/, "") || "/";
    items.push({
      name: last ? title.split("|")[0].trim() : crumbLabel(bare, locale, part.replace(/-/g, " ")),
      href: acc,
    });
  });
  return items;
}

export function isSolutionRoute(route: string) {
  return /\/solutions\/.+/.test(route);
}

export function isToolRoute(route: string) {
  return route.startsWith("/tools/") && route !== "/tools";
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE}${item.href === "/" ? "" : item.href}`,
    })),
  };
}

export function articleSchema(post: InsightPost, canonical: string, locale: Locale = "th") {
  const language = htmlLang(locale);
  const headline = post.title[locale] || post.title.th;
  const description = post.description[locale] || post.description.th;
  const authorName = locale === "th" ? "ทีมบรรณาธิการ เดอะ เคพีไอ พลัส" : "The KPI Plus Editorial Team";
  const publisherName = brandName(locale);
  const imageUrl = post.image.startsWith("http") ? post.image : `${SITE}${post.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    datePublished: post.published,
    dateModified: post.modified || post.published,
    inLanguage: language,
    image: [
      {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 750,
      },
    ],
    url: canonical,
    author: {
      "@type": "Organization",
      name: authorName,
      url: `${SITE}${localizePath("/about-us", locale)}`,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/KPIPlus_Symbol_FullColor.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };
}

export function blogSchema(
  posts: InsightPost[],
  canonical: string,
  name: string,
  description: string,
  locale: Locale = "en",
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url: canonical,
    inLanguage: htmlLang(locale),
    publisher: {
      "@type": "Organization",
      name: brandName(locale),
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/KPIPlus_Symbol_FullColor.png`,
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title[locale] || post.title.th,
      description: post.description[locale] || post.description.th,
      url: `${SITE}${post.href}`,
      datePublished: post.published,
      dateModified: post.modified,
      image: post.image.startsWith("http") ? post.image : `${SITE}${post.image}`,
      inLanguage: "th",
    })),
  };
}
