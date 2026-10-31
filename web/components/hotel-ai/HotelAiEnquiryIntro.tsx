import { HotelAiEnquiryVisual } from "@/components/hotel-ai/HotelAiVisuals";
import { hotelAiEnquiryCopy } from "@/lib/hotel-ai";
import type { Locale } from "@/lib/seo";

export function HotelAiEnquiryIntro({
  locale,
  kicker,
  heading,
  lead,
  nextTitle,
  steps,
  note,
}: {
  locale: Locale;
  kicker?: string;
  heading?: string;
  lead?: string;
  nextTitle?: string;
  steps?: string[];
  note?: string;
}) {
  const copy = hotelAiEnquiryCopy(locale);
  const nextSteps = steps?.length ? steps : copy.steps;

  return (
    <div className="kpi-website-enquiry-intro hai-enquiry-intro">
      <p className="kpi-website-enquiry-kicker kpi-latin">{kicker || copy.kicker}</p>
      <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading || copy.heading}</h2>
      <p className="kpi-website-enquiry-lead">{lead || copy.lead}</p>
      <div className="kpi-website-enquiry-next">
        <h3 className="kpi-website-enquiry-next-title kpi-latin">{nextTitle || copy.nextTitle}</h3>
        <ol className="kpi-website-enquiry-points">
          {nextSteps.map((step, index) => (
            <li key={step}>
              <span className="kpi-website-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <HotelAiEnquiryVisual locale={locale} />
        <p className="kpi-website-enquiry-note">{note || copy.note}</p>
      </div>
    </div>
  );
}
