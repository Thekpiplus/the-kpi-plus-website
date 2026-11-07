import { defaultContactCms, isContactCmsBody, localizeContactPage, parseContactPageBody, type ContactPageCopy } from "./contact-page";
import { pageDocumentBySlug } from "./queries";
import { isCmsPageLive } from "./public";
import type { Locale } from "@/lib/seo";

export async function loadContactPageCopy(locale: Locale): Promise<ContactPageCopy> {
  try {
    const doc = await pageDocumentBySlug("contact-us", "th");
    if (doc && !doc.trashedAt && isCmsPageLive(doc) && isContactCmsBody(doc.body)) {
      const parsed = parseContactPageBody(doc.body);
      if (parsed) return localizeContactPage(parsed, locale);
    }
  } catch {
    // Fall back to defaults when CMS is unavailable.
  }
  return localizeContactPage(defaultContactCms(), locale);
}
