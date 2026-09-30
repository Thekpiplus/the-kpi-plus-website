import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function HotelSystemsEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="hotel_systems" sectionId="hotel-systems-enquiry" />;
}
