import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function ConversionEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="conversion" sectionId="conversion-enquiry" />;
}
