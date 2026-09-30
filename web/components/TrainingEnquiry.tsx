import { EnquiryForm } from "@/components/EnquiryForm";
import type { Locale } from "@/lib/seo";

export function TrainingEnquiry({ locale }: { locale: Locale }) {
  return <EnquiryForm locale={locale} service="training" sectionId="training-enquiry" />;
}
