import { ApproachView } from "@/components/ApproachView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/approach");

export default function Page() {
  return <ApproachView locale="zh" />;
}
