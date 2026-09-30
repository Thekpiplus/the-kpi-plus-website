import { CONSENT_VERSION } from "@/lib/privacy";

export function ConsentDefaults() {
  const source = `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  var match = document.cookie.match(/(?:^|; )kpi_consent=([^;]+)/);
  if (match) {
    var record = JSON.parse(decodeURIComponent(match[1]));
    if (record && record.v === '${CONSENT_VERSION}' && record.c) {
      var on = function (value) { return value ? 'granted' : 'denied'; };
      gtag('consent', 'update', {
        functionality_storage: on(record.c.preferences),
        personalization_storage: on(record.c.preferences),
        analytics_storage: on(record.c.analytics),
        ad_storage: on(record.c.marketing),
        ad_user_data: on(record.c.marketing),
        ad_personalization: on(record.c.marketing)
      });
      dataLayer.push({ event: 'kpi_consent_ready', kpi_consent: record.c });
    }
  }
} catch (error) {}
`;
  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
