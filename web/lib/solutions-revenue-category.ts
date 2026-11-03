import type { Locale } from "@/lib/seo";

export const REVENUE_CATEGORY_ID = "grow-revenue";

export const REVENUE_CATEGORY_VISUAL = {
  src: "/images/hotel-solutions-revenue-sales-placeholder.webp",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  label: "Revenue & Sales Workflow — Sample / Redacted",
  alt: {
    th: "แผนภาพตัวอย่างขั้นตอน Revenue & Sales จากข้อมูลความต้องการและการจอง ไปสู่การตัดสินใจราคาและช่องทาง การลงมือของทีม และการทบทวนผล — ไม่ใช่ตัวเลขโรงแรมจริง",
    en: "Sample Revenue & Sales workflow from demand and booking data to rate and channel decisions, team action, and performance review — not real hotel figures",
    ru: "Примерный процесс Revenue & Sales: данные спроса и бронирований → решение по цене и каналу → действие команды → обзор результата. Не реальные цифры отеля",
    zh: "收益與銷售流程示意：需求／訂房資料 → 價格／通路決策 → 團隊執行 → 績效檢視——非真實飯店數字",
  },
  note: {
    th: "แผนภาพตัวอย่าง / ข้อมูลที่ redact แล้ว — ไม่แสดง Occupancy, ADR, RevPAR หรือรายได้จริงของลูกค้า",
    en: "Sample / redacted workflow — no client occupancy, ADR, RevPAR, or revenue figures",
    ru: "Пример / redacted — без Occupancy, ADR, RevPAR или выручки клиента",
    zh: "示意／已遮罩流程——不含客戶實際住房率、ADR、RevPAR 或營收數字",
  },
} as const;

/** Editable category flow — process labels only, no invented metrics. */
export const REVENUE_CATEGORY_FLOW = [
  {
    id: "demand",
    en: "Demand / Booking Data",
    th: "ข้อมูลความต้องการ / การจอง",
    ru: "Спрос / данные брони",
    zh: "需求／訂房資料",
  },
  {
    id: "decision",
    en: "Rate / Channel Decision",
    th: "ตัดสินใจราคา / ช่องทาง",
    ru: "Цена / канал",
    zh: "價格／通路決策",
  },
  {
    id: "action",
    en: "Team Action",
    th: "ทีมลงมือทำ",
    ru: "Действие команды",
    zh: "團隊執行",
  },
  {
    id: "review",
    en: "Performance Review",
    th: "ทบทวนผล",
    ru: "Обзор результата",
    zh: "績效檢視",
  },
] as const;

export type RevenueCategoryCard = {
  href: string;
  problem: Record<Locale, string>;
  suitableFor: Record<Locale, string>;
  deliverable: Record<Locale, string>;
  prepare: Record<Locale, string>;
};

/**
 * Text-first cards for Grow Revenue only.
 * Names/routes come from nav; copy stays advisory and scope-dependent.
 */
export const REVENUE_CATEGORY_CARDS: RevenueCategoryCard[] = [
  {
    href: "/solutions/revenue-commercial-management",
    problem: {
      th: "เมื่ออยากเพิ่มรายได้ แต่ยังดูแค่ราคา หรือยังไม่เห็นว่า OTA การจองตรง การตลาด และระบบควรทำงานร่วมกันอย่างไร",
      en: "When the hotel wants more revenue, but still looks only at the rate, or cannot yet see how OTAs, direct booking, marketing, and systems should work together.",
      ru: "Когда отелю нужно больше дохода, но пока смотрят только цену или ещё не видно, как OTA, прямое бронирование, маркетинг и системы должны работать вместе.",
      zh: "當飯店想增加收益，卻還只看價格，或還沒看清 OTA、直銷預訂、行銷與系統該如何一起運作。",
    },
    suitableFor: {
      th: "เจ้าของ ผู้จัดการ หรือทีมรายได้/การค้าที่ต้องการภาพราคา ช่องทาง และรายได้ในที่เดียวก่อนตัดสินใจ",
      en: "Owners, GMs, or revenue/commercial leads who need one view of rate, channels, and revenue before deciding.",
      ru: "Владельцам, управляющим или команде дохода/коммерции, которым нужна одна картина цены, каналов и дохода до решений.",
      zh: "業主、總經理或收益／商務團隊，需要在決策前把價格、通路與收益放在同一視角。",
    },
    deliverable: {
      th: "ตามขอบเขตที่ตกลง — เช่น Revenue Snapshot จุดที่ควรดูต่อ และขั้นตอนทบทวนตัวเลขที่ใช้ติดตาม",
      en: "Subject to agreed scope — for example a revenue snapshot, next priorities to review, and a cadence for checking the numbers used to track progress.",
      ru: "В согласованном объёме — например снимок дохода, приоритеты к просмотру и ритм проверки чисел для контроля.",
      zh: "依約定範圍——例如收益總覽、接下來要檢視的重點，以及用來追蹤的數字檢視節奏。",
    },
    prepare: {
      th: "เตรียมชื่อโรงแรม จำนวนห้อง ลิงก์ที่พัก และรายงานจาก PMS / Channel Manager ที่ทีมใช้อยู่",
      en: "Prepare the hotel name, room count, property link, and the PMS / channel-manager reports the team already uses.",
      ru: "Подготовьте название отеля, число номеров, ссылку на объект и отчёты PMS / channel manager, которыми команда уже пользуется.",
      zh: "準備飯店名稱、客房數、住宿連結，以及團隊既有的 PMS／通路管理員報表。",
    },
  },
  {
    href: "/solutions/outsourced-hotel-reservations",
    problem: {
      th: "เมื่อทีมหน้างานต้องสลับดูแลแขกกับงานจอง หรือคำถามจากหลายช่องทางยังไม่มีคนติดตามจนจบ",
      en: "When the floor team has to switch between the guest in front of them and booking questions, or nobody follows those questions through.",
      ru: "Когда команда на стойке переключается между гостем и вопросами о брони, или никто не ведёт эти вопросы до результата.",
      zh: "當現場團隊必須在眼前的客人與訂房詢問之間切換，或沒有人把這些詢問追到結果。",
    },
    suitableFor: {
      th: "โรงแรมที่ต้องการทีมช่วยดูแลคำถามและการจองบนช่องทางที่ตกลง โดยทีมหน้างานยังโฟกัสแขกตรงหน้าได้",
      en: "Hotels that need cover for booking questions on agreed channels so the floor team can stay with the guest in front of them.",
      ru: "Отелям, которым нужна поддержка вопросов о брони на согласованных каналах, чтобы команда на стойке могла оставаться с гостем.",
      zh: "需要在約定通路上有人承接訂房詢問的飯店，讓現場團隊能專注眼前客人。",
    },
    deliverable: {
      th: "ตามขอบเขตที่ตกลง — เช่น รับคำถาม ตรวจห้องว่าง บันทึกการจอง ยืนยัน และส่งต่อข้อมูลให้ทีมโรงแรม",
      en: "Subject to agreed scope — for example enquiry handling, availability checks, booking entry, confirmation, and handover to the hotel team.",
      ru: "В согласованном объёме — например обработка запросов, проверка наличия, ввод брони, подтверждение и передача команде отеля.",
      zh: "依約定範圍——例如受理詢問、查空房、登錄訂房、確認，以及交接給飯店團隊。",
    },
    prepare: {
      th: "เตรียมห้อง ราคา และเงื่อนไขที่อนุมัติแล้ว ช่องทางที่อยู่ในขอบเขต ชั่วโมงดูแล และวิธีส่งต่องานนอกขอบเขต",
      en: "Prepare approved rooms, rates and conditions, channels in scope, hours of cover, and how out-of-scope work is handed back.",
      ru: "Подготовьте утверждённые номера, цены и условия, каналы в объёме услуги, часы покрытия и передачу задач вне объёма.",
      zh: "準備已核准的房型、價格與條件、服務範圍內的通路、服務時段，以及範圍外工作的交接方式。",
    },
  },
  {
    href: "/solutions/b2b-agent-sales",
    problem: {
      th: "เมื่อยังไม่แน่ใจว่าควรเพิ่มเอเยนต์ หรือมีพาร์ตเนอร์อยู่แล้วแต่ยังไม่เห็นว่ารายใดสร้างรายได้จริง",
      en: "When the hotel is not sure it should add more agents, or already has partners and still cannot see who actually creates revenue.",
      ru: "Когда отель не уверен, что нужно добавлять агентов, или партнёры уже есть, но непонятно, кто реально даёт доход.",
      zh: "當飯店還不確定該不該再加旅行社，或已有夥伴卻看不出哪一家真的帶來收益。",
    },
    suitableFor: {
      th: "โรงแรมที่ต้องการจัดพาร์ตเนอร์ เอเจนต์ หรือคู่ค้าให้ชัดขึ้น โดยโรงแรมยังเป็นผู้อนุมัติราคาและข้อตกลง",
      en: "Hotels that need clearer partner, agent, or trade relationships, while the hotel still approves rates and agreements.",
      ru: "Отелям, которым нужны более ясные отношения с партнёрами и агентами, при этом отель утверждает цены и соглашения.",
      zh: "需要把旅行社／夥伴關係理清楚的飯店，且價格與協議仍由飯店核准。",
    },
    deliverable: {
      th: "ตามขอบเขตที่ตกลง — เช่น รายชื่อพาร์ตเนอร์เป้าหมาย แผ่นราคา B2B ชุดข้อมูลขาย และการทบทวนผลความร่วมมือ",
      en: "Subject to agreed scope — for example a target partner list, B2B rate sheet, sales kit, and a partner performance review.",
      ru: "В согласованном объёме — например список целевых партнёров, B2B rate sheet, sales kit и обзор результата сотрудничества.",
      zh: "依約定範圍——例如目標夥伴名單、B2B 價目、銷售資料組，以及合作績效檢視。",
    },
    prepare: {
      th: "เตรียมจำนวนห้อง ตลาดหลัก ฤดูกาล ช่องทางปัจจุบัน และผู้มีอำนาจอนุมัติราคา ค่าคอมมิชชัน และข้อตกลง",
      en: "Prepare room count, main markets, season, current channels, and who can approve rates, commission, and agreements.",
      ru: "Подготовьте число номеров, основные рынки, сезон, текущие каналы и кто утверждает цены, комиссию и соглашения.",
      zh: "準備客房數、主要市場、淡旺季、現有通路，以及可核准價格、佣金與協議的窗口。",
    },
  },
];

export function revenueCategoryCard(href: string) {
  return REVENUE_CATEGORY_CARDS.find((card) => card.href === href);
}
