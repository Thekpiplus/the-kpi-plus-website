import { CaseStudyDetailView } from "@/components/CaseStudyDetailView";
import { caseStudyMetadata, caseStudySlugs } from "@/lib/case-studies";

type Params = { slug: string };

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return caseStudyMetadata(slug, "en");
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <CaseStudyDetailView locale="en" slug={slug} />;
}
