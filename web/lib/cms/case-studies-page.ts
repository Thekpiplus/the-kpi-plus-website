import { CASE_STUDIES_HERO_VISUAL } from "@/lib/case-studies-media";
import type { Locale } from "@/lib/seo";

export const CASE_STUDIES_CMS_TEMPLATE = "case-studies-page";
export const CASE_STUDIES_PAGE_SLUG = "case-studies";
export const CASE_STUDIES_PAGE_ROUTE = "/case-studies";
export const CASE_STUDIES_CMS_INTENTS = ["save", "draft", "publish", "unpublish"] as const;
export type CaseStudiesCmsIntent = (typeof CASE_STUDIES_CMS_INTENTS)[number];
export type CaseStudiesCmsSaveResult =
  | { ok: true; id: string; intent: CaseStudiesCmsIntent }
  | { ok: false; error: string };

export type CaseStudiesLocalized = { th: string; en: string; ru: string; zh: string };

export type CmsCaseStudiesPage = {
  version: 1;
  template: typeof CASE_STUDIES_CMS_TEMPLATE;
  hero: {
    pageTitle: CaseStudiesLocalized;
    eyebrow: CaseStudiesLocalized;
    headlineLead: CaseStudiesLocalized;
    headlineRest: CaseStudiesLocalized;
    headlineAccent: CaseStudiesLocalized;
    description: CaseStudiesLocalized;
    viewGrid: CaseStudiesLocalized;
    viewStudy: CaseStudiesLocalized;
    primaryCta: CaseStudiesLocalized;
  };
  partners: {
    clientsEyebrow: CaseStudiesLocalized;
    clientsLabel: CaseStudiesLocalized;
  };
  overview: {
    title: CaseStudiesLocalized;
  };
  grid: {
    eyebrow: CaseStudiesLocalized;
    title: CaseStudiesLocalized;
  };
  closer: {
    eyebrow: CaseStudiesLocalized;
    title: CaseStudiesLocalized;
    body: CaseStudiesLocalized;
    primaryCta: CaseStudiesLocalized;
    secondaryCta: CaseStudiesLocalized;
  };
  media: {
    heroImage: string;
    heroAlt: CaseStudiesLocalized;
  };
};

export type CaseStudiesPageCopy = {
  pageTitle: string;
  heroEyebrow: string;
  heroHeadlineLead: string;
  heroHeadlineRest: string;
  heroHeadlineAccent: string;
  heroDescription: string;
  viewGrid: string;
  viewStudy: string;
  primaryCta: string;
  clientsEyebrow: string;
  clientsLabelLines: string[];
  overviewTitle: string;
  gridEyebrow: string;
  gridTitleLines: string[];
  closerEyebrow: string;
  closerTitleLines: string[];
  closerBody: string;
  closerPrimaryCta: string;
  secondaryCta: string;
  heroImage: string;
  heroAlt: string;
};

export type CaseStudiesEditorState = {
  documentId: string;
  title: string;
  status: string;
  seoTitle: string;
  metaDescription: string;
  content: CmsCaseStudiesPage;
};

export function emptyCaseStudiesLocalized(seed = ""): CaseStudiesLocalized {
  return { th: seed, en: seed, ru: seed, zh: seed };
}

function loc(th: string, en: string, ru = en, zh = en): CaseStudiesLocalized {
  return { th, en, ru, zh };
}

export function pickCaseStudiesLocalized(value: CaseStudiesLocalized | undefined, locale: Locale): string {
  if (!value) return "";
  const direct = value[locale]?.trim();
  if (direct) return direct;
  if (locale === "th") return value.th?.trim() || value.en?.trim() || "";
  return value.en?.trim() || value.th?.trim() || "";
}

function linesFrom(value: string) {
  const parts = value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length ? parts : [value.trim()].filter(Boolean);
}

export function defaultCaseStudiesCms(): CmsCaseStudiesPage {
  /** Soft break between Thai phrases for body copy. */
  const br = "\u200B";
  return {
    version: 1,
    template: CASE_STUDIES_CMS_TEMPLATE,
    hero: {
      pageTitle: loc("ผลงานลูกค้า", "Case Studies", "Кейсы", "客戶案例"),
      eyebrow: loc("ผลลัพธ์โรงแรมจริง", "Real Hotel Performance"),
      headlineLead: loc("วัดผลจากรายได้", "Results measured in revenue,"),
      headlineRest: loc("ไม่ใช่ตัวเลขที่ดูดี", "not vanity metrics."),
      headlineAccent: loc("แต่ไม่สร้างผล", ""),
      description: loc(
        "ตั้งแต่การบริหารราคาและช่องทางการขาย ไปจนถึงแคมเปญจองตรง เราโฟกัสผลลัพธ์เชิงพาณิชย์ที่วัดได้ — Room Revenue, ADR, Occupancy, RevPAR และ ROAS",
        "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial results — Room Revenue, ADR, Occupancy, RevPAR and ROAS.",
      ),
      viewGrid: loc("ดูผลงาน", "View Case Studies", "View Case Studies", "View Case Studies"),
      viewStudy: loc("ดูรายละเอียดผลงาน", "View Case Study"),
      primaryCta: loc(
        "ประเมิน Performance โรงแรม",
        "Request a Hotel Performance Review",
        "Запросить аудит Performance отеля",
        "申請飯店 Performance 分析",
      ),
    },
    partners: {
      clientsEyebrow: loc("โรงแรมและที่พักที่คัดสรร", "Selected Hotels & Properties"),
      clientsLabel: loc(
        "โรงแรมและที่พักที่เคยร่วมงานกับเรา",
        "Selected hotels and properties we've worked with",
      ),
    },
    overview: {
      title: loc("Results Overview", "Results Overview"),
    },
    grid: {
      eyebrow: loc("ผลงาน", "Case Studies"),
      title: loc("ผลลัพธ์เชิงพาณิชย์ที่วัดได้", "Measurable commercial results"),
    },
    closer: {
      eyebrow: loc("ทบทวน Performance", "Hotel Performance Review"),
      title: loc(
        `โรงแรมของคุณ${br}อาจพลาดรายได้ตรงไหนอยู่?`,
        "Where Could Your Hotel Be Leaving Revenue on the Table?",
      ),
      body: loc(
        `เราทบทวนราคา Distribution Booking Pace${br} และผลการดำเนินงานเชิงพาณิชย์${br} เพื่อหาจุดที่มีโอกาสสร้างรายได้เพิ่ม`,
        "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
      ),
      primaryCta: loc(
        "ประเมิน Performance โรงแรม",
        "Request a Hotel Performance Review",
        "Запросить аудит Performance отеля",
        "申請飯店 Performance 分析",
      ),
      secondaryCta: loc(
        "คุยกับทีม เดอะ เคพีไอ พลัส",
        "Talk to Our Team",
        "Поговорить с командой The KPI Plus",
        "與 The KPI Plus 團隊談談",
      ),
    },
    media: {
      heroImage: CASE_STUDIES_HERO_VISUAL.approvedSrc || "",
      heroAlt: loc(
        CASE_STUDIES_HERO_VISUAL.approvedAltTh,
        CASE_STUDIES_HERO_VISUAL.approvedAlt,
      ),
    },
  };
}

export function localizeCaseStudiesPage(content: CmsCaseStudiesPage, locale: Locale): CaseStudiesPageCopy {
  return {
    pageTitle: pickCaseStudiesLocalized(content.hero.pageTitle, locale),
    heroEyebrow: pickCaseStudiesLocalized(content.hero.eyebrow, locale),
    heroHeadlineLead: pickCaseStudiesLocalized(content.hero.headlineLead, locale),
    heroHeadlineRest: pickCaseStudiesLocalized(content.hero.headlineRest, locale),
    heroHeadlineAccent: pickCaseStudiesLocalized(content.hero.headlineAccent, locale),
    heroDescription: pickCaseStudiesLocalized(content.hero.description, locale),
    viewGrid: pickCaseStudiesLocalized(content.hero.viewGrid, locale),
    viewStudy: pickCaseStudiesLocalized(content.hero.viewStudy, locale),
    primaryCta: pickCaseStudiesLocalized(content.hero.primaryCta, locale),
    clientsEyebrow: pickCaseStudiesLocalized(content.partners.clientsEyebrow, locale),
    clientsLabelLines: linesFrom(pickCaseStudiesLocalized(content.partners.clientsLabel, locale)),
    overviewTitle: pickCaseStudiesLocalized(content.overview.title, locale),
    gridEyebrow: pickCaseStudiesLocalized(content.grid.eyebrow, locale),
    gridTitleLines: linesFrom(pickCaseStudiesLocalized(content.grid.title, locale)),
    closerEyebrow: pickCaseStudiesLocalized(content.closer.eyebrow, locale),
    closerTitleLines: linesFrom(pickCaseStudiesLocalized(content.closer.title, locale)),
    closerBody: pickCaseStudiesLocalized(content.closer.body, locale),
    closerPrimaryCta: pickCaseStudiesLocalized(content.closer.primaryCta, locale),
    secondaryCta: pickCaseStudiesLocalized(content.closer.secondaryCta, locale),
    heroImage: content.media.heroImage?.trim() || "",
    heroAlt: pickCaseStudiesLocalized(content.media.heroAlt, locale),
  };
}

function asLocalized(value: unknown, fallback: CaseStudiesLocalized): CaseStudiesLocalized {
  if (!value || typeof value !== "object") return fallback;
  const row = value as Partial<CaseStudiesLocalized>;
  return {
    th: typeof row.th === "string" ? row.th : fallback.th,
    en: typeof row.en === "string" ? row.en : fallback.en,
    ru: typeof row.ru === "string" ? row.ru : fallback.ru,
    zh: typeof row.zh === "string" ? row.zh : fallback.zh,
  };
}

export function isCaseStudiesCmsBody(raw: string) {
  try {
    const parsed = JSON.parse(raw) as { template?: string; version?: number };
    return parsed?.template === CASE_STUDIES_CMS_TEMPLATE && parsed?.version === 1;
  } catch {
    return false;
  }
}

export function parseCaseStudiesPageBody(raw: string): CmsCaseStudiesPage | null {
  try {
    const parsed = JSON.parse(raw) as Partial<CmsCaseStudiesPage>;
    if (parsed.template !== CASE_STUDIES_CMS_TEMPLATE || parsed.version !== 1) return null;
    const fallback = defaultCaseStudiesCms();
    return {
      version: 1,
      template: CASE_STUDIES_CMS_TEMPLATE,
      hero: {
        pageTitle: asLocalized(parsed.hero?.pageTitle, fallback.hero.pageTitle),
        eyebrow: asLocalized(parsed.hero?.eyebrow, fallback.hero.eyebrow),
        headlineLead: asLocalized(parsed.hero?.headlineLead, fallback.hero.headlineLead),
        headlineRest: asLocalized(parsed.hero?.headlineRest, fallback.hero.headlineRest),
        headlineAccent: asLocalized(parsed.hero?.headlineAccent, fallback.hero.headlineAccent),
        description: asLocalized(parsed.hero?.description, fallback.hero.description),
        viewGrid: asLocalized(parsed.hero?.viewGrid, fallback.hero.viewGrid),
        viewStudy: asLocalized(parsed.hero?.viewStudy, fallback.hero.viewStudy),
        primaryCta: asLocalized(parsed.hero?.primaryCta, fallback.hero.primaryCta),
      },
      partners: {
        clientsEyebrow: asLocalized(parsed.partners?.clientsEyebrow, fallback.partners.clientsEyebrow),
        clientsLabel: asLocalized(parsed.partners?.clientsLabel, fallback.partners.clientsLabel),
      },
      overview: {
        title: asLocalized(parsed.overview?.title, fallback.overview.title),
      },
      grid: {
        eyebrow: asLocalized(parsed.grid?.eyebrow, fallback.grid.eyebrow),
        title: asLocalized(parsed.grid?.title, fallback.grid.title),
      },
      closer: {
        eyebrow: asLocalized(parsed.closer?.eyebrow, fallback.closer.eyebrow),
        title: asLocalized(parsed.closer?.title, fallback.closer.title),
        body: asLocalized(parsed.closer?.body, fallback.closer.body),
        primaryCta: asLocalized(parsed.closer?.primaryCta, fallback.closer.primaryCta),
        secondaryCta: asLocalized(parsed.closer?.secondaryCta, fallback.closer.secondaryCta),
      },
      media: {
        heroImage:
          typeof parsed.media?.heroImage === "string" ? parsed.media.heroImage : fallback.media.heroImage,
        heroAlt: asLocalized(parsed.media?.heroAlt, fallback.media.heroAlt),
      },
    };
  } catch {
    return null;
  }
}

export function serializeCaseStudiesPageBody(content: CmsCaseStudiesPage): string {
  return JSON.stringify(content);
}

export function isCaseStudiesPageDocument(doc: { template?: string; slug?: string } | null | undefined) {
  if (!doc) return false;
  return doc.template === CASE_STUDIES_CMS_TEMPLATE || doc.slug === CASE_STUDIES_PAGE_SLUG;
}
