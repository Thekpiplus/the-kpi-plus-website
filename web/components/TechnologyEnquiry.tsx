import { EnquiryForm } from "@/components/EnquiryForm";
import type { CmsHotelAiPage } from "@/lib/cms/hotel-ai-page";
import { HOTEL_AI_ENQUIRY_GOALS, hotelAiEnquiryCopy } from "@/lib/hotel-ai";
import type { Locale } from "@/lib/seo";

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function TechnologyEnquiry({
  locale,
  helper,
}: {
  locale: Locale;
  helper?: CmsHotelAiPage["form"];
}) {
  const defaults = hotelAiEnquiryCopy(locale);
  const useHelper = Boolean(helper && (locale === "th" || !looksThai(helper.title || helper.body || "")));
  const helperLabels = helper?.labels;
  const helperLabelsMismatch = Boolean(
    helperLabels?.name && (locale === "th" ? !looksThai(helperLabels.name) : looksThai(helperLabels.name)),
  );
  const labels = {
    ...defaults.labels,
    ...(useHelper && helperLabels && !helperLabelsMismatch ? helperLabels : {}),
  };
  const steps =
    useHelper && helper?.steps.length
      ? helper.steps.map((item) => (locale === "th" ? item.th : item.en)).filter(Boolean)
      : defaults.steps;

  return (
    <EnquiryForm
      locale={locale}
      service="technology"
      sectionId="technology-enquiry"
      kicker={useHelper && helper?.kicker.trim() ? helper.kicker : defaults.kicker}
      title={useHelper && helper?.title.trim() ? helper.title : defaults.heading}
      body={useHelper && helper?.body.trim() ? helper.body : defaults.lead}
      submitLabel={useHelper && helper?.submit.trim() ? helper.submit : defaults.submit}
      introNextTitle={useHelper && helper?.nextTitle.trim() ? helper.nextTitle : defaults.nextTitle}
      introSteps={steps}
      introNote={useHelper && helper?.note.trim() ? helper.note : defaults.note}
      goalOptions={
        useHelper && helper?.goals?.length
          ? helper.goals.map((item) => ({ id: item.id, th: item.th, en: item.en }))
          : [...HOTEL_AI_ENQUIRY_GOALS]
      }
      fieldLabels={{
        name: labels.name,
        role: labels.role,
        business: labels.business,
        workflow: labels.workflow,
        workflowHint: labels.workflowHint,
        workload: labels.workload,
        systems: labels.systems,
        systemsHint: labels.systemsHint,
        goal: labels.goal,
        contact: labels.contact,
        consent: labels.consent,
        privacy: labels.privacy,
        optional: labels.optional,
        required: labels.required,
      }}
    />
  );
}
