import { PrivacyNoticeView } from "@/components/PrivacyNoticeView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/privacy");

export default function Page() {
  return <PrivacyNoticeView locale="th" route="/privacy" />;
}
