import { ApproachView } from "@/components/ApproachView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/approach");

export default function Page() {
  return <ApproachView locale="en" />;
}
