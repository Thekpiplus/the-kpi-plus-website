import { cache } from "react";
import { getSetting } from "@/lib/cms/queries";
import { normalizeGtmContainerId, parseSiteGlobals } from "@/lib/site-globals";

/** Resolve the site-wide GTM container once for every page (CMS setting, then env fallback). */
export const getGtmContainerId = cache(async (): Promise<string> => {
  try {
    const fromCms = normalizeGtmContainerId(parseSiteGlobals((await getSetting("site"))?.value).gtmContainerId);
    if (fromCms) return fromCms;
  } catch {
    // DB may be unavailable during local boot — fall through to env.
  }
  return normalizeGtmContainerId(process.env.NEXT_PUBLIC_GTM_ID);
});
