import { existingHref, type Locale } from "./seo";
import { solutionNavLabel } from "./nav";

type RelatedServiceDef = {
  href: string;
  why?: Partial<Record<Locale, string>>;
};

const relatedServices: Record<string, RelatedServiceDef[]> = {
  "what-is-ota": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/tools/ota-commission-calculator" },
  ],
  "small-hotel-marketing-and-operations": [
    { href: "/solutions/independent-hotel-management" },
    { href: "/tools/revpar-calculator" },
  ],
  "increase-hotel-bookings-from-google": [
    { href: "/solutions/google-ads-management" },
    { href: "/solutions/hotel-direct-bookings" },
  ],
  "hotel-website-content": [
    { href: "/solutions/hotel-website-design" },
    { href: "/hotel-website-conversion" },
  ],
  "hotel-social-media-mistakes": [
    { href: "/solutions/meta-ads-management" },
    { href: "/hotel-digital-marketing" },
  ],
  "hotel-social-media": [
    { href: "/solutions/meta-ads-management" },
    { href: "/hotel-digital-marketing" },
  ],
  "hotel-seo": [
    { href: "/solutions/hotel-seo-google-maps-ai-search" },
    { href: "/tools/hotel-searchability-check" },
  ],
  "hotel-review-management": [
    { href: "/solutions/hotel-seo-google-maps-ai-search" },
    { href: "/tools/hotel-review-link" },
  ],
  "hotel-rate-parity": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/tools/ota-commission-calculator" },
  ],
  "hotel-organizational-structure": [
    { href: "/solutions/independent-hotel-management" },
    { href: "/solutions/hotel-systems-implementation" },
  ],
  "hotel-marketing-plan-2027": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/tools/hotel-budget-calculator" },
  ],
  "hotel-local-seo": [
    { href: "/solutions/hotel-seo-google-maps-ai-search" },
    { href: "/tools/hotel-review-link" },
  ],
  "7-hotel-marketing-methods": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/solutions/google-ads-management" },
  ],
  "10-hotel-marketing-strategies": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/solutions/hotel-direct-bookings" },
  ],
  "hotel-revenue-meetings-that-lead-to-decisions": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/case-studies" },
  ],
  "hotel-marketing": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/hotel-digital-marketing" },
  ],
  "hotel-technology-adoption-commercial-project": [
    { href: "/solutions/hotel-ai-automation" },
    { href: "/solutions/hotel-systems-implementation" },
  ],
  "direct-booking-journey-audit": [
    { href: "/solutions/hotel-direct-bookings" },
    { href: "/solutions/hotel-website-design" },
  ],
  "seo-vs-sem-for-hotels-which-one-should-you-focus-on": [
    { href: "/solutions/hotel-seo-google-maps-ai-search" },
    { href: "/solutions/google-ads-management" },
  ],
  "hotel-branding": [
    { href: "/solutions/hotel-website-design" },
    { href: "/solutions/revenue-commercial-management" },
  ],
};

const proofLabel: Record<Locale, string> = {
  th: "โรงแรมที่ทำงานร่วมกับเรา",
  en: "Hotels we work with",
  ru: "Отели, с которыми мы работаем",
  zh: "與我們合作的飯店",
};

export type RelatedServiceLink = {
  href: string;
  label: string;
  why?: string;
};

export function relatedServiceLinks(slug: string, locale: Locale): RelatedServiceLink[] {
  return (relatedServices[slug] ?? [])
    .map((item) => {
      const resolved = existingHref(item.href, locale);
      if (!resolved) return null;
      const why =
        item.why?.[locale] ??
        item.why?.en ??
        item.why?.th ??
        undefined;
      return {
        href: resolved,
        label: item.href === "/case-studies" ? proofLabel[locale] : solutionNavLabel(item.href, locale),
        ...(why ? { why } : {}),
      };
    })
    .filter((item): item is RelatedServiceLink => Boolean(item));
}
