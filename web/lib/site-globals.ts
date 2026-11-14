import type { SiteContactOverrides } from "./company";

export type SiteGlobalsValue = {
  defaultOg?: string;
  siteLine?: string;
  canonicalHost?: string;
  /** Google Tag Manager container id, e.g. GTM-XXXXXXX — applied once to every public page. */
  gtmContainerId?: string;
  /** GA4 numeric Property ID (Admin → Property settings), used by CMS analytics reports. */
  ga4PropertyId?: string;
} & SiteContactOverrides;

export function normalizeGtmContainerId(raw: string | null | undefined): string {
  const value = String(raw ?? "").trim().toUpperCase();
  if (!value) return "";
  const match = value.match(/^(?:GTM-)?([A-Z0-9]+)$/);
  if (!match) return "";
  return `GTM-${match[1]}`;
}

export function normalizeGa4PropertyId(raw: string | null | undefined): string {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  const match = value.match(/^(?:properties\/)?(\d{5,12})$/i);
  return match?.[1] ?? "";
}

export function parseSiteGlobals(raw: string | null | undefined): SiteGlobalsValue {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as SiteGlobalsValue;
    if (!parsed || typeof parsed !== "object") return {};
    return {
      ...parsed,
      gtmContainerId: normalizeGtmContainerId(parsed.gtmContainerId),
      ga4PropertyId: normalizeGa4PropertyId(parsed.ga4PropertyId),
    };
  } catch {
    return {};
  }
}
