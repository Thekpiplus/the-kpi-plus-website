import type { SiteContactOverrides } from "./company";

export type SiteGlobalsValue = {
  defaultOg?: string;
  siteLine?: string;
  canonicalHost?: string;
} & SiteContactOverrides;

export function parseSiteGlobals(raw: string | null | undefined): SiteGlobalsValue {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as SiteGlobalsValue;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
