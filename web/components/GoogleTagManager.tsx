import Script from "next/script";

/**
 * Loads Google Tag Manager once for the whole site.
 * Consent Mode defaults are set earlier in <ConsentDefaults />; tags inside GTM
 * should respect analytics / ads consent updates from CookieConsent.
 */
export function GoogleTagManager({ id }: { id: string }) {
  if (!id) return null;

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
