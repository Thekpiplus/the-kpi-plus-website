import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function GoogleAdsEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="google_ads" sectionId="google-ads-enquiry" />;
}
