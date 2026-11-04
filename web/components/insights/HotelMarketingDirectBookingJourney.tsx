import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-direct-booking-journey-placeholder.webp";
const MAP_LABEL = "Direct Booking Journey — Sample";

const STEPS = [
  "Landing Page",
  "Room/Rate Information",
  "Trust Signals",
  "Booking Engine",
  "Confirmation",
] as const;

const MOBILE_POINTS = [
  {
    id: "offer",
    title: { th: "รายละเอียดห้อง/ข้อเสนอชัด", en: "Clear room / offer details" },
  },
  {
    id: "price",
    title: { th: "ราคาและเงื่อนไขมองเห็นได้", en: "Visible price and conditions" },
  },
  {
    id: "terms",
    title: { th: "ข้อมูลยกเลิก/สิ่งที่รวมอ่านง่าย", en: "Readable cancellation / inclusion information" },
  },
  {
    id: "cta",
    title: { th: "เส้นทาง Book Now ชัดเจน", en: "Clear Book Now path" },
  },
  {
    id: "engine",
    title: { th: "Booking Engine ใช้งานง่าย", en: "Booking Engine usability" },
  },
  {
    id: "trust",
    title: { th: "Trust Signals และรูปโรงแรมจริง", en: "Trust signals and real property photos" },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    stepsLabel: "เส้นทาง Direct Booking (ตัวอย่าง)",
    mobileLabel: "จุดที่ควรตรวจบนมือถือ",
    explain:
      "แผนภาพนี้เป็นตัวอย่างโครงสร้างเส้นทางจองตรง — ไม่ใช่หน้าจอ Booking ของลูกค้าจริง หากอ้างตัวเลขการจอง/Conversion ต้องระบุนิยาม ช่วงเวลา แหล่งข้อมูล และบริบท",
    note: "Sample · ใช้เฉพาะสินทรัพย์โรงแรมที่ได้รับอนุญาต · ไม่จำลองระบบจองของลูกค้า",
    alt: "แผนภาพตัวอย่างเส้นทาง Direct Booking จาก Landing Page ถึง Confirmation พร้อมจุดตรวจบนมือถือ ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    stepsLabel: "Direct Booking path (sample)",
    mobileLabel: "Mobile-first checks",
    explain:
      "This is a sample Direct Booking structure — not a real client booking screen. Any booking/conversion metric needs definition, period, source, and context.",
    note: "Sample · Approved hotel assets only · Not a client booking implementation",
    alt: "Sample Direct Booking journey from Landing Page to Confirmation with mobile checks. Not a client result.",
  },
} as const;

export function HotelMarketingDirectBookingJourney({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const lang = locale === "th" ? "th" : "en";
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-direct-journey">
      <div className="kpi-article-direct-journey-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-direct-journey-bg"
            src={backgroundSrc}
            alt=""
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-direct-journey-body">
          <p className="kpi-article-direct-journey-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-direct-journey-steps-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.stepsLabel}</p>

          <ol className="kpi-article-direct-journey-steps kpi-latin" aria-hidden="true">
            {STEPS.map((step, index) => (
              <li key={step}>
                <span className="kpi-article-direct-journey-step">{step}</span>
                {index < STEPS.length - 1 ? (
                  <span className="kpi-article-direct-journey-sep" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="kpi-article-direct-journey-mobile">
            <p className={`kpi-article-direct-journey-mobile-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.mobileLabel}</p>
            <ul className="kpi-article-direct-journey-mobile-list">
              {MOBILE_POINTS.map((item, index) => (
                <li key={item.id}>
                  <span className="kpi-article-direct-journey-mobile-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <span className={locale === "th" ? undefined : "kpi-latin"}>{item.title[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className={`kpi-article-direct-journey-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-direct-journey-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
