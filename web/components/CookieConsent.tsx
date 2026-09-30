"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  applyGoogleConsent,
  consentCopy,
  deleteAnalyticsCookies,
  emptyChoice,
  readConsentCookie,
  writeConsentCookie,
} from "@/lib/consent-client";
import { existingHref, localeFromPath } from "@/lib/seo";
import type { ConsentChoice } from "@/lib/privacy";

export function CookieConsent() {
  const pathname = usePathname() || "/";
  const locale = localeFromPath(pathname) === "th" ? "th" : "en";
  const t = consentCopy(locale);
  const cookiesHref = existingHref("/cookies", locale) ?? (locale === "th" ? "/cookies" : "/en/cookies");
  const privacyHref = existingHref("/privacy", locale) ?? (locale === "th" ? "/privacy" : "/en/privacy");
  const titleId = useId();
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState<ConsentChoice>(emptyChoice());
  const [banner, setBanner] = useState(false);
  const [settings, setSettings] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const record = readConsentCookie();
    if (record) {
      setChoice(record.c);
      setBanner(false);
      applyGoogleConsent(record.c, "kpi_consent_ready");
    } else {
      setBanner(true);
    }
    const open = (event: Event) => {
      openerRef.current = event.target instanceof HTMLElement ? event.target : null;
      setSettings(true);
    };
    window.addEventListener("kpi-open-cookie-settings", open);
    return () => window.removeEventListener("kpi-open-cookie-settings", open);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("kpi-consent-open", banner);
    return () => document.documentElement.classList.remove("kpi-consent-open");
  }, [banner]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (settings) {
      if (!dialog.open) dialog.showModal();
      const focusable = dialog.querySelector<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])");
      focusable?.focus();
    } else if (dialog.open) {
      dialog.close();
      openerRef.current?.focus();
    }
  }, [settings]);

  function persist(next: ConsentChoice, reloadIfNeeded = true) {
    const previous = readConsentCookie()?.c.analytics ?? false;
    writeConsentCookie(next);
    applyGoogleConsent(next, "kpi_consent_update");
    setChoice(next);
    setBanner(false);
    setSettings(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
    if (previous && !next.analytics) {
      deleteAnalyticsCookies();
      if (reloadIfNeeded) location.reload();
    }
  }

  return (
    <>
      {banner ? (
        <div className="kpi-consent-banner" role="region" aria-label={t.bannerTitle}>
          <div className="kpi-consent-inner">
            <div>
              <p className="kpi-consent-title">{t.bannerTitle}</p>
              <p className="kpi-consent-body">
                {t.bannerBody}{" "}
                <a href={cookiesHref}>{t.cookiePolicy}</a>
              </p>
            </div>
            <div className="kpi-consent-actions">
              <button type="button" className="kpi-consent-btn" onClick={() => persist({ ...emptyChoice(), analytics: true })}>
                {t.acceptAll}
              </button>
              <button type="button" className="kpi-consent-btn" onClick={() => persist(emptyChoice())}>
                {t.rejectAll}
              </button>
              <button
                type="button"
                className="kpi-consent-btn"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setSettings(true);
                }}
              >
                {t.settings}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className="kpi-consent-dialog"
        aria-labelledby={titleId}
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          setSettings(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSettings(false);
        }}
      >
        <div className="kpi-consent-panel" role="document">
          <h2 id={titleId} className="text-2xl font-extrabold text-[#3B3B3B]">
            {t.dialogTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#555555]">{t.dialogIntro}</p>
          <div className="mt-6 grid gap-4">
            <div className="kpi-consent-row">
              <div>
                <p className="font-bold text-[#3B3B3B]">{t.necessary}</p>
                <p className="mt-1 text-sm text-[#555555]">{t.alwaysOn}</p>
              </div>
              <button type="button" role="switch" aria-checked="true" aria-disabled="true" className="kpi-consent-switch is-on is-locked" disabled>
                <span className="sr-only">{t.necessaryState}</span>
              </button>
            </div>
            <div className="kpi-consent-row">
              <p className="font-bold text-[#3B3B3B]">{t.analytics}</p>
              <button
                type="button"
                role="switch"
                aria-checked={choice.analytics}
                className={`kpi-consent-switch${choice.analytics ? " is-on" : ""}`}
                onClick={() => setChoice((current) => ({ ...current, analytics: !current.analytics }))}
              >
                <span className="sr-only">{choice.analytics ? t.on : t.off}</span>
              </button>
            </div>
          </div>
          <p className="mt-5 text-sm">
            <a href={cookiesHref} className="font-semibold text-[#0B6660]">
              {t.cookiePolicy}
            </a>
            {" · "}
            <a href={privacyHref} className="font-semibold text-[#0B6660]">
              {t.privacy}
            </a>
          </p>
          <div className="kpi-consent-actions mt-6">
            <button type="button" className="kpi-consent-btn" onClick={() => persist(choice)}>
              {t.save}
            </button>
            <button type="button" className="kpi-consent-btn" onClick={() => persist({ ...emptyChoice(), analytics: true })}>
              {t.acceptAll}
            </button>
            <button type="button" className="kpi-consent-btn" onClick={() => persist(emptyChoice())}>
              {t.rejectAll}
            </button>
          </div>
          <button type="button" className="kpi-consent-close" onClick={() => setSettings(false)}>
            {t.close}
          </button>
        </div>
      </dialog>
      {saved ? (
        <p className="kpi-consent-toast" role="status">
          {t.saved}
        </p>
      ) : null}
    </>
  );
}
