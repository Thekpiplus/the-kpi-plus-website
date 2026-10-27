import { EnquiryForm } from "@/components/EnquiryForm";
import { B2B_ENQUIRY } from "@/lib/b2b";
import type { CmsB2bPage } from "@/lib/cms/b2b-page";
import type { Locale } from "@/lib/seo";

export function B2bEnquiry({
  locale,
  helper,
  teamPhotoSrc,
}: {
  locale: Locale;
  helper?: CmsB2bPage["form"];
  teamPhotoSrc?: string;
}) {
  const receive = (helper?.receive?.length ? helper.receive : B2B_ENQUIRY.receive.map((item) => item.title)).map(
    (title) => {
      const match = B2B_ENQUIRY.receive.find((item) => item.title === title);
      return {
        title,
        body: match ? (locale === "th" ? match.th : match.en) : undefined,
      };
    },
  );

  return (
    <EnquiryForm
      locale={locale}
      service="b2b"
      sectionId="b2b-enquiry"
      kicker={helper?.kicker || undefined}
      title={helper?.heading || undefined}
      body={helper?.lead || undefined}
      submitLabel={helper?.submit || undefined}
      introReceiveTitle={helper?.receiveTitle || undefined}
      introReceive={receive}
      introNextTitle={helper?.nextTitle || undefined}
      introSteps={helper?.steps}
      consultantImageSrc={teamPhotoSrc}
      consultantImageAlt={helper ? (locale === "th" ? helper.visual.altTh : helper.visual.altEn) : undefined}
    />
  );
}
