import { B2B_TEAM_VISUAL, b2bEnquiryCopy } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";

export function B2bEnquiryIntro({
  locale,
  kicker,
  heading,
  lead,
  receiveTitle,
  receive,
  nextTitle,
  steps,
  photoSrc,
  photoAlt,
}: {
  locale: Locale;
  kicker?: string;
  heading?: string;
  lead?: string;
  receiveTitle?: string;
  receive?: Array<{ title: string; body?: string }>;
  nextTitle?: string;
  steps?: string[];
  photoSrc?: string;
  photoAlt?: string;
}) {
  const defaults = b2bEnquiryCopy(locale);
  const resolvedReceive = receive?.length ? receive : defaults.receive;
  const resolvedSteps = steps?.length ? steps : defaults.steps;
  const showPhoto = Boolean(photoSrc);

  return (
    <div className="kpi-b2b-enquiry-intro">
      <p className="kpi-kicker kpi-b2b-enquiry-kicker">{kicker || defaults.kicker}</p>
      <h2 className="kpi-h2 kpi-b2b-enquiry-heading">{heading || defaults.heading}</h2>
      <p className="kpi-b2b-enquiry-lead">{lead || defaults.lead}</p>
      <div className="kpi-b2b-enquiry-receive">
        <h3 className="kpi-b2b-enquiry-receive-title">{receiveTitle || defaults.receiveTitle}</h3>
        <ul>
          {resolvedReceive.map((item) => (
            <li key={item.title}>
              <strong className="kpi-latin">{item.title}</strong>
              {item.body ? <span>{item.body}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="kpi-b2b-enquiry-next">
        <h3 className="kpi-b2b-enquiry-next-title">{nextTitle || defaults.nextTitle}</h3>
        <ol className="kpi-b2b-enquiry-points">
          {resolvedSteps.map((step, index) => (
            <li key={step}>
              <span className="kpi-b2b-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      {showPhoto ? (
        <figure className="kpi-b2b-enquiry-photo">
          <img
            src={photoSrc}
            alt={photoAlt || B2B_TEAM_VISUAL.label}
            width={B2B_TEAM_VISUAL.displayWidth}
            height={B2B_TEAM_VISUAL.displayHeight}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null}
    </div>
  );
}
