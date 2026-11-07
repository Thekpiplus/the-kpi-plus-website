import { aboutPageCopy, type AboutPageLocaleCopy } from "@/lib/cms/about-page-copy";
import { codeFaqsForRoute, type FaqItem } from "@/lib/faqs";
import type { Locale } from "@/lib/seo";

export const ABOUT_CMS_TEMPLATE = "about-page";
export const ABOUT_PAGE_SLUG = "about-us";
export const ABOUT_PAGE_ROUTE = "/about-us";
export const ABOUT_CMS_INTENTS = ["save", "draft", "publish", "unpublish"] as const;
export type AboutCmsIntent = (typeof ABOUT_CMS_INTENTS)[number];

export type AboutLocalized = { th: string; en: string; ru: string; zh: string };

export type CmsAboutStage = { id: string; num: string; title: AboutLocalized; body: AboutLocalized };
export type CmsAboutMethod = { id: string; num: string; title: AboutLocalized; output: AboutLocalized };
export type CmsAboutPillar = {
  id: string;
  num: string;
  title: AboutLocalized;
  subtitle: AboutLocalized;
  body: AboutLocalized;
  tags: AboutLocalized;
  receive: AboutLocalized;
};
export type CmsAboutValue = { id: string; num: string; title: AboutLocalized; body: AboutLocalized };
export type CmsAboutJoinStep = { id: string; num: string; title: AboutLocalized; body: AboutLocalized };
export type CmsAboutFaq = { id: string; q: AboutLocalized; a: AboutLocalized };

export type CmsAboutPage = {
  version: 1;
  template: typeof ABOUT_CMS_TEMPLATE;
  hero: {
    kicker: AboutLocalized;
    h1: AboutLocalized;
    highlight: AboutLocalized;
    heroBody: AboutLocalized;
    workAlt: AboutLocalized;
    auditCta: AboutLocalized;
    secondaryCta: AboutLocalized;
  };
  partner: {
    eyebrow: AboutLocalized;
    title: AboutLocalized;
    lead: AboutLocalized;
    goal: AboutLocalized;
    accent: AboutLocalized;
    storyVisualLabel: AboutLocalized;
    stages: CmsAboutStage[];
    visionLabel: AboutLocalized;
    vision: AboutLocalized;
    missionLabel: AboutLocalized;
    mission: AboutLocalized;
  };
  method: {
    title: AboutLocalized;
    stepsLabel: AboutLocalized;
    outputLabel: AboutLocalized;
    note: AboutLocalized;
    steps: CmsAboutMethod[];
  };
  pillars: {
    title: AboutLocalized;
    receiveLabel: AboutLocalized;
    sampleBadge: AboutLocalized;
    items: CmsAboutPillar[];
  };
  experience: {
    title: AboutLocalized;
    body: AboutLocalized;
    metric: AboutLocalized;
    scope: AboutLocalized;
    note: AboutLocalized;
    clientsEyebrow: AboutLocalized;
    featuredClientNames: string[];
  };
  values: {
    title: AboutLocalized;
    processLink: AboutLocalized;
    items: CmsAboutValue[];
  };
  founders: {
    eyebrow: AboutLocalized;
    title: AboutLocalized;
    lead: AboutLocalized;
    help: AboutLocalized;
    alt: AboutLocalized;
    caption: AboutLocalized;
    aName: AboutLocalized;
    aRole: AboutLocalized;
    aBody: AboutLocalized;
    bName: AboutLocalized;
    bRole: AboutLocalized;
    bBody: AboutLocalized;
  };
  closer: {
    eyebrow: AboutLocalized;
    title: AboutLocalized;
    body: AboutLocalized;
    line: AboutLocalized;
    nextLabel: AboutLocalized;
    next: AboutLocalized[];
    note: AboutLocalized;
  };
  join: {
    title: AboutLocalized;
    body: AboutLocalized;
    processLabel: AboutLocalized;
    cta: AboutLocalized;
    steps: CmsAboutJoinStep[];
  };
  media: {
    workPhoto: string;
    foundersPhoto: string;
    workshopPhoto: string;
    teamRealPhoto: string;
    caseHotelPhoto: string;
    pillarPhotos: [string, string, string];
    dummyCaption: AboutLocalized;
    workshopAlt: AboutLocalized;
    teamRealAlt: AboutLocalized;
    caseHotelAlt: AboutLocalized;
  };
  faqs: CmsAboutFaq[];
};

export type AboutPageCopy = AboutPageLocaleCopy & {
  featuredClientNames: string[];
  workPhoto: string;
  foundersPhoto: string;
  workshopPhoto: string;
  teamRealPhoto: string;
  caseHotelPhoto: string;
  pillarPhotos: [string, string, string];
};

export type AboutCmsSaveResult = { ok: true; id: string; intent: AboutCmsIntent } | { ok: false; error: string };
export type AboutEditorState = {
  documentId: string;
  title: string;
  status: string;
  seoTitle: string;
  metaDescription: string;
  content: CmsAboutPage;
};

export function emptyAboutLocalized(seed = ""): AboutLocalized {
  return { th: seed, en: seed, ru: seed, zh: seed };
}

export function pickAboutLocalized(value: AboutLocalized | undefined, locale: Locale): string {
  if (!value) return "";
  const direct = value[locale]?.trim();
  if (direct) return direct;
  if (locale === "th") return value.th?.trim() || value.en?.trim() || "";
  return value.en?.trim() || value.th?.trim() || "";
}

function loc(pick: (locale: AboutPageLocaleCopy) => string): AboutLocalized {
  return {
    th: pick(aboutPageCopy.th),
    en: pick(aboutPageCopy.en),
    ru: pick(aboutPageCopy.ru),
    zh: pick(aboutPageCopy.zh),
  };
}

function asLocalized(value: unknown, fallback: AboutLocalized = emptyAboutLocalized()): AboutLocalized {
  if (!value || typeof value !== "object") return { ...fallback };
  const row = value as Partial<AboutLocalized>;
  return {
    th: typeof row.th === "string" ? row.th : fallback.th,
    en: typeof row.en === "string" ? row.en : fallback.en,
    ru: typeof row.ru === "string" ? row.ru : fallback.ru,
    zh: typeof row.zh === "string" ? row.zh : fallback.zh,
  };
}

function seedFaqs(): CmsAboutFaq[] {
  const th = codeFaqsForRoute("/about-us");
  const en = codeFaqsForRoute("/en/about-us");
  const ru = codeFaqsForRoute("/ru/about-us");
  const zh = codeFaqsForRoute("/zh/about-us");
  const length = Math.max(th.length, en.length, ru.length, zh.length, 1);
  return Array.from({ length }, (_, index) => ({
    id: `faq-${index + 1}`,
    q: {
      th: th[index]?.q ?? "",
      en: en[index]?.q ?? "",
      ru: ru[index]?.q ?? "",
      zh: zh[index]?.q ?? "",
    },
    a: {
      th: th[index]?.a ?? "",
      en: en[index]?.a ?? "",
      ru: ru[index]?.a ?? "",
      zh: zh[index]?.a ?? "",
    },
  }));
}

export function defaultAboutCms(): CmsAboutPage {
  const stageCount = aboutPageCopy.th.storyStages.length;
  const methodCount = aboutPageCopy.th.methods.length;
  const pillarCount = aboutPageCopy.th.pillars.length;
  const valueCount = aboutPageCopy.th.values.length;
  const joinCount = aboutPageCopy.th.joinProcess.length;
  const nextCount = aboutPageCopy.th.closerNext.length;

  return {
    version: 1,
    template: ABOUT_CMS_TEMPLATE,
    hero: {
      kicker: loc((t) => t.kicker),
      h1: loc((t) => t.h1),
      highlight: loc((t) => t.highlight),
      heroBody: loc((t) => t.heroBody),
      workAlt: loc((t) => t.workAlt),
      auditCta: loc((t) => t.auditCta),
      secondaryCta: loc((t) => t.closerSecondary),
    },
    partner: {
      eyebrow: loc((t) => t.partnerEyebrow),
      title: loc((t) => t.partnerTitle),
      lead: loc((t) => t.partnerLead),
      goal: loc((t) => t.partnerGoal),
      accent: loc((t) => t.partnerAccent),
      storyVisualLabel: loc((t) => t.storyVisualLabel),
      stages: Array.from({ length: stageCount }, (_, index) => ({
        id: `stage-${index + 1}`,
        num: aboutPageCopy.th.storyStages[index][0],
        title: loc((t) => t.storyStages[index][1]),
        body: loc((t) => t.storyStages[index][2]),
      })),
      visionLabel: loc((t) => t.visionLabel),
      vision: loc((t) => t.vision),
      missionLabel: loc((t) => t.missionLabel),
      mission: loc((t) => t.mission),
    },
    method: {
      title: loc((t) => t.methodTitle),
      stepsLabel: loc((t) => t.methodStepsLabel),
      outputLabel: loc((t) => t.methodOutput),
      note: loc((t) => t.methodNote),
      steps: Array.from({ length: methodCount }, (_, index) => ({
        id: `method-${index + 1}`,
        num: aboutPageCopy.th.methods[index][0],
        title: loc((t) => t.methods[index][1]),
        output: loc((t) => t.methods[index][2]),
      })),
    },
    pillars: {
      title: loc((t) => t.pillarsTitle),
      receiveLabel: loc((t) => t.pillarReceiveLabel),
      sampleBadge: loc((t) => t.sampleBadge),
      items: Array.from({ length: pillarCount }, (_, index) => ({
        id: `pillar-${index + 1}`,
        num: aboutPageCopy.th.pillars[index].num,
        title: loc((t) => t.pillars[index].title),
        subtitle: loc((t) => t.pillars[index].subtitle),
        body: loc((t) => t.pillars[index].body),
        tags: loc((t) => t.pillars[index].tags),
        receive: loc((t) => t.pillars[index].receive),
      })),
    },
    experience: {
      title: loc((t) => t.experienceTitle),
      body: loc((t) => t.experienceBody),
      metric: loc((t) => t.experienceMetric),
      scope: loc((t) => t.experienceScope),
      note: loc((t) => t.experienceNote),
      clientsEyebrow: loc((t) => t.clientsEyebrow),
      featuredClientNames: [
        "Destination Group",
        "BYD Lofts",
        "Hotel COCO Phuket",
        "Baan Taranya Resort",
        "Casa de Lipe",
        "Baan 125 Stay",
      ],
    },
    values: {
      title: loc((t) => t.valuesTitle),
      processLink: loc((t) => t.valuesProcessLink),
      items: Array.from({ length: valueCount }, (_, index) => ({
        id: `value-${index + 1}`,
        num: aboutPageCopy.th.values[index][0],
        title: loc((t) => t.values[index][1]),
        body: loc((t) => t.values[index][2]),
      })),
    },
    founders: {
      eyebrow: loc((t) => t.foundersEyebrow),
      title: loc((t) => t.foundersTitle),
      lead: loc((t) => t.foundersLead),
      help: loc((t) => t.foundersHelp),
      alt: loc((t) => t.foundersAlt),
      caption: loc((t) => t.foundersCaption),
      aName: loc((t) => t.founderAName),
      aRole: loc((t) => t.founderARole),
      aBody: loc((t) => t.founderABody),
      bName: loc((t) => t.founderBName),
      bRole: loc((t) => t.founderBRole),
      bBody: loc((t) => t.founderBBody),
    },
    closer: {
      eyebrow: loc((t) => t.closerEyebrow),
      title: loc((t) => t.closerTitle),
      body: loc((t) => t.closerBody),
      line: loc((t) => t.closerLine),
      nextLabel: loc((t) => t.closerNextLabel),
      next: Array.from({ length: nextCount }, (_, index) => loc((t) => t.closerNext[index])),
      note: loc((t) => t.closerNote),
    },
    join: {
      title: loc((t) => t.joinTitle),
      body: loc((t) => t.joinBody),
      processLabel: loc((t) => t.joinProcessLabel),
      cta: loc((t) => t.joinCta),
      steps: Array.from({ length: joinCount }, (_, index) => ({
        id: `join-${index + 1}`,
        num: aboutPageCopy.th.joinProcess[index][0],
        title: loc((t) => t.joinProcess[index][1]),
        body: loc((t) => t.joinProcess[index][2]),
      })),
    },
    media: {
      workPhoto: "/media/kpi-plus-team-review_d4af97f6.jpg",
      foundersPhoto: "/media/the-kpi-plus-founders_f4c8516e.webp",
      workshopPhoto: "/media/process-workshop.webp",
      teamRealPhoto: "/media/about-team-real.webp",
      caseHotelPhoto: "/media/case-study-hotel.webp",
      pillarPhotos: [
        "/media/sample-revenue-report.webp",
        "/media/sample-ota-report.webp",
        "/media/sample-marketing-report.webp",
      ],
      dummyCaption: loc((t) => t.dummyCaption),
      workshopAlt: loc((t) => t.workshopAlt),
      teamRealAlt: loc((t) => t.teamRealAlt),
      caseHotelAlt: loc((t) => t.caseHotelAlt),
    },
    faqs: seedFaqs(),
  };
}

export function localizeAboutPage(content: CmsAboutPage, locale: Locale): AboutPageCopy {
  const base = aboutPageCopy[locale];
  return {
    ...base,
    kicker: pickAboutLocalized(content.hero.kicker, locale),
    h1: pickAboutLocalized(content.hero.h1, locale),
    highlight: pickAboutLocalized(content.hero.highlight, locale),
    heroBody: pickAboutLocalized(content.hero.heroBody, locale),
    workAlt: pickAboutLocalized(content.hero.workAlt, locale),
    auditCta: pickAboutLocalized(content.hero.auditCta, locale),
    closerSecondary: pickAboutLocalized(content.hero.secondaryCta, locale),
    partnerEyebrow: pickAboutLocalized(content.partner.eyebrow, locale),
    partnerTitle: pickAboutLocalized(content.partner.title, locale),
    partnerLead: pickAboutLocalized(content.partner.lead, locale),
    partnerGoal: pickAboutLocalized(content.partner.goal, locale),
    partnerAccent: pickAboutLocalized(content.partner.accent, locale),
    storyVisualLabel: pickAboutLocalized(content.partner.storyVisualLabel, locale),
    storyStages: content.partner.stages.map((stage) => [
      stage.num,
      pickAboutLocalized(stage.title, locale),
      pickAboutLocalized(stage.body, locale),
    ]),
    visionLabel: pickAboutLocalized(content.partner.visionLabel, locale),
    vision: pickAboutLocalized(content.partner.vision, locale),
    missionLabel: pickAboutLocalized(content.partner.missionLabel, locale),
    mission: pickAboutLocalized(content.partner.mission, locale),
    methodTitle: pickAboutLocalized(content.method.title, locale),
    methodStepsLabel: pickAboutLocalized(content.method.stepsLabel, locale),
    methodOutput: pickAboutLocalized(content.method.outputLabel, locale),
    methodNote: pickAboutLocalized(content.method.note, locale),
    methods: content.method.steps.map((step) => [
      step.num,
      pickAboutLocalized(step.title, locale),
      pickAboutLocalized(step.output, locale),
    ]),
    pillarsTitle: pickAboutLocalized(content.pillars.title, locale),
    pillarReceiveLabel: pickAboutLocalized(content.pillars.receiveLabel, locale),
    sampleBadge: pickAboutLocalized(content.pillars.sampleBadge, locale),
    pillars: content.pillars.items.map((item) => ({
      num: item.num,
      title: pickAboutLocalized(item.title, locale),
      subtitle: pickAboutLocalized(item.subtitle, locale),
      body: pickAboutLocalized(item.body, locale),
      tags: pickAboutLocalized(item.tags, locale),
      receive: pickAboutLocalized(item.receive, locale),
    })),
    experienceTitle: pickAboutLocalized(content.experience.title, locale),
    experienceBody: pickAboutLocalized(content.experience.body, locale),
    experienceMetric: pickAboutLocalized(content.experience.metric, locale),
    experienceScope: pickAboutLocalized(content.experience.scope, locale),
    experienceNote: pickAboutLocalized(content.experience.note, locale),
    clientsEyebrow: pickAboutLocalized(content.experience.clientsEyebrow, locale),
    valuesTitle: pickAboutLocalized(content.values.title, locale),
    valuesProcessLink: pickAboutLocalized(content.values.processLink, locale),
    values: content.values.items.map((item) => [
      item.num,
      pickAboutLocalized(item.title, locale),
      pickAboutLocalized(item.body, locale),
    ]),
    foundersEyebrow: pickAboutLocalized(content.founders.eyebrow, locale),
    foundersTitle: pickAboutLocalized(content.founders.title, locale),
    foundersLead: pickAboutLocalized(content.founders.lead, locale),
    foundersHelp: pickAboutLocalized(content.founders.help, locale),
    foundersAlt: pickAboutLocalized(content.founders.alt, locale),
    foundersCaption: pickAboutLocalized(content.founders.caption, locale),
    founderAName: pickAboutLocalized(content.founders.aName, locale),
    founderARole: pickAboutLocalized(content.founders.aRole, locale),
    founderABody: pickAboutLocalized(content.founders.aBody, locale),
    founderBName: pickAboutLocalized(content.founders.bName, locale),
    founderBRole: pickAboutLocalized(content.founders.bRole, locale),
    founderBBody: pickAboutLocalized(content.founders.bBody, locale),
    closerEyebrow: pickAboutLocalized(content.closer.eyebrow, locale),
    closerTitle: pickAboutLocalized(content.closer.title, locale),
    closerBody: pickAboutLocalized(content.closer.body, locale),
    closerLine: pickAboutLocalized(content.closer.line, locale),
    closerNextLabel: pickAboutLocalized(content.closer.nextLabel, locale),
    closerNext: content.closer.next.map((item) => pickAboutLocalized(item, locale)),
    closerNote: pickAboutLocalized(content.closer.note, locale),
    joinTitle: pickAboutLocalized(content.join.title, locale),
    joinBody: pickAboutLocalized(content.join.body, locale),
    joinProcessLabel: pickAboutLocalized(content.join.processLabel, locale),
    joinCta: pickAboutLocalized(content.join.cta, locale),
    joinProcess: content.join.steps.map((step) => [
      step.num,
      pickAboutLocalized(step.title, locale),
      pickAboutLocalized(step.body, locale),
    ]),
    dummyCaption: pickAboutLocalized(content.media.dummyCaption, locale),
    workshopAlt: pickAboutLocalized(content.media.workshopAlt, locale),
    teamRealAlt: pickAboutLocalized(content.media.teamRealAlt, locale),
    caseHotelAlt: pickAboutLocalized(content.media.caseHotelAlt, locale),
    featuredClientNames: content.experience.featuredClientNames.filter(Boolean),
    workPhoto: content.media.workPhoto,
    foundersPhoto: content.media.foundersPhoto,
    workshopPhoto: content.media.workshopPhoto,
    teamRealPhoto: content.media.teamRealPhoto,
    caseHotelPhoto: content.media.caseHotelPhoto,
    pillarPhotos: content.media.pillarPhotos,
  };
}

export function aboutFaqsForLocale(content: CmsAboutPage, locale: Locale): FaqItem[] {
  return content.faqs
    .map((item) => ({ q: pickAboutLocalized(item.q, locale), a: pickAboutLocalized(item.a, locale) }))
    .filter((item) => item.q || item.a);
}

export function isAboutCmsBody(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as { template?: string; version?: number };
    return parsed?.template === ABOUT_CMS_TEMPLATE && parsed?.version === 1;
  } catch {
    return false;
  }
}

export function parseAboutPageBody(raw: string): CmsAboutPage | null {
  try {
    const parsed = JSON.parse(raw) as Partial<CmsAboutPage> & { template?: string; version?: number };
    if (parsed.template !== ABOUT_CMS_TEMPLATE || parsed.version !== 1) return null;
    const fallback = defaultAboutCms();
    return {
      ...fallback,
      ...parsed,
      version: 1,
      template: ABOUT_CMS_TEMPLATE,
      hero: {
        kicker: asLocalized(parsed.hero?.kicker, fallback.hero.kicker),
        h1: asLocalized(parsed.hero?.h1, fallback.hero.h1),
        highlight: asLocalized(parsed.hero?.highlight, fallback.hero.highlight),
        heroBody: asLocalized(parsed.hero?.heroBody, fallback.hero.heroBody),
        workAlt: asLocalized(parsed.hero?.workAlt, fallback.hero.workAlt),
        auditCta: asLocalized(parsed.hero?.auditCta, fallback.hero.auditCta),
        secondaryCta: asLocalized(parsed.hero?.secondaryCta, fallback.hero.secondaryCta),
      },
      partner: {
        ...fallback.partner,
        ...(parsed.partner ?? {}),
        eyebrow: asLocalized(parsed.partner?.eyebrow, fallback.partner.eyebrow),
        title: asLocalized(parsed.partner?.title, fallback.partner.title),
        lead: asLocalized(parsed.partner?.lead, fallback.partner.lead),
        goal: asLocalized(parsed.partner?.goal, fallback.partner.goal),
        accent: asLocalized(parsed.partner?.accent, fallback.partner.accent),
        storyVisualLabel: asLocalized(parsed.partner?.storyVisualLabel, fallback.partner.storyVisualLabel),
        visionLabel: asLocalized(parsed.partner?.visionLabel, fallback.partner.visionLabel),
        vision: asLocalized(parsed.partner?.vision, fallback.partner.vision),
        missionLabel: asLocalized(parsed.partner?.missionLabel, fallback.partner.missionLabel),
        mission: asLocalized(parsed.partner?.mission, fallback.partner.mission),
        stages:
          Array.isArray(parsed.partner?.stages) && parsed.partner.stages.length
            ? parsed.partner.stages.map((stage, index) => ({
                id: typeof stage?.id === "string" && stage.id ? stage.id : `stage-${index + 1}`,
                num: typeof stage?.num === "string" ? stage.num : fallback.partner.stages[index]?.num ?? String(index + 1),
                title: asLocalized(stage?.title, fallback.partner.stages[index]?.title ?? emptyAboutLocalized()),
                body: asLocalized(stage?.body, fallback.partner.stages[index]?.body ?? emptyAboutLocalized()),
              }))
            : fallback.partner.stages,
      },
      method: {
        ...fallback.method,
        ...(parsed.method ?? {}),
        title: asLocalized(parsed.method?.title, fallback.method.title),
        stepsLabel: asLocalized(parsed.method?.stepsLabel, fallback.method.stepsLabel),
        outputLabel: asLocalized(parsed.method?.outputLabel, fallback.method.outputLabel),
        note: asLocalized(parsed.method?.note, fallback.method.note),
        steps:
          Array.isArray(parsed.method?.steps) && parsed.method.steps.length
            ? parsed.method.steps.map((step, index) => ({
                id: typeof step?.id === "string" && step.id ? step.id : `method-${index + 1}`,
                num: typeof step?.num === "string" ? step.num : fallback.method.steps[index]?.num ?? String(index + 1),
                title: asLocalized(step?.title, fallback.method.steps[index]?.title ?? emptyAboutLocalized()),
                output: asLocalized(step?.output, fallback.method.steps[index]?.output ?? emptyAboutLocalized()),
              }))
            : fallback.method.steps,
      },
      pillars: {
        title: asLocalized(parsed.pillars?.title, fallback.pillars.title),
        receiveLabel: asLocalized(parsed.pillars?.receiveLabel, fallback.pillars.receiveLabel),
        sampleBadge: asLocalized(parsed.pillars?.sampleBadge, fallback.pillars.sampleBadge),
        items:
          Array.isArray(parsed.pillars?.items) && parsed.pillars.items.length
            ? parsed.pillars.items.map((item, index) => ({
                id: typeof item?.id === "string" && item.id ? item.id : `pillar-${index + 1}`,
                num: typeof item?.num === "string" ? item.num : fallback.pillars.items[index]?.num ?? String(index + 1),
                title: asLocalized(item?.title, fallback.pillars.items[index]?.title ?? emptyAboutLocalized()),
                subtitle: asLocalized(item?.subtitle, fallback.pillars.items[index]?.subtitle ?? emptyAboutLocalized()),
                body: asLocalized(item?.body, fallback.pillars.items[index]?.body ?? emptyAboutLocalized()),
                tags: asLocalized(item?.tags, fallback.pillars.items[index]?.tags ?? emptyAboutLocalized()),
                receive: asLocalized(item?.receive, fallback.pillars.items[index]?.receive ?? emptyAboutLocalized()),
              }))
            : fallback.pillars.items,
      },
      experience: {
        title: asLocalized(parsed.experience?.title, fallback.experience.title),
        body: asLocalized(parsed.experience?.body, fallback.experience.body),
        metric: asLocalized(parsed.experience?.metric, fallback.experience.metric),
        scope: asLocalized(parsed.experience?.scope, fallback.experience.scope),
        note: asLocalized(parsed.experience?.note, fallback.experience.note),
        clientsEyebrow: asLocalized(parsed.experience?.clientsEyebrow, fallback.experience.clientsEyebrow),
        featuredClientNames: Array.isArray(parsed.experience?.featuredClientNames)
          ? parsed.experience.featuredClientNames.map(String)
          : fallback.experience.featuredClientNames,
      },
      values: {
        title: asLocalized(parsed.values?.title, fallback.values.title),
        processLink: asLocalized(parsed.values?.processLink, fallback.values.processLink),
        items:
          Array.isArray(parsed.values?.items) && parsed.values.items.length
            ? parsed.values.items.map((item, index) => ({
                id: typeof item?.id === "string" && item.id ? item.id : `value-${index + 1}`,
                num: typeof item?.num === "string" ? item.num : fallback.values.items[index]?.num ?? String(index + 1),
                title: asLocalized(item?.title, fallback.values.items[index]?.title ?? emptyAboutLocalized()),
                body: asLocalized(item?.body, fallback.values.items[index]?.body ?? emptyAboutLocalized()),
              }))
            : fallback.values.items,
      },
      founders: {
        eyebrow: asLocalized(parsed.founders?.eyebrow, fallback.founders.eyebrow),
        title: asLocalized(parsed.founders?.title, fallback.founders.title),
        lead: asLocalized(parsed.founders?.lead, fallback.founders.lead),
        help: asLocalized(parsed.founders?.help, fallback.founders.help),
        alt: asLocalized(parsed.founders?.alt, fallback.founders.alt),
        caption: asLocalized(parsed.founders?.caption, fallback.founders.caption),
        aName: asLocalized(parsed.founders?.aName, fallback.founders.aName),
        aRole: asLocalized(parsed.founders?.aRole, fallback.founders.aRole),
        aBody: asLocalized(parsed.founders?.aBody, fallback.founders.aBody),
        bName: asLocalized(parsed.founders?.bName, fallback.founders.bName),
        bRole: asLocalized(parsed.founders?.bRole, fallback.founders.bRole),
        bBody: asLocalized(parsed.founders?.bBody, fallback.founders.bBody),
      },
      closer: {
        eyebrow: asLocalized(parsed.closer?.eyebrow, fallback.closer.eyebrow),
        title: asLocalized(parsed.closer?.title, fallback.closer.title),
        body: asLocalized(parsed.closer?.body, fallback.closer.body),
        line: asLocalized(parsed.closer?.line, fallback.closer.line),
        nextLabel: asLocalized(parsed.closer?.nextLabel, fallback.closer.nextLabel),
        note: asLocalized(parsed.closer?.note, fallback.closer.note),
        next:
          Array.isArray(parsed.closer?.next) && parsed.closer.next.length
            ? parsed.closer.next.map((item, index) => asLocalized(item, fallback.closer.next[index] ?? emptyAboutLocalized()))
            : fallback.closer.next,
      },
      join: {
        title: asLocalized(parsed.join?.title, fallback.join.title),
        body: asLocalized(parsed.join?.body, fallback.join.body),
        processLabel: asLocalized(parsed.join?.processLabel, fallback.join.processLabel),
        cta: asLocalized(parsed.join?.cta, fallback.join.cta),
        steps:
          Array.isArray(parsed.join?.steps) && parsed.join.steps.length
            ? parsed.join.steps.map((step, index) => ({
                id: typeof step?.id === "string" && step.id ? step.id : `join-${index + 1}`,
                num: typeof step?.num === "string" ? step.num : fallback.join.steps[index]?.num ?? String(index + 1),
                title: asLocalized(step?.title, fallback.join.steps[index]?.title ?? emptyAboutLocalized()),
                body: asLocalized(step?.body, fallback.join.steps[index]?.body ?? emptyAboutLocalized()),
              }))
            : fallback.join.steps,
      },
      media: {
        workPhoto: typeof parsed.media?.workPhoto === "string" ? parsed.media.workPhoto : fallback.media.workPhoto,
        foundersPhoto:
          typeof parsed.media?.foundersPhoto === "string" ? parsed.media.foundersPhoto : fallback.media.foundersPhoto,
        workshopPhoto:
          typeof parsed.media?.workshopPhoto === "string" ? parsed.media.workshopPhoto : fallback.media.workshopPhoto,
        teamRealPhoto:
          typeof parsed.media?.teamRealPhoto === "string" ? parsed.media.teamRealPhoto : fallback.media.teamRealPhoto,
        caseHotelPhoto:
          typeof parsed.media?.caseHotelPhoto === "string" ? parsed.media.caseHotelPhoto : fallback.media.caseHotelPhoto,
        pillarPhotos: Array.isArray(parsed.media?.pillarPhotos)
          ? [
              String(parsed.media.pillarPhotos[0] ?? fallback.media.pillarPhotos[0]),
              String(parsed.media.pillarPhotos[1] ?? fallback.media.pillarPhotos[1]),
              String(parsed.media.pillarPhotos[2] ?? fallback.media.pillarPhotos[2]),
            ]
          : fallback.media.pillarPhotos,
        dummyCaption: asLocalized(parsed.media?.dummyCaption, fallback.media.dummyCaption),
        workshopAlt: asLocalized(parsed.media?.workshopAlt, fallback.media.workshopAlt),
        teamRealAlt: asLocalized(parsed.media?.teamRealAlt, fallback.media.teamRealAlt),
        caseHotelAlt: asLocalized(parsed.media?.caseHotelAlt, fallback.media.caseHotelAlt),
      },
      faqs:
        Array.isArray(parsed.faqs) && parsed.faqs.length
          ? parsed.faqs.map((item, index) => ({
              id: typeof item?.id === "string" && item.id ? item.id : `faq-${index + 1}`,
              q: asLocalized(item?.q, fallback.faqs[index]?.q ?? emptyAboutLocalized()),
              a: asLocalized(item?.a, fallback.faqs[index]?.a ?? emptyAboutLocalized()),
            }))
          : fallback.faqs,
    };
  } catch {
    return null;
  }
}

export function serializeAboutPageBody(content: CmsAboutPage): string {
  return JSON.stringify(content);
}

export function isAboutPageDocument(doc: { template?: string; slug?: string } | null | undefined) {
  if (!doc) return false;
  return doc.template === ABOUT_CMS_TEMPLATE || doc.slug === ABOUT_PAGE_SLUG || doc.slug === "about";
}

export function newAboutFaqId() {
  return `faq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
