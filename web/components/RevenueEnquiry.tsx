import { EnquiryForm } from "@/components/EnquiryForm";
import type { RevenuePublicForm } from "@/lib/cms/revenue-page-public";
import { consultantVisualUrl } from "@/lib/revenue";
import type { Locale } from "@/lib/seo";

export function RevenueEnquiry({ locale, helper }: { locale: Locale; helper?: RevenuePublicForm }) {
  return (
    <EnquiryForm
      locale={locale}
      service="revenue"
      sectionId="revenue-enquiry"
      consultantImageSrc={consultantVisualUrl()}
      kicker={helper?.kicker}
      title={helper?.heading}
      body={helper?.lead}
      introNextTitle={helper?.nextTitle}
      introSteps={helper?.steps}
      introTrust={helper?.trust}
    />
  );
}
