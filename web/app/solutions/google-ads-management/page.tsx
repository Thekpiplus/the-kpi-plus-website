import { GoogleAdsView } from "@/components/GoogleAdsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/google-ads-management");

export default function GoogleAdsPage() {
  return <GoogleAdsView locale="th" />;
}
