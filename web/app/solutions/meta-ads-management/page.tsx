import { MetaAdsView } from "@/components/MetaAdsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/meta-ads-management");

export default function MetaAdsPage() {
  return <MetaAdsView locale="th" />;
}
