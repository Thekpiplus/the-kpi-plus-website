import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function TechnologyEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="technology" sectionId="technology-enquiry" />;
}
