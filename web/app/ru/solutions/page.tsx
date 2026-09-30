import { SolutionsIndexView } from "@/components/SolutionsIndexView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions");

export default function Page() {
  return <SolutionsIndexView locale="ru" />;
}
