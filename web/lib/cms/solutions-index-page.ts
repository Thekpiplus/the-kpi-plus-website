import { solutionNavLabel, visibleSolutionGroups } from "@/lib/nav";
import { solutionsIndexCopy } from "@/lib/localized-ui";
import { auditHref, barePath, localizePath, pages, type Locale } from "@/lib/seo";
import { SOLUTIONS_INDEX_FAQS } from "@/lib/solutions-faqs";
import { SOLUTION_CHALLENGES } from "@/lib/solutions-challenges";
import { SOLUTIONS_PROCESS_STEPS } from "@/lib/solutions-proof";
import { SOLUTIONS_CONNECT_CHAINS, standardizeServiceCard } from "@/lib/solutions-service-cards";

export const SOLUTIONS_INDEX_CMS_TEMPLATE = "solutions-index";
export const SOLUTIONS_INDEX_PAGE_SLUG = "solutions";
export const SOLUTIONS_INDEX_PAGE_ROUTE = "/solutions";
export const SOLUTIONS_INDEX_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type SolutionsIndexCmsIntent = (typeof SOLUTIONS_INDEX_CMS_INTENTS)[number];

export const SOLUTIONS_INDEX_VISUAL_STATUSES = [
  { id: "replace", label: "Replace" },
  { id: "sample", label: "Sample" },
  { id: "approved", label: "Approved" },
] as const;
export type SolutionsIndexVisualStatus = (typeof SOLUTIONS_INDEX_VISUAL_STATUSES)[number]["id"];

export const SOLUTIONS_INDEX_REVIEW_STATUSES = [
  { id: "sample", label: "Sample" },
  { id: "verified", label: "Verified" },
  { id: "review", label: "Requires Review" },
] as const;
export type SolutionsIndexReviewStatus = (typeof SOLUTIONS_INDEX_REVIEW_STATUSES)[number]["id"];

export const SOLUTIONS_INDEX_HERO_PLACEHOLDER = "/images/hotel-solutions-hero-placeholder.webp";
export const SOLUTIONS_INDEX_CTA_PLACEHOLDER = "/images/hotel-solutions-consultation-process-placeholder.webp";

export function newSolutionsIndexItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function solutionsIndexIsLibraryPlaceholder(src?: string) {
  const next = src?.trim() || "";
  return !next || /placeholder/i.test(next);
}

/* ------------------------------------------------------------------ types */

export type CmsSolutionsIndexCta = { label: string; href: string };
export type CmsSolutionsIndexLine = { id: string; th: string; en: string };
export type CmsSolutionsIndexVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: string;
  label: string;
  caption: string;
  source: string;
  approvalNote: string;
  publicationApproved: boolean;
};
export type CmsSolutionsIndexChallengeMatch = { id: string; href: string; reasonTh: string; reasonEn: string };
export type CmsSolutionsIndexChallenge = {
  id: string;
  labelTh: string;
  labelEn: string;
  matches: CmsSolutionsIndexChallengeMatch[];
};
export type CmsSolutionsIndexCategory = { id: string; titleTh: string; titleEn: string; bodyTh: string; bodyEn: string };
export type CmsSolutionsIndexCard = {
  id: string;
  groupId: string;
  href: string;
  visible: boolean;
  nameTh: string;
  nameEn: string;
  problemTh: string;
  problemEn: string;
  suitableTh: string;
  suitableEn: string;
  deliverableTh: string;
  deliverableEn: string;
  icon: CmsSolutionsIndexVisual;
};
export type CmsSolutionsIndexChain = { id: string; groupId: string; steps: CmsSolutionsIndexLine[] };
export type CmsSolutionsIndexProofItem = {
  id: string;
  identityTh: string;
  identityEn: string;
  challengeTh: string;
  challengeEn: string;
  scopeTh: string;
  scopeEn: string;
  metricTh: string;
  metricEn: string;
  definitionTh: string;
  definitionEn: string;
  periodTh: string;
  periodEn: string;
  sourceTh: string;
  sourceEn: string;
  reviewedAt: string;
  reviewStatus: string;
  publicationApproved: boolean;
};
export type CmsSolutionsIndexProcessStep = { id: string; titleTh: string; titleEn: string; bodyTh: string; bodyEn: string };
export type CmsSolutionsIndexFaq = { id: string; qTh: string; qEn: string; aTh: string; aEn: string };

export type CmsSolutionsIndexPage = {
  version: 1;
  template: typeof SOLUTIONS_INDEX_CMS_TEMPLATE;
  bilingualPublish: boolean;
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    supportLine: string;
    primaryCta: CmsSolutionsIndexCta;
    secondaryCta: CmsSolutionsIndexCta;
    flow: CmsSolutionsIndexLine[];
    visual: CmsSolutionsIndexVisual;
  };
  finder: {
    eyebrow: string;
    title: string;
    startNote: string;
    challengeLegend: string;
    emptyTitle: string;
    emptyBody: string;
    resultTitle: string;
    resultLead: string;
    clearSelection: string;
    relatedWhy: string;
    details: string;
    browseAll: string;
    unsureHint: string;
    unsureCta: string;
    challenges: CmsSolutionsIndexChallenge[];
  };
  categories: { title: string; items: CmsSolutionsIndexCategory[] };
  cards: { suitableForLabel: string; deliverableLabel: string; viewDetails: string; items: CmsSolutionsIndexCard[] };
  relationships: { title: string; note: string; chains: CmsSolutionsIndexChain[] };
  proof: { title: string; lead: string; noProofNote: string; items: CmsSolutionsIndexProofItem[] };
  cta: {
    title: string;
    body: string;
    helps: CmsSolutionsIndexLine[];
    primaryCta: CmsSolutionsIndexCta;
    secondaryCta: CmsSolutionsIndexCta;
    visual: CmsSolutionsIndexVisual;
  };
  process: { eyebrow: string; title: string; lead: string; steps: CmsSolutionsIndexProcessStep[] };
  faqs: CmsSolutionsIndexFaq[];
  seo: {
    canonical: string;
    social: CmsSolutionsIndexVisual;
    variants: Array<{ locale: string; title: string; description: string; canonical: string }>;
  };
  approvals: { proof: boolean; visuals: boolean; evidenceNote: string };
};

export type SolutionsIndexEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsSolutionsIndexPage;
};
export type SolutionsIndexCmsSaveResult = { ok: true; id: string; intent: SolutionsIndexCmsIntent } | { ok: false; error: string };

/* ----------------------------------------------------------------- blanks */

export function emptySolutionsIndexVisual(): CmsSolutionsIndexVisual {
  return { src: "", altTh: "", altEn: "", status: "replace", label: "", caption: "", source: "", approvalNote: "", publicationApproved: false };
}

export function blankSolutionsIndexLine(prefix = "line"): CmsSolutionsIndexLine {
  return { id: newSolutionsIndexItemId(prefix), th: "", en: "" };
}

export function blankSolutionsIndexChallengeMatch(): CmsSolutionsIndexChallengeMatch {
  return { id: newSolutionsIndexItemId("match"), href: "", reasonTh: "", reasonEn: "" };
}

export function blankSolutionsIndexChallenge(): CmsSolutionsIndexChallenge {
  return { id: newSolutionsIndexItemId("challenge"), labelTh: "", labelEn: "", matches: [blankSolutionsIndexChallengeMatch()] };
}

export function blankSolutionsIndexCategory(): CmsSolutionsIndexCategory {
  return { id: newSolutionsIndexItemId("group"), titleTh: "", titleEn: "", bodyTh: "", bodyEn: "" };
}

export function blankSolutionsIndexCard(groupId = ""): CmsSolutionsIndexCard {
  return {
    id: newSolutionsIndexItemId("card"),
    groupId,
    href: "",
    visible: true,
    nameTh: "",
    nameEn: "",
    problemTh: "",
    problemEn: "",
    suitableTh: "",
    suitableEn: "",
    deliverableTh: "",
    deliverableEn: "",
    icon: emptySolutionsIndexVisual(),
  };
}

export function blankSolutionsIndexChain(groupId = ""): CmsSolutionsIndexChain {
  return { id: newSolutionsIndexItemId("chain"), groupId, steps: [blankSolutionsIndexLine("step")] };
}

export function blankSolutionsIndexProofItem(): CmsSolutionsIndexProofItem {
  return {
    id: newSolutionsIndexItemId("proof"),
    identityTh: "",
    identityEn: "",
    challengeTh: "",
    challengeEn: "",
    scopeTh: "",
    scopeEn: "",
    metricTh: "",
    metricEn: "",
    definitionTh: "",
    definitionEn: "",
    periodTh: "",
    periodEn: "",
    sourceTh: "",
    sourceEn: "",
    reviewedAt: "",
    reviewStatus: "sample",
    publicationApproved: false,
  };
}

export function blankSolutionsIndexProcessStep(): CmsSolutionsIndexProcessStep {
  return { id: newSolutionsIndexItemId("step"), titleTh: "", titleEn: "", bodyTh: "", bodyEn: "" };
}

export function blankSolutionsIndexFaq(): CmsSolutionsIndexFaq {
  return { id: newSolutionsIndexItemId("faq"), qTh: "", qEn: "", aTh: "", aEn: "" };
}

/* ------------------------------------------------------------------- seed */

const HERO_FLOW = [
  { id: "revenue", en: "Revenue & Sales", th: "รายได้และการขาย" },
  { id: "marketing", en: "Marketing & Booking", th: "การตลาดและการจอง" },
  { id: "website", en: "Hotel Website / Booking", th: "เว็บไซต์ / การจอง" },
  { id: "systems", en: "Systems & Data", th: "ระบบและข้อมูล" },
  { id: "team", en: "Team & Operations", th: "ทีมและการดำเนินงาน" },
  { id: "review", en: "Measured Review", th: "ทบทวนและวัดผล" },
] as const;

function cardIdFromHref(href: string) {
  return barePath(href).split("/").filter(Boolean).pop() || newSolutionsIndexItemId("card");
}

function seedCategories(): CmsSolutionsIndexCategory[] {
  const th = visibleSolutionGroups("th");
  const en = visibleSolutionGroups("en");
  const copyTh = solutionsIndexCopy.th;
  const copyEn = solutionsIndexCopy.en;
  const ids = [...th.map((group) => group.id), ...en.map((group) => group.id).filter((id) => !th.some((group) => group.id === id))];
  return ids.map((id, index) => {
    const groupTh = th.find((group) => group.id === id);
    const groupEn = en.find((group) => group.id === id);
    return {
      id,
      titleTh: copyTh.groups[index]?.title ?? groupTh?.title ?? "",
      titleEn: copyEn.groups[index]?.title ?? groupEn?.title ?? "",
      bodyTh: copyTh.groups[index]?.body ?? "",
      bodyEn: copyEn.groups[index]?.body ?? "",
    };
  });
}

function seedCards(): CmsSolutionsIndexCard[] {
  const th = visibleSolutionGroups("th");
  const en = visibleSolutionGroups("en");
  const copyTh = solutionsIndexCopy.th;
  const copyEn = solutionsIndexCopy.en;
  const rows = new Map<string, { groupId: string; groupTitleTh: string; groupTitleEn: string }>();
  th.forEach((group, index) =>
    group.items.forEach((item) =>
      rows.set(barePath(item.href), { groupId: group.id, groupTitleTh: copyTh.groups[index]?.title ?? group.title, groupTitleEn: "" }),
    ),
  );
  en.forEach((group, index) =>
    group.items.forEach((item) => {
      const bare = barePath(item.href);
      const current = rows.get(bare);
      const titleEn = copyEn.groups[index]?.title ?? group.title;
      if (current) current.groupTitleEn = titleEn;
      else rows.set(bare, { groupId: group.id, groupTitleTh: "", groupTitleEn: titleEn });
    }),
  );
  return [...rows.entries()].map(([href, meta]) => {
    const nameTh = solutionNavLabel(href, "th");
    const nameEn = solutionNavLabel(href, "en");
    const problemTh = copyTh.problems[href as keyof typeof copyTh.problems];
    const problemEn = copyEn.problems[href as keyof typeof copyEn.problems];
    const cardTh = standardizeServiceCard({ groupId: meta.groupId, category: meta.groupTitleTh, href, name: nameTh, problem: problemTh, locale: "th" });
    const cardEn = standardizeServiceCard({ groupId: meta.groupId, category: meta.groupTitleEn, href, name: nameEn, problem: problemEn, locale: "en" });
    return {
      id: cardIdFromHref(href),
      groupId: meta.groupId,
      href,
      visible: true,
      nameTh,
      nameEn,
      problemTh: cardTh.problem ?? "",
      problemEn: cardEn.problem ?? "",
      suitableTh: cardTh.suitable ?? "",
      suitableEn: cardEn.suitable ?? "",
      deliverableTh: cardTh.deliverable ?? "",
      deliverableEn: cardEn.deliverable ?? "",
      icon: emptySolutionsIndexVisual(),
    };
  });
}

function seedChallenges(): CmsSolutionsIndexChallenge[] {
  return SOLUTION_CHALLENGES.map((challenge) => ({
    id: challenge.id,
    labelTh: challenge.label.th,
    labelEn: challenge.label.en,
    matches: challenge.matches.map((match, index) => ({
      id: `${challenge.id}-${index + 1}`,
      href: match.href,
      reasonTh: match.reason.th,
      reasonEn: match.reason.en,
    })),
  }));
}

function seedChains(): CmsSolutionsIndexChain[] {
  return Object.entries(SOLUTIONS_CONNECT_CHAINS).map(([groupId, chain]) => ({
    id: chain.id,
    groupId,
    steps: chain.steps.en.map((en, index) => ({ id: `${chain.id}-${index + 1}`, th: chain.steps.th[index] ?? "", en })),
  }));
}

export function defaultSolutionsIndexCms(locale: Locale = "th"): CmsSolutionsIndexPage {
  const thai = locale === "th";
  const copy = thai ? solutionsIndexCopy.th : solutionsIndexCopy.en;
  const copyTh = solutionsIndexCopy.th;
  const copyEn = solutionsIndexCopy.en;
  return {
    version: 1,
    template: SOLUTIONS_INDEX_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: {
      eyebrow: copy.eyebrow,
      title: copy.title,
      body: copy.body,
      supportLine: copy.supportLine,
      primaryCta: { label: copy.audit, href: "/#audit" },
      secondaryCta: { label: copy.browse, href: "#solutions" },
      flow: HERO_FLOW.map((step) => ({ id: step.id, th: step.th, en: step.en })),
      visual: {
        src: SOLUTIONS_INDEX_HERO_PLACEHOLDER,
        altTh: copyTh.heroVisualAlt,
        altEn: copyEn.heroVisualAlt,
        status: "sample",
        label: copy.heroVisualLabel,
        caption: "",
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
    },
    finder: {
      eyebrow: copy.sectionEyebrow,
      title: copy.sectionTitle,
      startNote: copy.startNote,
      challengeLegend: copy.challengeLegend,
      emptyTitle: copy.emptyTitle,
      emptyBody: copy.emptyBody,
      resultTitle: copy.resultTitle,
      resultLead: copy.resultLead,
      clearSelection: copy.clearSelection,
      relatedWhy: copy.relatedWhy,
      details: copy.details,
      browseAll: copy.browseAll,
      unsureHint: copy.unsureHint,
      unsureCta: copy.unsureCta,
      challenges: seedChallenges(),
    },
    categories: { title: copy.allGroupsTitle, items: seedCategories() },
    cards: {
      suitableForLabel: copy.suitableForLabel,
      deliverableLabel: copy.deliverableLabel,
      viewDetails: copy.viewDetails,
      items: seedCards(),
    },
    relationships: { title: copy.connectTitle, note: copy.connectNote, chains: seedChains() },
    proof: { title: copy.processProofTitle, lead: "", noProofNote: copy.processNoProofNote, items: [] },
    cta: {
      title: copy.unsureTitle,
      body: copy.unsureBody,
      helps: copyTh.unsureHelps.map((th, index) => ({ id: `help-${index + 1}`, th, en: copyEn.unsureHelps[index] ?? "" })),
      primaryCta: { label: copy.unsurePrimary, href: "/#audit" },
      secondaryCta: { label: copy.unsureSecondary, href: "#solutions-all" },
      visual: {
        src: SOLUTIONS_INDEX_CTA_PLACEHOLDER,
        altTh: copyTh.unsureVisualAlt,
        altEn: copyEn.unsureVisualAlt,
        status: "sample",
        label: copy.unsureVisualLabel,
        caption: "",
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
    },
    process: {
      eyebrow: copy.processEyebrow,
      title: copy.processTitle,
      lead: copy.processLead,
      steps: SOLUTIONS_PROCESS_STEPS.map((step) => ({
        id: step.id,
        titleTh: step.th,
        titleEn: step.en,
        bodyTh: step.body.th,
        bodyEn: step.body.en,
      })),
    },
    faqs: SOLUTIONS_INDEX_FAQS.map((item) => ({ id: item.id, qTh: item.qTh, qEn: item.qEn, aTh: item.aTh, aEn: item.aEn })),
    seo: {
      canonical: localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale),
      social: emptySolutionsIndexVisual(),
      variants: [
        { locale: "en", title: "", description: "", canonical: "/en/solutions" },
        { locale: "ru", title: "", description: "", canonical: "/ru/solutions" },
        { locale: "zh", title: "", description: "", canonical: "/zh/solutions" },
      ],
    },
    approvals: { proof: false, visuals: false, evidenceNote: "" },
  };
}

/* ---------------------------------------------------------------- parsing */

type Row = Record<string, unknown>;

function rec(value: unknown): Row {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Row) : {};
}

function str(row: Row, key: string, fallback: string) {
  const value = row[key];
  return value === undefined || value === null ? fallback : String(value);
}

function flag(row: Row, key: string, fallback: boolean) {
  const value = row[key];
  return typeof value === "boolean" ? value : fallback;
}

function asList<T>(value: unknown, fallback: T[], blank: () => T, map: (row: Row, seed: T) => T, allowEmpty = false): T[] {
  if (!Array.isArray(value)) return fallback;
  if (!value.length) return allowEmpty ? [] : fallback;
  return value.map((item, index) => {
    const row = rec(item);
    const id = typeof row.id === "string" ? row.id : "";
    const seed = (id ? fallback.find((entry) => (entry as { id?: string }).id === id) : undefined) ?? fallback[index] ?? blank();
    return map(row, seed);
  });
}

function asCta(value: unknown, fallback: CmsSolutionsIndexCta): CmsSolutionsIndexCta {
  const row = rec(value);
  return { label: str(row, "label", fallback.label), href: str(row, "href", fallback.href) };
}

function asVisual(value: unknown, fallback: CmsSolutionsIndexVisual): CmsSolutionsIndexVisual {
  const row = rec(value);
  return {
    src: str(row, "src", fallback.src).trim() || fallback.src,
    altTh: str(row, "altTh", fallback.altTh),
    altEn: str(row, "altEn", fallback.altEn),
    status: str(row, "status", fallback.status) || "sample",
    label: str(row, "label", fallback.label),
    caption: str(row, "caption", fallback.caption),
    source: str(row, "source", fallback.source),
    approvalNote: str(row, "approvalNote", fallback.approvalNote),
    publicationApproved: flag(row, "publicationApproved", fallback.publicationApproved),
  };
}

function asLines(value: unknown, fallback: CmsSolutionsIndexLine[]) {
  return asList(value, fallback, () => blankSolutionsIndexLine(), (row, seed) => ({ id: str(row, "id", seed.id) || seed.id, th: str(row, "th", seed.th), en: str(row, "en", seed.en) }));
}

function asChallenges(value: unknown, fallback: CmsSolutionsIndexChallenge[]) {
  return asList(value, fallback, blankSolutionsIndexChallenge, (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    labelTh: str(row, "labelTh", seed.labelTh),
    labelEn: str(row, "labelEn", seed.labelEn),
    matches: asList(row.matches, seed.matches, blankSolutionsIndexChallengeMatch, (match, matchSeed) => ({
      id: str(match, "id", matchSeed.id) || matchSeed.id,
      href: str(match, "href", matchSeed.href),
      reasonTh: str(match, "reasonTh", matchSeed.reasonTh),
      reasonEn: str(match, "reasonEn", matchSeed.reasonEn),
    }), true),
  }));
}

function asCategories(value: unknown, fallback: CmsSolutionsIndexCategory[]) {
  return asList(value, fallback, blankSolutionsIndexCategory, (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    titleTh: str(row, "titleTh", seed.titleTh),
    titleEn: str(row, "titleEn", seed.titleEn),
    bodyTh: str(row, "bodyTh", seed.bodyTh),
    bodyEn: str(row, "bodyEn", seed.bodyEn),
  }));
}

function asCards(value: unknown, fallback: CmsSolutionsIndexCard[]) {
  return asList(value, fallback, () => blankSolutionsIndexCard(), (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    groupId: str(row, "groupId", seed.groupId),
    href: str(row, "href", seed.href),
    visible: flag(row, "visible", seed.visible),
    nameTh: str(row, "nameTh", seed.nameTh),
    nameEn: str(row, "nameEn", seed.nameEn),
    problemTh: str(row, "problemTh", seed.problemTh),
    problemEn: str(row, "problemEn", seed.problemEn),
    suitableTh: str(row, "suitableTh", seed.suitableTh),
    suitableEn: str(row, "suitableEn", seed.suitableEn),
    deliverableTh: str(row, "deliverableTh", seed.deliverableTh),
    deliverableEn: str(row, "deliverableEn", seed.deliverableEn),
    icon: asVisual(row.icon, seed.icon),
  }));
}

function asChains(value: unknown, fallback: CmsSolutionsIndexChain[]) {
  return asList(value, fallback, () => blankSolutionsIndexChain(), (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    groupId: str(row, "groupId", seed.groupId),
    steps: asLines(row.steps, seed.steps),
  }));
}

function asReviewStatus(value: string, fallback: string) {
  return SOLUTIONS_INDEX_REVIEW_STATUSES.some((item) => item.id === value) ? value : fallback;
}

function asProofItems(value: unknown) {
  // Proof is intentionally empty by default; an empty list from the CMS stays empty.
  return asList<CmsSolutionsIndexProofItem>(value, [], blankSolutionsIndexProofItem, (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    identityTh: str(row, "identityTh", seed.identityTh),
    identityEn: str(row, "identityEn", seed.identityEn),
    challengeTh: str(row, "challengeTh", seed.challengeTh),
    challengeEn: str(row, "challengeEn", seed.challengeEn),
    scopeTh: str(row, "scopeTh", seed.scopeTh),
    scopeEn: str(row, "scopeEn", seed.scopeEn),
    metricTh: str(row, "metricTh", seed.metricTh),
    metricEn: str(row, "metricEn", seed.metricEn),
    definitionTh: str(row, "definitionTh", seed.definitionTh),
    definitionEn: str(row, "definitionEn", seed.definitionEn),
    periodTh: str(row, "periodTh", seed.periodTh),
    periodEn: str(row, "periodEn", seed.periodEn),
    sourceTh: str(row, "sourceTh", seed.sourceTh),
    sourceEn: str(row, "sourceEn", seed.sourceEn),
    reviewedAt: str(row, "reviewedAt", seed.reviewedAt),
    reviewStatus: asReviewStatus(str(row, "reviewStatus", seed.reviewStatus), "review"),
    publicationApproved: flag(row, "publicationApproved", seed.publicationApproved),
  }), true);
}

function asProcessSteps(value: unknown, fallback: CmsSolutionsIndexProcessStep[]) {
  return asList(value, fallback, blankSolutionsIndexProcessStep, (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    titleTh: str(row, "titleTh", seed.titleTh),
    titleEn: str(row, "titleEn", seed.titleEn),
    bodyTh: str(row, "bodyTh", seed.bodyTh),
    bodyEn: str(row, "bodyEn", seed.bodyEn),
  }));
}

function asFaqs(value: unknown, fallback: CmsSolutionsIndexFaq[]) {
  return asList(value, fallback, blankSolutionsIndexFaq, (row, seed) => ({
    id: str(row, "id", seed.id) || seed.id,
    qTh: str(row, "qTh", seed.qTh),
    qEn: str(row, "qEn", seed.qEn),
    aTh: str(row, "aTh", seed.aTh),
    aEn: str(row, "aEn", seed.aEn),
  }));
}

export function parseSolutionsIndexPageBody(body: string, locale: Locale = "th"): CmsSolutionsIndexPage | null {
  try {
    const parsed = rec(JSON.parse(body));
    if (typeof parsed.template === "string" && parsed.template !== SOLUTIONS_INDEX_CMS_TEMPLATE) return null;
    const seeded = defaultSolutionsIndexCms(locale);
    const hero = rec(parsed.hero);
    const finder = rec(parsed.finder);
    const categories = rec(parsed.categories);
    const cards = rec(parsed.cards);
    const relationships = rec(parsed.relationships);
    const proof = rec(parsed.proof);
    const cta = rec(parsed.cta);
    const process = rec(parsed.process);
    const seo = rec(parsed.seo);
    const approvals = rec(parsed.approvals);
    return {
      version: 1,
      template: SOLUTIONS_INDEX_CMS_TEMPLATE,
      bilingualPublish: flag(parsed, "bilingualPublish", true),
      hero: {
        eyebrow: str(hero, "eyebrow", seeded.hero.eyebrow),
        title: str(hero, "title", seeded.hero.title),
        body: str(hero, "body", seeded.hero.body),
        supportLine: str(hero, "supportLine", seeded.hero.supportLine),
        primaryCta: asCta(hero.primaryCta, seeded.hero.primaryCta),
        secondaryCta: asCta(hero.secondaryCta, seeded.hero.secondaryCta),
        flow: asLines(hero.flow, seeded.hero.flow),
        visual: asVisual(hero.visual, seeded.hero.visual),
      },
      finder: {
        eyebrow: str(finder, "eyebrow", seeded.finder.eyebrow),
        title: str(finder, "title", seeded.finder.title),
        startNote: str(finder, "startNote", seeded.finder.startNote),
        challengeLegend: str(finder, "challengeLegend", seeded.finder.challengeLegend),
        emptyTitle: str(finder, "emptyTitle", seeded.finder.emptyTitle),
        emptyBody: str(finder, "emptyBody", seeded.finder.emptyBody),
        resultTitle: str(finder, "resultTitle", seeded.finder.resultTitle),
        resultLead: str(finder, "resultLead", seeded.finder.resultLead),
        clearSelection: str(finder, "clearSelection", seeded.finder.clearSelection),
        relatedWhy: str(finder, "relatedWhy", seeded.finder.relatedWhy),
        details: str(finder, "details", seeded.finder.details),
        browseAll: str(finder, "browseAll", seeded.finder.browseAll),
        unsureHint: str(finder, "unsureHint", seeded.finder.unsureHint),
        unsureCta: str(finder, "unsureCta", seeded.finder.unsureCta),
        challenges: asChallenges(finder.challenges, seeded.finder.challenges),
      },
      categories: {
        title: str(categories, "title", seeded.categories.title),
        items: asCategories(categories.items, seeded.categories.items),
      },
      cards: {
        suitableForLabel: str(cards, "suitableForLabel", seeded.cards.suitableForLabel),
        deliverableLabel: str(cards, "deliverableLabel", seeded.cards.deliverableLabel),
        viewDetails: str(cards, "viewDetails", seeded.cards.viewDetails),
        items: asCards(cards.items, seeded.cards.items),
      },
      relationships: {
        title: str(relationships, "title", seeded.relationships.title),
        note: str(relationships, "note", seeded.relationships.note),
        chains: asChains(relationships.chains, seeded.relationships.chains),
      },
      proof: {
        title: str(proof, "title", seeded.proof.title),
        lead: str(proof, "lead", seeded.proof.lead),
        noProofNote: str(proof, "noProofNote", seeded.proof.noProofNote),
        items: asProofItems(proof.items),
      },
      cta: {
        title: str(cta, "title", seeded.cta.title),
        body: str(cta, "body", seeded.cta.body),
        helps: asLines(cta.helps, seeded.cta.helps),
        primaryCta: asCta(cta.primaryCta, seeded.cta.primaryCta),
        secondaryCta: asCta(cta.secondaryCta, seeded.cta.secondaryCta),
        visual: asVisual(cta.visual, seeded.cta.visual),
      },
      process: {
        eyebrow: str(process, "eyebrow", seeded.process.eyebrow),
        title: str(process, "title", seeded.process.title),
        lead: str(process, "lead", seeded.process.lead),
        steps: asProcessSteps(process.steps, seeded.process.steps),
      },
      faqs: asFaqs(parsed.faqs, seeded.faqs),
      seo: {
        canonical: str(seo, "canonical", seeded.seo.canonical),
        social: asVisual(seo.social, seeded.seo.social),
        variants: asList(seo.variants, seeded.seo.variants, () => ({ locale: "", title: "", description: "", canonical: "" }), (row, seed) => ({
          locale: str(row, "locale", seed.locale),
          title: str(row, "title", seed.title),
          description: str(row, "description", seed.description),
          canonical: str(row, "canonical", seed.canonical),
        })),
      },
      approvals: {
        proof: flag(approvals, "proof", seeded.approvals.proof),
        visuals: flag(approvals, "visuals", seeded.approvals.visuals),
        evidenceNote: str(approvals, "evidenceNote", seeded.approvals.evidenceNote),
      },
    };
  } catch {
    return null;
  }
}

export function serializeSolutionsIndexPageBody(content: CmsSolutionsIndexPage) {
  return JSON.stringify({ ...content, version: 1, template: SOLUTIONS_INDEX_CMS_TEMPLATE });
}

export function isSolutionsIndexCmsBody(body: string) {
  try {
    return (JSON.parse(body) as { template?: string }).template === SOLUTIONS_INDEX_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isSolutionsIndexPageDocument(input: { slug: string; template: string }) {
  return input.template === SOLUTIONS_INDEX_CMS_TEMPLATE || input.slug === SOLUTIONS_INDEX_PAGE_SLUG;
}

/* ------------------------------------------------------------- validation */

const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const SECRET_ASSIGN = /(password|passwd|api[_-\s]?key|guest[_-\s]?(id|data)|booking[_-\s]?(id|code)|รหัสผ่าน|รหัสจอง)\s*[:=]\s*\S+/i;
const SECRET_TOKEN = /\b(sk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;
const NUMBER_RE = /\d+(\.\d+)?/;
const VISUAL_STATUS_IDS: string[] = SOLUTIONS_INDEX_VISUAL_STATUSES.map((item) => item.id);

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function visualHasStatus(status: string) {
  return VISUAL_STATUS_IDS.includes(status);
}

function visualError(visual: CmsSolutionsIndexVisual, bilingual: boolean) {
  if (!visual.src.trim()) return null;
  if (!visualHasStatus(visual.status)) return "placeholder_status";
  if (solutionsIndexIsLibraryPlaceholder(visual.src) || visual.status === "replace") return null;
  if (bilingual && (!visual.altTh.trim() || !visual.altEn.trim())) return "missing_alt";
  if (!visual.altTh.trim() && !visual.altEn.trim()) return "missing_alt";
  if (visual.status === "approved" && !visual.publicationApproved) return "screenshot_approval";
  return null;
}

function pair(th: string, en: string, bilingual: boolean) {
  return bilingual ? Boolean(th.trim() && en.trim()) : Boolean(th.trim() || en.trim());
}

export function solutionsIndexProofItemComplete(item: CmsSolutionsIndexProofItem, bilingual: boolean) {
  return Boolean(
    pair(item.identityTh, item.identityEn, bilingual) &&
      pair(item.challengeTh, item.challengeEn, bilingual) &&
      pair(item.scopeTh, item.scopeEn, bilingual) &&
      pair(item.metricTh, item.metricEn, bilingual) &&
      pair(item.definitionTh, item.definitionEn, bilingual) &&
      pair(item.periodTh, item.periodEn, bilingual) &&
      pair(item.sourceTh, item.sourceEn, bilingual) &&
      item.reviewedAt.trim(),
  );
}

/** Proof items allowed on the public page: verified, permission-cleared, evidence complete. */
export function solutionsIndexPublishableProof(content: CmsSolutionsIndexPage) {
  return content.proof.items.filter(
    (item) => item.reviewStatus === "verified" && item.publicationApproved && solutionsIndexProofItemComplete(item, content.bilingualPublish),
  );
}

export function validateSolutionsIndexPage(content: CmsSolutionsIndexPage, intent: SolutionsIndexCmsIntent) {
  if (intent === "unpublish") return null;
  let secrets = false;
  walkStrings(content, (text) => {
    if (SECRET_ASSIGN.test(text) || SECRET_TOKEN.test(text)) secrets = true;
  });
  if (secrets) return "blocked_secret";
  if (intent !== "publish") return null;

  if (!content.categories.items.length || !content.cards.items.length || !content.finder.challenges.length) return "empty_section";
  if (content.bilingualPublish && content.faqs.some((faq) => !faq.qTh.trim() || !faq.aTh.trim() || !faq.qEn.trim() || !faq.aEn.trim())) return "empty_faq_bilingual";

  const primary = [content.hero.primaryCta, content.cta.primaryCta];
  if (primary.some((cta) => !cta.label.trim() || !CTA_RE.test(cta.href.trim()))) return "invalid_cta";
  const secondary = [content.hero.secondaryCta, content.cta.secondaryCta];
  if (secondary.some((cta) => cta.href.trim() && (!cta.label.trim() || !CTA_RE.test(cta.href.trim())))) return "invalid_cta";

  const groupIds = new Set(content.categories.items.map((item) => item.id));
  for (const card of content.cards.items) {
    if (!card.href.trim() || !CTA_RE.test(card.href.trim())) return "invalid_card_link";
    if (!groupIds.has(card.groupId)) return "invalid_card_group";
    if (content.bilingualPublish && card.visible && (!card.nameTh.trim() || !card.nameEn.trim())) return "empty_card_name";
  }
  for (const challenge of content.finder.challenges) {
    if (challenge.matches.some((match) => !match.href.trim() || !CTA_RE.test(match.href.trim()))) return "invalid_card_link";
  }

  const visuals = [content.hero.visual, content.cta.visual, content.seo.social, ...content.cards.items.map((card) => card.icon)];
  for (const visual of visuals) {
    const error = visualError(visual, content.bilingualPublish);
    if (error) return error;
  }

  for (const item of content.proof.items) {
    const hasContent = Object.entries(item).some(([key, value]) => key !== "id" && key !== "reviewStatus" && typeof value === "string" && value.trim());
    if (!hasContent && !item.publicationApproved && item.reviewStatus !== "verified") continue;
    if (item.reviewStatus === "verified" || item.publicationApproved) {
      if (!solutionsIndexProofItemComplete(item, content.bilingualPublish)) return "proof_incomplete";
      if (item.reviewStatus !== "verified" || !item.publicationApproved) return "proof_unverified";
    }
    const numeric = [item.metricTh, item.metricEn].some((value) => NUMBER_RE.test(value));
    if (numeric && (!solutionsIndexProofItemComplete(item, content.bilingualPublish) || !content.approvals.proof || !content.approvals.evidenceNote.trim())) {
      return "claim_incomplete";
    }
  }
  return null;
}

/* --------------------------------------------------------------- messages */

export function solutionsIndexCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready" | "removed") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  if (kind === "removed") return "ลบรายการแล้ว ยังไม่ได้บันทึก / Item removed — not saved yet";
  return "บันทึกแล้ว / Saved";
}

export function solutionsIndexCmsErrorMessage(error?: string) {
  const th: Record<string, string> = {
    blocked_secret: "ลบรหัสผ่าน รหัสจอง ข้อมูลแขก หรือโทเคนออกก่อนบันทึก",
    empty_faq_bilingual: "คำถามที่พบบ่อยต้องมีภาษาไทยและอังกฤษก่อนเผยแพร่",
    invalid_cta: "ปุ่มหลักต้องมีข้อความและลิงก์ที่ถูกต้อง",
    invalid_card_link: "การ์ดบริการและตัวเลือกปัญหาต้องมีลิงก์ที่ถูกต้อง",
    invalid_card_group: "การ์ดบริการต้องอยู่ในกลุ่มที่มีอยู่",
    empty_card_name: "การ์ดที่แสดงต้องมีชื่อไทยและอังกฤษก่อนเผยแพร่สองภาษา",
    empty_section: "ต้องมีกลุ่มบริการ การ์ดบริการ และตัวเลือกปัญหาอย่างน้อยหนึ่งรายการก่อนเผยแพร่",
    claim_incomplete: "ตัวเลขผลงานต้องมีนิยาม ช่วงเวลา แหล่งที่มา วันที่ทบทวน และหมายเหตุหลักฐานก่อนเผยแพร่",
    proof_incomplete: "ผลงานที่ยืนยันแล้วต้องกรอกข้อมูลครบทุกช่อง",
    proof_unverified: "ผลงานต้องมีสถานะ Verified และสิทธิ์เผยแพร่พร้อมกัน",
    required_fields: "กรอกชื่อเพจและคำอธิบาย SEO ก่อนเผยแพร่",
    invalid_json: "บันทึกไม่สำเร็จ เพราะโครงสร้างเนื้อหาไม่ถูกต้อง",
    invalid_image: "ไฟล์รูปไม่ถูกต้อง",
    missing: "ไม่พบหน้าเพจ",
    invalid_locale: "ภาษาปลายทางไม่ถูกต้อง",
    locale_exists: "มีฉบับภาษานี้อยู่แล้ว",
    placeholder_status: "ทุกรูปต้องระบุสถานะ Approved / Sample / Replace",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและอังกฤษ",
    screenshot_approval: "รูปที่สถานะ Approved ต้องมีสิทธิ์เผยแพร่",
  };
  const en: Record<string, string> = {
    blocked_secret: "Remove passwords, booking IDs, guest data, or tokens before saving",
    empty_faq_bilingual: "FAQs need Thai and English before bilingual publish",
    invalid_cta: "Primary buttons need a label and a valid link",
    invalid_card_link: "Service cards and challenge matches need a valid link",
    invalid_card_group: "Each service card must belong to an existing group",
    empty_card_name: "Visible cards need Thai and English names before bilingual publish",
    empty_section: "Add at least one group, service card, and challenge before publishing",
    claim_incomplete: "Numeric proof needs definition, period, source, review date, and an evidence note before publishing",
    proof_incomplete: "Verified proof must have every field completed",
    proof_unverified: "Proof needs both Verified status and publication permission",
    required_fields: "Add a title and SEO description before publishing",
    invalid_json: "The saved content structure is not valid",
    invalid_image: "The image file is not valid",
    missing: "Page not found",
    invalid_locale: "The destination language is not valid",
    locale_exists: "A version in that language already exists",
    placeholder_status: "Every image needs an Approved / Sample / Replace status",
    missing_alt: "Published images need Thai and English alt text",
    screenshot_approval: "Approved images need publication permission",
  };
  if (!error) return "";
  return `${th[error] ?? "บันทึกไม่สำเร็จ"} / ${en[error] ?? "Save failed"}`;
}

/* ---------------------------------------------------------------- helpers */

export function editorStateFromSolutionsIndexDocument(input: {
  id: string;
  title: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  canonical?: string | null;
  locale: string;
  status: string;
  body: string;
}): SolutionsIndexEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseSolutionsIndexPageBody(input.body, locale) ?? defaultSolutionsIndexCms(locale);
  return {
    id: input.id,
    title: input.title,
    seoTitle: input.seoTitle || "",
    metaDescription: input.metaDescription || "",
    excerpt: input.excerpt || "",
    canonical: input.canonical || content.seo.canonical,
    locale: input.locale,
    status: input.status,
    content,
  };
}

export function solutionsIndexPublicPath(locale: Locale) {
  const route = localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale);
  return pages.find((item) => item.route === route)?.route || route;
}

export function siteTitleForSolutionsIndex(locale: Locale) {
  const page = pages.find((item) => item.route === localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale === "th" ? "th" : "en"));
  return page?.title || (locale === "th" ? solutionsIndexCopy.th.title : solutionsIndexCopy.en.title);
}

/** Default audit/home CTA for this page, localised. */
export function solutionsIndexAuditHref(locale: Locale) {
  return auditHref(locale);
}
