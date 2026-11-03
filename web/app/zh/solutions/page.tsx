import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { solutionsIndexPublicMetadata } from "@/lib/cms/solutions-index-page-public";

export async function generateMetadata() {
  return solutionsIndexPublicMetadata("/zh/solutions");
}

export default function Page() {
  return <SolutionsIndexView locale="zh" />;
}
