import { insightByHref, insightPosts } from "@/lib/insights";
import { solutionNavLabel, uiCopy } from "@/lib/nav";
import { barePath, existingHref, type Locale } from "@/lib/seo";

export type InternalBacklink = {
  href: string;
  label: string;
  kind: "solution" | "insight" | "tool" | "page" | "case";
};

type LinkRef = { href: string; kind: InternalBacklink["kind"]; label?: Partial<Record<Locale, string>> };

const TOOL_LABELS: Record<string, Record<Locale, string>> = {
  "/tools": {
    th: "เครื่องมือฟรีสำหรับโรงแรม",
    en: "Free hotel tools",
    ru: "Бесплатные инструменты",
    zh: "飯店免費工具",
  },
  "/tools/hotel-searchability-check": {
    th: "ตรวจสุขภาพการค้นหาเว็บไซต์",
    en: "Hotel searchability check",
    ru: "Проверка видимости сайта",
    zh: "飯店搜尋就緒檢查",
  },
  "/tools/revpar-calculator": {
    th: "คำนวณ RevPAR, ADR และ Occupancy",
    en: "RevPAR, ADR and Occupancy calculator",
    ru: "Калькулятор RevPAR, ADR и Occupancy",
    zh: "RevPAR、ADR 與 Occupancy 計算機",
  },
  "/tools/hotel-budget-calculator": {
    th: "คำนวณ Budget โรงแรม",
    en: "Hotel budget calculator",
    ru: "Калькулятор бюджета отеля",
    zh: "飯店預算計算機",
  },
  "/tools/hotel-profit-calculator": {
    th: "คำนวณรายได้และกำไรโรงแรม",
    en: "Hotel profit calculator",
    ru: "Калькулятор прибыли отеля",
    zh: "飯店利潤計算機",
  },
  "/tools/ota-commission-calculator": {
    th: "คำนวณค่าคอมมิชชัน OTA",
    en: "OTA commission calculator",
    ru: "Калькулятор комиссии OTA",
    zh: "OTA 佣金計算機",
  },
  "/tools/hotel-vat-service-charge-calculator": {
    th: "VAT และ Service Charge โรงแรม",
    en: "Hotel VAT and service charge",
    ru: "VAT и service charge отеля",
    zh: "飯店 VAT 與服務費",
  },
  "/tools/hotel-review-link": {
    th: "สร้างลิงก์รีวิว Google",
    en: "Google review link generator",
    ru: "Ссылка на отзыв Google",
    zh: "Google 評論連結產生器",
  },
};

const PAGE_LABELS: Record<string, Record<Locale, string>> = {
  "/solutions": {
    th: "ดูโซลูชันทั้งหมด",
    en: "All solutions",
    ru: "Все решения",
    zh: "全部解決方案",
  },
  "/insights": {
    th: "บทความและมุมมอง",
    en: "Insights",
    ru: "Материалы",
    zh: "觀點文章",
  },
  "/case-studies": {
    th: "ผลงานลูกค้า",
    en: "Case studies",
    ru: "Кейсы",
    zh: "成功案例",
  },
  "/approach": {
    th: "แนวทางการทำงาน",
    en: "Approach",
    ru: "Подход",
    zh: "工作方式",
  },
  "/about-us": {
    th: "เกี่ยวกับเรา",
    en: "About us",
    ru: "О нас",
    zh: "關於我們",
  },
  "/associations": {
    th: "พันธมิตรของเรา",
    en: "Associations",
    ru: "Партнёры",
    zh: "合作夥伴",
  },
  "/contact-us": {
    th: "ติดต่อเรา",
    en: "Contact us",
    ru: "Контакты",
    zh: "聯絡我們",
  },
  "/partner": {
    th: "สมัครเป็น Partner",
    en: "Become a partner",
    ru: "Стать партнёром",
    zh: "成為合作夥伴",
  },
};

/** Curated internal targets per bare route. Current page is filtered out at resolve time. */
const ROUTE_LINKS: Record<string, LinkRef[]> = {
  "/about-us": [
    { href: "/approach", kind: "page" },
    { href: "/solutions", kind: "page" },
    { href: "/case-studies", kind: "page" },
    { href: "/insights", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/approach": [
    { href: "/solutions", kind: "page" },
    { href: "/case-studies", kind: "page" },
    { href: "/insights/hotel-revenue-meetings-that-lead-to-decisions", kind: "insight" },
    { href: "/about-us", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/associations": [
    { href: "/about-us", kind: "page" },
    { href: "/partner", kind: "page" },
    { href: "/solutions", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/contact-us": [
    { href: "/solutions", kind: "page" },
    { href: "/tools", kind: "tool" },
    { href: "/case-studies", kind: "page" },
    { href: "/approach", kind: "page" },
    { href: "/partner", kind: "page" },
  ],
  "/partner": [
    { href: "/associations", kind: "page" },
    { href: "/about-us", kind: "page" },
    { href: "/solutions", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/solutions": [
    { href: "/insights", kind: "page" },
    { href: "/case-studies", kind: "page" },
    { href: "/tools", kind: "tool" },
    { href: "/approach", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/insights": [
    { href: "/solutions", kind: "page" },
    { href: "/case-studies", kind: "page" },
    { href: "/tools", kind: "tool" },
    { href: "/approach", kind: "page" },
  ],
  "/case-studies": [
    { href: "/solutions", kind: "page" },
    { href: "/insights", kind: "page" },
    { href: "/approach", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/tools": [
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/insights", kind: "page" },
    { href: "/case-studies", kind: "page" },
  ],
  "/hotel-revenue-management": [
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/insights/hotel-revenue-meetings-that-lead-to-decisions", kind: "insight" },
    { href: "/tools/revpar-calculator", kind: "tool" },
    { href: "/tools/hotel-budget-calculator", kind: "tool" },
    { href: "/case-studies", kind: "page" },
  ],
  "/hotel-digital-marketing": [
    { href: "/insights/hotel-marketing", kind: "insight" },
    { href: "/solutions/google-ads-management", kind: "solution" },
    { href: "/solutions/meta-ads-management", kind: "solution" },
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/case-studies", kind: "page" },
  ],
  "/hotel-seo-local-search": [
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on", kind: "insight" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
    { href: "/tools/hotel-review-link", kind: "tool" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
  ],
  "/hotel-technology-ai": [
    { href: "/solutions/hotel-ai-automation", kind: "solution" },
    { href: "/insights/hotel-technology-adoption-commercial-project", kind: "insight" },
    { href: "/solutions/hotel-systems-implementation", kind: "solution" },
    { href: "/solutions/hotel-training-team-development", kind: "solution" },
  ],
  "/hotel-website-conversion": [
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/solutions/hotel-website-design", kind: "solution" },
    { href: "/insights/direct-booking-journey-audit", kind: "insight" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
  ],
  "/phuket-hotel-marketing": [
    { href: "/insights/hotel-marketing", kind: "insight" },
    { href: "/solutions/google-ads-management", kind: "solution" },
    { href: "/solutions/meta-ads-management", kind: "solution" },
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/case-studies", kind: "page" },
    { href: "/contact-us", kind: "page" },
  ],
  "/tools/revpar-calculator": [
    { href: "/tools/hotel-budget-calculator", kind: "tool" },
    { href: "/tools/hotel-profit-calculator", kind: "tool" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/insights/hotel-revenue-meetings-that-lead-to-decisions", kind: "insight" },
    { href: "/tools", kind: "tool" },
  ],
  "/tools/hotel-budget-calculator": [
    { href: "/tools/revpar-calculator", kind: "tool" },
    { href: "/tools/hotel-profit-calculator", kind: "tool" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/tools", kind: "tool" },
  ],
  "/tools/hotel-profit-calculator": [
    { href: "/tools/revpar-calculator", kind: "tool" },
    { href: "/tools/ota-commission-calculator", kind: "tool" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/tools", kind: "tool" },
  ],
  "/tools/ota-commission-calculator": [
    { href: "/tools/hotel-profit-calculator", kind: "tool" },
    { href: "/solutions/outsourced-hotel-reservations", kind: "solution" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/insights/direct-booking-journey-audit", kind: "insight" },
    { href: "/tools", kind: "tool" },
  ],
  "/tools/hotel-vat-service-charge-calculator": [
    { href: "/tools/hotel-profit-calculator", kind: "tool" },
    { href: "/tools/revpar-calculator", kind: "tool" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/tools", kind: "tool" },
  ],
  "/tools/hotel-searchability-check": [
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on", kind: "insight" },
    { href: "/tools/hotel-review-link", kind: "tool" },
    { href: "/tools", kind: "tool" },
  ],
  "/tools/hotel-review-link": [
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
    { href: "/insights/hotel-marketing", kind: "insight" },
    { href: "/tools", kind: "tool" },
  ],
};

const SOLUTION_LINKS: Record<string, LinkRef[]> = {
  "/solutions/revenue-commercial-management": [
    { href: "/insights/hotel-revenue-meetings-that-lead-to-decisions", kind: "insight" },
    { href: "/solutions/outsourced-hotel-reservations", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/tools/revpar-calculator", kind: "tool" },
    { href: "/case-studies", kind: "page" },
  ],
  "/solutions/outsourced-hotel-reservations": [
    { href: "/insights/direct-booking-journey-audit", kind: "insight" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/tools/ota-commission-calculator", kind: "tool" },
  ],
  "/solutions/b2b-agent-sales": [
    { href: "/insights/direct-booking-journey-audit", kind: "insight" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/case-studies", kind: "page" },
  ],
  "/solutions/google-ads-management": [
    { href: "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on", kind: "insight" },
    { href: "/insights/hotel-marketing", kind: "insight" },
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
  ],
  "/solutions/meta-ads-management": [
    { href: "/insights/hotel-marketing", kind: "insight" },
    { href: "/solutions/google-ads-management", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/case-studies", kind: "page" },
  ],
  "/solutions/hotel-seo-google-maps-ai-search": [
    { href: "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on", kind: "insight" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/tools/hotel-review-link", kind: "tool" },
  ],
  "/solutions/hotel-website-design": [
    { href: "/insights/direct-booking-journey-audit", kind: "insight" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
    { href: "/solutions/hotel-systems-implementation", kind: "solution" },
  ],
  "/solutions/hotel-direct-bookings": [
    { href: "/insights/direct-booking-journey-audit", kind: "insight" },
    { href: "/solutions/hotel-website-design", kind: "solution" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
    { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
  ],
  "/solutions/independent-hotel-management": [
    { href: "/insights/hotel-revenue-meetings-that-lead-to-decisions", kind: "insight" },
    { href: "/insights/hotel-technology-adoption-commercial-project", kind: "insight" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/solutions/hotel-training-team-development", kind: "solution" },
  ],
  "/solutions/hotel-systems-implementation": [
    { href: "/insights/hotel-technology-adoption-commercial-project", kind: "insight" },
    { href: "/solutions/hotel-ai-automation", kind: "solution" },
    { href: "/solutions/hotel-direct-bookings", kind: "solution" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
  ],
  "/solutions/hotel-ai-automation": [
    { href: "/insights/hotel-technology-adoption-commercial-project", kind: "insight" },
    { href: "/solutions/hotel-systems-implementation", kind: "solution" },
    { href: "/solutions/hotel-training-team-development", kind: "solution" },
    { href: "/tools/hotel-searchability-check", kind: "tool" },
  ],
  "/solutions/hotel-training-team-development": [
    { href: "/insights/hotel-revenue-meetings-that-lead-to-decisions", kind: "insight" },
    { href: "/insights/hotel-technology-adoption-commercial-project", kind: "insight" },
    { href: "/solutions/revenue-commercial-management", kind: "solution" },
    { href: "/solutions/hotel-ai-automation", kind: "solution" },
  ],
};

const DEFAULT_LINKS: LinkRef[] = [
  { href: "/solutions", kind: "page" },
  { href: "/insights", kind: "page" },
  { href: "/case-studies", kind: "page" },
  { href: "/tools", kind: "tool" },
  { href: "/contact-us", kind: "page" },
];

const SECTION_COPY: Record<Locale, { title: string; lead: string }> = {
  th: {
    title: "หน้าและเนื้อหาที่เกี่ยวข้อง",
    lead: "ลิงก์ภายในไปยังโซลูชัน บทความ เครื่องมือ และหน้าอื่นที่เกี่ยวข้อง",
  },
  en: {
    title: "Related pages and reading",
    lead: "Internal links to related solutions, insights, tools, and site pages.",
  },
  ru: {
    title: "Связанные страницы и материалы",
    lead: "Внутренние ссылки на решения, статьи, инструменты и другие страницы.",
  },
  zh: {
    title: "相關頁面與閱讀",
    lead: "連到相關解決方案、文章、工具與其他頁面的站內連結。",
  },
};

export function internalBacklinksCopy(locale: Locale) {
  return SECTION_COPY[locale] ?? SECTION_COPY.en;
}

/**
 * Solution, insight article, and case-study detail views already render their own
 * related blocks. SiteShell skips those to avoid duplicate sections.
 */
export function usesNativeRelatedSection(route: string) {
  const bare = barePath(route);
  if (bare === "/") return true;
  if (bare.startsWith("/solutions/")) return true;
  if (bare.startsWith("/insights/")) return true;
  if (bare.startsWith("/case-studies/") && bare !== "/case-studies") return true;
  if (bare === "/privacy" || bare === "/cookies") return true;
  return false;
}

function labelFor(ref: LinkRef, locale: Locale) {
  if (ref.label?.[locale]) return ref.label[locale]!;
  if (ref.label?.en) return ref.label.en;
  if (ref.label?.th) return ref.label.th;
  if (ref.kind === "solution") return solutionNavLabel(ref.href, locale);
  if (ref.kind === "insight") {
    const post = insightByHref(ref.href);
    if (post) return post.title[locale] || post.title.en || post.title.th;
  }
  if (ref.kind === "tool" && TOOL_LABELS[ref.href]) {
    return TOOL_LABELS[ref.href][locale] || TOOL_LABELS[ref.href].en;
  }
  if (PAGE_LABELS[ref.href]) return PAGE_LABELS[ref.href][locale] || PAGE_LABELS[ref.href].en;
  const t = uiCopy(locale);
  if (ref.href === "/insights") return t.insights;
  if (ref.href === "/case-studies") return t.caseStudies;
  if (ref.href === "/approach") return t.approach;
  if (ref.href === "/about-us") return t.about;
  if (ref.href === "/contact-us") return t.contact;
  return ref.href;
}

function refsFor(bare: string): LinkRef[] {
  if (ROUTE_LINKS[bare]) return ROUTE_LINKS[bare];
  if (SOLUTION_LINKS[bare]) return SOLUTION_LINKS[bare];
  if (bare.startsWith("/insights/")) {
    const others = insightPosts
      .filter((post) => post.isPublished !== false && post.href !== bare)
      .slice(0, 3)
      .map((post) => ({ href: post.href, kind: "insight" as const }));
    return [
      ...others,
      { href: "/solutions", kind: "page" },
      { href: "/case-studies", kind: "page" },
    ];
  }
  if (bare.startsWith("/case-studies/")) {
    return [
      { href: "/case-studies", kind: "page" },
      { href: "/solutions", kind: "page" },
      { href: "/insights", kind: "page" },
      { href: "/contact-us", kind: "page" },
    ];
  }
  return DEFAULT_LINKS;
}

export function internalBacklinksFor(route: string, locale: Locale, limit = 6): InternalBacklink[] {
  const bare = barePath(route);
  const used = new Set<string>([bare]);
  const out: InternalBacklink[] = [];

  for (const ref of refsFor(bare)) {
    if (used.has(ref.href)) continue;
    const href = existingHref(ref.href, locale);
    if (!href) continue;
    used.add(ref.href);
    out.push({ href, label: labelFor(ref, locale), kind: ref.kind });
    if (out.length >= limit) break;
  }

  if (out.length < 3) {
    for (const ref of DEFAULT_LINKS) {
      if (used.has(ref.href)) continue;
      const href = existingHref(ref.href, locale);
      if (!href) continue;
      used.add(ref.href);
      out.push({ href, label: labelFor(ref, locale), kind: ref.kind });
      if (out.length >= limit) break;
    }
  }

  return out;
}
