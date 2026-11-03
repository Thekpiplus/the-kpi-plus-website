import { EnquiryForm } from "@/components/EnquiryForm";
import { hotelTrainingEnquiryCopy } from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export function TrainingEnquiry({
  locale,
  heading,
  lead,
  submitLabel,
  fieldLabels,
}: {
  locale: Locale;
  heading?: string;
  lead?: string;
  submitLabel?: string;
  fieldLabels?: {
    consent?: string;
    privacy?: string;
    required?: string;
    requiredMsg?: string;
    consentRequired?: string;
    secretMsg?: string;
  };
}) {
  const copy = hotelTrainingEnquiryCopy(locale);
  return (
    <EnquiryForm
      locale={locale}
      service="training"
      sectionId="training-enquiry"
      kicker="TRAINING & TEAM DEVELOPMENT"
      title={heading || copy.heading}
      body={lead || copy.lead}
      submitLabel={submitLabel || copy.submit}
      introNextTitle={copy.nextTitle}
      introSteps={[...copy.steps]}
      introNote={copy.note}
      fieldLabels={fieldLabels}
    />
  );
}
