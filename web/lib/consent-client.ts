import { CONSENT_COPY, CONSENT_MAX_AGE_DAYS, CONSENT_VERSION, emptyChoice, type ConsentChoice, type ConsentRecord } from "@/lib/privacy";

export { emptyChoice };
export type { ConsentChoice, ConsentRecord };

export const CONSENT_COOKIE = "kpi_consent";

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

export function consentCopy(locale: string) {
  return locale === "th" ? CONSENT_COPY.th : CONSENT_COPY.en;
}

export function parseConsent(raw: string | null | undefined): ConsentRecord | null {
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as ConsentRecord;
    if (!record || record.v !== CONSENT_VERSION || !record.c || !record.ts) return null;
    const age = Date.now() - new Date(record.ts).getTime();
    if (Number.isNaN(age) || age > CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000) return null;
    return record;
  } catch {
    return null;
  }
}

export function readConsentCookie(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )kpi_consent=([^;]+)/);
  if (!match?.[1]) return null;
  return parseConsent(decodeURIComponent(match[1]));
}

export function writeConsentCookie(choice: ConsentChoice) {
  const record: ConsentRecord = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    id: readConsentCookie()?.id || randomId(),
    c: { ...emptyChoice(), ...choice, marketing: false, preferences: false },
  };
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  return record;
}

export function toGoogleConsent(choice: ConsentChoice) {
  const g = (on: boolean) => (on ? "granted" : "denied");
  return {
    functionality_storage: g(choice.preferences),
    personalization_storage: g(choice.preferences),
    analytics_storage: g(choice.analytics),
    ad_storage: g(choice.marketing),
    ad_user_data: g(choice.marketing),
    ad_personalization: g(choice.marketing),
  };
}

export function deleteAnalyticsCookies() {
  const names = document.cookie.split(";").map((part) => part.split("=")[0]?.trim() ?? "");
  const host = location.hostname.replace(/^www\./, "");
  const domains = ["", location.hostname, `.${host}`];
  for (const name of names) {
    if (name === "_ga" || name.startsWith("_ga_") || name.startsWith("_gcl_") || name === "_fbp" || name === "_fbc") {
      for (const domain of domains) {
        const domainPart = domain ? `; Domain=${domain}` : "";
        document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domainPart}`;
      }
    }
  }
}

export function hasAnalyticsConsent() {
  return Boolean(readConsentCookie()?.c.analytics);
}

export function applyGoogleConsent(choice: ConsentChoice, eventName: "kpi_consent_ready" | "kpi_consent_update") {
  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", toGoogleConsent(choice));
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, kpi_consent: choice });
  window.dispatchEvent(new CustomEvent("kpi-consent-change", { detail: choice }));
}
