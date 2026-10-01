"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import { AUDIT_CONTACTS, readUtm } from "@/lib/audit";
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
  message: string;
  consent: boolean;
  companyWebsite: string;
};

type FieldError = Partial<Record<"name" | "businessName" | "contact" | "serviceInterest" | "consent", string>>;

function ContactNote({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = ENQUIRY_UI[locale];
  return (
    <p className={`text-sm leading-7 text-[#555555] ${className}`}>
      {t.orTalk}{" "}
      <a className="font-semibold text-[#0B6660]" href={`mailto:${AUDIT_CONTACTS.email}`}>
        {AUDIT_CONTACTS.email}
      </a>
      {" · "}
      <a className="font-semibold text-[#0B6660]" href={`tel:${AUDIT_CONTACTS.phoneTel}`}>
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
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-bold text-[#3B3B3B]">
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
  };

  const formCard = (
    <div className="rounded-[1.5rem] border border-[#E3E8EB] bg-white p-6 shadow-[0_18px_40px_rgba(11,31,51,.06)] sm:p-8">
      {status === "success" ? (
        <div className="rounded-2xl bg-[#F2F8E2] p-6" role="status">
          <p className="text-lg font-extrabold leading-8 text-[#0B1F33]">{t.success}</p>
          <ContactNote locale={locale} className="mt-5" />
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={onSubmit} noValidate>
          <Field label={t.name} htmlFor={`${formId}-name`} error={errors.name}>
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
          <Field label={t.business} htmlFor={`${formId}-business`} error={errors.businessName}>
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
          <Field label={t.contact} htmlFor={`${formId}-contact`} error={errors.contact}>
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
          {!preset ? (
            <Field label={t.service} htmlFor={`${formId}-service`} error={errors.serviceInterest}>
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
          <Field label={t.message} htmlFor={`${formId}-message`} optional={t.messageOptional}>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={3}
              className="kpi-field mt-1"
              placeholder={t.messageHint}
              value={state.message}
              onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            />
          </Field>
          <FormPrivacyNotice locale={locale} />
          <label className="flex gap-3 text-sm leading-7 text-[#555555]">
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
          {showAssessmentNote ? <p className="text-sm leading-7 text-[#555555]">{t.assessmentNote}</p> : null}
          <ContactNote locale={locale} />
        </form>
      )}
    </div>
  );

  if (compact) {
    return (
      <div>
        {title || body ? (
          <div className="mb-6">
            {title ? <h2 className="text-2xl font-extrabold tracking-[-.04em] text-[#3B3B3B]">{heading}</h2> : null}
            {body || lead ? <p className="mt-3 text-base leading-8 text-[#555555]">{lead}</p> : null}
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
