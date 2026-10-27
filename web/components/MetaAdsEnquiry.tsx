import { EnquiryForm } from "@/components/EnquiryForm";
import { META_ENQUIRY_RECEIVE, metaEnquiryCopy } from "@/lib/meta-ads";
import type { CmsMetaAdsPage } from "@/lib/cms/meta-ads-page";
import type { Locale } from "@/lib/seo";

export function MetaAdsEnquiry({
  locale,
  helper,
  teamPhotoSrc,
}: {
  locale: Locale;
  helper?: CmsMetaAdsPage["form"];
  teamPhotoSrc?: string;
}) {
  const defaults = metaEnquiryCopy(locale);
  const receive = (helper?.receive?.length ? helper.receive : META_ENQUIRY_RECEIVE.map((item) => item.title)).map((title) => {
    const match = META_ENQUIRY_RECEIVE.find((item) => item.title === title);
    return {
      title,
      body: match ? (locale === "th" ? match.th : match.en) : undefined,
    };
  });

  return (
    <EnquiryForm
      locale={locale}
      service="meta_ads"
      sectionId="meta-ads-enquiry"
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
