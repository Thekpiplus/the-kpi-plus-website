"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { hasAnalyticsConsent } from "@/lib/consent-client";

/**
 * Loads GTM after analytics consent or the first user interaction.
 * Consent Mode defaults stay denied until CookieConsent updates them.
 */
export function GoogleTagManager({ id }: { id: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;

    const arm = () => setReady(true);
    if (hasAnalyticsConsent()) {
      arm();
      return;
    }

    const onConsent = () => {
      if (hasAnalyticsConsent()) arm();
    };
    const onInteract = () => arm();

    window.addEventListener("kpi-consent-change", onConsent);
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    return () => {
      window.removeEventListener("kpi-consent-change", onConsent);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [id]);

  if (!id || !ready) return null;

  return (
    <>
      <Script id="kpi-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
