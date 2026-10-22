import {
  mailtoHref,
  telHref,
  whatsappHrefFromNumber,
  type ContactInfo,
} from "@/lib/company";
import type { Locale } from "@/lib/seo";

const copy = {
  th: {
    title: "หลังจากส่งข้อมูลแล้ว",
    steps: [
      {
        num: "1",
        title: "ส่งข้อมูลเบื้องต้น",
        body: "กรอกเฉพาะข้อมูลที่จำเป็น เพื่อให้ทีมรู้ว่าควรติดต่อกลับอย่างไร",
      },
      {
        num: "2",
        title: "ทีมงานตรวจสอบความต้องการ",
        body: "ทีมอ่านข้อมูลที่ส่งมา และดูว่าโรงแรมต้องการความช่วยเหลือด้านใด",
      },
      {
        num: "3",
        title: "นัดพูดคุยหรือแนะนำขั้นตอนถัดไป",
        body: "ทีมจะติดต่อกลับเพื่อนัดคุย หรือแนะนำสิ่งที่ควรทำต่อ",
      },
    ],
    realTeam: "ตอบกลับโดยทีมงานจริง",
    confidential: "ข้อมูลของคุณเป็นความลับ",
  },
  en: {
    title: "What happens next",
    steps: [
      {
        num: "1",
        title: "Send the basics",
        body: "Share the details needed so the team knows how to reach you.",
      },
      {
        num: "2",
        title: "The team reviews the request",
        body: "They read what you sent and what the hotel needs help with.",
      },
      {
        num: "3",
        title: "Talk or agree the next step",
        body: "The team will get in touch to talk, or suggest what to do next.",
      },
    ],
    realTeam: "A real team member replies",
    confidential: "Your information is kept confidential",
  },
} as const;

function copyFor(locale: Locale) {
  return locale === "th" ? copy.th : copy.en;
}

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
}: {
  locale: Locale;
  contact: ContactInfo;
}) {
  const t = copyFor(locale);
  const channels = channelTrust(contact, locale);
  const trust = [t.realTeam, t.confidential, channels].filter(Boolean);

  return (
    <section className="kpi-contact-next" aria-labelledby="contact-next-heading">
      <div className="kpi-section">
        <h2 id="contact-next-heading" className="kpi-h2 kpi-contact-next-title">
          {t.title}
        </h2>
        <ol className="kpi-contact-next-steps">
          {t.steps.map((step) => (
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
