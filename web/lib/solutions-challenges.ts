import type { Locale } from "@/lib/seo";

export type SolutionChallengeId =
  | "revenue"
  | "visibility"
  | "booking-journey"
  | "systems"
  | "team"
  | "unsure";

export type SolutionChallengeMatch = {
  href: string;
  reason: Record<Locale, string>;
};

export type SolutionChallenge = {
  id: SolutionChallengeId;
  label: Record<Locale, string>;
  matches: SolutionChallengeMatch[];
};

/** Challenge → related services (advisory, not a diagnosis). */
export const SOLUTION_CHALLENGES: SolutionChallenge[] = [
  {
    id: "revenue",
    label: {
      th: "ต้องการบริหารรายได้ ราคา หรือช่องทางขายให้ชัดขึ้น",
      en: "Need clearer revenue, pricing, or sales-channel management",
      ru: "Нужно яснее управлять доходом, ценой или каналами продаж",
      zh: "希望把收益、價格或銷售通路管理得更清楚",
    },
    matches: [
      {
        href: "/solutions/revenue-commercial-management",
        reason: {
          th: "ช่วยดูราคา ช่องทาง และรายได้ในภาพเดียวก่อนตัดสินใจ",
          en: "Helps review rate, channels, and revenue in one view before decisions.",
          ru: "Помогает видеть цену, каналы и доход вместе до решений.",
          zh: "協助在同一個視角檢視價格、通路與收益後再決策。",
        },
      },
      {
        href: "/solutions/outsourced-hotel-reservations",
        reason: {
          th: "เมื่องานจองจากหลายช่องทางต้องมีคนติดตามจนจบ",
          en: "Useful when booking questions from many channels need follow-through.",
          ru: "Полезно, когда вопросы брони из разных каналов нужно доводить до конца.",
          zh: "適合多通路訂房詢問需要有人追到結果時。",
        },
      },
      {
        href: "/solutions/b2b-agent-sales",
        reason: {
          th: "เมื่ออยากรู้ว่าเอเจนต์หรือคู่ค้ารายใดสร้างรายได้จริง",
          en: "Useful when you need to see which agents or partners actually create revenue.",
          ru: "Полезно, когда нужно понять, какие агенты или партнёры дают доход.",
          zh: "適合想看清哪些旅行社或夥伴真正帶來收益時。",
        },
      },
    ],
  },
  {
    id: "visibility",
    label: {
      th: "ต้องการเพิ่ม Visibility, Website Traffic หรือประสิทธิภาพแคมเปญ",
      en: "Need more visibility, website traffic, or stronger campaign performance",
      ru: "Нужно больше видимости, трафика сайта или эффективности кампаний",
      zh: "希望提升曝光、網站流量或活動成效",
    },
    matches: [
      {
        href: "/solutions/google-ads-management",
        reason: {
          th: "เมื่อมีคนกำลังค้นหาที่พัก และอยากเชื่อมโฆษณากับเส้นทางจอง",
          en: "Useful when people are already searching and ads should connect to booking.",
          ru: "Полезно, когда люди уже ищут жильё и реклама должна вести к брони.",
          zh: "適合已有人在搜尋住宿、並希望廣告接到預訂路徑時。",
        },
      },
      {
        href: "/solutions/meta-ads-management",
        reason: {
          th: "เมื่ออยากให้คนที่ใช่เห็นข้อเสนอและมีทางสอบถามหรือจองต่อ",
          en: "Useful when the right people need to see the offer and a clear enquire/book path.",
          ru: "Полезно, когда нужные люди должны увидеть предложение и путь к запросу или брони.",
          zh: "適合希望對的人看到方案，並有清楚詢問或預訂路徑時。",
        },
      },
      {
        href: "/solutions/hotel-seo-google-maps-ai-search",
        reason: {
          th: "เมื่อการค้นหา เว็บไซต์ และ Google Maps ยังไม่ตอบคำถามเดียวกัน",
          en: "Useful when search, the website, and Google Maps do not answer the same questions.",
          ru: "Полезно, когда поиск, сайт и Google Maps отвечают по-разному.",
          zh: "適合搜尋、網站與 Google Maps 尚未回答同一組問題時。",
        },
      },
    ],
  },
  {
    id: "booking-journey",
    label: {
      th: "ต้องการปรับเส้นทางการจองตรง / Booking Journey",
      en: "Need to improve the direct booking / booking journey",
      ru: "Нужно улучшить путь прямого бронирования",
      zh: "希望改善直銷預訂／Booking Journey",
    },
    matches: [
      {
        href: "/solutions/hotel-website-design",
        reason: {
          th: "เมื่อเว็บไซต์ยังไม่ช่วยให้ลูกค้ามั่นใจก่อนจอง",
          en: "Useful when the website does not yet help guests feel sure before booking.",
          ru: "Полезно, когда сайт ещё не помогает гостю уверенно бронировать.",
          zh: "適合網站尚未協助客人在預訂前更有把握時。",
        },
      },
      {
        href: "/solutions/hotel-direct-bookings",
        reason: {
          th: "เมื่อมีคนเข้าเว็บแล้ว แต่ยังไม่ชัดว่าหยุดตรงไหนก่อนจองสำเร็จ",
          en: "Useful when people reach the site but it is unclear where they stop before booking.",
          ru: "Полезно, когда люди заходят на сайт, но непонятно, где останавливаются до брони.",
          zh: "適合已有人進站，卻不清楚在完成預訂前停在哪一步時。",
        },
      },
      {
        href: "/solutions/revenue-commercial-management",
        reason: {
          th: "เมื่อราคาและข้อเสนอต้องสอดคล้องกับเส้นทางจองตรง",
          en: "Useful when rate and offer need to align with the direct booking path.",
          ru: "Полезно, когда цена и предложение должны совпадать с путём прямой брони.",
          zh: "適合價格與方案需要與直銷預訂路徑一致時。",
        },
      },
    ],
  },
  {
    id: "systems",
    label: {
      th: "ระบบและข้อมูลหลายแหล่งยังไม่เชื่อมกัน",
      en: "Systems and data from multiple sources are not connected yet",
      ru: "Системы и данные из разных источников ещё не связаны",
      zh: "多個系統與資料來源尚未串接",
    },
    matches: [
      {
        href: "/solutions/hotel-systems-implementation",
        reason: {
          th: "เมื่อประเภทห้อง ราคา หรือห้องว่างในแต่ละระบบไม่ตรงกัน",
          en: "Useful when room types, rates, or availability do not match across systems.",
          ru: "Полезно, когда типы номеров, цены или наличие в системах не совпадают.",
          zh: "適合各系統的房型、價格或空房對不上時。",
        },
      },
      {
        href: "/solutions/hotel-ai-automation",
        reason: {
          th: "เมื่อรายงานหรือการส่งต่องานยังทำมือและอยากเริ่มจากงานจริง",
          en: "Useful when reporting or handovers are still manual and work should start from real tasks.",
          ru: "Полезно, когда отчёты или передача работы всё ещё ручные и нужно начать с реальных задач.",
          zh: "適合報表或交接仍靠手動、並希望從真實工作開始時。",
        },
      },
      {
        href: "/solutions/independent-hotel-management",
        reason: {
          th: "เมื่อเจ้าของต้องการระบบงานที่ชัดขึ้นในการดูแลโรงแรม",
          en: "Useful when an owner needs a clearer operating system for running the hotel.",
          ru: "Полезно, когда владельцу нужна более ясная система управления отелем.",
          zh: "適合業主需要更清楚的飯店營運系統時。",
        },
      },
    ],
  },
  {
    id: "team",
    label: {
      th: "ทีมต้องการทักษะหรือขั้นตอนทำงานใหม่",
      en: "The team needs new skills or clearer ways of working",
      ru: "Команде нужны новые навыки или более ясный способ работы",
      zh: "團隊需要新技能或更清楚的工作方式",
    },
    matches: [
      {
        href: "/solutions/hotel-training-team-development",
        reason: {
          th: "เมื่ออยากพัฒนาทักษะให้ใช้กับงานจริงและมีติดตามผล",
          en: "Useful when skills need practice on real work, with follow-up.",
          ru: "Полезно, когда навыки нужно отрабатывать на реальной работе с последующим сопровождением.",
          zh: "適合希望把技能練回實際工作，並有後續追蹤時。",
        },
      },
      {
        href: "/solutions/independent-hotel-management",
        reason: {
          th: "เมื่อทีมบริหารต้องการกรอบงานและความรับผิดชอบที่ชัดขึ้น",
          en: "Useful when the management team needs clearer ownership and operating rhythm.",
          ru: "Полезно, когда управляющей команде нужны более ясные роли и ритм работы.",
          zh: "適合管理團隊需要更清楚的責任與運作節奏時。",
        },
      },
      {
        href: "/solutions/hotel-ai-automation",
        reason: {
          th: "เมื่ออยากลดงานซ้ำและให้ทีมโฟกัสงานที่ตัดสินใจได้",
          en: "Useful when repetitive work should drop so the team can focus on decisions.",
          ru: "Полезно, когда нужно снизить повторяющуюся работу и дать команде фокус на решения.",
          zh: "適合希望減少重複作業、讓團隊專注可決策的工作時。",
        },
      },
    ],
  },
  {
    id: "unsure",
    label: {
      th: "ยังไม่แน่ใจ ต้องการให้ช่วยประเมิน",
      en: "Not sure yet — need help assessing where to start",
      ru: "Пока не уверены — нужна помощь оценить, с чего начать",
      zh: "還不確定，希望先協助評估起點",
    },
    matches: [
      {
        href: "/solutions/revenue-commercial-management",
        reason: {
          th: "มักเป็นจุดเริ่มเมื่อยังไม่ชัดว่ารายได้รั่วตรงไหน",
          en: "A common starting point when it is unclear where revenue is leaking.",
          ru: "Частая точка старта, когда непонятно, где теряется доход.",
          zh: "當還不清楚收益流失在哪時，常是起點之一。",
        },
      },
      {
        href: "/solutions/hotel-direct-bookings",
        reason: {
          th: "มักเกี่ยวข้องเมื่ออยากรู้ว่าลูกค้าหยุดตรงไหนก่อนจอง",
          en: "Often relevant when you want to see where guests stop before booking.",
          ru: "Часто полезно, когда нужно понять, где гости останавливаются до брони.",
          zh: "想看客人在預訂前停在哪一步時，常會相關。",
        },
      },
      {
        href: "/solutions/hotel-systems-implementation",
        reason: {
          th: "มักเกี่ยวข้องเมื่อข้อมูลหลายระบบยังทำให้ตัดสินใจช้า",
          en: "Often relevant when multi-system data still slows decisions.",
          ru: "Часто полезно, когда данные из разных систем замедляют решения.",
          zh: "多系統資料仍讓決策變慢時，常會相關。",
        },
      },
    ],
  },
];
