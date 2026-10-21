import { cache } from "react";
import { COMPANY, mergeCompany, type CompanyContact, type SiteContactOverrides } from "./company";
import { getSetting } from "@/lib/cms/queries";

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

export const getPublicCompany = cache(async (): Promise<CompanyContact> => {
  try {
    const row = await getSetting("site");
    return mergeCompany(parseSiteGlobals(row?.value));
  } catch {
    return COMPANY;
  }
});
