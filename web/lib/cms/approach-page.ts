import type { Locale } from "@/lib/seo";

export const APPROACH_CMS_TEMPLATE = "approach-page";
export const APPROACH_PAGE_SLUG = "approach";
export const APPROACH_PAGE_ROUTE = "/approach";
export const APPROACH_CMS_INTENTS = ["save", "draft", "publish", "unpublish"] as const;
export type ApproachCmsIntent = (typeof APPROACH_CMS_INTENTS)[number];
export type ApproachCmsSaveResult =
  | { ok: true; id: string; intent: ApproachCmsIntent }
  | { ok: false; error: string };

export type ApproachLocalized = { th: string; en: string; ru: string; zh: string };

export type CmsApproachStep = {
  id: string;
  num: string;
  title: ApproachLocalized;
  body: ApproachLocalized;
  output: ApproachLocalized;
};

export type CmsApproachExampleStep = {
  id: string;
  num: string;
  label: ApproachLocalized;
  text: ApproachLocalized;
  output: ApproachLocalized;
};

export type CmsApproachReceiveItem = {
  id: string;
  text: ApproachLocalized;
};

export type CmsApproachPage = {
  version: 1;
  template: typeof APPROACH_CMS_TEMPLATE;
  hero: {
    eyebrow: ApproachLocalized;
    titleLead: ApproachLocalized;
    titleRest: ApproachLocalized;
    titleAccent: ApproachLocalized;
    lead: ApproachLocalized;
    subline: ApproachLocalized;
    photoAlt: ApproachLocalized;
  };
  method: {
    title: ApproachLocalized;
    steps: CmsApproachStep[];
  };
  example: {
    eyebrow: ApproachLocalized;
    title: ApproachLocalized;
    lead: ApproachLocalized;
    caption: ApproachLocalized;
    frameworkNote: ApproachLocalized;
    steps: CmsApproachExampleStep[];
  };
  closer: {
    close: ApproachLocalized;
    receiveTitle: ApproachLocalized;
    receive: CmsApproachReceiveItem[];
    cta: ApproachLocalized;
  };
};

export type ApproachPageCopy = {
  eyebrow: string;
  titleLead: string;
  titleRest: string;
  titleAccent: string;
  lead: string;
  subline: string;
  photoAlt: string;
  method: string;
  steps: Array<{ num: string; title: string; body: string; output: string }>;
  exampleEyebrow: string;
  exampleTitle: string;
  exampleLead: string;
  exampleCaption: string;
  exampleFrameworkNote: string;
  exampleSteps: Array<{ num: string; label: string; text: string; output: string }>;
  close: string;
  receiveTitle: string;
  receive: string[];
  cta: string;
};

export type ApproachEditorState = {
  documentId: string;
  title: string;
  status: string;
  seoTitle: string;
  metaDescription: string;
  content: CmsApproachPage;
};

export function emptyApproachLocalized(seed = ""): ApproachLocalized {
  return { th: seed, en: seed, ru: seed, zh: seed };
}

function loc(th: string, en: string, ru = en, zh = en): ApproachLocalized {
  return { th, en, ru, zh };
}

export function pickApproachLocalized(value: ApproachLocalized | undefined, locale: Locale): string {
  if (!value) return "";
  const direct = value[locale]?.trim();
  if (direct) return direct;
  if (locale === "th") return value.th?.trim() || value.en?.trim() || "";
  return value.en?.trim() || value.th?.trim() || "";
}

function asLocalized(value: unknown, fallback: ApproachLocalized): ApproachLocalized {
  if (!value || typeof value !== "object") return fallback;
  const row = value as Partial<ApproachLocalized>;
  return {
    th: typeof row.th === "string" ? row.th : fallback.th,
    en: typeof row.en === "string" ? row.en : fallback.en,
    ru: typeof row.ru === "string" ? row.ru : fallback.ru,
    zh: typeof row.zh === "string" ? row.zh : fallback.zh,
  };
}

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultApproachCms(): CmsApproachPage {
  return {
    version: 1,
    template: APPROACH_CMS_TEMPLATE,
    hero: {
      eyebrow: loc("Revenue & Commercial Management", "Revenue & Commercial Management"),
      titleLead: loc(
        "บริหารราคาและช่องทางการขายให้ชัด",
        "Make pricing and distribution clear, so every revenue decision is backed by data",
        "Сделать цену и дистрибуцию ясными, чтобы каждое решение по доходу опиралось на данные",
        "讓價格與通路清楚，每項收益決策都有資料支撐",
      ),
      titleRest: loc("ทุกการตัดสินใจด้านรายได้มี", "", "", ""),
      titleAccent: loc("ข้อมูลรองรับ", "", "", ""),
      lead: loc(
        "ราคา ช่องทางการขาย และ Demand จะสร้างรายได้ได้เต็มที่ เมื่อทีมโรงแรมเห็นข้อมูลชุดเดียวกัน รู้ว่าใครรับผิดชอบ และวัดผลได้ทั้ง ADR, Occupancy และรายได้สุทธิหลังหักค่าคอมมิชชัน",
        "Pricing, channels, and demand deliver their full revenue potential when your hotel team works from the same data, knows who owns each action, and can measure results across ADR, occupancy, and net revenue after commissions.",
        "Цена, каналы и спрос дают полный доход, когда команда отеля работает с одним набором данных, знает, кто за что отвечает, и может измерить ADR, загрузку и чистый доход после комиссии.",
        "當飯店團隊用同一組資料做事、知道誰負責、並能量 ADR、住房率與扣除佣金後的淨收益時，價格、通路與需求才能把收益做滿。",
      ),
      subline: loc(
        "ขายห้องให้ถูกคน ในราคาที่เหมาะสม ผ่านช่องทางที่คุ้มค่าที่สุด",
        "Sell the right room to the right guest, at the right price, through the most profitable channel.",
        "Продавать нужный номер нужному гостю, по нужной цене, через самый выгодный канал.",
        "把對的房間，用對的價格，透過最划算的通路，賣給對的客人。",
      ),
      photoAlt: loc(
        "ตัวอย่างแดชบอร์ดทบทวน Occupancy Forecast และ Booking Pace มุมมอง 60 วัน เทียบเป้า 75 เปอร์เซ็นต์ ข้อมูลตัวอย่าง",
        "Sample dashboard reviewing occupancy forecast and booking pace for a 60-day outlook, compared with a 75 percent target. Sample data.",
      ),
    },
    method: {
      title: loc(
        "แนวทางการทำงานของ เดอะ เคพีไอ พลัส",
        "The KPI Plus Approach",
        "Подход The KPI Plus",
        "The KPI Plus 的做法",
      ),
      steps: [
        {
          id: "step-01",
          num: "01",
          title: loc(
            "อ่านสัญญาณให้ชัด",
            "Read the signals clearly",
            "Ясно прочитать сигналы",
            "把訊號看清楚",
          ),
          body: loc(
            "ดู Booking Pace, Pickup, Forecast, Market Demand และ Channel Mix ในภาพเดียวกัน เพื่อแยกให้ออกว่าแรงกดดันมาจากราคา Demand หรือช่องทางการขาย",
            "Look at booking pace, pickup, forecast, market demand, and channel mix in one view, so you can tell whether the pressure is coming from price, demand, or distribution.",
            "Смотреть booking pace, pickup, прогноз, спрос рынка и channel mix в одной картине, чтобы понять, давление идёт от цены, спроса или дистрибуции.",
            "把 Booking Pace、Pickup、預測、市場需求與 Channel Mix 看成同一張圖，才能分辨壓力來自價格、需求還是通路。",
          ),
          output: loc(
            "Booking Pace / Pickup / Demand Review",
            "Booking Pace / Pickup / Demand Review",
          ),
        },
        {
          id: "step-02",
          num: "02",
          title: loc(
            "เลือกสิ่งที่ควรทำต่อ",
            "Choose the next move",
            "Выбрать следующий шаг",
            "選擇下一步",
          ),
          body: loc(
            "ตัดสินใจว่าควรปรับ Pricing, Restriction, Inventory Allocation หรือ Channel Strategy แล้วเปลี่ยนเป็นงานที่มีเจ้าของชัดเจน",
            "Decide whether to adjust pricing, restrictions, inventory allocation, or channel strategy, then turn that decision into actions with clear owners.",
            "Решить, менять цену, ограничения, распределение номеров или стратегию каналов, затем превратить это в работу с ясным владельцем.",
            "決定該調整價格、限制、庫存分配或通路策略，再把決定變成有明確負責人的工作。",
          ),
          output: loc(
            "Pricing, Restriction และ Channel Action",
            "Pricing, Restriction and Channel Action",
          ),
        },
        {
          id: "step-03",
          num: "03",
          title: loc(
            "เชื่อมงานที่เกี่ยวข้อง",
            "Connect the work",
            "Связать работу",
            "把相關工作連起來",
          ),
          body: loc(
            "ให้ทีม Revenue, Sales, Reservation และ Marketing ทำงานบนข้อมูลเดียวกัน พร้อมเชื่อม PMS, Channel Manager, RMS และ Booking Engine ให้ราคาและ Inventory ตรงกันทุกช่องทาง",
            "Get Revenue, Sales, Reservations, and Marketing working from the same data, and connect your PMS, channel manager, RMS, and booking engine so rates and inventory stay consistent across every channel.",
            "Чтобы Revenue, Sales, Reservations и Marketing работали с одними данными, а PMS, channel manager, RMS и booking engine держали цену и наличие одинаковыми во всех каналах.",
            "讓 Revenue、Sales、Reservations 與 Marketing 用同一組資料工作，並串接 PMS、Channel Manager、RMS 與 Booking Engine，讓各通路的價格與庫存一致。",
          ),
          output: loc(
            "Revenue, Sales, Reservation และ Marketing Alignment",
            "Revenue, Sales, Reservation and Marketing Alignment",
          ),
        },
        {
          id: "step-04",
          num: "04",
          title: loc(
            "วัดการเปลี่ยนแปลง",
            "Measure the change",
            "Измерить изменение",
            "衡量變化",
          ),
          body: loc(
            "ติดตาม RevPAR, Net RevPAR, ADR, Occupancy และต้นทุนต่อการจองของแต่ละช่องทาง แล้วทบทวนผลเพื่อกำหนดเรื่องสำคัญลำดับถัดไป",
            "Track RevPAR, net RevPAR, ADR, occupancy, and cost of acquisition by channel, then review results to set the next priority.",
            "Следить за RevPAR, net RevPAR, ADR, загрузкой и стоимостью брони по каналам, затем пересматривать результат и ставить следующий приоритет.",
            "追蹤 RevPAR、Net RevPAR、ADR、住房率與各通路的獲客成本，再回顧結果以決定下一件優先事項。",
          ),
          output: loc(
            "RevPAR, Net RevPAR, ADR และ Occupancy Review",
            "RevPAR, Net RevPAR, ADR and Occupancy Review",
          ),
        },
      ],
    },
    example: {
      eyebrow: loc("ตัวอย่าง", "Example", "Пример", "例子"),
      title: loc(
        "เมื่อ Occupancy ในอีก 60 วันข้างหน้าต่ำกว่าเป้า",
        "When occupancy for the next 60 days is falling short of target",
        "Когда загрузка на ближайшие 60 дней ниже цели",
        "當未來 60 天住房率低於目標",
      ),
      lead: loc(
        "แทนที่จะลดราคาทุกช่องทางในทันที เดอะ เคพีไอ พลัส ช่วยทีมโรงแรมหาต้นเหตุก่อน แล้ววางแผนที่เพิ่มยอดจองโดยยังรักษา ADR และรายได้สุทธิไว้ได้",
        "Instead of cutting rates across every channel right away, The KPI Plus helps your team find the root cause first, then build a plan that lifts bookings while protecting ADR and net revenue.",
        "Вместо того чтобы сразу снижать цену во всех каналах, The KPI Plus помогает команде сначала найти причину, затем построить план, который поднимает брони и защищает ADR и чистый доход.",
        "不必立刻在所有通路降價。The KPI Plus 會先幫團隊找出原因，再擬定能提高預訂、同時保護 ADR 與淨收益的計畫。",
      ),
      caption: loc(
        "ใช้มุมมองนี้เพื่อระบุวันที่ควรตัดสินใจเรื่องราคา ช่องทาง หรือ Promotion",
        "Use this view to identify dates that need a pricing or channel action",
      ),
      frameworkNote: loc(
        "ตัวอย่าง Framework สำหรับวิเคราะห์จุดที่ควรดำเนินการต่อ",
        "Sample framework for analysing where to act next",
      ),
      steps: [
        {
          id: "example-01",
          num: "01",
          label: loc("DEMAND", "DEMAND"),
          text: loc(
            "ดู Booking Pace และ Pickup เทียบกับปีก่อนและ Budget",
            "Check booking pace and pickup against last year and budget",
            "Сравнить booking pace и pickup с прошлым годом и бюджетом",
            "把 Booking Pace 與 Pickup 對去年和 Budget 比較",
          ),
          output: loc("Demand Review", "Demand Review"),
        },
        {
          id: "example-02",
          num: "02",
          label: loc("DEMAND", "DEMAND"),
          text: loc(
            "ดู Market Demand ทั้งฤดูกาล อีเวนต์ และเที่ยวบินเข้าพื้นที่",
            "Review market demand, including seasonality, events, and inbound flights",
            "Посмотреть спрос рынка: сезон, события и входящие рейсы",
            "看市場需求，包括淡旺季、活動與入境航班",
          ),
          output: loc("Demand Review", "Demand Review"),
        },
        {
          id: "example-03",
          num: "03",
          label: loc("PRICING", "PRICING"),
          text: loc(
            "ตรวจ Competitor Rate Positioning",
            "Check competitor rate positioning",
            "Проверить позиционирование цены конкурентов",
            "檢查競爭對手的價格定位",
          ),
          output: loc("Pricing Action", "Pricing Action"),
        },
        {
          id: "example-04",
          num: "04",
          label: loc("CHANNEL", "CHANNEL"),
          text: loc(
            "ทบทวน Channel Performance: สัดส่วน Direct กับ OTA, Conversion และต้นทุนต่อการจอง",
            "Review channel performance: direct vs. OTA mix, conversion, and cost per booking",
            "Разобрать каналы: долю Direct и OTA, конверсию и стоимость брони",
            "檢視通路表現：直銷與 OTA 占比、轉換與每筆預訂成本",
          ),
          output: loc("Channel Adjustment", "Channel Adjustment"),
        },
        {
          id: "example-05",
          num: "05",
          label: loc("DISTRIBUTION", "DISTRIBUTION"),
          text: loc(
            "ตรวจ Rate Parity และ Inventory ที่เปิดขายในแต่ละช่องทาง",
            "Check rate parity and inventory availability on each channel",
            "Проверить паритет цен и наличие в каждом канале",
            "檢查各通路的價格一致性與可售庫存",
          ),
          output: loc("Distribution Check", "Distribution Check"),
        },
        {
          id: "example-06",
          num: "06",
          label: loc("SEGMENT", "SEGMENT"),
          text: loc(
            "ทบทวน Segment Mix และ Restriction เช่น Minimum Stay หรือ Close to Arrival",
            "Review segment mix and restrictions such as minimum stay or closed to arrival",
            "Посмотреть mix сегментов и ограничения, например minimum stay или close to arrival",
            "檢視客群組合與限制，例如 Minimum Stay 或 Close to Arrival",
          ),
          output: loc("Segment Mix Review", "Segment Mix Review"),
        },
        {
          id: "example-07",
          num: "07",
          label: loc("PRICING", "PRICING"),
          text: loc(
            "เลือกว่าควรทำ Pricing, Promotion เฉพาะกลุ่ม, ปรับ Distribution หรือ Demand Generation",
            "Choose the right lever: pricing, targeted promotion, distribution changes, or demand generation",
            "Выбрать рычаг: цена, акция для нужной группы, дистрибуция или создание спроса",
            "選擇槓桿：定價、針對特定客群的促銷、調整通路，或創造需求",
          ),
          output: loc("Pricing Action", "Pricing Action"),
        },
        {
          id: "example-08",
          num: "08",
          label: loc("REVIEW", "REVIEW"),
          text: loc(
            "กำหนดเจ้าของงานและกรอบเวลา",
            "Assign owners and timelines",
            "Назначить владельцев и сроки",
            "指定負責人與時間",
          ),
          output: loc("Performance Review", "Performance Review"),
        },
        {
          id: "example-09",
          num: "09",
          label: loc("REVIEW", "REVIEW"),
          text: loc(
            "ทบทวนผลที่ 7 และ 14 วัน แล้วปรับแผนต่อ",
            "Review results at 7 and 14 days, then adjust the plan",
            "Пересмотреть результат на 7 и 14 день, затем скорректировать план",
            "在第 7 與第 14 天回顧結果，再調整計畫",
          ),
          output: loc("Performance Review", "Performance Review"),
        },
      ],
    },
    closer: {
      close: loc(
        "อยากรู้ว่าช่องทางไหนสร้างรายได้สุทธิให้โรงแรมคุณมากที่สุด?",
        "Want to know which channels bring your hotel the most net revenue?",
        "Хотите знать, какие каналы дают отелю больше всего чистого дохода?",
        "想知道哪些通路為飯店帶來最多淨收益？",
      ),
      receiveTitle: loc("สิ่งที่คุณจะได้รับ", "What you receive"),
      receive: [
        {
          id: "receive-1",
          text: loc(
            "ทบทวนความเสี่ยงหรือโอกาสใน 60 วันข้างหน้า",
            "60-day risk or opportunity review",
          ),
        },
        {
          id: "receive-2",
          text: loc("รายการสิ่งที่ควรทำต่อ", "Recommended next actions"),
        },
        {
          id: "receive-3",
          text: loc("แผนวัดผลเพื่อติดตามต่อ", "Follow-up measurement plan"),
        },
      ],
      cta: loc(
        "เริ่มต้นด้วยการทบทวน Revenue & Distribution กับ เดอะ เคพีไอ พลัส",
        "Start with a Revenue & Distribution review from The KPI Plus",
        "Начните с обзора Revenue & Distribution от The KPI Plus",
        "從 The KPI Plus 的 Revenue & Distribution 檢視開始",
      ),
    },
  };
}

export function localizeApproachPage(content: CmsApproachPage, locale: Locale): ApproachPageCopy {
  return {
    eyebrow: pickApproachLocalized(content.hero.eyebrow, locale),
    titleLead: pickApproachLocalized(content.hero.titleLead, locale),
    titleRest: pickApproachLocalized(content.hero.titleRest, locale),
    titleAccent: pickApproachLocalized(content.hero.titleAccent, locale),
    lead: pickApproachLocalized(content.hero.lead, locale),
    subline: pickApproachLocalized(content.hero.subline, locale),
    photoAlt: pickApproachLocalized(content.hero.photoAlt, locale),
    method: pickApproachLocalized(content.method.title, locale),
    steps: content.method.steps.map((step) => ({
      num: step.num,
      title: pickApproachLocalized(step.title, locale),
      body: pickApproachLocalized(step.body, locale),
      output: pickApproachLocalized(step.output, locale),
    })),
    exampleEyebrow: pickApproachLocalized(content.example.eyebrow, locale),
    exampleTitle: pickApproachLocalized(content.example.title, locale),
    exampleLead: pickApproachLocalized(content.example.lead, locale),
    exampleCaption: pickApproachLocalized(content.example.caption, locale),
    exampleFrameworkNote: pickApproachLocalized(content.example.frameworkNote, locale),
    exampleSteps: content.example.steps.map((step) => ({
      num: step.num,
      label: pickApproachLocalized(step.label, locale),
      text: pickApproachLocalized(step.text, locale),
      output: pickApproachLocalized(step.output, locale),
    })),
    close: pickApproachLocalized(content.closer.close, locale),
    receiveTitle: pickApproachLocalized(content.closer.receiveTitle, locale),
    receive: content.closer.receive
      .map((item) => pickApproachLocalized(item.text, locale))
      .filter(Boolean),
    cta: pickApproachLocalized(content.closer.cta, locale),
  };
}

export function isApproachCmsBody(raw: string) {
  try {
    const parsed = JSON.parse(raw) as { template?: string; version?: number };
    return parsed?.template === APPROACH_CMS_TEMPLATE && parsed?.version === 1;
  } catch {
    return false;
  }
}

function parseSteps(value: unknown, fallback: CmsApproachStep[]): CmsApproachStep[] {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const row = (item && typeof item === "object" ? item : {}) as Partial<CmsApproachStep>;
    const base = fallback[index] ?? fallback[0];
    return {
      id: typeof row.id === "string" && row.id.trim() ? row.id : base?.id || newId("step"),
      num: typeof row.num === "string" ? row.num : base?.num || String(index + 1).padStart(2, "0"),
      title: asLocalized(row.title, base?.title ?? emptyApproachLocalized()),
      body: asLocalized(row.body, base?.body ?? emptyApproachLocalized()),
      output: asLocalized(row.output, base?.output ?? emptyApproachLocalized()),
    };
  });
}

function parseExampleSteps(value: unknown, fallback: CmsApproachExampleStep[]): CmsApproachExampleStep[] {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const row = (item && typeof item === "object" ? item : {}) as Partial<CmsApproachExampleStep>;
    const base = fallback[index] ?? fallback[0];
    return {
      id: typeof row.id === "string" && row.id.trim() ? row.id : base?.id || newId("example"),
      num: typeof row.num === "string" ? row.num : base?.num || String(index + 1).padStart(2, "0"),
      label: asLocalized(row.label, base?.label ?? emptyApproachLocalized()),
      text: asLocalized(row.text, base?.text ?? emptyApproachLocalized()),
      output: asLocalized(row.output, base?.output ?? emptyApproachLocalized()),
    };
  });
}

function parseReceive(value: unknown, fallback: CmsApproachReceiveItem[]): CmsApproachReceiveItem[] {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const row = (item && typeof item === "object" ? item : {}) as Partial<CmsApproachReceiveItem>;
    const base = fallback[index] ?? fallback[0];
    return {
      id: typeof row.id === "string" && row.id.trim() ? row.id : base?.id || newId("receive"),
      text: asLocalized(row.text, base?.text ?? emptyApproachLocalized()),
    };
  });
}

export function parseApproachPageBody(raw: string): CmsApproachPage | null {
  try {
    const parsed = JSON.parse(raw) as Partial<CmsApproachPage>;
    if (parsed.template !== APPROACH_CMS_TEMPLATE || parsed.version !== 1) return null;
    const fallback = defaultApproachCms();
    return {
      version: 1,
      template: APPROACH_CMS_TEMPLATE,
      hero: {
        eyebrow: asLocalized(parsed.hero?.eyebrow, fallback.hero.eyebrow),
        titleLead: asLocalized(parsed.hero?.titleLead, fallback.hero.titleLead),
        titleRest: asLocalized(parsed.hero?.titleRest, fallback.hero.titleRest),
        titleAccent: asLocalized(parsed.hero?.titleAccent, fallback.hero.titleAccent),
        lead: asLocalized(parsed.hero?.lead, fallback.hero.lead),
        subline: asLocalized(parsed.hero?.subline, fallback.hero.subline),
        photoAlt: asLocalized(parsed.hero?.photoAlt, fallback.hero.photoAlt),
      },
      method: {
        title: asLocalized(parsed.method?.title, fallback.method.title),
        steps: parseSteps(parsed.method?.steps, fallback.method.steps),
      },
      example: {
        eyebrow: asLocalized(parsed.example?.eyebrow, fallback.example.eyebrow),
        title: asLocalized(parsed.example?.title, fallback.example.title),
        lead: asLocalized(parsed.example?.lead, fallback.example.lead),
        caption: asLocalized(parsed.example?.caption, fallback.example.caption),
        frameworkNote: asLocalized(parsed.example?.frameworkNote, fallback.example.frameworkNote),
        steps: parseExampleSteps(parsed.example?.steps, fallback.example.steps),
      },
      closer: {
        close: asLocalized(parsed.closer?.close, fallback.closer.close),
        receiveTitle: asLocalized(parsed.closer?.receiveTitle, fallback.closer.receiveTitle),
        receive: parseReceive(parsed.closer?.receive, fallback.closer.receive),
        cta: asLocalized(parsed.closer?.cta, fallback.closer.cta),
      },
    };
  } catch {
    return null;
  }
}

export function serializeApproachPageBody(content: CmsApproachPage): string {
  return JSON.stringify(content);
}

export function isApproachPageDocument(doc: { template?: string; slug?: string } | null | undefined) {
  if (!doc) return false;
  return doc.template === APPROACH_CMS_TEMPLATE || doc.slug === APPROACH_PAGE_SLUG;
}

export function createApproachStep(seed?: Partial<CmsApproachStep>): CmsApproachStep {
  return {
    id: seed?.id || newId("step"),
    num: seed?.num || "",
    title: seed?.title || emptyApproachLocalized(),
    body: seed?.body || emptyApproachLocalized(),
    output: seed?.output || emptyApproachLocalized(),
  };
}

export function createApproachExampleStep(seed?: Partial<CmsApproachExampleStep>): CmsApproachExampleStep {
  return {
    id: seed?.id || newId("example"),
    num: seed?.num || "",
    label: seed?.label || emptyApproachLocalized(),
    text: seed?.text || emptyApproachLocalized(),
    output: seed?.output || emptyApproachLocalized(),
  };
}

export function createApproachReceiveItem(seed?: Partial<CmsApproachReceiveItem>): CmsApproachReceiveItem {
  return {
    id: seed?.id || newId("receive"),
    text: seed?.text || emptyApproachLocalized(),
  };
}
