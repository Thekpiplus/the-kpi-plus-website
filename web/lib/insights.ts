import type { HandoffBlock } from "./handoff";
import type { Locale } from "./seo";

export type InsightCoverStatus = "real" | "approved" | "sample" | "placeholder";

export type InsightSource = {
  /** Fallback / default descriptive label (usually English). */
  label: string;
  /** Locale-specific descriptive link text when available. */
  labelByLocale?: Partial<Record<Locale, string>>;
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
  /** Named reviewer only when a real review is recorded in CMS/content. Do not invent. */
  reviewerName?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  sources?: InsightSource[];
  relatedArticleIds?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  sampleVisual?: boolean;
};

/** Descriptive label for a source link in the active locale. */
export function insightSourceLabel(source: InsightSource, locale: Locale) {
  const localized = source.labelByLocale?.[locale]?.trim();
  if (localized) return localized;
  if (locale !== "en") {
    const english = source.labelByLocale?.en?.trim();
    if (english) return english;
  }
  return source.label.trim();
}

const EDITORIAL_AUTHOR_NAME = "The KPI Plus Editorial Team";

export const insightPosts: InsightPost[] = [
{
    id: "hotel-revenue-meetings-that-lead-to-decisions",
    slug: "hotel-revenue-meetings-that-lead-to-decisions",
    href: "/insights/hotel-revenue-meetings-that-lead-to-decisions",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-31",
    readingTimeMinutes: 4,
    coverImage: "/images/blog/hotel-revenue-meetings-that-lead-to-decisions/th/cover.webp",
    coverImageAlt: "ภาพปกบทความประชุม Revenue โรงแรม ให้จบด้วยการตัดสินใจ จากสัญญาณรายได้สู่เจ้าของงานและจุดทบทวน โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    authorName: EDITORIAL_AUTHOR_NAME,
    isFeatured: true,
    isPublished: true,
    relatedArticleIds: [
      "hotel-technology-adoption-commercial-project",
      "direct-booking-journey-audit",
      "hotel-marketing-plan-2027",
    ],
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
    id: "hotel-technology-adoption-commercial-project",
    slug: "hotel-technology-adoption-commercial-project",
    href: "/insights/hotel-technology-adoption-commercial-project",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-31",
    readingTimeMinutes: 5,
    coverImage: "/images/blog/hotel-technology-adoption-commercial-project/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ Technology และ AI ช่วยทีมโรงแรม ด้วยเวิร์กโฟลว์ แผนปรับใช้ และบริบทรายได้ โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: [
      "hotel-revenue-meetings-that-lead-to-decisions",
      "hotel-organizational-structure",
      "small-hotel-marketing-and-operations",
    ],
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
    coverImage: "/images/blog/direct-booking-journey-audit/th/cover.webp",
    coverImageAlt: "ภาพปกบทความวิเคราะห์เส้นทาง Direct Booking จาก Search ถึง Website และ Booking Engine โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: [
      "hotel-website-content",
      "what-is-ota",
      "hotel-rate-parity",
      "increase-hotel-bookings-from-google",
    ],
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
    coverImage: "/images/blog/seo-vs-sem-for-hotels-which-one-should-you-focus-on/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ SEO vs SEM สำหรับโรงแรม เปรียบเทียบ Organic SEO Paid SEM และเส้นทางจองตรง โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: [
      "hotel-seo",
      "hotel-local-seo",
      "increase-hotel-bookings-from-google",
      "hotel-website-content",
    ],
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
  {
    id: "10-hotel-marketing-strategies",
    slug: "10-hotel-marketing-strategies",
    href: "/insights/10-hotel-marketing-strategies",
    publishedAt: "2023-03-23",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 13,
    coverImage: "/images/blog/10-hotel-marketing-strategies/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ 10 กลยุทธ์การตลาดโรงแรม วางแผนอย่างไรให้ยอดจองคุ้มค่า อัปเดตปลายปี 2569 บนพื้นสีเขียวมะนาวของ The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["7-hotel-marketing-methods","hotel-marketing-plan-2027"],
    sources: [
      {
        label: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
        labelByLocale: {
          th: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
          en: "Ministry of Tourism and Sports via Nation Thailand — foreign arrivals 1 Jan–19 Sep 2026",
        },
        url: "https://www.nationthailand.com/news/tourism/40071305",
      },
      {
        label: "TAT Newsroom — มาตรการยกเว้นการตรวจลงตรา 30 วันและ 15 วัน มีผล 15 ก.ย. 2569",
        labelByLocale: {
          th: "TAT Newsroom — มาตรการยกเว้นการตรวจลงตรา 30 วันและ 15 วัน มีผล 15 ก.ย. 2569",
          en: "TAT Newsroom — new 30-day and 15-day visa exemption rules from 15 September 2026",
        },
        url: "https://www.tatnews.org/2026/09/thailand-introduces-new-30-day-and-15-day-visa-exemption-rules-from-15-september/",
      },
      {
        label: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
          en: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 Aug 2026)",
        },
        url: "https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "10 กลยุทธ์การตลาดโรงแรม: วางแผนอย่างไรให้ยอดจองคุ้มค่า (อัปเดตปลายปี 2569)",
      en: "10 Hotel Marketing Strategies: How to Plan for Bookings That Pay Off (Late 2026 Update)",
      ru: "10 Hotel Marketing Strategies: How to Plan for Bookings That Pay Off (Late 2026 Update)",
      zh: "10 Hotel Marketing Strategies: How to Plan for Bookings That Pay Off (Late 2026 Update)",
    },
    excerpt: {
      th: "10 กลยุทธ์การตลาดโรงแรมสำหรับเจ้าของที่พัก: เป้าหมาย ลูกค้า แบรนด์ ช่องทางขาย เว็บไซต์ โปรโมชั่น และการวัดยอดจอง ราคา ต้นทุน อัปเดตปลายปี 2569",
      en: "Ten hotel marketing strategies for owners in Thailand: goals, guests, brand, channels, website, social, promotions, experience, partners and guest messages.",
      ru: "Ten hotel marketing strategies for owners in Thailand: goals, guests, brand, channels, website, social, promotions, experience, partners and guest messages.",
      zh: "Ten hotel marketing strategies for owners in Thailand: goals, guests, brand, channels, website, social, promotions, experience, partners and guest messages.",
    },
  },
  {
    id: "7-hotel-marketing-methods",
    slug: "7-hotel-marketing-methods",
    href: "/insights/7-hotel-marketing-methods",
    publishedAt: "2023-03-17",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 11,
    coverImage: "/images/blog/7-hotel-marketing-methods/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ 7 วิธีทำการตลาดโรงแรมให้ได้ผลต่อเนื่อง อัปเดตปลายปี 2569 บนพื้นสีเขียวมะนาวของ The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["10-hotel-marketing-strategies","increase-hotel-bookings-from-google"],
    sources: [
      {
        label: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
        labelByLocale: {
          th: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
          en: "Ministry of Tourism and Sports via Nation Thailand — foreign arrivals 1 Jan–19 Sep 2026",
        },
        url: "https://www.nationthailand.com/news/tourism/40071305",
      },
      {
        label: "TAT Newsroom — มาตรการยกเว้นการตรวจลงตรา 30 วันและ 15 วัน มีผล 15 ก.ย. 2569",
        labelByLocale: {
          th: "TAT Newsroom — มาตรการยกเว้นการตรวจลงตรา 30 วันและ 15 วัน มีผล 15 ก.ย. 2569",
          en: "TAT Newsroom — new 30-day and 15-day visa exemption rules from 15 September 2026",
        },
        url: "https://www.tatnews.org/2026/09/thailand-introduces-new-30-day-and-15-day-visa-exemption-rules-from-15-september/",
      },
      {
        label: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
          en: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 Aug 2026)",
        },
        url: "https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/",
      },
      {
        label: "PhocusWire — Hotel booking goes live in Google’s AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "PhocusWire — Hotel booking goes live in Google’s AI Mode (27 ส.ค. 2569)",
          en: "PhocusWire — Hotel booking goes live in Google’s AI Mode (27 Aug 2026)",
        },
        url: "https://www.phocuswire.com/news/technology/google-ai-mode-hotel-booking-agentic-flights-loyalty",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "7 วิธีทำการตลาดโรงแรมให้ได้ผลต่อเนื่อง (อัปเดตปลายปี 2569)",
      en: "7 Hotel Marketing Ideas That Keep Working: A Practical Guide for Thai Hotels (2026 Update)",
      ru: "7 Hotel Marketing Ideas That Keep Working: A Practical Guide for Thai Hotels (2026 Update)",
      zh: "7 Hotel Marketing Ideas That Keep Working: A Practical Guide for Thai Hotels (2026 Update)",
    },
    excerpt: {
      th: "7 วิธีทำการตลาดโรงแรมที่ใช้ได้จริงปลายปี 2569: Google และ AI Search โฆษณา เนื้อหา โซเชียล โปรโมชั่น กิจกรรม และลูกค้าเดิม วัดผลถึงรายได้สุทธิ",
      en: "Seven hotel marketing ideas for late 2026: Google and AI search, ads, content, social, promotions, events and past guests, measured to net revenue.",
      ru: "Seven hotel marketing ideas for late 2026: Google and AI search, ads, content, social, promotions, events and past guests, measured to net revenue.",
      zh: "Seven hotel marketing ideas for late 2026: Google and AI search, ads, content, social, promotions, events and past guests, measured to net revenue.",
    },
  },
  {
    id: "hotel-branding",
    slug: "hotel-branding",
    href: "/insights/hotel-branding",
    publishedAt: "2023-05-23",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 12,
    coverImage: "/images/blog/hotel-branding/th/cover.webp",
    coverImageAlt: "ภาพปกบทความการสร้างแบรนด์โรงแรมในปี 2569 แสดงข้อมูลโรงแรมที่ตรงกันบนเว็บไซต์ Google และ OTA บนพื้นสีเขียวมะนาวของ The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-review-management","hotel-website-content"],
    sources: [
      {
        label: "SiteMinder — Changing Traveller Report 2026 (สำรวจผู้เดินทาง 12,000 คนใน 14 ประเทศ รวมประเทศไทย)",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026 (สำรวจผู้เดินทาง 12,000 คนใน 14 ประเทศ รวมประเทศไทย)",
          en: "SiteMinder — Changing Traveller Report 2026 (12,000 travellers in 14 countries, including Thailand)",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
        labelByLocale: {
          th: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
          en: "Ministry of Tourism and Sports via Nation Thailand — foreign arrivals 1 Jan–19 Sep 2026",
        },
        url: "https://www.nationthailand.com/news/tourism/40071305",
      },
      {
        label: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
          en: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 Aug 2026)",
        },
        url: "https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "การสร้างแบรนด์โรงแรมในปี 2569: ทำอย่างไรให้ลูกค้าจำได้และมั่นใจที่จะจอง",
      en: "Hotel Branding in 2026: How to Make Guests Remember You and Book with Confidence",
      ru: "Hotel Branding in 2026: How to Make Guests Remember You and Book with Confidence",
      zh: "Hotel Branding in 2026: How to Make Guests Remember You and Book with Confidence",
    },
    excerpt: {
      th: "การสร้างแบรนด์โรงแรมปี 2569: เลือกกลุ่มแขก เขียนคำสัญญาที่ตรวจสอบได้ ทำข้อมูลให้ตรงทุกช่องทาง ตั้งราคาให้สอดคล้อง และใช้รีวิวตรวจผล",
      en: "Hotel branding for 2026: choose your guests, write a promise you can prove, keep every channel consistent, price to match, and use reviews to check the result.",
      ru: "Hotel branding for 2026: choose your guests, write a promise you can prove, keep every channel consistent, price to match, and use reviews to check the result.",
      zh: "Hotel branding for 2026: choose your guests, write a promise you can prove, keep every channel consistent, price to match, and use reviews to check the result.",
    },
  },
  {
    id: "hotel-local-seo",
    slug: "hotel-local-seo",
    href: "/insights/hotel-local-seo",
    publishedAt: "2024-12-29",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-local-seo/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ Local SEO โรงแรม ทำ Google Maps และ Business Profile ให้ได้ยอดจอง โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-review-management","hotel-seo"],
    sources: [
      {
        label: "Google — Hotels Business Profile Best Practices Playbook 2026",
        labelByLocale: {
          th: "Google — Hotels Business Profile Best Practices Playbook 2026",
          en: "Google — Hotels Business Profile Best Practices Playbook 2026",
        },
        url: "https://services.google.com/fh/files/helpcenter/hotels_gbp_best_practices_playbook_2026.pdf",
      },
      {
        label: "Google Business Profile Help — Tips to improve your local ranking on Google",
        labelByLocale: {
          th: "Google Business Profile Help — Tips to improve your local ranking on Google",
          en: "Google Business Profile Help — Tips to improve your local ranking on Google",
        },
        url: "https://support.google.com/business/answer/7091",
      },
      {
        label: "BrightLocal — Local Consumer Review Survey 2026 (11 Feb 2026)",
        labelByLocale: {
          th: "BrightLocal — Local Consumer Review Survey 2026 (11 Feb 2026)",
          en: "BrightLocal — Local Consumer Review Survey 2026 (11 Feb 2026)",
        },
        url: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
      {
        label: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        labelByLocale: {
          th: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
          en: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        },
        url: "https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/",
      },
      {
        label: "Google Hotel Center Help — Free booking links",
        labelByLocale: {
          th: "Google Hotel Center Help — Free booking links",
          en: "Google Hotel Center Help — Free booking links",
        },
        url: "https://support.google.com/hotelprices/answer/10472393",
      },
    ],
    category: {
      th: "SEO และ Local Search",
      en: "SEO / Local Search",
      ru: "SEO / Local Search",
      zh: "SEO / Local Search",
    },
    title: {
      th: "Local SEO โรงแรม: ทำ Google Maps และ Business Profile ให้ได้ยอดจอง (อัปเดต 2569)",
      en: "Local SEO for Hotels: Make Google Maps and Your Business Profile Drive Bookings (2026 Update)",
      ru: "Local SEO for Hotels: Make Google Maps and Your Business Profile Drive Bookings (2026 Update)",
      zh: "Local SEO for Hotels: Make Google Maps and Your Business Profile Drive Bookings (2026 Update)",
    },
    excerpt: {
      th: "Local SEO โรงแรมช่วยเพิ่มยอดจองอย่างไร: ปัจจัยจัดอันดับบน Google Maps ข้อมูล Business Profile สำหรับโรงแรม รีวิว หน้าทำเล ลิงก์จอง การวัดผล และแผน 30 วัน",
      en: "Local SEO for hotels in Thailand: how Google ranks local results, Business Profile basics, reviews, location pages, booking links and a 30-day plan.",
      ru: "Local SEO for hotels in Thailand: how Google ranks local results, Business Profile basics, reviews, location pages, booking links and a 30-day plan.",
      zh: "Local SEO for hotels in Thailand: how Google ranks local results, Business Profile basics, reviews, location pages, booking links and a 30-day plan.",
    },
  },
  {
    id: "hotel-marketing",
    slug: "hotel-marketing",
    href: "/insights/hotel-marketing",
    publishedAt: "2023-02-22",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-marketing/th/cover.webp",
    coverImageAlt: "ภาพปกบทความการตลาดโรงแรมคืออะไร เชื่อมการค้นพบจนถึงการจอง โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["10-hotel-marketing-strategies","hotel-marketing-plan-2027","hotel-branding","direct-booking-journey-audit"],
    sources: [
      {
        label: "SiteMinder — Changing Traveller Report 2026 (สำรวจผู้เดินทาง 12,000 คนใน 14 ประเทศ รวมประเทศไทย)",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026 (สำรวจผู้เดินทาง 12,000 คนใน 14 ประเทศ รวมประเทศไทย)",
          en: "SiteMinder — Changing Traveller Report 2026 (12,000 travellers in 14 countries, including Thailand)",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
        labelByLocale: {
          th: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
          en: "Ministry of Tourism and Sports via Nation Thailand — international arrivals, 1 Jan–19 Sep 2026",
        },
        url: "https://www.nationthailand.com/news/tourism/40071305",
      },
      {
        label: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
          en: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 Aug 2026)",
        },
        url: "https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Digital Marketing",
      ru: "Digital-маркетинг отеля",
      zh: "酒店數位行銷",
    },
    title: {
      th: "การตลาดโรงแรม (Hotel Marketing) คืออะไร? 8 กลยุทธ์เชื่อมการค้นพบจนถึงการจอง",
      en: "What Is Hotel Marketing? Why It Matters for Bookings and Revenue (2026 Update)",
      ru: "What Is Hotel Marketing? Why It Matters for Bookings and Revenue (2026 Update)",
      zh: "What Is Hotel Marketing? Why It Matters for Bookings and Revenue (2026 Update)",
    },
    excerpt: {
      th: "การตลาดโรงแรมคือการเชื่อม Google, OTA, Website, Direct Booking, Distribution และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และเลือกจองด้วยข้อมูลที่ชัดเจน โดยไม่รับประกันยอดจองหรือรายได้",
      en: "Hotel marketing in 2026 explained: guests, channels, pricing and measuring net revenue, with a starting plan for small, independent hotels in Thailand.",
      ru: "Hotel marketing in 2026 explained: guests, channels, pricing and measuring net revenue, with a starting plan for small, independent hotels in Thailand.",
      zh: "Hotel marketing in 2026 explained: guests, channels, pricing and measuring net revenue, with a starting plan for small, independent hotels in Thailand.",
    },
  },
  {
    id: "hotel-marketing-plan-2027",
    slug: "hotel-marketing-plan-2027",
    href: "/insights/hotel-marketing-plan-2027",
    publishedAt: "2025-01-25",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-marketing-plan-2027/th/cover.webp",
    coverImageAlt: "ภาพปกบทความแผนการตลาดโรงแรมปี 2027 วางแผนให้ได้รายได้สุทธิเมื่อตลาดไม่โตเท่าเดิม โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["10-hotel-marketing-strategies","hotel-rate-parity"],
    sources: [
      {
        label: "Nation Thailand — Thailand’s tourist arrivals fall 4.59% to 25.46m in 10 months (5 Nov 2026)",
        labelByLocale: {
          th: "Nation Thailand — Thailand’s tourist arrivals fall 4.59% to 25.46m in 10 months (5 Nov 2026)",
          en: "Nation Thailand — Thailand’s tourist arrivals fall 4.59% to 25.46m in 10 months (5 Nov 2026)",
        },
        url: "https://www.nationthailand.com/news/tourism/40073122",
      },
      {
        label: "Skift — Thailand cuts 2026 arrivals forecast, sets 2027 target of at least 33 million (2026)",
        labelByLocale: {
          th: "Skift — Thailand cuts 2026 arrivals forecast, sets 2027 target of at least 33 million (2026)",
          en: "Skift — Thailand cuts 2026 arrivals forecast, sets 2027 target of at least 33 million (2026)",
        },
        url: "https://skift.com/?p=846231",
      },
      {
        label: "Nation Thailand — 52% of Thai hoteliers surveyed expect under 32m foreign arrivals in 2026 (15 Sep 2026)",
        labelByLocale: {
          th: "Nation Thailand — 52% of Thai hoteliers surveyed expect under 32m foreign arrivals in 2026 (15 Sep 2026)",
          en: "Nation Thailand — 52% of Thai hoteliers surveyed expect under 32m foreign arrivals in 2026 (15 Sep 2026)",
        },
        url: "https://www.nationthailand.com/news/tourism/40071054",
      },
      {
        label: "SiteMinder — Changing Traveller Report 2026",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026",
          en: "SiteMinder — Changing Traveller Report 2026",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        labelByLocale: {
          th: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
          en: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        },
        url: "https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "แผนการตลาดโรงแรมปี 2027: วางอย่างไรเมื่อตลาดไม่โตเท่าเดิม (อัปเดต 2569)",
      en: "Hotel Marketing Plan 2027: How to Plan When Thailand's Market Isn't Growing (2026 Update)",
      ru: "Hotel Marketing Plan 2027: How to Plan When Thailand's Market Isn't Growing (2026 Update)",
      zh: "Hotel Marketing Plan 2027: How to Plan When Thailand's Market Isn't Growing (2026 Update)",
    },
    excerpt: {
      th: "แผนการตลาดโรงแรมปี 2027 สำหรับเจ้าของและ GM: ตั้งเป้าจากวันที่ต้องขาย เลือกตลาด จัดช่องทาง OTA และจองตรง แบ่งงบ และแผนรายไตรมาส จากข้อมูลตลาดล่าสุด",
      en: "A hotel marketing plan for 2027 in Thailand: targets by need dates, market mix, OTAs vs direct bookings, budget split and a quarterly plan.",
      ru: "A hotel marketing plan for 2027 in Thailand: targets by need dates, market mix, OTAs vs direct bookings, budget split and a quarterly plan.",
      zh: "A hotel marketing plan for 2027 in Thailand: targets by need dates, market mix, OTAs vs direct bookings, budget split and a quarterly plan.",
    },
  },
  {
    id: "hotel-organizational-structure",
    slug: "hotel-organizational-structure",
    href: "/insights/hotel-organizational-structure",
    publishedAt: "2023-09-20",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-organizational-structure/th/cover.webp",
    coverImageAlt: "ภาพปกบทความโครงสร้างองค์กรโรงแรม แผนก คน และระบบที่ต้องทำงานร่วมกัน โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["small-hotel-marketing-and-operations","hotel-marketing-plan-2027"],
    sources: [
      {
        label: "Nation Thailand — Thai hotels face liquidity crunch amid rising operating costs (19 Jun 2026)",
        labelByLocale: {
          th: "Nation Thailand — Thai hotels face liquidity crunch amid rising operating costs (19 Jun 2026)",
          en: "Nation Thailand — Thai hotels face liquidity crunch amid rising operating costs (19 Jun 2026)",
        },
        url: "https://www.nationthailand.com/business/economy/40067617",
      },
      {
        label: "Nation Thailand — Thai hotels expect weaker second-half revenues in 2025 (THA–BOT survey, 25 Dec 2025)",
        labelByLocale: {
          th: "Nation Thailand — Thai hotels expect weaker second-half revenues in 2025 (THA–BOT survey, 25 Dec 2025)",
          en: "Nation Thailand — Thai hotels expect weaker second-half revenues in 2025 (THA–BOT survey, 25 Dec 2025)",
        },
        url: "https://www.nationthailand.com/news/tourism/40060290",
      },
      {
        label: "Nation Thailand — 52% of Thai hoteliers surveyed expect under 32m foreign arrivals in 2026 (15 Sep 2026)",
        labelByLocale: {
          th: "Nation Thailand — 52% of Thai hoteliers surveyed expect under 32m foreign arrivals in 2026 (15 Sep 2026)",
          en: "Nation Thailand — 52% of Thai hoteliers surveyed expect under 32m foreign arrivals in 2026 (15 Sep 2026)",
        },
        url: "https://www.nationthailand.com/news/tourism/40071054",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "โครงสร้างองค์กรโรงแรม: แผนก คน และระบบที่ต้องทำงานร่วมกัน (อัปเดต 2569)",
      en: "Hotel Organizational Structure: Departments, Roles and Systems for Independent Hotels (2026 Update)",
      ru: "Hotel Organizational Structure: Departments, Roles and Systems for Independent Hotels (2026 Update)",
      zh: "Hotel Organizational Structure: Departments, Roles and Systems for Independent Hotels (2026 Update)",
    },
    excerpt: {
      th: "โครงสร้างองค์กรโรงแรมสำหรับโรงแรมอิสระ: แผนกหลัก หน้าที่ของแต่ละฝ่าย จำนวนคนตามขนาดโรงแรม ระบบ PMS และ Channel Manager และวิธีส่งต่องานไม่ให้ตกหล่น",
      en: "Hotel organizational structure for independent hotels: core departments, roles by size, PMS and channel manager basics, and handovers that protect revenue.",
      ru: "Hotel organizational structure for independent hotels: core departments, roles by size, PMS and channel manager basics, and handovers that protect revenue.",
      zh: "Hotel organizational structure for independent hotels: core departments, roles by size, PMS and channel manager basics, and handovers that protect revenue.",
    },
  },
  {
    id: "hotel-rate-parity",
    slug: "hotel-rate-parity",
    href: "/insights/hotel-rate-parity",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-rate-parity/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ Rate Parity คืออะไร และโรงแรมควรคุมราคาทุกช่องทางอย่างไร โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["what-is-ota","increase-hotel-bookings-from-google"],
    sources: [
      {
        label: "Cyprus Mail / Reuters — Booking.com’s price curbs on hotels may hinder competition, EU top court says (22 Sep 2024)",
        labelByLocale: {
          th: "Cyprus Mail / Reuters — Booking.com’s price curbs on hotels may hinder competition, EU top court says (22 Sep 2024)",
          en: "Cyprus Mail / Reuters — Booking.com’s price curbs on hotels may hinder competition, EU top court says (22 Sep 2024)",
        },
        url: "https://cyprus-mail.com/2024/09/22/booking-coms-price-curbs-on-hotels-may-hinder-competition-eu-top-court-says",
      },
      {
        label: "Irish Legal News — Booking.com now required to comply with EU Digital Markets Act (Nov 2024)",
        labelByLocale: {
          th: "Irish Legal News — Booking.com now required to comply with EU Digital Markets Act (Nov 2024)",
          en: "Irish Legal News — Booking.com now required to comply with EU Digital Markets Act (Nov 2024)",
        },
        url: "https://www.irishlegal.com/articles/bookingcom-now-required-to-comply-with-eu-digital-markets-act",
      },
      {
        label: "Rental Scale-Up — Booking.com rate parity and the DMA: September 2026 changes (2026)",
        labelByLocale: {
          th: "Rental Scale-Up — Booking.com rate parity and the DMA: September 2026 changes (2026)",
          en: "Rental Scale-Up — Booking.com rate parity and the DMA: September 2026 changes (2026)",
        },
        url: "https://www.rentalscaleup.com/booking-com-rate-parity-dma-2026/",
      },
      {
        label: "Hospitality Net — Europe killed the parity clause. Parity didn’t die. (2026)",
        labelByLocale: {
          th: "Hospitality Net — Europe killed the parity clause. Parity didn’t die. (2026)",
          en: "Hospitality Net — Europe killed the parity clause. Parity didn’t die. (2026)",
        },
        url: "https://www.hospitalitynet.org/opinion/4133110/europe-killed-the-parity-clause-parity-didnt-die",
      },
      {
        label: "Google Hotel Center Help — Price accuracy",
        labelByLocale: {
          th: "Google Hotel Center Help — Price accuracy",
          en: "Google Hotel Center Help — Price accuracy",
        },
        url: "https://support.google.com/hotelprices/answer/6069469",
      },
    ],
    category: {
      th: "การจองตรง",
      en: "OTA / Direct Booking",
      ru: "OTA / Direct Booking",
      zh: "OTA / Direct Booking",
    },
    title: {
      th: "Rate Parity คืออะไร? โรงแรมควรคุมราคาทุกช่องทางอย่างไรในปี 2569 (อัปเดต 2569)",
      en: "Hotel Rate Parity: What It Means and How to Control Prices Across Channels (2026 Update)",
      ru: "Hotel Rate Parity: What It Means and How to Control Prices Across Channels (2026 Update)",
      zh: "Hotel Rate Parity: What It Means and How to Control Prices Across Channels (2026 Update)",
    },
    excerpt: {
      th: "Rate Parity คืออะไร ต่างจาก Rate Disparity อย่างไร ทำไมราคาหลุด และโรงแรมควรตรวจราคา OTA เว็บไซต์ และ Google อย่างไร พร้อมข้อเสนอจองตรงที่ไม่ต้องลดราคา",
      en: "Hotel rate parity explained: wide vs narrow parity, Europe's ban, why rates leak, how to check OTA, website and Google prices, and direct-booking perks.",
      ru: "Hotel rate parity explained: wide vs narrow parity, Europe's ban, why rates leak, how to check OTA, website and Google prices, and direct-booking perks.",
      zh: "Hotel rate parity explained: wide vs narrow parity, Europe's ban, why rates leak, how to check OTA, website and Google prices, and direct-booking perks.",
    },
  },
  {
    id: "hotel-review-management",
    slug: "hotel-review-management",
    href: "/insights/hotel-review-management",
    publishedAt: "2024-09-20",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 9,
    coverImage: "/images/blog/hotel-review-management/th/cover.webp",
    coverImageAlt: "ภาพปกบทความจัดการรีวิวโรงแรม: ขอรีวิว ตอบรีวิว และใช้รีวิวให้ได้ยอดจอง โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-local-seo","hotel-social-media"],
    sources: [
      {
        label: "BrightLocal — Local Consumer Review Survey 2026 (11 Feb 2026)",
        labelByLocale: {
          th: "BrightLocal — Local Consumer Review Survey 2026 (11 Feb 2026)",
          en: "BrightLocal — Local Consumer Review Survey 2026 (11 Feb 2026)",
        },
        url: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
      {
        label: "BrightLocal — Small businesses can’t keep up with consumer review expectations (21 Oct 2026)",
        labelByLocale: {
          th: "BrightLocal — Small businesses can’t keep up with consumer review expectations (21 Oct 2026)",
          en: "BrightLocal — Small businesses can’t keep up with consumer review expectations (21 Oct 2026)",
        },
        url: "https://www.brightlocal.com/blog/smb-report-enough-reviews/",
      },
      {
        label: "Google — Hotels Business Profile Best Practices Playbook 2026",
        labelByLocale: {
          th: "Google — Hotels Business Profile Best Practices Playbook 2026",
          en: "Google — Hotels Business Profile Best Practices Playbook 2026",
        },
        url: "https://services.google.com/fh/files/helpcenter/hotels_gbp_best_practices_playbook_2026.pdf",
      },
      {
        label: "Google Maps — Prohibited and restricted content (review policy)",
        labelByLocale: {
          th: "Google Maps — Prohibited and restricted content (review policy)",
          en: "Google Maps — Prohibited and restricted content (review policy)",
        },
        url: "https://support.google.com/contributionpolicy/answer/7400114?hl=en",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "จัดการรีวิวโรงแรมอย่างไรให้สร้างความน่าเชื่อถือและยอดจอง (อัปเดต 2569)",
      en: "Hotel Review Management: How to Ask, Reply and Turn Reviews into Bookings (2026 Update)",
      ru: "Hotel Review Management: How to Ask, Reply and Turn Reviews into Bookings (2026 Update)",
      zh: "Hotel Review Management: How to Ask, Reply and Turn Reviews into Bookings (2026 Update)",
    },
    excerpt: {
      th: "จัดการรีวิวโรงแรมให้ได้ผล: ขอรีวิวอย่างถูกกติกา ตอบรีวิวดีและรีวิวเชิงลบ ใช้รีวิวบนโซเชียล และตัวเลขที่ควรวัด สำหรับเจ้าของและ GM โรงแรม",
      en: "Hotel review management for owners and GMs: how to ask for reviews within Google's rules, reply to good and negative reviews, and track the numbers that matter.",
      ru: "Hotel review management for owners and GMs: how to ask for reviews within Google's rules, reply to good and negative reviews, and track the numbers that matter.",
      zh: "Hotel review management for owners and GMs: how to ask for reviews within Google's rules, reply to good and negative reviews, and track the numbers that matter.",
    },
  },
  {
    id: "hotel-seo",
    slug: "hotel-seo",
    href: "/insights/hotel-seo",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-seo/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ SEO โรงแรม ทำอย่างไรให้เว็บไซต์โรงแรมติดหน้าแรก Google โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-website-content","hotel-local-seo"],
    sources: [
      {
        label: "Search Engine Journal — Google begins rolling out May 2026 core update (21 May 2026)",
        labelByLocale: {
          th: "Search Engine Journal — Google begins rolling out May 2026 core update (21 May 2026)",
          en: "Search Engine Journal — Google begins rolling out May 2026 core update (21 May 2026)",
        },
        url: "https://www.searchenginejournal.com/google-begins-rolling-out-may-2026-core-update/575589/",
      },
      {
        label: "Momentic — November 2026 core update",
        labelByLocale: {
          th: "Momentic — November 2026 core update",
          en: "Momentic — November 2026 core update",
        },
        url: "https://momenticmarketing.com/google-updates/november-2026-core-update",
      },
      {
        label: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        labelByLocale: {
          th: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
          en: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        },
        url: "https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/",
      },
      {
        label: "SiteMinder — Changing Traveller Report 2026",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026",
          en: "SiteMinder — Changing Traveller Report 2026",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "Google Search Central — SEO Starter Guide",
        labelByLocale: {
          th: "Google Search Central — SEO Starter Guide",
          en: "Google Search Central — SEO Starter Guide",
        },
        url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
      },
    ],
    category: {
      th: "SEO และ Local Search",
      en: "SEO / Local Search",
      ru: "SEO / Local Search",
      zh: "SEO / Local Search",
    },
    title: {
      th: "SEO โรงแรม: ทำอย่างไรให้เว็บไซต์โรงแรมติดหน้าแรก Google (อัปเดต 2569)",
      en: "Hotel SEO: How to Get Your Hotel Website on Page One of Google (2026 Update)",
      ru: "Hotel SEO: How to Get Your Hotel Website on Page One of Google (2026 Update)",
      zh: "Hotel SEO: How to Get Your Hotel Website on Page One of Google (2026 Update)",
    },
    excerpt: {
      th: "SEO โรงแรมสำหรับเจ้าของและ GM: คำค้นแบบไหนติดหน้าแรกได้จริง พื้นฐานเทคนิค หน้าที่ต้องมี Google Maps ลิงก์ และวิธีวัดผลเป็นยอดจอง พร้อมแผน 90 วัน",
      en: "Hotel SEO for owners in Thailand: searches you can win, technical basics, pages to build, Google Maps, links and a 90-day plan measured in bookings.",
      ru: "Hotel SEO for owners in Thailand: searches you can win, technical basics, pages to build, Google Maps, links and a 90-day plan measured in bookings.",
      zh: "Hotel SEO for owners in Thailand: searches you can win, technical basics, pages to build, Google Maps, links and a 90-day plan measured in bookings.",
    },
  },
  {
    id: "hotel-social-media",
    slug: "hotel-social-media",
    href: "/insights/hotel-social-media",
    publishedAt: "2023-08-14",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 12,
    coverImage: "/images/blog/hotel-social-media/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ โซเชียลมีเดียโรงแรม เลือกช่องทางไหนให้ได้ยอดจอง แสดงโทรศัพท์ที่มีโพสต์ของโรงแรมและข้อความลูกค้าถามห้องว่าง",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-social-media-mistakes","hotel-review-management"],
    sources: [
      {
        label: "DataReportal — Digital 2026: Thailand (We Are Social / Meltwater)",
        labelByLocale: {
          th: "DataReportal — Digital 2026: Thailand (We Are Social / Meltwater)",
          en: "DataReportal — Digital 2026: Thailand (We Are Social / Meltwater)",
        },
        url: "https://datareportal.com/reports/digital-2026-thailand",
      },
      {
        label: "InsightEra — สรุป Digital 2026 Thailand: แพลตฟอร์มที่คนไทยใช้",
        labelByLocale: {
          th: "InsightEra — สรุป Digital 2026 Thailand: แพลตฟอร์มที่คนไทยใช้",
          en: "InsightEra — Digital 2026 Thailand summary: platforms Thais use (Thai)",
        },
        url: "https://www.insightera.co.th/digital-2026-thailand/",
      },
      {
        label: "SiteMinder — Changing Traveller Report 2026",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026",
          en: "SiteMinder — Changing Traveller Report 2026",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "แหล่งตรวจคุณสมบัติแพลตฟอร์ม (ตรวจ 28 ก.ย. 2569): Meta Business Suite",
        labelByLocale: {
          th: "แหล่งตรวจคุณสมบัติแพลตฟอร์ม (ตรวจ 28 ก.ย. 2569): Meta Business Suite",
          en: "Platform features checked 28 Sep 2026: Meta Business Suite",
        },
        url: "https://www.facebook.com/business/tools/meta-business-suite",
      },
      {
        label: "Meta Inbox",
        labelByLocale: {
          th: "Meta Inbox",
          en: "Meta Inbox",
        },
        url: "https://www.facebook.com/business/help/294426838452244",
      },
      {
        label: "Instagram business profile",
        labelByLocale: {
          th: "Instagram business profile",
          en: "Instagram business profile",
        },
        url: "https://help.instagram.com/138925576505882/",
      },
      {
        label: "TikTok for Business — Travel",
        labelByLocale: {
          th: "TikTok for Business — Travel",
          en: "TikTok for Business — Travel",
        },
        url: "https://ads.tiktok.com/business/en/industries/travel",
      },
      {
        label: "YouTube — links in videos",
        labelByLocale: {
          th: "YouTube — links in videos",
          en: "YouTube — links in videos",
        },
        url: "https://support.google.com/youtube/answer/13748639?hl=en-419",
      },
      {
        label: "LINE Official Account Help Center",
        labelByLocale: {
          th: "LINE Official Account Help Center",
          en: "LINE Official Account Help Center",
        },
        url: "https://lineforbusiness.com/th/helpcenter/line-oa",
      },
      {
        label: "X Help Center",
        labelByLocale: {
          th: "X Help Center",
          en: "X Help Center",
        },
        url: "https://help.x.com/en/using-x",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "โซเชียลมีเดียโรงแรม: เลือกช่องทางไหนให้เหมาะกับลูกค้าและเป้าหมายการจอง (อัปเดต 2569)",
      en: "Hotel Social Media: Choosing the Right Channels for Your Guests and Booking Goals (2026 Update)",
      ru: "Hotel Social Media: Choosing the Right Channels for Your Guests and Booking Goals (2026 Update)",
      zh: "Hotel Social Media: Choosing the Right Channels for Your Guests and Booking Goals (2026 Update)",
    },
    excerpt: {
      th: "โซเชียลมีเดียโรงแรมปี 2569: เทียบ Facebook, Instagram, TikTok, YouTube, LINE OA และ X พร้อมวิธีเลือกช่องทาง เชื่อมไปการจอง และวัดผลอย่างคุ้มค่า",
      en: "Hotel social media in 2026: Facebook, Instagram, TikTok, YouTube, LINE and X compared, how to choose channels and turn posts into bookings.",
      ru: "Hotel social media in 2026: Facebook, Instagram, TikTok, YouTube, LINE and X compared, how to choose channels and turn posts into bookings.",
      zh: "Hotel social media in 2026: Facebook, Instagram, TikTok, YouTube, LINE and X compared, how to choose channels and turn posts into bookings.",
    },
  },
  {
    id: "hotel-social-media-mistakes",
    slug: "hotel-social-media-mistakes",
    href: "/insights/hotel-social-media-mistakes",
    publishedAt: "2023-07-04",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 9,
    coverImage: "/images/blog/hotel-social-media-mistakes/th/cover.webp",
    coverImageAlt: "ภาพปกบทความโพสต์โซเชียลโรงแรมต้องระวังอะไร 7 จุดที่ควรตรวจก่อนเผยแพร่ โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-social-media","hotel-review-management"],
    sources: [
      {
        label: "Tilleke & Gibbins — Thailand’s Updated Alcohol Law Balances Public Health and Tourism (Sep 2025)",
        labelByLocale: {
          th: "Tilleke & Gibbins — Thailand’s Updated Alcohol Law Balances Public Health and Tourism (Sep 2025)",
          en: "Tilleke & Gibbins — Thailand’s Updated Alcohol Law Balances Public Health and Tourism (Sep 2025)",
        },
        url: "https://www.tilleke.com/insights/thailands-updated-alcohol-law-balances-public-health-and-tourism/",
      },
      {
        label: "Asia News Network / The Nation — Thailand’s new alcohol control law takes effect (10 Nov 2025)",
        labelByLocale: {
          th: "Asia News Network / The Nation — Thailand’s new alcohol control law takes effect (10 Nov 2025)",
          en: "Asia News Network / The Nation — Thailand’s new alcohol control law takes effect (10 Nov 2025)",
        },
        url: "https://asianews.network/?p=237602",
      },
      {
        label: "Herbert Smith Freehills Kramer — Thailand ramps up data protection enforcement (Aug 2025)",
        labelByLocale: {
          th: "Herbert Smith Freehills Kramer — Thailand ramps up data protection enforcement (Aug 2025)",
          en: "Herbert Smith Freehills Kramer — Thailand ramps up data protection enforcement (Aug 2025)",
        },
        url: "https://www.hlc.com/en/publications/thailand-ramps-up-data-protection-enforcement",
      },
      {
        label: "Google — Hotels Business Profile Best Practices Playbook 2026",
        labelByLocale: {
          th: "Google — Hotels Business Profile Best Practices Playbook 2026",
          en: "Google — Hotels Business Profile Best Practices Playbook 2026",
        },
        url: "https://services.google.com/fh/files/helpcenter/hotels_gbp_best_practices_playbook_2026.pdf",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "โพสต์โซเชียลโรงแรมต้องระวังอะไร? 7 จุดที่ควรตรวจก่อนกดเผยแพร่ (อัปเดต 2569)",
      en: "Hotel Social Media Mistakes: 7 Checks Before You Post in Thailand (2026 Update)",
      ru: "Hotel Social Media Mistakes: 7 Checks Before You Post in Thailand (2026 Update)",
      zh: "Hotel Social Media Mistakes: 7 Checks Before You Post in Thailand (2026 Update)",
    },
    excerpt: {
      th: "โพสต์โซเชียลโรงแรมให้ปลอดภัย: ตรวจข้อมูลห้อง ราคา โปรโมชัน เครื่องดื่มแอลกอฮอล์ PDPA ลิขสิทธิ์ และคนตอบแชต ก่อนกดเผยแพร่ พร้อมเช็กลิสต์สำหรับทีมโรงแรม",
      en: "Avoid hotel social media mistakes in Thailand: wrong prices, alcohol ads, guest privacy (PDPA), music rights and slow replies. A checklist for owners.",
      ru: "Avoid hotel social media mistakes in Thailand: wrong prices, alcohol ads, guest privacy (PDPA), music rights and slow replies. A checklist for owners.",
      zh: "Avoid hotel social media mistakes in Thailand: wrong prices, alcohol ads, guest privacy (PDPA), music rights and slow replies. A checklist for owners.",
    },
  },
  {
    id: "hotel-website-content",
    slug: "hotel-website-content",
    href: "/insights/hotel-website-content",
    publishedAt: "2024-12-29",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/hotel-website-content/th/cover.webp",
    coverImageAlt: "ภาพปกบทความคอนเทนต์เว็บไซต์โรงแรม ปรับอย่างไรให้ค้นพบบน Google และจองง่ายขึ้น โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-seo","increase-hotel-bookings-from-google"],
    sources: [
      {
        label: "SiteMinder — Changing Traveller Report 2026",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026",
          en: "SiteMinder — Changing Traveller Report 2026",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        labelByLocale: {
          th: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
          en: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        },
        url: "https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/",
      },
      {
        label: "Search Engine Journal — Google begins rolling out May 2026 core update (21 May 2026)",
        labelByLocale: {
          th: "Search Engine Journal — Google begins rolling out May 2026 core update (21 May 2026)",
          en: "Search Engine Journal — Google begins rolling out May 2026 core update (21 May 2026)",
        },
        url: "https://www.searchenginejournal.com/google-begins-rolling-out-may-2026-core-update/575589/",
      },
      {
        label: "Google Search Central — Creating helpful, reliable, people-first content",
        labelByLocale: {
          th: "Google Search Central — Creating helpful, reliable, people-first content",
          en: "Google Search Central — Creating helpful, reliable, people-first content",
        },
        url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
      },
    ],
    category: {
      th: "SEO และ Local Search",
      en: "SEO / Local Search",
      ru: "SEO / Local Search",
      zh: "SEO / Local Search",
    },
    title: {
      th: "คอนเทนต์เว็บไซต์โรงแรม: ปรับอย่างไรให้ค้นพบบน Google และจองง่ายขึ้น (อัปเดต 2569)",
      en: "Hotel Website Content: How to Get Found on Google and Make Booking Easier (2026 Update)",
      ru: "Hotel Website Content: How to Get Found on Google and Make Booking Easier (2026 Update)",
      zh: "Hotel Website Content: How to Get Found on Google and Make Booking Easier (2026 Update)",
    },
    excerpt: {
      th: "ปรับคอนเทนต์เว็บไซต์โรงแรมให้ตอบคำถามก่อนจอง: หน้าห้องพัก หน้าทำเล ชื่อหน้า ภาพและ alt text คำถามที่พบบ่อย การอัปเดต และการวัดผลจาก Google ถึงยอดจอง",
      en: "Improve your hotel website content: room pages, location pages, titles, photos and alt text, FAQs, updates, and how to measure from Google search to booking.",
      ru: "Improve your hotel website content: room pages, location pages, titles, photos and alt text, FAQs, updates, and how to measure from Google search to booking.",
      zh: "Improve your hotel website content: room pages, location pages, titles, photos and alt text, FAQs, updates, and how to measure from Google search to booking.",
    },
  },
  {
    id: "increase-hotel-bookings-from-google",
    slug: "increase-hotel-bookings-from-google",
    href: "/insights/increase-hotel-bookings-from-google",
    publishedAt: "2024-09-19",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/increase-hotel-bookings-from-google/th/cover.webp",
    coverImageAlt: "ภาพปกบทความเพิ่มยอดจองโรงแรมจาก Google ด้วย SEO, Google Maps และ Google Ads โดย The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-seo","hotel-local-seo"],
    sources: [
      {
        label: "SiteMinder — Changing Traveller Report 2026",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026",
          en: "SiteMinder — Changing Traveller Report 2026",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        labelByLocale: {
          th: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
          en: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        },
        url: "https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/",
      },
      {
        label: "Google — Hotels Business Profile Best Practices Playbook 2026",
        labelByLocale: {
          th: "Google — Hotels Business Profile Best Practices Playbook 2026",
          en: "Google — Hotels Business Profile Best Practices Playbook 2026",
        },
        url: "https://services.google.com/fh/files/helpcenter/hotels_gbp_best_practices_playbook_2026.pdf",
      },
      {
        label: "Google Hotel Center Help — Free booking links",
        labelByLocale: {
          th: "Google Hotel Center Help — Free booking links",
          en: "Google Hotel Center Help — Free booking links",
        },
        url: "https://support.google.com/hotelprices/answer/10472393",
      },
    ],
    category: {
      th: "SEO และ Local Search",
      en: "SEO / Local Search",
      ru: "SEO / Local Search",
      zh: "SEO / Local Search",
    },
    title: {
      th: "เพิ่มยอดจองโรงแรมจาก Google: ใช้ SEO, Google Maps และ Google Ads ให้การค้นหากลายเป็นการจอง (อัปเดต 2569)",
      en: "How to Increase Hotel Bookings from Google: SEO, Google Maps and Google Ads Working Together (2026 Update)",
      ru: "How to Increase Hotel Bookings from Google: SEO, Google Maps and Google Ads Working Together (2026 Update)",
      zh: "How to Increase Hotel Bookings from Google: SEO, Google Maps and Google Ads Working Together (2026 Update)",
    },
    excerpt: {
      th: "เพิ่มยอดจองโรงแรมจาก Google อย่างเป็นระบบ: ปิดจุดรั่วบนเว็บไซต์ ใช้ SEO, Google Maps, Free Booking Links และ Google Ads ร่วมกัน และวัดผลเป็นการจองจริง",
      en: "Increase hotel bookings from Google: fix booking leaks first, then combine SEO, Google Maps, free booking links and Google Ads, and measure real bookings.",
      ru: "Increase hotel bookings from Google: fix booking leaks first, then combine SEO, Google Maps, free booking links and Google Ads, and measure real bookings.",
      zh: "Increase hotel bookings from Google: fix booking leaks first, then combine SEO, Google Maps, free booking links and Google Ads, and measure real bookings.",
    },
  },
  {
    id: "small-hotel-marketing-and-operations",
    slug: "small-hotel-marketing-and-operations",
    href: "/insights/small-hotel-marketing-and-operations",
    publishedAt: "2023-06-10",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 10,
    coverImage: "/images/blog/small-hotel-marketing-and-operations/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ 7 วิธีบริหารและทำการตลาดโรงแรมขนาดเล็ก เมื่อห้องน้อยและทีมงานจำกัด อัปเดตปลายปี 2569 บนพื้นสีเขียวมะนาวของ The KPI Plus",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-organizational-structure","hotel-rate-parity"],
    sources: [
      {
        label: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
        labelByLocale: {
          th: "กระทรวงการท่องเที่ยวและกีฬา ผ่าน Nation Thailand — สถิตินักท่องเที่ยวต่างชาติ 1 ม.ค.–19 ก.ย. 2569",
          en: "Ministry of Tourism and Sports via Nation Thailand — foreign arrivals 1 Jan–19 Sep 2026",
        },
        url: "https://www.nationthailand.com/news/tourism/40071305",
      },
      {
        label: "TAT Newsroom — มาตรการยกเว้นการตรวจลงตรา 30 วันและ 15 วัน มีผล 15 ก.ย. 2569",
        labelByLocale: {
          th: "TAT Newsroom — มาตรการยกเว้นการตรวจลงตรา 30 วันและ 15 วัน มีผล 15 ก.ย. 2569",
          en: "TAT Newsroom — new 30-day and 15-day visa exemption rules from 15 September 2026",
        },
        url: "https://www.tatnews.org/2026/09/thailand-introduces-new-30-day-and-15-day-visa-exemption-rules-from-15-september/",
      },
      {
        label: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
          en: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 Aug 2026)",
        },
        url: "https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/",
      },
    ],
    category: {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    },
    title: {
      th: "7 วิธีบริหารและทำการตลาดโรงแรมขนาดเล็ก เมื่อห้องน้อยและทีมงานจำกัด (อัปเดตปลายปี 2569)",
      en: "Small Hotel Marketing: 7 Ways to Run and Market a Small Hotel with a Small Team (2026 Update)",
      ru: "Small Hotel Marketing: 7 Ways to Run and Market a Small Hotel with a Small Team (2026 Update)",
      zh: "Small Hotel Marketing: 7 Ways to Run and Market a Small Hotel with a Small Team (2026 Update)",
    },
    excerpt: {
      th: "การตลาดโรงแรมขนาดเล็กเมื่อห้องน้อยและทีมจำกัด: 7 วิธีดูแลจุดขาย ช่องทางจอง ราคา การตอบลูกค้า ห้องว่าง และรีวิว อัปเดตปลายปี 2569",
      en: "Small hotel marketing for properties with few rooms and a small team: a clear selling point, consistent listings, night-by-night offers, replies and reviews.",
      ru: "Small hotel marketing for properties with few rooms and a small team: a clear selling point, consistent listings, night-by-night offers, replies and reviews.",
      zh: "Small hotel marketing for properties with few rooms and a small team: a clear selling point, consistent listings, night-by-night offers, replies and reviews.",
    },
  },
  {
    id: "what-is-ota",
    slug: "what-is-ota",
    href: "/insights/what-is-ota",
    publishedAt: "2023-06-21",
    updatedAt: "2026-11-17",
    readingTimeMinutes: 11,
    coverImage: "/images/blog/what-is-ota/th/cover.webp",
    coverImageAlt: "ภาพปกบทความ OTA คืออะไร และช่วยโรงแรมเติบโตอย่างไร แสดงเครือข่ายเชื่อมโรงแรม ช่องทางขายออนไลน์ และลูกค้า",
    coverImageFit: "cover",
    coverImageStatus: "approved",
    
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ["hotel-rate-parity","increase-hotel-bookings-from-google"],
    sources: [
      {
        label: "SiteMinder — Changing Traveller Report 2026 (สำรวจผู้เดินทาง 12,000 คนใน 14 ประเทศ รวมประเทศไทย)",
        labelByLocale: {
          th: "SiteMinder — Changing Traveller Report 2026 (สำรวจผู้เดินทาง 12,000 คนใน 14 ประเทศ รวมประเทศไทย)",
          en: "SiteMinder — Changing Traveller Report 2026 (12,000 travellers in 14 countries, including Thailand)",
        },
        url: "https://www.siteminder.com/news/changing-traveller-report-2026/",
      },
      {
        label: "Google — How to book travel with AI Mode in Google Search (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Google — How to book travel with AI Mode in Google Search (27 ส.ค. 2569)",
          en: "Google — How to book travel with AI Mode in Google Search (27 Aug 2026)",
        },
        url: "https://blog.google/products-and-platforms/products/search/book-travel-ai-mode/",
      },
      {
        label: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
        labelByLocale: {
          th: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 ส.ค. 2569)",
          en: "Skift — Google’s Agentic Hotel Booking Tool Comes to AI Mode (27 Aug 2026)",
        },
        url: "https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/",
      },
    ],
    category: {
      th: "การจองตรง",
      en: "OTA / Direct Booking",
      ru: "OTA / Direct Booking",
      zh: "OTA / Direct Booking",
    },
    title: {
      th: "OTA คืออะไร? โรงแรมใช้เพิ่มยอดจองอย่างไรให้คุ้มค่า (อัปเดต 2569)",
      en: "What Is an OTA? How Hotels Can Use Online Travel Agencies Profitably (2026 Update)",
      ru: "What Is an OTA? How Hotels Can Use Online Travel Agencies Profitably (2026 Update)",
      zh: "What Is an OTA? How Hotels Can Use Online Travel Agencies Profitably (2026 Update)",
    },
    excerpt: {
      th: "OTA คืออะไร: ช่องทางจองโรงแรมออนไลน์อย่าง Agoda และ Booking.com วิธีทำงาน ประโยชน์ ค่าคอมมิชชัน บทบาทในยุค AI และตัวเลขที่โรงแรมควรวัด",
      en: "What is an OTA? Agoda and Booking.com explained for hotels: how OTAs work, how they help growth, commission, AI booking and the numbers to track.",
      ru: "What is an OTA? Agoda and Booking.com explained for hotels: how OTAs work, how they help growth, commission, AI booking and the numbers to track.",
      zh: "What is an OTA? Agoda and Booking.com explained for hotels: how OTAs work, how they help growth, commission, AI booking and the numbers to track.",
    },
  }
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

/** Reading time from article blocks. Thai uses character pace; Latin uses word pace. */
export function estimateInsightReadingMinutes(blocks: HandoffBlock[]) {
  const text = blocks
    .map((block) => {
      if ("text" in block && typeof block.text === "string") return block.text;
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "table") return [...block.headers, ...block.rows.flat()].join(" ");
      return "";
    })
    .join(" ")
    .trim();
  if (!text) return 0;
  const thaiChars = [...text].filter((char) => /[\u0E00-\u0E7F]/.test(char)).length;
  if (thaiChars >= 400) return Math.max(1, Math.round(thaiChars / 500));
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
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
    sourcesNote:
      "ชื่อผลิตภัณฑ์ นโยบาย และอินเทอร์เฟซของแพลตฟอร์มอาจเปลี่ยนแปลงได้ ตรวจสอบคำแนะนำล่าสุดจากศูนย์ช่วยเหลือทางการที่ลิงก์ไว้ ตัวเลขในบทความนี้เป็นชื่อตัวชี้วัดที่โรงแรมควรนิยามและเลือกช่วงเวลาจากระบบของตนเอง ไม่ใช่ผลวิจัยภายนอกที่อ้างในบทความ",
    reviewedBy: "ตรวจทาน",
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
    tocOpen: "ในบทความนี้",
    tocCurrent: "ส่วนที่กำลังอ่าน",
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
    sourcesNote:
      "Platform product names, policies, and interfaces can change. Confirm current guidance in the linked official help centres. Metric names in this article are labels hotels should define and periodise from their own systems — not external research figures cited here.",
    reviewedBy: "Reviewed by",
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
    toc: "In this article",
    tocOpen: "In this article",
    tocCurrent: "current section",
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
    sourcesNote:
      "Platform product names, policies, and interfaces can change. Confirm current guidance in the linked official help centres. Metric names in this article are labels hotels should define and periodise from their own systems — not external research figures cited here.",
    reviewedBy: "Reviewed by",
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
    tocOpen: "В этой статье",
    tocCurrent: "current section",
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
    sourcesNote:
      "Platform product names, policies, and interfaces can change. Confirm current guidance in the linked official help centres. Metric names in this article are labels hotels should define and periodise from their own systems — not external research figures cited here.",
    reviewedBy: "Reviewed by",
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
    tocOpen: "本文內容",
    tocCurrent: "current section",
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

/** Stable unique IDs for article h2 anchors / TOC links (handles duplicate titles). */
export function buildInsightHeadingIds(texts: string[]) {
  const seen = new Map<string, number>();
  return texts.map((text) => {
    const base = insightHeadingId(text) || "section";
    const next = (seen.get(base) ?? 0) + 1;
    seen.set(base, next);
    return next === 1 ? base : `${base}-${next}`;
  });
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
