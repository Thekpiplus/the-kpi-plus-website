import type { Locale } from "@/lib/seo";

export const SYSTEMS_CATEGORY_ID = "grow-capability";

export const SYSTEMS_CATEGORY_VISUAL = {
  src: "/images/hotel-solutions-systems-team-placeholder.webp",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  label: "Hotel Systems, Workflow & Team — Sample Overview",
  alt: {
    th: "แผนภาพตัวอย่างความสัมพันธ์ Hotel Systems, Workflow & Team: เว็บไซต์/จอง ↔ PMS/CM/OTA ↔ ข้อมูล/รายงาน/Automation ↔ ทีม/อบรม/ปฏิบัติการ — ไม่ใช่หลักฐานว่าทุกระบบเชื่อมอัตโนมัติ",
    en: "Sample Hotel Systems, Workflow & Team relationship: Website/Booking ↔ PMS/CM/OTA ↔ Data/Reports/Automation ↔ Team/Training/Operations — not proof that every system connects automatically",
    ru: "Пример связи Systems & Team: сайт/бронь ↔ PMS/CM/OTA ↔ данные/отчёты/Automation ↔ команда/обучение/операции. Не доказательство автоматической интеграции",
    zh: "系統、流程與團隊關係示意：網站／預訂 ↔ PMS／通路管理員／OTA ↔ 資料／報表／自動化 ↔ 團隊／培訓／營運——非證明所有系統會自動串接",
  },
  note: {
    th: "แผนภาพตัวอย่าง — ข้อมูลไม่ไหลครบทุกจุดโดยอัตโนมัติ ขึ้นกับผู้ให้บริการ การจับคู่ข้อมูล สิทธิ์ และขอบเขตที่ตกลง",
    en: "Sample overview — data does not flow across every system automatically. Provider, mapping, permission, and agreed scope still apply.",
    ru: "Пример — данные не текут по всем системам автоматически. Нужны провайдер, mapping, доступ и согласованный объём.",
    zh: "示意總覽——資料不會在每個系統間自動流動；仍取決於供應商、對應、權限與約定範圍。",
  },
} as const;

export const SYSTEMS_CATEGORY_INTRO: Record<Locale, string> = {
  th: "หมวดนี้อาจครอบคลุมประสบการณ์ดิจิทัล ระบบและข้อมูลโรงแรม Workflow Automation และทีมที่ใช้งาน — ไม่ใช่แพ็กเชื่อมทุกระบบพร้อมกัน",
  en: "This category may include digital experience, hotel systems and data, workflow automation, and the people who run those processes — not an all-systems integrated package.",
  ru: "Категория может включать digital experience, системы и данные отеля, workflow automation и людей, которые ими пользуются — не единый пакет полной интеграции.",
  zh: "本類別可能涵蓋數位體驗、飯店系統與資料、流程自動化，以及使用這些流程的團隊——不是一次串接所有系統的整合套餐。",
};

/** Honest labels used on the sample relationship diagram. */
export type SystemsHonestLabel =
  | "example-category"
  | "existing-client-system"
  | "needs-mapping"
  | "requires-provider-support"
  | "subject-to-verification"
  | "sample-workflow";

export const SYSTEMS_HONEST_LABELS: Record<SystemsHonestLabel, Record<Locale, string>> = {
  "example-category": {
    th: "ตัวอย่างหมวด",
    en: "Example category",
    ru: "Пример категории",
    zh: "示例類別",
  },
  "existing-client-system": {
    th: "ระบบที่ลูกค้าใช้อยู่",
    en: "Existing client system",
    ru: "Существующая система клиента",
    zh: "客戶既有系統",
  },
  "needs-mapping": {
    th: "ต้องจับคู่ข้อมูล (Needs mapping)",
    en: "Needs mapping",
    ru: "Needs mapping",
    zh: "Needs mapping（需對應資料）",
  },
  "requires-provider-support": {
    th: "ต้องให้ผู้ให้บริการสนับสนุน",
    en: "Requires provider support",
    ru: "Requires provider support",
    zh: "Requires provider support（需供應商支援）",
  },
  "subject-to-verification": {
    th: "ต้องตรวจทางเทคนิคก่อน",
    en: "Subject to technical verification",
    ru: "Subject to technical verification",
    zh: "Subject to technical verification（須技術驗證）",
  },
  "sample-workflow": {
    th: "ตัวอย่างขั้นตอนทำงาน",
    en: "Sample workflow",
    ru: "Sample workflow",
    zh: "Sample workflow（流程示意）",
  },
};

export const SYSTEMS_CATEGORY_RELATION = [
  {
    id: "website",
    en: "Hotel Website / Booking",
    th: "เว็บไซต์ / การจอง",
    ru: "Сайт / бронирование",
    zh: "網站／預訂",
    labels: ["example-category", "sample-workflow"] as const satisfies readonly SystemsHonestLabel[],
  },
  {
    id: "pms",
    en: "PMS / Channel Manager / OTA",
    th: "PMS / Channel Manager / OTA",
    ru: "PMS / Channel Manager / OTA",
    zh: "PMS／通路管理員／OTA",
    labels: ["existing-client-system", "needs-mapping"] as const satisfies readonly SystemsHonestLabel[],
  },
  {
    id: "data",
    en: "Data / Reports / Automation",
    th: "ข้อมูล / รายงาน / Automation",
    ru: "Данные / отчёты / Automation",
    zh: "資料／報表／自動化",
    labels: ["needs-mapping", "requires-provider-support", "subject-to-verification"] as const satisfies readonly SystemsHonestLabel[],
  },
  {
    id: "team",
    en: "Hotel Team / Training / Operations",
    th: "ทีมโรงแรม / อบรม / ปฏิบัติการ",
    ru: "Команда / обучение / операции",
    zh: "飯店團隊／培訓／營運",
    labels: ["sample-workflow"] as const satisfies readonly SystemsHonestLabel[],
  },
] as const;

export type SystemsCategoryCard = {
  href: string;
  tag: Record<Locale, string>;
  summary: Record<Locale, string>;
  honest: SystemsHonestLabel;
  boundary: Record<Locale, string>;
};

/**
 * Text-first cards for Strengthen Operations only.
 * Names/routes come from nav. Website Design stays in Marketing; it appears in the diagram as related digital experience.
 */
export const SYSTEMS_CATEGORY_CARDS: SystemsCategoryCard[] = [
  {
    href: "/solutions/independent-hotel-management",
    tag: {
      th: "Operations / Management",
      en: "Operations / Management",
      ru: "Operations / Management",
      zh: "Operations / Management",
    },
    summary: {
      th: "ช่วยเจ้าของโรงแรมอิสระจัดทิศทาง โครงสร้างดำเนินงาน และการประสานงานการค้า ตามขอบเขตที่อนุมัติ — ไม่แทน GM หรือผู้รับผิดชอบทางกฎหมายโดยอัตโนมัติ",
      en: "Helps independent owners clarify direction, operating structure, and commercial coordination within approved scope — does not automatically replace a GM or legally responsible person.",
      ru: "Помогает независимому владельцу с направлением, структурой и коммерческой координацией в утверждённом объёме — не заменяет автоматически GM или юридически ответственное лицо.",
      zh: "協助獨立業主釐清方向、營運結構與商務協調（依核准範圍）——不自動取代總經理或法定負責人。",
    },
    honest: "sample-workflow",
    boundary: {
      th: "ไม่การันตีรายได้ Occupancy หรือผลค้า และไม่ใช่แพ็กบริหารครบทุกแผนก",
      en: "Does not guarantee revenue, occupancy, or trading results, and is not a full-department management package.",
      ru: "Не гарантирует доход, occupancy или торговый результат и не является пакетом управления всеми отделами.",
      zh: "不保證收益、住房率或營運結果，也不是涵蓋所有部門的管理套餐。",
    },
  },
  {
    href: "/solutions/hotel-systems-implementation",
    tag: {
      th: "Systems & Data",
      en: "Systems & Data",
      ru: "Systems & Data",
      zh: "Systems & Data",
    },
    summary: {
      th: "ทบทวนระบบ เส้นทางข้อมูล และการจับคู่ข้อมูล เมื่อ PMS, Channel Manager, OTA หรือรายงานยังไม่สอดคล้องกัน",
      en: "Reviews systems, data paths, and mapping when PMS, channel manager, OTA, or reporting still do not line up.",
      ru: "Обзор систем, путей данных и mapping, когда PMS, channel manager, OTA или отчёты всё ещё не согласованы.",
      zh: "當 PMS、通路管理員、OTA 或報表仍不一致時，檢視系統、資料路徑與對應。",
    },
    honest: "needs-mapping",
    boundary: {
      th: "ข้อมูลไม่ไหลครบทุกจุดโดยอัตโนมัติ — ขึ้นกับผู้ให้บริการ API/ตัวเชื่อม การจับคู่ สิทธิ์ และขอบเขตที่ตกลง",
      en: "Data does not flow across every system automatically — depends on provider, API/connector, mapping, permission, and agreed scope.",
      ru: "Данные не текут по всем системам автоматически — зависят от провайдера, API/коннектора, mapping, доступа и объёма.",
      zh: "資料不會在每個系統間自動流動——取決於供應商、API／連接器、對應、權限與約定範圍。",
    },
  },
  {
    href: "/solutions/hotel-ai-automation",
    tag: {
      th: "Workflow Automation",
      en: "Workflow Automation",
      ru: "Workflow Automation",
      zh: "Workflow Automation",
    },
    summary: {
      th: "เริ่มจากเวิร์กโฟลว์และปัญหาทางธุรกิจ แล้วค่อยเลือกเทคโนโลยี ทดลอง วัดผล และมีคนตรวจทาน — ไม่ใช่ AI ทำงานแทนทีมทั้งหมด",
      en: "Starts from a real workflow and business problem, then technology choice, trial, measurement, and human review — not fully autonomous AI for every process.",
      ru: "Начинается с реального workflow и бизнес-проблемы, затем выбор технологии, пробный запуск, измерение и проверка человеком — не полностью автономный AI для всех процессов.",
      zh: "先從真實流程與業務問題開始，再選技術、試作、衡量並由人覆核——不是每項流程都由 AI 全自動取代團隊。",
    },
    honest: "subject-to-verification",
    boundary: {
      th: "ต้องตรวจทางเทคนิคและขอบเขตงานจริง ไม่สัญญาว่า Automation ใช้ได้กับทุกเวิร์กโฟลว์",
      en: "Subject to technical verification and the real work scope. Automation is not promised for every workflow.",
      ru: "Требует технической проверки и реального объёма работы. Automation не обещается для каждого workflow.",
      zh: "須經技術驗證與實際工作範圍確認；不承諾自動化適用於每一個流程。",
    },
  },
  {
    href: "/solutions/hotel-training-team-development",
    tag: {
      th: "People / Training",
      en: "People / Training",
      ru: "People / Training",
      zh: "People / Training",
    },
    summary: {
      th: "ออกแบบการเรียนรู้จากเป้าหมาย บทบาท และงานที่ทีมต้องทำได้ พร้อมฝึก ประเมิน และติดตามตามขอบเขต — ไม่ใช่คำสัญญาผลรายได้หรือใบรับรองสำเร็จรูป",
      en: "Designs learning from goals, roles, and the work the team must perform, with practice, assessment, and follow-up in scope — not a revenue promise or ready-made certificate.",
      ru: "Обучение строится от целей, ролей и работы команды, с практикой, оценкой и follow-up в объёме — не обещание дохода и не готовый сертификат.",
      zh: "依目標、角色與團隊必須執行的工作設計學習，並在範圍內練習、評估與追蹤——不是收益保證或現成證書。",
    },
    honest: "sample-workflow",
    boundary: {
      th: "การติดตามหลังเรียนมีได้ตามแพ็กเกจที่เลือก ไม่ใช่ชุดส่งมอบมาตรฐานของทุกงาน",
      en: "Post-training follow-up depends on the selected package. It is not a standard deliverable for every engagement.",
      ru: "Follow-up после обучения зависит от выбранного пакета. Это не стандартная поставка для каждого проекта.",
      zh: "課後追蹤依所選方案而定，不是每個專案的標準交付。",
    },
  },
];

export function systemsCategoryCard(href: string) {
  return SYSTEMS_CATEGORY_CARDS.find((card) => card.href === href);
}
