import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function B2bEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="b2b" sectionId="b2b-enquiry" />;
}
