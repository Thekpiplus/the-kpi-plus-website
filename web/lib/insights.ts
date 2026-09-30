import type { HandoffBlock } from "./handoff";
import type { Locale } from "./seo";

export type InsightPost = {
  slug: string;
  href: string;
  published: string;
  modified: string;
  minutes: number;
  image: string;
  imageAlt: string;
  /** CSS object-position for the 8:5 hero crop when the default center cuts off the subject */
  imagePosition?: string;
  category: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const insightPosts: InsightPost[] = [
  {
    slug: "hotel-revenue-meetings-that-lead-to-decisions",
    href: "/insights/hotel-revenue-meetings-that-lead-to-decisions",
    published: "2026-08-19",
    modified: "2026-08-31",
    minutes: 4,
    image: "/media/the-kpi-plus-revenue-scene_4932d3c7.jpg",
    imageAlt: "บันทึกการประชุมรายได้และสื่อวางแผนเชิงพาณิชย์ของโรงแรม",
    imagePosition: "center 38%",
    category: {
      th: "การบริหารรายได้",
      en: "Revenue Management",
      ru: "Управление доходом",
      zh: "收益管理",
    },
    title: {
      th: "ประชุม Revenue อย่างไรให้จบด้วยการตัดสินใจที่นำไปใช้ได้จริง",
      en: "How to run a revenue meeting that ends in a usable decision",
      ru: "Как провести revenue-встречу, которая заканчивается рабочим решением",
      zh: "如何讓收益會議以可用的決策結束",
    },
    description: {
      th: "กรอบการประชุมรายได้โรงแรมที่ช่วยให้ทีมเปลี่ยนสัญญาณด้านรายได้และการเติบโตเป็นการตัดสินใจ เจ้าของงาน และจุดทบทวนที่ชัดเจน",
      en: "A hotel revenue-meeting frame that turns revenue and growth signals into a decision, an owner, and a review point.",
      ru: "Рамка встречи по доходу отеля, которая превращает сигналы дохода и роста в решение, владельца и точку проверки.",
      zh: "一套酒店收益會議框架，把收益與成長訊號變成決策、負責人與檢視點。",
    },
  },
  {
    slug: "hotel-marketing",
    href: "/insights/hotel-marketing",
    published: "2026-08-31",
    modified: "2026-08-31",
    minutes: 10,
    image: "/media/the-kpi-plus-performance-hero_2f986b5f.jpg",
    imageAlt: "ทีมโรงแรมวิเคราะห์ข้อมูล Revenue Management และกลยุทธ์การตลาดโรงแรม",
    imagePosition: "62% 40%",
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Digital Marketing",
      ru: "Digital-маркетинг отеля",
      zh: "酒店數位行銷",
    },
    title: {
      th: "การตลาดโรงแรม (Hotel Marketing) คืออะไร? 8 กลยุทธ์เพิ่มยอดจองและรายได้",
      en: "What is hotel marketing? 8 ways to grow bookings and revenue",
      ru: "Что такое маркетинг отеля? 8 способов увеличить бронирования и доход",
      zh: "什麼是酒店行銷？8 個增加預訂與收益的做法",
    },
    description: {
      th: "การตลาดโรงแรมคือการเชื่อม Google, OTA, Website, Direct Booking, Distribution และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และเลือกจองด้วยข้อมูลที่ชัดเจน",
      en: "Hotel marketing connects Google, OTAs, the website, direct booking, distribution, and revenue management so guests can find, compare, and book with a clear picture.",
      ru: "Маркетинг отеля связывает Google, OTA, сайт, прямое бронирование, дистрибуцию и revenue management, чтобы гости находили, сравнивали и бронировали по понятной картине.",
      zh: "酒店行銷把 Google、OTA、網站、直銷預訂、通路與收益管理連在一起，讓旅客能找到、比較，並用清楚的資訊選擇預訂。",
    },
  },
  {
    slug: "hotel-technology-adoption-commercial-project",
    href: "/insights/hotel-technology-adoption-commercial-project",
    published: "2026-08-19",
    modified: "2026-08-31",
    minutes: 5,
    image: "/media/kpi-grow-capability_7bba9d6e.jpg",
    imageAlt: "ทีมโรงแรมวางแผนการใช้เทคโนโลยีและการดำเนินงานร่วมกัน",
    imagePosition: "68% 55%",
    category: {
      th: "เทคโนโลยีและ AI",
      en: "Hospitality Technology",
      ru: "Технологии и ИИ",
      zh: "酒店科技與 AI",
    },
    title: {
      th: "ทำอย่างไรให้ Technology และ AI ช่วยทีมโรงแรมทำงานได้ดีขึ้นจริง",
      en: "How technology and AI can actually help a hotel team work better",
      ru: "Как технологии и ИИ реально помогают команде отеля работать лучше",
      zh: "如何讓科技與 AI 真正幫助酒店團隊把工作做好",
    },
    description: {
      th: "เหตุใดระบบโรงแรม ระบบอัตโนมัติ และ AI จึงต้องมีเจ้าของเวิร์กโฟลว์ แผนการปรับใช้ และบริบทด้านรายได้และการเติบโต ไม่ใช่เพียงการเปิดใช้งานทางเทคนิค",
      en: "Hotel systems, automation, and AI need a workflow owner, an adoption plan, and a revenue context — not only a technical switch-on.",
      ru: "Системы отеля, автоматизация и ИИ требуют владельца процесса, плана внедрения и контекста дохода — а не только технического включения.",
      zh: "酒店系統、自動化與 AI 需要流程負責人、導入計畫，以及收益與成長的脈絡，而不只是技術上的開啟。",
    },
  },
  {
    slug: "direct-booking-journey-audit",
    href: "/insights/direct-booking-journey-audit",
    published: "2026-08-19",
    modified: "2026-08-31",
    minutes: 4,
    image: "/media/kpi-grow-revenue_f786a5a5.jpg",
    imageAlt: "เส้นทางผู้เข้าพักจากความสนใจไปสู่การจองโรงแรมโดยตรง",
    imagePosition: "72% 40%",
    category: {
      th: "การจองตรง",
      en: "Direct Booking",
      ru: "Прямое бронирование",
      zh: "直銷預訂",
    },
    title: {
      th: "วิเคราะห์เส้นทาง Direct Booking ของโรงแรม",
      en: "Audit the hotel’s direct-booking journey",
      ru: "Проверить путь прямого бронирования отеля",
      zh: "檢查酒店的直銷預訂旅程",
    },
    description: {
      th: "แนวทางตรวจสอบเส้นทางผู้เข้าพักตั้งแต่เริ่มสนใจจนถึงการจองตรงอย่างมั่นใจ โดยไม่ตั้งสมมติฐานว่าปัญหาเกิดจากจำนวนทราฟฟิกเพียงอย่างเดียว",
      en: "A way to review the guest path from interest to a confident direct booking, without assuming the only problem is traffic volume.",
      ru: "Как проверить путь гостя от интереса до уверенного прямого бронирования, не предполагая, что проблема только в объёме трафика.",
      zh: "從旅客開始有興趣到能放心直銷預訂，檢查整段路徑，而不預設問題只出在流量多少。",
    },
  },
  {
    slug: "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    href: "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    published: "2025-02-01",
    modified: "2026-08-20",
    minutes: 3,
    image: "/media/the-kpi-plus-insights-scene_8a7e72cb.jpg",
    imageAlt: "บันทึกการวางแผนการค้นหา SEO และอุปสงค์แบบเสียเงินของโรงแรม",
    imagePosition: "65% 45%",
    category: {
      th: "SEO และ Local Search",
      en: "SEO & Local Search",
      ru: "SEO и локальный поиск",
      zh: "SEO 與在地搜尋",
    },
    title: {
      th: "SEO vs SEM สำหรับโรงแรม: ควรเริ่มจากอะไร และเลือกอย่างไร?",
      en: "SEO vs SEM for hotels: where to start",
      ru: "SEO vs SEM для отелей: с чего начать",
      zh: "酒店 SEO 與 SEM：該從哪裡開始",
    },
    description: {
      th: "SEO และ SEM มีบทบาทต่างกันในการสร้าง Demand ของโรงแรม บทความนี้ช่วยให้ทีมเลือกจุดเริ่มต้นจากคำถามทางธุรกิจ Search Intent และเส้นทางสู่ Direct Booking ที่มีอยู่จริง",
      en: "SEO and SEM play different roles in hotel demand. This note helps the team choose a start from the business question, search intent, and the real path to direct booking.",
      ru: "SEO и SEM играют разные роли в спросе отеля. Этот материал помогает выбрать старт из бизнес-вопроса, search intent и реального пути к прямому бронированию.",
      zh: "SEO 與 SEM 在酒店需求中角色不同。這篇協助團隊從事業問題、搜尋意圖，以及實際的直銷預訂路徑選擇起點。",
    },
  },
];

export const FEATURED_INSIGHT_SLUG = "hotel-marketing";

const cardImages: Record<string, string> = {
  "hotel-marketing": "/media/kpi-grow-demand_24299cd0.jpg",
  "hotel-revenue-meetings-that-lead-to-decisions": "/media/the-kpi-plus-revenue-scene_4932d3c7.jpg",
  "hotel-technology-adoption-commercial-project": "/media/kpi-grow-capability_7bba9d6e.jpg",
  "direct-booking-journey-audit": "/media/kpi-grow-revenue_f786a5a5.jpg",
  "seo-vs-sem-for-hotels-which-one-should-you-focus-on": "/media/the-kpi-plus-insights-scene_8a7e72cb.jpg",
};

export function insightCardImage(post: InsightPost) {
  return cardImages[post.slug] ?? post.image;
}

export const insightsIndexCopy = {
  th: {
    eyebrow: "บทความและมุมมอง",
    title: "บทความและมุมมอง",
    lead: "แนวคิดและวิธีทำงานสำหรับเจ้าของและทีมโรงแรม ครอบคลุมรายได้ การตลาด การจองตรง และเทคโนโลยี",
    read: "อ่านบทความ",
    updated: "อัปเดต",
    minutes: "นาที",
    home: "หน้าแรก",
    insights: "บทความและมุมมอง",
    author: "ทีมบรรณาธิการ เดอะ เคพีไอ พลัส",
    related: "บทความที่เกี่ยวข้อง",
    all: "ดูบทความทั้งหมด",
    featured: "บทความแนะนำ",
    more: "บทความอื่น",
    cta: "ขอวิเคราะห์โรงแรม",
    ctaTitle: "อ่านแล้วอยากรู้ว่าเรื่องไหนสำคัญกับโรงแรมของคุณ?",
    ctaBody: "The KPI Plus ช่วยดูข้อมูลและวิธีทำงานของโรงแรม เพื่อจัดลำดับสิ่งที่ควรลงมือทำ",
    toc: "เนื้อหาในบทความ",
    services: "บริการที่เกี่ยวข้อง",
  },
  en: {
    eyebrow: "Insights",
    title: "Insights",
    lead: "Notes for owners, GMs, and hotel teams on revenue, demand, technology, and the next useful commercial move.",
    read: "Read article",
    updated: "Updated",
    minutes: "min read",
    home: "Home",
    insights: "Insights",
    author: "The KPI Plus Editorial Team",
    related: "Related insights",
    all: "See all insights",
    featured: "Featured article",
    more: "More articles",
    cta: "Request a Hotel Performance Audit",
    ctaTitle: "Want to know what matters for your hotel?",
    ctaBody: "The KPI Plus reviews the hotel’s facts and way of working, then helps sequence the next useful move.",
    toc: "In this article",
    services: "Related services",
  },
  ru: {
    eyebrow: "Инсайты",
    title: "Инсайты",
    lead: "Материалы для собственников, управляющих и команд отелей о доходе, спросе, технологиях и следующем полезном шаге.",
    read: "Читать статью",
    updated: "Обновлено",
    minutes: "мин",
    home: "Главная",
    insights: "Инсайты",
    author: "Редакция The KPI Plus",
    related: "Похожие материалы",
    all: "Все инсайты",
    featured: "Главный материал",
    more: "Другие статьи",
    cta: "Запросить аудит",
    ctaTitle: "Хотите понять, что важно именно вашему отелю?",
    ctaBody: "The KPI Plus смотрит данные и способ работы отеля, чтобы выстроить порядок следующих шагов.",
    toc: "Содержание",
    services: "Связанные услуги",
  },
  zh: {
    eyebrow: "洞察",
    title: "洞察",
    lead: "給業主、總經理與酒店團隊的觀點：收益、需求、科技，以及下一步有用的商業行動。",
    read: "閱讀文章",
    updated: "更新",
    minutes: "分鐘",
    home: "首頁",
    insights: "洞察",
    author: "The KPI Plus 編輯團隊",
    related: "相關文章",
    all: "查看全部文章",
    featured: "精選文章",
    more: "其他文章",
    cta: "申請評估",
    ctaTitle: "讀完後，想知道哪件事對你的飯店最重要？",
    ctaBody: "The KPI Plus 會看飯店的資料與做事方式，再協助排出下一步該做的事。",
    toc: "本文內容",
    services: "相關服務",
  },
} as const;

const META_EXACT = new Set([
  "/",
  "คำตอบสั้น ๆ",
  "เรียบเรียงโดย",
  "The KPI Plus Editorial Team",
  "ทีมบรรณาธิการ เดอะ เคพีไอ พลัส",
  "Hospitality Performance & Revenue Management",
  "Hospitality Knowledge Hub",
  "Hospitality Performance, Revenue Management และ Digital Marketing",
  "Revenue · Direct Booking · Commercial Growth",
  "รายได้ · การจองตรง · การเติบโตของโรงแรม",
  "ประเด็นสำคัญ",
  "เชื่อมรายได้ การจองตรง และการเติบโตของโรงแรมให้เป็นแผนที่ทีมลงมือทำและวัดผลได้จริง",
  "ตัวอย่างในบริบทโรงแรม",
  "แนวทางปฏิบัติของ เดอะ เคพีไอ พลัส",
  "คำถามที่พบบ่อย",
  "แชร์บทความ",
  "บทความที่เกี่ยวข้อง",
  "ต้องการรู้ว่าข้อมูลโรงแรมกำลังบอกอะไรคุณอยู่?",
  "เดอะ เคพีไอ พลัส ช่วยเชื่อมรายได้ Demand ช่องทางการขาย และข้อมูลด้านการดำเนินงาน ให้เป็นสิ่งที่ทีมโรงแรมลงมือทำต่อได้",
  "หน้าแรก",
  "Insights",
  "บทความทั้งหมด",
  "การบริหารรายได้",
  "การจองตรง",
  "เทคโนโลยีและ AI",
  "อุปสงค์",
  "Hotel Digital Marketing",
]);

function isMetaText(text: string) {
  if (META_EXACT.has(text)) return true;
  if (text.startsWith("อัปเดต ")) return true;
  if (text.startsWith("อ่านประมาณ")) return true;
  if (text.includes(" · อัปเดต ")) return true;
  if (/^\d{1,2} (มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/.test(text)) {
    return true;
  }
  return false;
}

export function insightByHref(href: string) {
  return insightPosts.find((post) => post.href === href);
}

export function insightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function relatedInsights(href: string, limit = 3) {
  const current = insightByHref(href);
  const others = insightPosts.filter((post) => post.href !== href);
  if (!current) return others.slice(0, limit);
  const same = others.filter((post) => post.category.th === current.category.th);
  const rest = others.filter((post) => post.category.th !== current.category.th);
  return [...same, ...rest].slice(0, limit);
}

export function formatInsightDate(iso: string, locale: Locale) {
  const date = new Date(`${iso}T00:00:00Z`);
  const locales = { th: "th-TH", en: "en-GB", ru: "ru-RU", zh: "zh-Hant" } as const;
  return new Intl.DateTimeFormat(locales[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const BODY_STOP = new Set([
  "อ่านสัญญาณ เลือกสิ่งที่ควรทำ แล้ววัดผลการเปลี่ยนแปลง",
  "คำถามที่โรงแรมมักถามเกี่ยวกับเรื่องนี้",
  "คำถามก่อนเริ่มงาน",
  "เนื้อหาในบทความ",
]);

export function insightHeadingId(text: string) {
  return text
    .trim()
    .replace(/[():?？]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

export function insightBody(blocks: HandoffBlock[]) {
  const start = blocks.findIndex((block) => block.type === "h2");
  const out: HandoffBlock[] = [];
  const seenParagraphs = new Set<string>();
  let seenH2 = false;

  for (const [index, block] of blocks.entries()) {
    if (block.type === "h1") continue;
    if (block.type === "h2" && BODY_STOP.has(block.text)) break;
    if ((block.type === "p" || block.type === "h3") && isMetaText(block.text)) continue;
    if (block.type === "p") {
      if (seenParagraphs.has(block.text)) continue;
      seenParagraphs.add(block.text);
    }
    if (block.type === "link" && (isMetaText(block.text) || block.text === "ขอรับการวิเคราะห์โรงแรม")) continue;
    if (block.type === "image" && !seenH2) continue;
    if (block.type === "h2") seenH2 = true;
    if (!seenH2 && start !== -1) {
      if (block.type === "p" || block.type === "list" || block.type === "table") out.push(block);
      continue;
    }
    if (block.type === "h3") {
      const next = blocks[index + 1];
      if (/[?？]$/.test(block.text) && next?.type !== "p") continue;
    }
    out.push(block);
  }

  return out;
}
