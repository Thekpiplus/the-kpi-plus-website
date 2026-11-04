"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/seo";

const STEPS = [
  {
    id: "guest-proposition",
    title: {
      th: "กำหนดกลุ่มลูกค้าเป้าหมายและจุดขายของโรงแรม",
      en: "Define target guest and hotel proposition",
    },
    detail: {
      th: "ครอบคลุมคำถาม: กลุ่มลูกค้าหลักคือใคร และจุดขายชัดเจนหรือไม่",
      en: "Covers: who the main guests are, and whether the hotel proposition is clear",
    },
  },
  {
    id: "visibility",
    title: {
      th: "ตรวจ Search / Maps / OTA เรื่อง Visibility และความถูกต้องของข้อมูล",
      en: "Check Search / Maps / OTA visibility and information accuracy",
    },
    detail: {
      th: "ครอบคลุมคำถาม: Google และ OTA มีข้อมูลครบและน่าเชื่อถือหรือไม่",
      en: "Covers: whether Google and OTA information is complete and trustworthy",
    },
  },
  {
    id: "website-mobile",
    title: {
      th: "ทบทวนเว็บไซต์และเส้นทางจองบนมือถือ",
      en: "Review website and booking path on mobile",
    },
    detail: {
      th: "ครอบคลุมคำถาม: เว็บไซต์ช่วยให้เกิด Direct Booking ได้ดีเพียงใด",
      en: "Covers: how well the website supports Direct Booking",
    },
  },
  {
    id: "align",
    title: {
      th: "จัดให้ Marketing, Revenue, Pricing และ Distribution สอดคล้องกัน",
      en: "Align Marketing, Revenue, Pricing, and Distribution",
    },
    detail: {
      th: "ครอบคลุมคำถาม: ราคา โปรโมชั่น และ Distribution สอดคล้องกับ Demand หรือไม่",
      en: "Covers: whether price, promotion, and Distribution align with Demand",
    },
  },
  {
    id: "priority-metric",
    title: {
      th: "เลือกหนึ่งลำดับความสำคัญ และกำหนดตัวชี้วัดที่จะทบทวน",
      en: "Select one priority and define the metric to review",
    },
    detail: {
      th: "เริ่มจากจุดเดียวที่ทีมติดตามได้ — ไม่ใช่คำแนะนำอัตโนมัติหรือการรับประกันผล",
      en: "Start with one trackable focus — not an automated recommendation or guaranteed outcome",
    },
  },
] as const;

const copy = {
  th: {
    checklistLabel: "Self-assessment (ไม่ส่งข้อมูลออกนอกเครื่อง)",
    note: "Sample · Checkbox เก็บสถานะเฉพาะในเบราว์เซอร์นี้ · ไม่เก็บข้อมูลส่วนตัวหรือข้อมูลธุรกิจ",
    reset: "ล้างการเลือก",
  },
  en: {
    checklistLabel: "Self-assessment (stays in this browser only)",
    note: "Sample · Checkbox state stays in this browser only · No personal or business data is collected",
    reset: "Clear selections",
  },
} as const;

export function HotelMarketingStartChecklist({ locale }: { locale: Locale }) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const formId = useId();
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STEPS.map((step) => [step.id, false])),
  );

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setChecked(Object.fromEntries(STEPS.map((step) => [step.id, false])));
  }

  return (
    <form
      className="kpi-article-start-roadmap-form"
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <div className="kpi-article-start-roadmap-form-top">
        <p className={`kpi-article-start-roadmap-form-label${locale === "th" ? "" : " kpi-latin"}`}>
          {ui.checklistLabel}
        </p>
        <button type="button" className="kpi-article-start-roadmap-reset" onClick={reset}>
          {ui.reset}
        </button>
      </div>

      <ul className="kpi-article-start-roadmap-checks">
        {STEPS.map((step, index) => {
          const inputId = `${formId}-${step.id}`;
          return (
            <li key={step.id}>
              <label htmlFor={inputId} className="kpi-article-start-roadmap-check">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={Boolean(checked[step.id])}
                  onChange={() => toggle(step.id)}
                />
                <span className="kpi-article-start-roadmap-check-body">
                  <span className="kpi-article-start-roadmap-check-num kpi-latin">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`kpi-article-start-roadmap-check-title${locale === "th" ? "" : " kpi-latin"}`}>
                    {step.title[lang]}
                  </span>
                  <span className={`kpi-article-start-roadmap-check-detail${locale === "th" ? "" : " kpi-latin"}`}>
                    {step.detail[lang]}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className={`kpi-article-start-roadmap-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
    </form>
  );
}
