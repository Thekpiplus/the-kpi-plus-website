export const AUDIT_FOCUS_VALUES = [
  "occupancy",
  "pricing",
  "ota",
  "direct",
  "ads",
  "reporting",
  "overview",
] as const;

export type AuditFocus = (typeof AUDIT_FOCUS_VALUES)[number];

export const AUDIT_ROLES = ["owner", "gm", "revenue", "sales", "other"] as const;
export type AuditRole = (typeof AUDIT_ROLES)[number];

export const AUDIT_CONTACTS = {
  phoneDisplay: "+66 82 635 6266",
  phoneHref: "tel:+66826356266",
  lineHref: "https://lin.ee/TQibLMD",
  email: "info@thekpiplus.com",
} as const;

export const AUDIT_RESPONSE_DAYS = 2;

export function isAuditFocus(value: string | null | undefined): value is AuditFocus {
  return Boolean(value && (AUDIT_FOCUS_VALUES as readonly string[]).includes(value));
}

export function isAuditRole(value: string | null | undefined): value is AuditRole {
  return Boolean(value && (AUDIT_ROLES as readonly string[]).includes(value));
}

export function parseAuditFocus(source: string | URLSearchParams | null | undefined): AuditFocus | undefined {
  if (!source) return undefined;
  if (typeof source === "string") {
    const fromQuery = source.match(/[?&]focus=([a-z]+)/i)?.[1];
    const fromHash = source.match(/#audit\?focus=([a-z]+)/i)?.[1];
    return isAuditFocus(fromQuery) ? fromQuery : isAuditFocus(fromHash) ? fromHash : undefined;
  }
  const value = source.get("focus");
  return isAuditFocus(value) ? value : undefined;
}

export function readUtm(search: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}
