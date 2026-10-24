import { cache } from "react";
import { localizePath, metadataFor, pageByRoute, SITE, type Locale } from "@/lib/seo";
import {
  caseStudies,
  caseStudySlugs,
  getCaseStudy as seedGetCaseStudy,
  publishedCaseStudies as seedPublishedCaseStudies,
  type CaseStudy,
} from "@/lib/case-studies";
import { isPubliclyVisible, toPublicCaseStudy } from "./case-studies";
import {
  caseStudyCount,
  findCaseStudy,
  findCaseStudyBySlug,
  listPublishedCaseStudyRows,
} from "./case-study-store";

export const loadPublishedCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  try {
    const rows = await listPublishedCaseStudyRows();
    return rows.map((row) => toPublicCaseStudy(row)).filter((study): study is CaseStudy => Boolean(study));
  } catch {
    return seedPublishedCaseStudies();
  }
});

export const loadPublishedCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
  try {
    const row = await findCaseStudyBySlug(slug);
    if (row) {
      if (row.trashedAt) return null;
      return toPublicCaseStudy(row);
    }
    const count = await caseStudyCount();
    if (count > 0) return null;
  } catch {
    // Fall back below when the CMS table is unavailable.
  }
  return seedGetCaseStudy(slug);
});

export async function publishedCaseStudyParamSlugs() {
  try {
    const rows = await listPublishedCaseStudyRows();
    return rows.map((row) => row.slug);
  } catch {
    return caseStudySlugs;
  }
}

export async function loadCaseStudyPreview(id: string): Promise<CaseStudy | null> {
  try {
    const row = await findCaseStudy(id);
    if (!row || row.trashedAt) return null;
    return toPublicCaseStudy(row, { preview: true });
  } catch {
    return caseStudies.find((study) => study.id === id) ?? null;
  }
}

export async function loadRelatedCaseStudies(study: CaseStudy) {
  const all = await loadPublishedCaseStudies();
  const ids = study.relatedArticleIds ?? [];
  if (ids.length) {
    const set = new Set(ids);
    const picked = all.filter((item) => item.slug !== study.slug && (set.has(item.id) || set.has(item.slug)));
    if (picked.length) return picked;
  }
  return all.filter((item) => item.slug !== study.slug);
}

export async function caseStudyPageMetadata(slug: string, locale: Locale) {
  const study = await loadPublishedCaseStudy(slug);
  if (!study) return {};
  const route = localizePath(`/case-studies/${slug}`, locale);
  if (pageByRoute.has(route)) return metadataFor(route);

  const brand = locale === "th" ? "เดอะ เคพีไอ พลัส" : "The KPI Plus";
  const title = `${study.seoTitle?.trim() || study.title} | ${brand}`;
  const description = study.metaDescription?.trim() || study.shortDescription;
  const canonical = `${SITE}${route}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE}/en/case-studies/${slug}`,
        th: `${SITE}/case-studies/${slug}`,
        zh: `${SITE}/zh/case-studies/${slug}`,
        ru: `${SITE}/ru/case-studies/${slug}`,
        "x-default": `${SITE}/case-studies/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article" as const,
    },
  };
}

export { isPubliclyVisible };
