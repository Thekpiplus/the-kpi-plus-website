import { INDEPENDENT_ENQUIRY_RECEIVE, independentEnquiryCopy } from "@/lib/independent-hotel";
import type { Locale } from "@/lib/seo";

export function IndependentEnquiryIntro({
  locale,
  kicker,
  heading,
  lead,
  receiveTitle,
  receive,
  nextTitle,
  steps,
}: {
  locale: Locale;
  kicker?: string;
  heading?: string;
  lead?: string;
  receiveTitle?: string;
  receive?: Array<{ title: string; body?: string }>;
  nextTitle?: string;
  steps?: string[];
}) {
  const defaults = independentEnquiryCopy(locale);
  const resolvedReceive = receive?.length
    ? receive
    : INDEPENDENT_ENQUIRY_RECEIVE.map((item) => ({
        title: item.title,
        body: locale === "th" ? item.th : item.en,
      }));
  const resolvedSteps = steps?.length ? steps : defaults.steps;

  return (
    <div className="kpi-website-enquiry-intro">
      <p className="kpi-website-enquiry-kicker kpi-latin">{kicker || defaults.kicker}</p>
      <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading || defaults.heading}</h2>
      <p className="kpi-website-enquiry-lead">{lead || defaults.lead}</p>
      <div className="kpi-website-enquiry-receive">
        <h3 className="kpi-website-enquiry-receive-title">{receiveTitle || defaults.receiveTitle}</h3>
        <ul>
          {resolvedReceive.map((item) => (
            <li key={item.title}>
              <strong className="kpi-latin">{item.title}</strong>
              {item.body ? <span>{item.body}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="kpi-website-enquiry-next">
        <h3 className="kpi-website-enquiry-next-title kpi-latin">{nextTitle || defaults.nextTitle}</h3>
        <ol className="kpi-website-enquiry-points">
          {resolvedSteps.map((step, index) => (
            <li key={step}>
              <span className="kpi-website-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="kpi-website-enquiry-note">{defaults.note}</p>
      </div>
    </div>
  );
}
