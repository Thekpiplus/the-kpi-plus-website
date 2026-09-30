import { existingHref, type Locale } from "./seo";
import { solutionNavLabel } from "./nav";

const relatedServices: Record<string, string[]> = {
  "hotel-revenue-meetings-that-lead-to-decisions": [
    "/solutions/revenue-commercial-management",
    "/case-studies",
  ],
  "hotel-marketing": [
    "/solutions/hotel-seo-google-maps-ai-search",
    "/solutions/google-ads-management",
    "/solutions/meta-ads-management",
  ],
  "hotel-technology-adoption-commercial-project": [
    "/solutions/hotel-ai-automation",
    "/solutions/hotel-systems-implementation",
  ],
  "direct-booking-journey-audit": [
    "/solutions/hotel-direct-bookings",
    "/solutions/hotel-website-design",
  ],
  "seo-vs-sem-for-hotels-which-one-should-you-focus-on": [
    "/solutions/hotel-seo-google-maps-ai-search",
    "/solutions/google-ads-management",
  ],
};

const proofLabel: Record<Locale, string> = {
  th: "โรงแรมที่ทำงานร่วมกับเรา",
  en: "Hotels we work with",
  ru: "Отели, с которыми мы работаем",
  zh: "與我們合作的飯店",
};

export function relatedServiceLinks(slug: string, locale: Locale) {
  return (relatedServices[slug] ?? [])
    .map((href) => {
      const resolved = existingHref(href, locale);
      if (!resolved) return null;
      return {
        href: resolved,
        label: href === "/case-studies" ? proofLabel[locale] : solutionNavLabel(href, locale),
      };
    })
    .filter((item): item is { href: string; label: string } => Boolean(item));
}
