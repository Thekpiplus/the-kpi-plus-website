import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function SeoLocalEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="search" sectionId="search-enquiry" />;
}
