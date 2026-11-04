import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";
import { HotelMarketingStartChecklist } from "@/components/insights/HotelMarketingStartChecklist";

const COVER_BG = "/images/insights/hotel-marketing-start-here-roadmap-placeholder.webp";
const MAP_LABEL = "Hotel Marketing Readiness Checklist — Sample";

const STEPS = [
  {
    id: "guest-proposition",
    title: {
      th: "กำหนดกลุ่มลูกค้าเป้าหมายและจุดขายของโรงแรม",
      en: "Define target guest and hotel proposition",
    },
  },
  {
    id: "visibility",
    title: {
      th: "ตรวจ Search / Maps / OTA เรื่อง Visibility และความถูกต้องของข้อมูล",
      en: "Check Search / Maps / OTA visibility and information accuracy",
    },
  },
  {
    id: "website-mobile",
    title: {
      th: "ทบทวนเว็บไซต์และเส้นทางจองบนมือถือ",
      en: "Review website and booking path on mobile",
    },
  },
  {
    id: "align",
    title: {
      th: "จัดให้ Marketing, Revenue, Pricing และ Distribution สอดคล้องกัน",
      en: "Align Marketing, Revenue, Pricing, and Distribution",
    },
  },
  {
    id: "priority-metric",
    title: {
      th: "เลือกหนึ่งลำดับความสำคัญ และกำหนดตัวชี้วัดที่จะทบทวน",
      en: "Select one priority and define the metric to review",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "Start Here Roadmap",
    guidance:
      "รายการนี้เป็นแนวทางทั่วไปสำหรับทีมโรงแรม — ไม่ใช่การตรวจโรงแรมอัตโนมัติ และไม่ใช่คำแนะนำที่รับประกันผลลัพธ์",
    alt: "แผนภาพตัวอย่าง Hotel Marketing Readiness Checklist ห้าขั้นตอน Start Here ไม่ใช่การ audit อัตโนมัติ",
    caption: "Sample readiness checklist — general guidance only; not an automated hotel audit",
  },
  en: {
    label: MAP_LABEL,
    heading: "Start Here Roadmap",
    guidance:
      "This checklist is general guidance for hotel teams — not an automated hotel audit, and not a guaranteed recommendation.",
    alt: "Sample Hotel Marketing Readiness Checklist with a five-step Start Here roadmap. Not an automated audit.",
    caption: "Sample readiness checklist — general guidance only; not an automated hotel audit",
  },
} as const;

export function HotelMarketingStartRoadmap({ locale }: { locale: Locale }) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <div className="kpi-article-start-roadmap">
      <figure className="kpi-article-start-roadmap-figure" aria-labelledby="hotel-marketing-start-roadmap-heading">
        <div className="kpi-article-start-roadmap-frame">
          {backgroundSrc ? (
            <img
              className="kpi-article-start-roadmap-bg"
              src={backgroundSrc}
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          ) : null}

          <div className="kpi-article-start-roadmap-body">
            <p className="kpi-article-start-roadmap-kicker kpi-latin">{ui.label}</p>
            <p
              id="hotel-marketing-start-roadmap-heading"
              className={`kpi-article-start-roadmap-heading${locale === "th" ? "" : " kpi-latin"}`}
            >
              {ui.heading}
            </p>
            <p className="sr-only">{ui.alt}</p>

            <ol className="kpi-article-start-roadmap-steps">
              {STEPS.map((step, index) => (
                <li key={step.id}>
                  <span className="kpi-article-start-roadmap-step-num kpi-latin">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`kpi-article-start-roadmap-step-title${locale === "th" ? "" : " kpi-latin"}`}>
                    {step.title[lang]}
                  </span>
                </li>
              ))}
            </ol>

            <p className={`kpi-article-start-roadmap-guidance${locale === "th" ? "" : " kpi-latin"}`}>{ui.guidance}</p>
          </div>
        </div>
        <figcaption className={`kpi-article-start-roadmap-caption${locale === "th" ? "" : " kpi-latin"}`}>
          {ui.caption}
        </figcaption>
      </figure>

      <HotelMarketingStartChecklist locale={locale} />
    </div>
  );
}
