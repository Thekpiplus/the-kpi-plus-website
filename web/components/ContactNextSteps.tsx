import {
  mailtoHref,
  telHref,
  whatsappHrefFromNumber,
  type ContactInfo,
} from "@/lib/company";
import type { Locale } from "@/lib/seo";

function channelTrust(contact: ContactInfo, locale: Locale) {
  const channels: string[] = [];
  if (mailtoHref(contact.email)) channels.push(locale === "th" ? "Email" : "email");
  if (telHref(contact.phone)) channels.push(locale === "th" ? "Phone" : "phone");
  if (whatsappHrefFromNumber(contact.whatsappNumber)) channels.push("WhatsApp");
  if (!channels.length) return "";
  if (locale === "th") {
    if (channels.length === 1) return `ติดต่อได้ทาง ${channels[0]}`;
    if (channels.length === 2) return `ติดต่อได้ทาง ${channels[0]} และ ${channels[1]}`;
    return `ติดต่อได้ทาง ${channels[0]}, ${channels[1]} และ ${channels[2]}`;
  }
  if (channels.length === 1) return `Reach us by ${channels[0]}`;
  if (channels.length === 2) return `Reach us by ${channels[0]} and ${channels[1]}`;
  return `Reach us by ${channels[0]}, ${channels[1]}, and ${channels[2]}`;
}

export function ContactNextSteps({
  locale,
  contact,
  title,
  steps,
  realTeam,
  confidential,
}: {
  locale: Locale;
  contact: ContactInfo;
  title: string;
  steps: Array<{ num: string; title: string; body: string }>;
  realTeam: string;
  confidential: string;
}) {
  const channels = channelTrust(contact, locale);
  const trust = [realTeam, confidential, channels].filter(Boolean);

  return (
    <section className="kpi-contact-next" aria-labelledby="contact-next-heading">
      <div className="kpi-section">
        <h2 id="contact-next-heading" className="kpi-h2 kpi-contact-next-title">
          {title}
        </h2>
        <ol className="kpi-contact-next-steps">
          {steps.map((step) => (
            <li key={step.num} className="kpi-contact-next-step">
              <span className="kpi-contact-next-num" aria-hidden="true">
                {step.num}
              </span>
              <div className="kpi-contact-next-copy">
                <h3 className="kpi-contact-next-step-title">{step.title}</h3>
                <p className="kpi-contact-next-step-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        {trust.length ? (
          <ul className="kpi-contact-next-trust">
            {trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
