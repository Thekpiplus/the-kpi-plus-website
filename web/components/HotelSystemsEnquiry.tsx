import { EnquiryForm } from "@/components/EnquiryForm";
import type { CmsSystemsPage } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_ENQUIRY_RECEIVE,
  hotelSystemsEnquiryCopy,
  systemsEnquiryReceiveAreStale,
  systemsEnquiryStepsAreStale,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function HotelSystemsEnquiry({
  locale,
  visualSrc,
  helper,
}: {
  locale: Locale;
  visualSrc?: string;
  helper?: CmsSystemsPage["form"];
}) {
  const defaults = hotelSystemsEnquiryCopy(locale);
  const useHelper = Boolean(helper && (locale === "th" || !looksThai(helper.title || helper.body || "")));
  const receive =
    useHelper && helper?.receive.length && !systemsEnquiryReceiveAreStale(helper.receive)
      ? helper.receive.map((item) => ({
          title: item.title || (locale === "th" ? item.th : item.en),
          body: locale === "th" ? item.th : item.en,
        }))
      : SYSTEMS_ENQUIRY_RECEIVE.map((item) => ({
          title: item.title,
          body: locale === "th" ? item.th : item.en,
        }));
  const steps =
    useHelper && helper?.steps.length && !systemsEnquiryStepsAreStale(helper.steps)
      ? helper.steps.map((item) => (locale === "th" ? item.th : item.en)).filter(Boolean)
      : defaults.steps;
  const labels = useHelper && helper ? helper.labels : defaults.labels;
  const staleTitle = !/และข้อมูล|and data/i.test(helper?.title || "");
  const staleBody = /ทีมจะช่วยดูว่าควรเริ่มจากจุดไหนก่อน|The team can help see where to start/.test(helper?.body || "");
  const staleSubmit = /ให้ทีมตรวจโครงสร้างระบบโรงแรม|Ask the team to review the hotel system setup|ส่งข้อความถึงทีม|Send to the team/.test(
    helper?.submit || "",
  );
  const staleReceiveTitle = !/งานนำไปใช้|implementation conversation/i.test(helper?.receiveTitle || "");

  return (
    <EnquiryForm
      locale={locale}
      service="hotel_systems"
      sectionId="hotel-systems-enquiry"
      kicker={useHelper && helper?.kicker.trim() ? helper.kicker : defaults.kicker}
      title={useHelper && helper?.title.trim() && !staleTitle ? helper.title : defaults.heading}
      body={useHelper && helper?.body.trim() && !staleBody ? helper.body : defaults.lead}
      submitLabel={useHelper && helper?.submit.trim() && !staleSubmit ? helper.submit : defaults.submit}
      introReceiveTitle={useHelper && helper?.receiveTitle.trim() && !staleReceiveTitle ? helper.receiveTitle : defaults.receiveTitle}
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
        challenge: labels.challenge || labels.message,
        teamSize: labels.teamSize,
        website: labels.website,
        pms: labels.pms,
        channelManager: labels.channelManager,
        bookingEngine: labels.bookingEngine,
        systems: labels.systems,
        providerContact: labels.providerContact,
        goal: labels.goal,
        message: labels.message || labels.challenge,
        consent: labels.consent,
        privacy: labels.privacy,
      }}
    />
  );
}
