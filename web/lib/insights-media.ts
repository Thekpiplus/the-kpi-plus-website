import { existsSync } from "fs";
import { join } from "path";
import type { InsightPost, InsightSource } from "@/lib/insights";
import type { Locale } from "@/lib/seo";

export type InsightImageFit = "cover" | "contain";
export type InsightImageStatus = "real" | "approved" | "sample" | "placeholder";
export type InsightMediaVariant = "featured" | "card" | "guide";

export type InsightMediaSlot = {
  id: string;
  slug?: string;
  /** Reserved production path. Do not request this URL until the file exists on disk. */
  reservedSrc: string;
  sourceWidth: number;
  sourceHeight: number;
  displayWidth: number;
  displayHeight: number;
  ratio: string;
  fit: InsightImageFit;
  label: Record<"th" | "en", string>;
  defaultAlt: Record<"th" | "en", string>;
  todo: string;
};

export type InsightImageMeta = {
  imageFit: InsightImageFit;
  imageStatus: InsightImageStatus;
  authorRole?: string;
  sources?: InsightSource[];
  relatedArticleIds?: string[];
  isFeatured?: boolean;
};

/** Hashed photos reused on other pages — not unique Insights covers. */
const REUSED_SITE_MEDIA = new Set([
  "/media/the-kpi-plus-revenue-scene_4932d3c7.jpg",
  "/media/the-kpi-plus-performance-hero_2f986b5f.jpg",
  "/media/kpi-grow-capability_7bba9d6e.jpg",
  "/media/kpi-grow-revenue_f786a5a5.jpg",
  "/media/the-kpi-plus-insights-scene_8a7e72cb.jpg",
  "/media/hotel-website-hero-laptop.jpg",
  "/media/kpi-plus-hotel-revenue-tablet_16ce8ace.jpg",
  "/media/kpi-plus-performance-metrics-meeting_88bfa3ed.jpg",
  "/media/b2b-hero-meeting.jpg",
  "/media/revenue-hero-desk.jpg",
  "/media/sample-revenue-report.webp",
  "/media/sample-marketing-report.webp",
  "/media/sample-ota-report.webp",
]);

export const INSIGHT_MEDIA_SLOTS = {
  "featured-revenue-meeting": {
    id: "featured-revenue-meeting",
    slug: "hotel-revenue-meetings-that-lead-to-decisions",
    reservedSrc: "/images/insights-featured-revenue-meeting-placeholder.webp",
    sourceWidth: 1600,
    sourceHeight: 900,
    displayWidth: 620,
    displayHeight: 350,
    ratio: "16:9",
    fit: "cover",
    label: {
      th: "กรอบการประชุมรายได้โรงแรม",
      en: "Hotel revenue meeting frame",
    },
    defaultAlt: {
      th: "ตัวอย่างภาพกรอบการประชุมรายได้โรงแรม ไม่ใช่ภาพผลงานลูกค้า",
      en: "Sample visual of a hotel revenue-meeting frame, not a client result",
    },
    // TODO: Replace with a unique 1600×900 approved revenue-meeting photo, team reviewing a revenue report, or a redacted Demand Calendar / Revenue Review / Booking Pace screenshot. No tablet reuse, no stock hotel rooms, no AI people, no invented metrics.
    todo: "Replace /images/insights-featured-revenue-meeting-placeholder.webp with a unique 1600×900 approved visual before production.",
  },
  "hotel-marketing": {
    id: "hotel-marketing",
    slug: "hotel-marketing",
    reservedSrc: "/images/insights-hotel-marketing-placeholder.webp",
    sourceWidth: 1200,
    sourceHeight: 675,
    displayWidth: 380,
    displayHeight: 214,
    ratio: "16:9",
    fit: "contain",
    label: {
      th: "เส้นทางแคมเปญ Hotel Marketing",
      en: "Hotel marketing campaign funnel",
    },
    defaultAlt: {
      th: "ตัวอย่างเส้นทางแคมเปญ Hotel Marketing จาก Visibility ถึง Booking ไม่ใช่ภาพผลงานลูกค้า",
      en: "Sample hotel marketing campaign funnel from visibility to booking, not a client result",
    },
    // TODO: Replace /images/insights-hotel-marketing-placeholder.webp with a unique 1200×675 campaign performance report, direct-booking funnel, content planning board, hotel website conversion view, or team planning a hotel marketing strategy. Redact client names, account IDs, emails, and confidential metrics. No Google/Meta/OTA logos without permission. No generic hotel room or exterior unless it has a clear marketing context.
    todo: "Replace /images/insights-hotel-marketing-placeholder.webp with a unique 1200×675 approved campaign / funnel visual before production.",
  },
  "direct-booking": {
    id: "direct-booking",
    slug: "direct-booking-journey-audit",
    reservedSrc: "/images/insights-direct-booking-placeholder.webp",
    sourceWidth: 1200,
    sourceHeight: 675,
    displayWidth: 380,
    displayHeight: 214,
    ratio: "16:9",
    fit: "contain",
    label: {
      th: "เส้นทาง Direct Booking",
      en: "Direct booking funnel",
    },
    defaultAlt: {
      th: "ตัวอย่างเส้นทาง Direct Booking จาก Search ถึง Website และ Booking ไม่ใช่ภาพผลงานลูกค้า",
      en: "Sample Direct Booking funnel from search to website and booking, not a client result",
    },
    // TODO: Replace /images/insights-direct-booking-placeholder.webp with a unique 1200×675 website booking engine, traffic-to-booking funnel, Search → Website → Booking flow, conversion report, or hotel manager reviewing website performance. Redact booking IDs, guest names, emails, payment details, and private analytics. No generic laptop photo without booking context.
    todo: "Replace /images/insights-direct-booking-placeholder.webp with a unique 1200×675 approved Direct Booking funnel visual before production.",
  },
  "hotel-ai-workflow": {
    id: "hotel-ai-workflow",
    slug: "hotel-technology-adoption-commercial-project",
    reservedSrc: "/images/insights-hotel-ai-workflow-placeholder.webp",
    sourceWidth: 1200,
    sourceHeight: 675,
    displayWidth: 380,
    displayHeight: 214,
    ratio: "16:9",
    fit: "contain",
    label: {
      th: "เวิร์กโฟลว์ AI ของโรงแรม",
      en: "Hotel AI workflow",
    },
    defaultAlt: {
      th: "ตัวอย่างเวิร์กโฟลว์ AI ของโรงแรมจากข้อมูลสู่การทบทวนและการตัดสินใจของทีม ไม่ใช่ภาพผลงานลูกค้า",
      en: "Sample hotel AI workflow from input to human review and a business decision, not a client result",
    },
    // TODO: Replace /images/insights-hotel-ai-workflow-placeholder.webp with a unique 1200×675 approved visual of a person reviewing an AI-assisted hotel analysis, a redacted AI report, hotel staff using a data tool, or this Input → AI → Human review → Decision workflow. No robots, circuit-heads, holographic cities, neon brains, futuristic blue/purple UIs, or glowing networks.
    todo: "Replace /images/insights-hotel-ai-workflow-placeholder.webp with a unique 1200×675 approved AI workflow visual before production.",
  },
  "seo-sem": {
    id: "seo-sem",
    slug: "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    reservedSrc: "/images/insights-seo-sem-placeholder.webp",
    sourceWidth: 1200,
    sourceHeight: 675,
    displayWidth: 380,
    displayHeight: 214,
    ratio: "16:9",
    fit: "contain",
    label: {
      th: "เปรียบเทียบ SEO และ SEM",
      en: "SEO versus SEM comparison",
    },
    defaultAlt: {
      th: "ตัวอย่างเปรียบเทียบ Organic Search และ Paid Search สำหรับ SEO และ SEM ไม่ใช่ภาพผลงานลูกค้า",
      en: "Sample comparison of organic search and paid search for hotel SEO versus SEM, not a client result",
    },
    // TODO: Replace /images/insights-seo-sem-placeholder.webp with a unique 1200×675 Organic vs Paid Search comparison, search funnel, website traffic report, conversion-by-channel view, or a redacted search performance screenshot. No Google branding or search-result screenshots unless usage and data are approved. Do not invent traffic or conversion numbers. Do not use a hotel exterior as the only cover.
    todo: "Replace /images/insights-seo-sem-placeholder.webp with a unique 1200×675 approved search performance visual before production.",
  },
  "download-guide": {
    id: "download-guide",
    reservedSrc: "/images/insights-download-guide-placeholder.webp",
    sourceWidth: 800,
    sourceHeight: 600,
    displayWidth: 240,
    displayHeight: 180,
    ratio: "4:3",
    fit: "contain",
    label: { th: "ภาพคู่มือดาวน์โหลด (ถ้ามี)", en: "Optional download guide" },
    defaultAlt: {
      th: "ตัวอย่างภาพปกคู่มือสำหรับดาวน์โหลด",
      en: "Sample visual for an optional download guide",
    },
    // TODO: Replace with a unique 800×600 report cover or screenshot if a real guide is published. Do not invent a PDF.
    todo: "Replace /images/insights-download-guide-placeholder.webp with a unique 800×600 approved visual before production, only if a real guide exists.",
  },
} as const satisfies Record<string, InsightMediaSlot>;

/** Shared empty card slot. CMS covers replace via `coverImage`; do not reuse a hotel-marketing visual. */
export const GENERIC_CARD_SLOT: InsightMediaSlot = {
  id: "generic-card",
  reservedSrc: "",
  sourceWidth: 1200,
  sourceHeight: 675,
  displayWidth: 380,
  displayHeight: 214,
  ratio: "16:9",
  fit: "cover",
  label: {
    th: "ภาพประกอบบทความ",
    en: "Article cover",
  },
  defaultAlt: {
    th: "ภาพประกอบบทความ",
    en: "Article illustration",
  },
  todo: "Add a unique 1200×675 approved cover for this article before production.",
};

export type InsightMediaSlotId = keyof typeof INSIGHT_MEDIA_SLOTS;

const SLOT_BY_SLUG = new Map<string, InsightMediaSlot>(
  Object.values(INSIGHT_MEDIA_SLOTS).flatMap((slot) =>
    "slug" in slot && slot.slug ? [[slot.slug, slot as InsightMediaSlot]] : [],
  ),
);

export function insightSlotForSlug(slug: string) {
  return SLOT_BY_SLUG.get(slug) ?? null;
}

export function insightCoverAlt(
  post: Pick<InsightPost, "slug" | "coverImageAlt">,
  locale: Locale,
) {
  const slot = insightSlotForSlug(post.slug) ?? GENERIC_CARD_SLOT;
  const stored = post.coverImageAlt?.trim() ?? "";
  if (locale === "th") return stored || slot.defaultAlt.th;
  if (stored && !/[\u0E00-\u0E7F]/.test(stored)) return stored;
  return slot.defaultAlt.en || stored;
}

export function insightSlotById(id: string) {
  return INSIGHT_MEDIA_SLOTS[id as InsightMediaSlotId] ?? null;
}

export function isInsightImageFit(value: string | undefined): value is InsightImageFit {
  return value === "cover" || value === "contain";
}

export function isInsightImageStatus(value: string | undefined): value is InsightImageStatus {
  return value === "real" || value === "approved" || value === "sample" || value === "placeholder";
}

function parseInsightSources(raw: unknown): InsightSource[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const sources = raw.flatMap((item) => {
    if (typeof item === "string") {
      const [label, url] = item.split("|").map((part) => part.trim());
      return label ? [{ label, url: url || undefined }] : [];
    }
    if (item && typeof item === "object" && "label" in item) {
      const label = String((item as InsightSource).label ?? "").trim();
      const url = String((item as InsightSource).url ?? "").trim();
      return label ? [{ label, url: url || undefined }] : [];
    }
    return [];
  });
  return sources.length ? sources : undefined;
}

function parseRelatedIds(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const ids = raw.map((item) => String(item).trim()).filter(Boolean);
  return ids.length ? ids : undefined;
}

export function parseInsightImageMeta(raw: string | undefined | null): InsightImageMeta {
  try {
    const parsed = JSON.parse(raw || "") as Partial<InsightImageMeta>;
    const authorRole = parsed.authorRole?.trim();
    return {
      imageFit: isInsightImageFit(parsed.imageFit) ? parsed.imageFit : "cover",
      imageStatus: isInsightImageStatus(parsed.imageStatus) ? parsed.imageStatus : "placeholder",
      authorRole: authorRole || undefined,
      sources: parseInsightSources(parsed.sources),
      relatedArticleIds: parseRelatedIds(parsed.relatedArticleIds),
      isFeatured: parsed.isFeatured === true ? true : undefined,
    };
  } catch {
    return { imageFit: "cover", imageStatus: "placeholder" };
  }
}

export function serializeInsightImageMeta(meta: InsightImageMeta) {
  return JSON.stringify({
    imageFit: isInsightImageFit(meta.imageFit) ? meta.imageFit : "cover",
    imageStatus: isInsightImageStatus(meta.imageStatus) ? meta.imageStatus : "placeholder",
    ...(meta.authorRole?.trim() ? { authorRole: meta.authorRole.trim() } : {}),
    ...(meta.sources?.length ? { sources: meta.sources } : {}),
    ...(meta.relatedArticleIds?.length ? { relatedArticleIds: meta.relatedArticleIds } : {}),
    ...(meta.isFeatured ? { isFeatured: true } : {}),
  });
}

export function existingPublicSrc(src: string | undefined | null) {
  const next = src?.trim() ?? "";
  if (!next) return "";
  if (/^https?:\/\//i.test(next)) return next;
  if (REUSED_SITE_MEDIA.has(next)) return "";
  const relative = next.replace(/^\//, "");
  try {
    const disk = join(process.cwd(), "public", relative);
    if (!existsSync(disk)) return "";
  } catch {
    return "";
  }
  return next.startsWith("/") ? next : `/${next}`;
}

export function insightShowsSampleLabel(status: InsightImageStatus, hasAsset: boolean) {
  if (!hasAsset) return true;
  return status === "sample" || status === "placeholder";
}

export function insightSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างภาพประกอบ" : "Sample Visual";
}

export function displaySizeForVariant(slot: InsightMediaSlot, variant: InsightMediaVariant) {
  if (variant === "featured") return { width: 620, height: 350 };
  if (variant === "guide") return { width: slot.displayWidth, height: slot.displayHeight };
  return { width: 380, height: 214 };
}

export function resolveInsightMedia(
  post: Pick<
    InsightPost,
    "slug" | "coverImage" | "coverImageAlt" | "coverImageFit" | "coverImageStatus" | "sampleVisual"
  >,
  variant: InsightMediaVariant = "card",
) {
  const slot = insightSlotForSlug(post.slug) ?? GENERIC_CARD_SLOT;
  const display = displaySizeForVariant(slot, variant);
  const status: InsightImageStatus = post.coverImageStatus ?? (post.sampleVisual ? "placeholder" : "placeholder");
  const src = existingPublicSrc(post.coverImage) || existingPublicSrc(slot.reservedSrc);
  return {
    slot,
    src,
    alt: post.coverImageAlt?.trim() || slot.defaultAlt.th,
    fit: post.coverImageFit ?? slot.fit,
    status,
    displayWidth: display.width,
    displayHeight: display.height,
    sourceWidth: slot.sourceWidth,
    sourceHeight: slot.sourceHeight,
    hasAsset: Boolean(src),
    showSampleLabel: insightShowsSampleLabel(status, Boolean(src)),
  };
}
