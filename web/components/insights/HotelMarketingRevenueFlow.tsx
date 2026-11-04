import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-revenue-management-flow-placeholder.webp";
const MAP_LABEL = "Marketing × Revenue Management Flow — Sample";

const STEPS = [
  {
    id: "demand",
    role: { th: "Marketing", en: "Marketing" },
    action: {
      th: "สร้าง / สังเกต Demand",
      en: "Creates / observes Demand",
    },
  },
  {
    id: "inventory",
    role: { th: "Revenue Management", en: "Revenue Management" },
    action: {
      th: "ทบทวน Inventory / Availability / Pricing",
      en: "Reviews Inventory / Availability / Pricing",
    },
  },
  {
    id: "distribution",
    role: { th: "Distribution", en: "Distribution" },
    action: {
      th: "ดำเนินการผ่านช่องทางที่เหมาะสม",
      en: "Executes appropriate channels",
    },
  },
  {
    id: "review",
    role: { th: "Marketing + Revenue", en: "Marketing + Revenue" },
    action: {
      th: "ทบทวนผลร่วมกัน",
      en: "Review performance together",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่างการทำงานร่วมกัน Marketing × Revenue",
    explain:
      "ทั้งสองงานควรประสานกัน แต่ไม่ใช่หน้าที่เดียวกัน — Marketing ไม่ได้ตั้งราคาเพียงลำพัง และ Revenue Management ไม่ได้สร้าง Demand เพียงลำพัง กระบวนการนี้ไม่รับประกันว่ารายได้จะเพิ่มขึ้น",
    note: "Sample · ไม่ใช่ผลงานลูกค้า · ไม่ใช่ภาพประชุมธุรกิจทั่วไป",
    alt: "แผนภาพตัวอย่าง Marketing × Revenue Management Flow จาก Demand ถึงการทบทวนผลร่วมกัน พร้อมป้ายบทบาท ไม่ใช่ผลงานลูกค้า",
    caption: "แผนภาพตัวอย่างการประสานงาน — Marketing และ Revenue Management ทำงานร่วมกัน แต่บทบาทไม่เหมือนกัน และไม่รับประกันรายได้",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample Marketing × Revenue collaboration",
    explain:
      "These functions should coordinate but are not identical — Marketing alone does not set rates, and Revenue Management alone does not create demand. This process does not guarantee a revenue lift.",
    note: "Sample · Not a client result · Not a generic business meeting photo",
    alt: "Sample Marketing × Revenue Management Flow from Demand through joint performance review, with role labels. Not a client result.",
    caption: "Sample collaboration diagram — Marketing and Revenue Management coordinate, but roles differ, and revenue lift is not guaranteed.",
  },
} as const;

function FlowArrow() {
  return (
    <svg className="kpi-article-mrm-flow-arrow" viewBox="0 0 24 12" width="24" height="12" aria-hidden="true" focusable="false">
      <path d="M1 6h18M14 1l8 5-8 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HotelMarketingRevenueFlow({ locale }: { locale: Locale }) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-mrm-flow">
      <div className="kpi-article-mrm-flow-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-mrm-flow-bg"
            src={backgroundSrc}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-mrm-flow-body">
          <p className="kpi-article-mrm-flow-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-mrm-flow-heading${locale === "th" ? "" : " kpi-latin"}`}>{ui.heading}</p>

          <ol className="kpi-article-mrm-flow-steps" aria-hidden="true">
            {STEPS.map((step, index) => (
              <li key={step.id}>
                <div className="kpi-article-mrm-flow-card">
                  <span className="kpi-article-mrm-flow-role kpi-latin">{step.role[lang]}</span>
                  <span className={`kpi-article-mrm-flow-action${locale === "th" ? "" : " kpi-latin"}`}>{step.action[lang]}</span>
                </div>
                {index < STEPS.length - 1 ? <FlowArrow /> : null}
              </li>
            ))}
          </ol>

          <p className={`kpi-article-mrm-flow-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-mrm-flow-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className={`kpi-article-mrm-flow-caption${locale === "th" ? "" : " kpi-latin"}`}>{ui.caption}</figcaption>
    </figure>
  );
}
