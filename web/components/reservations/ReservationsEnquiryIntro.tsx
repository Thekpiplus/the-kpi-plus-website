import type { Locale } from "@/lib/seo";
import "./reservations-ops.css";

const TEAM_PHOTO = {
  displayWidth: 420,
  displayHeight: 280,
  label: "Replace with verified Reservations Team image",
} as const;

const copy = {
  th: {
    nextTitle: "What Happens Next",
    steps: [
      "ทีมงานรับข้อมูลโรงแรมเบื้องต้น",
      "ตรวจสอบรูปแบบงานจองและช่องทางที่ใช้อยู่",
      "นัดพูดคุยเรื่อง Scope, Workflow และ SLA",
    ],
    trust: [
      "เริ่มจากข้อมูลที่โรงแรมสะดวกแชร์ได้",
      "ขอบเขตงานและ SLA จะตกลงก่อนเริ่มงาน",
      "ข้อมูล Guest และ Booking ต้องได้รับการจัดการอย่างเป็นความลับ",
    ],
  },
  en: {
    nextTitle: "What Happens Next",
    steps: [
      "The team receives the hotel’s basic details",
      "Review the current reservation work and channels",
      "Arrange a conversation on scope, workflow, and SLA",
    ],
    trust: [
      "Start with the information the hotel is comfortable sharing",
      "Scope and SLA are agreed before work starts",
      "Guest and booking data must be handled confidentially",
    ],
  },
} as const;

type ReservationsEnquiryIntroProps = {
  locale: Locale;
  kicker: string;
  heading: string;
  lead: string;
  photoSrc?: string;
  photoAlt?: string;
  nextTitle?: string;
  steps?: string[];
  trust?: string[];
};

export function ReservationsEnquiryIntro({
  locale,
  kicker,
  heading,
  lead,
  photoSrc,
  photoAlt,
  nextTitle,
  steps,
  trust,
}: ReservationsEnquiryIntroProps) {
  const t = locale === "th" ? copy.th : copy.en;
  const resolvedNext = nextTitle || t.nextTitle;
  const resolvedSteps = steps?.length ? steps : t.steps;
  const resolvedTrust = trust?.length ? trust : t.trust;
  const showPhoto = Boolean(photoSrc) && !/replace with verified|รอรูป|placeholder/i.test(photoAlt || "");

  return (
    <div className="kpi-reservations-enquiry-intro">
      <p className="kpi-kicker kpi-reservations-enquiry-kicker">{kicker}</p>
      <h2 className="kpi-h2 kpi-reservations-enquiry-heading">{heading}</h2>
      <p className="kpi-reservations-enquiry-lead">
        {lead.split("\n").map((line, index) => (
          <span key={line} className={index > 0 ? "kpi-reservations-enquiry-line" : undefined}>
            {line}
          </span>
        ))}
      </p>
      <div className="kpi-reservations-enquiry-next">
        <h3 className="kpi-reservations-enquiry-next-title">{resolvedNext}</h3>
        <ol className="kpi-reservations-enquiry-points">
          {resolvedSteps.map((step, index) => (
            <li key={step}>
              <span className="kpi-reservations-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <ul className="kpi-reservations-enquiry-trust">
          {resolvedTrust.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {showPhoto ? (
        <figure className="kpi-reservations-enquiry-photo">
          <img
            src={photoSrc}
            alt={photoAlt || TEAM_PHOTO.label}
            width={TEAM_PHOTO.displayWidth}
            height={TEAM_PHOTO.displayHeight}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null}
    </div>
  );
}
