import { hotelSeoEnquiryCopy } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

export function HotelSeoEnquiryIntro({
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
  const defaults = hotelSeoEnquiryCopy(locale);
  const resolvedReceive = receive?.length ? receive : defaults.receive;
  const resolvedSteps = steps?.length ? steps : defaults.steps;
  const showPhoto = Boolean(photoSrc?.trim());

  return (
    <div className="kpi-search-enquiry-intro">
      <p className="kpi-search-enquiry-kicker kpi-latin">{kicker || defaults.kicker}</p>
      <h2 className="kpi-h2 kpi-search-enquiry-heading">{heading || defaults.heading}</h2>
      <p className="kpi-search-enquiry-lead">{lead || defaults.lead}</p>
      <div className="kpi-search-enquiry-receive">
        <h3 className="kpi-search-enquiry-receive-title">{receiveTitle || defaults.receiveTitle}</h3>
        <ul>
          {resolvedReceive.map((item) => (
            <li key={item.title}>
              <strong className="kpi-latin">{item.title}</strong>
              {item.body ? <span>{item.body}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="kpi-search-enquiry-next">
        <h3 className="kpi-search-enquiry-next-title kpi-latin">{nextTitle || defaults.nextTitle}</h3>
        <ol className="kpi-search-enquiry-points">
          {resolvedSteps.map((step, index) => (
            <li key={step}>
              <span className="kpi-search-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="kpi-search-enquiry-note">{defaults.note}</p>
      </div>
      {showPhoto ? (
        <figure className="kpi-search-enquiry-photo">
          <img
            src={photoSrc}
            alt={
              photoAlt?.trim() ||
              (locale === "th" ? "ภาพตัวอย่างประกอบ ไม่ใช่รูปทีมงานหรือลูกค้า" : "Sample supporting image, not a team member or client")
            }
            width={520}
            height={347}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null}
    </div>
  );
}
