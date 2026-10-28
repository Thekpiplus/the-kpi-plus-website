import { EnquiryForm } from "@/components/EnquiryForm";
import { HOTEL_SEO_ENQUIRY_RECEIVE, hotelSeoEnquiryCopy } from "@/lib/hotel-seo";
import type { CmsHotelSeoPage } from "@/lib/cms/hotel-seo-page";
import type { Locale } from "@/lib/seo";

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function SeoLocalEnquiry({
  locale,
  helper,
  teamPhotoSrc,
}: {
  locale: Locale;
  helper?: CmsHotelSeoPage["form"];
  teamPhotoSrc?: string;
}) {
  const defaults = hotelSeoEnquiryCopy(locale);
  const useHelper = Boolean(helper && (locale === "th" || !looksThai(helper.heading || helper.lead || "")));
  const receive = useHelper && helper?.receive.length
    ? helper.receive.map((item) => ({ title: item.title, body: item.body }))
    : HOTEL_SEO_ENQUIRY_RECEIVE.map((item) => ({
        title: item.title,
        body: locale === "th" ? item.th : item.en,
      }));

  return (
    <EnquiryForm
      locale={locale}
      service="search"
      sectionId="search-enquiry"
      kicker={useHelper && helper?.kicker.trim() ? helper.kicker : defaults.kicker}
      title={useHelper && helper?.heading.trim() ? helper.heading : defaults.heading}
      body={
        useHelper && helper?.lead.trim()
          ? [helper.lead, helper.note.trim()].filter(Boolean).join("\n\n")
          : defaults.lead
      }
      submitLabel={useHelper && helper?.submit.trim() ? helper.submit : defaults.submit}
      introReceiveTitle={useHelper && helper?.receiveTitle.trim() ? helper.receiveTitle : defaults.receiveTitle}
      introReceive={receive}
      introNextTitle={useHelper && helper?.nextTitle.trim() ? helper.nextTitle : defaults.nextTitle}
      introSteps={useHelper && helper?.steps.length ? helper.steps : defaults.steps}
      consultantImageSrc={teamPhotoSrc}
      consultantImageAlt={helper ? (locale === "th" ? helper.visual.altTh : helper.visual.altEn) : undefined}
      fieldLabels={{
        name: useHelper ? helper?.labels.name : defaults.labels.name,
        business: useHelper ? helper?.labels.business : defaults.labels.business,
        contact: useHelper ? helper?.labels.contact : defaults.labels.contact,
        website: useHelper ? helper?.labels.website : defaults.fields.website,
        mapsUrl: useHelper ? helper?.labels.maps : defaults.fields.maps,
        issue: useHelper ? helper?.labels.issue : defaults.fields.issue,
        outcome: useHelper ? helper?.labels.outcome : defaults.fields.outcome,
        consent: useHelper ? helper?.labels.consent : defaults.labels.consent,
        privacy: useHelper ? helper?.labels.privacy : defaults.labels.privacy,
      }}
    />
  );
}
