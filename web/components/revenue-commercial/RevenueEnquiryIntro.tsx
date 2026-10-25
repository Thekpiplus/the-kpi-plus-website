import type { Locale } from "@/lib/seo";

const CONSULTANT_PHOTO = {
  displayWidth: 420,
  displayHeight: 280,
  label: "Replace with verified team / consultation image",
} as const;

const copy = {
  th: {
    nextTitle: "หลังจากส่งข้อมูลแล้ว",
    steps: [
      "ส่งข้อมูลโรงแรมเบื้องต้น",
      "ทีมงานดูว่าควรเริ่มจากจุดใด",
      "นัดพูดคุยและกำหนดขั้นตอนถัดไป",
    ],
    trust: [
      "ใช้ข้อมูลเท่าที่โรงแรมสะดวกแชร์",
      "ข้อมูลจะถูกเก็บเป็นความลับ",
      "ไม่มีการรับประกันผลลัพธ์เกินจริง",
    ],
  },
  en: {
    nextTitle: "What happens next",
    steps: [
      "Send the hotel’s basic details",
      "The team reviews where to start",
      "Arrange a conversation and the next step",
    ],
    trust: [
      "Share only what the hotel is comfortable sharing",
      "Information is kept confidential",
      "We do not promise results we cannot support",
    ],
  },
} as const;

function copyFor(locale: Locale) {
  return locale === "th" ? copy.th : copy.en;
}

export function RevenueEnquiryIntro({
  locale,
  kicker,
  heading,
  lead,
  photoSrc,
  nextTitle,
  steps,
  trust,
}: {
  locale: Locale;
  kicker: string;
  heading: string;
  lead: string;
  photoSrc?: string;
  nextTitle?: string;
  steps?: string[];
  trust?: string[];
}) {
  const defaults = copyFor(locale);
  const t = {
    nextTitle: nextTitle || defaults.nextTitle,
    steps: steps?.length ? steps : defaults.steps,
    trust: trust?.length ? trust : defaults.trust,
  };

  return (
    <div className="kpi-revenue-enquiry-intro">
      <p className="kpi-kicker kpi-revenue-enquiry-kicker">{kicker}</p>
      <h2 className="kpi-h2 kpi-revenue-enquiry-heading">{heading}</h2>
      <p className="kpi-revenue-enquiry-lead">
        {lead.split("\n").map((line, index) => (
          <span key={line} className={index > 0 ? "kpi-revenue-enquiry-line" : undefined}>
            {line}
          </span>
        ))}
      </p>
      <div className="kpi-revenue-enquiry-next">
        <h3 className="kpi-revenue-enquiry-next-title">{t.nextTitle}</h3>
        <ol className="kpi-revenue-enquiry-steps">
          {t.steps.map((step, index) => (
            <li key={step}>
              <span className="kpi-revenue-enquiry-step-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <ul className="kpi-revenue-enquiry-trust">
          {t.trust.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {photoSrc ? (
        <figure className="kpi-revenue-enquiry-photo">
          <img
            src={photoSrc}
            alt={CONSULTANT_PHOTO.label}
            width={CONSULTANT_PHOTO.displayWidth}
            height={CONSULTANT_PHOTO.displayHeight}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{CONSULTANT_PHOTO.label}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
