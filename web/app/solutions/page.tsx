import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { solutionsIndexPublicMetadata } from "@/lib/cms/solutions-index-page-public";

export async function generateMetadata() {
  return solutionsIndexPublicMetadata("/solutions");
}

export default function SolutionsPage() {
  return <SolutionsIndexView locale="th" />;
}
