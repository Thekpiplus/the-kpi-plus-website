import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function WebsiteEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="website" sectionId="website-enquiry" />;
}
