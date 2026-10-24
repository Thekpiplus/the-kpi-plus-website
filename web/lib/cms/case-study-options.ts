import { insightPosts, isPublishedInsight } from "@/lib/insights";
import type { CaseStudyRelatedOption } from "./case-studies";
import { listDocuments } from "./queries";

export type { CaseStudyRelatedOption };

export async function relatedArticleOptions(excludeSlug?: string): Promise<CaseStudyRelatedOption[]> {
  const [docs, { listCaseStudyRows }] = await Promise.all([
    listDocuments("insight"),
    import("./case-study-store"),
  ]);
  const studies = await listCaseStudyRows();
  const fromCms = docs.map((doc) => ({
    id: doc.slug,
    slug: doc.slug,
    title: doc.title,
    kind: "insight" as const,
  }));
  const cmsSlugs = new Set(fromCms.map((item) => item.slug));
  const fromSeed = insightPosts
    .filter((post) => isPublishedInsight(post) && !cmsSlugs.has(post.slug))
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title.th || post.title.en,
      kind: "insight" as const,
    }));
  const caseOptions = studies
    .filter((row) => row.slug && row.slug !== excludeSlug)
    .map((row) => ({
      id: row.slug,
      slug: row.slug,
      title: row.title || row.slug,
      kind: "case-study" as const,
    }));
  return [...fromCms, ...fromSeed, ...caseOptions].sort((a, b) => a.title.localeCompare(b.title, "th"));
}
