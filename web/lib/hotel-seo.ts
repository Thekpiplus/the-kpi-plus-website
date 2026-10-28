import { formatInsightDate, insightExcerpt, insightPosts, insightsIndexCopy, insightUpdatedAt } from "@/lib/insights";
import { barePath, existingHref, pageByRoute, type Locale } from "@/lib/seo";

export type HotelSeoVisualStatus = "placeholder" | "sample" | "approved" | "real";
export type HotelSeoKpiStatus = "draft" | "sample" | "approved" | "anonymised";
export type HotelSeoSourceStatus = "platform_estimate" | "guidance" | "sample" | "approved";

export type HotelSeoSource = {
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  market: string;
  period: string;
  definition: string;
  status: HotelSeoSourceStatus;
};

export const HOTEL_SEO_SOURCES = {
  aiFeatures: {
    name: "Google Search Central — AI features and your website",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
    publishedAt: "2025",
    accessedAt: "2026-10-27",
    market: "Global guidance",
    period: "Guidance as accessed 27 Oct 2026",
    definition: "Google’s public guidance that usual SEO work still applies to AI Overviews and AI Mode. Not a hotel ranking result.",
    status: "guidance",
  },
  aiModeTh: {
    name: "blog.google — AI Mode in Thailand",
    url: "https://blog.google/intl/th-th/products/consumer-products/ai-mode/",
    publishedAt: "2025-08",
    accessedAt: "2026-10-27",
    market: "Thailand",
    period: "August–October 2025 product updates",
    definition: "Google announced AI Mode in Thailand in August 2025 and Thai-language support in October 2025. This is a product launch fact, not a hotel performance result.",
    status: "guidance",
  },
  searchIo: {
    name: "blog.google — Search I/O 2026",
    url: "https://blog.google/intl/th-th/products/consumer-products/search-io-2026/",
    publishedAt: "2026",
    accessedAt: "2026-10-27",
    market: "Worldwide",
    period: "2026, worldwide monthly users as reported by Google",
    definition: "Google reported about 1 billion monthly AI Mode users worldwide in 2026. This is a global platform estimate, not Thailand usage and not a hotel campaign result.",
    status: "platform_estimate",
  },
  localRank: {
    name: "Google Business Profile Help — How local results work",
    url: "https://support.google.com/business/answer/7091?hl=en",
    publishedAt: "Guidance",
    accessedAt: "2026-10-27",
    market: "Global guidance",
    period: "Guidance as accessed 27 Oct 2026",
    definition: "Google lists relevance, distance, and prominence as the main local ranking factors. This is product help, not a hotel Maps rank.",
    status: "guidance",
  },
} as const satisfies Record<string, HotelSeoSource>;

export const HOTEL_SEO_VISUAL = {
  displayWidth: 960,
  displayHeight: 600,
} as const;

/** Deterministic Search → Maps → Website → Contact sample. Omit src when the file is missing. */
export const HOTEL_SEO_HERO_VISUAL_CANDIDATE = "/images/hotel-seo-local-search-hero-placeholder.webp";

export const HOTEL_SEO_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  alt: {
    th: "ตัวอย่างเส้นทาง Local Search จาก Search ไป Google Maps เว็บไซต์ และการติดต่อหรือจอง ไม่ใช่ผลโรงแรมจริง",
    en: "Sample Local Search path from Search to Google Maps, the website, and contact or booking. Not a live hotel result",
  },
  label: {
    th: "ตัวอย่าง Local Search → Maps → Website → Contact",
    en: "Sample Local Search → Maps → Website → Contact",
  },
  caption: {
    th: "ทำให้ข้อมูลธุรกิจสอดคล้องกันตั้งแต่ Search, Google Maps ไปจนถึงเว็บไซต์และช่องทางติดต่อ",
    en: "Keep business facts consistent from Search and Google Maps through to the website and the contact path",
  },
  meta: {
    th: "Sample workflow · Search visibility and local discovery",
    en: "Sample workflow · Search visibility and local discovery",
  },
};

/** Deterministic Search Behavior Map. Distinct from the Hero flow visual. */
export const HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE = "/images/hotel-seo-search-behavior-placeholder.webp";

export const HOTEL_SEO_BEHAVIOR_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่างแผนที่พฤติกรรมการค้นหา จากคำถามของลูกค้าไปสู่ Search หรือ AI Search ข้อมูลธุรกิจ Maps เว็บไซต์ และการติดต่อ ไม่ใช่ผลค้นหาจริง",
    en: "Sample Search Behavior Map from a customer question through Search or AI Search, trusted business facts, Maps, the website, and contact. Not a live search result",
  },
  label: {
    th: "ตัวอย่าง Search Behavior และ Local Discovery",
    en: "Sample Search Behavior and Local Discovery",
  },
  caption: {
    th: "ลูกค้าเริ่มจากคำถาม แล้วใช้ Search หรือ AI Search ก่อนดูข้อมูลที่เชื่อถือได้บน Maps หรือเว็บไซต์ แล้วโทร ขอเส้นทาง ติดต่อ หรือจอง",
    en: "Customers start with a question, then use Search or AI Search, check trusted facts on Maps or the website, and call, get directions, contact, or book",
  },
  meta: {
    th: "Sample diagram · Search query, AI-ready facts, local path",
    en: "Sample diagram · Search query, AI-ready facts, local path",
  },
};

export const HOTEL_SEO_BEHAVIOR_MAP = [
  { id: "question", th: "คำถามของลูกค้า", en: "Customer question" },
  { id: "search", th: "Search / AI Search", en: "Search / AI Search" },
  { id: "facts", th: "ข้อมูลธุรกิจที่เชื่อถือได้", en: "Trusted business information" },
  { id: "surfaces", th: "Maps / Website", en: "Maps / Website" },
  { id: "action", th: "โทร / ขอเส้นทาง / ติดต่อ / จอง", en: "Call / Directions / Contact / Booking" },
] as const;

export const HOTEL_SEO_BEHAVIOR_TYPES = [
  {
    id: "traditional",
    num: "01",
    titleTh: "Traditional Search",
    titleEn: "Traditional Search",
    bodyTh: "ลูกค้าพิมพ์คำค้น แล้วเปิดหน้าเว็บที่ตอบบริการ ทำเล หรือราคา",
    bodyEn: "The customer types a query, then opens a page that answers the service, location, or price.",
  },
  {
    id: "ai",
    num: "02",
    titleTh: "AI Search / AEO",
    titleEn: "AI Search / AEO",
    bodyTh: "ลูกค้าถามยาวขึ้น ระบบอาจสรุปคำตอบจากข้อมูลที่ชัด ธุรกิจไม่ได้ถูกรับประกันว่าจะปรากฏในทุกคำตอบ",
    bodyEn: "The customer asks a longer question. A system may summarise clear facts. A business is not guaranteed to appear in every answer.",
  },
  {
    id: "maps",
    num: "03",
    titleTh: "Google Maps / Local Search",
    titleEn: "Google Maps / Local Search",
    bodyTh: "ลูกค้าดูระยะทาง เวลาเปิด รีวิว และเส้นทางก่อนตัดสินใจเดินทาง",
    bodyEn: "The customer checks distance, hours, reviews, and directions before travelling.",
  },
  {
    id: "website",
    num: "04",
    titleTh: "Website และช่องทางติดต่อหรือจอง",
    titleEn: "Website and contact / booking path",
    bodyTh: "หน้าธุรกิจต้องให้ข้อมูลที่ใช้ตัดสินใจได้ แล้วเชื่อมไปโทร ขอเส้นทาง ติดต่อ หรือจอง",
    bodyEn: "The business page must support the decision, then connect to a call, directions, contact, or booking.",
  },
] as const;

export const HOTEL_SEO_COMPARE_VISUAL_CANDIDATE = "/images/hotel-seo-aeo-local-seo-framework-placeholder.webp";

export const HOTEL_SEO_COMPARE_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบเปรียบเทียบ SEO AEO และ Local SEO ไม่ใช่ผลอันดับหรือคำตอบ AI ของโรงแรม",
    en: "Sample SEO, AEO, and Local SEO framework. Not a hotel ranking or AI answer result",
  },
  label: {
    th: "SEO + AEO + Local SEO Framework — Sample",
    en: "SEO + AEO + Local SEO Framework — Sample",
  },
  caption: {
    th: "ทั้งสามส่วนควรใช้ข้อมูลธุรกิจที่ตรวจสอบแล้วชุดเดียวกัน เพื่อให้ Search, AI, Maps และเว็บไซต์อธิบายธุรกิจไปในทิศทางเดียวกัน",
    en: "All three areas should use the same verified business information so Search, AI, Maps, and the Website describe the business consistently.",
  },
  meta: {
    th: "Sample framework · SEO, AEO, Local SEO",
    en: "Sample framework · SEO, AEO, Local SEO",
  },
};

export const HOTEL_SEO_COMPARE_COLUMNS = [
  { id: "area", th: "ด้านงาน", en: "Area" },
  { id: "goal", th: "เป้าหมาย", en: "Goal" },
  { id: "prepare", th: "สิ่งที่ต้องจัดเตรียม", en: "What to prepare" },
  { id: "sees", th: "สิ่งที่ลูกค้าเห็น", en: "What the customer sees" },
  { id: "output", th: "ผลที่มุ่งหวัง", en: "Expected output" },
] as const;

export const HOTEL_SEO_COMPARE_ROWS = [
  {
    id: "seo",
    num: "01",
    areaTh: "SEO",
    areaEn: "SEO",
    goalTh: "ทำให้เว็บไซต์ตอบคำค้นที่เกี่ยวข้อง",
    goalEn: "Make the website answer relevant searches",
    prepareTh: "โครงสร้างเนื้อหา, เจตนาของคำค้น, technical SEO, ความเกี่ยวข้องของหน้า",
    prepareEn: "Content structure, keyword intent, technical SEO, page relevance",
    seesTh: "หน้าเว็บที่ตอบบริการ ทำเล หรือวิธีจอง ตามคำค้น",
    seesEn: "A website page that answers the service, location, or how to book",
    outputTh: "Search-ready Website",
    outputEn: "Search-ready Website",
  },
  {
    id: "aeo",
    num: "02",
    areaTh: "AEO / AI Search",
    areaEn: "AEO / AI Search",
    goalTh: "ทำให้ข้อมูลธุรกิจชัดและพร้อมเป็นคำตอบ",
    goalEn: "Make business information clear and answer-ready",
    prepareTh: "คำตอบตรงประเด็น, entities, FAQ, แหล่งที่เชื่อถือได้, เนื้อหาที่มีโครงสร้าง",
    prepareEn: "Direct answers, entities, FAQs, trusted sources, structured content",
    seesTh: "ข้อมูลที่ระบบค้นหาหรือ AI นำไปใช้ในคำตอบได้ หากคำตอบนั้นถูกแสดง ไม่ได้รับประกันว่าจะปรากฏทุกครั้ง",
    seesEn: "Clear facts a search or AI system can use in an answer, if that answer is shown. Appearance is not guaranteed",
    outputTh: "Answer-ready Content",
    outputEn: "Answer-ready Content",
  },
  {
    id: "local",
    num: "03",
    areaTh: "Local SEO",
    areaEn: "Local SEO",
    goalTh: "ทำให้ข้อมูลธุรกิจชัดใน Local Search และ Maps",
    goalEn: "Keep business information clear in local search and Maps",
    prepareTh: "Google Business Profile, ที่อยู่, เวลาเปิด, รูปภาพ, บริการ, รีวิว, ช่องทางติดต่อ",
    prepareEn: "Google Business Profile, address, hours, photos, services, reviews, contact paths",
    seesTh: "โปรไฟล์ธุรกิจ เวลาเปิด รูป รีวิว และทางโทรหรือขอเส้นทางบน Search และ Maps",
    seesEn: "The business profile, hours, photos, reviews, and a call or directions path on Search and Maps",
    outputTh: "Local Discovery Profile",
    outputEn: "Local Discovery Profile",
  },
] as const;

export const HOTEL_SEO_COMPARE_STATEMENT = {
  th: "ทั้งสามส่วนควรใช้ข้อมูลธุรกิจที่ตรวจสอบแล้วชุดเดียวกัน เพื่อให้ Search, AI, Maps และเว็บไซต์อธิบายธุรกิจไปในทิศทางเดียวกัน",
  en: "All three areas should use the same verified business information so Search, AI, Maps, and the Website describe the business consistently.",
} as const;

export const HOTEL_SEO_AUDIT_VISUAL_CANDIDATE = "/images/hotel-seo-discovery-audit-placeholder.webp";

export const HOTEL_SEO_AUDIT_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่างการตรวจ Search และ Google Business Profile แบบปิดข้อมูลระบุตัวตน ไม่ใช่ผลโรงแรมลูกค้า",
    en: "Sample Search and Google Business Profile audit with identifying details redacted. Not a client hotel result",
  },
  label: {
    th: "ตัวอย่าง Search และ Google Business Profile Audit",
    en: "Sample Search and Google Business Profile Audit",
  },
  caption: {
    th: "ตรวจความสอดคล้องของข้อมูลธุรกิจจาก Search Console โปรไฟล์ Maps และหน้าเว็บ ไม่ใช่ผลอันดับหรือตัวเลขลูกค้า",
    en: "A consistency check across Search Console, the Maps profile, and the website. Not a ranking or client metric result",
  },
  meta: {
    th: "Sample data · Anonymised audit",
    en: "Sample data · Anonymised audit",
  },
};

export const HOTEL_SEO_PROBLEM_FIELDS = [
  { id: "problem", th: "ปัญหา", en: "Problem" },
  { id: "sees", th: "สิ่งที่ลูกค้าเห็น", en: "What the customer sees" },
  { id: "data", th: "ข้อมูลที่ควรตรวจ", en: "Data to inspect" },
  { id: "output", th: "ผลที่มุ่งหวัง", en: "Recommended output" },
] as const;

export const HOTEL_SEO_PROBLEM_ITEMS = [
  {
    id: "page",
    num: "01",
    problemTh: "มีเว็บไซต์ แต่ลูกค้าไม่พบหน้าที่เกี่ยวข้อง",
    problemEn: "The hotel has a website, but customers do not find the relevant page",
    seesTh: "ค้นหาบริการหรือทำเลแล้วไม่เจอหน้าโรงแรมที่ตอบคำถาม",
    seesEn: "A search for the service or area does not open the hotel page that answers the question",
    dataTh: "คำค้นและหน้าใน Search Console, หน้าเป้าหมาย, ลิงก์ภายใน",
    dataEn: "Search Console queries and pages, target landing pages, internal links",
    outputTh: "หน้าเว็บที่ตอบคำค้นและเชื่อมต่อไปติดต่อหรือจอง",
    outputEn: "A search-ready page that answers the query and continues to contact or booking",
  },
  {
    id: "maps",
    num: "02",
    problemTh: "ลูกค้าเห็นธุรกิจบน Maps แต่ข้อมูลสำคัญยังไม่เป็นปัจจุบัน",
    problemEn: "Customers see the business on Maps, but key information is outdated",
    seesTh: "เวลาเปิด เบอร์โทร บริการ หรือรูปไม่ตรงกับสิ่งที่ธุรกิจทำอยู่จริง",
    seesEn: "Hours, phone, services, or photos do not match what the business currently offers",
    dataTh: "Google Business Profile, ที่อยู่ โทร เว็บ, เวลาเปิด, รูป, บริการ เทียบกับเว็บไซต์",
    dataEn: "Google Business Profile, NAP, hours, photos, and services compared with the website",
    outputTh: "ข้อมูล Local Listing ที่สอดคล้องกับเว็บไซต์",
    outputEn: "A local listing that matches the website",
  },
  {
    id: "website",
    num: "03",
    problemTh: "ลูกค้าเข้าเว็บไซต์แล้ว แต่ราคา บริการ เวลาเปิด รูป หรือรีวิวยังไม่ชัด",
    problemEn: "Customers reach the website, but price, service, hours, photos, or reviews are unclear",
    seesTh: "หาคำตอบก่อนติดต่อหรือจองไม่เจอ จึงออกจากหน้าเว็บ",
    seesEn: "They cannot find the facts needed to contact or book, so they leave",
    dataTh: "หน้าบริการ, เส้นทางติดต่อหรือจอง, ความครบของเนื้อหาและรูป",
    dataEn: "Service pages, the contact or booking path, and whether content and photos are complete",
    outputTh: "หน้าธุรกิจที่ลูกค้าใช้ตัดสินใจต่อได้",
    outputEn: "A business page people can use to decide the next step",
  },
  {
    id: "reviews",
    num: "04",
    problemTh: "มีรีวิว แต่ยังไม่ได้ใช้คำถามและภาษาของลูกค้ามาปรับข้อมูลธุรกิจ",
    problemEn: "The business has reviews, but does not use customer questions and language to improve its information",
    seesTh: "คำถามซ้ำในรีวิว แต่หน้าเว็บหรือโปรไฟล์ยังไม่ตอบประเด็นนั้น",
    seesEn: "The same questions appear in reviews, but the website or profile still does not answer them",
    dataTh: "ประเด็นรีวิวที่ปิดชื่อผู้เขียนแล้ว, FAQ, คำอธิบายบริการ",
    dataEn: "Review themes with author names redacted, FAQs, and service descriptions",
    outputTh: "ข้อมูลธุรกิจที่ตอบประเด็นที่ลูกค้าถามจริง",
    outputEn: "Business facts that answer the questions customers already ask",
  },
  {
    id: "path",
    num: "05",
    problemTh: "ยังไม่รู้ว่าลูกค้าค้นพบธุรกิจผ่าน Search, Maps หรือ AI",
    problemEn: "The hotel does not know whether customers discovered it through Search, Maps, or AI",
    seesTh: "มีคนติดต่อหรือเข้าเว็บ แต่ทีมไม่ทราบว่ามาจากช่องทางใด",
    seesEn: "People contact the business or open the site, but the team cannot see which path they used",
    dataTh: "Search Console, ข้อมูล Google Business Profile ตามสิทธิ์ที่มี, แหล่งที่มาของการสอบถาม",
    dataEn: "Search Console, Google Business Profile data where access exists, and enquiry source",
    outputTh: "มุมมองการค้นพบที่ตรวจสอบได้ ไม่ใช่ตัวเลขที่สมมติ",
    outputEn: "A reviewable discovery view. Not invented rankings, calls, or bookings",
  },
] as const;

export const HOTEL_SEO_FLOW_VISUAL_CANDIDATE = "/images/hotel-seo-local-discovery-flow-placeholder.webp";

export const HOTEL_SEO_FLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างเส้นทาง Search ไป Maps เว็บไซต์ และการติดต่อหรือจอง ไม่ใช่ผลโรงแรมจริง",
    en: "Sample Search to Maps, website, and contact or booking flow. Not a live hotel result",
  },
  label: {
    th: "Search → Maps → Website → Contact / Booking Flow",
    en: "Search → Maps → Website → Contact / Booking Flow",
  },
  caption: {
    th: "เส้นทางตัวอย่างจากการค้นพบไปสู่การติดต่อหรือจอง ไม่ใช่ผลอันดับ คำตอบ AI หรือยอดจอง",
    en: "A sample path from discovery to contact or booking. Not a ranking, AI answer, or booking result",
  },
  meta: {
    th: "Sample flow · Search visibility and local discovery",
    en: "Sample flow · Search visibility and local discovery",
  },
};

export const HOTEL_SEO_FLOW_STAGES = [
  { id: "search", th: "Search", en: "Search", outputTh: "Search & AI Data Structure", outputEn: "Search & AI Data Structure" },
  { id: "maps", th: "Maps", en: "Maps", outputTh: "Google Business Profile", outputEn: "Google Business Profile" },
  { id: "website", th: "Website", en: "Website", outputTh: "Website Answer Structure", outputEn: "Website Answer Structure" },
  { id: "contact", th: "Contact / Booking", en: "Contact / Booking", outputTh: "Contact / Booking Path", outputEn: "Contact / Booking Path" },
] as const;

export const HOTEL_SEO_HELP_FIELDS = [
  { id: "owner", th: "ผู้รับผิดชอบ", en: "Owner" },
  { id: "input", th: "สิ่งที่รับ", en: "Input" },
  { id: "action", th: "สิ่งที่ทำ", en: "Action" },
  { id: "output", th: "สิ่งที่ได้", en: "Output" },
  { id: "next", th: "การตัดสินใจขั้นถัดไป", en: "Next decision" },
] as const;

export const HOTEL_SEO_HELP_STEPS = [
  {
    id: "website",
    num: "01",
    titleTh: "ทำให้เว็บไซต์ตอบคำถามของลูกค้า",
    titleEn: "Make the website answer customer questions",
    ownerTh: "เดอะ เคพีไอ พลัส จัดโครงสร้างเนื้อหา โรงแรมอนุมัติข้อมูลธุรกิจ ราคา รูปภาพ และข้อเสนอ",
    ownerEn: "The KPI Plus prepares content structure. The hotel approves business information, prices, photos, and offers",
    inputTh: "เว็บไซต์ปัจจุบัน คำถามของลูกค้า และข้อมูลบริการ ทำเล ที่โรงแรมให้มา",
    inputEn: "The current website, customer questions, and the service and location facts the hotel provides",
    actionTh: "ดูว่าลูกค้าถามอะไร แล้วจัดหน้าเว็บให้ตอบเรื่องทำเล บริการ ราคา และวิธีจอง",
    actionEn: "Review what customers ask, then structure pages so they answer location, service, price, and how to book",
    outputTh: "Website Answer Structure → เนื้อหาที่เกี่ยวข้องและหน้าปลายทาง",
    outputEn: "Website Answer Structure → relevant content and landing page",
    nextDecisionTh: "โรงแรมอนุมัติข้อมูลธุรกิจ ราคา รูปภาพ และข้อเสนอ ก่อนเผยแพร่หน้าเว็บ",
    nextDecisionEn: "The hotel approves business information, prices, photos, and offers before pages are published",
  },
  {
    id: "search-ai",
    num: "02",
    titleTh: "จัดข้อมูลให้ Search และ AI เข้าใจ",
    titleEn: "Organize information so Search and AI can understand it",
    ownerTh: "เดอะ เคพีไอ พลัส จัดโครงสร้างข้อมูลและเอนทิตี โรงแรมอนุมัติข้อมูลธุรกิจและข้อความด้านกฎหมาย",
    ownerEn: "The KPI Plus organises entities and structured content. The hotel approves business facts and legal claims",
    inputTh: "Website Answer Structure ชื่อธุรกิจ บริการ ทำเล และข้อมูลที่โรงแรมอนุมัติ",
    inputEn: "Website Answer Structure, business name, services, location, and approved facts",
    actionTh: "จัดโครงสร้างเว็บไซต์ เอนทิตี และข้อมูลธุรกิจให้ชุดเดียวกัน เพื่อให้ Search และ AI อ่านได้",
    actionEn: "Align website structure, entities, and business facts so Search and AI can read the same information",
    outputTh: "Search & AI Data Structure → ความสอดคล้องของเอนทิตีและเนื้อหาที่มีโครงสร้าง",
    outputEn: "Search & AI Data Structure → entity and structured content consistency",
    nextDecisionTh: "โรงแรมอนุมัติข้อความด้านกฎหมายและข้อมูลธุรกิจที่เผยแพร่ได้",
    nextDecisionEn: "The hotel approves legal claims and the business facts that can be published",
  },
  {
    id: "gbp",
    num: "03",
    titleTh: "ดูแล Google Business Profile ให้ถูกต้อง",
    titleEn: "Manage Google Business Profile properly",
    ownerTh: "เดอะ เคพีไอ พลัส อาจแนะนำการปรับ Google Business Profile โรงแรมอนุมัติเวลาเปิด รูปภาพ และการตอบรีวิว",
    ownerEn: "The KPI Plus may recommend Google Business Profile updates. The hotel approves hours, photos, and review responses",
    inputTh: "Google Business Profile ปัจจุบัน ข้อมูลบนเว็บไซต์ เวลาเปิด รูปภาพ และรีวิว",
    inputEn: "The current Google Business Profile, website facts, hours, photos, and reviews",
    actionTh: "ตรวจหมวดหมู่ ที่อยู่ โทร เว็บ เวลาเปิด รูป บริการ รีวิว และลิงก์ติดต่อ ให้ตรงกับเว็บไซต์",
    actionEn: "Review category, address, phone, website, hours, photos, services, reviews, and contact links against the website",
    outputTh: "Google Business Profile → โปรไฟล์ธุรกิจ รูปภาพ เวลาเปิด รีวิว และลิงก์ติดต่อที่เป็นปัจจุบัน",
    outputEn: "Google Business Profile → current business profile, photos, hours, reviews, and contact links",
    nextDecisionTh: "โรงแรมอนุมัติเวลาเปิด รูปภาพ ข้อเสนอ และการตอบรีวิว ก่อนเผยแพร่",
    nextDecisionEn: "The hotel approves hours, photos, offers, and review responses before they are published",
  },
  {
    id: "path",
    num: "04",
    titleTh: "เชื่อมการค้นพบกับการติดต่อและการจอง",
    titleEn: "Connect discovery to contact and booking",
    ownerTh: "เดอะ เคพีไอ พลัส ออกแบบการวัดผล โรงแรมอนุมัตินโยบายการจองและเส้นทางติดต่อ",
    ownerEn: "The KPI Plus designs the measurement path. The hotel approves booking policies and the contact path",
    inputTh: "Search, Maps, เว็บไซต์ และเส้นทางติดต่อหรือจองที่มีอยู่",
    inputEn: "Search, Maps, the website, and the current contact or booking path",
    actionTh: "เชื่อมการค้นพบไปสู่การโทร ขอเส้นทาง เข้าเว็บไซต์ ติดต่อ หรือจอง ที่ตรวจสอบได้",
    actionEn: "Connect discovery to a call, directions, website visit, contact, or booking event that can be reviewed",
    outputTh: "Contact / Booking Path → เหตุการณ์ Call, Directions, Website Visit, Contact หรือ Booking ที่วัดได้",
    outputEn: "Contact / Booking Path → measurable Call, Directions, Website Visit, Contact, or Booking event",
    nextDecisionTh: "โรงแรมอนุมัตินโยบายการจอง และเหตุการณ์ติดต่อหรือจองที่วัดผลได้",
    nextDecisionEn: "The hotel approves booking policies and which contact or booking events can be measured",
  },
] as const;

export const HOTEL_SEO_HELP_BOUNDARY = {
  kicker: "Responsibility boundary",
  supportTitle: {
    th: "เดอะ เคพีไอ พลัส อาจช่วย",
    en: "The KPI Plus may support",
  },
  approveTitle: {
    th: "โรงแรมเป็นผู้อนุมัติ",
    en: "The hotel approves",
  },
  note: {
    th: "เดอะ เคพีไอ พลัส อาจช่วยทบทวนข้อมูล จัดโครงสร้างเนื้อหา แนะนำ Google Business Profile ตรวจการมองเห็นจากการค้นหา และออกแบบการวัดผล โรงแรมเป็นผู้อนุมัติข้อมูลธุรกิจ เวลาเปิด ราคา รูปภาพ ข้อเสนอ การตอบรีวิว ข้อความด้านกฎหมาย และนโยบายการจอง",
    en: "The KPI Plus may support data review, content structure, Google Business Profile recommendations, search visibility audit, and measurement design. The hotel approves business information, hours, prices, photos, offers, review responses, legal claims, and booking policies.",
  },
  support: [
    { th: "ทบทวนข้อมูล", en: "Data review" },
    { th: "โครงสร้างเนื้อหา", en: "Content structure" },
    { th: "คำแนะนำ Google Business Profile", en: "Google Business Profile recommendations" },
    { th: "การตรวจการมองเห็นจากการค้นหา", en: "Search visibility audit" },
    { th: "การออกแบบการวัดผล", en: "Measurement design" },
  ],
  approve: [
    { th: "ข้อมูลธุรกิจ", en: "Business information" },
    { th: "เวลาเปิด", en: "Hours" },
    { th: "ราคา", en: "Prices" },
    { th: "รูปภาพ", en: "Photos" },
    { th: "ข้อเสนอ", en: "Offers" },
    { th: "การตอบรีวิว", en: "Review responses" },
    { th: "ข้อความด้านกฎหมาย", en: "Legal claims" },
    { th: "นโยบายการจอง", en: "Booking policies" },
  ],
} as const;

export const HOTEL_SEO_GBP_VISUAL_CANDIDATE = "/images/hotel-seo-google-business-profile-placeholder.webp";

export const HOTEL_SEO_GBP_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่าง Google Business Profile สำหรับโรงแรม ปิดรหัสบัญชี อีเมล และข้อมูลผู้รีวิว ไม่ใช่โปรไฟล์ลูกค้า",
    en: "Sample Google Business Profile for a hotel, with account IDs, emails, and review-author data redacted. Not a client profile",
  },
  label: {
    th: "ตัวอย่าง Google Business Profile สำหรับโรงแรม",
    en: "Sample Google Business Profile for hotels",
  },
  caption: {
    th: "ตัวอย่างข้อมูล ปิดรหัสบัญชี อีเมลส่วนตัว ชื่อผู้รีวิว และบันทึกภายใน ไม่ใช่ผลอันดับ Maps",
    en: "Sample data. Account IDs, private email, review-author names, and internal notes are redacted. Not a Maps rank result",
  },
  meta: {
    th: "Sample data · Anonymised profile",
    en: "Sample data · Anonymised profile",
  },
};

export const HOTEL_SEO_GBP_FIELDS = [
  { id: "name", th: "ชื่อธุรกิจ", en: "Business name", checkTh: "ปิดข้อมูลตัวอย่าง", checkEn: "Sample · redacted" },
  { id: "category", th: "หมวดหมู่", en: "Category", checkTh: "ตรงกับธุรกิจ", checkEn: "Matches the business" },
  { id: "address", th: "ที่อยู่และพื้นที่ให้บริการ", en: "Address and service area", checkTh: "ชุดเดียวกับเว็บ", checkEn: "Matches the website" },
  { id: "hours", th: "เวลาเปิด", en: "Operating hours", checkTh: "เป็นปัจจุบัน", checkEn: "Current" },
  { id: "phone", th: "โทรศัพท์", en: "Phone", checkTh: "ปิดเบอร์ตัวอย่าง", checkEn: "Sample · redacted" },
  { id: "website", th: "เว็บไซต์", en: "Website", checkTh: "ลิงก์ที่เข้าถึงได้", checkEn: "Reachable link" },
  { id: "photos", th: "รูปภาพ", en: "Photos", checkTh: "เป็นปัจจุบัน", checkEn: "Current" },
  { id: "services", th: "บริการและสิ่งอำนวยความสะดวก", en: "Services and facilities", checkTh: "มีอยู่จริง", checkEn: "Still offered" },
  { id: "reviews", th: "รีวิวและคำถาม", en: "Reviews and questions", checkTh: "ปิดชื่อผู้เขียน", checkEn: "Author names redacted" },
  { id: "booking", th: "ลิงก์ติดต่อหรือจอง", en: "Contact/Booking link", checkTh: "วัดได้เมื่อมีสิทธิ์", checkEn: "If the path can be measured" },
] as const;

export const HOTEL_SEO_GBP_ACTIONS = [
  { id: "call", name: "Call", th: "ลูกค้ากดโทรจากโปรไฟล์", en: "The customer can call from the profile" },
  { id: "directions", name: "Directions", th: "ลูกค้าขอเส้นทางมายังธุรกิจ", en: "The customer can ask for directions" },
  { id: "website", name: "Website Visit", th: "ลูกค้าเปิดเว็บไซต์จากโปรไฟล์", en: "The customer can open the website" },
  { id: "contact", name: "Contact", th: "ลูกค้าส่งคำถามหรือข้อความได้", en: "The customer can send a question or message" },
  { id: "booking", name: "Booking", th: "เจตนาจอง เมื่อมีเหตุการณ์ที่วัดได้", en: "Booking intent, only if a booking event can be measured" },
] as const;

export const HOTEL_SEO_GBP_COPY = {
  title: {
    th: "ทำไม Google Business Profile ที่ครบและเป็นปัจจุบันช่วยการค้นพบในพื้นที่?",
    en: "Why a complete, current Google Business Profile supports local discovery",
  },
  lead: {
    th: "ลูกค้ามักต้องดูระยะทาง เวลาเปิด บริการ รูป และรีวิว ก่อนตัดสินใจเดินทางหรือติดต่อ โปรไฟล์ที่ครบและเป็นปัจจุบันช่วยให้ข้อมูลเหล่านี้ปรากฏบน Search และ Maps ในจังหวะที่ลูกค้ากำลังตัดสินใจ",
    en: "Customers usually check distance, hours, the service, photos, and reviews before they travel or make contact. A complete, current profile helps those facts appear on Search and Maps at the decision point.",
  },
  rankNote: {
    th: "โปรไฟล์ที่ครบช่วยรองรับการตัดสินใจ แต่ไม่ได้รับประกันอันดับบน Google Maps และไม่ได้รับประกันตำแหน่งสูงสุด ผลการค้นหาในพื้นที่ยังขึ้นกับความเกี่ยวข้อง ระยะทาง และความโดดเด่นของธุรกิจ",
    en: "A complete profile can support that decision. It does not guarantee a Maps rank or the top Maps position. Local results still depend on relevance, distance, and prominence.",
  },
  close: {
    th: "การค้นพบควรพาไปสู่การโทร ขอเส้นทาง เข้าเว็บไซต์ ติดต่อ หรือจอง เมื่อเส้นทางนั้นวัดผลได้ ไม่จบเพียงการเห็นชื่อธุรกิจ",
    en: "Discovery should lead to a call, directions, a website visit, contact, or a booking when that path can be measured. Being seen by name is not the end of the path.",
  },
} as const;

export const HOTEL_SEO_PROCESS_VISUAL_CANDIDATE = "/images/hotel-seo-audit-process-placeholder.webp";

export const HOTEL_SEO_PROCESS_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  alt: {
    th: "ตัวอย่างเส้นทาง Audit Review Prioritize และ Track สำหรับการตรวจการค้นพบ ไม่ใช่ผลโรงแรมจริง",
    en: "Sample Audit, Review, Prioritize, and Track path for a search visibility audit. Not a live hotel result",
  },
  label: {
    th: "Hotel Search Visibility Audit Process — Sample",
    en: "Hotel Search Visibility Audit Process — Sample",
  },
  caption: {
    th: "เส้นทางตัวอย่างจากข้อมูลจริงไปสู่แผนงานและการติดตาม ไม่ใช่ผลอันดับหรือยอดจอง",
    en: "A sample path from current facts to a plan and a review of change. Not a ranking or booking result",
  },
  meta: {
    th: "Sample timeline · Audit, Review, Prioritize, Track",
    en: "Sample timeline · Audit, Review, Prioritize, Track",
  },
};

export const HOTEL_SEO_PROCESS_FIELDS = [
  { id: "owner", th: "ผู้รับผิดชอบ", en: "Owner" },
  { id: "input", th: "สิ่งที่รับ", en: "Input" },
  { id: "output", th: "สิ่งที่ได้", en: "Output" },
  { id: "next", th: "การตัดสินใจขั้นถัดไป", en: "Next decision" },
] as const;

export const HOTEL_SEO_PROCESS_STEPS = [
  {
    id: "audit",
    num: "01",
    phase: "Audit",
    titleTh: "ตรวจการค้นพบปัจจุบัน",
    titleEn: "Audit",
    actionTh: "ตรวจเว็บไซต์ Google Search Console, Google Business Profile และเส้นทางการค้นพบปัจจุบัน",
    actionEn: "Review website, Google Search Console, Google Business Profile, and current discovery paths",
    ownerTh: "เดอะ เคพีไอ พลัส ตรวจตามสิทธิ์ที่มี โรงแรมเป็นผู้ให้สิทธิ์เข้าถึง",
    ownerEn: "The KPI Plus reviews where access exists. The hotel provides access",
    inputTh: "เว็บไซต์, Google Search Console, Google Business Profile และเส้นทางการค้นพบที่มีสิทธิ์เข้าถึง",
    inputEn: "Website, Google Search Console, Google Business Profile, and current discovery paths where access exists",
    outputTh: "Audit baseline",
    outputEn: "Audit baseline",
    nextDecisionTh: "โรงแรมยืนยันว่าระบบใดเข้าถึงได้ และจะเริ่มตรวจส่วนใดก่อน",
    nextDecisionEn: "The hotel confirms which systems the team can access and what to review first",
  },
  {
    id: "review",
    num: "02",
    phase: "Review",
    titleTh: "ตรวจข้อมูลที่ลูกค้าใช้ตัดสินใจ",
    titleEn: "Review",
    actionTh: "ตรวจข้อมูลที่ลูกค้าใช้ตัดสินใจ ได้แก่ บริการ ราคา เวลาเปิด รูป รีวิว ทำเล และเส้นทางติดต่อ",
    actionEn: "Review the information customers use to decide: services, price, hours, photos, reviews, location, and contact path",
    ownerTh: "เดอะ เคพีไอ พลัส จัดรายการตรวจ โรงแรมอนุมัติข้อมูลธุรกิจ",
    ownerEn: "The KPI Plus prepares the checklist. The hotel approves business facts",
    inputTh: "Audit baseline พร้อมบริการ ราคา เวลาเปิด รูป รีวิว ทำเล และเส้นทางติดต่อ",
    inputEn: "Audit baseline plus services, price, hours, photos, reviews, location, and the contact path",
    outputTh: "Decision-information checklist",
    outputEn: "Decision-information checklist",
    nextDecisionTh: "โรงแรมอนุมัติเวลาเปิด ราคา รูปภาพ และข้อมูลที่เผยแพร่ได้",
    nextDecisionEn: "The hotel approves hours, prices, photos, and the facts that can be published",
  },
  {
    id: "prioritize",
    num: "03",
    phase: "Prioritize",
    titleTh: "จัดลำดับสิ่งที่ต้องปรับ",
    titleEn: "Prioritize",
    actionTh: "แยกงานที่ปรับได้เร็ว งานเนื้อหา งานเว็บไซต์ และการปรับโปรไฟล์",
    actionEn: "Separate quick wins, content changes, website changes, and profile changes",
    ownerTh: "เดอะ เคพีไอ พลัส เสนอลำดับงาน โรงแรมเป็นผู้ตัดสินใจว่าจะเริ่มอะไรก่อน",
    ownerEn: "The KPI Plus proposes the order. The hotel decides what to do first",
    inputTh: "Decision-information checklist",
    inputEn: "Decision-information checklist",
    outputTh: "Prioritized action plan",
    outputEn: "Prioritized action plan",
    nextDecisionTh: "โรงแรมอนุมัติว่างานเร็ว งานเนื้อหา งานเว็บไซต์ และการปรับโปรไฟล์ส่วนใดเริ่มได้",
    nextDecisionEn: "The hotel approves which quick wins, content, website, and profile changes can start",
  },
  {
    id: "track",
    num: "04",
    phase: "Track",
    titleTh: "ติดตามการเปลี่ยนแปลงที่วัดได้",
    titleEn: "Track",
    actionTh: "ติดตามการค้นพบ การเข้าชมเว็บไซต์ การโทร เส้นทาง ติดต่อ และเหตุการณ์จอง เฉพาะที่วัดได้",
    actionEn: "Track search discovery, website visits, calls, directions, contact, and booking events only where measurable",
    ownerTh: "เดอะ เคพีไอ พลัส ออกแบบการวัดผล โรงแรมอนุมัติเหตุการณ์ที่รายงานได้",
    ownerEn: "The KPI Plus designs the measurement. The hotel approves which events can be reported",
    inputTh: "Prioritized action plan และเส้นทางที่วัดผลได้ที่มีอยู่",
    inputEn: "Prioritized action plan and the measurable paths that exist",
    outputTh: "Change and outcome report",
    outputEn: "Change and outcome report",
    nextDecisionTh: "โรงแรมอนุมัติว่าการโทร เส้นทาง ติดต่อ และเหตุการณ์จองใดอยู่ในรายงานได้",
    nextDecisionEn: "The hotel approves which calls, directions, contact, and booking events can be included in the report",
  },
] as const;

export const HOTEL_SEO_GSC_VISUAL = {
  alt: {
    th: "ตัวอย่างมุมมอง Search Console แบบไม่มีรหัสพร็อพเพอร์ตี้",
    en: "Sample Search Console-style view without a property ID",
  },
  label: { th: "ตัวอย่าง Search Console", en: "Sample Search Console view" },
  caption: {
    th: "ตัวเลขเป็นตัวอย่าง ไม่ใช่ข้อมูลพร็อพเพอร์ตี้จริง",
    en: "Figures are sample only. Not a live Search Console property.",
  },
  meta: { th: "ตัวอย่างข้อมูล", en: "Sample visual" },
};

export const HOTEL_SEO_KPI_VISUAL_CANDIDATE = "/images/hotel-seo-outcomes-kpi-placeholder.webp";

export const HOTEL_SEO_KPI_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "กรอบตัวชี้วัด Search Visibility และผลธุรกิจแบบตัวอย่าง ไม่ใช่ยอดแสดงผล คลิก โทร หรือจองของโรงแรม",
    en: "Sample Search Visibility and Business Outcomes framework. Not hotel impressions, clicks, calls, or bookings",
  },
  label: {
    th: "Search Visibility and Business Outcomes · Sample data",
    en: "Search Visibility and Business Outcomes · Sample data",
  },
  caption: {
    th: "กรอบตัวชี้วัดตัวอย่าง การแสดงผลไม่ใช่รายได้ และการเข้าชมโปรไฟล์ไม่ใช่การจอง",
    en: "Sample metric framework. Impressions are not revenue. Profile views are not bookings",
  },
  meta: {
    th: "Sample data · Metric Framework",
    en: "Sample data · Metric Framework",
  },
};

export const HOTEL_SEO_KPI_FIELDS = [
  { id: "source", th: "ที่มา", en: "Source" },
  { id: "period", th: "ช่วงเวลา", en: "Period" },
  { id: "property", th: "พร็อพเพอร์ตี้ / ตลาด", en: "Property/market" },
  { id: "definition", th: "คำนิยาม", en: "Definition" },
  { id: "status", th: "สถานะข้อมูล", en: "Data status" },
  { id: "updated", th: "วันที่อัปเดต", en: "Updated date" },
  { id: "comparison", th: "การเปรียบเทียบหรือเป้าหมาย", en: "Comparison or target" },
] as const;

export const HOTEL_SEO_KPI_COPY = {
  kicker: { th: "Metric Framework", en: "Metric Framework" },
  intro: {
    th: "แยกผลจากเว็บไซต์ Google Business Profile และผลธุรกิจ การแสดงผลจากการค้นหาไม่ใช่รายได้ และการเข้าชมโปรไฟล์ไม่ใช่การจอง แสดงตัวเลขสาธารณะเฉพาะสถานะ Approved หรือ Anonymised หากยังไม่มีข้อมูลที่อนุมัติ จะแสดงกรอบตัวชี้วัดที่ติดป้าย Sample data และซ่อนค่าสาธารณะ",
    en: "Separate website, Google Business Profile, and business outcomes. Search impressions are not revenue. Profile views are not bookings. Public figures appear only with Approved or Anonymised status. If approved data is unavailable, this Metric Framework is labelled Sample data and public KPI values stay hidden.",
  },
  close: {
    th: "เราไม่รับประกันอันดับบน Google Maps หรือการถูกอ้างอิงในคำตอบ AI เป้าหมายคือทำให้เห็นว่าการค้นพบพาไปสู่การติดต่อหรือจองได้เมื่อวัดผลได้ ไม่ใช่การนับการแสดงผลเป็นการจอง",
    en: "Maps rank and AI mentions are not guaranteed. The aim is to see whether discovery leads to contact or booking when that path can be measured. Impressions are not counted as bookings.",
  },
} as const;

export const HOTEL_SEO_RELATED_VISUAL_CANDIDATE = "/images/hotel-seo-related-content-placeholder.webp";

export const HOTEL_SEO_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  alt: {
    th: "กรอบเนื้อหา Hotel SEO และ Local Search ไม่ใช่รูป Hero หรือ Google Business Profile และไม่ใช่ผลอันดับ",
    en: "Hotel SEO / Local Search content frame, not the hero or Google Business Profile image, and not a ranking result",
  },
  label: {
    th: "Hotel SEO / Local Search Content",
    en: "Hotel SEO / Local Search Content",
  },
  caption: {
    th: "กรอบเนื้อหาที่เกี่ยวข้อง ไม่ใช่รูป Hero รูป Google Business Profile หรือผลอันดับ",
    en: "Related content frame, not the hero, Google Business Profile image, or a ranking result",
  },
  meta: {
    th: "Sample visual · Hotel SEO / Local Search Content",
    en: "Sample visual · Hotel SEO / Local Search Content",
  },
};

export const HOTEL_SEO_RELATED_VISUAL_OPTIONS = [
  { id: "search-visibility", label: "Search Visibility Report" },
  { id: "gbp-review", label: "Google Business Profile Review" },
  { id: "local-seo-audit", label: "Local SEO Audit" },
  { id: "search-console", label: "Search Console Analysis" },
  { id: "website-health", label: "Hotel Website Health Check" },
] as const;

export type HotelSeoRelatedCard = {
  id: string;
  href: string;
  external?: boolean;
  featured?: boolean;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  publishedAt?: string;
  updatedAt?: string;
  accessedAt?: string;
  dateKind?: "published" | "updated" | "accessed";
  contentTypeTh: string;
  contentTypeEn: string;
  readingTimeMinutes?: number;
  ctaTh: string;
  ctaEn: string;
  sourceName?: string;
  sourceUrl?: string;
};

function relatedInternalHref(href: string, locale: Locale) {
  const found = existingHref(href, locale);
  if (!found) return null;
  if (!href.startsWith("/tools/")) return found;
  const page = pageByRoute.get(barePath(href));
  if (!page) return found;
  const wanted = locale === "th" ? "th" : locale;
  return page.alternates.some((alt) => alt.hreflang === wanted) ? found : null;
}

function insightRelatedCard(
  href: string,
  extras: Pick<HotelSeoRelatedCard, "id" | "featured" | "categoryTh" | "categoryEn" | "ctaTh" | "ctaEn">,
): HotelSeoRelatedCard | null {
  const post = insightPosts.find((item) => item.href === href && item.isPublished !== false);
  if (!post) return null;
  const updated = insightUpdatedAt(post);
  return {
    ...extras,
    href,
    titleTh: post.title.th,
    titleEn: post.title.en,
    descriptionTh: insightExcerpt(post, "th"),
    descriptionEn: insightExcerpt(post, "en"),
    publishedAt: post.publishedAt,
    updatedAt: updated || undefined,
    dateKind: updated ? "updated" : "published",
    contentTypeTh: "บทความ",
    contentTypeEn: "Article",
    readingTimeMinutes: post.readingTimeMinutes,
  };
}

export function hotelSeoRelatedCards(locale: Locale): HotelSeoRelatedCard[] {
  const seoInsight = insightRelatedCard("/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on", {
    id: "seo-vs-sem",
    featured: true,
    categoryTh: "SEO vs SEM",
    categoryEn: "SEO vs SEM",
    ctaTh: "อ่านบทความ",
    ctaEn: "Read article",
  });
  const seoCard = seoInsight && relatedInternalHref(seoInsight.href, locale)
    ? seoInsight
    : {
        id: "seo-vs-sem",
        featured: true,
        href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
        external: true,
        categoryTh: "SEO vs SEM",
        categoryEn: "SEO vs SEM",
        titleTh: "คู่มือเริ่มต้น SEO ของ Google",
        titleEn: "Google’s SEO Starter Guide",
        descriptionTh: "งาน SEO คือการทำให้เว็บไซต์พร้อมสำหรับการค้นหาแบบออร์แกนิก ซึ่งต่างจากโฆษณา Search นี่เป็นแนวทางของ Google ไม่ใช่ผลอันดับหรืองบโฆษณาโรงแรม",
        descriptionEn: "SEO is organic search readiness. It is not the same as paid Search ads. This is Google guidance, not a hotel ranking or ad-spend result",
        accessedAt: "2026-10-27",
        dateKind: "accessed" as const,
        contentTypeTh: "แนวทางผลิตภัณฑ์",
        contentTypeEn: "Guidance",
        ctaTh: "เปิดแนวทางของ Google",
        ctaEn: "Open Google guidance",
        sourceName: "Google Search Central — SEO Starter Guide",
        sourceUrl: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
      };

  const directInsight = insightRelatedCard("/insights/direct-booking-journey-audit", {
    id: "direct-booking",
    categoryTh: "Direct Booking",
    categoryEn: "Direct Booking",
    ctaTh: "อ่านบทความ",
    ctaEn: "Read article",
  });
  const directSolutionHref = relatedInternalHref("/solutions/hotel-direct-bookings", locale);
  const directCard = directInsight && relatedInternalHref(directInsight.href, locale)
    ? directInsight
    : directSolutionHref
      ? {
          id: "direct-booking",
          href: "/solutions/hotel-direct-bookings",
          categoryTh: "Direct Booking",
          categoryEn: "Direct Booking",
          titleTh: "เพิ่มการจองผ่านเว็บไซต์",
          titleEn: "Website Conversion & Direct Bookings",
          descriptionTh: "ปรับเว็บไซต์ที่มีอยู่ให้ลูกค้าเดินจากหน้าเข้าชมถึง Booking Engine ได้ง่ายขึ้น แยกคลิกปุ่มจองออกจากการจองสำเร็จ",
          descriptionEn: "Improve the hotel’s current website so guests can continue from the landing page to a direct booking. A Book click is not counted as a completed booking",
          contentTypeTh: "โซลูชัน",
          contentTypeEn: "Solution",
          ctaTh: "ดูโซลูชัน",
          ctaEn: "View solution",
        }
      : null;

  const reviewToolHref = relatedInternalHref("/tools/hotel-review-link", locale);
  const reviewCard = reviewToolHref
    ? {
        id: "reviews",
        href: "/tools/hotel-review-link",
        categoryTh: "รีวิวและชื่อเสียง",
        categoryEn: "Review and reputation",
        titleTh: "สร้างลิงก์รีวิว Google",
        titleEn: "Create a Google review link",
        descriptionTh: "สร้างลิงก์ที่พาลูกค้าไปยังหน้าส่งรีวิว เพื่อให้ขั้นตอนการขอรีวิวสะดวกและตรงจุดมากขึ้น",
        descriptionEn: "Create a link that takes customers to the review form, so asking for a review is clearer",
        contentTypeTh: "เครื่องมือ",
        contentTypeEn: "Tool",
        ctaTh: "ใช้เครื่องมือฟรี",
        ctaEn: "Use the free tool",
      }
    : {
        id: "reviews",
        href: "https://support.google.com/business/answer/3474122?hl=en",
        external: true,
        categoryTh: "รีวิวและชื่อเสียง",
        categoryEn: "Review and reputation",
        titleTh: "การตอบรีวิวใน Google Business Profile",
        titleEn: "Respond to reviews on Google Business Profile",
        descriptionTh: "Google ระบุว่ารีวิวและคะแนนเป็นส่วนหนึ่งของความโดดเด่น ควรขอรีวิวจากลูกค้าจริงและตอบอย่างเหมาะสม นี่เป็นแนวทางผลิตภัณฑ์ ไม่ใช่ผลอันดับโรงแรม",
        descriptionEn: "Google lists reviews and ratings as part of prominence. Ask real customers and reply appropriately. This is product help, not a hotel ranking result",
        accessedAt: "2026-10-27",
        dateKind: "accessed" as const,
        contentTypeTh: "แนวทางผลิตภัณฑ์",
        contentTypeEn: "Guidance",
        ctaTh: "เปิดแนวทางของ Google",
        ctaEn: "Open Google guidance",
        sourceName: "Google Business Profile Help — Respond to reviews",
        sourceUrl: "https://support.google.com/business/answer/3474122?hl=en",
      };

  const cards: Array<HotelSeoRelatedCard | null> = [
    seoCard,
    {
      id: "local-seo",
      href: HOTEL_SEO_SOURCES.localRank.url,
      external: true,
      categoryTh: "Local SEO",
      categoryEn: "Local SEO",
      titleTh: "ผลการค้นหาธุรกิจในพื้นที่ทำงานอย่างไร",
      titleEn: "How local results work",
      descriptionTh: "Google ระบุว่าผลการค้นหาธุรกิจในพื้นที่พิจารณาความเกี่ยวข้อง ระยะทาง และความโดดเด่น นี่เป็นแนวทางผลิตภัณฑ์ ไม่ใช่ผลอันดับโรงแรม",
      descriptionEn: "Google lists relevance, distance, and prominence as the main local ranking factors. This is product help, not a hotel Maps rank",
      accessedAt: HOTEL_SEO_SOURCES.localRank.accessedAt,
      dateKind: "accessed",
      contentTypeTh: "แนวทางผลิตภัณฑ์",
      contentTypeEn: "Guidance",
      ctaTh: "เปิดแนวทางของ Google",
      ctaEn: "Open Google guidance",
      sourceName: HOTEL_SEO_SOURCES.localRank.name,
      sourceUrl: HOTEL_SEO_SOURCES.localRank.url,
    },
    {
      id: "gbp",
      href: "https://support.google.com/business/answer/9159796?hl=en",
      external: true,
      categoryTh: "Google Business Profile",
      categoryEn: "Google Business Profile",
      titleTh: "ข้อมูลประสิทธิภาพของ Google Business Profile",
      titleEn: "Google Business Profile performance",
      descriptionTh: "ดูการเข้าชมโปรไฟล์ คลิกเว็บไซต์ การโทร และเส้นทาง เมื่อมีสิทธิ์เข้าถึง การเข้าชมโปรไฟล์ไม่ใช่การจอง",
      descriptionEn: "Review profile views, website clicks, calls, and directions when access exists. Profile views are not bookings",
      accessedAt: "2026-10-27",
      dateKind: "accessed",
      contentTypeTh: "แนวทางผลิตภัณฑ์",
      contentTypeEn: "Guidance",
      ctaTh: "เปิดแนวทางของ Google",
      ctaEn: "Open Google guidance",
      sourceName: "Google Business Profile Help — Performance",
      sourceUrl: "https://support.google.com/business/answer/9159796?hl=en",
    },
    {
      id: "search-console",
      href: "https://support.google.com/webmasters/answer/7576553?hl=en",
      external: true,
      categoryTh: "Search Console",
      categoryEn: "Search Console",
      titleTh: "รายงาน Performance ใน Search Console",
      titleEn: "Search Console Performance report",
      descriptionTh: "ดูการแสดงผล คลิก คำค้น และหน้าปลายทาง เมื่อมีสิทธิ์เข้าถึง การแสดงผลไม่ใช่รายได้",
      descriptionEn: "Review search impressions, clicks, queries, and landing pages when access exists. Impressions are not revenue",
      accessedAt: "2026-10-27",
      dateKind: "accessed",
      contentTypeTh: "แนวทางผลิตภัณฑ์",
      contentTypeEn: "Guidance",
      ctaTh: "เปิดแนวทางของ Google",
      ctaEn: "Open Google guidance",
      sourceName: "Google Search Console Help — Performance report",
      sourceUrl: "https://support.google.com/webmasters/answer/7576553?hl=en",
    },
    {
      id: "aeo",
      href: HOTEL_SEO_SOURCES.aiFeatures.url,
      external: true,
      categoryTh: "AEO / AI Search",
      categoryEn: "AEO / AI Search",
      titleTh: "AI features และเว็บไซต์ของคุณ",
      titleEn: "AI features and your website",
      descriptionTh: "งาน SEO พื้นฐานยังใช้กับ AI Overviews และ AI Mode นี่เป็นแนวทางของ Google ไม่ใช่ผลว่าโรงแรมจะปรากฏในคำตอบ AI",
      descriptionEn: "Usual SEO work still applies to AI Overviews and AI Mode. This is Google guidance, not a hotel AI appearance result",
      accessedAt: HOTEL_SEO_SOURCES.aiFeatures.accessedAt,
      dateKind: "accessed",
      contentTypeTh: "แนวทางผลิตภัณฑ์",
      contentTypeEn: "Guidance",
      ctaTh: "เปิดแนวทางของ Google",
      ctaEn: "Open Google guidance",
      sourceName: HOTEL_SEO_SOURCES.aiFeatures.name,
      sourceUrl: HOTEL_SEO_SOURCES.aiFeatures.url,
    },
    directCard,
    {
      id: "website-health",
      href: "/tools/hotel-searchability-check",
      categoryTh: "Website Search Health",
      categoryEn: "Website Search Health",
      titleTh: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
      titleEn: "Hotel searchability check",
      descriptionTh: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าจาก Search หรือ Maps หาข้อมูลแล้วเดินทางไปสอบถามหรือจองต่อหรือไม่ ไม่ใช่ผลอันดับของโรงแรมใด",
      descriptionEn: "See whether pages are ready for customers from Search or Maps to find facts and continue to contact or booking. Not a hotel ranking result",
      contentTypeTh: "เครื่องมือ",
      contentTypeEn: "Tool",
      ctaTh: "ใช้เครื่องมือฟรี",
      ctaEn: "Use the free tool",
    },
    reviewCard,
  ];

  return cards.filter((card): card is HotelSeoRelatedCard => {
    if (!card) return false;
    if (card.external) return Boolean(card.href);
    return Boolean(relatedInternalHref(card.href, locale));
  });
}

export function hotelSeoRelatedDateLabel(card: HotelSeoRelatedCard, locale: Locale) {
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const iso = card.dateKind === "accessed" ? card.accessedAt : card.dateKind === "updated" ? card.updatedAt || card.publishedAt : card.publishedAt;
  if (!iso) return "";
  const prefix = card.dateKind === "accessed" ? (locale === "th" ? "เข้าถึง" : "Accessed") : card.dateKind === "updated" ? ui.updated : ui.published;
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function hotelSeoRelatedTypeLabel(card: HotelSeoRelatedCard, locale: Locale) {
  const type = locale === "th" ? card.contentTypeTh : card.contentTypeEn;
  if (!card.readingTimeMinutes) return type;
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  return `${type} · ${card.readingTimeMinutes} ${ui.minutes}`;
}

export const HOTEL_SEO_ENQUIRY_RECEIVE = [
  {
    id: "search-visibility",
    title: "Current Search Visibility Review",
    th: "ทบทวนว่าลูกค้าค้นพบธุรกิจจาก Search, Maps หรือ AI ได้อย่างไรจากข้อมูลที่มีอยู่ ไม่ใช่ผลอันดับ",
    en: "Review how customers currently find the business from Search, Maps, or AI, from the facts that exist. Not a ranking result",
  },
  {
    id: "website-maps",
    title: "Website and Google Maps Review",
    th: "ตรวจเว็บไซต์และ Google Maps ว่าข้อมูลธุรกิจตรงกัน และลูกค้าเดินต่อเพื่อติดต่อหรือจองได้หรือไม่",
    en: "Review the website and Google Maps to see whether business facts match and the customer can continue to contact or book",
  },
  {
    id: "gbp",
    title: "Google Business Profile Review",
    th: "ตรวจโปรไฟล์ธุรกิจ หมวดหมู่ เวลาเปิด รูป รีวิว และลิงก์ติดต่อ เมื่อมีสิทธิ์เข้าถึง",
    en: "Review the business profile, category, hours, photos, reviews, and contact links when access exists",
  },
  {
    id: "decision-checklist",
    title: "Customer Decision Information Checklist",
    th: "รายการข้อมูลที่ลูกค้าใช้ตัดสินใจ เช่น ที่อยู่ เวลาเปิด บริการ ราคา และช่องทางติดต่อ",
    en: "A checklist of facts customers use to decide, such as address, hours, services, price, and contact paths",
  },
  {
    id: "quick-wins",
    title: "Quick Wins and Prioritized Action Plan",
    th: "สรุปสิ่งที่ปรับได้ก่อน และสิ่งที่ควรทำเป็นลำดับ โดยยังไม่สัญญาผลอันดับหรือการจอง",
    en: "A short list of what can be fixed first and what to do next, without a promised rank or booking result",
  },
  {
    id: "measurement",
    title: "Measurement and Tracking Plan",
    th: "วางแผนว่าจะดูการค้นพบ การติดต่อ หรือการจองจากระบบที่มีอยู่ได้อย่างไร การแสดงผลไม่ใช่รายได้",
    en: "Plan how discovery, contact, or booking can be reviewed from systems already in place. Impressions are not revenue",
  },
] as const;

export const HOTEL_SEO_ENQUIRY = {
  kicker: "Hotel SEO Review",
  receiveTitle: {
    th: "โรงแรมจะได้อะไรจากการเริ่มทบทวน Hotel SEO",
    en: "What the hotel receives from starting a Hotel SEO review",
  },
  nextTitle: {
    th: "What Happens Next",
    en: "What Happens Next",
  },
  steps: {
    th: [
      "ดูการค้นพบปัจจุบันของธุรกิจ",
      "ตรวจเว็บไซต์และ Google Maps",
      "ตรวจข้อมูลที่ลูกค้าใช้ตัดสินใจ",
      "สรุป Quick Wins และสิ่งที่ควรปรับก่อน",
    ],
    en: [
      "Review how customers currently find the business",
      "Review the website and Google Maps",
      "Review the facts customers use to decide",
      "Summarise quick wins and what to adjust first",
    ],
  },
  heading: {
    th: "ให้ทีมดูการค้นพบธุรกิจของคุณ",
    en: "Ask the team to review how customers find this business",
  },
  lead: {
    th: "ส่งชื่อโรงแรม เว็บไซต์หรือ Google Maps และปัญหาที่พบ ให้ทีมดูการค้นพบ เว็บไซต์ โปรไฟล์ธุรกิจ และข้อมูลที่ลูกค้าใช้ตัดสินใจ",
    en: "Send the hotel name, a website or Google Maps link, and the issue you see, so the team can review discovery, the website, the business profile, and the facts customers use to decide.",
  },
  note: {
    th: "ไม่จำเป็นต้องมี Search Console หรือข้อมูลครบทุกระบบอยู่แล้วก็ได้",
    en: "Search Console or a complete set of systems is not required to start",
  },
  submit: {
    th: "ให้ทีมดูการค้นพบธุรกิจของคุณ",
    en: "Ask the team to review how customers find this business",
  },
  labels: {
    th: {
      name: "ชื่อผู้ติดต่อ",
      business: "ชื่อโรงแรม / กิจการ",
      contact: "เบอร์โทรหรืออีเมล",
      consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
      privacy: "นโยบายความเป็นส่วนตัว",
    },
    en: {
      name: "Your name",
      business: "Hotel / company name",
      contact: "Email / phone",
      consent: "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: "privacy policy",
    },
  },
  fields: {
    th: {
      website: "เว็บไซต์",
      websiteHint: "ลิงก์หน้าเว็บโรงแรม ถ้ามี",
      websiteInvalid: "กรุณาใส่ลิงก์ให้ถูกต้อง",
      maps: "ลิงก์ Google Business Profile",
      mapsHint: "ลิงก์โปรไฟล์หรือ Google Maps ถ้ามี",
      mapsInvalid: "กรุณาใส่ลิงก์ให้ถูกต้อง",
      issue: "ปัญหาหลัก",
      issueEmpty: "เลือกปัญหาหลัก",
      issueSearch: "Search",
      issueMaps: "Maps",
      issueWebsite: "Website",
      issueContact: "Contact",
      issueBooking: "Booking",
      outcome: "ผลที่ต้องการ",
      outcomeHint: "บอกสั้น ๆ ว่าอยากให้ทีมดูอะไรเป็นลำดับแรก",
      loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
    },
    en: {
      website: "Website URL",
      websiteHint: "The hotel website link, if you have one",
      websiteInvalid: "Enter a valid link",
      maps: "Google Business Profile URL",
      mapsHint: "The profile or Google Maps link, if you have one",
      mapsInvalid: "Enter a valid link",
      issue: "Main issue",
      issueEmpty: "Choose the main issue",
      issueSearch: "Search",
      issueMaps: "Maps",
      issueWebsite: "Website",
      issueContact: "Contact",
      issueBooking: "Booking",
      outcome: "Desired outcome",
      outcomeHint: "A short note on what you want the team to look at first",
      loading: "Sending your message. Please wait.",
    },
  },
} as const;

export function hotelSeoEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: HOTEL_SEO_ENQUIRY.kicker,
    heading: thai ? HOTEL_SEO_ENQUIRY.heading.th : HOTEL_SEO_ENQUIRY.heading.en,
    lead: thai ? HOTEL_SEO_ENQUIRY.lead.th : HOTEL_SEO_ENQUIRY.lead.en,
    note: thai ? HOTEL_SEO_ENQUIRY.note.th : HOTEL_SEO_ENQUIRY.note.en,
    submit: thai ? HOTEL_SEO_ENQUIRY.submit.th : HOTEL_SEO_ENQUIRY.submit.en,
    receiveTitle: thai ? HOTEL_SEO_ENQUIRY.receiveTitle.th : HOTEL_SEO_ENQUIRY.receiveTitle.en,
    nextTitle: thai ? HOTEL_SEO_ENQUIRY.nextTitle.th : HOTEL_SEO_ENQUIRY.nextTitle.en,
    receive: HOTEL_SEO_ENQUIRY_RECEIVE.map((item) => ({
      id: item.id,
      title: item.title,
      body: thai ? item.th : item.en,
    })),
    steps: thai ? [...HOTEL_SEO_ENQUIRY.steps.th] : [...HOTEL_SEO_ENQUIRY.steps.en],
    fields: thai ? HOTEL_SEO_ENQUIRY.fields.th : HOTEL_SEO_ENQUIRY.fields.en,
    labels: thai ? HOTEL_SEO_ENQUIRY.labels.th : HOTEL_SEO_ENQUIRY.labels.en,
  };
}

export const HOTEL_SEO_GSC_ROWS = [
  { id: "queries", areaTh: "คำค้น", areaEn: "Queries", checkTh: "ดูว่าหน้าใดถูกค้นพบ", checkEn: "See which pages are found" },
  { id: "pages", areaTh: "หน้าปลายทาง", areaEn: "Landing pages", checkTh: "ไม่แสดงรหัสพร็อพเพอร์ตี้", checkEn: "No property ID shown" },
  { id: "experience", areaTh: "ประสบการณ์หน้าเว็บ", areaEn: "Page experience", checkTh: "ตรวจได้จากระบบจริง", checkEn: "Reviewed in the live account" },
] as const;

export const HOTEL_SEO_LISTING_ROWS = [
  { id: "name", areaTh: "ชื่อและหมวดหมู่", areaEn: "Name and category", checkTh: "ตรงกับธุรกิจจริง", checkEn: "Matches the real business" },
  { id: "hours", areaTh: "เวลาเปิด", areaEn: "Hours", checkTh: "ตรงกับเว็บไซต์", checkEn: "Matches the website" },
  { id: "nap", areaTh: "ที่อยู่ โทร เว็บ", areaEn: "Address, phone, website", checkTh: "ข้อมูลชุดเดียวกัน", checkEn: "One set of facts" },
  { id: "services", areaTh: "บริการหรือห้องพัก", areaEn: "Services or rooms", checkTh: "มีอยู่จริงและจองได้", checkEn: "Still offered and bookable" },
  { id: "photos", areaTh: "รูปภาพ", areaEn: "Photos", checkTh: "เป็นปัจจุบัน", checkEn: "Current and relevant" },
] as const;

export const HOTEL_SEO_PATH = [
  { id: "search", th: "Search / AI", en: "Search / AI" },
  { id: "maps", th: "Maps / Profile", en: "Maps / Profile" },
  { id: "website", th: "Website", en: "Website" },
  { id: "contact", th: "ติดต่อหรือจอง", en: "Contact or book" },
] as const;

export const HOTEL_SEO_KPI_GROUPS = [
  {
    id: "website",
    num: "01",
    titleTh: "Website Search Performance",
    titleEn: "Website Search Performance",
    noteTh: "สัญญาณจาก Search Console เมื่อมีสิทธิ์เข้าถึง การแสดงผลและคลิกไม่ใช่รายได้",
    noteEn: "Search Console signals when access exists. Impressions and clicks are not revenue",
  },
  {
    id: "gbp",
    num: "02",
    titleTh: "Google Business Profile",
    titleEn: "Google Business Profile",
    noteTh: "สัญญาณจากโปรไฟล์ธุรกิจเมื่อมีสิทธิ์เข้าถึง การเข้าชมโปรไฟล์ไม่ใช่การจอง",
    noteEn: "Business Profile signals when access exists. Profile views are not bookings",
  },
  {
    id: "business",
    num: "03",
    titleTh: "Business Outcomes",
    titleEn: "Business Outcomes",
    noteTh: "ผลธุรกิจเฉพาะที่โรงแรมตรวจสอบได้ในระบบของตนเอง ไม่นับการแสดงผลเป็นการจอง",
    noteEn: "Business results only where the hotel can verify them in its own systems. Impressions are not bookings",
  },
] as const;

const HOTEL_SEO_KPI_SAMPLE = {
  periodTh: "เมื่อมีสิทธิ์เข้าถึง · กรอบตัวอย่าง",
  periodEn: "When access exists · sample framework",
  propertyTh: "กรอบตัวอย่าง · ไม่มีรหัสพร็อพเพอร์ตี้จริง",
  propertyEn: "Sample framework · no live property ID",
  comparisonTh: "ยังไม่กำหนด จนกว่าจะมีข้อมูลที่อนุมัติ",
  comparisonEn: "Not set until approved data exists",
  updatedAt: "2026-10-28",
} as const;

const HOTEL_SEO_KPI_SOURCE_GSC = {
  name: "Google Search Console Help — Performance report",
  url: "https://support.google.com/webmasters/answer/7576553?hl=en",
} as const;

const HOTEL_SEO_KPI_SOURCE_GBP = {
  name: "Google Business Profile Help — Performance",
  url: "https://support.google.com/business/answer/9159796?hl=en",
} as const;

const HOTEL_SEO_KPI_SOURCE_HOTEL = {
  name: "Hotel contact and booking systems",
  url: "",
} as const;

export const HOTEL_SEO_KPIS = [
  {
    id: "impressions",
    group: "website",
    nameTh: "Search impressions",
    nameEn: "Search impressions",
    definitionTh: "จำนวนครั้งที่หน้าเว็บปรากฏในผลการค้นหา จาก Search Console เมื่อมีสิทธิ์เข้าถึง ไม่ใช่รายได้",
    definitionEn: "Times a page appeared in Search results, from Search Console when access exists. Not revenue",
    source: HOTEL_SEO_KPI_SOURCE_GSC,
  },
  {
    id: "clicks",
    group: "website",
    nameTh: "Clicks",
    nameEn: "Clicks",
    definitionTh: "จำนวนคลิกจาก Search เข้าเว็บไซต์ จาก Search Console เมื่อมีสิทธิ์เข้าถึง ไม่ใช่การจอง",
    definitionEn: "Clicks from Search to the website, from Search Console when access exists. Not a booking",
    source: HOTEL_SEO_KPI_SOURCE_GSC,
  },
  {
    id: "queries",
    group: "website",
    nameTh: "Relevant queries",
    nameEn: "Relevant queries",
    definitionTh: "คำค้นที่ทำให้หน้าเว็บถูกแสดงหรือถูกคลิก จาก Search Console ไม่ใช่การรับประกันอันดับ",
    definitionEn: "Queries that showed or clicked the website, from Search Console. Not a rank guarantee",
    source: HOTEL_SEO_KPI_SOURCE_GSC,
  },
  {
    id: "landing",
    group: "website",
    nameTh: "Landing page visits",
    nameEn: "Landing page visits",
    definitionTh: "หน้าเว็บที่ผู้ใช้เปิดจาก Search จาก Search Console ไม่ใช่การติดต่อหรือจอง",
    definitionEn: "Pages people opened from Search, from Search Console. Not contact or booking",
    source: HOTEL_SEO_KPI_SOURCE_GSC,
  },
  {
    id: "contact-path",
    group: "website",
    nameTh: "Contact-path engagement",
    nameEn: "Contact-path engagement",
    definitionTh: "การกระทำบนเว็บไซต์ที่มุ่งสู่การติดต่อหรือจอง เมื่อวัดผลได้ ไม่ใช่การจองที่ตรวจสอบแล้ว",
    definitionEn: "On-site actions toward contact or booking when they can be measured. Not a verified booking",
    source: HOTEL_SEO_KPI_SOURCE_HOTEL,
  },
  {
    id: "profile-views",
    group: "gbp",
    nameTh: "Profile views",
    nameEn: "Profile views",
    definitionTh: "จำนวนครั้งที่โปรไฟล์ถูกแสดง จากข้อมูลประสิทธิภาพของ Business Profile เมื่อมีสิทธิ์เข้าถึง ไม่ใช่การจอง",
    definitionEn: "How often the Business Profile was shown, from profile performance when access exists. Not a booking",
    source: HOTEL_SEO_KPI_SOURCE_GBP,
  },
  {
    id: "gbp-website-clicks",
    group: "gbp",
    nameTh: "Website clicks",
    nameEn: "Website clicks",
    definitionTh: "การคลิกจากโปรไฟล์ไปเว็บไซต์ เมื่อมีสิทธิ์เข้าถึง ไม่ใช่รายได้",
    definitionEn: "Clicks from the profile to the website when access exists. Not revenue",
    source: HOTEL_SEO_KPI_SOURCE_GBP,
  },
  {
    id: "gbp-calls",
    group: "gbp",
    nameTh: "Calls",
    nameEn: "Calls",
    definitionTh: "การกดปุ่มโทรบนโปรไฟล์ เมื่อมีสิทธิ์เข้าถึง ไม่ใช่ยอดขายที่ปิดได้",
    definitionEn: "Call-button taps on the profile when access exists. Not a completed sale",
    source: HOTEL_SEO_KPI_SOURCE_GBP,
  },
  {
    id: "directions",
    group: "gbp",
    nameTh: "Directions",
    nameEn: "Directions",
    definitionTh: "การขอเส้นทางจากโปรไฟล์ เมื่อมีสิทธิ์เข้าถึง ไม่ใช่การเดินทางมาถึงหรือการจอง",
    definitionEn: "Direction requests from the profile when access exists. Not an arrival or a booking",
    source: HOTEL_SEO_KPI_SOURCE_GBP,
  },
  {
    id: "photo-review",
    group: "gbp",
    nameTh: "Photo/review interactions",
    nameEn: "Photo/review interactions",
    definitionTh: "การดูรูปหรือการกระทำกับรีวิว เมื่อ Business Profile รายงานได้และวัดผลได้",
    definitionEn: "Photo views or review actions when Business Profile reports them and they are measurable",
    source: HOTEL_SEO_KPI_SOURCE_GBP,
  },
  {
    id: "contact",
    group: "business",
    nameTh: "Contact",
    nameEn: "Contact",
    definitionTh: "เหตุการณ์ติดต่อที่โรงแรมตรวจสอบได้ในระบบของตนเอง ไม่นับการแสดงผลเป็นรายได้",
    definitionEn: "A contact event the hotel can verify in its own systems. Impressions are not counted as revenue",
    source: HOTEL_SEO_KPI_SOURCE_HOTEL,
  },
  {
    id: "call",
    group: "business",
    nameTh: "Call",
    nameEn: "Call",
    definitionTh: "การโทรที่โรงแรมตรวจสอบได้ แยกจากการกดโทรบนโปรไฟล์ เว้นแต่โรงแรมจับคู่ได้",
    definitionEn: "A phone contact the hotel can verify. Separate from profile call taps unless the hotel can match them",
    source: HOTEL_SEO_KPI_SOURCE_HOTEL,
  },
  {
    id: "inquiry",
    group: "business",
    nameTh: "Direct inquiry",
    nameEn: "Direct inquiry",
    definitionTh: "การสอบถามผ่านฟอร์มหรือข้อความที่โรงแรมตรวจสอบได้ ไม่ใช่การจอง",
    definitionEn: "An enquiry through a form or message the hotel can verify. Not a booking",
    source: HOTEL_SEO_KPI_SOURCE_HOTEL,
  },
  {
    id: "booking-intent",
    group: "business",
    nameTh: "Booking intent",
    nameEn: "Booking intent",
    definitionTh: "เหตุการณ์เริ่มจองหรือขอจองที่โรงแรมวัดได้ ไม่ใช่การจองที่ตรวจสอบแล้ว",
    definitionEn: "A start-booking or request-to-book event the hotel can measure. Not a verified booking",
    source: HOTEL_SEO_KPI_SOURCE_HOTEL,
  },
  {
    id: "verified-booking",
    group: "business",
    nameTh: "Verified booking",
    nameEn: "Verified booking",
    definitionTh: "การจองที่โรงแรมยืนยันได้ในระบบจอง ไม่นับการเข้าชมโปรไฟล์เป็นการจอง",
    definitionEn: "A booking the hotel can confirm in its reservation system. Profile views are not bookings",
    source: HOTEL_SEO_KPI_SOURCE_HOTEL,
  },
] as const;

export type HotelSeoKpiOverride = {
  id?: string;
  name?: string;
  group?: string;
  definition?: string;
  unit?: string;
  period?: string;
  target?: string;
  value?: string;
  context?: string;
  labels?: string[];
  values?: number[];
  dataStatus?: string;
  updatedAt?: string;
  hideUntilData?: boolean;
  source?: { name?: string; url?: string; market?: string; period?: string };
};

export function hotelSeoKpiStatusLabel(status?: string) {
  if (status === "approved") return "Approved";
  if (status === "anonymised") return "Anonymised";
  return "Sample";
}

export function hotelSeoKpiShowsValue(input?: { dataStatus?: string; hideUntilData?: boolean; value?: string }) {
  if (!input?.value?.trim()) return false;
  if (input.hideUntilData) return false;
  return input.dataStatus === "approved" || input.dataStatus === "anonymised";
}

export function hotelSeoKpiSampleMeta() {
  return HOTEL_SEO_KPI_SAMPLE;
}

export function hotelSeoSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างข้อมูล" : "Sample Visual";
}

export function hotelSeoShowsSampleBadge(status?: string) {
  return status !== "approved" && status !== "real";
}

export const HOTEL_SEO_FAQS = {
  th: [
    {
      q: "AEO คืออะไรและต่างจาก SEO อย่างไร",
      a: "AEO คือการจัดข้อมูลให้ตอบคำถามของผู้ค้นหาได้ชัดเจน โดยเฉพาะคำถามที่ละเอียดหรือมีหลายเงื่อนไข SEO ยังครอบคลุมการทำให้เว็บไซต์ถูกค้นพบและมีหน้าปลายทางที่ใช้ได้ AEO ไม่ใช่ช่องทางลัดที่รับประกันว่าโรงแรมจะปรากฏในคำตอบ AI",
    },
    {
      q: "ต้องมีเว็บไซต์ไหมถ้ามี Google Business Profile แล้ว",
      a: "Google Business Profile ช่วยให้ลูกค้าเห็นข้อมูลสำคัญบน Search และ Maps ได้ เว็บไซต์มีพื้นที่อธิบายห้องพัก บริการ เงื่อนไข และเส้นทางจองได้มากกว่า ทีมดูจากข้อมูลที่ลูกค้าต้องใช้ตัดสินใจ ไม่ได้บังคับว่าทุกโรงแรมต้องมีเว็บไซต์ก่อนเริ่มทบทวน",
    },
    {
      q: "รีวิวช่วยให้ติดอันดับ Maps หรือไม่",
      a: "Google ระบุว่ารีวิวและคะแนนเป็นส่วนหนึ่งของความโดดเด่น แต่ผลการค้นหาในพื้นที่จะขึ้นกับความเกี่ยวข้องและระยะทางด้วย ควรขอรีวิวจากลูกค้าจริง ตอบอย่างเหมาะสม และรักษาข้อมูลธุรกิจให้ถูกต้อง ไม่ได้รับประกันอันดับจากจำนวนดาว",
    },
    {
      q: "ต้องใช้เวลานานเท่าไรจึงเห็นการเปลี่ยนแปลง",
      a: "ขึ้นกับข้อมูลปัจจุบัน การแข่งขันในพื้นที่ และสิ่งที่ต้องปรับ เวลาเปิดหรือเบอร์โทรอาจเปลี่ยนได้ทันที ส่วนการค้นพบจาก Search และเนื้อหาต้องติดตามต่อเนื่อง หน้านี้ไม่กำหนดจำนวนวันหรือสัปดาห์ที่จะเห็นผล",
    },
    {
      q: "Google Maps และ AI Search ใช้ข้อมูลจากไหน",
      a: "Maps ใช้ข้อมูลจาก Google Business Profile และปัจจัยที่ Google ระบุ เช่น ความเกี่ยวข้อง ระยะทาง และความโดดเด่น AI Search ใช้เนื้อหาเว็บไซต์และข้อมูลสาธารณะตามแนวทางของ Google โรงแรมไม่ได้กำหนดว่า Google จะดึงแหล่งใดในแต่ละคำค้น",
    },
    {
      q: "โรงแรมควรเตรียมข้อมูลอะไร",
      a: "ชื่อ ที่อยู่ เวลาเปิด เบอร์โทร เว็บไซต์ บริการหรือห้องพัก รูปภาพ และราคาที่โรงแรมยืนยันได้ หากมีสิทธิ์เข้าถึง Google Business Profile หรือ Search Console จะช่วยให้ทบทวนได้ละเอียดขึ้น แต่ไม่จำเป็นต้องมีครบทุกระบบก่อนเริ่ม",
    },
    {
      q: "วัดผลจาก Search ไปถึง Contact หรือ Booking ได้อย่างไร",
      a: "เมื่อมีสิทธิ์เข้าถึง Search Console ดูการแสดงผล คลิก และหน้าปลายทาง Google Business Profile ดูการเข้าชมโปรไฟล์ คลิกเว็บ การโทร และเส้นทาง เว็บไซต์วัดการติดต่อหรือก้าวเข้าสู่การจองได้เฉพาะเมื่อระบบรองรับ การแสดงผลและการเข้าชมโปรไฟล์ไม่ใช่การจอง",
    },
    {
      q: "ใครเป็นผู้อนุมัติข้อมูล ราคา รูปภาพ และบริการบน Profile",
      a: "โรงแรมเป็นผู้อนุมัติข้อมูลธุรกิจ ราคา รูปภาพ บริการ และข้อความก่อนเผยแพร่ เดอะ เคพีไอ พลัส อาจแนะนำสิ่งที่ควรตรวจ แต่ไม่เผยแพร่แทนโรงแรม",
    },
    {
      q: "AI Search รับประกันการแสดงผลได้หรือไม่",
      a: "ไม่ได้ Google ระบุว่างาน SEO พื้นฐานยังใช้กับ AI Overviews และ AI Mode ได้ แต่ไม่ได้รับประกันว่าโรงแรมจะปรากฏในคำตอบ AI",
    },
    {
      q: "ต้องใช้ Google Search Console หรือไม่",
      a: "ไม่จำเป็นต้องมีก่อนเริ่มทบทวน หากโรงแรมให้สิทธิ์เข้าถึงได้ ทีมจะดูคำค้นและหน้าปลายทางจากรายงานจริง หากยังไม่มี สิ่งที่มีอยู่คือเว็บไซต์ Maps และข้อมูลธุรกิจ",
    },
  ],
  en: [
    {
      q: "What is AEO, and how is it different from SEO?",
      a: "AEO means organising facts so they clearly answer the searcher’s question, especially a detailed or multi-part question. SEO still covers being found and having usable landing pages. AEO is not a shortcut that guarantees a hotel will appear in an AI answer.",
    },
    {
      q: "Do we still need a website if we already have a Google Business Profile?",
      a: "A Google Business Profile can show key facts on Search and Maps. A website has more space for rooms, services, conditions, and the booking path. The team looks at the facts customers need to decide. A website is not required before a review can start.",
    },
    {
      q: "Do reviews improve a Maps rank?",
      a: "Google lists reviews and ratings as part of prominence. Local results also depend on relevance and distance. Ask real customers, reply appropriately, and keep business facts accurate. A star count does not guarantee a Maps rank.",
    },
    {
      q: "How long before we see a change?",
      a: "It depends on the current facts, local competition, and what needs changing. Hours or a phone number can change at once. Search visibility and content need ongoing review. This page does not set a number of days or weeks to a result.",
    },
    {
      q: "Where do Google Maps and AI Search get their information?",
      a: "Maps uses the Google Business Profile and the local factors Google publishes: relevance, distance, and prominence. AI Search uses the website and public web content, according to Google guidance. The hotel does not choose which source Google uses for a given query.",
    },
    {
      q: "What information should the hotel prepare?",
      a: "Name, address, hours, phone, website, services or rooms, photos, and prices the hotel can stand behind. Access to Google Business Profile or Search Console helps when it exists. A complete set of systems is not required to start.",
    },
    {
      q: "How can Search through to contact or booking be measured?",
      a: "When access exists, Search Console shows impressions, clicks, and landing pages. Google Business Profile shows profile views, website clicks, calls, and directions. The website can show contact or booking-path actions only when those events can be measured. Impressions and profile views are not bookings.",
    },
    {
      q: "Who approves facts, prices, photos, and services on the profile?",
      a: "The hotel approves business facts, prices, photos, services, and wording before they are published. The KPI Plus may recommend what to review, and does not publish in the hotel’s place.",
    },
    {
      q: "Does AI Search guarantee an appearance?",
      a: "No. Google says usual SEO work still applies to AI Overviews and AI Mode. That does not guarantee the hotel will appear in an AI answer.",
    },
    {
      q: "Is Google Search Console required?",
      a: "No. A review can start without it. If the hotel can grant access, the team can review queries and landing pages from the live report. If not, the website, Maps, and business facts are still used.",
    },
  ],
} as const;

export function hotelSeoFaqs(locale: Locale): { q: string; a: string }[] {
  const rows = locale === "th" ? HOTEL_SEO_FAQS.th : HOTEL_SEO_FAQS.en;
  return rows.map((item) => ({ q: item.q, a: item.a }));
}

export function hotelSeoFaqsAreStale(faqs: { q: string }[]) {
  if (!faqs.length) return true;
  const questions = faqs.map((item) => item.q.trim());
  const legacy = questions.some((question) => question === "AEO คืออะไร และต่างจาก SEO ไหม?" || question === "What is AEO, and is it different from SEO?");
  return legacy && faqs.length <= 4;
}
