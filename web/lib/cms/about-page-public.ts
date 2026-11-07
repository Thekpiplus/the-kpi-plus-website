import {
  defaultAboutCms,
  isAboutCmsBody,
  localizeAboutPage,
  parseAboutPageBody,
  type AboutPageCopy,
} from "./about-page";
import { pageDocumentBySlug } from "./queries";
import { isCmsPageLive } from "./public";
import type { Locale } from "@/lib/seo";

export async function loadAboutPageCopy(locale: Locale): Promise<AboutPageCopy> {
  try {
    const doc =
      (await pageDocumentBySlug("about-us", "th")) || (await pageDocumentBySlug("about", "th"));
    if (doc && !doc.trashedAt && isCmsPageLive(doc) && isAboutCmsBody(doc.body)) {
      const parsed = parseAboutPageBody(doc.body);
      if (parsed) return localizeAboutPage(parsed, locale);
    }
  } catch {
    // Fall back to defaults when CMS is unavailable.
  }
  return localizeAboutPage(defaultAboutCms(), locale);
}
