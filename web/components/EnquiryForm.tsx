"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import { B2bEnquiryIntro } from "@/components/b2b/B2bEnquiryIntro";
import { AdsEnquiryIntro } from "@/components/google-ads/AdsEnquiryIntro";
import { AdsEnquiryIntro as MetaAdsEnquiryIntro } from "@/components/meta-ads/AdsEnquiryIntro";
import { HotelSeoEnquiryIntro } from "@/components/hotel-seo/HotelSeoEnquiryIntro";
import { ConversionEnquiryIntro } from "@/components/direct-bookings/ConversionEnquiryIntro";
import { ConversionEnquiryVisual } from "@/components/direct-bookings/ConversionEnquiryVisual";
import { IndependentEnquiryIntro } from "@/components/independent-hotel/IndependentEnquiryIntro";
import { IndependentEnquiryVisual } from "@/components/independent-hotel/IndependentVisuals";
import {
  INDEPENDENT_HOTEL_CHALLENGES,
  INDEPENDENT_HOTEL_STATUS,
  independentEnquiryCopy,
} from "@/lib/independent-hotel";
import { WebsiteEnquiryIntro } from "@/components/hotel-website/WebsiteEnquiryIntro";
import { ReservationsEnquiryIntro } from "@/components/reservations/ReservationsEnquiryIntro";
import { RevenueEnquiryIntro } from "@/components/revenue-commercial/RevenueEnquiryIntro";
import { adsEnquiryCopy } from "@/lib/google-ads";
import { hotelSeoEnquiryCopy } from "@/lib/hotel-seo";
import { websiteEnquiryCopy } from "@/lib/hotel-website";
import { directBookingEnquiryCopy } from "@/lib/direct-bookings";
import { metaEnquiryCopy } from "@/lib/meta-ads";
import { b2bEnquiryCopy } from "@/lib/b2b";
import { AUDIT_CONTACTS, readUtm } from "@/lib/audit";
import { auditCopyFor } from "@/lib/audit-copy";
import {
  ENQUIRY_SERVICES,
  ENQUIRY_UI,
  enquiryServiceById,
  type EnquiryServiceId,
} from "@/lib/enquiry";
import { localizePath, type Locale } from "@/lib/seo";
import { track } from "@/lib/track";

type FormState = {
  name: string;
  businessName: string;
  contact: string;
  serviceInterest: EnquiryServiceId | "";
  topic: string;
  channels: string;
  scope: string;
  market: string;
  website: string;
  mapsUrl: string;
  adsStatus: string;
  trackingStatus: string;
  analyticsStatus: string;
  goal: string;
  bookingEngine: string;
  existingCms: string;
  timeline: string;
  rooms: string;
  hotelStatus: string;
  teamSize: string;
  message: string;
  consent: boolean;
  companyWebsite: string;
};

type FieldError = Partial<Record<"name" | "businessName" | "contact" | "serviceInterest" | "topic" | "consent" | "website" | "mapsUrl" | "bookingEngine", string>>;

const revenueGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "เกี่ยวกับโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const revenueTopics = [
  { id: "revenue", th: "รายได้ ราคา และ Occupancy", en: "Revenue, rates, and occupancy" },
  { id: "channels", th: "ช่องทางขาย และ OTA", en: "Selling channels and OTAs" },
  { id: "direct", th: "การจองตรง", en: "Direct booking" },
  { id: "other", th: "อื่น ๆ", en: "Something else" },
] as const;

const revenueFormUi = {
  th: {
    topic: "เรื่องที่อยากคุย",
    topicPlaceholder: "เลือกเรื่องที่อยากคุย",
    loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
  },
  en: {
    topic: "Topic",
    topicPlaceholder: "Choose a topic",
    loading: "Sending your message. Please wait.",
  },
} as const;

function revenueTopicLabel(id: string, locale: Locale) {
  const topic = revenueTopics.find((item) => item.id === id);
  if (!topic) return "";
  return locale === "th" ? topic.th : topic.en;
}

function composeRevenueMessage(topicId: string, message: string, locale: Locale) {
  const topic = revenueTopicLabel(topicId, locale);
  const prefix = topic
    ? locale === "th"
      ? `เรื่องที่อยากคุย: ${topic}`
      : `Topic: ${topic}`
    : "";
  return [prefix, message.trim()].filter(Boolean).join("\n\n");
}

const reservationsFormUi = {
  th: {
    work: "งานจอง",
    channels: "ช่องทางงานจองที่ใช้ปัจจุบัน",
    channelsHint: "เช่น LINE, อีเมล, โทรศัพท์, OTA",
    scope: "ขอบเขตงานที่ต้องการ",
    scopeHint: "งานที่อยากให้ทีมช่วยดูแล",
    loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
  },
  en: {
    work: "Reservation work",
    channels: "Current reservation channels",
    channelsHint: "For example LINE, email, phone, OTA",
    scope: "Requested service scope",
    scopeHint: "The reservation work you want help with",
    loading: "Sending your message. Please wait.",
  },
} as const;

function looksLikeWebsite(value: string) {
  const next = value.trim();
  if (!next) return true;
  return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}([/?#][^\s]*)?$/i.test(next);
}

function hotelSeoIssueLabel(id: string, locale: Locale) {
  const fields = hotelSeoEnquiryCopy(locale).fields;
  if (id === "search") return fields.issueSearch;
  if (id === "maps") return fields.issueMaps;
  if (id === "website") return fields.issueWebsite;
  if (id === "contact") return fields.issueContact;
  if (id === "booking") return fields.issueBooking;
  return "";
}

function websiteGoalLabel(id: string, locale: Locale) {
  const fields = websiteEnquiryCopy(locale).fields;
  if (id === "direct") return fields.goalDirect;
  if (id === "refresh") return fields.goalRefresh;
  if (id === "mobile") return fields.goalMobile;
  if (id === "cms") return fields.goalCms;
  return "";
}

function composeWebsiteMessage(
  website: string,
  bookingEngine: string,
  existingCms: string,
  goal: string,
  challenge: string,
  timeline: string,
  locale: Locale,
) {
  const fields = websiteEnquiryCopy(locale).fields;
  const goalLabel = websiteGoalLabel(goal, locale);
  return [
    website.trim() ? `${fields.website}: ${website.trim()}` : "",
    bookingEngine.trim() ? `${fields.bookingEngine}: ${bookingEngine.trim()}` : "",
    existingCms.trim() ? `${fields.cms}: ${existingCms.trim()}` : "",
    goalLabel ? `${fields.goal}: ${goalLabel}` : "",
    challenge.trim() ? `${fields.challenge}: ${challenge.trim()}` : "",
    timeline.trim() ? `${fields.timeline}: ${timeline.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function conversionGoalLabel(id: string, locale: Locale) {
  const fields = directBookingEnquiryCopy(locale).fields;
  if (id === "direct") return fields.goalDirect;
  if (id === "review") return fields.goalReview;
  if (id === "website") return fields.goalWebsite;
  return "";
}

function conversionStatusLabel(id: string, yes: string, no: string, unsure: string) {
  if (id === "yes") return yes;
  if (id === "no") return no;
  if (id === "unsure") return unsure;
  return "";
}

function composeConversionMessage(
  website: string,
  bookingEngine: string,
  goal: string,
  analyticsStatus: string,
  trackingStatus: string,
  concern: string,
  locale: Locale,
) {
  const fields = directBookingEnquiryCopy(locale).fields;
  const goalLabel = conversionGoalLabel(goal, locale);
  const analyticsLabel = conversionStatusLabel(analyticsStatus, fields.analyticsYes, fields.analyticsNo, fields.analyticsUnsure);
  const trackingLabel = conversionStatusLabel(trackingStatus, fields.trackingYes, fields.trackingNo, fields.trackingUnsure);
  return [
    website.trim() ? `${fields.website}: ${website.trim()}` : "",
    bookingEngine.trim() ? `${fields.bookingEngine}: ${bookingEngine.trim()}` : "",
    goalLabel ? `${fields.goal}: ${goalLabel}` : "",
    analyticsLabel ? `${fields.analytics}: ${analyticsLabel}` : "",
    trackingLabel ? `${fields.tracking}: ${trackingLabel}` : "",
    concern.trim() ? `${fields.concern}: ${concern.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function composeHotelSeoMessage(website: string, mapsUrl: string, issue: string, outcome: string, locale: Locale) {
  const fields = hotelSeoEnquiryCopy(locale).fields;
  const issueLabel = hotelSeoIssueLabel(issue, locale);
  return [
    website.trim() ? `${fields.website}: ${website.trim()}` : "",
    mapsUrl.trim() ? `${fields.maps}: ${mapsUrl.trim()}` : "",
    issueLabel ? `${fields.issue}: ${issueLabel}` : "",
    outcome.trim() ? `${fields.outcome}: ${outcome.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function composeGoogleAdsMessage(
  website: string,
  goal: string,
  market: string,
  adsStatus: string,
  challenge: string,
  locale: Locale,
) {
  const fields = adsEnquiryCopy(locale).fields;
  const goalLabel =
    goal === "direct" ? fields.goalDirect : goal === "awareness" ? fields.goalAwareness : goal === "expansion" ? fields.goalExpansion : "";
  const adsLabel = adsStatus === "yes" ? fields.adsYes : adsStatus === "no" ? fields.adsNo : adsStatus === "unsure" ? fields.adsUnsure : "";
  const parts = [
    website.trim() ? `${fields.website}: ${website.trim()}` : "",
    goalLabel ? `${fields.goal}: ${goalLabel}` : "",
    market.trim() ? `${fields.market}: ${market.trim()}` : "",
    adsLabel ? `${fields.adsStatus}: ${adsLabel}` : "",
    challenge.trim() ? `${fields.challenge}: ${challenge.trim()}` : "",
  ];
  return parts.filter(Boolean).join("\n\n");
}

function composeMetaAdsMessage(
  website: string,
  goal: string,
  market: string,
  adsStatus: string,
  trackingStatus: string,
  challenge: string,
  locale: Locale,
) {
  const fields = metaEnquiryCopy(locale).fields;
  const goalLabel =
    goal === "direct"
      ? fields.goalDirect
      : goal === "awareness"
        ? fields.goalAwareness
        : goal === "enquiry"
          ? fields.goalInquiry
          : "";
  const adsLabel = adsStatus === "yes" ? fields.adsYes : adsStatus === "no" ? fields.adsNo : adsStatus === "unsure" ? fields.adsUnsure : "";
  const trackingLabel =
    trackingStatus === "yes" ? fields.trackingYes : trackingStatus === "no" ? fields.trackingNo : trackingStatus === "unsure" ? fields.trackingUnsure : "";
  const parts = [
    website.trim() ? `${fields.website}: ${website.trim()}` : "",
    goalLabel ? `${fields.goal}: ${goalLabel}` : "",
    market.trim() ? `${fields.market}: ${market.trim()}` : "",
    adsLabel ? `${fields.adsStatus}: ${adsLabel}` : "",
    trackingLabel ? `${fields.tracking}: ${trackingLabel}` : "",
    challenge.trim() ? `${fields.challenge}: ${challenge.trim()}` : "",
  ];
  return parts.filter(Boolean).join("\n\n");
}

function composeB2bMessage(
  market: string,
  channels: string,
  rate: string,
  challenge: string,
  locale: Locale,
) {
  const fields = b2bEnquiryCopy(locale).fields;
  const parts = [
    market.trim() ? `${fields.market}: ${market.trim()}` : "",
    channels.trim() ? `${fields.channels}: ${channels.trim()}` : "",
    rate.trim() ? `${fields.rate}: ${rate.trim()}` : "",
    challenge.trim() ? `${fields.challenge}: ${challenge.trim()}` : "",
  ];
  return parts.filter(Boolean).join("\n\n");
}

function composeReservationsMessage(channels: string, scope: string, message: string, locale: Locale) {
  const thai = locale === "th";
  const parts = [
    channels.trim()
      ? `${thai ? "ช่องทางงานจองที่ใช้ปัจจุบัน" : "Current reservation channels"}: ${channels.trim()}`
      : "",
    scope.trim()
      ? `${thai ? "ขอบเขตงานที่ต้องการ" : "Requested service scope"}: ${scope.trim()}`
      : "",
    message.trim(),
  ];
  return parts.filter(Boolean).join("\n\n");
}

const b2bGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "สิ่งที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const googleAdsGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const metaAdsGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const searchGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "ปัญหาและผลที่ต้องการ" },
  en: { contact: "Contact details", hotel: "Hotel / company", topic: "Issue and desired outcome" },
  ru: { contact: "Contact details", hotel: "Hotel / company", topic: "Issue and desired outcome" },
  zh: { contact: "Contact details", hotel: "Hotel / company", topic: "Issue and desired outcome" },
} as const;

const websiteGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เป้าหมายและปัญหาปัจจุบัน" },
  en: { contact: "Contact details", hotel: "Hotel / company", topic: "Goal and current challenge" },
  ru: { contact: "Contact details", hotel: "Hotel / company", topic: "Goal and current challenge" },
  zh: { contact: "Contact details", hotel: "Hotel / company", topic: "Goal and current challenge" },
} as const;

const conversionGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const independentHotelGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เป้าหมายและประเด็นหลัก" },
  en: { contact: "Contact details", hotel: "Hotel / company", topic: "Goal and current challenge" },
  ru: { contact: "Contact details", hotel: "Hotel / company", topic: "Goal and current challenge" },
  zh: { contact: "Contact details", hotel: "Hotel / company", topic: "Goal and current challenge" },
} as const;

function independentOptionLabel(
  items: readonly { id: string; th: string; en: string }[],
  id: string,
  locale: Locale,
) {
  const item = items.find((row) => row.id === id);
  if (!item) return "";
  return locale === "th" ? `${item.th} / ${item.en}` : item.en;
}

function composeIndependentHotelMessage(state: FormState, locale: Locale) {
  const status = independentOptionLabel(INDEPENDENT_HOTEL_STATUS, state.hotelStatus, locale);
  const challenge = independentOptionLabel(INDEPENDENT_HOTEL_CHALLENGES, state.topic, locale);
  const thai = locale === "th";
  const parts = [
    status ? (thai ? `สถานะโรงแรม: ${status}` : `Hotel status: ${status}`) : "",
    state.rooms.trim() ? (thai ? `จำนวนห้อง: ${state.rooms.trim()}` : `Number of rooms: ${state.rooms.trim()}`) : "",
    state.teamSize.trim()
      ? thai
        ? `ขนาดทีมปัจจุบัน: ${state.teamSize.trim()}`
        : `Current team size: ${state.teamSize.trim()}`
      : "",
    challenge ? (thai ? `ประเด็นหลัก: ${challenge}` : `Main challenge: ${challenge}`) : "",
    state.website.trim() ? (thai ? `เว็บไซต์: ${state.website.trim()}` : `Website: ${state.website.trim()}`) : "",
    state.bookingEngine.trim()
      ? `PMS / Booking Engine / Channel Manager: ${state.bookingEngine.trim()}`
      : "",
    state.goal.trim()
      ? thai
        ? `เป้าหมาย 3–6 เดือน: ${state.goal.trim()}`
        : `Goal for the next 3–6 months: ${state.goal.trim()}`
      : "",
    state.message.trim(),
  ];
  return parts.filter(Boolean).join("\n\n");
}

const hotelSystemsGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const technologyGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const trainingGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

function ContactNote({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = ENQUIRY_UI[locale];
  return (
    <p className={`text-sm leading-7 text-[#555555] ${className}`}>
      {t.orTalk}{" "}
      <a className="font-semibold text-[#0B6660]" href={`mailto:${AUDIT_CONTACTS.email}`}>
        {AUDIT_CONTACTS.email}
      </a>
      {" · "}
      <a className="font-semibold text-[#0B6660]" href={AUDIT_CONTACTS.phoneHref}>
        {AUDIT_CONTACTS.phoneDisplay}
      </a>
    </p>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  labelClassName = "block text-sm font-bold text-[#3B3B3B]",
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: string;
  labelClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
        {optional ? <span className="ml-2 font-medium text-[#555555]">({optional})</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-sm font-semibold text-[#C45C26]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EnquiryForm({
  locale,
  service,
  sectionId = "enquiry",
  kicker,
  title,
  body,
  submitLabel,
  showAssessmentNote = false,
  compact = false,
  consultantImageSrc,
  consultantImageAlt,
  introNextTitle,
  introSteps,
  introTrust,
  introReceiveTitle,
  introReceive,
  introVisualSrc,
  fieldLabels,
}: {
  locale: Locale;
  /** When set, service is preselected and the selector is hidden. */
  service?: EnquiryServiceId;
  sectionId?: string;
  kicker?: string;
  title?: string;
  body?: string;
  submitLabel?: string;
  showAssessmentNote?: boolean;
  compact?: boolean;
  consultantImageSrc?: string;
  consultantImageAlt?: string;
  introNextTitle?: string;
  introSteps?: string[];
  introTrust?: string[];
  introReceiveTitle?: string;
  introReceive?: Array<{ title: string; body?: string }>;
  introVisualSrc?: string;
  fieldLabels?: {
    name?: string;
    business?: string;
    contact?: string;
    website?: string;
    mapsUrl?: string;
    issue?: string;
    outcome?: string;
    goal?: string;
    market?: string;
    adsStatus?: string;
    trackingStatus?: string;
    analyticsStatus?: string;
    challenge?: string;
    bookingEngine?: string;
    cms?: string;
    timeline?: string;
    rooms?: string;
    hotelStatus?: string;
    teamSize?: string;
    systems?: string;
    message?: string;
    consent?: string;
    privacy?: string;
  };
}) {
  const preset = service ? enquiryServiceById(service) : null;
  const t = ENQUIRY_UI[locale];
  const formId = useId();
  const privacyHref = localizePath("/privacy", locale);
  const [state, setState] = useState<FormState>({
    name: "",
    businessName: "",
    contact: "",
    serviceInterest: service ?? "",
    topic: "",
    channels: "",
    scope: "",
    market: "",
    website: "",
    mapsUrl: "",
    adsStatus: "",
    trackingStatus: "",
    analyticsStatus: "",
    goal: "",
    bookingEngine: "",
    existingCms: "",
    timeline: "",
    rooms: "",
    hotelStatus: "",
    teamSize: "",
    message: "",
    consent: false,
    companyWebsite: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "unavailable">("idle");

  const heading = title ?? preset?.title[locale] ?? enquiryServiceById("general")!.title[locale];
  const lead = body ?? preset?.body[locale] ?? enquiryServiceById("general")!.body[locale];
  const kickerText = kicker ?? preset?.kicker[locale] ?? enquiryServiceById("general")!.kicker[locale];
  const cta = submitLabel ?? preset?.submit[locale] ?? enquiryServiceById("general")!.submit[locale];

  const validate = (next = state) => {
    const nextErrors: FieldError = {};
    const independentLabels = service === "independent_hotel" ? independentEnquiryCopy(locale).labels : null;
    const requiredMsg = independentLabels?.required || t.required;
    const emailMsg = independentLabels?.invalidEmail || t.invalidEmail;
    if (!next.name.trim()) nextErrors.name = requiredMsg;
    if (!next.businessName.trim()) nextErrors.businessName = requiredMsg;
    if (!next.contact.trim()) nextErrors.contact = requiredMsg;
    else if (next.contact.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.contact.trim())) {
      nextErrors.contact = emailMsg;
    }
    if (!preset && !next.serviceInterest) nextErrors.serviceInterest = requiredMsg;
    if (service === "revenue" && !next.topic.trim()) nextErrors.topic = requiredMsg;
    if ((service === "google_ads" || service === "meta_ads" || service === "search" || service === "website" || service === "conversion") && next.website.trim() && !looksLikeWebsite(next.website)) {
      nextErrors.website =
        service === "search"
          ? hotelSeoEnquiryCopy(locale).fields.websiteInvalid
          : service === "website"
            ? websiteEnquiryCopy(locale).fields.websiteInvalid
            : service === "conversion"
              ? directBookingEnquiryCopy(locale).fields.websiteInvalid
            : service === "meta_ads"
              ? metaEnquiryCopy(locale).fields.websiteInvalid
              : adsEnquiryCopy(locale).fields.websiteInvalid;
    }
    if (service === "search" && next.mapsUrl.trim() && !looksLikeWebsite(next.mapsUrl)) {
      nextErrors.mapsUrl = hotelSeoEnquiryCopy(locale).fields.mapsInvalid;
    }
    if ((service === "website" || service === "conversion") && next.bookingEngine.trim() && !looksLikeWebsite(next.bookingEngine)) {
      nextErrors.bookingEngine =
        service === "conversion"
          ? directBookingEnquiryCopy(locale).fields.bookingEngineInvalid
          : websiteEnquiryCopy(locale).fields.bookingEngineInvalid;
    }
    if (service === "independent_hotel" && next.website.trim() && !looksLikeWebsite(next.website)) {
      nextErrors.website = independentEnquiryCopy(locale).labels.websiteInvalid;
    }
    if (!next.consent) nextErrors.consent = requiredMsg;
    setErrors(nextErrors);
    return nextErrors;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.keys(validate()).length) return;
    setStatus("submitting");
    const serviceId = (preset?.id ?? state.serviceInterest) as EnquiryServiceId;
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          businessName: state.businessName.trim(),
          contact: state.contact.trim(),
          serviceInterest: serviceId,
          topic: service === "revenue" || service === "search" || service === "independent_hotel" ? state.topic : undefined,
          channels: service === "reservations" || service === "b2b" ? state.channels.trim() : undefined,
          scope: service === "reservations" ? state.scope.trim() : undefined,
          website: service === "google_ads" || service === "meta_ads" || service === "search" || service === "website" || service === "conversion" || service === "independent_hotel" ? state.website.trim() : undefined,
          mapsUrl: service === "search" ? state.mapsUrl.trim() : undefined,
          bookingEngine: service === "website" || service === "conversion" || service === "independent_hotel" ? state.bookingEngine.trim() : undefined,
          cms: service === "website" ? state.existingCms.trim() : undefined,
          timeline: service === "website" ? state.timeline.trim() : undefined,
          rooms: service === "independent_hotel" ? state.rooms.trim() : undefined,
          hotelStatus: service === "independent_hotel" ? state.hotelStatus.trim() : undefined,
          teamSize: service === "independent_hotel" ? state.teamSize.trim() : undefined,
          goal: service === "google_ads" || service === "meta_ads" || service === "website" || service === "conversion" || service === "independent_hotel" ? state.goal.trim() : undefined,
          market: service === "google_ads" || service === "meta_ads" || service === "b2b" ? state.market.trim() : undefined,
          adsStatus: service === "google_ads" || service === "meta_ads" ? state.adsStatus.trim() : undefined,
          analyticsStatus: service === "conversion" ? state.analyticsStatus.trim() : undefined,
          trackingStatus: service === "meta_ads" || service === "conversion" ? state.trackingStatus.trim() : undefined,
          message:
            service === "revenue"
              ? composeRevenueMessage(state.topic, state.message, locale)
              : service === "reservations"
                ? composeReservationsMessage(state.channels, state.scope, state.message, locale)
                : service === "b2b"
                  ? composeB2bMessage(state.market, state.channels, state.topic, state.message, locale)
                  : service === "google_ads"
                    ? composeGoogleAdsMessage(state.website, state.goal, state.market, state.adsStatus, state.message, locale)
                    : service === "meta_ads"
                      ? composeMetaAdsMessage(
                          state.website,
                          state.goal,
                          state.market,
                          state.adsStatus,
                          state.trackingStatus,
                          state.message,
                          locale,
                        )
                      : service === "search"
                        ? composeHotelSeoMessage(state.website, state.mapsUrl, state.topic, state.message, locale)
                        : service === "website"
                          ? composeWebsiteMessage(
                              state.website,
                              state.bookingEngine,
                              state.existingCms,
                              state.goal,
                              state.message,
                              state.timeline,
                              locale,
                            )
                          : service === "conversion"
                            ? composeConversionMessage(
                                state.website,
                                state.bookingEngine,
                                state.goal,
                                state.analyticsStatus,
                                state.trackingStatus,
                                state.message,
                                locale,
                              )
                          : service === "independent_hotel"
                            ? composeIndependentHotelMessage(state, locale)
                          : state.message.trim(),
          consent: state.consent,
          honeypot: state.companyWebsite,
          pageUrl: typeof window === "undefined" ? "" : window.location.href,
          utm: typeof window === "undefined" ? {} : readUtm(window.location.search),
          locale,
        }),
      });
      if (response.status === 503) {
        setStatus("unavailable");
        return;
      }
      if (!response.ok) throw new Error("submit_failed");
      track("generate_lead", {
        form: enquiryServiceById(serviceId)?.form ?? "contact_enquiry",
        serviceInterest: serviceId,
        locale,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const formCard = (
    <div className={compact ? "kpi-contact-form-panel" : "kpi-enquiry-panel"}>
      {status === "success" ? (
        <div className="kpi-contact-form-success" role="status">
          <p className="kpi-contact-form-success-title">{t.success}</p>
          <ContactNote locale={locale} className="kpi-contact-form-direct" />
        </div>
      ) : (
        <form className={`grid gap-5${compact ? " kpi-contact-form-fields" : ""}`} onSubmit={onSubmit} noValidate>
          <div className={compact ? "kpi-contact-form-pair" : "contents"}>
            <Field
              label={t.name}
              htmlFor={`${formId}-name`}
              error={errors.name}
              labelClassName={compact ? "kpi-contact-form-label" : "block text-sm font-bold text-[#3B3B3B]"}
            >
              <input
                id={`${formId}-name`}
                name="name"
                autoComplete="name"
                className="kpi-field mt-1"
                value={state.name}
                aria-invalid={Boolean(errors.name)}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
              />
            </Field>
            <Field
              label={t.contact}
              htmlFor={`${formId}-contact`}
              error={errors.contact}
              labelClassName={compact ? "kpi-contact-form-label" : "block text-sm font-bold text-[#3B3B3B]"}
            >
              <input
                id={`${formId}-contact`}
                name="contact"
                autoComplete="tel"
                inputMode="email"
                className="kpi-field mt-1"
                value={state.contact}
                aria-invalid={Boolean(errors.contact)}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
              />
            </Field>
          </div>
          <Field
            label={t.business}
            htmlFor={`${formId}-business`}
            error={errors.businessName}
            labelClassName={compact ? "kpi-contact-form-label" : "block text-sm font-bold text-[#3B3B3B]"}
          >
            <input
              id={`${formId}-business`}
              name="organization"
              autoComplete="organization"
              className="kpi-field mt-1"
              value={state.businessName}
              aria-invalid={Boolean(errors.businessName)}
              onBlur={() => validate()}
              onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
            />
          </Field>
          {!preset ? (
            <Field
              label={t.service}
              htmlFor={`${formId}-service`}
              error={errors.serviceInterest}
              labelClassName={compact ? "kpi-contact-form-label" : "block text-sm font-bold text-[#3B3B3B]"}
            >
              <select
                id={`${formId}-service`}
                name="serviceInterest"
                className="kpi-field mt-1"
                value={state.serviceInterest}
                aria-invalid={Boolean(errors.serviceInterest)}
                onBlur={() => validate()}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    serviceInterest: event.target.value as EnquiryServiceId | "",
                  }))
                }
              >
                <option value="">{t.servicePlaceholder}</option>
                {ENQUIRY_SERVICES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label[locale]}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <input type="hidden" name="serviceInterest" value={preset.id} />
          )}
          <Field
            label={t.message}
            htmlFor={`${formId}-message`}
            optional={t.messageOptional}
            labelClassName={compact ? "kpi-contact-form-label" : "block text-sm font-bold text-[#3B3B3B]"}
          >
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={4}
              className="kpi-field mt-1 kpi-contact-form-message"
              placeholder={t.messageHint}
              value={state.message}
              onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            />
          </Field>
          <FormPrivacyNotice locale={locale} />
          <label className={`flex gap-3 text-sm leading-7 text-[#555555]${compact ? " kpi-contact-form-consent" : ""}`}>
            <input
              type="checkbox"
              className="mt-1"
              checked={state.consent}
              aria-invalid={Boolean(errors.consent)}
              onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
            />
            <span>
              {t.consent}{" "}
              <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                {t.privacy}
              </Link>
            </span>
          </label>
          {errors.consent ? (
            <p className="text-sm font-semibold text-[#C45C26]" role="alert">
              {errors.consent}
            </p>
          ) : null}
          <input
            type="text"
            name="companyWebsite"
            value={state.companyWebsite}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-10000px] h-px w-px overflow-hidden"
            onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
          />
          <button className="kpi-button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? t.sending : cta}
          </button>
          {status === "error" ? (
            <p className="text-sm font-semibold text-[#C45C26]" role="alert">
              {t.failed}
            </p>
          ) : null}
          {status === "unavailable" ? (
            <p className="text-sm font-semibold text-[#C45C26]" role="alert">
              {t.unavailable}
            </p>
          ) : null}
          {showAssessmentNote ? <p className="kpi-contact-form-note">{t.assessmentNote}</p> : null}
          <ContactNote locale={locale} className={compact ? "kpi-contact-form-direct" : ""} />
        </form>
      )}
    </div>
  );

  if (service === "revenue" && !compact) {
    const groups = revenueGroups[locale];
    const formUi = locale === "th" ? revenueFormUi.th : revenueFormUi.en;
    const labelClassName = "kpi-revenue-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-revenue-enquiry scroll-mt-28">
        <div className="kpi-section kpi-revenue-enquiry-grid">
          <RevenueEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            photoSrc={consultantImageSrc}
            nextTitle={introNextTitle}
            steps={introSteps}
            trust={introTrust}
          />
          <div className="kpi-revenue-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-revenue-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-revenue-enquiry-success">{t.success}</p>
                <p className="kpi-revenue-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-revenue-enquiry-direct" />
              </div>
            ) : (
              <form
                className="kpi-revenue-enquiry-fields"
                onSubmit={onSubmit}
                noValidate
                aria-busy={sending}
              >
                <div className="kpi-revenue-enquiry-group">
                  <p className="kpi-revenue-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-revenue-enquiry-pair">
                    <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="tel"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-revenue-enquiry-group">
                  <p className="kpi-revenue-enquiry-group-label">{groups.hotel}</p>
                  <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="kpi-revenue-enquiry-group">
                  <Field label={formUi.topic} htmlFor={`${formId}-topic`} error={errors.topic} labelClassName={labelClassName}>
                    <select
                      id={`${formId}-topic`}
                      name="topic"
                      className="kpi-field"
                      value={state.topic}
                      disabled={sending}
                      aria-invalid={Boolean(errors.topic)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, topic: event.target.value }))}
                    >
                      <option value="">{formUi.topicPlaceholder}</option>
                      {revenueTopics.map((item) => (
                        <option key={item.id} value={item.id}>
                          {locale === "th" ? item.th : item.en}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t.message} htmlFor={`${formId}-message`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      className="kpi-field"
                      value={state.message}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                    <p className="kpi-revenue-enquiry-hint">{t.messageHint}</p>
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "revenue"} />
                <div className="kpi-revenue-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <div>
                  <label className="kpi-revenue-enquiry-consent" htmlFor={`${formId}-consent`}>
                    <input
                      id={`${formId}-consent`}
                      type="checkbox"
                      checked={state.consent}
                      disabled={sending}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                      onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                    />
                    <span>
                      {t.consent}{" "}
                      <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                        {t.privacy}
                      </Link>
                    </span>
                  </label>
                  {errors.consent ? (
                    <p id={`${formId}-consent-error`} className="kpi-revenue-enquiry-error" role="alert">
                      {errors.consent}
                    </p>
                  ) : null}
                </div>
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-revenue-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-revenue-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-revenue-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <p className="kpi-revenue-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-revenue-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "reservations" && !compact) {
    const groups = revenueGroups[locale];
    const formUi = locale === "th" ? reservationsFormUi.th : reservationsFormUi.en;
    const labelClassName = "kpi-reservations-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-reservations-enquiry scroll-mt-28">
        <div className="kpi-section kpi-reservations-enquiry-grid">
          <ReservationsEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            photoSrc={consultantImageSrc}
            photoAlt={consultantImageAlt}
            nextTitle={introNextTitle}
            steps={introSteps}
            trust={introTrust}
          />
          <div className="kpi-reservations-enquiry-panel">
            {status === "success" ? (
              <div role="status" aria-live="polite">
                <p className="kpi-reservations-enquiry-success">{t.success}</p>
                <p className="kpi-reservations-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-reservations-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-reservations-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-reservations-enquiry-group">
                  <p className="kpi-reservations-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-reservations-enquiry-pair">
                    <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-reservations-enquiry-group">
                  <p className="kpi-reservations-enquiry-group-label">{groups.hotel}</p>
                  <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="kpi-reservations-enquiry-group">
                  <p className="kpi-reservations-enquiry-group-label">{formUi.work}</p>
                  <Field
                    label={formUi.channels}
                    htmlFor={`${formId}-channels`}
                    optional={t.messageOptional}
                    labelClassName={labelClassName}
                  >
                    <input
                      id={`${formId}-channels`}
                      name="channels"
                      className="kpi-field"
                      placeholder={formUi.channelsHint}
                      value={state.channels}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, channels: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-reservations-enquiry-stack">
                    <Field
                      label={formUi.scope}
                      htmlFor={`${formId}-scope`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-scope`}
                        name="scope"
                        className="kpi-field"
                        placeholder={formUi.scopeHint}
                        value={state.scope}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, scope: event.target.value }))}
                      />
                    </Field>
                  </div>
                  <div className="kpi-reservations-enquiry-stack">
                    <Field
                      label={t.message}
                      htmlFor={`${formId}-message`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        rows={4}
                        className="kpi-field"
                        placeholder={t.messageHint}
                        value={state.message}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "reservations"} />
                <div className="kpi-reservations-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-reservations-enquiry-consent" htmlFor={`${formId}-consent`}>
                  <input
                    id={`${formId}-consent`}
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {t.consent}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {t.privacy}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p id={`${formId}-consent-error`} className="kpi-reservations-enquiry-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-reservations-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-reservations-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-reservations-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <p className="kpi-reservations-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-reservations-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "b2b" && !compact) {
    const groups = b2bGroups[locale];
    const formUi = b2bEnquiryCopy(locale).fields;
    const labelClassName = "kpi-b2b-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-b2b-enquiry scroll-mt-28">
        <div className="kpi-section kpi-b2b-enquiry-grid">
          <B2bEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
            photoSrc={consultantImageSrc}
            photoAlt={consultantImageAlt}
          />
          <div className="kpi-b2b-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-b2b-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-b2b-enquiry-success">{t.success}</p>
                <p className="kpi-b2b-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-b2b-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-b2b-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-b2b-enquiry-group">
                  <p className="kpi-b2b-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-b2b-enquiry-pair">
                    <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-b2b-enquiry-group">
                  <p className="kpi-b2b-enquiry-group-label">{groups.hotel}</p>
                  <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-b2b-enquiry-stack">
                    <Field
                      label={formUi.market}
                      htmlFor={`${formId}-market`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-market`}
                        name="market"
                        className="kpi-field"
                        placeholder={formUi.marketHint}
                        value={state.market}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, market: event.target.value }))}
                      />
                    </Field>
                  </div>
                  <div className="kpi-b2b-enquiry-stack">
                    <Field
                      label={formUi.channels}
                      htmlFor={`${formId}-channels`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-channels`}
                        name="channels"
                        className="kpi-field"
                        placeholder={formUi.channelsHint}
                        value={state.channels}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, channels: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-b2b-enquiry-group">
                  <p className="kpi-b2b-enquiry-group-label">{groups.topic}</p>
                  <Field
                    label={formUi.rate}
                    htmlFor={`${formId}-rate`}
                    optional={t.messageOptional}
                    labelClassName={labelClassName}
                  >
                    <input
                      id={`${formId}-rate`}
                      name="topic"
                      className="kpi-field"
                      placeholder={formUi.rateHint}
                      value={state.topic}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, topic: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-b2b-enquiry-stack">
                    <Field
                      label={formUi.challenge}
                      htmlFor={`${formId}-message`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        rows={4}
                        className="kpi-field"
                        placeholder={formUi.challengeHint}
                        value={state.message}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "b2b"} />
                <div className="kpi-b2b-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-b2b-enquiry-consent" htmlFor={`${formId}-consent`}>
                  <input
                    id={`${formId}-consent`}
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {t.consent}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {t.privacy}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p id={`${formId}-consent-error`} className="kpi-b2b-enquiry-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button kpi-b2b-enquiry-submit" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-b2b-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-b2b-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-b2b-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <p className="kpi-b2b-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-b2b-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "meta_ads" && !compact) {
    const groups = metaAdsGroups[locale];
    const metaCopy = metaEnquiryCopy(locale);
    const formUi = {
      ...metaCopy.fields,
      website: fieldLabels?.website?.trim() || metaCopy.fields.website,
      goal: fieldLabels?.goal?.trim() || metaCopy.fields.goal,
      market: fieldLabels?.market?.trim() || metaCopy.fields.market,
      adsStatus: fieldLabels?.adsStatus?.trim() || metaCopy.fields.adsStatus,
      tracking: fieldLabels?.trackingStatus?.trim() || metaCopy.fields.tracking,
      challenge: fieldLabels?.challenge?.trim() || metaCopy.fields.challenge,
    };
    const nameLabel = fieldLabels?.name?.trim() || t.name;
    const businessLabel = fieldLabels?.business?.trim() || t.business;
    const contactLabel = fieldLabels?.contact?.trim() || t.contact;
    const consentLabel = fieldLabels?.consent?.trim() || t.consent;
    const privacyLabel = fieldLabels?.privacy?.trim() || t.privacy;
    const labelClassName = "kpi-meta-ads-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-meta-ads-enquiry scroll-mt-28">
        <div className="kpi-section kpi-meta-ads-enquiry-grid">
          <MetaAdsEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
            photoSrc={consultantImageSrc}
            photoAlt={consultantImageAlt}
          />
          <div className="kpi-meta-ads-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-meta-ads-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-meta-ads-enquiry-success">{t.success}</p>
                <p className="kpi-meta-ads-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-meta-ads-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-meta-ads-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-meta-ads-enquiry-group">
                  <p className="kpi-meta-ads-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-meta-ads-enquiry-pair">
                    <Field label={nameLabel} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={contactLabel} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-meta-ads-enquiry-group">
                  <p className="kpi-meta-ads-enquiry-group-label">{groups.hotel}</p>
                  <Field label={businessLabel} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-meta-ads-enquiry-stack">
                    <Field
                      label={formUi.website}
                      htmlFor={`${formId}-website`}
                      optional={t.messageOptional}
                      error={errors.website}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-website`}
                        name="website"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.website}
                        disabled={sending}
                        aria-invalid={Boolean(errors.website)}
                        aria-describedby={`${formId}-website-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
                      />
                      <p id={`${formId}-website-hint`} className="kpi-meta-ads-enquiry-hint">
                        {formUi.websiteHint}
                      </p>
                    </Field>
                  </div>
                  <div className="kpi-meta-ads-enquiry-stack">
                    <Field label={formUi.goal} htmlFor={`${formId}-goal`} optional={t.messageOptional} labelClassName={labelClassName}>
                      <select
                        id={`${formId}-goal`}
                        name="goal"
                        className="kpi-field"
                        value={state.goal}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}
                      >
                        <option value="">{formUi.goalEmpty}</option>
                        <option value="awareness">{formUi.goalAwareness}</option>
                        <option value="enquiry">{formUi.goalInquiry}</option>
                        <option value="direct">{formUi.goalDirect}</option>
                      </select>
                    </Field>
                  </div>
                  <div className="kpi-meta-ads-enquiry-stack">
                    <Field
                      label={formUi.market}
                      htmlFor={`${formId}-market`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-market`}
                        name="market"
                        className="kpi-field"
                        value={state.market}
                        disabled={sending}
                        aria-describedby={`${formId}-market-hint`}
                        onChange={(event) => setState((current) => ({ ...current, market: event.target.value }))}
                      />
                      <p id={`${formId}-market-hint`} className="kpi-meta-ads-enquiry-hint">
                        {formUi.marketHint}
                      </p>
                    </Field>
                  </div>
                  <div className="kpi-meta-ads-enquiry-stack">
                    <Field
                      label={formUi.adsStatus}
                      htmlFor={`${formId}-ads-status`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <select
                        id={`${formId}-ads-status`}
                        name="adsStatus"
                        className="kpi-field"
                        value={state.adsStatus}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, adsStatus: event.target.value }))}
                      >
                        <option value="">{formUi.adsEmpty}</option>
                        <option value="yes">{formUi.adsYes}</option>
                        <option value="no">{formUi.adsNo}</option>
                        <option value="unsure">{formUi.adsUnsure}</option>
                      </select>
                    </Field>
                  </div>
                  <div className="kpi-meta-ads-enquiry-stack">
                    <Field
                      label={formUi.tracking}
                      htmlFor={`${formId}-tracking`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <select
                        id={`${formId}-tracking`}
                        name="trackingStatus"
                        className="kpi-field"
                        value={state.trackingStatus}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, trackingStatus: event.target.value }))}
                      >
                        <option value="">{formUi.trackingEmpty}</option>
                        <option value="yes">{formUi.trackingYes}</option>
                        <option value="no">{formUi.trackingNo}</option>
                        <option value="unsure">{formUi.trackingUnsure}</option>
                      </select>
                    </Field>
                  </div>
                </div>
                <div className="kpi-meta-ads-enquiry-group">
                  <p className="kpi-meta-ads-enquiry-group-label">{groups.topic}</p>
                  <Field
                    label={formUi.challenge}
                    htmlFor={`${formId}-message`}
                    optional={t.messageOptional}
                    labelClassName={labelClassName}
                  >
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      className="kpi-field"
                      value={state.message}
                      disabled={sending}
                      aria-describedby={`${formId}-challenge-hint`}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                    <p id={`${formId}-challenge-hint`} className="kpi-meta-ads-enquiry-hint">
                      {formUi.challengeHint}
                    </p>
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "meta_ads"} />
                <div className="kpi-meta-ads-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-meta-ads-enquiry-consent" htmlFor={`${formId}-consent`}>
                  <input
                    id={`${formId}-consent`}
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {consentLabel}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {privacyLabel}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p id={`${formId}-consent-error`} className="kpi-meta-ads-enquiry-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button kpi-meta-ads-enquiry-submit" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-meta-ads-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-meta-ads-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-meta-ads-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-meta-ads-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "google_ads" && !compact) {
    const groups = googleAdsGroups[locale];
    const adsCopy = adsEnquiryCopy(locale);
    const formUi = {
      ...adsCopy.fields,
      website: fieldLabels?.website?.trim() || adsCopy.fields.website,
      goal: fieldLabels?.goal?.trim() || adsCopy.fields.goal,
      market: fieldLabels?.market?.trim() || adsCopy.fields.market,
      adsStatus: fieldLabels?.adsStatus?.trim() || adsCopy.fields.adsStatus,
      challenge: fieldLabels?.challenge?.trim() || adsCopy.fields.challenge,
    };
    const nameLabel = fieldLabels?.name?.trim() || t.name;
    const businessLabel = fieldLabels?.business?.trim() || t.business;
    const contactLabel = fieldLabels?.contact?.trim() || t.contact;
    const consentLabel = fieldLabels?.consent?.trim() || t.consent;
    const privacyLabel = fieldLabels?.privacy?.trim() || t.privacy;
    const labelClassName = "kpi-google-ads-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-google-ads-enquiry scroll-mt-28">
        <div className="kpi-section kpi-google-ads-enquiry-grid">
          <AdsEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
            photoSrc={consultantImageSrc}
            photoAlt={consultantImageAlt}
          />
          <div className="kpi-google-ads-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-google-ads-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-google-ads-enquiry-success">{t.success}</p>
                <p className="kpi-google-ads-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-google-ads-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-google-ads-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-google-ads-enquiry-group">
                  <p className="kpi-google-ads-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-google-ads-enquiry-pair">
                    <Field label={nameLabel} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={contactLabel} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-google-ads-enquiry-group">
                  <p className="kpi-google-ads-enquiry-group-label">{groups.hotel}</p>
                  <Field label={businessLabel} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-google-ads-enquiry-stack">
                    <Field
                      label={formUi.website}
                      htmlFor={`${formId}-website`}
                      optional={t.messageOptional}
                      error={errors.website}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-website`}
                        name="website"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.website}
                        disabled={sending}
                        aria-invalid={Boolean(errors.website)}
                        aria-describedby={`${formId}-website-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
                      />
                      <p id={`${formId}-website-hint`} className="kpi-google-ads-enquiry-hint">
                        {formUi.websiteHint}
                      </p>
                    </Field>
                  </div>
                  <div className="kpi-google-ads-enquiry-stack">
                    <Field label={formUi.goal} htmlFor={`${formId}-goal`} optional={t.messageOptional} labelClassName={labelClassName}>
                      <select
                        id={`${formId}-goal`}
                        name="goal"
                        className="kpi-field"
                        value={state.goal}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}
                      >
                        <option value="">{formUi.goalEmpty}</option>
                        <option value="direct">{formUi.goalDirect}</option>
                        <option value="awareness">{formUi.goalAwareness}</option>
                        <option value="expansion">{formUi.goalExpansion}</option>
                      </select>
                    </Field>
                  </div>
                  <div className="kpi-google-ads-enquiry-stack">
                    <Field
                      label={formUi.market}
                      htmlFor={`${formId}-market`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-market`}
                        name="market"
                        className="kpi-field"
                        value={state.market}
                        disabled={sending}
                        aria-describedby={`${formId}-market-hint`}
                        onChange={(event) => setState((current) => ({ ...current, market: event.target.value }))}
                      />
                      <p id={`${formId}-market-hint`} className="kpi-google-ads-enquiry-hint">
                        {formUi.marketHint}
                      </p>
                    </Field>
                  </div>
                  <div className="kpi-google-ads-enquiry-stack">
                    <Field
                      label={formUi.adsStatus}
                      htmlFor={`${formId}-ads-status`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <select
                        id={`${formId}-ads-status`}
                        name="adsStatus"
                        className="kpi-field"
                        value={state.adsStatus}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, adsStatus: event.target.value }))}
                      >
                        <option value="">{formUi.adsEmpty}</option>
                        <option value="yes">{formUi.adsYes}</option>
                        <option value="no">{formUi.adsNo}</option>
                        <option value="unsure">{formUi.adsUnsure}</option>
                      </select>
                    </Field>
                  </div>
                </div>
                <div className="kpi-google-ads-enquiry-group">
                  <p className="kpi-google-ads-enquiry-group-label">{groups.topic}</p>
                  <Field
                    label={formUi.challenge}
                    htmlFor={`${formId}-message`}
                    optional={t.messageOptional}
                    labelClassName={labelClassName}
                  >
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      className="kpi-field"
                      value={state.message}
                      disabled={sending}
                      aria-describedby={`${formId}-challenge-hint`}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                    <p id={`${formId}-challenge-hint`} className="kpi-google-ads-enquiry-hint">
                      {formUi.challengeHint}
                    </p>
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "google_ads"} />
                <div className="kpi-google-ads-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-google-ads-enquiry-consent" htmlFor={`${formId}-consent`}>
                  <input
                    id={`${formId}-consent`}
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {consentLabel}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {privacyLabel}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p id={`${formId}-consent-error`} className="kpi-google-ads-enquiry-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button kpi-google-ads-enquiry-submit" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-google-ads-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-google-ads-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-google-ads-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-google-ads-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "conversion" && !compact) {
    const groups = conversionGroups[locale];
    const conversionCopy = directBookingEnquiryCopy(locale);
    const formUi = {
      ...conversionCopy.fields,
      website: fieldLabels?.website?.trim() || conversionCopy.fields.website,
      bookingEngine: fieldLabels?.bookingEngine?.trim() || conversionCopy.fields.bookingEngine,
      goal: fieldLabels?.goal?.trim() || conversionCopy.fields.goal,
      analytics: fieldLabels?.analyticsStatus?.trim() || conversionCopy.fields.analytics,
      tracking: fieldLabels?.trackingStatus?.trim() || conversionCopy.fields.tracking,
      concern: fieldLabels?.challenge?.trim() || conversionCopy.fields.concern,
    };
    const nameLabel = fieldLabels?.name?.trim() || conversionCopy.labels.name;
    const businessLabel = fieldLabels?.business?.trim() || conversionCopy.labels.business;
    const contactLabel = fieldLabels?.contact?.trim() || conversionCopy.labels.contact;
    const consentLabel = fieldLabels?.consent?.trim() || conversionCopy.labels.consent;
    const privacyLabel = fieldLabels?.privacy?.trim() || conversionCopy.labels.privacy;
    const labelClassName = "kpi-website-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-conversion-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <ConversionEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
          />
          <div className="kpi-conversion-enquiry-aside">
            <ConversionEnquiryVisual locale={locale} src={introVisualSrc} />
            <div className="kpi-website-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-website-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-website-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-website-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={nameLabel} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={contactLabel} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.hotel}</p>
                  <Field label={businessLabel} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-website-enquiry-stack">
                    <Field
                      label={formUi.website}
                      htmlFor={`${formId}-website`}
                      optional={t.messageOptional}
                      error={errors.website}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-website`}
                        name="website"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.website}
                        disabled={sending}
                        aria-invalid={Boolean(errors.website)}
                        aria-describedby={`${formId}-website-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
                      />
                      <p id={`${formId}-website-hint`} className="kpi-website-enquiry-hint">
                        {formUi.websiteHint}
                      </p>
                    </Field>
                    <Field
                      label={formUi.bookingEngine}
                      htmlFor={`${formId}-booking-engine`}
                      optional={t.messageOptional}
                      error={errors.bookingEngine}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-booking-engine`}
                        name="bookingEngine"
                        inputMode="url"
                        className="kpi-field"
                        value={state.bookingEngine}
                        disabled={sending}
                        aria-invalid={Boolean(errors.bookingEngine)}
                        aria-describedby={`${formId}-booking-engine-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, bookingEngine: event.target.value }))}
                      />
                      <p id={`${formId}-booking-engine-hint`} className="kpi-website-enquiry-hint">
                        {formUi.bookingEngineHint}
                      </p>
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.topic}</p>
                  <Field label={formUi.goal} htmlFor={`${formId}-goal`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <select
                      id={`${formId}-goal`}
                      name="goal"
                      className="kpi-field"
                      value={state.goal}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}
                    >
                      <option value="">{formUi.goalEmpty}</option>
                      <option value="direct">{formUi.goalDirect}</option>
                      <option value="review">{formUi.goalReview}</option>
                      <option value="website">{formUi.goalWebsite}</option>
                    </select>
                  </Field>
                  <div className="kpi-website-enquiry-stack">
                    <Field label={formUi.analytics} htmlFor={`${formId}-analytics`} optional={t.messageOptional} labelClassName={labelClassName}>
                      <select
                        id={`${formId}-analytics`}
                        name="analyticsStatus"
                        className="kpi-field"
                        value={state.analyticsStatus}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, analyticsStatus: event.target.value }))}
                      >
                        <option value="">{formUi.analyticsEmpty}</option>
                        <option value="yes">{formUi.analyticsYes}</option>
                        <option value="no">{formUi.analyticsNo}</option>
                        <option value="unsure">{formUi.analyticsUnsure}</option>
                      </select>
                    </Field>
                    <Field label={formUi.tracking} htmlFor={`${formId}-tracking`} optional={t.messageOptional} labelClassName={labelClassName}>
                      <select
                        id={`${formId}-tracking`}
                        name="trackingStatus"
                        className="kpi-field"
                        value={state.trackingStatus}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, trackingStatus: event.target.value }))}
                      >
                        <option value="">{formUi.trackingEmpty}</option>
                        <option value="yes">{formUi.trackingYes}</option>
                        <option value="no">{formUi.trackingNo}</option>
                        <option value="unsure">{formUi.trackingUnsure}</option>
                      </select>
                    </Field>
                    <Field
                      label={formUi.concern}
                      htmlFor={`${formId}-message`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        rows={4}
                        className="kpi-field"
                        value={state.message}
                        disabled={sending}
                        aria-describedby={`${formId}-challenge-hint`}
                        onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                      />
                      <p id={`${formId}-challenge-hint`} className="kpi-website-enquiry-hint">
                        {formUi.concernHint}
                      </p>
                    </Field>
                  </div>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "conversion"} />
                <div className="kpi-website-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-website-enquiry-consent">
                  <input
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {consentLabel}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {privacyLabel}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button kpi-website-enquiry-submit" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? (
                    t.sending
                  ) : (
                    <>
                      {cta}
                      <span className="kpi-website-enquiry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </>
                  )}
                </button>
                {sending ? (
                  <p className="kpi-website-enquiry-status" role="status" aria-live="polite">
                    {conversionCopy.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-website-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-website-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </form>
            )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (service === "website" && !compact) {
    const groups = websiteGroups[locale];
    const websiteCopy = websiteEnquiryCopy(locale);
    const formUi = {
      ...websiteCopy.fields,
      website: fieldLabels?.website?.trim() || websiteCopy.fields.website,
      bookingEngine: fieldLabels?.bookingEngine?.trim() || websiteCopy.fields.bookingEngine,
      cms: fieldLabels?.cms?.trim() || websiteCopy.fields.cms,
      goal: fieldLabels?.goal?.trim() || websiteCopy.fields.goal,
      challenge: fieldLabels?.challenge?.trim() || websiteCopy.fields.challenge,
      timeline: fieldLabels?.timeline?.trim() || websiteCopy.fields.timeline,
    };
    const nameLabel = fieldLabels?.name?.trim() || websiteCopy.labels.name;
    const businessLabel = fieldLabels?.business?.trim() || websiteCopy.labels.business;
    const contactLabel = fieldLabels?.contact?.trim() || websiteCopy.labels.contact;
    const consentLabel = fieldLabels?.consent?.trim() || websiteCopy.labels.consent;
    const privacyLabel = fieldLabels?.privacy?.trim() || websiteCopy.labels.privacy;
    const labelClassName = "kpi-website-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-website-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <WebsiteEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
          />
          <div className="kpi-website-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-website-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-website-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-website-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={nameLabel} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={contactLabel} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.hotel}</p>
                  <Field label={businessLabel} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-website-enquiry-stack">
                    <Field
                      label={formUi.website}
                      htmlFor={`${formId}-website`}
                      optional={t.messageOptional}
                      error={errors.website}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-website`}
                        name="website"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.website}
                        disabled={sending}
                        aria-invalid={Boolean(errors.website)}
                        aria-describedby={`${formId}-website-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
                      />
                      <p id={`${formId}-website-hint`} className="kpi-website-enquiry-hint">
                        {formUi.websiteHint}
                      </p>
                    </Field>
                    <Field
                      label={formUi.bookingEngine}
                      htmlFor={`${formId}-booking-engine`}
                      optional={t.messageOptional}
                      error={errors.bookingEngine}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-booking-engine`}
                        name="bookingEngine"
                        inputMode="url"
                        className="kpi-field"
                        value={state.bookingEngine}
                        disabled={sending}
                        aria-invalid={Boolean(errors.bookingEngine)}
                        aria-describedby={`${formId}-booking-engine-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, bookingEngine: event.target.value }))}
                      />
                      <p id={`${formId}-booking-engine-hint`} className="kpi-website-enquiry-hint">
                        {formUi.bookingEngineHint}
                      </p>
                    </Field>
                    <Field label={formUi.cms} htmlFor={`${formId}-cms`} optional={t.messageOptional} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-cms`}
                        name="cms"
                        className="kpi-field"
                        value={state.existingCms}
                        disabled={sending}
                        aria-describedby={`${formId}-cms-hint`}
                        onChange={(event) => setState((current) => ({ ...current, existingCms: event.target.value }))}
                      />
                      <p id={`${formId}-cms-hint`} className="kpi-website-enquiry-hint">
                        {formUi.cmsHint}
                      </p>
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.topic}</p>
                  <Field label={formUi.goal} htmlFor={`${formId}-goal`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <select
                      id={`${formId}-goal`}
                      name="goal"
                      className="kpi-field"
                      value={state.goal}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}
                    >
                      <option value="">{formUi.goalEmpty}</option>
                      <option value="direct">{formUi.goalDirect}</option>
                      <option value="refresh">{formUi.goalRefresh}</option>
                      <option value="mobile">{formUi.goalMobile}</option>
                      <option value="cms">{formUi.goalCms}</option>
                    </select>
                  </Field>
                  <div className="kpi-website-enquiry-stack">
                    <Field
                      label={formUi.challenge}
                      htmlFor={`${formId}-message`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        rows={4}
                        className="kpi-field"
                        value={state.message}
                        disabled={sending}
                        aria-describedby={`${formId}-challenge-hint`}
                        onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                      />
                      <p id={`${formId}-challenge-hint`} className="kpi-website-enquiry-hint">
                        {formUi.challengeHint}
                      </p>
                    </Field>
                    <Field label={formUi.timeline} htmlFor={`${formId}-timeline`} optional={t.messageOptional} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-timeline`}
                        name="timeline"
                        className="kpi-field"
                        value={state.timeline}
                        disabled={sending}
                        aria-describedby={`${formId}-timeline-hint`}
                        onChange={(event) => setState((current) => ({ ...current, timeline: event.target.value }))}
                      />
                      <p id={`${formId}-timeline-hint`} className="kpi-website-enquiry-hint">
                        {formUi.timelineHint}
                      </p>
                    </Field>
                  </div>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "website"} />
                <div className="kpi-website-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-website-enquiry-consent" htmlFor={`${formId}-consent`}>
                  <input
                    id={`${formId}-consent`}
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {consentLabel}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {privacyLabel}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p id={`${formId}-consent-error`} className="kpi-website-enquiry-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button kpi-website-enquiry-submit" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-website-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-website-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-website-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "search" && !compact) {
    const groups = searchGroups[locale];
    const searchCopy = hotelSeoEnquiryCopy(locale);
    const formUi = {
      ...searchCopy.fields,
      website: fieldLabels?.website?.trim() || searchCopy.fields.website,
      maps: fieldLabels?.mapsUrl?.trim() || searchCopy.fields.maps,
      issue: fieldLabels?.issue?.trim() || searchCopy.fields.issue,
      outcome: fieldLabels?.outcome?.trim() || searchCopy.fields.outcome,
    };
    const nameLabel = fieldLabels?.name?.trim() || searchCopy.labels.name;
    const businessLabel = fieldLabels?.business?.trim() || searchCopy.labels.business;
    const contactLabel = fieldLabels?.contact?.trim() || searchCopy.labels.contact;
    const consentLabel = fieldLabels?.consent?.trim() || searchCopy.labels.consent;
    const privacyLabel = fieldLabels?.privacy?.trim() || searchCopy.labels.privacy;
    const labelClassName = "kpi-search-enquiry-label";
    const sending = status === "submitting";
    return (
      <section id={sectionId} className="kpi-search-enquiry scroll-mt-28">
        <div className="kpi-section kpi-search-enquiry-grid">
          <HotelSeoEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
            photoSrc={consultantImageSrc}
            photoAlt={consultantImageAlt}
          />
          <div className="kpi-search-enquiry-panel">
            {status === "success" ? (
              <div className="kpi-search-enquiry-done" role="status" aria-live="polite">
                <p className="kpi-search-enquiry-success">{t.success}</p>
                <p className="kpi-search-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-search-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-search-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-search-enquiry-group">
                  <p className="kpi-search-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-search-enquiry-pair">
                    <Field label={nameLabel} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={contactLabel} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-search-enquiry-group">
                  <p className="kpi-search-enquiry-group-label">{groups.hotel}</p>
                  <Field label={businessLabel} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-search-enquiry-stack">
                    <Field
                      label={formUi.website}
                      htmlFor={`${formId}-website`}
                      optional={t.messageOptional}
                      error={errors.website}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-website`}
                        name="website"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.website}
                        disabled={sending}
                        aria-invalid={Boolean(errors.website)}
                        aria-describedby={`${formId}-website-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
                      />
                      <p id={`${formId}-website-hint`} className="kpi-search-enquiry-hint">
                        {formUi.websiteHint}
                      </p>
                    </Field>
                  </div>
                  <div className="kpi-search-enquiry-stack">
                    <Field
                      label={formUi.maps}
                      htmlFor={`${formId}-maps`}
                      optional={t.messageOptional}
                      error={errors.mapsUrl}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-maps`}
                        name="mapsUrl"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.mapsUrl}
                        disabled={sending}
                        aria-invalid={Boolean(errors.mapsUrl)}
                        aria-describedby={`${formId}-maps-hint`}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, mapsUrl: event.target.value }))}
                      />
                      <p id={`${formId}-maps-hint`} className="kpi-search-enquiry-hint">
                        {formUi.mapsHint}
                      </p>
                    </Field>
                  </div>
                </div>
                <div className="kpi-search-enquiry-group">
                  <p className="kpi-search-enquiry-group-label">{groups.topic}</p>
                  <Field label={formUi.issue} htmlFor={`${formId}-issue`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <select
                      id={`${formId}-issue`}
                      name="topic"
                      className="kpi-field"
                      value={state.topic}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, topic: event.target.value }))}
                    >
                      <option value="">{formUi.issueEmpty}</option>
                      <option value="search">{formUi.issueSearch}</option>
                      <option value="maps">{formUi.issueMaps}</option>
                      <option value="website">{formUi.issueWebsite}</option>
                      <option value="contact">{formUi.issueContact}</option>
                      <option value="booking">{formUi.issueBooking}</option>
                    </select>
                  </Field>
                  <div className="kpi-search-enquiry-stack">
                    <Field
                      label={formUi.outcome}
                      htmlFor={`${formId}-message`}
                      optional={t.messageOptional}
                      labelClassName={labelClassName}
                    >
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        rows={4}
                        className="kpi-field"
                        value={state.message}
                        disabled={sending}
                        aria-describedby={`${formId}-outcome-hint`}
                        onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                      />
                      <p id={`${formId}-outcome-hint`} className="kpi-search-enquiry-hint">
                        {formUi.outcomeHint}
                      </p>
                    </Field>
                  </div>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "search"} />
                <div className="kpi-search-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-search-enquiry-consent" htmlFor={`${formId}-consent`}>
                  <input
                    id={`${formId}-consent`}
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {consentLabel}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {privacyLabel}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p id={`${formId}-consent-error`} className="kpi-search-enquiry-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button kpi-search-enquiry-submit" type="submit" disabled={sending} aria-busy={sending}>
                  {sending ? t.sending : cta}
                </button>
                {sending ? (
                  <p className="kpi-search-enquiry-status" role="status" aria-live="polite">
                    {formUi.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-search-enquiry-error" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-search-enquiry-error" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-search-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "training" && !compact) {
    const groups = trainingGroups[locale];
    const labelClassName = "kpi-website-enquiry-label";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-train-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <div className="kpi-website-enquiry-intro">
            <p className="kpi-website-enquiry-kicker kpi-latin">
              {locale === "th" ? "TRAINING & TEAM DEVELOPMENT" : kickerText}
            </p>
            <h2 className="kpi-h2 kpi-website-enquiry-heading">
              {locale === "th" ? "คุยเรื่องการพัฒนาทีมโรงแรม" : heading}
            </h2>
            {locale === "th" ? (
              <p className="kpi-website-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับทีม</span>
                <span className="kpi-website-enquiry-line">แล้วเราจะช่วยดูว่าควรเริ่มจากทักษะ</span>
                <span className="kpi-website-enquiry-line">หรือรูปแบบการพัฒนาแบบไหนก่อน</span>
              </p>
            ) : (
              <p className="kpi-website-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-website-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูบทบาทและหน้าที่ของทีม</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>ดูปัญหาหรือช่องว่างในการทำงาน</span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>
                      ดูรูปแบบ <span className="kpi-latin">Training</span> ที่เหมาะกับทีมจริง
                    </span>
                  </li>
                </ol>
                <p className="kpi-website-enquiry-note">
                  ไม่จำเป็นต้องรู้ก่อนว่าควรจัดหลักสูตรอะไร
                  <span className="kpi-website-enquiry-line">ทีมช่วยออกแบบจากสถานการณ์จริงได้</span>
                </p>
              </>
            ) : null}
          </div>
          <div className="kpi-website-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-website-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-website-enquiry-fields" onSubmit={onSubmit} noValidate>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="tel"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.hotel}</p>
                  <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.topic}</p>
                  <Field label={t.message} htmlFor={`${formId}-message`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      className="kpi-field"
                      placeholder={t.messageHint}
                      value={state.message}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "training"} />
                <div className="kpi-website-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-website-enquiry-consent">
                  <input
                    type="checkbox"
                    checked={state.consent}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {t.consent}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {t.privacy}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? (
                    t.sending
                  ) : locale === "th" ? (
                    <>
                      ให้ทีมช่วยดูแนวทางพัฒนาทีม
                      <span className="kpi-website-enquiry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </>
                  ) : (
                    cta
                  )}
                </button>
                {status === "error" ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "technology" && !compact) {
    const groups = technologyGroups[locale];
    const labelClassName = "kpi-website-enquiry-label";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-tech-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <div className="kpi-website-enquiry-intro">
            <p className="kpi-website-enquiry-kicker kpi-latin">
              {locale === "th" ? "AI & AUTOMATION" : kickerText}
            </p>
            <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading}</h2>
            {locale === "th" ? (
              <p className="kpi-website-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับงานที่ทีมทำอยู่</span>
                <span className="kpi-website-enquiry-line">แล้วเราจะช่วยดูว่าจุดไหนควรจัดระบบก่อน</span>
                <span className="kpi-website-enquiry-line">
                  และจุดไหนมีโอกาสใช้ <span className="kpi-latin">Automation</span> ได้จริง
                </span>
              </p>
            ) : (
              <p className="kpi-website-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-website-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูงานที่ทำซ้ำ</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>ดูข้อมูลและระบบที่เกี่ยวข้อง</span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>
                      ดูว่าจุดไหนควร <span className="kpi-latin">Simplify</span> ก่อน{" "}
                      <span className="kpi-latin">Automate</span>
                    </span>
                  </li>
                </ol>
                <p className="kpi-website-enquiry-note">
                  ไม่จำเป็นต้องรู้ว่าควรใช้ <span className="kpi-latin">AI</span> ตัวไหน
                  <span className="kpi-website-enquiry-line">
                    หรือ <span className="kpi-latin">Automation</span> แบบใดก่อน
                  </span>
                  <span className="kpi-website-enquiry-line">
                    ทีมจะเริ่มจาก <span className="kpi-latin">Workflow</span> จริงของคุณ
                  </span>
                </p>
              </>
            ) : null}
          </div>
          <div className="kpi-website-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-website-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-website-enquiry-fields" onSubmit={onSubmit} noValidate>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="tel"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.hotel}</p>
                  <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.topic}</p>
                  <Field label={t.message} htmlFor={`${formId}-message`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      className="kpi-field"
                      placeholder={t.messageHint}
                      value={state.message}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "technology"} />
                <div className="kpi-website-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-website-enquiry-consent">
                  <input
                    type="checkbox"
                    checked={state.consent}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {t.consent}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {t.privacy}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? (
                    t.sending
                  ) : locale === "th" ? (
                    <>
                      ให้ทีมช่วยดู <span className="kpi-latin">Workflow</span> ของคุณ
                      <span className="kpi-website-enquiry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </>
                  ) : (
                    cta
                  )}
                </button>
                {status === "error" ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "hotel_systems" && !compact) {
    const groups = hotelSystemsGroups[locale];
    const labelClassName = "kpi-website-enquiry-label";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-systems-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <div className="kpi-website-enquiry-intro">
            <p className="kpi-website-enquiry-kicker kpi-latin">{kickerText}</p>
            <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading}</h2>
            {locale === "th" ? (
              <p className="kpi-website-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับโรงแรม</span>
                <span className="kpi-website-enquiry-line">แล้วทีมจะช่วยดูว่าควรเริ่มจากจุดไหนก่อน</span>
              </p>
            ) : (
              <p className="kpi-website-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-website-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูระบบที่ใช้อยู่และวิธีทำงานจริง</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>
                      ดูการเชื่อม <span className="kpi-latin">PMS</span>,{" "}
                      <span className="kpi-latin">Channel Manager</span> และ{" "}
                      <span className="kpi-latin">Booking Engine</span>
                    </span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>ดูจุดที่ข้อมูลยังต้องทำซ้ำหรือทีมทำงานยาก</span>
                  </li>
                </ol>
                <p className="kpi-website-enquiry-note">
                  ไม่จำเป็นต้องรู้ก่อนว่าต้องเปลี่ยนระบบหรือไม่
                  <span className="kpi-website-enquiry-line">ทีมช่วยประเมินได้ว่าควรปรับ เชื่อม หรือเปลี่ยนตรงไหน</span>
                </p>
              </>
            ) : null}
          </div>
          <div className="kpi-website-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-website-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-website-enquiry-fields" onSubmit={onSubmit} noValidate>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="tel"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.hotel}</p>
                  <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.topic}</p>
                  <Field label={t.message} htmlFor={`${formId}-message`} optional={t.messageOptional} labelClassName={labelClassName}>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      className="kpi-field"
                      placeholder={t.messageHint}
                      value={state.message}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "hotel_systems"} />
                <div className="kpi-website-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-website-enquiry-consent">
                  <input
                    type="checkbox"
                    checked={state.consent}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {t.consent}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {t.privacy}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button className="kpi-button" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? (
                    t.sending
                  ) : locale === "th" ? (
                    <>
                      ให้ทีมดูระบบโรงแรมของคุณ
                      <span className="kpi-website-enquiry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </>
                  ) : (
                    cta
                  )}
                </button>
                {status === "error" ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (service === "independent_hotel" && !compact) {
    const groups = independentHotelGroups[locale];
    const copy = independentEnquiryCopy(locale);
    const labels = copy.labels;
    const nameLabel = fieldLabels?.name?.trim() || labels.name;
    const businessLabel = fieldLabels?.business?.trim() || labels.business;
    const contactLabel = fieldLabels?.contact?.trim() || labels.contact;
    const roomsLabel = fieldLabels?.rooms?.trim() || labels.rooms;
    const hotelStatusLabel = fieldLabels?.hotelStatus?.trim() || labels.hotelStatus;
    const teamSizeLabel = fieldLabels?.teamSize?.trim() || labels.teamSize;
    const websiteLabel = fieldLabels?.website?.trim() || labels.website;
    const systemsLabel = fieldLabels?.systems?.trim() || labels.systems;
    const challengeLabel = fieldLabels?.challenge?.trim() || labels.challenge;
    const goalLabel = fieldLabels?.goal?.trim() || labels.goal;
    const messageLabel = fieldLabels?.message?.trim() || labels.message;
    const consentLabel = fieldLabels?.consent?.trim() || labels.consent;
    const privacyLabel = fieldLabels?.privacy?.trim() || labels.privacy;
    const labelClassName = "kpi-website-enquiry-label";
    const sending = status === "submitting";
    const thaiOptions = locale === "th";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-independent-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <IndependentEnquiryIntro
            locale={locale}
            kicker={kickerText}
            heading={heading}
            lead={lead}
            receiveTitle={introReceiveTitle}
            receive={introReceive}
            nextTitle={introNextTitle}
            steps={introSteps}
          />
          <div className="kpi-independent-enquiry-aside">
            <IndependentEnquiryVisual locale={locale} src={introVisualSrc} />
            <div className="kpi-website-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-website-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-website-enquiry-fields" onSubmit={onSubmit} noValidate aria-busy={sending}>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={nameLabel} htmlFor={`${formId}-name`} error={errors.name} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-name`}
                        name="name"
                        autoComplete="name"
                        className="kpi-field"
                        value={state.name}
                        disabled={sending}
                        aria-invalid={Boolean(errors.name)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                      />
                    </Field>
                    <Field label={contactLabel} htmlFor={`${formId}-contact`} error={errors.contact} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-contact`}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        className="kpi-field"
                        value={state.contact}
                        disabled={sending}
                        aria-invalid={Boolean(errors.contact)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, contact: event.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.hotel}</p>
                  <Field label={businessLabel} htmlFor={`${formId}-business`} error={errors.businessName} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-business`}
                      name="organization"
                      autoComplete="organization"
                      className="kpi-field"
                      value={state.businessName}
                      disabled={sending}
                      aria-invalid={Boolean(errors.businessName)}
                      onBlur={() => validate()}
                      onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                    />
                  </Field>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={roomsLabel} htmlFor={`${formId}-rooms`} optional={labels.optional} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-rooms`}
                        name="rooms"
                        inputMode="numeric"
                        className="kpi-field"
                        value={state.rooms}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, rooms: event.target.value }))}
                      />
                    </Field>
                    <Field label={hotelStatusLabel} htmlFor={`${formId}-hotel-status`} optional={labels.optional} labelClassName={labelClassName}>
                      <select
                        id={`${formId}-hotel-status`}
                        name="hotelStatus"
                        className="kpi-field"
                        value={state.hotelStatus}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, hotelStatus: event.target.value }))}
                      >
                        <option value="">{labels.hotelStatusPlaceholder}</option>
                        {INDEPENDENT_HOTEL_STATUS.map((item) => (
                          <option key={item.id} value={item.id}>
                            {thaiOptions ? item.th : item.en}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="kpi-website-enquiry-pair">
                    <Field label={teamSizeLabel} htmlFor={`${formId}-team-size`} optional={labels.optional} labelClassName={labelClassName}>
                      <input
                        id={`${formId}-team-size`}
                        name="teamSize"
                        className="kpi-field"
                        value={state.teamSize}
                        disabled={sending}
                        onChange={(event) => setState((current) => ({ ...current, teamSize: event.target.value }))}
                      />
                    </Field>
                    <Field
                      label={websiteLabel}
                      htmlFor={`${formId}-website`}
                      optional={labels.optional}
                      error={errors.website}
                      labelClassName={labelClassName}
                    >
                      <input
                        id={`${formId}-website`}
                        name="website"
                        inputMode="url"
                        autoComplete="url"
                        className="kpi-field"
                        value={state.website}
                        disabled={sending}
                        aria-invalid={Boolean(errors.website)}
                        onBlur={() => validate()}
                        onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
                      />
                    </Field>
                  </div>
                  <Field label={systemsLabel} htmlFor={`${formId}-systems`} optional={labels.optional} labelClassName={labelClassName}>
                    <input
                      id={`${formId}-systems`}
                      name="bookingEngine"
                      className="kpi-field"
                      value={state.bookingEngine}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, bookingEngine: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="kpi-website-enquiry-group">
                  <p className="kpi-website-enquiry-group-label">{groups.topic}</p>
                  <Field label={challengeLabel} htmlFor={`${formId}-challenge`} optional={labels.optional} labelClassName={labelClassName}>
                    <select
                      id={`${formId}-challenge`}
                      name="topic"
                      className="kpi-field"
                      value={state.topic}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, topic: event.target.value }))}
                    >
                      <option value="">{labels.challengePlaceholder}</option>
                      {INDEPENDENT_HOTEL_CHALLENGES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {thaiOptions ? item.th : item.en}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={goalLabel} htmlFor={`${formId}-goal`} optional={labels.optional} labelClassName={labelClassName}>
                    <textarea
                      id={`${formId}-goal`}
                      name="goal"
                      rows={3}
                      className="kpi-field"
                      value={state.goal}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}
                    />
                  </Field>
                  <Field label={messageLabel} htmlFor={`${formId}-message`} optional={labels.optional} labelClassName={labelClassName}>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={3}
                      className="kpi-field"
                      value={state.message}
                      disabled={sending}
                      onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
                    />
                  </Field>
                </div>
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "independent_hotel"} />
                <div className="kpi-website-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-website-enquiry-consent">
                  <input
                    type="checkbox"
                    checked={state.consent}
                    disabled={sending}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>
                    {consentLabel}{" "}
                    <Link href={privacyHref} className="font-semibold text-[#0B6660]">
                      {privacyLabel}
                    </Link>
                  </span>
                </label>
                {errors.consent ? (
                  <p className="text-sm font-semibold text-[#C45C26]" role="alert">
                    {errors.consent}
                  </p>
                ) : null}
                <input
                  type="text"
                  name="companyWebsite"
                  value={state.companyWebsite}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                  onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                />
                <button
                  className="kpi-button"
                  type="submit"
                  disabled={sending}
                  aria-busy={sending}
                  style={{ background: "#a2dc25", color: "#1a3a02" }}
                >
                  {sending ? (
                    t.sending
                  ) : (
                    <>
                      {cta}
                      <span className="kpi-website-enquiry-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </>
                  )}
                </button>
                {sending ? (
                  <p className="kpi-website-enquiry-status" role="status" aria-live="polite">
                    {copy.loading}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="kpi-website-enquiry-error text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.failed}
                  </p>
                ) : null}
                {status === "unavailable" ? (
                  <p className="kpi-website-enquiry-error text-sm font-semibold text-[#C45C26]" role="alert">
                    {t.unavailable}
                  </p>
                ) : null}
                <ContactNote locale={locale} className="kpi-website-enquiry-direct" />
              </form>
            )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (compact) {
    return (
      <div id={sectionId} className="kpi-contact-form scroll-mt-28">
        {title || body ? (
          <div className="kpi-contact-form-intro">
            {title ? <h2 className="kpi-h2 kpi-contact-h2">{heading}</h2> : null}
            {body || lead ? <p className="kpi-contact-form-lead">{lead}</p> : null}
          </div>
        ) : null}
        {formCard}
      </div>
    );
  }

  return (
    <section id={sectionId} className="relative scroll-mt-28 border-t border-[#E3E8EB] bg-[#F4F4F4]">
      <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
      <div className="kpi-section">
        <p className="kpi-kicker text-[#0B6660]">{kickerText}</p>
        <h2 className="kpi-h2 mt-4">{heading}</h2>
        <p className="kpi-lead mt-5">{lead}</p>
        <div className="mx-auto mt-10 max-w-2xl">{formCard}</div>
      </div>
    </section>
  );
}
