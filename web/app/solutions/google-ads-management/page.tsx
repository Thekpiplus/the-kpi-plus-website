import { GoogleAdsView } from "@/components/GoogleAdsView";
import { googleAdsPublicMetadata } from "@/lib/cms/google-ads-page-public";

export async function generateMetadata() {
  return googleAdsPublicMetadata("/solutions/google-ads-management");
}

export default function GoogleAdsPage() {
  return <GoogleAdsView locale="th" />;
}
