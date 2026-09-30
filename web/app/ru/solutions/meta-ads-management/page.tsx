import { MetaAdsView } from "@/components/MetaAdsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/meta-ads-management");

export default function Page() {
  return <MetaAdsView locale="ru" />;
}
