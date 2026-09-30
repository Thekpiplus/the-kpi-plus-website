import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function ReservationsEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="reservations" sectionId="reservations-enquiry" />;
}
