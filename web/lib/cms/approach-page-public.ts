import {
  defaultApproachCms,
  isApproachCmsBody,
  localizeApproachPage,
  parseApproachPageBody,
  type ApproachPageCopy,
} from "./approach-page";
import { pageDocumentBySlug } from "./queries";
import { isCmsPageLive } from "./public";
import type { Locale } from "@/lib/seo";

export async function loadApproachPageCopy(locale: Locale): Promise<ApproachPageCopy> {
  try {
    const doc = await pageDocumentBySlug("approach", "th");
    if (doc && !doc.trashedAt && isCmsPageLive(doc) && isApproachCmsBody(doc.body)) {
      const parsed = parseApproachPageBody(doc.body);
      if (parsed) return localizeApproachPage(parsed, locale);
    }
  } catch {
    // Fall back to defaults when CMS is unavailable.
  }
  return localizeApproachPage(defaultApproachCms(), locale);
}
