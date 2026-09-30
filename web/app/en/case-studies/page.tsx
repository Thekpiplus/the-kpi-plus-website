import { CaseStudiesView } from "@/components/CaseStudiesView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/case-studies");

export default function Page() {
  return <CaseStudiesView locale="en" />;
}
