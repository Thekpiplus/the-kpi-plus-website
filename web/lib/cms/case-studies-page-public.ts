import {
  defaultCaseStudiesCms,
  isCaseStudiesCmsBody,
  localizeCaseStudiesPage,
  parseCaseStudiesPageBody,
  type CaseStudiesPageCopy,
} from "./case-studies-page";
import { pageDocumentBySlug } from "./queries";
import { isCmsPageLive } from "./public";
import type { Locale } from "@/lib/seo";

export async function loadCaseStudiesPageCopy(locale: Locale): Promise<CaseStudiesPageCopy> {
  try {
    const doc = await pageDocumentBySlug("case-studies", "th");
    if (doc && !doc.trashedAt && isCmsPageLive(doc) && isCaseStudiesCmsBody(doc.body)) {
      const parsed = parseCaseStudiesPageBody(doc.body);
      if (parsed) return localizeCaseStudiesPage(parsed, locale);
    }
  } catch {
    // Fall back to defaults when CMS is unavailable.
  }
  return localizeCaseStudiesPage(defaultCaseStudiesCms(), locale);
}
