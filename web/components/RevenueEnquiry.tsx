import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function RevenueEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="revenue" sectionId="revenue-enquiry" />;
}
