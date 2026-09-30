import { B2bView } from "@/components/B2bView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/b2b-agent-sales");

export default function B2bPage() {
  return <B2bView locale="th" />;
}
