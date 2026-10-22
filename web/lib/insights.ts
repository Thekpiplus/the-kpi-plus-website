import type { HandoffBlock } from "./handoff";
import type { Locale } from "./seo";

export type InsightCoverStatus = "real" | "approved" | "sample" | "placeholder";

export type InsightSource = {
  label: string;
  url?: string;
};

export type InsightPost = {
  id: string;
  slug: string;
  href: string;
  category: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  /** Markdown or CMS body when stored on the post. Listing pages may omit this. */
  content?: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageStatus: InsightCoverStatus;
  coverImageFit?: "cover" | "contain";
  coverImagePosition?: string;
  /** Named author only when approved. Empty posts use the editorial-team byline or hide it. */
  authorName?: string;
  authorRole?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  sources?: InsightSource[];
  relatedArticleIds?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  sampleVisual?: boolean;
};

const EDITORIAL_AUTHOR_NAME = "The KPI Plus Editorial Team";

export const insightPosts: InsightPost[] = [
  {
    id: "hotel-revenue-meetings-that-lead-to-decisions",
    slug: "hotel-revenue-meetings-that-lead-to-decisions",
    href: "/insights/hotel-revenue-meetings-that-lead-to-decisions",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-31",
    readingTimeMinutes: 4,
    coverImage: "/images/insights-featured-revenue-meeting-placeholder.webp",
    coverImageAlt: "ตัวอย่างภาพกรอบการประชุมรายได้โรงแรม ไม่ใช่ภาพผลงานลูกค้า",
    coverImageFit: "cover",
    coverImageStatus: "placeholder",
    sampleVisual: true,
    authorName: EDITORIAL_AUTHOR_NAME,
    isFeatured: true,
    isPublished: true,
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
    excerpt: {
      th: "กรอบการประชุมรายได้โรงแรมที่ช่วยให้ทีมเปลี่ยนสัญญาณด้านรายได้และการเติบโตเป็นการตัดสินใจ เจ้าของงาน และจุดทบทวนที่ชัดเจน",
      en: "A hotel revenue-meeting frame that turns revenue and growth signals into a decision, an owner, and a review point.",
      ru: "Рамка встречи по доходу отеля, которая превращает сигналы дохода и роста в решение, владельца и точку проверки.",
      zh: "一套酒店收益會議框架，把收益與成長訊號變成決策、負責人與檢視點。",
    },
  },
  {
    id: "hotel-marketing",
    slug: "hotel-marketing",
    href: "/insights/hotel-marketing",
    publishedAt: "2026-08-31",
    readingTimeMinutes: 10,
    coverImage: "/images/insights-hotel-marketing-placeholder.webp",
    coverImageAlt: "ตัวอย่างเส้นทางแคมเปญ Hotel Marketing จาก Visibility ถึง Booking ไม่ใช่ภาพผลงานลูกค้า",
    coverImageFit: "contain",
    coverImageStatus: "placeholder",
    sampleVisual: true,
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
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
    excerpt: {
      th: "การตลาดโรงแรมคือการเชื่อม Google, OTA, Website, Direct Booking, Distribution และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และเลือกจองด้วยข้อมูลที่ชัดเจน",
      en: "Hotel marketing connects Google, OTAs, the website, direct booking, distribution, and revenue management so guests can find, compare, and book with a clear picture.",
      ru: "Маркетинг отеля связывает Google, OTA, сайт, прямое бронирование, дистрибуцию и revenue management, чтобы гости находили, сравнивали и бронировали по понятной картине.",
      zh: "酒店行銷把 Google、OTA、網站、直銷預訂、通路與收益管理連在一起，讓旅客能找到、比較，並用清楚的資訊選擇預訂。",
    },
  },
  {
    id: "hotel-technology-adoption-commercial-project",
    slug: "hotel-technology-adoption-commercial-project",
    href: "/insights/hotel-technology-adoption-commercial-project",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-31",
    readingTimeMinutes: 5,
    coverImage: "/images/insights-hotel-ai-workflow-placeholder.webp",
    coverImageAlt: "ตัวอย่างเวิร์กโฟลว์ AI ของโรงแรมจากข้อมูลสู่การทบทวนและการตัดสินใจของทีม ไม่ใช่ภาพผลงานลูกค้า",
    coverImageFit: "contain",
    coverImageStatus: "placeholder",
    sampleVisual: true,
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
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
    excerpt: {
      th: "เหตุใดระบบโรงแรม ระบบอัตโนมัติ และ AI จึงต้องมีเจ้าของเวิร์กโฟลว์ แผนการปรับใช้ และบริบทด้านรายได้และการเติบโต ไม่ใช่เพียงการเปิดใช้งานทางเทคนิค",
      en: "Hotel systems, automation, and AI need a workflow owner, an adoption plan, and a revenue context — not only a technical switch-on.",
      ru: "Системы отеля, автоматизация и ИИ требуют владельца процесса, плана внедрения и контекста дохода — а не только технического включения.",
      zh: "酒店系統、自動化與 AI 需要流程負責人、導入計畫，以及收益與成長的脈絡，而不只是技術上的開啟。",
    },
  },
  {
    id: "direct-booking-journey-audit",
    slug: "direct-booking-journey-audit",
    href: "/insights/direct-booking-journey-audit",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-31",
    readingTimeMinutes: 4,
    coverImage: "/images/insights-direct-booking-placeholder.webp",
    coverImageAlt: "ตัวอย่างเส้นทาง Direct Booking จาก Search ถึง Website และ Booking ไม่ใช่ภาพผลงานลูกค้า",
    coverImageFit: "contain",
    coverImageStatus: "placeholder",
    sampleVisual: true,
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
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
    excerpt: {
      th: "แนวทางตรวจสอบเส้นทางผู้เข้าพักตั้งแต่เริ่มสนใจจนถึงการจองตรงอย่างมั่นใจ โดยไม่ตั้งสมมติฐานว่าปัญหาเกิดจากจำนวนทราฟฟิกเพียงอย่างเดียว",
      en: "A way to review the guest path from interest to a confident direct booking, without assuming the only problem is traffic volume.",
      ru: "Как проверить путь гостя от интереса до уверенного прямого бронирования, не предполагая, что проблема только в объёме трафика.",
      zh: "從旅客開始有興趣到能放心直銷預訂，檢查整段路徑，而不預設問題只出在流量多少。",
    },
  },
  {
    id: "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    slug: "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    href: "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    publishedAt: "2025-02-01",
    updatedAt: "2026-08-20",
    readingTimeMinutes: 3,
    coverImage: "/images/insights-seo-sem-placeholder.webp",
    coverImageAlt: "ตัวอย่างเปรียบเทียบ Organic Search และ Paid Search สำหรับ SEO และ SEM ไม่ใช่ภาพผลงานลูกค้า",
    coverImageFit: "contain",
    coverImageStatus: "placeholder",
    sampleVisual: true,
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
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
    excerpt: {
      th: "SEO และ SEM มีบทบาทต่างกันในการสร้าง Demand ของโรงแรม บทความนี้ช่วยให้ทีมเลือกจุดเริ่มต้นจากคำถามทางธุรกิจ Search Intent และเส้นทางสู่ Direct Booking ที่มีอยู่จริง",
      en: "SEO and SEM play different roles in hotel demand. This note helps the team choose a start from the business question, search intent, and the real path to direct booking.",
      ru: "SEO и SEM играют разные роли в спросе отеля. Этот материал помогает выбрать старт из бизнес-вопроса, search intent и реального пути к прямому бронированию.",
      zh: "SEO 與 SEM 在酒店需求中角色不同。這篇協助團隊從事業問題、搜尋意圖，以及實際的直銷預訂路徑選擇起點。",
    },
  },
];

export const FEATURED_INSIGHT_SLUG = "hotel-revenue-meetings-that-lead-to-decisions";

export const INSIGHT_TOPIC_IDS = ["all", "revenue", "marketing", "booking", "seo", "tech"] as const;
export type InsightTopicId = (typeof INSIGHT_TOPIC_IDS)[number];
export type InsightTopicFilterId = Exclude<InsightTopicId, "all">;

/** Editorial nav labels. Matching still uses existing InsightPost.category values. */
export const INSIGHT_TOPIC_LABELS: Record<InsightTopicFilterId, string> = {
  revenue: "Revenue Management",
  marketing: "Hotel Marketing",
  booking: "OTA / Direct Booking",
  seo: "SEO / SEM",
  tech: "Technology & AI",
};

const TOPIC_FROM_TH_CATEGORY: Record<string, InsightTopicFilterId> = {
  การบริหารรายได้: "revenue",
  การตลาดโรงแรม: "marketing",
  การจองตรง: "booking",
  "SEO และ Local Search": "seo",
  "เทคโนโลยีและ AI": "tech",
};

function topicCategoryIndex() {
  const index = new Map<string, InsightTopicFilterId>();
  for (const post of insightPosts) {
    const topic = TOPIC_FROM_TH_CATEGORY[post.category.th];
    if (!topic) continue;
    for (const value of Object.values(post.category)) {
      const key = value.trim().toLowerCase();
      if (key) index.set(key, topic);
    }
  }
  return index;
}

const TOPIC_CATEGORY_INDEX = topicCategoryIndex();

const TOPIC_CATEGORY_HINTS: { topic: InsightTopicFilterId; test: RegExp }[] = [
  { topic: "revenue", test: /การบริหารรายได้|revenue management/i },
  { topic: "marketing", test: /การตลาดโรงแรม|hotel (digital )?marketing/i },
  { topic: "booking", test: /การจองตรง|direct booking|\bota\b/i },
  { topic: "seo", test: /\bseo\b|\bsem\b|local search/i },
  { topic: "tech", test: /เทคโนโลยี|hospitality technology|\bai\b/i },
];

export function insightTopicId(post: InsightPost): InsightTopicFilterId | null {
  for (const value of Object.values(post.category)) {
    const hit = TOPIC_CATEGORY_INDEX.get(value.trim().toLowerCase());
    if (hit) return hit;
  }
  const blob = Object.values(post.category).join(" ");
  for (const { topic, test } of TOPIC_CATEGORY_HINTS) {
    if (test.test(blob)) return topic;
  }
  return null;
}

export function parseInsightTopic(value: string | undefined | null): InsightTopicId {
  const next = value?.trim().toLowerCase();
  if (!next || next === "all") return "all";
  return (INSIGHT_TOPIC_IDS as readonly string[]).includes(next) ? (next as InsightTopicId) : "all";
}

export function postsForInsightTopic(posts: InsightPost[], topic: InsightTopicId) {
  if (topic === "all") return posts;
  return posts.filter((post) => insightTopicId(post) === topic);
}

export const INSIGHT_SORT_IDS = ["relevant", "latest"] as const;
export type InsightSortId = (typeof INSIGHT_SORT_IDS)[number];

export const INSIGHT_PAGE_SIZE = 8;
export const INSIGHT_SEARCH_MIN = 8;

export type InsightIndexQuery = {
  topic?: InsightTopicId | string | null;
  sort?: InsightSortId | string | null;
  q?: string | null;
  page?: string | number | null;
};

export function parseInsightSort(value: string | undefined | null): InsightSortId {
  return value === "latest" ? "latest" : "relevant";
}

export function parseInsightPage(value: string | number | undefined | null) {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function parseInsightQuery(value: string | undefined | null) {
  return value?.trim() ?? "";
}

export function insightIndexHref(base: string, query: InsightIndexQuery = {}) {
  const params = new URLSearchParams();
  const topic = parseInsightTopic(query.topic);
  const sort = parseInsightSort(query.sort);
  const q = parseInsightQuery(query.q);
  const page = parseInsightPage(query.page);
  if (topic !== "all") params.set("topic", topic);
  if (sort !== "relevant") params.set("sort", sort);
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function postsMatchingInsightQuery(posts: InsightPost[], q: string, locale: Locale) {
  const needle = q.trim().toLowerCase();
  if (!needle) return posts;
  return posts.filter((post) => {
    const haystack = [
      post.title[locale],
      post.title.th,
      post.excerpt[locale],
      post.excerpt.th,
      post.category[locale],
      post.category.th,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function sortInsightPosts(posts: InsightPost[], sort: InsightSortId) {
  if (sort !== "latest") return posts;
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function insightCardImage(post: InsightPost) {
  return post.coverImage;
}

export function insightExcerpt(post: InsightPost, locale: Locale) {
  return post.excerpt[locale] || post.excerpt.th;
}

export function insightUpdatedAt(post: InsightPost) {
  const updated = post.updatedAt?.trim();
  if (!updated || updated === post.publishedAt) return "";
  return updated;
}

export function isPublishedInsight(post: InsightPost) {
  return post.isPublished !== false;
}

export const insightsIndexCopy = {
  th: {
    eyebrow: "บทความและมุมมอง",
    title: "บทความและมุมมอง",
    lead: "แนวคิดและวิธีทำงานสำหรับเจ้าของและทีมโรงแรม ครอบคลุมรายได้ การตลาด การจองตรง และเทคโนโลยี",
    topicsNav: "หมวดบทความ",
    allTopics: "ทั้งหมด",
    sortNav: "เรียงบทความ",
    sortRelevant: "เกี่ยวข้อง",
    sortLatest: "ล่าสุด",
    searchLabel: "ค้นหาบทความ",
    searchPlaceholder: "ค้นหาจากชื่อบทความ",
    searchSubmit: "ค้นหา",
    emptyTopic: "ยังไม่พบบทความในหมวดนี้",
    emptySearch: "ยังไม่พบบทความที่ตรงกับการค้นหา",
    loadMore: "ดูบทความเพิ่ม",
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
    byline: "เรียบเรียงโดย",
    published: "เผยแพร่",
    sampleVisual: "ตัวอย่างภาพประกอบ",
    sampleNotClient: "ไม่ใช่ผลงานลูกค้า",
    featuredCaption: "ตัวอย่างการ Review Revenue ก่อนกำหนด Action ในรอบถัดไป",
    featuredReplace: "Replace with real Revenue meeting / report image",
    featuredSampleKicker: "Revenue Review",
    featuredSampleSignal: "สัญญาณ",
    featuredSampleDecision: "การตัดสินใจ",
    featuredSampleOwner: "เจ้าของงาน",
    featuredSampleReview: "จุดทบทวน",
    marketingReplace: "Hotel Marketing · Replace with real campaign / funnel visual",
    marketingSampleKicker: "Hotel Marketing",
    bookingReplace: "Direct Booking Funnel · Sample visual",
    bookingSampleKicker: "Direct Booking Funnel",
    aiReplace: "AI Workflow · Human review required",
    aiSampleKicker: "AI Workflow",
    aiContext: "AI ช่วยประมวลผล แต่การตัดสินใจเชิงธุรกิจยังต้องผ่านทีมงาน",
    seoReplace: "SEO vs SEM · Replace with real search performance visual",
    seoSampleKicker: "SEO vs SEM",
    sources: "แหล่งข้อมูล",
    cta: "ขอวิเคราะห์โรงแรม",
    ctaTitle: "ต้องการดูว่าโรงแรมของคุณควรเริ่มจากตรงไหน?",
    ctaBody: "ทีม The KPI Plus ช่วยดูข้อมูลและวิธีทำงานของโรงแรม เพื่อจัดลำดับสิ่งที่ควรลงมือทำต่อไป",
    indexCtaTitle: "ขอให้ทีมช่วยวิเคราะห์ปัญหาโรงแรม",
    indexCtaBody: "ทีม The KPI Plus ช่วยดูข้อมูลและวิธีทำงานของโรงแรม เพื่อจัดลำดับสิ่งที่ควรลงมือทำต่อไป",
    indexCtaPoints: [
      "คุยกับทีมที่ทำงานด้าน Revenue และ Commercial Management",
      "เริ่มจากข้อมูลที่โรงแรมมีอยู่",
      "นำคำแนะนำไปใช้เป็น Action ได้จริง",
    ],
    toc: "สารบัญบทความ",
    tocOpen: "สารบัญบทความ",
    takeaway: "สรุปสั้น ๆ",
    services: "บริการที่เกี่ยวข้อง",
  },
  en: {
    eyebrow: "Insights",
    title: "Insights",
    lead: "Notes for owners, GMs, and hotel teams on revenue, demand, technology, and the next useful commercial move.",
    topicsNav: "Topics",
    allTopics: "All",
    sortNav: "Sort articles",
    sortRelevant: "Most relevant",
    sortLatest: "Latest",
    searchLabel: "Search articles",
    searchPlaceholder: "Search by title",
    searchSubmit: "Search",
    emptyTopic: "No articles found in this topic.",
    emptySearch: "No articles match this search.",
    loadMore: "Load more",
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
    byline: "By",
    published: "Published",
    sampleVisual: "Sample Visual",
    sampleNotClient: "Not a client result",
    featuredCaption: "Sample of a revenue review before the next action round.",
    featuredReplace: "Replace with real Revenue meeting / report image",
    featuredSampleKicker: "Revenue Review",
    featuredSampleSignal: "Signal",
    featuredSampleDecision: "Decision",
    featuredSampleOwner: "Owner",
    featuredSampleReview: "Review",
    marketingReplace: "Hotel Marketing · Replace with real campaign / funnel visual",
    marketingSampleKicker: "Hotel Marketing",
    bookingReplace: "Direct Booking Funnel · Sample visual",
    bookingSampleKicker: "Direct Booking Funnel",
    aiReplace: "AI Workflow · Human review required",
    aiSampleKicker: "AI Workflow",
    aiContext: "AI can process the work, but the business decision still needs the team.",
    seoReplace: "SEO vs SEM · Replace with real search performance visual",
    seoSampleKicker: "SEO vs SEM",
    sources: "Sources",
    cta: "Request a Hotel Performance Audit",
    ctaTitle: "Want to know where your hotel should start?",
    ctaBody: "The KPI Plus reviews the hotel’s facts and way of working, then helps sequence the next useful move.",
    indexCtaTitle: "Ask the team to help analyse the hotel’s issues",
    indexCtaBody: "The KPI Plus reviews the hotel’s facts and way of working, then helps sequence the next useful move.",
    indexCtaPoints: [
      "Talk with a team that works on revenue and commercial management",
      "Start from the information the hotel already has",
      "Leave with advice the team can put into action",
    ],
    toc: "Table of contents",
    tocOpen: "Table of contents",
    takeaway: "In brief",
    services: "Related services",
  },
  ru: {
    eyebrow: "Инсайты",
    title: "Инсайты",
    lead: "Материалы для собственников, управляющих и команд отелей о доходе, спросе, технологиях и следующем полезном шаге.",
    topicsNav: "Topics",
    allTopics: "All",
    sortNav: "Sort articles",
    sortRelevant: "Most relevant",
    sortLatest: "Latest",
    searchLabel: "Search articles",
    searchPlaceholder: "Search by title",
    searchSubmit: "Search",
    emptyTopic: "No articles found in this topic.",
    emptySearch: "No articles match this search.",
    loadMore: "Load more",
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
    byline: "By",
    published: "Published",
    sampleVisual: "Sample Visual",
    sampleNotClient: "Not a client result",
    featuredCaption: "Sample of a revenue review before the next action round.",
    featuredReplace: "Replace with real Revenue meeting / report image",
    featuredSampleKicker: "Revenue Review",
    featuredSampleSignal: "Signal",
    featuredSampleDecision: "Decision",
    featuredSampleOwner: "Owner",
    featuredSampleReview: "Review",
    marketingReplace: "Hotel Marketing · Replace with real campaign / funnel visual",
    marketingSampleKicker: "Hotel Marketing",
    bookingReplace: "Direct Booking Funnel · Sample visual",
    bookingSampleKicker: "Direct Booking Funnel",
    aiReplace: "AI Workflow · Human review required",
    aiSampleKicker: "AI Workflow",
    aiContext: "AI can process the work, but the business decision still needs the team.",
    seoReplace: "SEO vs SEM · Replace with real search performance visual",
    seoSampleKicker: "SEO vs SEM",
    sources: "Sources",
    cta: "Запросить аудит",
    ctaTitle: "Хотите понять, с чего начать именно вашему отелю?",
    ctaBody: "The KPI Plus смотрит данные и способ работы отеля, чтобы выстроить порядок следующих шагов.",
    indexCtaTitle: "Ask the team to help analyse the hotel’s issues",
    indexCtaBody: "The KPI Plus reviews the hotel’s facts and way of working, then helps sequence the next useful move.",
    indexCtaPoints: [
      "Talk with a team that works on revenue and commercial management",
      "Start from the information the hotel already has",
      "Leave with advice the team can put into action",
    ],
    toc: "Содержание",
    tocOpen: "Содержание",
    takeaway: "Кратко",
    services: "Связанные услуги",
  },
  zh: {
    eyebrow: "洞察",
    title: "洞察",
    lead: "給業主、總經理與酒店團隊的觀點：收益、需求、科技，以及下一步有用的商業行動。",
    topicsNav: "Topics",
    allTopics: "All",
    sortNav: "Sort articles",
    sortRelevant: "Most relevant",
    sortLatest: "Latest",
    searchLabel: "Search articles",
    searchPlaceholder: "Search by title",
    searchSubmit: "Search",
    emptyTopic: "No articles found in this topic.",
    emptySearch: "No articles match this search.",
    loadMore: "Load more",
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
    byline: "By",
    published: "Published",
    sampleVisual: "Sample Visual",
    sampleNotClient: "Not a client result",
    featuredCaption: "Sample of a revenue review before the next action round.",
    featuredReplace: "Replace with real Revenue meeting / report image",
    featuredSampleKicker: "Revenue Review",
    featuredSampleSignal: "Signal",
    featuredSampleDecision: "Decision",
    featuredSampleOwner: "Owner",
    featuredSampleReview: "Review",
    marketingReplace: "Hotel Marketing · Replace with real campaign / funnel visual",
    marketingSampleKicker: "Hotel Marketing",
    bookingReplace: "Direct Booking Funnel · Sample visual",
    bookingSampleKicker: "Direct Booking Funnel",
    aiReplace: "AI Workflow · Human review required",
    aiSampleKicker: "AI Workflow",
    aiContext: "AI can process the work, but the business decision still needs the team.",
    seoReplace: "SEO vs SEM · Replace with real search performance visual",
    seoSampleKicker: "SEO vs SEM",
    sources: "Sources",
    cta: "申請評估",
    ctaTitle: "想知道你的飯店該從哪裡開始？",
    ctaBody: "The KPI Plus 會看飯店的資料與做事方式，再協助排出下一步該做的事。",
    indexCtaTitle: "Ask the team to help analyse the hotel’s issues",
    indexCtaBody: "The KPI Plus reviews the hotel’s facts and way of working, then helps sequence the next useful move.",
    indexCtaPoints: [
      "Talk with a team that works on revenue and commercial management",
      "Start from the information the hotel already has",
      "Leave with advice the team can put into action",
    ],
    toc: "文章目錄",
    tocOpen: "文章目錄",
    takeaway: "簡要",
    services: "相關服務",
  },
} as const;

const GENERIC_AUTHOR = /^(the kpi plus|เดอะ เคพีไอ พลัส)$/i;
const EDITORIAL_AUTHOR = /editorial team|ทีมบรรณาธิการ/i;

export function insightAuthor(post: InsightPost, locale: Locale) {
  const approved = insightsIndexCopy[locale].author;
  const raw = post.authorName?.trim();
  if (!raw) return approved;
  if (GENERIC_AUTHOR.test(raw) || EDITORIAL_AUTHOR.test(raw)) return approved;
  return raw;
}

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

export function relatedInsights(hrefOrPost: string | InsightPost, limit = 3) {
  const current = typeof hrefOrPost === "string" ? insightByHref(hrefOrPost) : hrefOrPost;
  const pool = insightPosts.filter((post) => post.isPublished !== false);
  if (!current) return pool.slice(0, limit);
  const ids = current.relatedArticleIds?.map((id) => id.trim()).filter(Boolean) ?? [];
  if (ids.length) {
    const byId = new Map(pool.map((post) => [post.id, post]));
    const bySlug = new Map(pool.map((post) => [post.slug, post]));
    const picked = ids
      .map((id) => byId.get(id) ?? bySlug.get(id))
      .filter((post): post is InsightPost => post != null && post.id !== current.id);
    return picked.slice(0, limit);
  }
  const others = pool.filter((post) => post.id !== current.id);
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
