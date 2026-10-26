import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function ReservationsEnquiry({
  locale,
  teamPhotoSrc,
}: {
  locale: Locale;
  teamPhotoSrc?: string;
}) {
  return (
    <EnquiryForm
      locale={locale}
      service="reservations"
      sectionId="reservations-enquiry"
      consultantImageSrc={teamPhotoSrc}
    />
  );
}
