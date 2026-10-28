import { EnquiryForm } from "@/components/EnquiryForm";
import { WEBSITE_ENQUIRY_RECEIVE, websiteEnquiryCopy } from "@/lib/hotel-website";
import type { CmsHotelWebsitePage } from "@/lib/cms/hotel-website-page";
import type { Locale } from "@/lib/seo";

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function WebsiteEnquiry({
  locale,
  helper,
}: {
  locale: Locale;
  helper?: CmsHotelWebsitePage["form"];
}) {
  const defaults = websiteEnquiryCopy(locale);
  const useHelper = Boolean(helper && (locale === "th" || !looksThai(helper.title || helper.body || "")));
  const receive =
    useHelper && helper?.receive.length
      ? helper.receive.map((item) => ({
          title: item.title.trim() || item.label.trim(),
          body: item.body,
        }))
      : WEBSITE_ENQUIRY_RECEIVE.map((item) => ({
          title: item.title,
          body: locale === "th" ? item.th : item.en,
        }));

  return (
    <EnquiryForm
      locale={locale}
      service="website"
      sectionId="website-enquiry"
      kicker={useHelper && helper?.kicker.trim() ? helper.kicker : defaults.kicker}
      title={useHelper && helper?.title.trim() ? helper.title : defaults.heading}
      body={useHelper && helper?.body.trim() ? helper.body : defaults.lead}
      submitLabel={useHelper && helper?.submit.trim() ? helper.submit : defaults.submit}
      introReceiveTitle={useHelper && helper?.receiveTitle.trim() ? helper.receiveTitle : defaults.receiveTitle}
      introReceive={receive}
      introNextTitle={useHelper && helper?.nextTitle.trim() ? helper.nextTitle : defaults.nextTitle}
      introSteps={useHelper && helper?.steps.length ? helper.steps : defaults.steps}
      fieldLabels={{
        name: useHelper ? helper?.labels.name : defaults.labels.name,
        business: useHelper ? helper?.labels.business : defaults.labels.business,
        contact: useHelper ? helper?.labels.contact : defaults.labels.contact,
        website: useHelper ? helper?.labels.website : defaults.fields.website,
        bookingEngine: useHelper ? helper?.labels.bookingEngine : defaults.fields.bookingEngine,
        cms: useHelper ? helper?.labels.cms : defaults.fields.cms,
        goal: useHelper ? helper?.labels.goal : defaults.fields.goal,
        challenge: useHelper ? helper?.labels.challenge : defaults.fields.challenge,
        timeline: useHelper ? helper?.labels.timeline : defaults.fields.timeline,
        consent: useHelper ? helper?.labels.consent : defaults.labels.consent,
        privacy: useHelper ? helper?.labels.privacy : defaults.labels.privacy,
      }}
    />
  );
}
