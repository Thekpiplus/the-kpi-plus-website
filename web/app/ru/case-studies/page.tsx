import { CaseStudiesView } from "@/components/CaseStudiesView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/case-studies");

export default function Page() {
  return <CaseStudiesView locale="ru" />;
}
