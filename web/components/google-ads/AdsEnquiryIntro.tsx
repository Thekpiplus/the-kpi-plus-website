import { ADS_TEAM_VISUAL, adsEnquiryCopy } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";

export function AdsEnquiryIntro({
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
  const defaults = adsEnquiryCopy(locale);
  const resolvedReceive = receive?.length ? receive : defaults.receive;
  const resolvedSteps = steps?.length ? steps : defaults.steps;
  const showPhoto = Boolean(photoSrc);

  return (
    <div className="kpi-google-ads-enquiry-intro">
      <p className="kpi-google-ads-enquiry-kicker kpi-latin">{kicker || defaults.kicker}</p>
      <h2 className="kpi-h2 kpi-google-ads-enquiry-heading">{heading || defaults.heading}</h2>
      <p className="kpi-google-ads-enquiry-lead">{lead || defaults.lead}</p>
      <div className="kpi-google-ads-enquiry-receive">
        <h3 className="kpi-google-ads-enquiry-receive-title">{receiveTitle || defaults.receiveTitle}</h3>
        <ul>
          {resolvedReceive.map((item) => (
            <li key={item.title}>
              <strong className="kpi-latin">{item.title}</strong>
              {item.body ? <span>{item.body}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="kpi-google-ads-enquiry-next">
        <h3 className="kpi-google-ads-enquiry-next-title">{nextTitle || defaults.nextTitle}</h3>
        <ol className="kpi-google-ads-enquiry-points">
          {resolvedSteps.map((step, index) => (
            <li key={step}>
              <span className="kpi-google-ads-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      {showPhoto ? (
        <figure className="kpi-google-ads-enquiry-photo">
          <img
            src={photoSrc}
            alt={photoAlt || ADS_TEAM_VISUAL.label}
            width={ADS_TEAM_VISUAL.displayWidth}
            height={ADS_TEAM_VISUAL.displayHeight}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null}
    </div>
  );
}
