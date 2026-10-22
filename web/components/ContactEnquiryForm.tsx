"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import { readUtm } from "@/lib/audit";
import { mailtoHref, telHref } from "@/lib/company";
import { ENQUIRY_SERVICES, enquiryServiceById, type EnquiryServiceId } from "@/lib/enquiry";
import { localizePath, type Locale } from "@/lib/seo";
import { track } from "@/lib/track";

type FieldKey = "name" | "email" | "phone" | "businessName" | "serviceInterest" | "consent";
type FieldError = Partial<Record<FieldKey, string>>;
type Status = "idle" | "submitting" | "success" | "error" | "unavailable";

type FormState = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  serviceInterest: EnquiryServiceId | "";
  message: string;
  consent: boolean;
  companyWebsite: string;
};

const ui = {
  th: {
    name: "ชื่อผู้ติดต่อ",
    email: "อีเมล",
    phone: "เบอร์โทรหรือ WhatsApp",
    business: "ชื่อโรงแรม / กิจการ",
    service: "บริการที่สนใจ",
    servicePlaceholder: "เลือกบริการ",
    message: "ข้อความ",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    messageHint: "บอกสั้น ๆ ว่าอยากคุยเรื่องอะไร",
    channelHint: "ใส่อย่างน้อยอีเมลหรือเบอร์โทร",
    consentLabel: "ความยินยอม",
    consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
    privacy: "นโยบายความเป็นส่วนตัว",
    submit: "ส่งข้อความถึงทีม",
    sending: "กำลังส่ง…",
    loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
    success: "ส่งข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
    requiredError: "กรุณากรอกข้อมูลนี้",
    invalidEmail: "กรุณาใส่อีเมลให้ถูกต้อง",
    invalidPhone: "กรุณาใส่เบอร์โทรให้ถูกต้อง",
    missingChannel: "กรุณาใส่อีเมลหรือเบอร์โทรอย่างน้อยหนึ่งช่อง",
    errorSummary: "กรุณาตรวจสอบข้อมูลที่ยังไม่ครบ",
    failed: "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อทีมโดยตรง",
    unavailable: "ขณะนี้ยังส่งต่อทีมไม่ได้ กรุณาติดต่อทางอีเมลหรือโทรศัพท์",
    orTalk: "หรือคุยกับทีมโดยตรง",
    assessmentNote: "หากต้องการประเมินโรงแรมแบบละเอียด สามารถเริ่มจากแบบฟอร์มวิเคราะห์ Performance ได้จากหน้าแรก",
    time: "ใช้เวลาประมาณ 2 นาที",
    reply: "ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับโดยเร็วที่สุด",
    confidential: "ข้อมูลของคุณจะถูกเก็บเป็นความลับ",
  },
  en: {
    name: "Your name",
    email: "Email",
    phone: "Phone or WhatsApp",
    business: "Hotel / company",
    service: "Service of interest",
    servicePlaceholder: "Choose a service",
    message: "Message",
    required: "Required",
    optional: "Optional",
    messageHint: "A short note on what you want to discuss",
    channelHint: "Enter at least an email or a phone number",
    consentLabel: "Consent",
    consent: "I agree that The KPI Plus may use this information to reply about this request, under the",
    privacy: "privacy policy",
    submit: "Send to the team",
    sending: "Sending…",
    loading: "Sending your message. Please wait.",
    success: "Your message has been sent. The team will get back to you as soon as possible.",
    requiredError: "This field is required",
    invalidEmail: "Enter a valid email address",
    invalidPhone: "Enter a valid phone number",
    missingChannel: "Enter at least an email or a phone number",
    errorSummary: "Please check the highlighted fields",
    failed: "Could not send. Please try again, or contact the team directly.",
    unavailable: "This page cannot send the request right now. Please email or call the team.",
    orTalk: "Or talk to the team directly",
    assessmentNote: "For a fuller hotel assessment, use the Performance Audit form on the homepage.",
    time: "Takes about 2 minutes",
    reply: "The team will review the details and get back to you as soon as possible.",
    confidential: "Your information is kept confidential.",
  },
} as const;

function copyFor(locale: Locale) {
  return locale === "th" ? ui.th : ui.en;
}

function hasPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function Field({
  id,
  label,
  mark,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  mark: string;
  hint?: string;
  error?: string;
  children: (a11y: { describedBy?: string }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : "";
  const errorId = error ? `${id}-error` : "";
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`kpi-contact-form-field${error ? " is-invalid" : ""}`}>
      <label htmlFor={id} className="kpi-contact-form-label">
        {label} <span className="kpi-contact-form-flag">({mark})</span>
      </label>
      {children({ describedBy })}
      {hint ? (
        <p id={hintId} className="kpi-contact-form-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="kpi-contact-form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactEnquiryForm({
  locale,
  title,
  body,
  email,
  phone,
  sectionId = "contact-enquiry",
}: {
  locale: Locale;
  title: string;
  body: string;
  email?: string;
  phone?: string;
  sectionId?: string;
}) {
  const t = copyFor(locale);
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const privacyHref = localizePath("/privacy", locale);
  const emailLink = mailtoHref(email);
  const phoneLink = telHref(phone);
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    serviceInterest: "",
    message: "",
    consent: false,
    companyWebsite: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showSummary, setShowSummary] = useState(false);

  const labels: Record<FieldKey, string> = {
    name: t.name,
    email: t.email,
    phone: t.phone,
    businessName: t.business,
    serviceInterest: t.service,
    consent: t.consentLabel,
  };

  function setFieldErrors(keys: FieldKey[], next = state) {
    const checked = validate(next);
    setErrors((current) => {
      const merged = { ...current };
      for (const key of keys) {
        if (checked[key]) merged[key] = checked[key];
        else delete merged[key];
      }
      return merged;
    });
  }

  function validate(next = state): FieldError {
    const nextErrors: FieldError = {};
    if (!next.name.trim()) nextErrors.name = t.requiredError;
    if (!next.businessName.trim()) nextErrors.businessName = t.requiredError;
    const emailValue = next.email.trim();
    const phoneValue = next.phone.trim();
    if (emailValue && !mailtoHref(emailValue)) nextErrors.email = t.invalidEmail;
    if (phoneValue && !hasPhone(phoneValue)) nextErrors.phone = t.invalidPhone;
    if (!emailValue && !phoneValue) {
      nextErrors.email = t.missingChannel;
      nextErrors.phone = t.missingChannel;
    }
    if (!next.serviceInterest) nextErrors.serviceInterest = t.requiredError;
    if (!next.consent) nextErrors.consent = t.requiredError;
    return nextErrors;
  }

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    const nextState = { ...state, [key]: value };
    setState(nextState);
    setErrors((currentErrors) => {
      const checked = validate(nextState);
      const nextErrors = { ...currentErrors };
      delete nextErrors[key as FieldKey];
      if (key === "email" || key === "phone") {
        if (checked.email) nextErrors.email = checked.email;
        else delete nextErrors.email;
        if (checked.phone) nextErrors.phone = checked.phone;
        else delete nextErrors.phone;
      }
      return nextErrors;
    });
  }

  useEffect(() => {
    if (showSummary && Object.keys(errors).length) summaryRef.current?.focus();
  }, [showSummary, errors]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setShowSummary(true);
      return;
    }
    setShowSummary(false);
    setStatus("submitting");
    const serviceId = state.serviceInterest as EnquiryServiceId;
    const emailValue = state.email.trim();
    const phoneValue = state.phone.trim();
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          businessName: state.businessName.trim(),
          email: emailValue,
          phone: phoneValue,
          contact: emailValue || phoneValue,
          serviceInterest: serviceId,
          message: state.message.trim(),
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
  }

  const errorKeys = (Object.keys(errors) as FieldKey[]).filter((key) => errors[key]);

  return (
    <div id={sectionId} className="kpi-contact-form scroll-mt-28">
      <div className="kpi-contact-form-intro">
        <h2 className="kpi-h2 kpi-contact-h2">{title}</h2>
        <p className="kpi-contact-form-lead">{body}</p>
        <ul className="kpi-contact-form-trust">
          <li>{t.time}</li>
          <li>{t.reply}</li>
          <li>{t.confidential}</li>
        </ul>
      </div>

      <div className="kpi-contact-form-panel">
        {status === "success" ? (
          <div className="kpi-contact-form-success" role="status">
            <p ref={successRef} tabIndex={-1} className="kpi-contact-form-success-title">
              {t.success}
            </p>
            {emailLink || phoneLink ? (
              <p className="kpi-contact-form-direct">
                {t.orTalk}{" "}
                {emailLink ? (
                  <a className="font-semibold text-[#0B6660]" href={emailLink}>
                    {email}
                  </a>
                ) : null}
                {emailLink && phoneLink ? " · " : null}
                {phoneLink ? (
                  <a className="font-semibold text-[#0B6660]" href={phoneLink}>
                    {phone}
                  </a>
                ) : null}
              </p>
            ) : null}
          </div>
        ) : (
          <form className="kpi-contact-form-fields" onSubmit={onSubmit} noValidate aria-busy={status === "submitting"}>
            {showSummary && errorKeys.length ? (
              <div ref={summaryRef} className="kpi-contact-form-summary" tabIndex={-1} role="alert" aria-labelledby={`${formId}-summary-title`}>
                <p id={`${formId}-summary-title`}>{t.errorSummary}</p>
                <ul>
                  {errorKeys.map((key) => (
                    <li key={key}>
                      <a href={`#${formId}-${key}`}>{labels[key]}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="kpi-contact-form-pair">
              <Field id={`${formId}-name`} label={t.name} mark={t.required} error={errors.name}>
                {({ describedBy }) => (
                  <input
                    id={`${formId}-name`}
                    name="name"
                    autoComplete="name"
                    className="kpi-field"
                    value={state.name}
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy}
                    onBlur={() => setFieldErrors(["name"])}
                    onChange={(event) => patch("name", event.target.value)}
                  />
                )}
              </Field>
              <Field id={`${formId}-businessName`} label={t.business} mark={t.required} error={errors.businessName}>
                {({ describedBy }) => (
                  <input
                    id={`${formId}-businessName`}
                    name="organization"
                    autoComplete="organization"
                    className="kpi-field"
                    value={state.businessName}
                    aria-required="true"
                    aria-invalid={Boolean(errors.businessName)}
                    aria-describedby={describedBy}
                    onBlur={() => setFieldErrors(["businessName"])}
                    onChange={(event) => patch("businessName", event.target.value)}
                  />
                )}
              </Field>
            </div>

            <div className="kpi-contact-form-pair">
              <Field id={`${formId}-email`} label={t.email} mark={t.required} hint={t.channelHint} error={errors.email}>
                {({ describedBy }) => (
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className="kpi-field"
                    value={state.email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describedBy}
                    onBlur={() => setFieldErrors(["email", "phone"])}
                    onChange={(event) => patch("email", event.target.value)}
                  />
                )}
              </Field>
              <Field id={`${formId}-phone`} label={t.phone} mark={t.required} error={errors.phone}>
                {({ describedBy }) => (
                  <input
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className="kpi-field"
                    value={state.phone}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={describedBy}
                    onBlur={() => setFieldErrors(["email", "phone"])}
                    onChange={(event) => patch("phone", event.target.value)}
                  />
                )}
              </Field>
            </div>

            <Field id={`${formId}-serviceInterest`} label={t.service} mark={t.required} error={errors.serviceInterest}>
              {({ describedBy }) => (
                <select
                  id={`${formId}-serviceInterest`}
                  name="serviceInterest"
                  className="kpi-field kpi-contact-form-select"
                  value={state.serviceInterest}
                  aria-required="true"
                  aria-invalid={Boolean(errors.serviceInterest)}
                  aria-describedby={describedBy}
                  onBlur={() => setFieldErrors(["serviceInterest"])}
                  onChange={(event) => patch("serviceInterest", event.target.value as EnquiryServiceId | "")}
                >
                  <option value="">{t.servicePlaceholder}</option>
                  {ENQUIRY_SERVICES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label[locale]}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field id={`${formId}-message`} label={t.message} mark={t.optional} hint={t.messageHint}>
              {({ describedBy }) => (
                <textarea
                  id={`${formId}-message`}
                  name="message"
                  rows={4}
                  className="kpi-field kpi-contact-form-message"
                  value={state.message}
                  aria-describedby={describedBy}
                  onChange={(event) => patch("message", event.target.value)}
                />
              )}
            </Field>

            <FormPrivacyNotice locale={locale} />

            <div className={`kpi-contact-form-consent-wrap${errors.consent ? " is-invalid" : ""}`}>
              <label className="kpi-contact-form-consent" htmlFor={`${formId}-consent`}>
                <input
                  id={`${formId}-consent`}
                  type="checkbox"
                  className="kpi-contact-form-check"
                  checked={state.consent}
                  aria-required="true"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
                  onChange={(event) => patch("consent", event.target.checked)}
                />
                <span>
                  {t.consent}{" "}
                  <Link href={privacyHref} className="kpi-contact-form-privacy">
                    {t.privacy}
                  </Link>
                </span>
              </label>
              {errors.consent ? (
                <p id={`${formId}-consent-error`} className="kpi-contact-form-error" role="alert">
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
              className="kpi-contact-form-honeypot"
              onChange={(event) => patch("companyWebsite", event.target.value)}
            />

            <div className="kpi-contact-form-actions">
              <button className="kpi-button" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? t.sending : t.submit}
              </button>
              {status === "submitting" ? (
                <p className="kpi-contact-form-loading" role="status">
                  {t.loading}
                </p>
              ) : null}
            </div>

            {status === "error" ? (
              <p className="kpi-contact-form-error" role="alert">
                {t.failed}
              </p>
            ) : null}
            {status === "unavailable" ? (
              <p className="kpi-contact-form-error" role="alert">
                {t.unavailable}
              </p>
            ) : null}

            <p className="kpi-contact-form-note">{t.assessmentNote}</p>
            {emailLink || phoneLink ? (
              <p className="kpi-contact-form-direct">
                {t.orTalk}{" "}
                {emailLink ? (
                  <a href={emailLink}>
                    {email}
                  </a>
                ) : null}
                {emailLink && phoneLink ? " · " : null}
                {phoneLink ? <a href={phoneLink}>{phone}</a> : null}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
