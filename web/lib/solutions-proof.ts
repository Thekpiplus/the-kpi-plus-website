import {
  publishedCaseStudies,
  type CaseStudy,
} from "@/lib/case-studies";
import type { Locale } from "@/lib/seo";

/**
 * Checklist for showing case proof on the Hotel Solutions index.
 * If any required field is missing, the study must not appear here —
 * do not invent metrics, logos, or permission claims to fill gaps.
 */
export function solutionsProofGaps(study: CaseStudy): string[] {
  const gaps: string[] = [];
  const identity = study.clientName?.trim() || study.anonymisedLabel?.trim();
  if (!identity) gaps.push("identity");
  if (!study.challenge?.trim()) gaps.push("challenge");
  if (!study.serviceArea?.trim() && !study.action?.trim()) gaps.push("scope");
  if (!study.action?.trim()) gaps.push("whatWasDone");
  if (!study.measurementPeriod?.trim()) gaps.push("measurementPeriod");

  const primary = study.metrics[0];
  if (primary) {
    if (!primary.definition?.trim()) gaps.push("metricDefinition");
    if (!primary.period?.trim()) gaps.push("metricPeriod");
    if (!primary.sourceNote?.trim() && !(study.sourceNotes?.some((n) => n.trim()))) {
      gaps.push("metricSource");
    }
  } else {
    gaps.push("metric");
  }

  const permissionSafe =
    study.dataStatus === "approved" ||
    study.dataStatus === "published" ||
    study.dataStatus === "anonymised" ||
    study.testimonial?.approvalStatus === "approved";
  if (!permissionSafe) gaps.push("publicationPermission");
  // Latest review / publication date is required before proof appears on Solutions.
  if (!study.updatedAt?.trim() && !study.publishedAt?.trim()) gaps.push("reviewDate");

  return gaps;
}

export function solutionsProofEligibleStudies() {
  return publishedCaseStudies().filter((study) => solutionsProofGaps(study).length === 0);
}

export const SOLUTIONS_PROCESS_STEPS = [
  {
    id: "challenge",
    en: "Start from one business challenge",
    th: "เริ่มจากหนึ่งปัญหาทางธุรกิจ",
    ru: "Начните с одной бизнес-задачи",
    zh: "先從一個業務挑戰開始",
    body: {
      en: "Choose the area that needs attention first — revenue, marketing and booking, or systems and team — without selecting every service up front.",
      th: "เลือกด้านที่ต้องการความสนใจก่อน — รายได้ การตลาดและการจอง หรือระบบและทีม — โดยไม่ต้องเลือกทุกบริการล่วงหน้า",
      ru: "Выберите область, которая нужна раньше — доход, маркетинг и бронирование или системы и команда — без выбора всех услуг заранее.",
      zh: "先選最需要關注的面向——收益、行銷與預訂，或系統與團隊——不必事先選好每一項服務。",
    },
  },
  {
    id: "fit",
    en: "Check fit against the hotel’s situation",
    th: "ดูความเหมาะสมกับสถานการณ์โรงแรม",
    ru: "Проверьте соответствие ситуации отеля",
    zh: "對照飯店現況判斷是否適合",
    body: {
      en: "Service pages describe the problem, who it suits, and what may be in scope. The hotel keeps ownership of rates, brand facts, and approvals.",
      th: "หน้าบริการอธิบายปัญหา กลุ่มที่เหมาะ และงานที่อาจอยู่ในขอบเขต โรงแรมยังเป็นเจ้าของราคา ข้อมูลแบรนด์ และการอนุมัติ",
      ru: "Страницы услуг описывают проблему, кому подходит и что может входить в объём. Отель сохраняет цены, факты бренда и утверждения.",
      zh: "服務頁說明問題、適合對象，以及可能涵蓋的範圍。價格、品牌事實與核准權仍由飯店掌握。",
    },
  },
  {
    id: "scope",
    en: "Agree scope and a useful first deliverable",
    th: "ตกลงขอบเขตและผลงานแรกที่ใช้ต่อได้",
    ru: "Согласуйте объём и полезный первый результат",
    zh: "約定範圍與可用的第一個交付",
    body: {
      en: "Work starts only after the hotel and The KPI Plus agree what to review, which channels or systems are included, and what will be handed back.",
      th: "งานเริ่มเมื่อโรงแรมและ เดอะ เคพีไอ พลัส ตกลงว่าจะทบทวนอะไร ช่องทางหรือระบบใดอยู่ในขอบเขต และจะส่งมอบอะไรกลับ",
      ru: "Работа начинается после того, как отель и The KPI Plus согласуют, что проверять, какие каналы или системы входят и что будет передано обратно.",
      zh: "須等飯店與 The KPI Plus 約定要檢視什麼、哪些通路或系統在範圍內，以及要交回什麼之後，工作才開始。",
    },
  },
  {
    id: "measure",
    en: "Measure only what the systems can support",
    th: "วัดเฉพาะสิ่งที่ระบบรองรับได้จริง",
    ru: "Измеряйте только то, что системы реально поддерживают",
    zh: "只衡量系統實際能支援的項目",
    body: {
      en: "Reporting rhythm and figures follow the data the hotel can share and verify. This page does not invent occupancy, ADR, RevPAR, conversion, or ranking results.",
      th: "รอบรายงานและตัวเลขตามข้อมูลที่โรงแรมแชร์และตรวจสอบได้ หน้านี้ไม่สร้างตัวเลข Occupancy, ADR, RevPAR, conversion หรืออันดับ",
      ru: "Ритм отчётов и цифры зависят от данных, которые отель может предоставить и проверить. Эта страница не изобретает Occupancy, ADR, RevPAR, conversion или рейтинг.",
      zh: "報告節奏與數字依飯店能分享並核對的資料而定。本頁不虛構住房率、ADR、RevPAR、轉換或排名結果。",
    },
  },
] as const;

export function solutionsProcessStepLabel(
  step: (typeof SOLUTIONS_PROCESS_STEPS)[number],
  locale: Locale,
) {
  return step[locale] ?? step.en;
}

export function solutionsProcessStepBody(
  step: (typeof SOLUTIONS_PROCESS_STEPS)[number],
  locale: Locale,
) {
  return step.body[locale] ?? step.body.en;
}
