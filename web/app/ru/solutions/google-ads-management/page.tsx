import { GoogleAdsView } from "@/components/GoogleAdsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/google-ads-management");

export default function Page() {
  return <GoogleAdsView locale="ru" />;
}
