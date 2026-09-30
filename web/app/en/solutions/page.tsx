import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/solutions");

export default function Page() {
  return <SolutionsIndexView locale="en" />;
}
