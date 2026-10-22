"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "@/components/Icons";
import { hasVerifiedMapsEmbed, hasVerifiedMapsUrl } from "@/lib/cms/contact";
import { consentCopy } from "@/lib/consent-client";
import type { Locale } from "@/lib/seo";

const LOAD_TIMEOUT_MS = 12000;

const ui = {
  th: {
    loading: "กำลังโหลดแผนที่…",
    fallback: "ไม่สามารถโหลดแผนที่ได้ในหน้านี้",
    dummyLead: "Google Maps will be connected here",
    dummyHint: "Coordinates / address: [add verified location in Admin Panel]",
    dummySize: "Recommended map area: 640 × 420 px",
  },
  en: {
    loading: "Loading map…",
    fallback: "The map could not be loaded on this page.",
    dummyLead: "Google Maps will be connected here",
    dummyHint: "Coordinates / address: [add verified location in Admin Panel]",
    dummySize: "Recommended map area: 640 × 420 px",
  },
} as const;

type MapStatus = "idle" | "loading" | "ready" | "failed";

export function ContactLocationMap({
  locale,
  title,
  address,
  mapsUrl,
  embedSrc,
  openMapLabel,
}: {
  locale: Locale;
  title: string;
  address?: string;
  mapsUrl?: string;
  embedSrc?: string;
  openMapLabel: string;
}) {
  const t = locale === "th" ? ui.th : ui.en;
  const privacy = consentCopy(locale === "th" ? "th" : "en");
  const embed = hasVerifiedMapsEmbed(embedSrc) ? embedSrc!.trim() : "";
  const share = hasVerifiedMapsUrl(mapsUrl) ? mapsUrl!.trim() : "";
  const visibleAddress = address?.trim() ?? "";
  const hasLocation = Boolean(embed || share || visibleAddress);
  const [status, setStatus] = useState<MapStatus>(embed ? "loading" : "idle");
  const showEmbed = Boolean(embed);

  useEffect(() => {
    if (!showEmbed || status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("ready"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [showEmbed, status]);

  useEffect(() => {
    if (!showEmbed) return;
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (!(reason instanceof Event)) return;
      const target = reason.target;
      if (!(target instanceof HTMLIFrameElement)) return;
      event.preventDefault();
      setStatus((current) => (current === "loading" ? "failed" : current));
    };
    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, [showEmbed]);

  return (
    <section className="kpi-contact-map-block" aria-label={title}>
      <div
        className={`kpi-contact-map-frame${showEmbed ? " is-embed" : hasLocation ? " is-link" : " is-empty"}`}
        aria-busy={status === "loading"}
      >
        {showEmbed ? (
          <iframe
            title={title}
            src={embed}
            width={640}
            height={420}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={() => setStatus("ready")}
          />
        ) : null}

        {status === "loading" ? (
          <p className="kpi-contact-map-status" role="status">
            {t.loading}
          </p>
        ) : null}

        {!showEmbed ? (
          <div className="kpi-contact-map-fallback">
            <MapPin />
            {hasLocation ? (
              <>
                {status === "failed" ? <p role="status">{t.fallback}</p> : <p>{title}</p>}
                {visibleAddress ? <p className="kpi-contact-map-fallback-address">{visibleAddress}</p> : null}
                {share ? (
                  <a className="kpi-contact-map-open" href={share} rel="noreferrer">
                    {openMapLabel} <ArrowUpRight />
                  </a>
                ) : null}
              </>
            ) : (
              <>
                <p className="kpi-contact-map-kicker">[MAP PLACEHOLDER]</p>
                <p>{t.dummyLead}</p>
                <p>{t.dummyHint}</p>
                <p>{t.dummySize}</p>
              </>
            )}
          </div>
        ) : null}
      </div>

      {hasLocation ? (
        <div className="kpi-contact-map-meta">
          {visibleAddress ? <p className="kpi-contact-map-address">{visibleAddress}</p> : null}
          {share ? (
            <p className="kpi-contact-map-cta">
              <a href={share} rel="noreferrer">
                {openMapLabel} <span aria-hidden="true">↗</span>
              </a>
            </p>
          ) : null}
          {status === "failed" ? (
            <p className="kpi-contact-map-privacy" role="status">
              {t.fallback}
            </p>
          ) : null}
          {embed ? <p className="kpi-contact-map-privacy">{privacy.mapPlaceholder}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
