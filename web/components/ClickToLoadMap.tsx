"use client";

import { consentCopy } from "@/lib/consent-client";
import { useState } from "react";

export function ClickToLoadMap({
  title,
  embedSrc,
  locale,
}: {
  title: string;
  embedSrc: string;
  locale: "th" | "en";
}) {
  const t = consentCopy(locale);
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <div className="kpi-contact-map kpi-contact-map-inline kpi-map-placeholder">
        <p>{t.mapPlaceholder}</p>
        <button type="button" className="kpi-button mt-4" onClick={() => setShow(true)}>
          {t.showMap}
        </button>
      </div>
    );
  }

  return (
    <div className="kpi-contact-map kpi-contact-map-inline">
      <iframe title={title} src={embedSrc} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </div>
  );
}
