"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import { ReservationsEnquiryIntro } from "@/components/reservations/ReservationsEnquiryIntro";
import { RevenueEnquiryIntro } from "@/components/revenue-commercial/RevenueEnquiryIntro";
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
  message: string;
  consent: boolean;
  companyWebsite: string;
};

type FieldError = Partial<Record<"name" | "businessName" | "contact" | "serviceInterest" | "topic" | "consent", string>>;

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
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลธุรกิจ", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "Business details", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "Business details", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "Business details", topic: "What you'd like to discuss" },
} as const;

const websiteGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const conversionGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

const independentHotelGroups = {
  th: { contact: "ข้อมูลติดต่อ", hotel: "ข้อมูลโรงแรม", topic: "เรื่องที่อยากคุย" },
  en: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  ru: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
  zh: { contact: "Contact details", hotel: "About the hotel", topic: "What you'd like to discuss" },
} as const;

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
  introNextTitle,
  introSteps,
  introTrust,
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
  introNextTitle?: string;
  introSteps?: string[];
  introTrust?: string[];
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
    if (!next.name.trim()) nextErrors.name = t.required;
    if (!next.businessName.trim()) nextErrors.businessName = t.required;
    if (!next.contact.trim()) nextErrors.contact = t.required;
    else if (next.contact.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.contact.trim())) {
      nextErrors.contact = t.invalidEmail;
    }
    if (!preset && !next.serviceInterest) nextErrors.serviceInterest = t.required;
    if (service === "revenue" && !next.topic.trim()) nextErrors.topic = t.required;
    if (!next.consent) nextErrors.consent = t.required;
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
          topic: service === "revenue" ? state.topic : undefined,
          channels: service === "reservations" ? state.channels.trim() : undefined,
          scope: service === "reservations" ? state.scope.trim() : undefined,
          message:
            service === "revenue"
              ? composeRevenueMessage(state.topic, state.message, locale)
              : service === "reservations"
                ? composeReservationsMessage(state.channels, state.scope, state.message, locale)
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
    const labelClassName = "kpi-b2b-enquiry-label";
    const points = ["ดูตลาดและกลุ่มลูกค้า", "ดูพาร์ตเนอร์และช่องทางปัจจุบัน", "ดูราคา เงื่อนไข และโอกาสเพิ่มยอดขาย"];
    return (
      <section id={sectionId} className="kpi-b2b-enquiry scroll-mt-28">
        <div className="kpi-section kpi-b2b-enquiry-grid">
          <div className="kpi-b2b-enquiry-intro">
            <p className="kpi-kicker kpi-b2b-enquiry-kicker">{kickerText}</p>
            <h2 className="kpi-h2 kpi-b2b-enquiry-heading">
              {locale === "th" ? (
                <>
                  คุยเรื่อง <span className="kpi-latin">B2B</span> และเอเจนต์
                </>
              ) : (
                heading
              )}
            </h2>
            {locale === "th" ? (
              <p className="kpi-b2b-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับโรงแรม</span>
                <span className="kpi-b2b-enquiry-line">
                  แล้วทีมจะช่วยดูว่าช่องทาง <span className="kpi-latin">B2B</span>
                </span>
                <span className="kpi-b2b-enquiry-line">ควรเริ่มจากตรงไหน</span>
              </p>
            ) : (
              <p className="kpi-b2b-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-b2b-enquiry-points">
                  {points.map((point, index) => (
                    <li key={point}>
                      <span className="kpi-b2b-enquiry-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ol>
                <p className="kpi-b2b-enquiry-note">ไม่จำเป็นต้องมีรายชื่อพาร์ตเนอร์อยู่แล้วก็ได้</p>
              </>
            ) : null}
          </div>
          <div className="kpi-b2b-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-b2b-enquiry-success">{t.success}</p>
                <p className="kpi-b2b-enquiry-reply">{auditCopyFor(locale).trustReply}</p>
                <ContactNote locale={locale} className="kpi-b2b-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-b2b-enquiry-fields" onSubmit={onSubmit} noValidate>
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
                <div className="kpi-b2b-enquiry-group">
                  <p className="kpi-b2b-enquiry-group-label">{groups.hotel}</p>
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
                <div className="kpi-b2b-enquiry-group">
                  <p className="kpi-b2b-enquiry-group-label">{groups.topic}</p>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "b2b"} />
                <div className="kpi-b2b-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-b2b-enquiry-consent">
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
                      ขอประเมินโอกาส <span className="kpi-latin">B2B</span>
                      <span className="kpi-b2b-enquiry-arrow" aria-hidden="true">
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
    const labelClassName = "kpi-meta-ads-enquiry-label";
    return (
      <section id={sectionId} className="kpi-meta-ads-enquiry scroll-mt-28">
        <div className="kpi-section kpi-meta-ads-enquiry-grid">
          <div className="kpi-meta-ads-enquiry-intro">
            <p className="kpi-meta-ads-enquiry-kicker kpi-latin">{kickerText}</p>
            <h2 className="kpi-h2 kpi-meta-ads-enquiry-heading">
              {locale === "th" ? (
                <>
                  คุยเรื่อง <span className="kpi-latin">Meta Ads</span> สำหรับโรงแรม
                </>
              ) : (
                heading
              )}
            </h2>
            {locale === "th" ? (
              <p className="kpi-meta-ads-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับโรงแรม</span>
                <span className="kpi-meta-ads-enquiry-line">แล้วทีมจะช่วยดูว่าควรเริ่มจากตรงไหนก่อน</span>
              </p>
            ) : (
              <p className="kpi-meta-ads-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-meta-ads-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูกลุ่มลูกค้าและตลาด</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>ดูคอนเทนต์และข้อเสนอ</span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>
                      ดูเส้นทางหลังคลิกจนถึง <span className="kpi-latin">Enquiry</span> /{" "}
                      <span className="kpi-latin">Booking</span>
                    </span>
                  </li>
                </ol>
                <p className="kpi-meta-ads-enquiry-note">
                  ไม่จำเป็นต้องมีแคมเปญ <span className="kpi-latin">Meta Ads</span> อยู่แล้วก็ได้
                </p>
              </>
            ) : null}
          </div>
          <div className="kpi-meta-ads-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-meta-ads-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-meta-ads-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-meta-ads-enquiry-fields" onSubmit={onSubmit} noValidate>
                <div className="kpi-meta-ads-enquiry-group">
                  <p className="kpi-meta-ads-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-meta-ads-enquiry-pair">
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
                <div className="kpi-meta-ads-enquiry-group">
                  <p className="kpi-meta-ads-enquiry-group-label">{groups.hotel}</p>
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
                <div className="kpi-meta-ads-enquiry-group">
                  <p className="kpi-meta-ads-enquiry-group-label">{groups.topic}</p>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "meta_ads"} />
                <div className="kpi-meta-ads-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-meta-ads-enquiry-consent">
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
                      ดูโอกาสเพิ่ม <span className="kpi-latin">Enquiry</span> และ{" "}
                      <span className="kpi-latin">Booking</span>
                      <span className="kpi-meta-ads-enquiry-arrow" aria-hidden="true">
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
    const labelClassName = "kpi-google-ads-enquiry-label";
    return (
      <section id={sectionId} className="kpi-google-ads-enquiry scroll-mt-28">
        <div className="kpi-section kpi-google-ads-enquiry-grid">
          <div className="kpi-google-ads-enquiry-intro">
            <p className="kpi-google-ads-enquiry-kicker kpi-latin">{kickerText}</p>
            <h2 className="kpi-h2 kpi-google-ads-enquiry-heading">
              {locale === "th" ? (
                <>
                  คุยเรื่อง <span className="kpi-latin">Google Ads</span> สำหรับโรงแรม
                </>
              ) : (
                heading
              )}
            </h2>
            {locale === "th" ? (
              <p className="kpi-google-ads-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับโรงแรม</span>
                <span className="kpi-google-ads-enquiry-line">
                  แล้วทีมจะช่วยดูว่า <span className="kpi-latin">Search</span>, <span className="kpi-latin">Website</span> และ{" "}
                  <span className="kpi-latin">Booking Path</span>
                </span>
                <span className="kpi-google-ads-enquiry-line">ควรเริ่มปรับจากจุดไหนก่อน</span>
              </p>
            ) : (
              <p className="kpi-google-ads-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-google-ads-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูคำค้นหาและตลาด</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>ดูเว็บไซต์และระบบจอง</span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>
                      ดู <span className="kpi-latin">Conversion</span> และต้นทุน
                    </span>
                  </li>
                </ol>
                <p className="kpi-google-ads-enquiry-note">
                  ไม่จำเป็นต้องมีแคมเปญ <span className="kpi-latin">Google Ads</span> อยู่แล้วก็ได้
                </p>
              </>
            ) : null}
          </div>
          <div className="kpi-google-ads-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-google-ads-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-google-ads-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-google-ads-enquiry-fields" onSubmit={onSubmit} noValidate>
                <div className="kpi-google-ads-enquiry-group">
                  <p className="kpi-google-ads-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-google-ads-enquiry-pair">
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
                <div className="kpi-google-ads-enquiry-group">
                  <p className="kpi-google-ads-enquiry-group-label">{groups.hotel}</p>
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
                <div className="kpi-google-ads-enquiry-group">
                  <p className="kpi-google-ads-enquiry-group-label">{groups.topic}</p>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "google_ads"} />
                <div className="kpi-google-ads-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-google-ads-enquiry-consent">
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
                      ดูโอกาสเพิ่ม <span className="kpi-latin">Direct Booking</span>
                      <span className="kpi-google-ads-enquiry-arrow" aria-hidden="true">
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
    const labelClassName = "kpi-website-enquiry-label";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-conversion-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <div className="kpi-website-enquiry-intro">
            <p className="kpi-website-enquiry-kicker kpi-latin">{kickerText}</p>
            <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading}</h2>
            {locale === "th" ? (
              <p className="kpi-website-enquiry-lead">
                <span>ส่งลิงก์เว็บไซต์และหน้าจอง</span>
                <span className="kpi-website-enquiry-line">พร้อมบอกจุดที่กังวล</span>
                <span className="kpi-website-enquiry-line">ทีมจะช่วยดูว่าลูกค้าหยุดก่อนจองตรงไหน</span>
              </p>
            ) : (
              <p className="kpi-website-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-website-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูหน้าที่คนเข้าชมและจุดที่ออก</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>
                      ดูปุ่มจองและประสบการณ์บน <span className="kpi-latin">Mobile</span>
                    </span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>
                      ดูเส้นทางเข้า <span className="kpi-latin">Booking Engine</span>
                    </span>
                  </li>
                </ol>
                <p className="kpi-website-enquiry-note">
                  ไม่จำเป็นต้องสร้างเว็บใหม่ก่อน
                  <span className="kpi-website-enquiry-line">เริ่มจากเส้นทางจองที่มีอยู่แล้วได้</span>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "conversion"} />
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
                      ให้ทีมตรวจเส้นทางจองบนเว็บไซต์
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

  if (service === "website" && !compact) {
    const groups = websiteGroups[locale];
    const labelClassName = "kpi-website-enquiry-label";
    return (
      <section id={sectionId} className="kpi-website-enquiry scroll-mt-28">
        <div className="kpi-section kpi-website-enquiry-grid">
          <div className="kpi-website-enquiry-intro">
            <p className="kpi-website-enquiry-kicker kpi-latin">{kickerText}</p>
            <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading}</h2>
            {locale === "th" ? (
              <p className="kpi-website-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับโรงแรม</span>
                <span className="kpi-website-enquiry-line">แล้วทีมจะช่วยดูว่าเว็บไซต์</span>
                <span className="kpi-website-enquiry-line">ควรเริ่มปรับจากจุดไหนก่อน</span>
              </p>
            ) : (
              <p className="kpi-website-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-website-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูโครงสร้างและเนื้อหา</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>
                      ดู <span className="kpi-latin">Mobile</span> และประสบการณ์ใช้งาน
                    </span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>
                      ดูเส้นทางไปสู่ <span className="kpi-latin">Booking Engine</span> /{" "}
                      <span className="kpi-latin">Direct Booking</span>
                    </span>
                  </li>
                </ol>
                <p className="kpi-website-enquiry-note">
                  ไม่จำเป็นต้องตัดสินใจก่อน
                  <span className="kpi-website-enquiry-line">ว่าจะสร้างเว็บไซต์ใหม่</span>
                  <span className="kpi-website-enquiry-line">หรือปรับเว็บไซต์เดิม</span>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "website"} />
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
                      ให้ทีมดูเว็บไซต์โรงแรมของคุณ
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

  if (service === "search" && !compact) {
    const groups = searchGroups[locale];
    const labelClassName = "kpi-search-enquiry-label";
    return (
      <section id={sectionId} className="kpi-search-enquiry scroll-mt-28">
        <div className="kpi-section kpi-search-enquiry-grid">
          <div className="kpi-search-enquiry-intro">
            <p className="kpi-search-enquiry-kicker kpi-latin">{kickerText}</p>
            <h2 className="kpi-h2 kpi-search-enquiry-heading">
              {locale === "th" ? (
                <>
                  คุยเรื่อง <span className="kpi-latin">SEO</span> และการค้นหาท้องถิ่น
                </>
              ) : (
                heading
              )}
            </h2>
            {locale === "th" ? (
              <p className="kpi-search-enquiry-lead">
                <span>ส่งข้อมูลสั้น ๆ เกี่ยวกับธุรกิจ</span>
                <span className="kpi-search-enquiry-line">แล้วทีมจะช่วยดูว่าควรเริ่มปรับจากจุดไหนก่อน</span>
              </p>
            ) : (
              <p className="kpi-search-enquiry-lead">{lead}</p>
            )}
            {locale === "th" ? (
              <>
                <ol className="kpi-search-enquiry-points">
                  <li>
                    <span className="kpi-latin">01</span>
                    <span>ดูการค้นพบปัจจุบัน</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>
                      ดูเว็บไซต์และ <span className="kpi-latin">Google Maps</span>
                    </span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>ดูจุดที่ลูกค้าค้นพบแล้วติดต่อไม่ต่อเนื่อง</span>
                  </li>
                </ol>
                <p className="kpi-search-enquiry-note">
                  ไม่จำเป็นต้องมี <span className="kpi-latin">Search Console</span>
                  <span className="kpi-search-enquiry-line">หรือข้อมูลครบทุกระบบอยู่แล้วก็ได้</span>
                </p>
              </>
            ) : null}
          </div>
          <div className="kpi-search-enquiry-panel">
            {status === "success" ? (
              <div role="status">
                <p className="kpi-search-enquiry-success">{t.success}</p>
                <ContactNote locale={locale} className="kpi-search-enquiry-direct" />
              </div>
            ) : (
              <form className="kpi-search-enquiry-fields" onSubmit={onSubmit} noValidate>
                <div className="kpi-search-enquiry-group">
                  <p className="kpi-search-enquiry-group-label">{groups.contact}</p>
                  <div className="kpi-search-enquiry-pair">
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
                <div className="kpi-search-enquiry-group">
                  <p className="kpi-search-enquiry-group-label">{groups.hotel}</p>
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
                <div className="kpi-search-enquiry-group">
                  <p className="kpi-search-enquiry-group-label">{groups.topic}</p>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "search"} />
                <div className="kpi-search-enquiry-privacy">
                  <FormPrivacyNotice locale={locale} />
                </div>
                <label className="kpi-search-enquiry-consent">
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
                      ให้ทีมดูการค้นพบธุรกิจของคุณ
                      <span className="kpi-search-enquiry-arrow" aria-hidden="true">
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
    const labelClassName = "kpi-website-enquiry-label";
    return (
      <section id={sectionId} className="kpi-website-enquiry kpi-independent-enquiry scroll-mt-28">
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
                    <span>ดูโครงสร้างงานและหน้าที่ของทีม</span>
                  </li>
                  <li>
                    <span className="kpi-latin">02</span>
                    <span>ดูระบบ เครื่องมือ และขั้นตอนทำงาน</span>
                  </li>
                  <li>
                    <span className="kpi-latin">03</span>
                    <span>ดูจุดที่เจ้าของยังต้องลงมือเองมากเกินไป</span>
                  </li>
                </ol>
                <p className="kpi-website-enquiry-note">
                  ไม่จำเป็นต้องรู้ก่อนว่าต้องการบริการแบบไหน
                  <span className="kpi-website-enquiry-line">ทีมช่วยประเมินขอบเขตที่เหมาะสมได้</span>
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
                <input type="hidden" name="serviceInterest" value={preset?.id ?? "independent_hotel"} />
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
                      นัดพูดคุยเรื่องโรงแรมของคุณ
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
