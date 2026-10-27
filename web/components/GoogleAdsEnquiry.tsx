import { EnquiryForm } from "@/components/EnquiryForm";
import { ADS_ENQUIRY_RECEIVE, adsEnquiryCopy } from "@/lib/google-ads";
import type { CmsGoogleAdsPage } from "@/lib/cms/google-ads-page";
import type { Locale } from "@/lib/seo";

export function GoogleAdsEnquiry({
  locale,
  helper,
  teamPhotoSrc,
}: {
  locale: Locale;
  helper?: CmsGoogleAdsPage["form"];
  teamPhotoSrc?: string;
}) {
  const defaults = adsEnquiryCopy(locale);
  const receive = (helper?.receive?.length ? helper.receive : ADS_ENQUIRY_RECEIVE.map((item) => item.title)).map((title) => {
    const match = ADS_ENQUIRY_RECEIVE.find((item) => item.title === title);
    return {
      title,
      body: match ? (locale === "th" ? match.th : match.en) : undefined,
    };
  });

  return (
    <EnquiryForm
      locale={locale}
      service="google_ads"
      sectionId="google-ads-enquiry"
      kicker={helper?.kicker || defaults.kicker}
      title={helper?.heading || defaults.heading}
      body={helper?.lead || defaults.lead}
      submitLabel={helper?.submit || defaults.submit}
      introReceiveTitle={helper?.receiveTitle || defaults.receiveTitle}
      introReceive={receive}
      introNextTitle={helper?.nextTitle || defaults.nextTitle}
      introSteps={helper?.steps?.length ? helper.steps : defaults.steps}
      consultantImageSrc={teamPhotoSrc}
      consultantImageAlt={helper ? (locale === "th" ? helper.visual.altTh : helper.visual.altEn) : undefined}
      fieldLabels={helper?.labels}
    />
  );
}
