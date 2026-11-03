import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { solutionsIndexPublicMetadata } from "@/lib/cms/solutions-index-page-public";

export async function generateMetadata() {
  return solutionsIndexPublicMetadata("/en/solutions");
}

export default function Page() {
  return <SolutionsIndexView locale="en" />;
}
