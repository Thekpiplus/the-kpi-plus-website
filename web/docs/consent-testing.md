# Consent testing

Manual checks in a fresh browser profile, on `/` (Thai) and `/en`.

1. Before any choice: no requests to `google-analytics.com` or `googletagmanager.com/gtag/js`; no `_ga` cookies. Banner visible. Closing the banner without a button is not consent.
2. Reject all: `kpi_consent` saved with analytics false; banner gone on next page; still no GA requests.
3. Analytics only / Accept all: GA4 loads once after the choice; `_ga` cookies may appear.
4. Withdraw via footer **ตั้งค่าคุกกี้ / Cookie settings**: turn analytics off, save; `_ga*` deleted and page reloads; no further GA collect.
5. Forms: submit with POST; thank-you must not put name/email/phone in the URL. `generate_lead` events include only a form id and locale.
6. Contact map: placeholder until **แสดงแผนที่ / Show map**.
7. Keyboard: tab through banner buttons; Esc closes the settings dialog without saving.
8. Bump `CONSENT_VERSION` in `web/lib/privacy.ts` → banner reappears.

Do not describe the site as PDPA/GDPR compliant or ad-approved.
