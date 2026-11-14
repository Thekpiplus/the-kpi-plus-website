import type { SiteContactOverrides } from "./company";

export type SiteGlobalsValue = {
  defaultOg?: string;
  siteLine?: string;
  canonicalHost?: string;
  /** Google Tag Manager container id, e.g. GTM-XXXXXXX — applied once to every public page. */
  gtmContainerId?: string;
} & SiteContactOverrides;

export function normalizeGtmContainerId(raw: string | null | undefined): string {
  const value = String(raw ?? "").trim().toUpperCase();
  if (!value) return "";
  const match = value.match(/^(?:GTM-)?([A-Z0-9]+)$/);
  if (!match) return "";
  return `GTM-${match[1]}`;
}

export function parseSiteGlobals(raw: string | null | undefined): SiteGlobalsValue {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as SiteGlobalsValue;
    if (!parsed || typeof parsed !== "object") return {};
    return {
      ...parsed,
      gtmContainerId: normalizeGtmContainerId(parsed.gtmContainerId),
    };
  } catch {
    return {};
  }
}
