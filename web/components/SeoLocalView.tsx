import Link from "next/link";
import { HotelSeoAuditVisual } from "@/components/hotel-seo/HotelSeoAuditVisual";
import { HotelSeoCompareMatrix } from "@/components/hotel-seo/HotelSeoCompareMatrix";
import { HotelSeoDiscoveryFlow } from "@/components/hotel-seo/HotelSeoDiscoveryFlow";
import { HotelSeoGbpVisual } from "@/components/hotel-seo/HotelSeoGbpVisual";
import { HotelSeoHelpBoundary } from "@/components/hotel-seo/HotelSeoHelpBoundary";
import { HotelSeoHelpSteps } from "@/components/hotel-seo/HotelSeoHelpSteps";
import { HotelSeoKpiFramework } from "@/components/hotel-seo/HotelSeoKpiFramework";
import { HotelSeoProcessSteps } from "@/components/hotel-seo/HotelSeoProcessSteps";
import { HotelSeoProcessVisual } from "@/components/hotel-seo/HotelSeoProcessVisual";
import { HotelSeoHeroVisual } from "@/components/hotel-seo/HotelSeoHeroVisual";
import { HotelSeoSearchBehaviorVisual } from "@/components/hotel-seo/HotelSeoSearchBehaviorVisual";
import { HotelSeoKpiVisual } from "@/components/hotel-seo/HotelSeoKpiVisual";
import { HotelSeoRelatedCards } from "@/components/hotel-seo/HotelSeoRelatedCards";
import { HotelSeoRelatedVisual } from "@/components/hotel-seo/HotelSeoRelatedVisual";
import { PageFaqs } from "@/components/PageFaqs";
import { SeoLocalEnquiry } from "@/components/SeoLocalEnquiry";
import { SeoLocalStickyCta } from "@/components/SeoLocalStickyCta";
import { SiteShell } from "@/components/SiteShell";
import type { CmsHotelSeoPage, CmsSeoRelatedCard } from "@/lib/cms/hotel-seo-page";
import {
  hotelSeoAuditVisualUrl,
  hotelSeoBehaviorVisualUrl,
  hotelSeoCompareVisualUrl,
  hotelSeoFlowVisualUrl,
  hotelSeoGbpVisualUrl,
  hotelSeoHeroVisualUrl,
  hotelSeoKpiVisualUrl,
  hotelSeoProcessVisualUrl,
  hotelSeoRelatedVisualUrl,
  resolveHotelSeoPage,
} from "@/lib/cms/hotel-seo-page-public";
import {
  HOTEL_SEO_AUDIT_VISUAL,
  HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
  HOTEL_SEO_BEHAVIOR_MAP,
  HOTEL_SEO_BEHAVIOR_TYPES,
  HOTEL_SEO_BEHAVIOR_VISUAL,
  HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
  HOTEL_SEO_COMPARE_STATEMENT,
  HOTEL_SEO_COMPARE_VISUAL,
  HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
  HOTEL_SEO_FLOW_VISUAL,
  HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
  HOTEL_SEO_GBP_ACTIONS,
  HOTEL_SEO_GBP_COPY,
  HOTEL_SEO_GBP_VISUAL,
  HOTEL_SEO_GBP_VISUAL_CANDIDATE,
  HOTEL_SEO_HERO_VISUAL,
  HOTEL_SEO_HERO_VISUAL_CANDIDATE,
  HOTEL_SEO_KPI_COPY,
  HOTEL_SEO_KPI_VISUAL_CANDIDATE,
  HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
  HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
  hotelSeoFaqs,
  hotelSeoFaqsAreStale,
  hotelSeoRelatedCards,
  type HotelSeoRelatedCard,
  HOTEL_SEO_PROBLEM_FIELDS,
  HOTEL_SEO_PROBLEM_ITEMS,
  HOTEL_SEO_SOURCES,
} from "@/lib/hotel-seo";
import { solutionNavLabel } from "@/lib/nav";
import { localizePath, type Locale } from "@/lib/seo";

const sources = {
  aiFeatures: HOTEL_SEO_SOURCES.aiFeatures.url,
  aiModeTh: HOTEL_SEO_SOURCES.aiModeTh.url,
  searchIo: HOTEL_SEO_SOURCES.searchIo.url,
  localRank: HOTEL_SEO_SOURCES.localRank.url,
} as const;

function looksThai(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

function cmsText(fromCms: boolean, locale: Locale, value: string | undefined, fallback: string) {
  const next = value?.trim();
  if (!fromCms || !next) return fallback;
  if (locale !== "th" && looksThai(next)) return fallback;
  return next;
}

function cmsList(fromCms: boolean, locale: Locale, rows: string[] | undefined, fallback: string[]) {
  const next = rows?.map((item) => item.trim()).filter(Boolean) ?? [];
  if (!fromCms || !next.length) return fallback;
  if (locale !== "th" && next.some(looksThai)) return fallback;
  return next;
}

function useCmsRows(fromCms: boolean, locale: Locale, sample: string | undefined, count: number) {
  if (!fromCms || !count) return false;
  if (locale !== "th" && sample && looksThai(sample)) return false;
  return true;
}

function visualReady(src: string | undefined, status: string | undefined) {
  const next = src?.trim() || "";
  if (!next || status === "placeholder") return "";
  if (status === "sample" || status === "approved" || status === "real") return next;
  return "";
}

function relatedFromCms(cards: CmsSeoRelatedCard[]): HotelSeoRelatedCard[] {
  return cards.map((card) => ({
    id: card.id,
    href: card.href,
    external: card.external,
    featured: card.featured,
    categoryTh: card.category,
    categoryEn: card.category,
    titleTh: card.title,
    titleEn: card.title,
    descriptionTh: card.description,
    descriptionEn: card.description,
    publishedAt: card.publishedAt || undefined,
    updatedAt: card.updatedAt || undefined,
    accessedAt: card.accessedAt || undefined,
    dateKind: card.accessedAt && !card.publishedAt && !card.updatedAt ? "accessed" : card.updatedAt ? "updated" : "published",
    contentTypeTh: card.contentType,
    contentTypeEn: card.contentType,
    readingTimeMinutes: Number(card.readingTime) || undefined,
    ctaTh: card.cta,
    ctaEn: card.cta,
    sourceName: card.sourceName || undefined,
    sourceUrl: card.sourceUrl || undefined,
  }));
}

function sourceDisplayName(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  if (/blog\.google/i.test(value)) return "blog.google";
  if (/Search Central/i.test(value)) return "Google Search Central";
  if (/Business Profile Help/i.test(value)) return "Google Business Profile Help";
  return value;
}

function SearchSourceCite({
  locale,
  source,
  fallback,
  nameFallback,
}: {
  locale: Locale;
  source?: {
    name?: string;
    url?: string;
    publishedAt?: string;
    accessedAt?: string;
    market?: string;
    period?: string;
    definition?: string;
    status?: string;
  };
  fallback: (typeof HOTEL_SEO_SOURCES)[keyof typeof HOTEL_SEO_SOURCES];
  nameFallback: string;
}) {
  const thai = locale === "th";
  const row = {
    name: source?.name || fallback.name,
    url: source?.url || fallback.url,
    publishedAt: source?.publishedAt || fallback.publishedAt,
    accessedAt: source?.accessedAt || fallback.accessedAt,
    market: source?.market || fallback.market,
    period: source?.period || fallback.period,
    definition: source?.definition || fallback.definition,
    status: source?.status || fallback.status,
  };
  const kind =
    row.status === "platform_estimate"
      ? thai
        ? "ประมาณการแพลตฟอร์ม ไม่ใช่ผลโรงแรม"
        : "Platform estimate, not a hotel result"
      : thai
        ? "แนวทางผลิตภัณฑ์ ไม่ใช่ผลโรงแรม"
        : "Product guidance, not a hotel result";
  const published =
    row.publishedAt && row.publishedAt !== "Guidance"
      ? `${thai ? "เผยแพร่" : "Published"} ${row.publishedAt}`
      : null;
  const accessed = row.accessedAt ? `${thai ? "เข้าถึง" : "Accessed"} ${row.accessedAt}` : null;
  return (
    <p className="kpi-seo-local-change-source">
      <a href={row.url} target="_blank" rel="noreferrer">
        <span className="kpi-latin">
          {thai ? "ที่มา: " : "Source: "}
          {sourceDisplayName(row.name, nameFallback)}
        </span>
      </a>
      <span className="kpi-seo-local-source-url kpi-latin">{row.url}</span>
      <span className="kpi-seo-local-source-meta">
        {[published, accessed, row.market, row.period, kind].filter(Boolean).join(" · ")}
      </span>
      <span className="kpi-seo-local-source-meta">{row.definition}</span>
    </p>
  );
}

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Search Visibility & Local Discovery",
    title: "ให้ลูกค้าค้นพบธุรกิจของคุณ เข้าใจว่าคุณเหมาะกับเขา และติดต่อได้ทันที",
    lead: "วันนี้ลูกค้าไม่ได้ค้นหาแค่ชื่อโรงแรมหรือร้าน แต่ค้นหาด้วยความต้องการ เช่น “สปาใกล้ฉันที่มีนวดคู่” หรือ “โรงแรมใกล้สนามบินที่เช็กอินดึกได้”",
    leadClose:
      "การถูกค้นพบเริ่มจากข้อมูลธุรกิจที่ชัดและสอดคล้องกัน ข้อมูลบน Google Maps และเว็บไซต์ต้องรองรับการตัดสินใจชุดเดียวกัน คำตอบจาก Search และ AI ควรพาไปหน้าธุรกิจที่มีประโยชน์ และเส้นทางสุดท้ายเชื่อมไปสู่การติดต่อหรือจองที่วัดผลได้",
    cta: "ให้ทีมดูการค้นพบธุรกิจของคุณ",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อธุรกิจ เว็บไซต์หรือ Google Maps และปัญหาที่พบ",
    photoAlt: "นักเดินทางค้นหาโรงแรมหรือธุรกิจในพื้นที่บนสมาร์ทโฟนในบรรยากาศที่พัก",
    changeTitle: "พฤติกรรมการค้นหากำลังเปลี่ยน",
    aiTitle: "AI Search ใช้ภาษาไทยได้แล้ว",
    aiBody:
      "Google เปิด AI Mode ในประเทศไทยเมื่อเดือนสิงหาคม 2025 และเพิ่มการรองรับภาษาไทยในเดือนตุลาคม 2025 ผู้ใช้จึงสามารถถามคำถามยาว ๆ เปรียบเทียบตัวเลือก และถามต่อใน Google Search ได้โดยตรง",
    aiSource: "ที่มา: blog.google",
    growthTitle: "การใช้งาน AI Search เติบโตในระดับโลก",
    growthStat: "1 พันล้าน",
    growthLabel: "ผู้ใช้ AI Mode ต่อเดือนทั่วโลก ตามรายงานของ Google ปี 2026",
    growthNote: "ตัวเลขนี้แสดงการเติบโตของรูปแบบการค้นหา แต่ไม่ใช่จำนวนผู้ใช้ในประเทศไทย",
    growthSource: "ที่มา: blog.google",
    mapsTitle: "Google Maps ยังสำคัญกับการตัดสินใจในพื้นที่",
    mapsBody:
      "Google ระบุว่าผลการค้นหาธุรกิจในพื้นที่พิจารณา 3 ปัจจัยหลัก: ความเกี่ยวข้อง ระยะทาง และความโดดเด่นของธุรกิจ ข้อมูล Business Profile ที่ถูกต้องครบถ้วนช่วยให้ลูกค้าเข้าใจว่าร้านทำอะไร อยู่ที่ไหน และเปิดเมื่อไร",
    mapsSource: "ที่มา: Google Business Profile Help",
    changeClose:
      "สำหรับโรงแรม สปา และคาเฟ่ นี่หมายความว่าข้อมูลบนเว็บไซต์และ Google Maps ต้องตอบคำถามเดียวกันให้ชัด ตั้งแต่บริการและทำเล ไปจนถึงราคา เวลาเปิด และวิธีจอง",
    aiNote:
      "แนวทาง SEO พื้นฐานยังใช้กับ AI Overviews และ AI Mode ไม่มีวิธีพิเศษที่รับประกันว่าธุรกิจจะปรากฏในทุกคำตอบ AI หรือ AI Overview การปรากฏต่างกันตามคำค้น ทำเล ภาษา บริบทผู้ใช้ คุณภาพแหล่งข้อมูล และการเปลี่ยนแปลงของระบบค้นหา",
    aiNoteSource: "ที่มา: Google Search Central",
    compareTitle: "SEO, AEO และ Local SEO ช่วยต่างกันอย่างไร?",
    compare: [
      ["SEO", "หน้าเว็บไซต์ที่ตอบสิ่งที่ค้นหา", "เช่น หน้า “โรงแรมใกล้สนามบินภูเก็ต” พร้อมข้อมูลห้องพัก การเดินทาง และวิธีจอง"],
      ["AEO / ความพร้อมสำหรับ AI Search", "ข้อมูลที่ชัดเจนพอให้ระบบค้นหาเข้าใจและนำไปประกอบคำตอบ", "เช่น หน้า FAQ ที่ระบุว่าสปามีบริการอะไร ใช้เวลานานเท่าไร อยู่ที่ไหน และจองอย่างไร"],
      ["Local SEO", "ข้อมูลธุรกิจบน Google Search และ Maps", "เช่น โปรไฟล์คาเฟ่ที่มีเวลาเปิด เมนู รูปจริง รีวิว และปุ่มนำทาง"],
    ],
    compareClose: HOTEL_SEO_COMPARE_STATEMENT.th,
    problemTitle: "ธุรกิจของคุณกำลังเจอปัญหาเหล่านี้หรือไม่?",
    problems: [
      "มีเว็บไซต์ แต่ค้นหาบริการหรือทำเลที่เกี่ยวข้องแล้วไม่พบหน้าเว็บ",
      "ลูกค้าเห็นธุรกิจบน Maps แต่เวลาเปิด เบอร์โทร รูปภาพ หรือบริการไม่เป็นปัจจุบัน",
      "มีคนเข้าชมเว็บไซต์ แต่หาคำตอบเรื่องราคา บริการ ทำเล หรือวิธีจองไม่เจอ",
      "รีวิวมีอยู่แล้ว แต่ทีมยังไม่ได้ดูประเด็นที่ลูกค้าชื่นชมหรือร้องเรียนเพื่อนำมาปรับข้อมูลธุรกิจ",
      "ไม่ทราบว่าลูกค้าค้นพบธุรกิจผ่านคำค้นใด และกดโทร ขอเส้นทาง หรือเข้าเว็บไซต์ต่อมากน้อยแค่ไหน",
    ],
    problemCta: "ให้ทีมช่วยดูจุดที่ควรปรับก่อน",
    helpTitle: "เราช่วยให้ธุรกิจถูกค้นพบ และติดต่อได้อย่างไร?",
    help: [
      ["01", "ทำให้เว็บไซต์ตอบคำถามของลูกค้า", "ดูว่าลูกค้าค้นหาอะไร และจัดหน้าเว็บให้ตอบเรื่องทำเล บริการ ราคา และวิธีจองได้ชัด"],
      ["02", "จัดข้อมูลให้ Search และ AI เข้าใจ", "ปรับโครงสร้างเว็บไซต์ เนื้อหา และข้อมูลธุรกิจให้เชื่อมกัน เพื่อให้ระบบค้นหาเข้าใจธุรกิจได้ง่ายและถูกต้องขึ้น"],
      ["03", "ดูแล Google Business Profile อย่างจริงจัง", "อัปเดตหมวดหมู่ ที่อยู่ เวลาเปิด เว็บไซต์ บริการ รูปภาพ และรีวิว ให้เป็นปัจจุบัน"],
      ["04", "เชื่อมการค้นพบกับการติดต่อและการจอง", "ดูว่าหลังจากค้นพบธุรกิจแล้ว ลูกค้าสามารถโทร ขอเส้นทาง ส่งคำถาม หรือจองต่อได้สะดวกหรือไม่"],
    ],
    gbpTitle: "ทำไม Google Business Profile สำคัญกับสปา คาเฟ่ และธุรกิจหน้าร้าน?",
    gbpBody:
      "ลูกค้าของธุรกิจเหล่านี้มักต้องตัดสินใจเรื่องระยะทาง เวลาเปิด บริการ และความน่าเชื่อถือก่อนเดินทางไปจริง Business Profile แสดงข้อมูลเหล่านี้บน Search และ Maps และ Google มีข้อมูลประสิทธิภาพให้ดู เช่น การเข้าชมโปรไฟล์ การกดโทร การขอเส้นทาง และการคลิกเข้าเว็บไซต์ ทั้งนี้ตัวชี้วัดที่แสดงอาจต่างกันตามประเภทธุรกิจและการตั้งค่าโปรไฟล์",
    gbpSource: "ที่มา: Google Business Profile Help",
    gbpExample:
      "ตัวอย่างเช่น สปาที่มีหน้าบริการนวดคู่แต่ไม่ระบุเวลาให้บริการหรือวิธีจอง อาจเสียลูกค้าในขั้นตัดสินใจ ส่วนคาเฟ่ที่เวลาเปิดบน Maps ไม่ตรงกับเวลาจริง อาจทำให้ลูกค้าเดินทางมาเสียเที่ยว เรื่องเล็กบนหน้าจอจึงกลายเป็นประสบการณ์จริงของลูกค้า",
    methodTitle: "เราเริ่มจากข้อมูลจริงของธุรกิจอย่างไร?",
    steps: [
      ["01", "ดูการค้นพบปัจจุบัน", "ตรวจเว็บไซต์ Google Search Console และ Google Business Profile ดูว่าธุรกิจมีข้อมูลอะไรอยู่แล้ว และมีสิทธิ์เข้าถึงระบบใดบ้าง"],
      ["02", "ตรวจข้อมูลที่ลูกค้าใช้ตัดสินใจ", "ดูบริการ ทำเล ราคา เวลาเปิด รูปภาพ รีวิว และช่องทางติดต่อหรือจอง"],
      ["03", "จัดลำดับสิ่งที่ต้องแก้", "แยก Quick Wins ออกจากงานเนื้อหา เว็บไซต์ และข้อมูลที่ต้องทำต่อเนื่อง"],
      ["04", "ติดตามการเปลี่ยนแปลง", "ดูการค้นพบ การเข้าชมเว็บไซต์ การโทร ขอเส้นทาง และการสอบถามหรือจองที่ตรวจสอบได้"],
    ],
    measureTitle: "วัดผลอะไรได้บ้าง?",
    measureWeb: "สำหรับเว็บไซต์ เราดูการแสดงผลและการคลิกจากการค้นหา หน้าเว็บที่ลูกค้าเข้าชม และการกระทำหลังเข้าชม",
    measureMaps:
      "สำหรับ Google Business Profile เราดูข้อมูลที่ระบบแสดงให้ธุรกิจนั้น เช่น การค้นพบโปรไฟล์ การคลิกเว็บไซต์ การกดโทร และการขอเส้นทาง หากมีระบบจองที่เชื่อมต่อและติดตามได้ จึงค่อยพิจารณาข้อมูลการจองร่วมด้วย",
    measureNote:
      "เราไม่รับประกันอันดับบน Google Maps หรือการถูกอ้างอิงในคำตอบ AI เป้าหมายคือทำให้ข้อมูลธุรกิจถูกต้อง มีประโยชน์ และช่วยให้ทีมเห็นว่าการค้นพบเชื่อมไปสู่ลูกค้าจริงอย่างไร",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับการค้นหา เว็บไซต์ และการจอง",
    details: "ดูรายละเอียด",
    toolName: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
    toolBody: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าจาก Search หรือ Maps หาข้อมูลและเดินทางไปสอบถามหรือจองต่อหรือไม่",
    toolCta: "ใช้เครื่องมือฟรี",
    reviewName: "สร้างลิงก์รีวิว Google",
    reviewBody: "สร้างลิงก์ที่พาลูกค้าไปยังหน้าส่งรีวิว เพื่อให้ขั้นตอนการขอรีวิวสะดวกและตรงจุดมากขึ้น",
    reviewCta: "ใช้เครื่องมือฟรี",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "SEO, Google Maps & AI Search",
    title: "Help customers find the business, see why it fits, and contact you at once",
    lead: "People no longer search only the hotel or shop name. They may ask for “a couples massage spa near me”, “a quiet café in Phuket”, or “a hotel near the airport with late check-in”, then read an AI answer, open Google Maps, check reviews, and compare the website before they decide.",
    leadClose:
      "Search visibility starts with clear, consistent business facts. Google Maps and the website must support the same decision. Search and AI answers should open a useful page, then connect to contact or booking where that path can be measured.",
    cta: "Ask the team to review how customers find this business",
    secondary: "All solutions",
    underCta: "Send the business name, a website or Google Maps link, and the issue you see.",
    photoAlt: "A customer searching for a travel or local service on Google before making contact",
    changeTitle: "Search behaviour is changing",
    aiTitle: "AI Search now works in Thai",
    aiBody:
      "Google launched AI Mode in Thailand in August 2025 and added Thai-language support in October 2025. People can ask longer questions, compare options, and follow up inside Google Search.",
    aiSource: "Source: blog.google",
    growthTitle: "AI Search use is growing worldwide",
    growthStat: "1 billion",
    growthLabel: "monthly AI Mode users worldwide, according to Google in 2026",
    growthNote: "This figure shows growth in the search format. It is not the number of users in Thailand.",
    growthSource: "Source: blog.google",
    mapsTitle: "Google Maps still matters for local decisions",
    mapsBody:
      "Google says local business results consider three main factors: relevance, distance, and prominence. A complete, accurate Business Profile helps customers see what the place does, where it is, and when it is open.",
    mapsSource: "Source: Google Business Profile Help",
    changeClose:
      "For hotels, spas, and cafés this means the website and Google Maps have to answer the same questions clearly: the service, the location, the price, the hours, and how to book.",
    aiNote:
      "The usual SEO work still applies to AI Overviews and AI Mode. There is no special method that guarantees a business will appear in every AI answer or AI Overview. Visibility varies by query, location, language, user context, source quality, and search-system changes.",
    aiNoteSource: "Source: Google Search Central",
    compareTitle: "How do SEO, AEO, and Local SEO differ?",
    compare: [
      ["SEO", "Website pages that answer the search", "For example, a page for “hotels near Phuket airport” with rooms, how to get there, and how to book."],
      ["AEO / AI Search readiness", "Clear facts a search system can understand and use in an answer", "For example, an FAQ that says what the spa offers, how long it takes, where it is, and how to book."],
      ["Local SEO", "Business information on Google Search and Maps", "For example, a café profile with hours, menu, real photos, reviews, and a directions button."],
    ],
    compareClose: HOTEL_SEO_COMPARE_STATEMENT.en,
    problemTitle: "Does any of this sound like the business now?",
    problems: [
      "There is a website, but a search for the service or the area does not find the page",
      "Customers see the business on Maps, but the hours, phone, photos, or services are out of date",
      "People visit the website and still cannot find the price, service, location, or how to book",
      "Reviews already exist, but the team has not used what customers praise or complain about to correct the business information",
      "It is unclear which searches find the business, and how many then call, ask for directions, or open the website",
    ],
    problemCta: "Ask the team to look at what to fix first",
    helpTitle: "What The KPI Plus helps with",
    help: [
      ["01", "Make the website answer the customer’s question", "Look at what people search in the area and at the decision point, then shape pages around that: rooms and location for a hotel, treatment types for a spa, or menu and atmosphere for a café."],
      ["02", "Make the facts clear to Google and other search systems", "Review the site structure, target pages, internal links, business details, and missing content. AI Search work starts from accurate, useful information for a reader, not from adding the word “AI” to a page."],
      ["03", "Look after Google Business Profile in a serious way", "Check the category, address, hours, website link, services or menu, photos, and the facts customers use to decide, plus a simple way to review and reply to reviews from real customers."],
      ["04", "Connect discovery to contact and booking", "Check whether, after the customer finds the business, they can call, get directions, send a question, or book. Being found is only the start."],
    ],
    gbpTitle: "Why Google Business Profile matters for spas, cafés, and storefronts",
    gbpBody:
      "These customers usually decide on distance, opening hours, the service, and trust before they travel. The Business Profile shows those facts on Search and Maps. Google also shows performance such as profile views, calls, direction requests, and website clicks. The measures that appear can differ by business type and profile settings.",
    gbpSource: "Source: Google Business Profile Help",
    gbpExample:
      "A spa page for couples massage that never says when the service is available or how to book can lose the customer at the decision. A café whose Maps hours do not match the real hours can send someone on a wasted trip. A small fact on the screen becomes a real visit.",
    methodTitle: "How the work starts",
    steps: [
      ["01", "See current discovery", "Review the website, Google Search Console, and Google Business Profile as far as the business has access."],
      ["02", "Check the facts customers need", "Look at services, location, price, hours, photos, reviews, and the contact or booking path."],
      ["03", "Set the order of work", "Separate what should be fixed now from content and website work that continues over time."],
      ["04", "Review what changes", "Look at discovery, website visits, calls, direction requests, and enquiries or bookings that can be tracked."],
    ],
    measureTitle: "What can be measured?",
    measureWeb: "On the website we look at search impressions and clicks, the pages people visit, and what they do afterwards.",
    measureMaps:
      "On Google Business Profile we look at the data Google shows that business, such as profile discovery, website clicks, calls, and direction requests. Booking data is added only when a connected booking path can be tracked.",
    measureNote:
      "We do not guarantee a Maps rank or a mention in an AI answer. The aim is accurate, useful business information, and a clearer view of how discovery leads to a real customer.",
    relatedTitle: "Related reading on search, the website, and booking",
    details: "Read more",
    toolName: "Hotel Searchability Check",
    toolBody: "See whether the page is ready for a guest from Search or Maps to find details and continue to an enquiry or booking.",
    toolCta: "Use the free tool",
    reviewName: "Google review link",
    reviewBody: "Give real customers a simple link or QR code so reviews can keep the Maps information current.",
    reviewCta: "Use the free tool",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "SEO, Google Maps и AI Search",
    title: "Пусть клиент найдёт бизнес, поймёт, почему он подходит, и сразу сможет связаться",
    lead: "Люди уже ищут не только название отеля или кафе. Они могут спросить «спа рядом с парным массажем», «тихое кафе на Пхукете» или «отель у аэропорта с поздним заездом», затем читать ответ ИИ, открывать Google Maps, смотреть отзывы и сравнивать сайт.",
    leadClose:
      "The KPI Plus помогает привести сайт и Google Business Profile в порядок: факты должны быть верными, понятными и отвечать на реальные вопросы. Тогда бизнес чаще находят, а дальше звонят, строят маршрут, спрашивают или бронируют.",
    cta: "Попросить команду посмотреть, как находят этот бизнес",
    secondary: "Все решения",
    underCta: "Отправьте название, ссылку на сайт или Google Maps и проблему, которую видите.",
    photoAlt: "Клиент ищет туристический или локальный сервис в Google перед тем, как связаться",
    changeTitle: "Поведение в поиске меняется",
    aiTitle: "AI Search уже работает на тайском",
    aiBody:
      "Google запустил AI Mode в Таиланде в августе 2025 года и добавил поддержку тайского языка в октябре 2025 года. Можно задавать длинные вопросы, сравнивать варианты и уточнять прямо в Google Search.",
    aiSource: "Источник: blog.google",
    growthTitle: "Использование AI Search растёт в мире",
    growthStat: "1 млрд",
    growthLabel: "пользователей AI Mode в месяц по всему миру, по данным Google за 2026 год",
    growthNote: "Эта цифра показывает рост формата поиска. Это не число пользователей в Таиланде.",
    growthSource: "Источник: blog.google",
    mapsTitle: "Google Maps по-прежнему важен для решения на месте",
    mapsBody:
      "Google указывает три главных фактора локальной выдачи: релевантность, расстояние и известность. Полный и точный Business Profile помогает понять, чем занимается место, где оно и когда открыто.",
    mapsSource: "Источник: Google Business Profile Help",
    changeClose:
      "Для отелей, спа и кафе это значит: сайт и Google Maps должны ясно отвечать на одни и те же вопросы — услуга, адрес, цена, часы и способ брони.",
    aiNote:
      "Обычная работа по SEO по-прежнему относится к AI Overviews и AI Mode. Нет особого способа, который гарантирует появление бизнеса в ответе ИИ.",
    aiNoteSource: "Источник: Google Search Central",
    compareTitle: "Чем SEO, AEO и Local SEO отличаются?",
    compare: [
      ["SEO", "Страницы сайта, которые отвечают на запрос", "Например, страница «отели у аэропорта Пхукета» с номерами, дорогой и способом брони."],
      ["AEO / готовность к AI Search", "Ясные факты, которые система поиска может понять и использовать в ответе", "Например, FAQ: какие услуги в спа, сколько длятся, где находится и как забронировать."],
      ["Local SEO", "Данные бизнеса в Google Search и Maps", "Например, профиль кафе с часами, меню, живыми фото, отзывами и кнопкой маршрута."],
    ],
    compareClose:
      "Все три части должны опираться на одни и те же факты. Если часы в Maps не совпадают с сайтом или на сайте есть услуга, которой уже нет, клиент ошибётся или потеряет доверие.",
    problemTitle: "Похоже ли это на ваш бизнес сейчас?",
    problems: [
      "Сайт есть, но поиск услуги или района его не находит",
      "Клиенты видят бизнес в Maps, но часы, телефон, фото или услуги устарели",
      "Люди заходят на сайт и всё равно не находят цену, услугу, адрес или способ брони",
      "Отзывы уже есть, но команда не использует похвалу и жалобы, чтобы поправить данные бизнеса",
      "Неясно, какие запросы находят бизнес и сколько потом звонят, строят маршрут или открывают сайт",
    ],
    problemCta: "Попросить команду посмотреть, что чинить сначала",
    helpTitle: "Чем помогает The KPI Plus",
    help: [
      ["01", "Сделать так, чтобы сайт отвечал на вопрос клиента", "Посмотреть, что ищут в районе и в момент решения, затем собрать страницы вокруг этого: номера и локация для отеля, виды процедур для спа, меню и атмосфера для кафе."],
      ["02", "Сделать факты понятными Google и другим системам поиска", "Проверить структуру сайта, целевые страницы, связи между страницами, данные бизнеса и пробелы в содержании. Работа для AI Search начинается с точной и полезной информации для человека, а не со слова «AI» на странице."],
      ["03", "Серьёзно вести Google Business Profile", "Проверить категорию, адрес, часы, ссылку на сайт, услуги или меню, фото и факты, по которым клиент решает, плюс простой способ смотреть и отвечать на отзывы реальных гостей."],
      ["04", "Связать находку с контактом и бронью", "Проверить, может ли клиент после нахождения бизнеса позвонить, построить маршрут, задать вопрос или забронировать. Быть найденным — только начало."],
    ],
    gbpTitle: "Почему Google Business Profile важен для спа, кафе и точек с адресом",
    gbpBody:
      "Таким клиентам обычно нужно понять расстояние, часы, услугу и доверие до поездки. Business Profile показывает эти факты в Search и Maps. Google также показывает просмотры профиля, звонки, запросы маршрута и клики на сайт. Набор метрик может отличаться по типу бизнеса и настройкам профиля.",
    gbpSource: "Источник: Google Business Profile Help",
    gbpExample:
      "Страница спа про парный массаж без часов и способа брони теряет клиента на решении. Кафе, чьи часы в Maps не совпадают с реальными, отправляет человека впустую. Мелкий факт на экране становится реальной поездкой.",
    methodTitle: "С чего начинается работа",
    steps: [
      ["01", "Посмотреть текущее обнаружение", "Проверить сайт, Google Search Console и Google Business Profile в пределах доступа бизнеса."],
      ["02", "Проверить факты для решения", "Услуги, адрес, цена, часы, фото, отзывы и путь к контакту или брони."],
      ["03", "Выстроить порядок работ", "Отделить то, что чинить сразу, от контента и сайта, которые ведутся дальше."],
      ["04", "Смотреть, что меняется", "Обнаружение, визиты на сайт, звонки, маршруты и вопросы или брони, которые можно отследить."],
    ],
    measureTitle: "Что можно измерить?",
    measureWeb: "На сайте смотрим показы и клики из поиска, какие страницы открывают и что делают дальше.",
    measureMaps:
      "В Google Business Profile смотрим данные, которые Google показывает этому бизнесу: находку профиля, клики на сайт, звонки и маршруты. Данные о бронях добавляем, только если путь бронирования подключён и его можно отследить.",
    measureNote:
      "Мы не гарантируем место в Maps и упоминание в ответе ИИ. Цель — точные полезные данные и более ясная связь между находкой и реальным клиентом.",
    relatedTitle: "Материалы про поиск, сайт и бронирование",
    details: "Подробнее",
    toolName: "Проверка поисковой готовности сайта отеля",
    toolBody: "Понять, сможет ли гость из Search или Maps найти информацию и перейти к вопросу или брони.",
    toolCta: "Использовать бесплатный инструмент",
    reviewName: "Ссылка на отзыв Google",
    reviewBody: "Дать реальным клиентам простую ссылку или QR, чтобы отзывы поддерживали данные в Maps.",
    reviewCta: "Использовать бесплатный инструмент",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "SEO、Google Maps 與 AI Search",
    title: "讓客人找到你的生意，看懂為什麼適合，並能立刻聯繫",
    lead: "客人已不只搜尋飯店或店名。他們可能會問「附近有雙人按摩的 spa」「普吉安靜的咖啡店」或「靠近機場、可晚入住的飯店」，再看 AI 答案、打開 Google Maps、讀評論，並比較網站後才決定。",
    leadClose:
      "The KPI Plus 協助把網站與 Google Business Profile 的資料整理正確、清楚，並回應客人真正會問的事，讓生意比較容易被找到，接著走到打電話、要路線、詢問或預訂。",
    cta: "請團隊看客人如何找到你的生意",
    secondary: "查看全部方案",
    underCta: "留下店名、網站或 Google Maps 連結，以及目前遇到的問題。",
    photoAlt: "客人在 Google 上搜尋旅遊或在地服務後再決定聯繫",
    changeTitle: "搜尋行為正在改變",
    aiTitle: "AI Search 已可用泰語",
    aiBody:
      "Google 於 2025 年 8 月在泰國推出 AI Mode，並於 2025 年 10 月加入泰語支援。使用者可以直接在 Google Search 提出較長的問題、比較選項，並繼續追問。",
    aiSource: "來源：blog.google",
    growthTitle: "AI Search 的使用在全球成長",
    growthStat: "10 億",
    growthLabel: "Google 於 2026 年指出，AI Mode 每月全球使用者",
    growthNote: "這個數字說明搜尋形式在成長，並不是泰國的使用者人數。",
    growthSource: "來源：blog.google",
    mapsTitle: "Google Maps 對在地決定仍然重要",
    mapsBody:
      "Google 指出，在地商家結果主要看三件事：相關性、距離與知名度。完整正確的 Business Profile，能讓客人看懂店做什麼、在哪裡、何時營業。",
    mapsSource: "來源：Google Business Profile Help",
    changeClose:
      "對飯店、spa 與咖啡店來說，網站與 Google Maps 必須清楚回答同一組問題：服務、地點、價格、營業時間，以及如何預訂。",
    aiNote:
      "一般 SEO 做法仍適用於 AI Overviews 與 AI Mode。沒有特殊方法能保證生意會出現在 AI 答案中。",
    aiNoteSource: "來源：Google Search Central",
    compareTitle: "SEO、AEO 與 Local SEO 差在哪裡？",
    compare: [
      ["SEO", "能回應搜尋的網站頁面", "例如「普吉機場附近飯店」頁，說明客房、交通與預訂方式。"],
      ["AEO / AI Search 準備", "清楚到搜尋系統能理解、並可用來組成答案的資料", "例如 FAQ 寫明 spa 有哪些服務、需時多久、在哪裡、如何預訂。"],
      ["Local SEO", "Google Search 與 Maps 上的商家資料", "例如咖啡店資料有營業時間、菜單、實拍、評論與導航按鈕。"],
    ],
    compareClose:
      "三個部分應使用同一套真實資料。若 Maps 營業時間與網站不同，或網站還寫著店家已不再提供的服務，客人可能決定錯誤或失去信任。",
    problemTitle: "你的生意現在是否遇到這些情況？",
    problems: [
      "有網站，但搜尋相關服務或地點時找不到該頁",
      "客人在 Maps 上看得到，但營業時間、電話、照片或服務已過時",
      "有人進站，卻找不到價格、服務、地點或預訂方式",
      "已有評論，但團隊還沒用客人稱讚或抱怨的重點，去修正商家資料",
      "不清楚客人是用哪些搜尋找到生意，以及之後有多少人打電話、要路線或進網站",
    ],
    problemCta: "請團隊先看該調整哪一段",
    helpTitle: "The KPI Plus 能幫什麼？",
    help: [
      ["01", "讓網站回答客人的問題", "先看這個地區、在決定當下客人搜尋什麼，再整理頁面：飯店看客房與地點，spa 看療程種類，咖啡店看菜單與氣氛。"],
      ["02", "讓 Google 與搜尋系統讀得懂資料", "檢查網站結構、目標頁、頁面之間的連結、商家資料，以及還缺的內容。AI Search 的工作從對讀者正確、有用的資料開始，不是在網頁多寫「AI」。"],
      ["03", "認真照顧 Google Business Profile", "檢查類別、地址、營業時間、網站連結、服務或菜單、照片，以及客人用來決定的資料，並訂出依事實查看與回覆評論的做法。"],
      ["04", "把被找到接到聯繫與預訂", "檢查客人找到之後，能否打電話、要路線、發問或預訂。被找到只是起點。"],
    ],
    gbpTitle: "為什麼 spa、咖啡店與有店面的生意需要 Google Business Profile？",
    gbpBody:
      "這類客人通常會先看距離、營業時間、服務與可信度，才決定出門。Business Profile 會在 Search 與 Maps 顯示這些資料。Google 也提供成效，例如資料瀏覽、來電、路線請求與網站點擊。實際出現哪些指標，會依事業類型與資料設定而不同。",
    gbpSource: "來源：Google Business Profile Help",
    gbpExample:
      "spa 有雙人按摩頁，卻沒寫可服務時段或預訂方式，可能在決定當下流失客人。咖啡店的 Maps 時間與實際不符，可能讓客人白跑一趟。螢幕上的小事，會變成客人真實的體驗。",
    methodTitle: "我們如何開始？",
    steps: [
      ["01", "先看現在如何被找到", "在事業有權限的範圍內，檢查網站、Google Search Console 與 Google Business Profile。"],
      ["02", "檢查客人做決定需要的資料", "看服務、地點、價格、營業時間、照片、評論，以及聯繫或預訂管道。"],
      ["03", "排出工作順序", "把該立刻修正的項目，和需要持續做的內容與網站工作分開。"],
      ["04", "追蹤變化", "看被找到的情況、網站瀏覽、來電、路線請求，以及能追蹤的詢問或預訂。"],
    ],
    measureTitle: "能量到什麼？",
    measureWeb: "網站方面，我們看搜尋曝光與點擊、客人進入哪些頁，以及進站後做了什麼。",
    measureMaps:
      "Google Business Profile 方面，我們看系統顯示給該事業的資料，例如資料被找到、網站點擊、來電與路線請求。若預訂系統已連接且可追蹤，才一併看預訂資料。",
    measureNote:
      "我們不保證 Google Maps 排名，也不保證會被 AI 答案引用。目標是讓商家資料正確、有用，並讓團隊看清「被找到」如何接到真實客人。",
    relatedTitle: "與搜尋、網站與預訂相關的內容",
    details: "查看詳情",
    toolName: "飯店網站搜尋健康檢查",
    toolBody: "看從 Search 或 Maps 進來的客人，是否找得到資料並能繼續詢問或預訂。",
    toolCta: "使用免費工具",
    reviewName: "建立 Google 評論連結",
    reviewBody: "讓真實客人用簡單連結或 QR 寫評論，持續照顧 Maps 上的資料。",
    reviewCta: "使用免費工具",
  },
} as const;

export async function SeoLocalView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsHotelSeoPage | null;
  embedded?: boolean;
}) {
  const cms = await resolveHotelSeoPage(locale, previewContent).catch(() => null);
  const fromCms = Boolean(cms?.fromCms);
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const useCmsCopy = fromCms && (locale === "th" || !looksThai(cms?.hero.title || cms?.hero.description || ""));
  const relatedCards =
    useCmsCopy && cms?.related.cards.length ? relatedFromCms(cms.related.cards) : hotelSeoRelatedCards(locale);
  const faqItems =
    cms?.faqs?.length && !hotelSeoFaqsAreStale(cms.faqs)
      ? cms.faqs.map(({ q, a }) => ({ q, a }))
      : hotelSeoFaqs(locale === "th" ? "th" : "en");
  const aiMode = cms?.search.aiModeSource;
  const growth = cms?.search.growthSource;
  const maps = cms?.search.mapsSource;
  const aiNote = cms?.search.aiNoteSource;
  const gbpSource = cms?.gbp.source;
  const dummyHero = hotelSeoHeroVisualUrl();
  const cmsHeroSrc = visualReady(cms?.hero.visual.src, cms?.hero.visual.status);
  const genericHeroSrc = /kpi-grow-demand|the-kpi-plus-revenue-scene|person-with-phone/i.test(cmsHeroSrc);
  const dummyBehavior = hotelSeoBehaviorVisualUrl();
  const dummyAudit = hotelSeoAuditVisualUrl();
  const dummyCompare = hotelSeoCompareVisualUrl();
  const dummyFlow = hotelSeoFlowVisualUrl();
  const dummyGbp = hotelSeoGbpVisualUrl();
  const dummyProcess = hotelSeoProcessVisualUrl();
  const dummyKpi = hotelSeoKpiVisualUrl();
  const dummyRelated = hotelSeoRelatedVisualUrl();
  const blockedHero = new Set(
    [
      dummyHero,
      dummyBehavior,
      dummyAudit,
      dummyCompare,
      dummyFlow,
      dummyGbp,
      dummyProcess,
      dummyKpi,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
      HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
      HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
      HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
      HOTEL_SEO_KPI_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      cms?.search.visual.src,
      cms?.problems.visual.src,
      cms?.gbp.visual.src,
      "",
    ].filter(Boolean) as string[],
  );
  const uniqueHeroSrc = cmsHeroSrc && !genericHeroSrc && !blockedHero.has(cmsHeroSrc) ? cmsHeroSrc : "";
  const heroSrc = uniqueHeroSrc || dummyHero || "";
  const cmsBehaviorSrc = cms?.search.visual.src?.trim() || "";
  const blockedBehavior = new Set(
    [
      heroSrc,
      dummyHero,
      dummyBehavior,
      dummyAudit,
      dummyCompare,
      dummyFlow,
      dummyGbp,
      dummyProcess,
      dummyKpi,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
      HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
      HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
      HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
      HOTEL_SEO_KPI_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      "",
    ].filter(Boolean) as string[],
  );
  const uniqueBehaviorSrc =
    visualReady(cmsBehaviorSrc, cms?.search.visual.status) && !blockedBehavior.has(cmsBehaviorSrc) ? cmsBehaviorSrc : "";
  const behaviorSrc = uniqueBehaviorSrc || dummyBehavior || "";
  const cmsAuditSrc = cms?.problems.visual.src?.trim() || "";
  const genericAuditSrc = /kpi-grow-demand|person-with-phone|the-kpi-plus-revenue-scene/i.test(cmsAuditSrc);
  const blockedAudit = new Set(
    [
      heroSrc,
      behaviorSrc,
      dummyHero,
      dummyBehavior,
      dummyAudit,
      dummyCompare,
      dummyFlow,
      dummyGbp,
      dummyProcess,
      dummyKpi,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
      HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
      HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
      HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
      HOTEL_SEO_KPI_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      "",
    ].filter(Boolean) as string[],
  );
  const uniqueAuditSrc =
    visualReady(cmsAuditSrc, cms?.problems.visual.status) && !genericAuditSrc && !blockedAudit.has(cmsAuditSrc)
      ? cmsAuditSrc
      : "";
  const auditSrc = uniqueAuditSrc || dummyAudit || "";
  const cmsCompareSrc = visualReady(cms?.compare.visual.src, cms?.compare.visual.status);
  const comparePermission = !cms?.compare.visual.containsGoogleBrand || Boolean(cms?.compare.visual.brandNote?.trim());
  const compareSrc =
    cmsCompareSrc && cmsCompareSrc !== dummyCompare && cmsCompareSrc !== HOTEL_SEO_COMPARE_VISUAL_CANDIDATE && comparePermission
      ? cmsCompareSrc
      : "";
  const cmsFlowSrc = visualReady(cms?.help.visual.src, cms?.help.visual.status);
  const flowPermission = !cms?.help.visual.containsGoogleBrand || Boolean(cms?.help.visual.brandNote?.trim());
  const flowSrc =
    cmsFlowSrc && cmsFlowSrc !== dummyFlow && cmsFlowSrc !== HOTEL_SEO_FLOW_VISUAL_CANDIDATE && flowPermission ? cmsFlowSrc : "";
  const cmsProcessSrc = visualReady(cms?.method.visual.src, cms?.method.visual.status);
  const processSrc =
    cmsProcessSrc && cmsProcessSrc !== dummyProcess && cmsProcessSrc !== HOTEL_SEO_PROCESS_VISUAL_CANDIDATE ? cmsProcessSrc : "";
  const cmsGbpSrc = cms?.gbp.visual.src?.trim() || "";
  const genericGbpSrc = /kpi-grow-demand|person-with-phone|the-kpi-plus-revenue-scene/i.test(cmsGbpSrc);
  const gbpPermission = !cms?.gbp.visual.containsGoogleBrand || Boolean(cms?.gbp.visual.brandNote?.trim());
  const blockedGbp = new Set(
    [
      heroSrc,
      behaviorSrc,
      auditSrc,
      dummyHero,
      dummyBehavior,
      dummyAudit,
      dummyCompare,
      dummyFlow,
      dummyGbp,
      dummyProcess,
      dummyKpi,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
      HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
      HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
      HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
      HOTEL_SEO_KPI_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      "",
    ].filter(Boolean) as string[],
  );
  const gbpSrc =
    visualReady(cmsGbpSrc, cms?.gbp.visual.status) && !genericGbpSrc && !blockedGbp.has(cmsGbpSrc) && gbpPermission
      ? cmsGbpSrc
      : "";
  const cmsKpiSrc = cms?.measure.visual.src?.trim() || "";
  const genericKpiSrc = /kpi-grow-demand|person-with-phone|the-kpi-plus-revenue-scene|hotel-seo-outcomes-kpi-placeholder/i.test(cmsKpiSrc);
  const blockedKpi = new Set(
    [
      heroSrc,
      behaviorSrc,
      auditSrc,
      gbpSrc,
      dummyHero,
      dummyBehavior,
      dummyAudit,
      dummyCompare,
      dummyFlow,
      dummyGbp,
      dummyProcess,
      dummyKpi,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
      HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
      HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
      HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
      HOTEL_SEO_KPI_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      "",
    ].filter(Boolean) as string[],
  );
  const kpiSrc =
    visualReady(cmsKpiSrc, cms?.measure.visual.status) && !genericKpiSrc && !blockedKpi.has(cmsKpiSrc) ? cmsKpiSrc : "";
  const cmsRelatedSrc = cms?.related.visual.src?.trim() || "";
  const genericRelatedSrc =
    /kpi-grow-demand|person-with-phone|the-kpi-plus-revenue-scene|hotel-seo-local-search-hero|hotel-seo-google-business-profile|hotel-seo-related-content-placeholder|hotel-seo-outcomes-kpi|hotel-seo-audit-process/i.test(
      cmsRelatedSrc,
    );
  const blockedRelated = new Set(
    [
      heroSrc,
      behaviorSrc,
      auditSrc,
      gbpSrc,
      dummyHero,
      dummyBehavior,
      dummyAudit,
      dummyCompare,
      dummyFlow,
      dummyGbp,
      dummyProcess,
      dummyKpi,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
      HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
      HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
      HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
      HOTEL_SEO_KPI_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      "",
    ].filter(Boolean) as string[],
  );
  const relatedSrc =
    visualReady(cmsRelatedSrc, cms?.related.visual.status) && !genericRelatedSrc && !blockedRelated.has(cmsRelatedSrc)
      ? cmsRelatedSrc
      : "";
  const cmsFormSrc = cms?.form.visual.src?.trim() || "";
  const genericFormSrc = /kpi-grow-demand|person-with-phone|the-kpi-plus-revenue-scene|hotel-seo-local-search-hero|hotel-seo-google-business-profile/i.test(
    cmsFormSrc,
  );
  const blockedForm = new Set(
    [
      heroSrc,
      gbpSrc,
      dummyHero,
      dummyGbp,
      dummyRelated,
      HOTEL_SEO_HERO_VISUAL_CANDIDATE,
      HOTEL_SEO_GBP_VISUAL_CANDIDATE,
      HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
      "",
    ].filter(Boolean) as string[],
  );
  const formPhotoSrc =
    visualReady(cmsFormSrc, cms?.form.visual.status) && !genericFormSrc && !blockedForm.has(cmsFormSrc) ? cmsFormSrc : "";
  const defaultHeroPoints =
    locale === "th"
      ? [
          "การถูกค้นพบเริ่มจากข้อมูลธุรกิจที่ชัดและสอดคล้องกัน",
          "ข้อมูลบน Google Maps และเว็บไซต์ต้องรองรับการตัดสินใจชุดเดียวกัน",
          "คำตอบจาก Search และ AI ควรพาไปหน้าธุรกิจที่มีประโยชน์",
          "เส้นทางสุดท้ายเชื่อมไปสู่การติดต่อหรือจองที่วัดผลได้",
        ]
      : [
          "Search visibility starts with clear and consistent business information",
          "Google Maps and the website must support the same customer decision",
          "Search and AI answers should lead to a useful business page",
          "The path should connect to contact or booking where it can be measured",
        ];
  const heroPoints = cmsList(useCmsCopy, locale, cms?.hero.points, defaultHeroPoints);
  const heroTitle = cmsText(useCmsCopy, locale, cms?.hero.title, locale === "th" ? "" : t.title);
  const heroLead = cmsText(useCmsCopy, locale, cms?.hero.description, locale === "th" ? "" : t.lead);
  const heroCta = cmsText(useCmsCopy, locale, cms?.hero.primaryCta.label, t.cta);
  const heroCtaHref = cms?.hero.primaryCta.href.trim() || "#search-enquiry";
  const heroSecondary = cmsText(useCmsCopy, locale, cms?.hero.secondaryCta.label, t.secondary);
  const heroSecondaryHref = cms?.hero.secondaryCta.href.trim() || solutions;
  const heroUnder = cmsText(useCmsCopy, locale, cms?.hero.underCta, locale === "th" ? "" : t.underCta);
  const heroEyebrow = cmsText(useCmsCopy, locale, cms?.hero.eyebrow, locale === "th" ? "Search Visibility & Local Discovery" : t.eyebrow);
  const compareRows = useCmsRows(useCmsCopy, locale, cms?.compare.rows[0]?.area, cms?.compare.rows.length || 0)
    ? cms!.compare.rows
    : undefined;
  const problemRows = useCmsRows(useCmsCopy, locale, cms?.problems.items[0]?.problem, cms?.problems.items.length || 0)
    ? cms!.problems.items
    : undefined;
  const helpSteps = useCmsRows(useCmsCopy, locale, cms?.help.steps[0]?.title, cms?.help.steps.length || 0)
    ? cms!.help.steps
    : undefined;
  const flowStages = useCmsRows(useCmsCopy, locale, cms?.help.stages[0]?.label, cms?.help.stages.length || 0)
    ? cms!.help.stages
    : undefined;
  const processSteps = useCmsRows(useCmsCopy, locale, cms?.method.steps[0]?.title, cms?.method.steps.length || 0)
    ? cms!.method.steps
    : undefined;
  const behaviorTypes = useCmsRows(useCmsCopy, locale, cms?.search.types[0]?.title, cms?.search.types.length || 0)
    ? cms!.search.types
    : undefined;
  const behaviorMap = cmsList(useCmsCopy, locale, cms?.search.map, []);
  const gbpFields = useCmsRows(useCmsCopy, locale, cms?.gbp.fields[0]?.label, cms?.gbp.fields.length || 0)
    ? cms!.gbp.fields
    : undefined;
  const gbpActions = useCmsRows(useCmsCopy, locale, cms?.gbp.actions[0]?.label || cms?.gbp.actions[0]?.name, cms?.gbp.actions.length || 0)
    ? cms!.gbp.actions
    : undefined;
  const listingRows = useCmsRows(useCmsCopy, locale, cms?.consistency.listing[0]?.area, cms?.consistency.listing.length || 0)
    ? cms!.consistency.listing
    : undefined;
  const gscRows = useCmsRows(useCmsCopy, locale, cms?.consistency.gsc[0]?.area, cms?.consistency.gsc.length || 0)
    ? cms!.consistency.gsc
    : undefined;
  const kpiChart = cms?.measure.kpis.find((kpi) => kpi.labels.length && kpi.values.length);
  const inner = (
    <>
      <section className="kpi-hero kpi-home-hero-section kpi-seo-local-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-seo-local-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-seo-google-maps-ai-search", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{heroEyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {heroTitle ? (
                  heroTitle
                ) : locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">
                      ให้ลูกค้า<span className="kpi-home-accent">ค้นพบธุรกิจของคุณ</span>
                    </span>
                    <span className="kpi-home-h1-rest">เข้าใจว่าคุณเหมาะกับเขา และติดต่อได้ทันที</span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              {heroLead ? (
                <p className="kpi-lead kpi-home-lead">{heroLead}</p>
              ) : locale === "th" ? (
                <p className="kpi-lead kpi-home-lead">
                  <span className="kpi-seo-local-lead-line">
                    วันนี้ลูกค้าไม่ได้ค้นหาแค่ชื่อโรงแรมหรือร้าน แต่ค้นหาด้วยความต้องการ เช่น “สปาใกล้ฉันที่มีนวดคู่” หรือ “โรงแรมใกล้สนามบินที่เช็กอินดึกได้”
                  </span>
                </p>
              ) : (
                <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              )}
              {locale === "th" || locale === "en" ? (
                <ul className="kpi-seo-local-hero-points">
                  {heroPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="kpi-seo-local-lead-close">{t.leadClose}</p>
              )}
              <div className="kpi-actions">
                <a href={heroCtaHref} className="kpi-button">
                  {heroCta} <span aria-hidden="true">↗</span>
                </a>
                <Link href={heroSecondaryHref} className="kpi-button-ghost">
                  {heroSecondary}
                </Link>
              </div>
              <p className="kpi-seo-local-hero-note">
                {heroUnder ? (
                  heroUnder
                ) : locale === "th" ? (
                  <>
                    ส่งชื่อธุรกิจ เว็บไซต์หรือ <span className="kpi-latin">Google Maps</span>
                    <span className="kpi-seo-local-hero-note-br"> </span>
                    และปัญหาที่พบ
                  </>
                ) : (
                  t.underCta
                )}
              </p>
              <p className="kpi-home-trust kpi-seo-local-journey">
                {(
                  [
                    ["01", "Search"],
                    ["02", "Maps"],
                    ["03", "Website"],
                    ["04", "Contact / Booking"],
                  ] as const
                ).map(([num, step]) => (
                  <span key={step}>
                    <span className="kpi-latin">
                      {num} {step}
                    </span>
                  </span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-meta-ads-hero-visual">
              <HotelSeoHeroVisual
                locale={locale}
                src={heroSrc}
                status={cms?.hero.visual.status || "sample"}
                alt={locale === "th" ? cms?.hero.visual.altTh || HOTEL_SEO_HERO_VISUAL.alt.th : cms?.hero.visual.altEn || HOTEL_SEO_HERO_VISUAL.alt.en}
                label={cms?.hero.visual.label || (locale === "th" ? HOTEL_SEO_HERO_VISUAL.label.th : HOTEL_SEO_HERO_VISUAL.label.en)}
                caption={cms?.hero.visual.caption || (locale === "th" ? HOTEL_SEO_HERO_VISUAL.caption.th : HOTEL_SEO_HERO_VISUAL.caption.en)}
                meta={locale === "th" ? HOTEL_SEO_HERO_VISUAL.meta.th : HOTEL_SEO_HERO_VISUAL.meta.en}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-seo-local-change">
        <p className="kpi-latin kpi-seo-local-change-eyebrow">Search Behavior</p>
        <h2 className="kpi-h2">{cmsText(useCmsCopy, locale, cms?.search.title, t.changeTitle)}</h2>
        <p className="kpi-seo-local-change-intro">
          {cmsText(
            useCmsCopy,
            locale,
            cms?.search.intro,
            locale === "th"
              ? "วันนี้ลูกค้าเริ่มจากคำถาม แล้วอาจใช้ Traditional Search, AI Search, Google Maps หรือเปิดเว็บไซต์ก่อนโทร ขอเส้นทาง ติดต่อ หรือจอง"
              : "Customers start with a question, then may use Traditional Search, AI Search, Google Maps, or the website before they call, get directions, contact, or book.",
          )}
        </p>
        <div className="kpi-seo-local-change-split">
          <div className="kpi-seo-local-change-copy">
            <ul className="kpi-seo-local-change-types">
              {(behaviorTypes
                ? behaviorTypes
                : HOTEL_SEO_BEHAVIOR_TYPES.map((type) => ({
                    id: type.id,
                    num: type.num,
                    title: locale === "th" ? type.titleTh : type.titleEn,
                    body: locale === "th" ? type.bodyTh : type.bodyEn,
                    order: 0,
                  }))
              ).map((type) => (
                <li key={type.id}>
                  <span className="kpi-latin">{type.num}</span>
                  <h3>{type.title}</h3>
                  <p>{type.body}</p>
                </li>
              ))}
            </ul>
            <div className="kpi-seo-local-behavior-map-wrap">
              <p className="kpi-latin kpi-seo-local-change-eyebrow">Search Behavior Map</p>
              <ol className="kpi-seo-local-behavior-map">
                {(behaviorMap.length
                  ? behaviorMap.map((step, index) => ({ id: `map-${index}`, label: step }))
                  : HOTEL_SEO_BEHAVIOR_MAP.map((step) => ({ id: step.id, label: locale === "th" ? step.th : step.en }))
                ).map((step) => (
                  <li key={step.id}>
                    <span>{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="kpi-seo-local-change-visual">
            <HotelSeoSearchBehaviorVisual
              locale={locale}
              src={behaviorSrc}
              status={cms?.search.visual.status || "sample"}
              alt={locale === "th" ? cms?.search.visual.altTh || HOTEL_SEO_BEHAVIOR_VISUAL.alt.th : cms?.search.visual.altEn || HOTEL_SEO_BEHAVIOR_VISUAL.alt.en}
              label={cms?.search.visual.label || (locale === "th" ? HOTEL_SEO_BEHAVIOR_VISUAL.label.th : HOTEL_SEO_BEHAVIOR_VISUAL.label.en)}
              caption={cms?.search.visual.caption || (locale === "th" ? HOTEL_SEO_BEHAVIOR_VISUAL.caption.th : HOTEL_SEO_BEHAVIOR_VISUAL.caption.en)}
              meta={locale === "th" ? HOTEL_SEO_BEHAVIOR_VISUAL.meta.th : HOTEL_SEO_BEHAVIOR_VISUAL.meta.en}
            />
          </div>
        </div>
        <div className="kpi-seo-local-change-evidence">
          <article className="kpi-seo-local-change-featured">
            <h3>
              {cmsText(
                useCmsCopy,
                locale,
                cms?.search.aiTitle,
                locale === "th" ? "" : t.aiTitle,
              ) ||
                (locale === "th" ? (
                  <>
                    <span className="kpi-latin">AI Search</span> ใช้ภาษาไทยได้แล้ว
                  </>
                ) : (
                  t.aiTitle
                ))}
            </h3>
            {cmsText(useCmsCopy, locale, cms?.search.aiBody, locale === "th" ? "" : t.aiBody) ? (
              <p className="kpi-seo-local-change-body">{cmsText(useCmsCopy, locale, cms?.search.aiBody, t.aiBody)}</p>
            ) : locale === "th" ? (
              <div className="kpi-seo-local-change-body">
                <p>
                  <span className="kpi-latin">Google</span> เปิด <span className="kpi-latin">AI Mode</span> ในประเทศไทยเมื่อเดือนสิงหาคม 2025
                  และเพิ่มการรองรับภาษาไทยในเดือนตุลาคม 2025
                </p>
                <p>ผู้ใช้สามารถถามคำถามยาวขึ้น เปรียบเทียบตัวเลือก และถามต่อเนื่องใน Search ได้ โดยไม่ต้องเริ่มใหม่ทุกครั้ง</p>
              </div>
            ) : (
              <p className="kpi-seo-local-change-body">{t.aiBody}</p>
            )}
            <SearchSourceCite locale={locale} source={aiMode} fallback={HOTEL_SEO_SOURCES.aiModeTh} nameFallback="blog.google" />
          </article>
          <article className="kpi-seo-local-change-stat">
            <h3 className="kpi-h3">{cmsText(useCmsCopy, locale, cms?.search.growthTitle, t.growthTitle)}</h3>
            <p className="kpi-seo-local-change-number">{cmsText(useCmsCopy, locale, cms?.search.growthStat, t.growthStat)}</p>
            <p className="kpi-seo-local-change-stat-label">
              {cmsText(useCmsCopy, locale, cms?.search.growthLabel, locale === "th" ? "" : t.growthLabel) ||
                (locale === "th" ? (
                  <>
                    การใช้งาน <span className="kpi-latin">AI Search</span> ต่อเดือนทั่วโลก
                  </>
                ) : (
                  t.growthLabel
                ))}
            </p>
            <p className="kpi-seo-local-change-body">
              {cmsText(
                useCmsCopy,
                locale,
                cms?.search.growthNote,
                locale === "th"
                  ? "ตัวเลขนี้เป็นประมาณการแพลตฟอร์มทั่วโลกของ Google ไม่ใช่จำนวนผู้ใช้ในประเทศไทย และไม่ใช่ผลโรงแรม"
                  : t.growthNote,
              )}
            </p>
            <SearchSourceCite locale={locale} source={growth} fallback={HOTEL_SEO_SOURCES.searchIo} nameFallback="blog.google" />
          </article>
          <article>
            <h3>
              {cmsText(useCmsCopy, locale, cms?.search.mapsTitle, locale === "th" ? "" : t.mapsTitle) ||
                (locale === "th" ? (
                  <>
                    <span className="kpi-latin">Google Maps</span> ยังสำคัญกับการตัดสินใจในพื้นที่
                  </>
                ) : (
                  t.mapsTitle
                ))}
            </h3>
            {cmsText(useCmsCopy, locale, cms?.search.mapsBody, locale === "th" ? "" : t.mapsBody) ? (
              <p className="kpi-seo-local-change-body">{cmsText(useCmsCopy, locale, cms?.search.mapsBody, t.mapsBody)}</p>
            ) : locale === "th" ? (
              <div className="kpi-seo-local-change-body">
                <p>ความเกี่ยวข้อง ระยะทาง และความโดดเด่นของธุรกิจยังเป็นปัจจัยสำคัญในการค้นหาในพื้นที่</p>
                <p>
                  ข้อมูลบน <span className="kpi-latin">Google Business Profile</span> จึงต้องถูกต้อง ชัดเจน และสอดคล้องกับเว็บไซต์
                </p>
              </div>
            ) : (
              <p className="kpi-seo-local-change-body">{t.mapsBody}</p>
            )}
            <SearchSourceCite
              locale={locale}
              source={maps}
              fallback={HOTEL_SEO_SOURCES.localRank}
              nameFallback="Google Business Profile Help"
            />
          </article>
        </div>
        <div className="kpi-seo-local-change-takeaway">
          {cmsText(useCmsCopy, locale, cms?.search.close, locale === "th" ? "" : t.changeClose) ? (
            <p>{cmsText(useCmsCopy, locale, cms?.search.close, t.changeClose)}</p>
          ) : locale === "th" ? (
            <>
              <p>
                สำหรับโรงแรม สปา และคาเฟ่ ข้อมูลบนเว็บไซต์และ <span className="kpi-latin">Google Maps</span> ต้องตอบคำถามเดียวกันให้ชัด
              </p>
              <p className="kpi-seo-local-change-takeaway-strong">ตั้งแต่บริการ ทำเล ราคา เวลาเปิด ไปจนถึงวิธีติดต่อหรือจอง</p>
            </>
          ) : (
            <p>{t.changeClose}</p>
          )}
        </div>
        <div className="kpi-seo-local-change-note">
          {cmsText(useCmsCopy, locale, cms?.search.aiNote, locale === "th" ? "" : t.aiNote) ? (
            <p>{cmsText(useCmsCopy, locale, cms?.search.aiNote, t.aiNote)}</p>
          ) : locale === "th" ? (
            <>
              <p>
                <span className="kpi-latin">SEO</span> พื้นฐานยังคงสำคัญต่อ <span className="kpi-latin">AI Overviews</span> และ{" "}
                <span className="kpi-latin">AI Mode</span>
              </p>
              <p>
                ยังไม่มีวิธีพิเศษที่รับประกันว่าธุรกิจจะปรากฏในทุกคำตอบ <span className="kpi-latin">AI</span> หรือ{" "}
                <span className="kpi-latin">AI Overview</span> การปรากฏต่างกันตามคำค้น ทำเล ภาษา บริบทผู้ใช้ คุณภาพแหล่งข้อมูล
                และการเปลี่ยนแปลงของระบบค้นหา
              </p>
            </>
          ) : (
            <p>{t.aiNote}</p>
          )}
          <SearchSourceCite
            locale={locale}
            source={aiNote}
            fallback={HOTEL_SEO_SOURCES.aiFeatures}
            nameFallback="Google Search Central"
          />
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-seo-local-compare">
          <h2 className="kpi-h2">
            {cmsText(useCmsCopy, locale, cms?.compare.title, locale === "th" ? "" : t.compareTitle) ||
              (locale === "th" ? (
                <>
                  <span className="kpi-seo-local-compare-line">
                    <span className="kpi-latin">SEO</span>, <span className="kpi-latin">AEO</span> และ{" "}
                    <span className="kpi-latin">Local SEO</span>
                  </span>
                  <span className="kpi-seo-local-compare-br"> </span>
                  <span className="kpi-seo-local-compare-line">ช่วยต่างกันอย่างไร?</span>
                </>
              ) : (
                t.compareTitle
              ))}
          </h2>
          <p className="kpi-seo-local-compare-lead">
            {locale === "th"
              ? "ไม่ใช่เลือกอย่างใดอย่างหนึ่ง แต่จัดเว็บไซต์ ข้อมูลธุรกิจ และคำตอบที่ลูกค้าต้องการให้สอดคล้องกัน"
              : "These are not alternatives. The website, the business facts, and the answers customers need should work together."}
          </p>
          <HotelSeoCompareMatrix
            locale={locale === "th" ? "th" : "en"}
            rows={compareRows}
            src={compareSrc}
            status={cms?.compare.visual.status || "sample"}
            caption={cms?.compare.visual.caption}
            label={cms?.compare.visual.label || (locale === "th" ? HOTEL_SEO_COMPARE_VISUAL.label.th : HOTEL_SEO_COMPARE_VISUAL.label.en)}
          />
          <p className="kpi-seo-local-compare-close-strong">
            {cmsText(useCmsCopy, locale, cms?.compare.close, locale === "th" ? HOTEL_SEO_COMPARE_STATEMENT.th : HOTEL_SEO_COMPARE_STATEMENT.en)}
          </p>
        </div>
      </section>

      <section className="kpi-section kpi-seo-local-problems">
        <h2 className="kpi-h2">
          {cmsText(useCmsCopy, locale, cms?.problems.title, locale === "th" ? "" : t.problemTitle) ||
            (locale === "th" ? (
              <>
                <span className="kpi-seo-local-problem-line">ธุรกิจของคุณกำลังเจอ</span>
                <span className="kpi-seo-local-problem-br"> </span>
                <span className="kpi-seo-local-problem-line">
                  <span className="kpi-seo-local-problem-em">ปัญหาเหล่านี้</span>หรือไม่?
                </span>
              </>
            ) : (
              t.problemTitle
            ))}
        </h2>
        <div className="kpi-seo-local-problems-grid">
          <div className="kpi-seo-local-problems-main">
            <ol className="kpi-seo-local-problems-list">
              {(problemRows
                ? problemRows.map((item) => ({
                    id: item.id,
                    num: item.num,
                    problem: item.problem,
                    sees: item.sees,
                    inspect: item.inspect,
                    improve: item.improve,
                    output: item.output,
                  }))
                : HOTEL_SEO_PROBLEM_ITEMS.map((item) => ({
                    id: item.id,
                    num: item.num,
                    problem: locale === "th" ? item.problemTh : item.problemEn,
                    sees: locale === "th" ? item.seesTh : item.seesEn,
                    inspect: locale === "th" ? item.dataTh : item.dataEn,
                    improve: "",
                    output: locale === "th" ? item.outputTh : item.outputEn,
                  }))
              ).map((item) => {
                const thai = locale === "th";
                return (
                  <li key={item.id}>
                    <span className="kpi-latin">{item.num}</span>
                    <div className="kpi-seo-local-problem-card">
                      <dl>
                        <div>
                          <dt>{thai ? HOTEL_SEO_PROBLEM_FIELDS[0].th : HOTEL_SEO_PROBLEM_FIELDS[0].en}</dt>
                          <dd className="kpi-seo-local-problem-title">{item.problem}</dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_PROBLEM_FIELDS[1].th : HOTEL_SEO_PROBLEM_FIELDS[1].en}</dt>
                          <dd>{item.sees}</dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_PROBLEM_FIELDS[2].th : HOTEL_SEO_PROBLEM_FIELDS[2].en}</dt>
                          <dd>{item.inspect}</dd>
                        </div>
                        {item.improve ? (
                          <div>
                            <dt>{thai ? "สิ่งที่ควรปรับ" : "Improvement"}</dt>
                            <dd>{item.improve}</dd>
                          </div>
                        ) : null}
                        <div>
                          <dt>{thai ? HOTEL_SEO_PROBLEM_FIELDS[3].th : HOTEL_SEO_PROBLEM_FIELDS[3].en}</dt>
                          <dd>{item.output}</dd>
                        </div>
                      </dl>
                    </div>
                  </li>
                );
              })}
            </ol>
            <a href={heroCtaHref} className="kpi-seo-local-problems-cta">
              {cmsText(useCmsCopy, locale, cms?.problems.cta, t.problemCta)} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="kpi-seo-local-problems-photo">
            <HotelSeoAuditVisual
              locale={locale}
              src={auditSrc}
              status={cms?.problems.visual.status || "sample"}
              alt={locale === "th" ? cms?.problems.visual.altTh || HOTEL_SEO_AUDIT_VISUAL.alt.th : cms?.problems.visual.altEn || HOTEL_SEO_AUDIT_VISUAL.alt.en}
              label={cms?.problems.visual.label || (locale === "th" ? HOTEL_SEO_AUDIT_VISUAL.label.th : HOTEL_SEO_AUDIT_VISUAL.label.en)}
              caption={cms?.problems.visual.caption || (locale === "th" ? HOTEL_SEO_AUDIT_VISUAL.caption.th : HOTEL_SEO_AUDIT_VISUAL.caption.en)}
              meta={locale === "th" ? HOTEL_SEO_AUDIT_VISUAL.meta.th : HOTEL_SEO_AUDIT_VISUAL.meta.en}
              rows={listingRows}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-seo-local-help">
          <h2 className="kpi-h2">
            {cmsText(useCmsCopy, locale, cms?.help.title, locale === "th" ? "" : t.helpTitle) ||
              (locale === "th" ? (
                <>
                  <span className="kpi-seo-local-help-line">
                    เราช่วยให้ธุรกิจ<span className="kpi-seo-local-help-em">ถูกค้นพบ</span>
                  </span>
                  <span className="kpi-seo-local-help-br"> </span>
                  <span className="kpi-seo-local-help-line">และติดต่อได้อย่างไร?</span>
                </>
              ) : (
                t.helpTitle
              ))}
          </h2>
          <div className="kpi-seo-local-help-visual">
            <HotelSeoDiscoveryFlow
              locale={locale}
              src={flowSrc}
              status={cms?.help.visual.status || "sample"}
              alt={locale === "th" ? cms?.help.visual.altTh || HOTEL_SEO_FLOW_VISUAL.alt.th : cms?.help.visual.altEn || HOTEL_SEO_FLOW_VISUAL.alt.en}
              label={cms?.help.visual.label}
              caption={cms?.help.visual.caption}
              stages={flowStages}
            />
          </div>
          <HotelSeoHelpSteps locale={locale === "th" ? "th" : "en"} steps={helpSteps} />
          <HotelSeoHelpBoundary locale={locale === "th" ? "th" : "en"} boundary={useCmsCopy ? cms?.help.boundary : undefined} />
          <a href={heroCtaHref} className="kpi-button">
            {heroCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="kpi-section kpi-seo-local-gbp">
        <div className="kpi-seo-local-gbp-grid">
          <div className="kpi-seo-local-gbp-copy">
            <h2 className="kpi-h2">
              {cmsText(useCmsCopy, locale, cms?.gbp.title, locale === "th" ? "" : HOTEL_SEO_GBP_COPY.title.en) ||
                (locale === "th" ? (
                  <>
                    ทำไม <span className="kpi-latin kpi-seo-local-gbp-em">Google Business Profile</span> ที่ครบและเป็นปัจจุบันช่วยการค้นพบในพื้นที่?
                  </>
                ) : (
                  HOTEL_SEO_GBP_COPY.title.en
                ))}
            </h2>
            <div className="kpi-seo-local-gbp-body">
              <p>{cmsText(useCmsCopy, locale, cms?.gbp.body, locale === "th" ? HOTEL_SEO_GBP_COPY.lead.th : HOTEL_SEO_GBP_COPY.lead.en)}</p>
            </div>
            <p className="kpi-seo-local-gbp-rank">
              {cmsText(useCmsCopy, locale, cms?.gbp.rankNote, locale === "th" ? HOTEL_SEO_GBP_COPY.rankNote.th : HOTEL_SEO_GBP_COPY.rankNote.en)}
            </p>
            <div className="kpi-seo-local-gbp-signals">
              {(gbpActions
                ? gbpActions
                : HOTEL_SEO_GBP_ACTIONS.map((action) => ({
                    id: action.id,
                    name: action.name,
                    label: locale === "th" ? action.th : action.en,
                    order: 0,
                  }))
              ).map((action) => (
                <article key={action.id}>
                  <h3 className="kpi-latin">{action.name}</h3>
                  <p>{action.label}</p>
                </article>
              ))}
            </div>
            <div className="kpi-seo-local-gbp-close">
              <p className="kpi-seo-local-gbp-close-strong">
                {cmsText(useCmsCopy, locale, cms?.gbp.close, locale === "th" ? HOTEL_SEO_GBP_COPY.close.th : HOTEL_SEO_GBP_COPY.close.en)}
              </p>
            </div>
            <SearchSourceCite
              locale={locale}
              source={gbpSource}
              fallback={HOTEL_SEO_SOURCES.localRank}
              nameFallback="Google Business Profile Help"
            />
          </div>
          <div className="kpi-seo-local-gbp-photo">
            <HotelSeoGbpVisual
              locale={locale}
              src={gbpSrc}
              status={cms?.gbp.visual.status || "sample"}
              alt={locale === "th" ? cms?.gbp.visual.altTh || HOTEL_SEO_GBP_VISUAL.alt.th : cms?.gbp.visual.altEn || HOTEL_SEO_GBP_VISUAL.alt.en}
              label={cms?.gbp.visual.label || (locale === "th" ? HOTEL_SEO_GBP_VISUAL.label.th : HOTEL_SEO_GBP_VISUAL.label.en)}
              caption={cms?.gbp.visual.caption || (locale === "th" ? HOTEL_SEO_GBP_VISUAL.caption.th : HOTEL_SEO_GBP_VISUAL.caption.en)}
              meta={locale === "th" ? HOTEL_SEO_GBP_VISUAL.meta.th : HOTEL_SEO_GBP_VISUAL.meta.en}
              fields={gbpFields}
              actions={gbpActions}
            />
          </div>
        </div>
      </section>

      <section className="kpi-seo-local-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{cmsText(useCmsCopy, locale, cms?.method.title, t.methodTitle)}</h2>
          <div className="kpi-seo-local-method-layout">
            <div className="kpi-seo-local-method-visual">
              <HotelSeoProcessVisual
                locale={locale}
                src={processSrc}
                status={cms?.method.visual.status || "sample"}
              />
            </div>
            <HotelSeoProcessSteps locale={locale} steps={processSteps} />
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-seo-local-measure">
        <h2 className="kpi-h2">{cmsText(useCmsCopy, locale, cms?.measure.title, t.measureTitle)}</h2>
        <p className="kpi-seo-local-measure-lead">
          {cmsText(useCmsCopy, locale, cms?.measure.intro, locale === "th" ? HOTEL_SEO_KPI_COPY.intro.th : HOTEL_SEO_KPI_COPY.intro.en)}
        </p>
        <div className="kpi-seo-local-measure-visual">
          <HotelSeoKpiVisual
            locale={locale}
            src={kpiSrc}
            status={kpiSrc ? cms?.measure.visual.status || "sample" : "sample"}
            alt={locale === "th" ? cms?.measure.visual.altTh : cms?.measure.visual.altEn}
            label={cms?.measure.visual.label}
            caption={cms?.measure.visual.caption}
            chart={kpiChart ? { labels: kpiChart.labels, values: kpiChart.values } : undefined}
          />
        </div>
        <HotelSeoKpiFramework locale={locale} overrides={useCmsCopy ? cms?.measure.kpis : undefined} />
        <p className="kpi-seo-local-measure-note">
          {cmsText(useCmsCopy, locale, cms?.measure.close, locale === "th" ? HOTEL_SEO_KPI_COPY.close.th : HOTEL_SEO_KPI_COPY.close.en)}
        </p>
      </section>

      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-seo-local-related">
          <h2 className="kpi-h2">
            {cmsText(useCmsCopy, locale, cms?.related.title, locale === "th" ? "" : t.relatedTitle) ||
              (locale === "th" ? (
                <>
                  <span className="kpi-seo-local-related-line">เรื่องที่เกี่ยวข้องกับการค้นหา</span>
                  <span className="kpi-seo-local-related-br"> </span>
                  <span className="kpi-seo-local-related-line">เว็บไซต์ และการจอง</span>
                </>
              ) : (
                t.relatedTitle
              ))}
          </h2>
          <div className="kpi-seo-local-related-layout">
            <div className="kpi-seo-local-related-visual">
              <HotelSeoRelatedVisual locale={locale} src={relatedSrc} status={relatedSrc ? cms?.related.visual.status || "sample" : "sample"} />
            </div>
            {relatedCards.length ? <HotelSeoRelatedCards locale={locale} cards={relatedCards} /> : null}
          </div>
        </div>
      </section>

      {gscRows?.length || listingRows?.length ? (
        <section className="kpi-section kpi-seo-local-help">
          <h2 className="kpi-h2">{cmsText(useCmsCopy, locale, cms?.consistency.title, locale === "th" ? "รายการตรวจความสอดคล้องของข้อมูล" : "Data consistency checklist")}</h2>
          {cms?.consistency.note ? <p className="kpi-seo-local-measure-lead">{cms.consistency.note}</p> : null}
          <div className="kpi-seo-local-help-boundary-grid">
            {gscRows?.length ? (
              <article>
                <h3 className="kpi-latin">Search Console</h3>
                <ul>
                  {gscRows.map((row) => (
                    <li key={row.id} className="kpi-latin kpi-seo-local-help-chip">
                      {row.area}: {row.check}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}
            {listingRows?.length ? (
              <article>
                <h3 className="kpi-latin">Local listing</h3>
                <ul>
                  {listingRows.map((row) => (
                    <li key={row.id} className="kpi-latin kpi-seo-local-help-chip">
                      {row.area}: {row.check}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}
      <SeoLocalEnquiry locale={locale} helper={useCmsCopy ? cms?.form : undefined} teamPhotoSrc={formPhotoSrc} />
      <PageFaqs items={faqItems} locale={locale} sectionId="hotel-seo-faq" />
      <SeoLocalStickyCta label={heroCta} />
    </>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-seo-google-maps-ai-search", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}
