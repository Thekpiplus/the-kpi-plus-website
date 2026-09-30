import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function IndependentHotelEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="independent_hotel" sectionId="independent-hotel-enquiry" />;
}
