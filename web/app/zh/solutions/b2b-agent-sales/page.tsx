import { B2bView } from "@/components/B2bView";
import { b2bPublicMetadata } from "@/lib/cms/b2b-page-public";

export async function generateMetadata() {
  return b2bPublicMetadata("/zh/solutions/b2b-agent-sales");
}

export default function Page() {
  return <B2bView locale="zh" />;
}
