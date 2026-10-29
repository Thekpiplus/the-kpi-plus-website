import { EnquiryForm } from "@/components/EnquiryForm";
import type { CmsIndependentPage } from "@/lib/cms/independent-hotel-page";
import { INDEPENDENT_ENQUIRY_RECEIVE, independentEnquiryCopy } from "@/lib/independent-hotel";
import type { Locale } from "@/lib/seo";

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function IndependentHotelEnquiry({
  locale,
  visualSrc,
  helper,
}: {
  locale: Locale;
  visualSrc?: string;
  helper?: CmsIndependentPage["form"];
}) {
  const defaults = independentEnquiryCopy(locale);
  const useHelper = Boolean(helper && (locale === "th" || !looksThai(helper.title || helper.body || "")));
  const receive =
    useHelper && helper?.receive.length
      ? helper.receive.map((item) => ({
          title: item.title || (locale === "th" ? item.th : item.en),
          body: locale === "th" ? item.th : item.en,
        }))
      : INDEPENDENT_ENQUIRY_RECEIVE.map((item) => ({
          title: item.title,
          body: locale === "th" ? item.th : item.en,
        }));
  const steps =
    useHelper && helper?.steps.length
      ? helper.steps.map((item) => (locale === "th" ? item.th : item.en)).filter(Boolean)
      : defaults.steps;
  const labels = useHelper && helper ? helper.labels : defaults.labels;

  return (
    <EnquiryForm
      locale={locale}
      service="independent_hotel"
      sectionId="independent-hotel-enquiry"
      kicker={useHelper && helper?.kicker.trim() ? helper.kicker : defaults.kicker}
      title={useHelper && helper?.title.trim() ? helper.title : defaults.heading}
      body={useHelper && helper?.body.trim() ? helper.body : defaults.lead}
      submitLabel={useHelper && helper?.submit.trim() ? helper.submit : defaults.submit}
      introReceiveTitle={useHelper && helper?.receiveTitle.trim() ? helper.receiveTitle : defaults.receiveTitle}
      introReceive={receive}
      introNextTitle={useHelper && helper?.nextTitle.trim() ? helper.nextTitle : defaults.nextTitle}
      introSteps={steps}
      introVisualSrc={visualSrc}
      fieldLabels={{
        name: labels.name,
        business: labels.business,
        contact: labels.contact,
        rooms: labels.rooms,
        hotelStatus: labels.hotelStatus,
        challenge: labels.challenge,
        teamSize: labels.teamSize,
        website: labels.website,
        systems: labels.systems,
        goal: labels.goal,
        message: labels.message,
        consent: labels.consent,
        privacy: labels.privacy,
      }}
    />
  );
}
