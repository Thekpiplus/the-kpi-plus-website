import { B2bView } from "@/components/B2bView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/b2b-agent-sales");

export default function Page() {
  return <B2bView locale="zh" />;
}
