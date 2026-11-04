"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import { AUDIT_RESPONSE_DAYS, readUtm, type AuditFocus } from "@/lib/audit";
import { localizePath, type Locale } from "@/lib/seo";
import { track } from "@/lib/track";

const TOPIC_OPTIONS: Array<{ id: AuditFocus; th: string; en: string }> = [
  { id: "overview", th: "อยากคุยภาพรวมว่าควรเริ่มจากตรงไหน", en: "Discuss where the hotel should start overall" },
  { id: "ads", th: "Search Visibility / Online Advertising", en: "Search visibility / online advertising" },
  { id: "direct", th: "Website และเส้นทาง Direct Booking", en: "Website and direct-booking path" },
  { id: "ota", th: "ข้อมูลช่องทาง / OTA", en: "Channel / OTA information" },
  { id: "pricing", th: "ลำดับความสำคัญ Marketing กับ Revenue", en: "Marketing and revenue priorities" },
];

const copy = {
  th: {
    title: "ต้องการรู้ว่าโรงแรมของคุณควรเริ่มจากตรงไหน?",
    body: "คุยกับทีมเรื่อง Search Visibility, เส้นทางจอง, ข้อมูลช่องทาง หรือลำดับความสำคัญระหว่าง Marketing กับ Revenue — เพื่อช่วยจัดลำดับสิ่งที่ควรทบทวนก่อน โดยไม่ใช่การรับประกันรายงานรายโรงแรมหรือผลลัพธ์",
    nextSteps: [
      "เล่าบริบทโรงแรมและจุดที่อยากทบทวน",
      "ทีมช่วยจัดลำดับประเด็นที่เกี่ยวข้อง",
      "ได้แนวทางคุยต่อได้โดยไม่เริ่มทุกช่องทางพร้อมกัน",
    ],
    name: "ชื่อ–นามสกุล",
    hotel: "ชื่อโรงแรม",
    topics: "อยากคุยเรื่องใดเป็นหลัก?",
    topicsError: "กรุณาเลือกอย่างน้อย 1 หัวข้อ",
    contactHint: "ระบุอย่างน้อย 1 ช่องทาง: โทรศัพท์ LINE หรืออีเมล",
    phone: "เบอร์โทรศัพท์",
    lineId: "LINE ID",
    email: "อีเมล",
    contactError: "กรุณาระบุช่องทางติดต่ออย่างน้อย 1 ช่องทาง",
    details: "รายละเอียดเพิ่มเติม",
    detailsOptional: "ไม่บังคับ",
    detailsPlaceholder: "เช่น จุดที่ทีมกำลังติดขัด หรือช่องทางที่อยากทบทวนก่อน",
    consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส เก็บและใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
    consentPrivacy: "นโยบายความเป็นส่วนตัว",
    consentError: "กรุณายินยอมก่อนส่งข้อมูล",
    required: "กรุณากรอกข้อมูลนี้",
    submit: "ส่งข้อความถึงทีม",
    submitting: "กำลังส่ง…",
    successTitle: "ได้รับข้อความแล้ว",
    successBody: `ทีม เดอะ เคพีไอ พลัส จะติดต่อกลับภายใน ${AUDIT_RESPONSE_DAYS} วันทำการ`,
    errorTitle: "ส่งไม่สำเร็จ",
    errorBody: "ลองส่งอีกครั้ง หรือติดต่อทีมทาง LINE / โทรศัพท์",
    replyNote: `ทีมจะติดต่อกลับภายใน ${AUDIT_RESPONSE_DAYS} วันทำการ`,
  },
  en: {
    title: "Want to know where your hotel should start?",
    body: "Talk with the team about search visibility, the booking journey, channel information, or marketing/revenue priorities — to help sequence what to review first. This is not a promise of an individual hotel report or guaranteed results.",
    nextSteps: [
      "Share hotel context and what you want to review",
      "The team helps order the relevant topics",
      "You get a practical next conversation without starting every channel at once",
    ],
    name: "Full name",
    hotel: "Hotel name",
    topics: "What would you like to discuss first?",
    topicsError: "Please select at least one topic",
    contactHint: "Provide at least one contact: phone, LINE, or email",
    phone: "Phone",
    lineId: "LINE ID",
    email: "Email",
    contactError: "Please provide at least one contact method",
    details: "Additional details",
    detailsOptional: "Optional",
    detailsPlaceholder: "For example, a current bottleneck or the channel you want to review first",
    consent: "I agree that The KPI Plus may store and use this information to reply about this request, per the",
    consentPrivacy: "Privacy Policy",
    consentError: "Please give consent before sending",
    required: "This field is required",
    submit: "Send message to the team",
    submitting: "Sending…",
    successTitle: "Message received",
    successBody: `The KPI Plus team will reply within ${AUDIT_RESPONSE_DAYS} business days`,
    errorTitle: "Could not send",
    errorBody: "Please try again, or contact the team by LINE / phone",
    replyNote: `The team will reply within ${AUDIT_RESPONSE_DAYS} business days`,
  },
} as const;

type FormState = {
  name: string;
  hotel: string;
  phone: string;
  lineId: string;
  email: string;
  topics: AuditFocus[];
  details: string;
  consent: boolean;
  companyWebsite: string;
};

type FieldError = Partial<Record<"name" | "hotel" | "topics" | "contact" | "consent", string>>;

const empty: FormState = {
  name: "",
  hotel: "",
  phone: "",
  lineId: "",
  email: "",
  topics: [],
  details: "",
  consent: false,
  companyWebsite: "",
};

function hasContact(state: FormState) {
  return Boolean(state.phone.trim() || state.lineId.trim() || state.email.trim());
}

export type InsightHotelMarketingEnquiryOverrides = { title?: string; body?: string; buttonLabel?: string };

export function InsightHotelMarketingEnquiry({
  locale,
  overrides,
}: {
  locale: Locale;
  /** Optional CMS copy. Empty strings fall back to the built-in text. */
  overrides?: InsightHotelMarketingEnquiryOverrides;
}) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const formId = useId();
  const privacyHref = localizePath("/privacy", locale);
  const [state, setState] = useState<FormState>(empty);
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function validate(next = state) {
    const nextErrors: FieldError = {};
    if (!next.name.trim()) nextErrors.name = ui.required;
    if (!next.hotel.trim()) nextErrors.hotel = ui.required;
    if (!next.topics.length) nextErrors.topics = ui.topicsError;
    if (!hasContact(next)) nextErrors.contact = ui.contactError;
    if (!next.consent) nextErrors.consent = ui.consentError;
    setErrors(nextErrors);
    return nextErrors;
  }

  function toggleTopic(id: AuditFocus) {
    setState((current) => ({
      ...current,
      topics: current.topics.includes(id) ? current.topics.filter((item) => item !== id) : [...current.topics, id],
    }));
    setErrors((current) => ({ ...current, topics: undefined }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) return;
    setStatus("submitting");
    try {
      const topicLabels = TOPIC_OPTIONS.filter((item) => state.topics.includes(item.id))
        .map((item) => item[lang])
        .join("; ");
      const details = [state.details.trim(), topicLabels ? `Topics: ${topicLabels}` : ""]
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          hotel: state.hotel.trim(),
          phone: state.phone.trim(),
          lineId: state.lineId.trim(),
          email: state.email.trim(),
          concerns: state.topics,
          details,
          consent: state.consent,
          honeypot: state.companyWebsite,
          pageUrl: typeof window === "undefined" ? "" : window.location.href,
          utm: typeof window === "undefined" ? {} : readUtm(window.location.search),
          locale,
          form: "general_enquiry",
          serviceInterest: "general",
        }),
      });
      if (!response.ok) throw new Error("submit_failed");
      track("generate_lead", {
        form: "hotel_marketing_insight_enquiry",
        locale,
      });
      setStatus("success");
      setState(empty);
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="kpi-article-cta kpi-article-cta--enquiry" id="insight-enquiry">
      <h2 className="kpi-insight-cta-title">{overrides?.title?.trim() || ui.title}</h2>
      <p className="kpi-insight-cta-body">{overrides?.body?.trim() || ui.body}</p>
      <ol className="kpi-article-cta-steps">
        {ui.nextSteps.map((step, index) => (
          <li key={step}>
            <span className="kpi-article-cta-step-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {status === "success" ? (
        <div className="kpi-article-cta-status is-success" role="status">
          <p className="kpi-article-cta-status-title">{ui.successTitle}</p>
          <p>{ui.successBody}</p>
        </div>
      ) : (
        <form className="kpi-article-cta-form" onSubmit={onSubmit} noValidate>
          <div className="kpi-article-cta-grid">
            <label className="kpi-article-cta-field">
              <span className="kpi-label">
                {ui.name} <span aria-hidden="true">*</span>
              </span>
              <input
                className="kpi-field"
                name="name"
                autoComplete="name"
                value={state.name}
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
              />
              {errors.name ? (
                <span id={`${formId}-name-error`} className="kpi-article-cta-error" role="alert">
                  {errors.name}
                </span>
              ) : null}
            </label>

            <label className="kpi-article-cta-field">
              <span className="kpi-label">
                {ui.hotel} <span aria-hidden="true">*</span>
              </span>
              <input
                className="kpi-field"
                name="hotel"
                value={state.hotel}
                aria-required="true"
                aria-invalid={Boolean(errors.hotel)}
                aria-describedby={errors.hotel ? `${formId}-hotel-error` : undefined}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, hotel: event.target.value }))}
              />
              {errors.hotel ? (
                <span id={`${formId}-hotel-error`} className="kpi-article-cta-error" role="alert">
                  {errors.hotel}
                </span>
              ) : null}
            </label>
          </div>

          <fieldset
            className="kpi-article-cta-topics"
            aria-describedby={errors.topics ? `${formId}-topics-error` : undefined}
          >
            <legend className="kpi-label">
              {ui.topics} <span aria-hidden="true">*</span>
            </legend>
            <div className="kpi-article-cta-topic-list">
              {TOPIC_OPTIONS.map((topic) => {
                const checked = state.topics.includes(topic.id);
                return (
                  <label key={topic.id} className={`kpi-article-cta-topic${checked ? " is-checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTopic(topic.id)}
                    />
                    <span>{topic[lang]}</span>
                  </label>
                );
              })}
            </div>
            {errors.topics ? (
              <p id={`${formId}-topics-error`} className="kpi-article-cta-error" role="alert">
                {errors.topics}
              </p>
            ) : null}
          </fieldset>

          <p className="kpi-article-cta-hint" id={`${formId}-contact-hint`}>
            {ui.contactHint}
          </p>
          <div className="kpi-article-cta-grid">
            <label className="kpi-article-cta-field">
              <span className="kpi-label">{ui.phone}</span>
              <input
                className="kpi-field"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={state.phone}
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={`${formId}-contact-hint${errors.contact ? ` ${formId}-contact-error` : ""}`}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>
            <label className="kpi-article-cta-field">
              <span className="kpi-label">{ui.lineId}</span>
              <input
                className="kpi-field"
                name="lineId"
                value={state.lineId}
                aria-invalid={Boolean(errors.contact)}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, lineId: event.target.value }))}
              />
            </label>
            <label className="kpi-article-cta-field kpi-article-cta-field--wide">
              <span className="kpi-label">{ui.email}</span>
              <input
                className="kpi-field"
                name="email"
                type="email"
                autoComplete="email"
                value={state.email}
                aria-invalid={Boolean(errors.contact)}
                onBlur={() => validate()}
                onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
          </div>
          {errors.contact ? (
            <p id={`${formId}-contact-error`} className="kpi-article-cta-error" role="alert">
              {errors.contact}
            </p>
          ) : null}

          <label className="kpi-article-cta-field">
            <span className="kpi-label">
              {ui.details} <span className="kpi-article-cta-optional">({ui.detailsOptional})</span>
            </span>
            <textarea
              className="kpi-field"
              name="details"
              rows={3}
              placeholder={ui.detailsPlaceholder}
              value={state.details}
              onChange={(event) => setState((current) => ({ ...current, details: event.target.value }))}
            />
          </label>

          <div className="kpi-article-cta-privacy">
            <FormPrivacyNotice locale={locale} />
          </div>

          <label className="kpi-article-cta-consent">
            <input
              type="checkbox"
              checked={state.consent}
              aria-required="true"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
              onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
            />
            <span>
              {ui.consent}{" "}
              <Link href={privacyHref} className="font-semibold text-[#0B6660] underline-offset-2 hover:underline">
                {ui.consentPrivacy}
              </Link>
            </span>
          </label>
          {errors.consent ? (
            <p id={`${formId}-consent-error`} className="kpi-article-cta-error" role="alert">
              {errors.consent}
            </p>
          ) : null}

          <div className="sr-only" aria-hidden="true">
            <label>
              Website
              <input
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                value={state.companyWebsite}
                onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
              />
            </label>
          </div>

          {status === "error" ? (
            <div className="kpi-article-cta-status is-error" role="alert">
              <p className="kpi-article-cta-status-title">{ui.errorTitle}</p>
              <p>{ui.errorBody}</p>
            </div>
          ) : null}

          <button type="submit" className="kpi-button kpi-article-cta-btn" disabled={status === "submitting"}>
            {status === "submitting" ? ui.submitting : overrides?.buttonLabel?.trim() || ui.submit}
          </button>
          <p className="kpi-article-cta-reply">{ui.replyNote}</p>
        </form>
      )}
    </aside>
  );
}
