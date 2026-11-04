import { existingHref, type Locale } from "./seo";
import { solutionNavLabel } from "./nav";

type RelatedServiceDef = {
  href: string;
  why?: Partial<Record<Locale, string>>;
};

const relatedServices: Record<string, RelatedServiceDef[]> = {
  "hotel-revenue-meetings-that-lead-to-decisions": [
    { href: "/solutions/revenue-commercial-management" },
    { href: "/case-studies" },
  ],
  "hotel-marketing": [
    {
      href: "/solutions/hotel-seo-google-maps-ai-search",
      why: {
        th: "ช่วยเรื่อง Search Visibility, Google Maps และข้อมูลโรงแรมให้ค้นพบและเชื่อถือได้ก่อนจอง",
        en: "Supports search visibility, Google Maps, and accurate hotel information before guests book",
      },
    },
    {
      href: "/solutions/google-ads-management",
      why: {
        th: "เชื่อม Demand จาก Search กับ Landing Page และเส้นทางไปยัง Booking Engine",
        en: "Connects search demand with the landing page and path to the booking engine",
      },
    },
    {
      href: "/solutions/meta-ads-management",
      why: {
        th: "สร้างการรับรู้และ Interest บน Social โดยยังต้องเชื่อมกับข้อเสนอที่จองได้จริง",
        en: "Builds awareness and interest on social while staying tied to bookable offers",
      },
    },
    {
      href: "/solutions/hotel-direct-bookings",
      why: {
        th: "ดูแล Website Conversion และเส้นทาง Direct Booking บนมือถือ",
        en: "Covers website conversion and the mobile direct-booking path",
      },
    },
    {
      href: "/solutions/revenue-commercial-management",
      why: {
        th: "เชื่อม Marketing กับ Pricing, Inventory, Distribution และบริบทรายได้",
        en: "Connects marketing with pricing, inventory, distribution, and revenue context",
      },
    },
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
