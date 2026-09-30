import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions");

export default function Page() {
  return <SolutionsIndexView locale="zh" />;
}
