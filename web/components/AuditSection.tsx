"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { AUDIT_LAYOUT, auditCopyFor, auditFocusOrder, auditRoleOrder } from "@/lib/audit-copy";
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
      window.requestAnimationFrame(() => {
        document.getElementById(`${formId}-success`)?.focus();
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="audit" data-audit-layout={AUDIT_LAYOUT} className="kpi-home-audit border-t border-[#E3E8EB] bg-[#F4F4F4]">
      <div className={`kpi-section kpi-split-audit${leftExtra ? " kpi-split-audit-fill" : ""}`}>
        <div className="kpi-audit-copy">
          <div className="kpi-audit-lead">
            <p className="kpi-audit-kicker kpi-latin">{t.eyebrow}</p>
            <h2 className="kpi-h2 kpi-audit-heading">
              {locale === "th" ? (
                <>
                  <span className="kpi-th-line">ขอวิเคราะห์</span>
                  <span className="kpi-th-line">Performance โรงแรม</span>
                </>
              ) : (
                t.heading
              )}
            </h2>
            <p className="kpi-audit-intro">{t.intro}</p>
            <ul className="kpi-audit-points">
              {t.reassurances.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <aside className="kpi-audit-aside">
            <figure className="kpi-audit-people">
              <img
                src="/media/kpi-plus-team-review_d4af97f6.jpg"
                alt={
                  locale === "th"
                    ? "ทีม The KPI Plus ประชุมรีวิวข้อมูลโรงแรมด้วยกัน"
                    : "The KPI Plus team reviewing hotel data together"
                }
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className="kpi-audit-people-name">{t.teamCaption}</span>
                <span className="kpi-audit-people-note">{t.teamNote}</span>
              </figcaption>
            </figure>
            <ol className="kpi-audit-steps" aria-label={t.nextTitle}>
              {t.nextSteps.map(([num, body]) => (
                <li key={num}>
                  <span className="kpi-latin">{num}</span>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
            {leftExtra}
          </aside>
        </div>

        <div className="kpi-audit-panel">
          {status === "success" ? (
            <div className="kpi-audit-success" role="status">
              <h3 id={`${formId}-success`} tabIndex={-1}>
                {t.successTitle}
              </h3>
              <p>{t.successBody}</p>
              <ContactLinks locale={locale} />
            </div>
          ) : (
            <form className="kpi-audit-form" onSubmit={onSubmit} noValidate>
              <p className="kpi-audit-group">{t.groupHotel}</p>
              <div className="kpi-audit-row">
                <Field label={t.name} error={errors.name} htmlFor={`${formId}-name`} requiredMark>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    autoComplete="name"
                    className="kpi-field"
                    value={state.name}
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
                  />
                </Field>
                <Field label={t.role} error={errors.role} htmlFor={`${formId}-role`} requiredMark>
                  <select
                    id={`${formId}-role`}
                    name="role"
                    className="kpi-field"
                    value={state.role}
                    aria-required="true"
                    aria-invalid={Boolean(errors.role)}
                    aria-describedby={errors.role ? `${formId}-role-error` : undefined}
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
                <Field label={t.hotel} error={errors.hotel} htmlFor={`${formId}-hotel`} requiredMark>
                  <input
                    id={`${formId}-hotel`}
                    name="hotel"
                    className="kpi-field"
                    value={state.hotel}
                    aria-required="true"
                    aria-invalid={Boolean(errors.hotel)}
                    aria-describedby={errors.hotel ? `${formId}-hotel-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, hotel: event.target.value }))}
                  />
                </Field>
                <Field label={t.rooms} htmlFor={`${formId}-rooms`} optionalLabel={t.optional}>
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
              <Field label={t.province} error={errors.province} htmlFor={`${formId}-province`} requiredMark>
                <input
                  id={`${formId}-province`}
                  name="province"
                  className="kpi-field"
                  value={state.province}
                  aria-required="true"
                  aria-invalid={Boolean(errors.province)}
                  aria-describedby={errors.province ? `${formId}-province-error` : undefined}
                  onBlur={() => validate()}
                  onChange={(event) => setState((current) => ({ ...current, province: event.target.value }))}
                />
              </Field>

              <p className="kpi-audit-group">{t.groupFocus}</p>
              <fieldset aria-describedby={errors.concerns ? `${formId}-concerns-error` : undefined} aria-invalid={Boolean(errors.concerns)}>
                <legend className="kpi-label">
                  {t.concernsLegend}
                  <span className="kpi-audit-req" aria-hidden="true">
                    {" "}
                    *
                  </span>
                </legend>
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
                  <p id={`${formId}-concerns-error`} className="kpi-audit-error" role="alert">
                    {errors.concerns}
                  </p>
                ) : null}
              </fieldset>

              <Field label={t.details} htmlFor={`${formId}-details`} optionalLabel={t.optional}>
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
              <p className="kpi-audit-hint" id={`${formId}-contact-hint`}>
                {t.contactHint}
              </p>
              <div className="kpi-audit-row">
                <Field label={t.phone} htmlFor={`${formId}-phone`} optionalLabel={t.optional}>
                  <input
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="kpi-field"
                    value={state.phone}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={`${formId}-contact-hint${errors.contact ? ` ${formId}-contact-error` : ""}`}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
                  />
                </Field>
                <Field label={t.lineId} htmlFor={`${formId}-line`} optionalLabel={t.optional}>
                  <input
                    id={`${formId}-line`}
                    name="lineId"
                    className="kpi-field"
                    value={state.lineId}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? `${formId}-contact-error` : undefined}
                    onBlur={() => validate()}
                    onChange={(event) => setState((current) => ({ ...current, lineId: event.target.value }))}
                  />
                </Field>
              </div>
              <Field label={t.email} htmlFor={`${formId}-email`} optionalLabel={t.optional}>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="kpi-field"
                  value={state.email}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? `${formId}-contact-error` : undefined}
                  onBlur={() => validate()}
                  onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
                />
              </Field>
              {errors.contact ? (
                <p id={`${formId}-contact-error`} className="kpi-audit-error" role="alert">
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
                  aria-required="true"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
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
                <p id={`${formId}-consent-error`} className="kpi-audit-error" role="alert">
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
                    aria-hidden="true"
                    value={state.companyWebsite}
                    onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
                  />
                </label>
              </div>

              {status === "error" ? (
                <div className="kpi-audit-error-box" role="alert">
                  <p className="kpi-audit-error-title">{t.errorTitle}</p>
                  <p>{t.errorBody}</p>
                  <ContactLinks locale={locale} />
                </div>
              ) : null}

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
  requiredMark,
  optionalLabel,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  requiredMark?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="kpi-audit-field">
      <label className="kpi-label" htmlFor={htmlFor}>
        {label}
        {requiredMark ? (
          <span className="kpi-audit-req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
        {optionalLabel ? <span className="kpi-audit-opt"> {optionalLabel}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="kpi-audit-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactLinks({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = auditCopyFor(locale);
  return (
    <p className={`kpi-audit-contacts ${className}`.trim()}>
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
