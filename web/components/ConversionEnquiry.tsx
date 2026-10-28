import { EnquiryForm } from "@/components/EnquiryForm";
import { DIRECT_BOOKING_ENQUIRY_RECEIVE, directBookingEnquiryCopy } from "@/lib/direct-bookings";
import type { CmsDirectBookingPage } from "@/lib/cms/hotel-direct-bookings-page";
import type { Locale } from "@/lib/seo";

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function ConversionEnquiry({
  locale,
  visualSrc,
  helper,
}: {
  locale: Locale;
  visualSrc?: string;
  helper?: CmsDirectBookingPage["form"];
}) {
  const defaults = directBookingEnquiryCopy(locale);
  const useHelper = Boolean(helper && (locale === "th" || !looksThai(helper.title || helper.body || "")));
  const receive =
    useHelper && helper?.receive.length
      ? helper.receive.map((item) => ({
          title: item.title,
          body: item.body,
        }))
      : DIRECT_BOOKING_ENQUIRY_RECEIVE.map((item) => ({
          title: item.title,
          body: locale === "th" ? item.th : item.en,
        }));

  return (
    <EnquiryForm
      locale={locale}
      service="conversion"
      sectionId="conversion-enquiry"
      kicker={useHelper && helper?.kicker.trim() ? helper.kicker : defaults.kicker}
      title={useHelper && helper?.title.trim() ? helper.title : defaults.heading}
      body={useHelper && helper?.body.trim() ? helper.body : defaults.lead}
      submitLabel={useHelper && helper?.submit.trim() ? helper.submit : defaults.submit}
      introReceiveTitle={useHelper && helper?.receiveTitle.trim() ? helper.receiveTitle : defaults.receiveTitle}
      introReceive={receive}
      introNextTitle={
        useHelper && helper?.nextTitle.trim() && !(locale === "th" && !looksThai(helper.nextTitle))
          ? helper.nextTitle
          : defaults.nextTitle
      }
      introSteps={useHelper && helper?.steps.length ? helper.steps : defaults.steps}
      introVisualSrc={visualSrc}
      fieldLabels={{
        name: useHelper ? helper?.labels.name : defaults.labels.name,
        business: useHelper ? helper?.labels.business : defaults.labels.business,
        contact: useHelper ? helper?.labels.contact : defaults.labels.contact,
        website: useHelper ? helper?.labels.website : defaults.fields.website,
        bookingEngine: useHelper ? helper?.labels.bookingEngine : defaults.fields.bookingEngine,
        goal: useHelper ? helper?.labels.goal : defaults.fields.goal,
        analyticsStatus: useHelper ? helper?.labels.analytics : defaults.fields.analytics,
        trackingStatus: useHelper ? helper?.labels.tracking : defaults.fields.tracking,
        challenge: useHelper ? helper?.labels.challenge : defaults.fields.concern,
        consent: useHelper ? helper?.labels.consent : defaults.labels.consent,
        privacy: useHelper ? helper?.labels.privacy : defaults.labels.privacy,
      }}
    />
  );
}
