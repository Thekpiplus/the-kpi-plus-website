import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions");

export default function SolutionsPage() {
  return <SolutionsIndexView locale="th" />;
}
