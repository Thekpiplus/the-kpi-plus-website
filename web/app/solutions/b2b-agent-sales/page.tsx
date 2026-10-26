import { B2bView } from "@/components/B2bView";
import { b2bPublicMetadata } from "@/lib/cms/b2b-page-public";

export async function generateMetadata() {
  return b2bPublicMetadata("/solutions/b2b-agent-sales");
}

export default function B2bPage() {
  return <B2bView locale="th" />;
}
