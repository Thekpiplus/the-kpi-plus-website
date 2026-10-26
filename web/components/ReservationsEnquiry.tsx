import { EnquiryForm } from "@/components/EnquiryForm";
import type { ReservationsPublicForm } from "@/lib/cms/reservations-page-public";
import type { Locale } from "@/lib/seo";

export function ReservationsEnquiry({
  locale,
  teamPhotoSrc,
  helper,
}: {
  locale: Locale;
  teamPhotoSrc?: string;
  helper?: ReservationsPublicForm;
}) {
  return (
    <EnquiryForm
      locale={locale}
      service="reservations"
      sectionId="reservations-enquiry"
      consultantImageSrc={teamPhotoSrc}
      consultantImageAlt={helper ? (locale === "th" ? helper.visual.altTh : helper.visual.altEn) : undefined}
      kicker={helper?.kicker || undefined}
      title={helper?.heading || undefined}
      body={helper?.lead || undefined}
      submitLabel={helper?.submit || undefined}
      introNextTitle={helper?.nextTitle || undefined}
      introSteps={helper?.steps}
      introTrust={helper?.trust}
    />
  );
}
