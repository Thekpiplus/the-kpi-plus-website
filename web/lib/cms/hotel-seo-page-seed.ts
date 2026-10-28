import {
  HOTEL_SEO_AUDIT_VISUAL,
  HOTEL_SEO_BEHAVIOR_MAP,
  HOTEL_SEO_BEHAVIOR_VISUAL,
  HOTEL_SEO_COMPARE_STATEMENT,
  HOTEL_SEO_COMPARE_VISUAL,
  HOTEL_SEO_FLOW_VISUAL,
  HOTEL_SEO_GBP_COPY,
  HOTEL_SEO_GBP_VISUAL,
  HOTEL_SEO_HERO_VISUAL,
  HOTEL_SEO_KPI_COPY,
  HOTEL_SEO_KPI_VISUAL,
  HOTEL_SEO_PROCESS_VISUAL,
  HOTEL_SEO_RELATED_VISUAL,
  HOTEL_SEO_SOURCES,
  hotelSeoFaqs,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import {
  HOTEL_SEO_CMS_TEMPLATE,
  defaultHotelSeoBehaviorTypes,
  defaultHotelSeoBoundary,
  defaultHotelSeoChecklist,
  defaultHotelSeoCompareRows,
  defaultHotelSeoFlowStages,
  defaultHotelSeoFormCopy,
  defaultHotelSeoGbpActions,
  defaultHotelSeoGbpFields,
  defaultHotelSeoHelpSteps,
  defaultHotelSeoKpis,
  defaultHotelSeoProblemRows,
  defaultHotelSeoProcessSteps,
  defaultHotelSeoRelatedCards,
  sampleSeoVisual,
  type CmsHotelSeoPage,
  type CmsSeoSource,
} from "./hotel-seo-page";

function source(row: (typeof HOTEL_SEO_SOURCES)[keyof typeof HOTEL_SEO_SOURCES]): CmsSeoSource {
  return { ...row };
}

export function defaultHotelSeoCms(locale: Locale = "th"): CmsHotelSeoPage {
  const thai = locale === "th";
  const faqs = hotelSeoFaqs(locale === "en" || locale === "th" ? locale : "en");
  const form = defaultHotelSeoFormCopy(locale);
  const checklist = defaultHotelSeoChecklist(locale);
  return {
    version: 1,
    template: HOTEL_SEO_CMS_TEMPLATE,
    hero: {
      eyebrow: thai ? "Search Visibility & Local Discovery" : "SEO, Google Maps & AI Search",
      title: thai
        ? "ให้ลูกค้าค้นพบธุรกิจของคุณ เข้าใจว่าคุณเหมาะกับเขา และติดต่อได้ทันที"
        : "Help customers find the business, see why it fits, and contact you at once",
      description: thai
        ? "วันนี้ลูกค้าไม่ได้ค้นหาแค่ชื่อโรงแรมหรือร้าน แต่ค้นหาด้วยความต้องการ เช่น “สปาใกล้ฉันที่มีนวดคู่” หรือ “โรงแรมใกล้สนามบินที่เช็กอินดึกได้”"
        : "Help customers find the business, see why it fits, and contact you at once",
      points: thai
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
          ],
      primaryCta: {
        label: thai ? "ให้ทีมดูการค้นพบธุรกิจของคุณ" : "Ask the team to review how customers find this business",
        href: "#search-enquiry",
      },
      secondaryCta: { label: thai ? "ดูโซลูชันทั้งหมด" : "All solutions", href: "/solutions" },
      underCta: thai
        ? "ส่งชื่อธุรกิจ เว็บไซต์หรือ Google Maps และปัญหาที่พบ"
        : "Send the business name, a website or Google Maps link, and the issue you see.",
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_HERO_VISUAL.label.th : HOTEL_SEO_HERO_VISUAL.label.en,
        HOTEL_SEO_HERO_VISUAL.alt.th,
        HOTEL_SEO_HERO_VISUAL.alt.en,
        thai ? HOTEL_SEO_HERO_VISUAL.caption.th : HOTEL_SEO_HERO_VISUAL.caption.en,
      ),
    },
    search: {
      title: thai ? "พฤติกรรมการค้นหากำลังเปลี่ยน" : "Search behaviour is changing",
      intro: thai
        ? "วันนี้ลูกค้าเริ่มจากคำถาม แล้วอาจใช้ Traditional Search, AI Search, Google Maps หรือเปิดเว็บไซต์ก่อนโทร ขอเส้นทาง ติดต่อ หรือจอง"
        : "Customers start with a question, then may use Traditional Search, AI Search, Google Maps, or the website before they call, get directions, contact, or book.",
      aiTitle: thai ? "AI Search ใช้ภาษาไทยได้แล้ว" : "AI Search now works in Thai",
      aiBody: thai
        ? "Google เปิด AI Mode ในประเทศไทยเมื่อเดือนสิงหาคม 2025 และเพิ่มการรองรับภาษาไทยในเดือนตุลาคม 2025"
        : "Google launched AI Mode in Thailand in August 2025 and added Thai-language support in October 2025.",
      growthTitle: thai ? "การใช้งาน AI Search เติบโตในระดับโลก" : "AI Search use is growing worldwide",
      growthStat: thai ? "1 พันล้าน" : "1 billion",
      growthLabel: thai
        ? "ผู้ใช้ AI Mode ต่อเดือนทั่วโลก ตามรายงานของ Google ปี 2026"
        : "monthly AI Mode users worldwide, according to Google in 2026",
      growthNote: thai
        ? "ตัวเลขนี้แสดงการเติบโตของรูปแบบการค้นหา แต่ไม่ใช่จำนวนผู้ใช้ในประเทศไทย และไม่ใช่ผลโรงแรม"
        : "This figure shows growth in the search format. It is not the number of users in Thailand and not a hotel result.",
      mapsTitle: thai ? "Google Maps ยังสำคัญกับการตัดสินใจในพื้นที่" : "Google Maps still matters for local decisions",
      mapsBody: thai
        ? "Google ระบุว่าผลการค้นหาธุรกิจในพื้นที่พิจารณา 3 ปัจจัยหลัก: ความเกี่ยวข้อง ระยะทาง และความโดดเด่นของธุรกิจ"
        : "Google says local business results consider three main factors: relevance, distance, and prominence.",
      close: thai
        ? "สำหรับโรงแรม สปา และคาเฟ่ ข้อมูลบนเว็บไซต์และ Google Maps ต้องตอบคำถามเดียวกันให้ชัด"
        : "For hotels, spas, and cafés the website and Google Maps have to answer the same questions clearly.",
      aiNote: thai
        ? "แนวทาง SEO พื้นฐานยังใช้กับ AI Overviews และ AI Mode ไม่มีวิธีพิเศษที่รับประกันว่าธุรกิจจะปรากฏในทุกคำตอบ AI หรือ AI Overview การปรากฏต่างกันตามคำค้น ทำเล ภาษา บริบทผู้ใช้ คุณภาพแหล่งข้อมูล และการเปลี่ยนแปลงของระบบค้นหา"
        : "The usual SEO work still applies to AI Overviews and AI Mode. There is no special method that guarantees a business will appear in every AI answer or AI Overview. Visibility varies by query, location, language, user context, source quality, and search-system changes.",
      types: defaultHotelSeoBehaviorTypes(locale),
      map: HOTEL_SEO_BEHAVIOR_MAP.map((item) => (thai ? item.th : item.en)),
      aiModeSource: source(HOTEL_SEO_SOURCES.aiModeTh),
      growthSource: source(HOTEL_SEO_SOURCES.searchIo),
      mapsSource: source(HOTEL_SEO_SOURCES.localRank),
      aiNoteSource: source(HOTEL_SEO_SOURCES.aiFeatures),
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_BEHAVIOR_VISUAL.label.th : HOTEL_SEO_BEHAVIOR_VISUAL.label.en,
        HOTEL_SEO_BEHAVIOR_VISUAL.alt.th,
        HOTEL_SEO_BEHAVIOR_VISUAL.alt.en,
        thai ? HOTEL_SEO_BEHAVIOR_VISUAL.caption.th : HOTEL_SEO_BEHAVIOR_VISUAL.caption.en,
      ),
    },
    compare: {
      title: thai ? "SEO, AEO และ Local SEO ช่วยต่างกันอย่างไร?" : "How do SEO, AEO, and Local SEO differ?",
      close: thai ? HOTEL_SEO_COMPARE_STATEMENT.th : HOTEL_SEO_COMPARE_STATEMENT.en,
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_COMPARE_VISUAL.label.th : HOTEL_SEO_COMPARE_VISUAL.label.en,
        HOTEL_SEO_COMPARE_VISUAL.alt.th,
        HOTEL_SEO_COMPARE_VISUAL.alt.en,
        thai ? HOTEL_SEO_COMPARE_VISUAL.caption.th : HOTEL_SEO_COMPARE_VISUAL.caption.en,
      ),
      rows: defaultHotelSeoCompareRows(locale),
    },
    problems: {
      title: thai ? "ธุรกิจของคุณกำลังเจอปัญหาเหล่านี้หรือไม่?" : "Does any of this sound like the business now?",
      cta: thai ? "ให้ทีมช่วยดูจุดที่ควรปรับก่อน" : "Ask the team to look at what to fix first",
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_AUDIT_VISUAL.label.th : HOTEL_SEO_AUDIT_VISUAL.label.en,
        HOTEL_SEO_AUDIT_VISUAL.alt.th,
        HOTEL_SEO_AUDIT_VISUAL.alt.en,
        thai ? HOTEL_SEO_AUDIT_VISUAL.caption.th : HOTEL_SEO_AUDIT_VISUAL.caption.en,
      ),
      items: defaultHotelSeoProblemRows(locale),
    },
    help: {
      title: thai ? "เดอะ เคพีไอ พลัส ช่วยให้ธุรกิจถูกค้นพบและติดต่อได้อย่างไร" : "How The KPI Plus helps the business become discoverable and contactable",
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_FLOW_VISUAL.label.th : HOTEL_SEO_FLOW_VISUAL.label.en,
        HOTEL_SEO_FLOW_VISUAL.alt.th,
        HOTEL_SEO_FLOW_VISUAL.alt.en,
        thai ? HOTEL_SEO_FLOW_VISUAL.caption.th : HOTEL_SEO_FLOW_VISUAL.caption.en,
      ),
      stages: defaultHotelSeoFlowStages(locale),
      steps: defaultHotelSeoHelpSteps(locale),
      boundary: defaultHotelSeoBoundary(locale),
    },
    gbp: {
      title: thai ? HOTEL_SEO_GBP_COPY.title.th : HOTEL_SEO_GBP_COPY.title.en,
      body: thai ? HOTEL_SEO_GBP_COPY.lead.th : HOTEL_SEO_GBP_COPY.lead.en,
      example: thai
        ? "เรื่องเล็กบนหน้าจอจึงกลายเป็นประสบการณ์จริงของลูกค้า"
        : "A small fact on the screen becomes a real visit.",
      rankNote: thai ? HOTEL_SEO_GBP_COPY.rankNote.th : HOTEL_SEO_GBP_COPY.rankNote.en,
      close: thai ? HOTEL_SEO_GBP_COPY.close.th : HOTEL_SEO_GBP_COPY.close.en,
      source: source(HOTEL_SEO_SOURCES.localRank),
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_GBP_VISUAL.label.th : HOTEL_SEO_GBP_VISUAL.label.en,
        HOTEL_SEO_GBP_VISUAL.alt.th,
        HOTEL_SEO_GBP_VISUAL.alt.en,
        thai ? HOTEL_SEO_GBP_VISUAL.caption.th : HOTEL_SEO_GBP_VISUAL.caption.en,
      ),
      fields: defaultHotelSeoGbpFields(locale),
      actions: defaultHotelSeoGbpActions(locale),
    },
    method: {
      title: thai ? "เราเริ่มจากข้อมูลจริงของธุรกิจอย่างไร?" : "How the work starts",
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_PROCESS_VISUAL.label.th : HOTEL_SEO_PROCESS_VISUAL.label.en,
        HOTEL_SEO_PROCESS_VISUAL.alt.th,
        HOTEL_SEO_PROCESS_VISUAL.alt.en,
        thai ? HOTEL_SEO_PROCESS_VISUAL.caption.th : HOTEL_SEO_PROCESS_VISUAL.caption.en,
      ),
      steps: defaultHotelSeoProcessSteps(locale),
    },
    measure: {
      title: thai ? "วัดผลอะไรได้บ้าง?" : "What can be measured?",
      intro: thai ? HOTEL_SEO_KPI_COPY.intro.th : HOTEL_SEO_KPI_COPY.intro.en,
      close: thai ? HOTEL_SEO_KPI_COPY.close.th : HOTEL_SEO_KPI_COPY.close.en,
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_KPI_VISUAL.label.th : HOTEL_SEO_KPI_VISUAL.label.en,
        HOTEL_SEO_KPI_VISUAL.alt.th,
        HOTEL_SEO_KPI_VISUAL.alt.en,
        thai ? HOTEL_SEO_KPI_VISUAL.caption.th : HOTEL_SEO_KPI_VISUAL.caption.en,
      ),
      kpis: defaultHotelSeoKpis(locale),
    },
    related: {
      title: thai ? "เรื่องที่เกี่ยวข้องกับการค้นหา เว็บไซต์ และการจอง" : "Related reading on search, the website, and booking",
      visual: sampleSeoVisual(
        thai ? HOTEL_SEO_RELATED_VISUAL.label.th : HOTEL_SEO_RELATED_VISUAL.label.en,
        HOTEL_SEO_RELATED_VISUAL.alt.th,
        HOTEL_SEO_RELATED_VISUAL.alt.en,
        thai ? HOTEL_SEO_RELATED_VISUAL.caption.th : HOTEL_SEO_RELATED_VISUAL.caption.en,
      ),
      cards: defaultHotelSeoRelatedCards(locale),
    },
    form: {
      ...form,
      visual: sampleSeoVisual("Enquiry", "", "", ""),
    },
    faqs: faqs.map((item, index) => ({ id: `faq-${index + 1}`, ...item })),
    consistency: {
      title: thai ? "รายการตรวจความสอดคล้องของข้อมูล" : "Data consistency checklist",
      note: thai
        ? "ตรวจ Search Console โปรไฟล์ Maps และหน้าเว็บจากข้อมูลชุดเดียวกัน ไม่ใช่ผลอันดับ"
        : "Review Search Console, the Maps profile, and the website from one set of facts. Not a ranking result",
      gsc: checklist.gsc,
      listing: checklist.listing,
    },
    seo: {
      social: sampleSeoVisual("Social", HOTEL_SEO_HERO_VISUAL.alt.th, HOTEL_SEO_HERO_VISUAL.alt.en, ""),
      canonical: "",
    },
  };
}
