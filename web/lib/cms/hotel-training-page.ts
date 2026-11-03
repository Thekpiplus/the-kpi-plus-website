import type { Locale } from "@/lib/seo";
import { pages } from "@/lib/seo";
import {
  HOTEL_TRAINING_ASSESS,
  HOTEL_TRAINING_ASSESS_VISUAL,
  HOTEL_TRAINING_ENQUIRY_VISUAL,
  HOTEL_TRAINING_FOLLOW,
  HOTEL_TRAINING_GALLERY,
  HOTEL_TRAINING_GALLERY_PLACEHOLDER,
  HOTEL_TRAINING_HERO_VISUAL,
  HOTEL_TRAINING_JOURNEY,
  HOTEL_TRAINING_JOURNEY_VISUAL,
  HOTEL_TRAINING_MATRIX,
  HOTEL_TRAINING_MATRIX_VISUAL,
  HOTEL_TRAINING_NEEDS,
  HOTEL_TRAINING_NEEDS_VISUAL,
  HOTEL_TRAINING_OUTCOME_LEVEL_IDS,
  HOTEL_TRAINING_OUTCOME_VISUAL,
  HOTEL_TRAINING_OUTCOMES,
  HOTEL_TRAINING_FAQS,
  HOTEL_TRAINING_PHOTOS,
  HOTEL_TRAINING_PROGRAMS,
  HOTEL_TRAINING_RELATED_VISUAL,
  HOTEL_TRAINING_TRAINER,
  HOTEL_TRAINING_TRAINER_VISUAL,
  hotelTrainingCopy,
  hotelTrainingEnquiryCopy,
  hotelTrainingIsLibraryPlaceholder,
  hotelTrainingRelatedCards,
} from "@/lib/hotel-training";

export const HOTEL_TRAINING_CMS_TEMPLATE = "hotel-training-team-development";
export const HOTEL_TRAINING_PAGE_SLUG = "solutions/hotel-training-team-development";
export const HOTEL_TRAINING_PAGE_ROUTE = "/solutions/hotel-training-team-development";
export const HOTEL_TRAINING_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type HotelTrainingCmsIntent = (typeof HOTEL_TRAINING_CMS_INTENTS)[number];
export const HOTEL_TRAINING_VISUAL_STATUSES = [
  { id: "replace", label: "Replace" },
  { id: "sample", label: "Sample" },
  { id: "approved", label: "Approved" },
] as const;
export type HotelTrainingVisualStatus = (typeof HOTEL_TRAINING_VISUAL_STATUSES)[number]["id"];
export const HOTEL_TRAINING_REVIEW_STATUSES = [
  { id: "sample", label: "Sample" },
  { id: "verified", label: "Verified" },
  { id: "review", label: "Requires Review" },
] as const;
export type HotelTrainingReviewStatus = (typeof HOTEL_TRAINING_REVIEW_STATUSES)[number]["id"];
export const HOTEL_TRAINING_CONSENT_STATUSES = [
  { id: "none", label: "No consent yet" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Publication consent" },
  { id: "redacted", label: "Redacted" },
] as const;
export type HotelTrainingConsentStatus = (typeof HOTEL_TRAINING_CONSENT_STATUSES)[number]["id"];
export const HOTEL_TRAINING_PROGRAM_FORMAT_IDS = ["inhouse", "workshop", "teambuilding", "online"] as const;

export function newHotelTrainingItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export type CmsHotelTrainingCta = { label: string; href: string };
export type CmsHotelTrainingLine = { id: string; th: string; en: string };
export type CmsHotelTrainingVisual = {
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
export type CmsHotelTrainingJourneyStep = {
  id: string;
  label: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  inputTh: string;
  inputEn: string;
  ownerTh: string;
  ownerEn: string;
  outputTh: string;
  outputEn: string;
  approvalTh: string;
  approvalEn: string;
  packageDependent: boolean;
  optional: boolean;
};
export type CmsHotelTrainingProgram = {
  id: string;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  audienceTh: string;
  audienceEn: string;
  problemTh: string;
  problemEn: string;
  outcomes: Array<{ th: string; en: string }>;
  formats: string[];
  durationTh: string;
  durationEn: string;
  groupSizeTh: string;
  groupSizeEn: string;
  activityTh: string;
  activityEn: string;
  assessTh: string;
  assessEn: string;
  href: string;
  ctaTh: string;
  ctaEn: string;
  durationVerified: boolean;
  groupSizeVerified: boolean;
  verified: boolean;
  sample: boolean;
};
export type CmsHotelTrainingGalleryItem = {
  id: string;
  src: string;
  altTh: string;
  altEn: string;
  captionTh: string;
  captionEn: string;
  topicTh: string;
  topicEn: string;
  year: string;
  dateLabel: string;
  consentStatus: string;
  redactionNote: string;
  redactionChecked: boolean;
  source: string;
  status: string;
  publicationApproved: boolean;
};

export function blankHotelTrainingGalleryItem(): CmsHotelTrainingGalleryItem {
  return {
    id: newHotelTrainingItemId("gallery"),
    src: HOTEL_TRAINING_GALLERY_PLACEHOLDER.src,
    altTh: HOTEL_TRAINING_GALLERY_PLACEHOLDER.altTh,
    altEn: HOTEL_TRAINING_GALLERY_PLACEHOLDER.altEn,
    captionTh: HOTEL_TRAINING_GALLERY_PLACEHOLDER.captionTh,
    captionEn: HOTEL_TRAINING_GALLERY_PLACEHOLDER.captionEn,
    topicTh: "",
    topicEn: "",
    year: "",
    dateLabel: "",
    consentStatus: "none",
    redactionNote: "",
    redactionChecked: false,
    source: "",
    status: "sample",
    publicationApproved: false,
  };
}
export type CmsHotelTrainingOutcome = {
  id: string;
  level: string;
  metricTh: string;
  metricEn: string;
  beforeTh: string;
  beforeEn: string;
  afterTh: string;
  afterEn: string;
  followTh: string;
  followEn: string;
  definitionTh: string;
  definitionEn: string;
  methodTh: string;
  methodEn: string;
  reviewerTh: string;
  reviewerEn: string;
  periodTh: string;
  periodEn: string;
  sourceTh: string;
  sourceEn: string;
  ownerTh: string;
  ownerEn: string;
  reviewStatus: string;
  sample: boolean;
};

export function blankHotelTrainingProgram(): CmsHotelTrainingProgram {
  return {
    id: newHotelTrainingItemId("program"),
    categoryTh: "",
    categoryEn: "",
    titleTh: "",
    titleEn: "",
    audienceTh: "",
    audienceEn: "",
    problemTh: "",
    problemEn: "",
    outcomes: [{ th: "", en: "" }],
    formats: ["inhouse"],
    durationTh: "",
    durationEn: "",
    groupSizeTh: "",
    groupSizeEn: "",
    activityTh: "",
    activityEn: "",
    assessTh: "",
    assessEn: "",
    href: "#training-enquiry",
    ctaTh: "ส่งคำขอ",
    ctaEn: "Send request",
    durationVerified: false,
    groupSizeVerified: false,
    verified: false,
    sample: true,
  };
}

export function blankHotelTrainingJourneyStep(): CmsHotelTrainingJourneyStep {
  return {
    id: newHotelTrainingItemId("step"),
    label: "",
    titleTh: "",
    titleEn: "",
    bodyTh: "",
    bodyEn: "",
    inputTh: "",
    inputEn: "",
    ownerTh: "",
    ownerEn: "",
    outputTh: "",
    outputEn: "",
    approvalTh: "",
    approvalEn: "",
    packageDependent: false,
    optional: false,
  };
}

export function blankHotelTrainingAssessItem(): CmsHotelTrainingAssessItem {
  return {
    id: newHotelTrainingItemId("assess"),
    label: "",
    meaningTh: "",
    meaningEn: "",
    evidenceTh: "",
    evidenceEn: "",
    statusTh: "ยังไม่ตั้งค่า — ตัวอย่าง",
    statusEn: "Not set — Sample",
    sample: true,
  };
}

export function blankHotelTrainingFollowItem(): CmsHotelTrainingFollow {
  return { id: newHotelTrainingItemId("follow"), labelTh: "", labelEn: "", meaningTh: "", meaningEn: "", valueTh: "", valueEn: "" };
}

export function blankHotelTrainingMatrixRow(): CmsHotelTrainingMatrixRow {
  return {
    id: newHotelTrainingItemId("matrix"),
    roleTh: "",
    roleEn: "",
    skillTh: "",
    skillEn: "",
    activityTh: "",
    activityEn: "",
    assessTh: "",
    assessEn: "",
    sample: true,
  };
}

export function blankHotelTrainingRelatedCard(): CmsHotelTrainingRelatedCard {
  return {
    id: newHotelTrainingItemId("related"),
    href: "",
    featured: false,
    external: false,
    categoryTh: "",
    categoryEn: "",
    titleTh: "",
    titleEn: "",
    descriptionTh: "",
    descriptionEn: "",
    publishedAt: "",
    updatedAt: "",
    dateKind: "",
    contentTypeTh: "",
    contentTypeEn: "",
    ctaTh: "ดูรายละเอียด",
    ctaEn: "See details",
  };
}

export function blankHotelTrainingOutcomeItem(): CmsHotelTrainingOutcome {
  return {
    id: newHotelTrainingItemId("outcome"),
    level: "immediate",
    metricTh: "",
    metricEn: "",
    beforeTh: "",
    beforeEn: "",
    afterTh: "",
    afterEn: "",
    followTh: "",
    followEn: "",
    definitionTh: "",
    definitionEn: "",
    methodTh: "",
    methodEn: "",
    reviewerTh: "",
    reviewerEn: "",
    periodTh: "",
    periodEn: "",
    sourceTh: "",
    sourceEn: "",
    ownerTh: "",
    ownerEn: "",
    reviewStatus: "sample",
    sample: true,
  };
}
export type CmsHotelTrainingMatrixRow = {
  id: string;
  roleTh: string;
  roleEn: string;
  skillTh: string;
  skillEn: string;
  activityTh: string;
  activityEn: string;
  assessTh: string;
  assessEn: string;
  sample: boolean;
};
export type CmsHotelTrainingAssessItem = {
  id: string;
  label: string;
  meaningTh: string;
  meaningEn: string;
  evidenceTh: string;
  evidenceEn: string;
  statusTh: string;
  statusEn: string;
  sample: boolean;
};
export type CmsHotelTrainingFollow = {
  id: string;
  labelTh: string;
  labelEn: string;
  meaningTh: string;
  meaningEn: string;
  valueTh: string;
  valueEn: string;
};
export type CmsHotelTrainingFaq = { id: string; qTh: string; qEn: string; aTh: string; aEn: string };
export type CmsHotelTrainingRelatedCard = {
  id: string;
  href: string;
  featured: boolean;
  external: boolean;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  publishedAt: string;
  updatedAt: string;
  dateKind: string;
  contentTypeTh: string;
  contentTypeEn: string;
  ctaTh: string;
  ctaEn: string;
};
export type CmsHotelTrainingPage = {
  version: 1;
  template: typeof HOTEL_TRAINING_CMS_TEMPLATE;
  bilingualPublish: boolean;
  faqLead: string;
  faqLeadEn: string;
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleRest: string;
    description: string;
    close: string;
    underCta: string;
    primaryCta: CmsHotelTrainingCta;
    secondaryCta: CmsHotelTrainingCta;
    trust: CmsHotelTrainingLine[];
    visual: CmsHotelTrainingVisual;
  };
  needs: { title: string; lead: string; visual: CmsHotelTrainingVisual; items: CmsHotelTrainingLine[] };
  journey: { title: string; lead: string; visual: CmsHotelTrainingVisual; steps: CmsHotelTrainingJourneyStep[] };
  programs: { title: string; lead: string; items: CmsHotelTrainingProgram[] };
  assess: { title: string; lead: string; caption: string; visual: CmsHotelTrainingVisual; items: CmsHotelTrainingAssessItem[] };
  gallery: { title: string; lead: string; items: CmsHotelTrainingGalleryItem[] };
  matrix: { title: string; lead: string; caption: string; visual: CmsHotelTrainingVisual; items: CmsHotelTrainingMatrixRow[] };
  outcomes: { title: string; lead: string; caption: string; visual: CmsHotelTrainingVisual; items: CmsHotelTrainingOutcome[] };
  trainer: {
    title: string;
    lead: string;
    name: string;
    nameEn: string;
    roleTh: string;
    roleEn: string;
    experienceTh: string;
    experienceEn: string;
    topics: Array<{ th: string; en: string }>;
    formatTh: string;
    formatEn: string;
    engagementsTh: string;
    engagementsEn: string;
    qualificationsTh: string;
    qualificationsEn: string;
    languagesTh: string;
    languagesEn: string;
    bioTh: string;
    bioEn: string;
    proofSource: string;
    qualificationsVerified: boolean;
    experienceVerified: boolean;
    languagesVerified: boolean;
    src: string;
    altTh: string;
    altEn: string;
    status: string;
    publicationApproved: boolean;
    sample: boolean;
  };
  follow: { title: string; lead: string; items: CmsHotelTrainingFollow[] };
  partners: { title: string; body: string };
  related: { title: string; lead: string; visual: CmsHotelTrainingVisual; cards: CmsHotelTrainingRelatedCard[] };
  form: {
    heading: string;
    lead: string;
    visual: CmsHotelTrainingVisual;
    labels: {
      consentTh: string;
      consentEn: string;
      privacyTh: string;
      privacyEn: string;
      requiredTh: string;
      requiredEn: string;
      requiredMsgTh: string;
      requiredMsgEn: string;
      consentRequiredTh: string;
      consentRequiredEn: string;
      submitTh: string;
      submitEn: string;
      secretMsgTh: string;
      secretMsgEn: string;
    };
  };
  faqs: CmsHotelTrainingFaq[];
  seo: { canonical: string; social: CmsHotelTrainingVisual; variants: Array<{ locale: string; title: string; description: string; canonical: string }> };
  approvals: { teamPhotos: boolean; results: boolean; evidenceNote: string };
};

export type HotelTrainingEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsHotelTrainingPage;
};
export type HotelTrainingCmsSaveResult = { ok: true; id: string; intent: HotelTrainingCmsIntent } | { ok: false; error: string };

function emptyVisual(): CmsHotelTrainingVisual {
  return { src: "", altTh: "", altEn: "", status: "sample", label: "Sample", caption: "Sample", source: "", approvalNote: "", publicationApproved: false };
}

export function defaultHotelTrainingCms(locale: Locale = "th"): CmsHotelTrainingPage {
  const thai = locale === "th";
  const copy = thai ? hotelTrainingCopy.th : hotelTrainingCopy.en;
  const enquiry = hotelTrainingEnquiryCopy(locale);
  return {
    version: 1,
    template: HOTEL_TRAINING_CMS_TEMPLATE,
    bilingualPublish: true,
    faqLead: hotelTrainingCopy.th.faqLead,
    faqLeadEn: hotelTrainingCopy.en.faqLead,
    hero: {
      eyebrow: copy.eyebrow,
      titleLead: copy.titleLead,
      titleAccent: copy.titleAccent,
      titleRest: copy.titleRest,
      description: copy.lead,
      close: copy.leadClose,
      underCta: copy.underCta,
      primaryCta: { label: copy.cta, href: "#training-enquiry" },
      secondaryCta: { label: copy.secondary, href: "#training-programs" },
      trust: copy.trust.map((item, index) => ({ id: `trust-${index + 1}`, th: hotelTrainingCopy.th.trust[index], en: hotelTrainingCopy.en.trust[index] })),
      visual: {
        src: HOTEL_TRAINING_HERO_VISUAL.src,
        altTh: HOTEL_TRAINING_HERO_VISUAL.altTh,
        altEn: HOTEL_TRAINING_HERO_VISUAL.altEn,
        status: HOTEL_TRAINING_HERO_VISUAL.status,
        label: thai ? HOTEL_TRAINING_HERO_VISUAL.labelTh : HOTEL_TRAINING_HERO_VISUAL.labelEn,
        caption: thai ? HOTEL_TRAINING_HERO_VISUAL.captionTh : HOTEL_TRAINING_HERO_VISUAL.captionEn,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
    },
    needs: {
      title: copy.needsTitle,
      lead: copy.needsLead,
      visual: {
        src: HOTEL_TRAINING_NEEDS_VISUAL.src,
        altTh: HOTEL_TRAINING_NEEDS_VISUAL.altTh,
        altEn: HOTEL_TRAINING_NEEDS_VISUAL.altEn,
        status: HOTEL_TRAINING_NEEDS_VISUAL.status,
        label: thai ? HOTEL_TRAINING_NEEDS_VISUAL.labelTh : HOTEL_TRAINING_NEEDS_VISUAL.labelEn,
        caption: thai ? HOTEL_TRAINING_NEEDS_VISUAL.captionTh : HOTEL_TRAINING_NEEDS_VISUAL.captionEn,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
      items: HOTEL_TRAINING_NEEDS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    },
    journey: {
      title: copy.journeyTitle,
      lead: copy.journeyLead,
      visual: {
        src: HOTEL_TRAINING_JOURNEY_VISUAL.src,
        altTh: HOTEL_TRAINING_JOURNEY_VISUAL.altTh,
        altEn: HOTEL_TRAINING_JOURNEY_VISUAL.altEn,
        status: "sample",
        label: thai ? HOTEL_TRAINING_JOURNEY_VISUAL.labelTh : HOTEL_TRAINING_JOURNEY_VISUAL.labelEn,
        caption: thai ? HOTEL_TRAINING_JOURNEY_VISUAL.captionTh : HOTEL_TRAINING_JOURNEY_VISUAL.captionEn,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
      steps: HOTEL_TRAINING_JOURNEY.map((item) => ({
        ...item,
        optional: item.packageDependent,
      })),
    },
    programs: {
      title: copy.programsTitle,
      lead: copy.programsLead,
      items: HOTEL_TRAINING_PROGRAMS.map((item) => ({
        ...item,
        outcomes: item.outcomes.map((row) => ({ ...row })),
        formats: [...item.formats],
        durationVerified: false,
        groupSizeVerified: false,
        verified: false,
        sample: Boolean(item.sample),
      })),
    },
    assess: {
      title: copy.assessTitle,
      lead: copy.assessLead,
      caption: copy.assessCaption,
      visual: {
        src: HOTEL_TRAINING_ASSESS_VISUAL.src,
        altTh: HOTEL_TRAINING_ASSESS_VISUAL.altTh,
        altEn: HOTEL_TRAINING_ASSESS_VISUAL.altEn,
        status: "sample",
        label: thai ? HOTEL_TRAINING_ASSESS_VISUAL.labelTh : HOTEL_TRAINING_ASSESS_VISUAL.labelEn,
        caption: thai ? HOTEL_TRAINING_ASSESS_VISUAL.captionTh : HOTEL_TRAINING_ASSESS_VISUAL.captionEn,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
      items: HOTEL_TRAINING_ASSESS.map((item) => ({ ...item })),
    },
    gallery: {
      title: copy.galleryTitle,
      lead: copy.galleryLead,
      items: HOTEL_TRAINING_GALLERY.map((item) => ({
        id: item.id,
        src: item.src,
        altTh: item.altTh,
        altEn: item.altEn,
        captionTh: item.captionTh,
        captionEn: item.captionEn,
        topicTh: "",
        topicEn: "",
        year: "",
        dateLabel: "",
        consentStatus: item.publicationApproved ? "approved" : "none",
        redactionNote: "",
        redactionChecked: Boolean(item.publicationApproved),
        source: "",
        status: item.publicationApproved ? "approved" : "sample",
        publicationApproved: item.publicationApproved,
      })),
    },
    matrix: {
      title: copy.matrixTitle,
      lead: copy.matrixLead,
      caption: copy.matrixCaption,
      visual: {
        src: HOTEL_TRAINING_MATRIX_VISUAL.src,
        altTh: HOTEL_TRAINING_MATRIX_VISUAL.altTh,
        altEn: HOTEL_TRAINING_MATRIX_VISUAL.altEn,
        status: "sample",
        label: thai ? HOTEL_TRAINING_MATRIX_VISUAL.labelTh : HOTEL_TRAINING_MATRIX_VISUAL.labelEn,
        caption: copy.matrixCaption,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
      items: HOTEL_TRAINING_MATRIX.map((item) => ({ ...item })),
    },
    outcomes: {
      title: copy.outcomesTitle,
      lead: copy.outcomesLead,
      caption: copy.outcomesCaption,
      visual: {
        src: HOTEL_TRAINING_OUTCOME_VISUAL.src,
        altTh: HOTEL_TRAINING_OUTCOME_VISUAL.altTh,
        altEn: HOTEL_TRAINING_OUTCOME_VISUAL.altEn,
        status: "sample",
        label: thai ? HOTEL_TRAINING_OUTCOME_VISUAL.labelTh : HOTEL_TRAINING_OUTCOME_VISUAL.labelEn,
        caption: copy.outcomesCaption,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
      items: HOTEL_TRAINING_OUTCOMES.map((item) => ({
        ...item,
        periodTh: "",
        periodEn: "",
        sourceTh: "",
        sourceEn: "",
        ownerTh: item.reviewerTh,
        ownerEn: item.reviewerEn,
        reviewStatus: item.sample ? "sample" : "review",
      })),
    },
    trainer: {
      title: copy.trainerTitle,
      lead: copy.trainerLead,
      name: copy.trainerName,
      nameEn: copy.trainerNameEn,
      roleTh: HOTEL_TRAINING_TRAINER.roleTh,
      roleEn: HOTEL_TRAINING_TRAINER.roleEn,
      experienceTh: HOTEL_TRAINING_TRAINER.experienceTh,
      experienceEn: HOTEL_TRAINING_TRAINER.experienceEn,
      topics: HOTEL_TRAINING_TRAINER.topics.map((item) => ({ ...item })),
      formatTh: HOTEL_TRAINING_TRAINER.formatTh,
      formatEn: HOTEL_TRAINING_TRAINER.formatEn,
      engagementsTh: HOTEL_TRAINING_TRAINER.engagementsTh,
      engagementsEn: HOTEL_TRAINING_TRAINER.engagementsEn,
      qualificationsTh: HOTEL_TRAINING_TRAINER.qualificationsTh,
      qualificationsEn: HOTEL_TRAINING_TRAINER.qualificationsEn,
      languagesTh: HOTEL_TRAINING_TRAINER.languagesTh,
      languagesEn: HOTEL_TRAINING_TRAINER.languagesEn,
      bioTh: "",
      bioEn: "",
      proofSource: "",
      qualificationsVerified: false,
      experienceVerified: Boolean(HOTEL_TRAINING_TRAINER.experienceTh.trim() || HOTEL_TRAINING_TRAINER.experienceEn.trim()),
      languagesVerified: false,
      src: HOTEL_TRAINING_TRAINER_VISUAL.src,
      altTh: hotelTrainingCopy.th.trainerAlt,
      altEn: hotelTrainingCopy.en.trainerAlt,
      status: "sample",
      publicationApproved: false,
      sample: true,
    },
    follow: {
      title: copy.followTitle,
      lead: copy.followLead,
      items: HOTEL_TRAINING_FOLLOW.map((item) => ({ ...item })),
    },
    partners: { title: copy.partnersTitle, body: copy.partnersBody },
    related: {
      title: copy.relatedTitle,
      lead: copy.relatedLead,
      visual: {
        src: HOTEL_TRAINING_RELATED_VISUAL.src,
        altTh: HOTEL_TRAINING_RELATED_VISUAL.altTh,
        altEn: HOTEL_TRAINING_RELATED_VISUAL.altEn,
        status: "sample",
        label: thai ? HOTEL_TRAINING_RELATED_VISUAL.labelTh : HOTEL_TRAINING_RELATED_VISUAL.labelEn,
        caption: thai ? HOTEL_TRAINING_RELATED_VISUAL.captionTh : HOTEL_TRAINING_RELATED_VISUAL.captionEn,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
      cards: hotelTrainingRelatedCards(locale).map((card) => ({
        ...card,
        featured: Boolean(card.featured),
        external: Boolean(card.external),
        publishedAt: card.publishedAt || "",
        updatedAt: card.updatedAt || "",
        dateKind: card.dateKind || "",
      })),
    },
    form: {
      heading: enquiry.heading,
      lead: enquiry.lead,
      labels: {
        consentTh: hotelTrainingEnquiryCopy("th").labels.consent,
        consentEn: hotelTrainingEnquiryCopy("en").labels.consent,
        privacyTh: hotelTrainingEnquiryCopy("th").labels.privacy,
        privacyEn: hotelTrainingEnquiryCopy("en").labels.privacy,
        requiredTh: hotelTrainingEnquiryCopy("th").labels.required,
        requiredEn: hotelTrainingEnquiryCopy("en").labels.required,
        requiredMsgTh: hotelTrainingEnquiryCopy("th").labels.requiredMsg,
        requiredMsgEn: hotelTrainingEnquiryCopy("en").labels.requiredMsg,
        consentRequiredTh: hotelTrainingEnquiryCopy("th").labels.consentRequired,
        consentRequiredEn: hotelTrainingEnquiryCopy("en").labels.consentRequired,
        submitTh: hotelTrainingEnquiryCopy("th").submit,
        submitEn: hotelTrainingEnquiryCopy("en").submit,
        secretMsgTh: hotelTrainingEnquiryCopy("th").labels.secretMsg,
        secretMsgEn: hotelTrainingEnquiryCopy("en").labels.secretMsg,
      },
      visual: {
        src: HOTEL_TRAINING_ENQUIRY_VISUAL.src,
        altTh: HOTEL_TRAINING_ENQUIRY_VISUAL.altTh,
        altEn: HOTEL_TRAINING_ENQUIRY_VISUAL.altEn,
        status: "sample",
        label: thai ? HOTEL_TRAINING_ENQUIRY_VISUAL.labelTh : HOTEL_TRAINING_ENQUIRY_VISUAL.labelEn,
        caption: thai ? HOTEL_TRAINING_ENQUIRY_VISUAL.captionTh : HOTEL_TRAINING_ENQUIRY_VISUAL.captionEn,
        source: "",
        approvalNote: "",
        publicationApproved: false,
      },
    },
    faqs: HOTEL_TRAINING_FAQS.map((item) => ({
      id: item.id,
      qTh: item.qTh,
      qEn: item.qEn,
      aTh: item.aTh,
      aEn: item.aEn,
    })),
    seo: {
      canonical: locale === "th" ? HOTEL_TRAINING_PAGE_ROUTE : `/en${HOTEL_TRAINING_PAGE_ROUTE}`,
      social: emptyVisual(),
      variants: [
        { locale: "en", title: "", description: "", canonical: "/en/solutions/hotel-training-team-development" },
        { locale: "ru", title: "", description: "", canonical: "/ru/solutions/hotel-training-team-development" },
        { locale: "zh", title: "", description: "", canonical: "/zh/solutions/hotel-training-team-development" },
      ],
    },
    approvals: { teamPhotos: false, results: false, evidenceNote: "" },
  };
}

function asText(row: Record<string, unknown>, key: string, fallback: string) {
  return String(row[key] ?? fallback ?? "");
}

const RETIRED_HERO_DESCRIPTIONS = [
  "เริ่มจากเป้าหมายทางธุรกิจ บทบาทในทีม ทักษะปัจจุบัน และงานที่คนต้องทำได้ จากนั้นจึงออกแบบการเรียนรู้ ฝึก ประเมิน และติดตามการนำไปใช้",
  "Start from the business goal, team roles, current skills, and the work people must perform. Then design the learning, practise, assess, and follow up on application.",
];

function retiredHeroDescription(value: string, fallback: string) {
  return RETIRED_HERO_DESCRIPTIONS.includes(value.trim()) ? fallback : value;
}

const RETIRED_NEEDS_TH = [
  "เป้าหมายทางธุรกิจของงานนี้คืออะไร และทีมต้องทำอะไรได้จึงจะรองรับเป้าหมายนั้น?",
  "ใครเกี่ยวข้องบ้าง บทบาทใดต้องตัดสินใจ ส่งต่อ หรือลงมือทำ?",
  "ทักษะปัจจุบันต่างจากทักษะที่งานต้องการตรงไหน?",
  "งานใดที่คนยังทำไม่มั่นใจ หรือยังส่งต่อกันไม่ติด?",
  "หลังเรียน ใครจะสนับสนุนการนำไปใช้ที่หน้างาน?",
  "ข้อมูลพนักงานและการประเมินรายบุคคลจะเก็บและจำกัดสิทธิ์อย่างไร?",
];

function asNeedsItems(value: unknown, fallback: CmsHotelTrainingLine[]) {
  const items = asList(value, fallback, (row, _i, item) => ({ id: String(row.id || item.id), th: String(row.th ?? item.th), en: String(row.en ?? item.en) }));
  const retired = items.length === RETIRED_NEEDS_TH.length && items.every((item) => RETIRED_NEEDS_TH.includes(item.th));
  return retired ? fallback : items;
}

const RETIRED_NEEDS_COPY = [
  "ทีมต้องทำอะไรได้ จึงจะรองรับเป้าหมาย?",
  "What must the team be able to do for the goal?",
  "ใช้เป็นคำถามตรวจเอง ไม่ใช่ข้อสรุปว่าทุกโรงแรมมีช่องว่างเหล่านี้ การอบรมที่เหมาะเริ่มจากงาน ไม่ใช่จากหัวข้อหลักสูตร",
  "Use these as self-check questions, not as a diagnosis of every hotel. Useful training starts from the work, not from a course title.",
];

function retiredNeedsCopy(value: string, fallback: string) {
  return RETIRED_NEEDS_COPY.includes(value.trim()) ? fallback : value;
}

const PROGRAM_FORMAT_IDS = [...HOTEL_TRAINING_PROGRAM_FORMAT_IDS];

function asProgramOutcomes(value: unknown, fallback: CmsHotelTrainingProgram["outcomes"]) {
  if (!Array.isArray(value)) return fallback;
  const rows = value.slice(0, 4).map((row, index) => {
    const item = (row ?? {}) as Record<string, unknown>;
    const seed = fallback[index] ?? fallback[0] ?? { th: "", en: "" };
    return { th: String(item.th ?? seed.th), en: String(item.en ?? seed.en) };
  });
  return rows.length ? rows : fallback;
}

function asProgramFormats(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const next = value.map(String).filter((id) => (PROGRAM_FORMAT_IDS as string[]).includes(id));
  return next.length ? next : fallback;
}

function asPrograms(value: unknown, fallback: CmsHotelTrainingProgram[]) {
  const items = asList(value, fallback, (row, _i, item) => ({
    ...item,
    id: String(row.id || item.id),
    categoryTh: String(row.categoryTh ?? item.categoryTh),
    categoryEn: String(row.categoryEn ?? item.categoryEn),
    titleTh: String(row.titleTh ?? item.titleTh),
    titleEn: String(row.titleEn ?? item.titleEn),
    audienceTh: String(row.audienceTh ?? item.audienceTh),
    audienceEn: String(row.audienceEn ?? item.audienceEn),
    problemTh: String(row.problemTh ?? item.problemTh),
    problemEn: String(row.problemEn ?? item.problemEn),
    outcomes: asProgramOutcomes(row.outcomes, item.outcomes),
    formats: asProgramFormats(row.formats, item.formats),
    durationTh: String(row.durationTh ?? item.durationTh ?? ""),
    durationEn: String(row.durationEn ?? item.durationEn ?? ""),
    groupSizeTh: String(row.groupSizeTh ?? item.groupSizeTh ?? ""),
    groupSizeEn: String(row.groupSizeEn ?? item.groupSizeEn ?? ""),
    activityTh: String(row.activityTh ?? item.activityTh),
    activityEn: String(row.activityEn ?? item.activityEn),
    assessTh: String(row.assessTh ?? item.assessTh),
    assessEn: String(row.assessEn ?? item.assessEn),
    href: String(row.href ?? item.href),
    ctaTh: String(row.ctaTh ?? item.ctaTh),
    ctaEn: String(row.ctaEn ?? item.ctaEn),
    durationVerified: Boolean(row.durationVerified ?? item.durationVerified),
    groupSizeVerified: Boolean(row.groupSizeVerified ?? item.groupSizeVerified),
    verified: Boolean(row.verified ?? item.verified),
    sample: Boolean(row.sample ?? item.sample),
  }));
  const retired = items.some((item) => item.id === "inhouse");
  return retired ? fallback : items;
}

const RETIRED_JOURNEY_COPY = [
  "เส้นทางการเรียนรู้",
  "The learning journey",
  "Discover → Design → Deliver → Assess → Follow-up แต่ละขั้นมีผลลัพธ์และเกตตัดสินใจ",
  "Discover → Design → Deliver → Assess → Follow-up. Each step has an output and a decision gate.",
  "การอบรมรวมการสำรวจความต้องการ ออกแบบการเรียนรู้ ฝึก ประเมิน และติดตาม ไม่ใช่วันอบรมอย่างเดียว ประเมินหลังเรียนและการติดตามที่หน้างานมีได้เมื่อตกลงขอบเขต",
  "Training includes needs discovery, learning design, practice, assessment, and follow-up—not only a training day. Post-assessment and workplace follow-up are available when agreed in scope.",
];
const RETIRED_JOURNEY_IDS = ["brief", "needs", "training", "practice", "postassess"];

function retiredJourneyCopy(value: string, fallback: string) {
  return RETIRED_JOURNEY_COPY.includes(value.trim()) ? fallback : value;
}

function asJourneySteps(value: unknown, fallback: CmsHotelTrainingJourneyStep[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const ids = value.map((row) => String((row as { id?: string } | undefined)?.id || ""));
  if (ids.some((id) => RETIRED_JOURNEY_IDS.includes(id))) return fallback;
  const items = value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback[index] ?? fallback[0];
    const packageDependent = Boolean(row.packageDependent ?? row.optional ?? seed.packageDependent);
    const outputTh = String(row.outputTh ?? row.deliverableTh ?? seed.outputTh);
    const outputEn = String(row.outputEn ?? row.deliverableEn ?? seed.outputEn);
    return {
      id: String(row.id || seed.id),
      label: String(row.label ?? seed.label),
      titleTh: String(row.titleTh ?? seed.titleTh),
      titleEn: String(row.titleEn ?? seed.titleEn),
      bodyTh: String(row.bodyTh ?? seed.bodyTh),
      bodyEn: String(row.bodyEn ?? seed.bodyEn),
      inputTh: String(row.inputTh ?? seed.inputTh),
      inputEn: String(row.inputEn ?? seed.inputEn),
      ownerTh: String(row.ownerTh ?? seed.ownerTh),
      ownerEn: String(row.ownerEn ?? seed.ownerEn),
      outputTh,
      outputEn,
      approvalTh: String(row.approvalTh ?? seed.approvalTh),
      approvalEn: String(row.approvalEn ?? seed.approvalEn),
      packageDependent,
      optional: packageDependent,
    };
  });
  return items;
}

const RETIRED_GALLERY_COPY = [
  "ใช้ภาพคนละชุดกับฮีโร่และจุดปัญหา หากมีผู้เข้าร่วม ต้องมีสิทธิ์เผยแพร่ก่อนใช้ต่อ",
  "These photos are a different set from the hero and the needs section. If participants appear, permission is required before reuse.",
];

function retiredGalleryCopy(value: string, fallback: string) {
  return RETIRED_GALLERY_COPY.includes(value.trim()) ? fallback : value;
}

const RETIRED_MATRIX_COPY = [
  "ตารางทักษะตัวอย่าง",
  "Sample skill matrix",
  "ใช้ดูบทบาทกับทักษะที่งานต้องการ ไม่ใช่ผลประเมินพนักงานจริง",
  "Use it to see roles against the skills the work needs. It is not a live employee assessment.",
  "ตารางตัวอย่าง Need / Practise / Apply ไม่ใช่คะแนนบุคคล",
  "Sample Need / Practise / Apply matrix. Not an individual score.",
];

function retiredMatrixCopy(value: string, fallback: string) {
  return RETIRED_MATRIX_COPY.includes(value.trim()) ? fallback : value;
}

function asMatrixRows(value: unknown, fallback: CmsHotelTrainingMatrixRow[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const items = value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback[index] ?? fallback[0];
    return {
      id: String(row.id || seed.id),
      roleTh: String(row.roleTh ?? seed.roleTh),
      roleEn: String(row.roleEn ?? seed.roleEn),
      skillTh: String(row.skillTh ?? seed.skillTh),
      skillEn: String(row.skillEn ?? seed.skillEn),
      activityTh: String(row.activityTh ?? seed.activityTh),
      activityEn: String(row.activityEn ?? seed.activityEn),
      assessTh: String(row.assessTh ?? seed.assessTh),
      assessEn: String(row.assessEn ?? seed.assessEn),
      sample: Boolean(row.sample ?? seed.sample),
    };
  });
  const retired = items.some((item) => ["handover", "guest", "decide", "coach", "tool"].includes(item.id));
  return retired ? fallback : items;
}

const RETIRED_RELATED_IDS = ["systems"];

function retiredRelatedCopy(value: string, fallback: string) {
  return value.trim() ? value : fallback;
}

const RETIRED_FORM_COPY = [
  "บอกเป้าหมาย บทบาท และงานที่อยากให้ทีมทำได้ดีขึ้น ไม่ต้องส่งรายชื่อพนักงาน คะแนนประเมิน หรือข้อมูลแขก",
  "Describe the goal, the roles, and the work the team should do better. Do not send employee names, assessment scores, or guest data.",
];

function retiredFormCopy(value: string, fallback: string) {
  const next = value.trim();
  if (!next || RETIRED_FORM_COPY.includes(next)) return fallback;
  return value;
}

function asRelatedCards(value: unknown, fallback: CmsHotelTrainingRelatedCard[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const ids = value.map((row) => String((row as { id?: string } | undefined)?.id || ""));
  if (ids.some((id) => RETIRED_RELATED_IDS.includes(id))) return fallback;
  const items = value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback.find((card) => card.id === String(row.id || "")) ?? fallback[index] ?? fallback[0];
    return {
      id: String(row.id || seed.id),
      href: String(row.href ?? seed.href),
      featured: Boolean(row.featured ?? seed.featured),
      external: Boolean(row.external ?? seed.external),
      categoryTh: String(row.categoryTh ?? seed.categoryTh),
      categoryEn: String(row.categoryEn ?? seed.categoryEn),
      titleTh: String(row.titleTh ?? seed.titleTh),
      titleEn: String(row.titleEn ?? seed.titleEn),
      descriptionTh: String(row.descriptionTh ?? seed.descriptionTh),
      descriptionEn: String(row.descriptionEn ?? seed.descriptionEn),
      publishedAt: String(row.publishedAt ?? seed.publishedAt),
      updatedAt: String(row.updatedAt ?? seed.updatedAt),
      dateKind: String(row.dateKind ?? seed.dateKind),
      contentTypeTh: String(row.contentTypeTh ?? seed.contentTypeTh),
      contentTypeEn: String(row.contentTypeEn ?? seed.contentTypeEn),
      ctaTh: String(row.ctaTh ?? seed.ctaTh),
      ctaEn: String(row.ctaEn ?? seed.ctaEn),
    };
  });
  return items;
}

const RETIRED_ASSESS_IDS = ["practice", "supervisor"];
const RETIRED_ASSESS_COPY = [
  "วิธีประเมินเลือกตามเป้าหมาย คะแนนรายบุคคลไม่แสดงบนหน้านี้",
  "The assessment method follows the goal. Individual scores are not shown on this page.",
];

function retiredAssessCopy(value: string, fallback: string) {
  const next = value.trim();
  if (!next || RETIRED_ASSESS_COPY.includes(next)) return fallback;
  return value;
}

function asAssessItems(value: unknown, fallback: CmsHotelTrainingAssessItem[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const ids = value.map((row) => String((row as { id?: string } | undefined)?.id || ""));
  if (ids.some((id) => RETIRED_ASSESS_IDS.includes(id))) return fallback;
  const items = value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback[index] ?? fallback[0];
    return {
      id: String(row.id || seed.id),
      label: String(row.label ?? seed.label),
      meaningTh: String(row.meaningTh ?? row.th ?? seed.meaningTh),
      meaningEn: String(row.meaningEn ?? row.en ?? seed.meaningEn),
      evidenceTh: String(row.evidenceTh ?? seed.evidenceTh),
      evidenceEn: String(row.evidenceEn ?? seed.evidenceEn),
      statusTh: String(row.statusTh ?? seed.statusTh),
      statusEn: String(row.statusEn ?? seed.statusEn),
      sample: Boolean(row.sample ?? seed.sample ?? true),
    };
  });
  return items;
}

const RETIRED_OUTCOME_IDS = ["participation", "confidence", "application", "followthrough"];
const RETIRED_OUTCOMES_COPY = [
  "สัญญาณที่อาจใช้ทบทวน",
  "Signals that may be reviewed",
  "เลือกตัวชี้วัดตามข้อมูลที่มีและเป้าหมายของงาน ไม่ใช่สัญญารับประกันผลทางธุรกิจ",
  "Choose measures from the data you have and the goal of the work. They are not a guaranteed business result.",
];

function retiredOutcomesCopy(value: string, fallback: string) {
  const next = value.trim();
  if (!next || RETIRED_OUTCOMES_COPY.includes(next)) return fallback;
  return value;
}

function asOutcomeRows(value: unknown, fallback: CmsHotelTrainingOutcome[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const ids = value.map((row) => String((row as { id?: string } | undefined)?.id || ""));
  if (ids.length === 4 && ids.every((id) => RETIRED_OUTCOME_IDS.includes(id))) return fallback;
  if (value.every((row) => row && typeof row === "object" && "label" in row && !("metricTh" in row) && !("beforeTh" in row))) return fallback;
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback[index] ?? fallback[0] ?? blankHotelTrainingOutcomeItem();
    const requested = String(row.level || seed.level);
    const level = HOTEL_TRAINING_OUTCOME_LEVEL_IDS.includes(requested as (typeof HOTEL_TRAINING_OUTCOME_LEVEL_IDS)[number]) ? requested : seed.level;
    return {
      id: String(row.id || seed.id),
      level,
      metricTh: String(row.metricTh ?? seed.metricTh),
      metricEn: String(row.metricEn ?? row.label ?? seed.metricEn),
      beforeTh: String(row.beforeTh ?? ""),
      beforeEn: String(row.beforeEn ?? ""),
      afterTh: String(row.afterTh ?? ""),
      afterEn: String(row.afterEn ?? ""),
      followTh: String(row.followTh ?? ""),
      followEn: String(row.followEn ?? ""),
      definitionTh: String(row.definitionTh ?? seed.definitionTh),
      definitionEn: String(row.definitionEn ?? seed.definitionEn),
      methodTh: String(row.methodTh ?? seed.methodTh),
      methodEn: String(row.methodEn ?? seed.methodEn),
      reviewerTh: String(row.reviewerTh ?? seed.reviewerTh),
      reviewerEn: String(row.reviewerEn ?? seed.reviewerEn),
      periodTh: String(row.periodTh ?? seed.periodTh ?? ""),
      periodEn: String(row.periodEn ?? seed.periodEn ?? ""),
      sourceTh: String(row.sourceTh ?? seed.sourceTh ?? ""),
      sourceEn: String(row.sourceEn ?? seed.sourceEn ?? ""),
      ownerTh: String(row.ownerTh ?? seed.ownerTh ?? row.reviewerTh ?? seed.reviewerTh ?? ""),
      ownerEn: String(row.ownerEn ?? seed.ownerEn ?? row.reviewerEn ?? seed.reviewerEn ?? ""),
      reviewStatus: String(row.reviewStatus ?? seed.reviewStatus ?? (Boolean(row.sample ?? seed.sample) ? "sample" : "review")),
      sample: Boolean(row.sample ?? seed.sample ?? true),
    };
  });
}

const RETIRED_TRAINER_COPY = [
  "งานด้าน Training นำโดยคุณเนตร",
  "Training work is led by Nate",
  "ผู้นำงานด้าน Training ของ เดอะ เคพีไอ พลัส มีประสบการณ์ด้าน Guest Relations และ Front Office รวมถึงงานบรรยายและกิจกรรมเตรียมความพร้อมในธุรกิจบริการ หน้านี้ไม่ระบุจำนวนปีหรือวุฒิบัตรที่ไม่มีในข้อมูลที่อนุมัติ",
  "She leads Training at The KPI Plus. She has guest-relations and front-office experience, and has led lectures and readiness activities in hospitality. This page does not add years of experience or certificates that are not in the approved record.",
  "ประสบการณ์ดูแลผู้เข้าพักและการทำงานกับทีมช่วยให้ออกแบบกิจกรรมจากงานจริงได้",
  "Experience looking after guests and working with teams helps design activities from real work.",
];

function retiredTrainerCopy(value: string, fallback: string) {
  const next = value.trim();
  if (!next || RETIRED_TRAINER_COPY.includes(next)) return fallback;
  return value;
}

function asTrainerTopics(value: unknown, fallback: CmsHotelTrainingPage["trainer"]["topics"]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return { th: String(row.th ?? "").trim(), en: String(row.en ?? "").trim() };
    })
    .filter((item) => item.th || item.en);
}

function asTrainer(value: unknown, fallback: CmsHotelTrainingPage["trainer"]): CmsHotelTrainingPage["trainer"] {
  const row = (value || {}) as Record<string, unknown>;
  const retired = RETIRED_TRAINER_COPY.includes(String(row.title ?? "").trim()) || RETIRED_TRAINER_COPY.includes(String(row.body ?? "").trim()) || RETIRED_TRAINER_COPY.includes(String(row.close ?? "").trim()) || (!row.roleTh && !row.experienceTh && Boolean(row.body));
  const src = asText(row, "src", fallback.src).trim() || fallback.src;
  if (retired) {
    return {
      ...fallback,
      src: src === HOTEL_TRAINING_PHOTOS.trainer ? fallback.src : src,
      altTh: asText(row, "altTh", fallback.altTh),
      altEn: asText(row, "altEn", fallback.altEn),
      status: asText(row, "status", fallback.status) || "sample",
      publicationApproved: Boolean(row.publicationApproved ?? false),
      sample: true,
    };
  }
  const topics = asTrainerTopics(row.topics, fallback.topics);
  return {
    title: retiredTrainerCopy(asText(row, "title", fallback.title), fallback.title),
    lead: retiredTrainerCopy(asText(row, "lead", fallback.lead), fallback.lead),
    name: asText(row, "name", fallback.name),
    nameEn: asText(row, "nameEn", fallback.nameEn),
    roleTh: asText(row, "roleTh", fallback.roleTh),
    roleEn: asText(row, "roleEn", fallback.roleEn),
    experienceTh: asText(row, "experienceTh", fallback.experienceTh),
    experienceEn: asText(row, "experienceEn", fallback.experienceEn),
    topics: topics.length ? topics : fallback.topics,
    formatTh: asText(row, "formatTh", fallback.formatTh),
    formatEn: asText(row, "formatEn", fallback.formatEn),
    engagementsTh: asText(row, "engagementsTh", fallback.engagementsTh),
    engagementsEn: asText(row, "engagementsEn", fallback.engagementsEn),
    qualificationsTh: String(row.qualificationsTh ?? fallback.qualificationsTh ?? ""),
    qualificationsEn: String(row.qualificationsEn ?? fallback.qualificationsEn ?? ""),
    languagesTh: String(row.languagesTh ?? fallback.languagesTh ?? ""),
    languagesEn: String(row.languagesEn ?? fallback.languagesEn ?? ""),
    bioTh: String(row.bioTh ?? fallback.bioTh ?? ""),
    bioEn: String(row.bioEn ?? fallback.bioEn ?? ""),
    proofSource: String(row.proofSource ?? fallback.proofSource ?? ""),
    qualificationsVerified: Boolean(row.qualificationsVerified ?? fallback.qualificationsVerified),
    experienceVerified: Boolean(row.experienceVerified ?? fallback.experienceVerified),
    languagesVerified: Boolean(row.languagesVerified ?? fallback.languagesVerified),
    src,
    altTh: asText(row, "altTh", fallback.altTh),
    altEn: asText(row, "altEn", fallback.altEn),
    status: asText(row, "status", fallback.status) || "sample",
    publicationApproved: Boolean(row.publicationApproved ?? fallback.publicationApproved),
    sample: Boolean(row.sample ?? fallback.sample ?? true),
  };
}

function asGalleryItems(value: unknown, fallback: CmsHotelTrainingGalleryItem[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const ids = value.map((row) => String((row as { id?: string } | undefined)?.id || ""));
  if (ids.join(",") === "group,leadership,circle,seminar") return fallback;
  return value.slice(0, 6).map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback[index] ?? fallback[0] ?? blankHotelTrainingGalleryItem();
    return {
      id: String(row.id || seed.id),
      src: String(row.src ?? seed.src),
      altTh: String(row.altTh ?? seed.altTh),
      altEn: String(row.altEn ?? seed.altEn),
      captionTh: String(row.captionTh ?? seed.captionTh),
      captionEn: String(row.captionEn ?? seed.captionEn),
      topicTh: String(row.topicTh ?? seed.topicTh ?? ""),
      topicEn: String(row.topicEn ?? seed.topicEn ?? ""),
      year: String(row.year ?? seed.year ?? ""),
      dateLabel: String(row.dateLabel ?? seed.dateLabel ?? ""),
      consentStatus: String(row.consentStatus ?? seed.consentStatus ?? (Boolean(row.publicationApproved ?? seed.publicationApproved) ? "approved" : "none")),
      redactionNote: String(row.redactionNote ?? seed.redactionNote ?? ""),
      redactionChecked: Boolean(row.redactionChecked ?? seed.redactionChecked ?? false),
      source: String(row.source ?? seed.source ?? ""),
      status: String(row.status ?? seed.status ?? (Boolean(row.publicationApproved ?? seed.publicationApproved) ? "approved" : "sample")),
      publicationApproved: Boolean(row.publicationApproved ?? seed.publicationApproved),
    };
  });
}

function asList<T>(value: unknown, fallback: T[], map: (row: Record<string, unknown>, index: number, seeded: T) => T): T[] {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => map((item ?? {}) as Record<string, unknown>, index, fallback[index] ?? fallback[0] ?? ({} as T)));
}

const RETIRED_FAQ_IDS = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8", "faq-9", "faq-10"];
const RETIRED_FAQ_QUESTIONS = [
  "ใครควรเข้าร่วม?",
  "Who should join?",
  "ใช้เวลากี่วัน?",
  "How long does it take?",
  "ประเมินผลอย่างไร?",
  "How is learning assessed?",
  "ข้อมูลพนักงานปลอดภัยอย่างไร?",
  "How is employee data kept private?",
  "หลังจบกิจกรรมมีการติดตามหรือไม่?",
  "Is there follow-up after the activity?",
  "จัด Team Building ให้เชื่อมกับงานได้หรือไม่?",
  "Can team building connect to real work?",
];
const RETIRED_FAQ_LEADS = [
  "คำตอบขึ้นกับโจทย์ ผู้เข้าร่วม และงานจริง ไม่ใช่คำรับประกันผลทางธุรกิจ",
  "Answers depend on the brief, the participants, and the real work. They are not a guaranteed business result.",
];

function retiredFaqLead(value: string, fallback: string) {
  const next = value.trim();
  if (!next || RETIRED_FAQ_LEADS.includes(next)) return fallback;
  return value;
}

function asFaqs(value: unknown, fallback: CmsHotelTrainingFaq[]) {
  if (!Array.isArray(value) || !value.length) return fallback;
  const ids = value.map((row) => String((row as { id?: string } | undefined)?.id || ""));
  const questions = value.flatMap((row) => {
    const item = (row ?? {}) as { qTh?: string; qEn?: string };
    return [String(item.qTh || "").trim(), String(item.qEn || "").trim()].filter(Boolean);
  });
  if (ids.some((id) => RETIRED_FAQ_IDS.includes(id))) return fallback;
  if (questions.some((question) => RETIRED_FAQ_QUESTIONS.includes(question))) return fallback;
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const seed = fallback.find((faq) => faq.id === String(row.id || "")) ?? fallback[index] ?? fallback[0];
    return {
      id: String(row.id || seed.id),
      qTh: String(row.qTh ?? seed.qTh),
      qEn: String(row.qEn ?? seed.qEn),
      aTh: String(row.aTh ?? seed.aTh),
      aEn: String(row.aEn ?? seed.aEn),
    };
  });
}

function asVisual(value: unknown, fallback: CmsHotelTrainingVisual): CmsHotelTrainingVisual {
  const row = (value || {}) as Record<string, unknown>;
  return {
    src: asText(row, "src", fallback.src).trim() || fallback.src,
    altTh: asText(row, "altTh", fallback.altTh),
    altEn: asText(row, "altEn", fallback.altEn),
    status: asText(row, "status", fallback.status) || "sample",
    label: asText(row, "label", fallback.label),
    caption: asText(row, "caption", fallback.caption),
    source: asText(row, "source", fallback.source),
    approvalNote: asText(row, "approvalNote", fallback.approvalNote),
    publicationApproved: Boolean(row.publicationApproved ?? fallback.publicationApproved),
  };
}

function asFormLabels(value: unknown, fallback: CmsHotelTrainingPage["form"]["labels"]): CmsHotelTrainingPage["form"]["labels"] {
  const row = (value || {}) as Record<string, unknown>;
  return {
    consentTh: String(row.consentTh ?? fallback.consentTh),
    consentEn: String(row.consentEn ?? fallback.consentEn),
    privacyTh: String(row.privacyTh ?? fallback.privacyTh),
    privacyEn: String(row.privacyEn ?? fallback.privacyEn),
    requiredTh: String(row.requiredTh ?? fallback.requiredTh),
    requiredEn: String(row.requiredEn ?? fallback.requiredEn),
    requiredMsgTh: String(row.requiredMsgTh ?? fallback.requiredMsgTh),
    requiredMsgEn: String(row.requiredMsgEn ?? fallback.requiredMsgEn),
    consentRequiredTh: String(row.consentRequiredTh ?? fallback.consentRequiredTh),
    consentRequiredEn: String(row.consentRequiredEn ?? fallback.consentRequiredEn),
    submitTh: String(row.submitTh ?? fallback.submitTh),
    submitEn: String(row.submitEn ?? fallback.submitEn),
    secretMsgTh: String(row.secretMsgTh ?? fallback.secretMsgTh),
    secretMsgEn: String(row.secretMsgEn ?? fallback.secretMsgEn),
  };
}

export function parseHotelTrainingPageBody(body: string, locale: Locale = "th"): CmsHotelTrainingPage | null {
  try {
    const parsed = JSON.parse(body) as Partial<CmsHotelTrainingPage> & { template?: string };
    if (parsed?.template && parsed.template !== HOTEL_TRAINING_CMS_TEMPLATE) return null;
    const seeded = defaultHotelTrainingCms(locale);
    const hero = (parsed.hero || {}) as Record<string, unknown>;
    return {
      ...seeded,
      ...parsed,
      template: HOTEL_TRAINING_CMS_TEMPLATE,
      bilingualPublish: parsed.bilingualPublish ?? true,
      hero: {
        ...seeded.hero,
        eyebrow: asText(hero, "eyebrow", seeded.hero.eyebrow),
        titleLead: asText(hero, "titleLead", seeded.hero.titleLead),
        titleAccent: asText(hero, "titleAccent", seeded.hero.titleAccent),
        titleRest: asText(hero, "titleRest", seeded.hero.titleRest),
        description: retiredHeroDescription(asText(hero, "description", seeded.hero.description), seeded.hero.description),
        close: asText(hero, "close", seeded.hero.close),
        underCta: asText(hero, "underCta", seeded.hero.underCta),
        primaryCta: { label: String(((hero.primaryCta as Record<string, unknown>) || {}).label ?? seeded.hero.primaryCta.label), href: String(((hero.primaryCta as Record<string, unknown>) || {}).href ?? seeded.hero.primaryCta.href) },
        secondaryCta: { label: String(((hero.secondaryCta as Record<string, unknown>) || {}).label ?? seeded.hero.secondaryCta.label), href: String(((hero.secondaryCta as Record<string, unknown>) || {}).href ?? seeded.hero.secondaryCta.href) },
        trust: asList(hero.trust, seeded.hero.trust, (row, index, item) => ({ id: String(row.id || item.id), th: String(row.th ?? item.th), en: String(row.en ?? item.en) })),
        visual: asVisual(hero.visual, seeded.hero.visual),
      },
      needs: {
        ...seeded.needs,
        ...((parsed.needs || {}) as object),
        title: retiredNeedsCopy(String(((parsed.needs || {}) as { title?: string }).title ?? seeded.needs.title), seeded.needs.title),
        lead: retiredNeedsCopy(String(((parsed.needs || {}) as { lead?: string }).lead ?? seeded.needs.lead), seeded.needs.lead),
        items: asNeedsItems((parsed.needs as { items?: unknown } | undefined)?.items, seeded.needs.items),
        visual: asVisual((parsed.needs as { visual?: unknown } | undefined)?.visual, seeded.needs.visual),
      },
      journey: {
        ...seeded.journey,
        ...((parsed.journey || {}) as object),
        title: retiredJourneyCopy(String(((parsed.journey || {}) as { title?: string }).title ?? seeded.journey.title), seeded.journey.title),
        lead: retiredJourneyCopy(String(((parsed.journey || {}) as { lead?: string }).lead ?? seeded.journey.lead), seeded.journey.lead),
        visual: asVisual((parsed.journey as { visual?: unknown } | undefined)?.visual, seeded.journey.visual),
        steps: asJourneySteps((parsed.journey as { steps?: unknown } | undefined)?.steps, seeded.journey.steps),
      },
      programs: {
        ...seeded.programs,
        ...((parsed.programs || {}) as object),
        items: asPrograms((parsed.programs as { items?: unknown } | undefined)?.items, seeded.programs.items),
      },
      assess: {
        ...seeded.assess,
        ...((parsed.assess || {}) as object),
        title: retiredAssessCopy(String(((parsed.assess || {}) as { title?: string }).title ?? seeded.assess.title), seeded.assess.title),
        lead: retiredAssessCopy(String(((parsed.assess || {}) as { lead?: string }).lead ?? seeded.assess.lead), seeded.assess.lead),
        caption: retiredAssessCopy(String(((parsed.assess || {}) as { caption?: string }).caption ?? seeded.assess.caption), seeded.assess.caption),
        visual: asVisual((parsed.assess as { visual?: unknown } | undefined)?.visual, seeded.assess.visual),
        items: asAssessItems((parsed.assess as { items?: unknown } | undefined)?.items, seeded.assess.items),
      },
      matrix: {
        ...seeded.matrix,
        ...((parsed.matrix || {}) as object),
        title: retiredMatrixCopy(String(((parsed.matrix || {}) as { title?: string }).title ?? seeded.matrix.title), seeded.matrix.title),
        lead: retiredMatrixCopy(String(((parsed.matrix || {}) as { lead?: string }).lead ?? seeded.matrix.lead), seeded.matrix.lead),
        caption: retiredMatrixCopy(String(((parsed.matrix || {}) as { caption?: string }).caption ?? seeded.matrix.caption), seeded.matrix.caption),
        visual: asVisual((parsed.matrix as { visual?: unknown } | undefined)?.visual, seeded.matrix.visual),
        items: asMatrixRows((parsed.matrix as { items?: unknown } | undefined)?.items, seeded.matrix.items),
      },
      gallery: {
        ...seeded.gallery,
        ...((parsed.gallery || {}) as object),
        title: retiredGalleryCopy(String(((parsed.gallery || {}) as { title?: string }).title ?? seeded.gallery.title), seeded.gallery.title),
        lead: retiredGalleryCopy(String(((parsed.gallery || {}) as { lead?: string }).lead ?? seeded.gallery.lead), seeded.gallery.lead),
        items: asGalleryItems((parsed.gallery as { items?: unknown } | undefined)?.items, seeded.gallery.items),
      },
      outcomes: {
        ...seeded.outcomes,
        ...((parsed.outcomes || {}) as object),
        title: retiredOutcomesCopy(String(((parsed.outcomes || {}) as { title?: string }).title ?? seeded.outcomes.title), seeded.outcomes.title),
        lead: retiredOutcomesCopy(String(((parsed.outcomes || {}) as { lead?: string }).lead ?? seeded.outcomes.lead), seeded.outcomes.lead),
        caption: retiredOutcomesCopy(String(((parsed.outcomes || {}) as { caption?: string }).caption ?? seeded.outcomes.caption), seeded.outcomes.caption),
        visual: asVisual((parsed.outcomes as { visual?: unknown } | undefined)?.visual, seeded.outcomes.visual),
        items: asOutcomeRows((parsed.outcomes as { items?: unknown } | undefined)?.items, seeded.outcomes.items),
      },
      trainer: asTrainer(parsed.trainer, seeded.trainer),
      follow: {
        ...seeded.follow,
        ...((parsed.follow || {}) as object),
        items: asList((parsed.follow as { items?: unknown } | undefined)?.items, seeded.follow.items, (row, _i, item) => ({
          id: String(row.id || item.id),
          labelTh: String(row.labelTh ?? item.labelTh),
          labelEn: String(row.labelEn ?? item.labelEn),
          meaningTh: String(row.meaningTh ?? item.meaningTh ?? ""),
          meaningEn: String(row.meaningEn ?? item.meaningEn ?? ""),
          valueTh: String(row.valueTh ?? item.valueTh),
          valueEn: String(row.valueEn ?? item.valueEn),
        })),
      },
      partners: { ...seeded.partners, ...((parsed.partners || {}) as object) },
      related: {
        ...seeded.related,
        ...((parsed.related || {}) as object),
        title: retiredRelatedCopy(String(((parsed.related || {}) as { title?: string }).title ?? seeded.related.title), seeded.related.title),
        lead: retiredRelatedCopy(String(((parsed.related || {}) as { lead?: string }).lead ?? seeded.related.lead), seeded.related.lead),
        visual: asVisual((parsed.related as { visual?: unknown } | undefined)?.visual, seeded.related.visual),
        cards: asRelatedCards((parsed.related as { cards?: unknown } | undefined)?.cards, seeded.related.cards),
      },
      form: {
        ...seeded.form,
        ...((parsed.form || {}) as object),
        heading: retiredFormCopy(String(((parsed.form || {}) as { heading?: string }).heading ?? seeded.form.heading), seeded.form.heading),
        lead: retiredFormCopy(String(((parsed.form || {}) as { lead?: string }).lead ?? seeded.form.lead), seeded.form.lead),
        visual: asVisual((parsed.form as { visual?: unknown } | undefined)?.visual, seeded.form.visual),
        labels: asFormLabels((parsed.form as { labels?: unknown } | undefined)?.labels, seeded.form.labels),
      },
      faqLead: retiredFaqLead(asText(parsed as Record<string, unknown>, "faqLead", seeded.faqLead), seeded.faqLead),
      faqLeadEn: retiredFaqLead(asText(parsed as Record<string, unknown>, "faqLeadEn", seeded.faqLeadEn), seeded.faqLeadEn),
      faqs: asFaqs(parsed.faqs, seeded.faqs),
      seo: { ...seeded.seo, ...((parsed.seo || {}) as object), social: asVisual((parsed.seo as { social?: unknown } | undefined)?.social, seeded.seo.social), variants: asList((parsed.seo as { variants?: unknown } | undefined)?.variants, seeded.seo.variants, (row, _i, item) => ({ locale: String(row.locale ?? item.locale), title: String(row.title ?? item.title), description: String(row.description ?? item.description), canonical: String(row.canonical ?? item.canonical) })) },
      approvals: { ...seeded.approvals, ...((parsed.approvals || {}) as object) },
    };
  } catch {
    return null;
  }
}

export function serializeHotelTrainingPageBody(content: CmsHotelTrainingPage) {
  return JSON.stringify({ ...content, version: 1, template: HOTEL_TRAINING_CMS_TEMPLATE });
}

export function isHotelTrainingCmsBody(body: string) {
  try {
    return (JSON.parse(body) as { template?: string }).template === HOTEL_TRAINING_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isHotelTrainingPageDocument(input: { slug: string; template: string }) {
  if (input.template === HOTEL_TRAINING_CMS_TEMPLATE) return true;
  return input.slug.includes("hotel-training-team-development");
}

const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const SECRET_ASSIGN = /(password|passwd|api[_-\s]?key|employee[_-\s]?id|staff[_-\s]?id|assessment\s+score|guest[_-\s]?(id|data)|รหัสผ่าน|รหัสพนักงาน|คะแนนประเมิน)\s*[:=]\s*\S+/i;
const SECRET_TOKEN = /\b(sk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;
const NUMBER_RE = /\d+(\.\d+)?/;
const VISUAL_STATUS_IDS = HOTEL_TRAINING_VISUAL_STATUSES.map((item) => item.id);

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function visualHasStatus(status: string) {
  return VISUAL_STATUS_IDS.includes(status as HotelTrainingVisualStatus);
}

function visualNeedsPublicAlt(visual: CmsHotelTrainingVisual, bilingual: boolean) {
  if (!visual.src.trim() || hotelTrainingIsLibraryPlaceholder(visual.src) || visual.status === "replace") return null;
  if (!visualHasStatus(visual.status)) return "placeholder_status";
  if (bilingual && (!visual.altTh.trim() || !visual.altEn.trim())) return "missing_alt";
  if (!visual.altTh.trim() && !visual.altEn.trim()) return "missing_alt";
  if (visual.status === "approved" && !hotelTrainingIsLibraryPlaceholder(visual.src) && !visual.publicationApproved) return "screenshot_approval";
  return null;
}

function outcomeHasPublicNumber(item: CmsHotelTrainingOutcome) {
  return [item.beforeTh, item.beforeEn, item.afterTh, item.afterEn, item.followTh, item.followEn].some((value) => NUMBER_RE.test(value));
}

function outcomeEvidenceComplete(item: CmsHotelTrainingOutcome, bilingual: boolean) {
  const definition = bilingual ? item.definitionTh.trim() && item.definitionEn.trim() : item.definitionTh.trim() || item.definitionEn.trim();
  const method = bilingual ? item.methodTh.trim() && item.methodEn.trim() : item.methodTh.trim() || item.methodEn.trim();
  const period = bilingual ? item.periodTh.trim() && item.periodEn.trim() : item.periodTh.trim() || item.periodEn.trim();
  const source = bilingual ? item.sourceTh.trim() && item.sourceEn.trim() : item.sourceTh.trim() || item.sourceEn.trim();
  const owner = bilingual
    ? (item.ownerTh.trim() || item.reviewerTh.trim()) && (item.ownerEn.trim() || item.reviewerEn.trim())
    : item.ownerTh.trim() || item.reviewerTh.trim() || item.ownerEn.trim() || item.reviewerEn.trim();
  return Boolean(definition && method && period && source && owner);
}

function galleryItemIsReal(item: CmsHotelTrainingGalleryItem) {
  return Boolean(item.src.trim()) && !hotelTrainingIsLibraryPlaceholder(item.src);
}

export function validateHotelTrainingPage(content: CmsHotelTrainingPage, intent: HotelTrainingCmsIntent) {
  if (intent === "unpublish") return null;
  let secrets = false;
  walkStrings(content, (text) => {
    if (SECRET_ASSIGN.test(text) || SECRET_TOKEN.test(text)) secrets = true;
  });
  if (secrets) return "blocked_secret";
  if (intent !== "publish") return null;
  if (content.bilingualPublish && content.faqs.some((faq) => !faq.qTh.trim() || !faq.aTh.trim() || !faq.qEn.trim() || !faq.aEn.trim())) return "empty_faq_bilingual";
  if (!CTA_RE.test(content.hero.primaryCta.href.trim()) || !content.hero.primaryCta.label.trim()) return "invalid_cta";
  if (content.hero.secondaryCta.href.trim() && (!CTA_RE.test(content.hero.secondaryCta.href.trim()) || !content.hero.secondaryCta.label.trim())) return "invalid_cta";
  if (content.programs.items.some((item) => (item.ctaTh.trim() || item.href.trim()) && (!item.ctaTh.trim() || !CTA_RE.test(item.href.trim())))) return "invalid_cta";
  if (content.related.cards.some((item) => item.href.trim() && !CTA_RE.test(item.href.trim()))) return "invalid_cta";
  const visuals = [
    content.hero.visual,
    content.needs.visual,
    content.journey.visual,
    content.assess.visual,
    content.matrix.visual,
    content.outcomes.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
  ];
  for (const visual of visuals) {
    if (visual.src.trim() && !visualHasStatus(visual.status)) return "placeholder_status";
    const visualError = visualNeedsPublicAlt(visual, content.bilingualPublish);
    if (visualError) return visualError;
  }
  if (content.trainer.status && !visualHasStatus(content.trainer.status)) return "placeholder_status";
  if (content.trainer.src.trim() && !hotelTrainingIsLibraryPlaceholder(content.trainer.src)) {
    if (content.bilingualPublish && (!content.trainer.altTh.trim() || !content.trainer.altEn.trim())) return "missing_alt";
    if (content.trainer.status === "approved" && !content.trainer.publicationApproved) return "screenshot_approval";
  }
  if ((content.trainer.qualificationsTh.trim() || content.trainer.qualificationsEn.trim()) && !content.trainer.qualificationsVerified) return "trainer_unverified";
  if ((content.trainer.experienceTh.trim() || content.trainer.experienceEn.trim()) && !content.trainer.experienceVerified) return "trainer_unverified";
  if ((content.trainer.languagesTh.trim() || content.trainer.languagesEn.trim()) && !content.trainer.languagesVerified) return "trainer_unverified";
  for (const item of content.gallery.items) {
    if (item.src.trim() && !visualHasStatus(item.status)) return "placeholder_status";
    if (!galleryItemIsReal(item)) continue;
    if (content.bilingualPublish && (!item.altTh.trim() || !item.altEn.trim())) return "missing_alt";
    if (item.status === "approved" || item.publicationApproved) {
      if (item.consentStatus !== "approved" || !item.redactionChecked) return "gallery_consent";
    }
  }
  if (content.programs.items.some((item) => (item.durationTh.trim() || item.durationEn.trim()) && !item.durationVerified)) return "unverified_program";
  if (content.programs.items.some((item) => (item.groupSizeTh.trim() || item.groupSizeEn.trim()) && !item.groupSizeVerified)) return "unverified_program";
  for (const item of content.outcomes.items) {
    if (outcomeHasPublicNumber(item) && !outcomeEvidenceComplete(item, content.bilingualPublish)) return "claim_incomplete";
    if (outcomeHasPublicNumber(item) && item.reviewStatus === "verified" && (!content.approvals.results || !content.approvals.evidenceNote.trim())) return "claim_incomplete";
  }
  if (content.approvals.results) {
    const numeric = JSON.stringify(content.outcomes);
    if (NUMBER_RE.test(numeric) && !content.approvals.evidenceNote.trim()) return "claim_incomplete";
  }
  const labels = content.form.labels;
  if (!labels.consentTh.trim() || !labels.privacyTh.trim() || !labels.submitTh.trim() || !labels.requiredMsgTh.trim() || !labels.consentRequiredTh.trim()) return "invalid_consent";
  if (content.bilingualPublish && (!labels.consentEn.trim() || !labels.privacyEn.trim() || !labels.submitEn.trim() || !labels.requiredMsgEn.trim() || !labels.consentRequiredEn.trim())) return "invalid_consent";
  return null;
}

export function hotelTrainingCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  return "บันทึกแล้ว / Saved";
}

export function hotelTrainingCmsErrorMessage(error?: string) {
  const th: Record<string, string> = {
    blocked_secret: "ลบรหัสผ่าน รหัสพนักงาน คะแนนประเมิน หรือข้อมูลแขกออกก่อนบันทึก",
    empty_faq_bilingual: "คำถามที่พบบ่อยต้องมีภาษาไทยและอังกฤษก่อนเผยแพร่",
    invalid_cta: "ปุ่มหลักต้องมีข้อความและลิงก์ที่ถูกต้อง",
    claim_incomplete: "ตัวเลขผลลัพธ์ต้องมีนิยาม วิธี ช่วงวัด แหล่งที่มา และผู้ทบทวนก่อนเผยแพร่",
    required_fields: "กรอกชื่อเพจและคำอธิบาย SEO ก่อนเผยแพร่",
    invalid_json: "บันทึกไม่สำเร็จ เพราะโครงสร้างเนื้อหาไม่ถูกต้อง",
    invalid_image: "ไฟล์รูปไม่ถูกต้อง",
    missing: "ไม่พบหน้าเพจ",
    invalid_locale: "ภาษาปลายทางไม่ถูกต้อง",
    locale_exists: "มีฉบับภาษานี้อยู่แล้ว",
    placeholder_status: "ทุกรูปต้องระบุสถานะ Approved / Sample / Replace",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและอังกฤษ",
    screenshot_approval: "รูปที่สถานะ Approved ต้องมีสิทธิ์เผยแพร่",
    gallery_consent: "ภาพแกลเลอรีที่เผยแพร่ต้องมีสถานะยินยอมและตรวจการปกปิดข้อมูลแล้ว",
    trainer_unverified: "วุฒิบัตร ประสบการณ์ และภาษาสอนแสดงได้เมื่อยืนยันแล้วเท่านั้น",
    unverified_program: "ระยะเวลา ขนาดกลุ่ม ใบรับรอง และภาษาของหลักสูตรต้องยืนยันก่อนเผยแพร่",
    invalid_consent: "ฟอร์มต้องมีข้อความความยินยอม ป้ายนโยบาย และข้อความตรวจสอบ",
  };
  const en: Record<string, string> = {
    blocked_secret: "Remove passwords, staff IDs, assessment scores, or guest data before saving",
    empty_faq_bilingual: "FAQs need Thai and English before bilingual publish",
    invalid_cta: "The primary button needs a label and a valid link",
    claim_incomplete: "Numeric outcomes need definition, method, period, source, and owner before publishing",
    required_fields: "Add a title and SEO description before publishing",
    invalid_json: "The saved content structure is not valid",
    invalid_image: "The image file is not valid",
    missing: "Page not found",
    invalid_locale: "The destination language is not valid",
    locale_exists: "A version in that language already exists",
    placeholder_status: "Every image needs an Approved / Sample / Replace status",
    missing_alt: "Published images need Thai and English alt text",
    screenshot_approval: "Approved images need publication permission",
    gallery_consent: "Published gallery photos need consent status and a redaction check",
    trainer_unverified: "Qualifications, experience, and teaching languages can appear only when verified",
    unverified_program: "Duration, group size, certificates, and course languages must be verified before publish",
    invalid_consent: "The form needs consent copy, a privacy label, and validation messages",
  };
  if (!error) return "";
  return `${th[error] ?? "บันทึกไม่สำเร็จ"} / ${en[error] ?? "Save failed"}`;
}

export function editorStateFromHotelTrainingDocument(input: {
  id: string;
  title: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  canonical?: string | null;
  locale: string;
  status: string;
  body: string;
}): HotelTrainingEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseHotelTrainingPageBody(input.body, locale) ?? defaultHotelTrainingCms(locale);
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

export function hotelTrainingPublicPath(locale: Locale) {
  const page = pages.find((item) => item.route.endsWith("/solutions/hotel-training-team-development") && item.language === locale);
  return page?.route || (locale === "th" ? HOTEL_TRAINING_PAGE_ROUTE : `/${locale}${HOTEL_TRAINING_PAGE_ROUTE}`);
}

export function siteTitleForHotelTraining(locale: Locale) {
  const page = pages.find((item) => item.route.endsWith("/solutions/hotel-training-team-development") && item.language === (locale === "th" ? "th" : "en"));
  return page?.title || `${hotelTrainingCopy[locale === "th" ? "th" : "en"].titleLead} ${hotelTrainingCopy[locale === "th" ? "th" : "en"].titleAccent}`;
}
