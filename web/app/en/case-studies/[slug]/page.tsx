import { CaseStudyDetailView } from "@/components/CaseStudyDetailView";
import { caseStudyPageMetadata, publishedCaseStudyParamSlugs } from "@/lib/cms/case-study-public";

type Params = { slug: string };

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await publishedCaseStudyParamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return caseStudyPageMetadata(slug, "en");
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <CaseStudyDetailView locale="en" slug={slug} />;
}
