import { cache } from "react";
import { COMPANY, mergeCompany, type CompanyContact } from "./company";
import { companyFromContact, publicFieldsFromInput, seedInputFromCompany } from "@/lib/cms/contact";
import { contactCount, findPrimaryContact, insertContact } from "@/lib/cms/contact-store";
import { getSetting } from "@/lib/cms/queries";
import { parseSiteGlobals } from "./site-globals";

export type { SiteGlobalsValue } from "./site-globals";
export { parseSiteGlobals } from "./site-globals";

export async function ensurePrimaryContact() {
  const existing = await findPrimaryContact();
  if (existing) return existing;
  if ((await contactCount()) > 0) return findPrimaryContact();
  const globals = parseSiteGlobals((await getSetting("site"))?.value);
  const seed = seedInputFromCompany(mergeCompany(globals));
  return insertContact({
    ...publicFieldsFromInput(seed),
    adminNotes: "",
    isPrimary: true,
    sortOrder: 0,
  });
}

export const getPublicCompany = cache(async (): Promise<CompanyContact> => {
  try {
    await ensurePrimaryContact();
    const row = await findPrimaryContact();
    return row ? companyFromContact({ ...row, adminNotes: "" }) : COMPANY;
  } catch {
    try {
      const setting = await getSetting("site");
      return mergeCompany(parseSiteGlobals(setting?.value));
    } catch {
      return COMPANY;
    }
  }
});
