import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function MetaAdsEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="meta_ads" sectionId="meta-ads-enquiry" />;
}
