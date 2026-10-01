"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { auditCopyFor, auditFocusOrder, auditRoleOrder } from "@/lib/audit-copy";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import { AUDIT_CONTACTS, parseAuditFocus, readUtm, type AuditFocus, type AuditRole } from "@/lib/audit";
import { localizePath, type Locale } from "@/lib/seo";
import { track } from "@/lib/track";

type FormState = {
  name: string;
  hotel: string;
  province: string;
  rooms: string;
  role: AuditRole | "";
  phone: string;
  lineId: string;
  email: string;
  concerns: AuditFocus[];
  details: string;
  consent: boolean;
  companyWebsite: string;
};

const empty: FormState = {
  name: "",
  hotel: "",
  province: "",
  rooms: "",
  role: "",
  phone: "",
  lineId: "",
  email: "",
  concerns: [],
  details: "",
  consent: false,
  companyWebsite: "",
};

type FieldError = Partial<Record<"name" | "hotel" | "province" | "role" | "contact" | "concerns" | "consent", string>>;

function hasContact(state: FormState) {
  return Boolean(state.phone.trim() || state.lineId.trim() || state.email.trim());
}

export function AuditSection({ locale, leftExtra }: { locale: Locale; leftExtra?: ReactNode }) {
  const t = auditCopyFor(locale);
  const searchParams = useSearchParams();
  const formId = useId();
  const privacyHref = localizePath("/privacy", locale);
  const [state, setState] = useState<FormState>(empty);
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const focus = useMemo(() => {
    const fromQuery = parseAuditFocus(searchParams);
    return fromQuery;
  }, [searchParams]);

  useEffect(() => {
    const fromHash = parseAuditFocus(typeof window === "undefined" ? "" : window.location.hash);
    const next = fromHash ?? focus;
    if (!next) return;
    setState((current) => (current.concerns.includes(next) ? current : { ...current, concerns: [...current.concerns, next] }));
  }, [focus]);

  const validate = (next = state) => {
    const nextErrors: FieldError = {};
    if (!next.name.trim()) nextErrors.name = t.required;
    if (!next.hotel.trim()) nextErrors.hotel = t.required;
    if (!next.province.trim()) nextErrors.province = t.required;
    if (!next.role) nextErrors.role = t.required;
    if (!hasContact(next)) nextErrors.contact = t.contactError;
    if (!next.concerns.length) nextErrors.concerns = t.concernsError;
    if (!next.consent) nextErrors.consent = t.consentError;
    setErrors(nextErrors);
    return nextErrors;
  };

  const toggleConcern = (value: AuditFocus) => {
    setState((current) => ({
      ...current,
      concerns: current.concerns.includes(value)
        ? current.concerns.filter((item) => item !== value)
        : [...current.concerns, value],
    }));
    setErrors((current) => ({ ...current, concerns: undefined }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) return;
    setStatus("submitting");
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          hotel: state.hotel.trim(),
          province: state.province.trim(),
          rooms: state.rooms.trim(),
          role: state.role,
          phone: state.phone.trim(),
          lineId: state.lineId.trim(),
          email: state.email.trim(),
          concerns: state.concerns,
          details: state.details.trim(),
          consent: state.consent,
          honeypot: state.companyWebsite,
          focus: focus ?? null,
          pageUrl: typeof window === "undefined" ? "" : window.location.href,
          utm: typeof window === "undefined" ? {} : readUtm(window.location.search),
          locale,
        }),
      });
      if (!response.ok) throw new Error("submit_failed");
      track("generate_lead", {
        form: "hotel_performance_audit",
        concerns: state.concerns.join(","),
        focus: focus ?? "",
        locale,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="audit" className="kpi-home-audit border-t border-[#E3E8EB] bg-[#F4F4F4]">
      <div className={`kpi-section kpi-split-audit${leftExtra ? " kpi-split-audit-fill" : ""}`}>
        <div className="kpi-audit-copy">
          <p className="kpi-audit-kicker kpi-latin">{t.eyebrow}</p>
          <h2 className="kpi-h2 kpi-audit-heading">
            {locale === "th" ? (
              <>
                {"ขอวิเคราะห์"}
                <span className="kpi-audit-break"> </span>
                {"Performance โรงแรม"}
              </>
            ) : (
              t.heading
            )}
          </h2>
          <p className="kpi-audit-intro">{t.intro}</p>
          <ol className="kpi-audit-steps">
            {t.nextSteps.map(([num, body]) => (
              <li key={num}>
                <span className="kpi-latin">{num}</span>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="kpi-audit-trust">
            {t.trustFree}
            <br />
            {t.trustReply}
          </p>
          {leftExtra}
        </div>

        <div className="kpi-audit-panel">
          {status === "success" ? (
            <div className="bg-[#F2F8E2] p-6" role="status">
              <h3 className="text-2xl font-extrabold tracking-[-.04em] text-[#0B1F33]">{t.successTitle}</h3>
              <p className="mt-4 text-base leading-8 text-[#555555]">{t.successBody}</p>
              <ContactLinks locale={locale} className="mt-6" />
            </div>
          ) : (
            <form className="kpi-audit-form" onSubmit={onSubmit} noValidate>
              <p className="kpi-audit-group">{t.groupHotel}</p>
              <div className="kpi-audit-row">
                <Field label={t.name} error={errors.name} htmlFor={`${formId}-name`}>
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
                <Field label={t.role} error={errors.role} htmlFor={`${formId}-role`}>
                  <select
                    id={`${formId}-role`}
                    name="role"
                    className="kpi-field"
                    value={state.role}
                    aria-invalid={Boolean(errors.role)}
                    onBlur={() => validate()}
                    onChange={(event) =>
                      setState((current) => ({ ...current, role: event.target.value as AuditRole | "" }))
                    }
                  >
                    <option value="">{t.rolePlaceholder}</option>
                    {auditRoleOrder.map((role) => (
                      <option key={role} value={role}>
                        {t.roles[role]}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="kpi-audit-row">
                <Field label={t.hotel} error={errors.hotel} htmlFor={`${formId}-hotel`}>
                  <input
                    id={`${formId}-hotel`}
                    name="hotel"
                    className="kpi-field"
                    value={state.hotel}
                    aria-invalid={Boolean(errors.hotel)}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, hotel: event.target.value }))}
                  />
                </Field>
                <Field label={t.rooms} htmlFor={`${formId}-rooms`}>
                  <input
                    id={`${formId}-rooms`}
                    name="rooms"
                    inputMode="numeric"
                    className="kpi-field"
                    value={state.rooms}
                    onChange={(event) => setState((current) => ({ ...current, rooms: event.target.value }))}
                  />
                </Field>
              </div>
              <Field label={t.province} error={errors.province} htmlFor={`${formId}-province`}>
                <input
                  id={`${formId}-province`}
                  name="province"
                  className="kpi-field"
                  value={state.province}
                  aria-invalid={Boolean(errors.province)}
                  onBlur={() => validate()}
                  onChange={(event) => setState((current) => ({ ...current, province: event.target.value }))}
                />
              </Field>

              <p className="kpi-audit-group">{t.groupFocus}</p>
              <fieldset>
                <legend className="kpi-label">{t.concernsLegend}</legend>
                <div className="kpi-audit-concerns">
                  {auditFocusOrder.map((value) => {
                    const checked = state.concerns.includes(value);
                    return (
                      <label
                        key={value}
                        className={`kpi-audit-check${checked ? " is-checked" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="concerns"
                          value={value}
                          checked={checked}
                          className="mt-0.5 h-4 w-4 accent-[#0B6660]"
                          onChange={() => toggleConcern(value)}
                        />
                        <span>{t.concerns[value]}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.concerns ? (
                  <p className="mt-2 text-sm text-[#bd3f3f]" role="alert">
                    {errors.concerns}
                  </p>
                ) : null}
              </fieldset>

              <Field label={t.details} htmlFor={`${formId}-details`}>
                <textarea
                  id={`${formId}-details`}
                  name="details"
                  className="kpi-field"
                  placeholder={t.detailsPlaceholder}
                  value={state.details}
                  onChange={(event) => setState((current) => ({ ...current, details: event.target.value }))}
                />
              </Field>

              <p className="kpi-audit-group">{t.groupContact}</p>
              <p className="kpi-audit-hint">{t.contactHint}</p>
              <div className="kpi-audit-row">
                <Field label={t.phone} htmlFor={`${formId}-phone`}>
                  <input
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="kpi-field"
                    value={state.phone}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
                  />
                </Field>
                <Field label={t.lineId} htmlFor={`${formId}-line`}>
                  <input
                    id={`${formId}-line`}
                    name="lineId"
                    className="kpi-field"
                    value={state.lineId}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, lineId: event.target.value }))}
                  />
                </Field>
              </div>
              <Field label={t.email} htmlFor={`${formId}-email`}>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="kpi-field"
                  value={state.email}
                  onBlur={() => validate()}
                  onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
                />
              </Field>
              {errors.contact ? (
                <p id={`${formId}-contact-error`} className="text-sm text-[#bd3f3f]" role="alert">
                  {errors.contact}
                </p>
              ) : null}

              <div className="kpi-audit-privacy">
                <FormPrivacyNotice locale={locale} />
              </div>
              <label className="kpi-audit-consent">
                <input
                  type="checkbox"
                  name="consent"
                  className="mt-0.5 h-4 w-4 accent-[#0B6660]"
                  checked={state.consent}
                  onChange={(event) => setState((current) => ({ ...current, consent: event.target.checked }))}
                />
                <span>
                  {t.consent}{" "}
                  <Link href={privacyHref} className="font-semibold text-[#0B6660] underline-offset-2 hover:underline">
                    {t.consentPrivacy}
                  </Link>
                </span>
              </label>
              {errors.consent ? (
                <p className="text-sm text-[#bd3f3f]" role="alert">
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
                <div className="border border-[#E3E8EB] bg-[#F4F4F4] p-4" role="alert">
                  <p className="font-semibold text-[#3B3B3B]">{t.errorTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-[#555555]">{t.errorBody}</p>
                  <ContactLinks locale={locale} className="mt-4" />
                </div>
              ) : null}

              <p className="kpi-audit-time">{t.timeNote}</p>
              <button
                type="submit"
                className="kpi-cta w-full"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
              >
                {status === "submitting" ? t.submitting : t.submit}
              </button>
              <p className="kpi-audit-follow">{t.followUp}</p>
              <ContactLinks locale={locale} />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="kpi-label" htmlFor={htmlFor}>
      {label}
      {children}
      {error ? (
        <span className="mt-2 block text-sm font-medium normal-case tracking-normal text-[#bd3f3f]" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ContactLinks({ locale, className = "mt-2" }: { locale: Locale; className?: string }) {
  const t = auditCopyFor(locale);
  return (
    <p className={`text-sm leading-7 text-[#555555] ${className}`}>
      {t.orTalk}{" "}
      <a
        href={AUDIT_CONTACTS.lineHref}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#0B6660]"
        data-track="contact_line_click"
        onClick={() => track("contact_line_click", { locale })}
      >
        {t.line}
      </a>
      <span aria-hidden="true"> · </span>
      <a
        href={AUDIT_CONTACTS.phoneHref}
        className="font-semibold text-[#0B6660]"
        data-track="contact_phone_click"
        onClick={() => track("contact_phone_click", { locale })}
      >
        {t.call} {AUDIT_CONTACTS.phoneDisplay}
      </a>
    </p>
  );
}

export function AuditSectionHost({ locale, leftExtra }: { locale: Locale; leftExtra?: ReactNode }) {
  return (
    <Suspense
      fallback={
        <section id="audit" className="border-t border-[#E3E8EB] bg-[#F4F4F4]">
          <div className="kpi-section min-h-80" />
        </section>
      }
    >
      <AuditSection locale={locale} leftExtra={leftExtra} />
    </Suspense>
  );
}
