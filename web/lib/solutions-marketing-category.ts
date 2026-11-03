import type { Locale } from "@/lib/seo";

export const MARKETING_CATEGORY_ID = "grow-demand";

export const MARKETING_CATEGORY_VISUAL = {
  src: "/images/hotel-solutions-marketing-booking-placeholder.webp",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  label: "Hotel Marketing & Booking Journey — Sample",
  alt: {
    th: "แผนภาพตัวอย่างเส้นทางลูกค้า Hotel Marketing & Booking จาก Search / Ads / Agent ไปยังเว็บไซต์ ระบบจอง การติดตามจอง และการวัดผล — ไม่ใช่ผลแคมเปญหรืออันดับจริง",
    en: "Sample Hotel Marketing & Booking customer journey from Search / Ads / Agent through website, booking engine, reservation follow-up, and measurement — not a live campaign or ranking result",
    ru: "Пример пути клиента Marketing & Booking: Search / Ads / Agent → сайт → система бронирования → сопровождение → измерение. Не результат кампании и не рейтинг",
    zh: "行銷與預訂顧客旅程示意：搜尋／廣告／代理 → 網站／落地頁 → 預訂引擎／詢問 → 訂房追蹤 → 衡量與優化——非真實活動成效或排名",
  },
  note: {
    th: "แผนภาพตัวอย่างเส้นทางลูกค้า — ไม่สัญญาอันดับ การรับรองจากแพลตฟอร์ม หรือผลจอง",
    en: "Sample customer-journey diagram — no ranking promise, platform endorsement, or booking guarantee",
    ru: "Пример пути клиента — без обещания рейтинга, endorsement платформы или гарантии брони",
    zh: "顧客旅程示意——不承諾排名、平台背書或預訂保證",
  },
} as const;

/** Editable journey steps — labels only; HTML/CSS renders arrows. */
export const MARKETING_CATEGORY_JOURNEY = [
  {
    id: "search",
    en: "Search / Ads / Agent",
    th: "ค้นหา / โฆษณา / เอเจนต์",
    ru: "Поиск / Ads / Агент",
    zh: "搜尋／廣告／代理",
  },
  {
    id: "website",
    en: "Hotel Website / Landing Page",
    th: "เว็บไซต์ / หน้า Landing",
    ru: "Сайт / Landing",
    zh: "網站／落地頁",
  },
  {
    id: "booking",
    en: "Booking Engine / Enquiry",
    th: "ระบบจอง / Enquiry",
    ru: "Booking Engine / Enquiry",
    zh: "預訂引擎／詢問",
  },
  {
    id: "follow-up",
    en: "Reservation / Follow-up",
    th: "จอง / ติดตามต่อ",
    ru: "Бронь / Follow-up",
    zh: "訂房／追蹤",
  },
  {
    id: "measure",
    en: "Measurement & Optimization",
    th: "วัดผลและปรับต่อ",
    ru: "Измерение и оптимизация",
    zh: "衡量與優化",
  },
] as const;

export type MarketingCategoryCard = {
  href: string;
  objective: Record<Locale, string>;
  bestFit: Record<Locale, string>;
  prepare: Record<Locale, string>;
  cover: Record<Locale, string>;
};

/**
 * Text-first cards for Grow Demand only.
 * Names/routes come from nav; claims stay within approved service-page boundaries.
 */
export const MARKETING_CATEGORY_CARDS: MarketingCategoryCard[] = [
  {
    href: "/solutions/google-ads-management",
    objective: {
      th: "เมื่อลูกค้าค้นหาที่พัก ให้เขาเจอโรงแรมของคุณและไปต่อสู่หน้าที่เกี่ยวข้องกับการจองได้โดยไม่เพิ่มความฝืด",
      en: "When guests search for a stay, help them find your hotel and continue to a relevant booking path without extra friction.",
      ru: "Когда гости ищут жильё, помочь найти отель и перейти к релевантному пути бронирования без лишнего трения.",
      zh: "當客人搜尋住宿時，協助找到飯店並順利進入相關預訂路徑，不增加多餘阻力。",
    },
    bestFit: {
      th: "เมื่อลูกค้ากำลังค้นหาที่พักอยู่แล้ว แต่โฆษณา ราคา หน้าเว็บ และระบบจองยังไม่เชื่อมกันพอให้จองตรง",
      en: "Guests may already be searching, but a direct booking still needs the ad, the rate, the website, and the booking path to connect.",
      ru: "Гость уже может искать жильё, но прямая бронь появится только если реклама, цена, сайт и система бронирования связаны.",
      zh: "客人可能已在搜尋住宿，但直銷預訂仍須讓廣告、價格、網站與預訂系統連在一起。",
    },
    prepare: {
      th: "เตรียมชื่อโรงแรม เว็บไซต์หรือหน้าจอง เป้าหมายการขาย ตลาดและภาษา และสถานะบัญชี Google Ads ถ้ามี — ไม่ต้องรอรายงานครบก่อนเริ่มทบทวน",
      en: "Prepare the hotel name, website or booking page, sales goal, market and language, and whether a Google Ads account exists. A complete report is not required to start the review.",
      ru: "Подготовьте название отеля, сайт или страницу брони, цель продаж, рынок и язык, а также статус аккаунта Google Ads при наличии. Полный отчёт для старта не обязателен.",
      zh: "準備飯店名稱、網站或預訂頁、銷售目標、市場與語言，以及是否已有 Google Ads 帳戶。不必等完整報告才開始檢視。",
    },
    cover: {
      th: "ตามขอบเขตที่ตกลง — เช่น ทบทวนบัญชีโฆษณา คำค้น หน้าโรงแรม เส้นทางจอง และการวัดผล แล้วสรุปช่องว่างกับแนวทางแคมเปญ ไม่สัญญาอันดับแรก ยอดจอง หรือ ROAS",
      en: "Subject to agreed scope — for example reviewing the ads account, search, hotel page, booking path, and tracking, then summarising gaps and campaign direction. No promise of top ranking, bookings, or ROAS.",
      ru: "В согласованном объёме — например обзор аккаунта, поиска, страницы отеля, пути брони и трекинга, затем пробелы и направление кампании. Без обещания топ-рейтинга, броней или ROAS.",
      zh: "依約定範圍——例如檢視廣告帳戶、搜尋、飯店頁、預訂路徑與追蹤，再整理缺口與活動方向。不承諾排名第一、預訂量或 ROAS。",
    },
  },
  {
    href: "/solutions/meta-ads-management",
    objective: {
      th: "ทำให้คนที่ใช่เห็นโรงแรมของคุณ แล้วมีเหตุผลที่จะสอบถามหรือจอง",
      en: "Help the right people see your hotel, then give them a reason to enquire or book.",
      ru: "Помочь нужным людям увидеть отель и дать повод спросить или забронировать.",
      zh: "讓對的人看到飯店，並有理由詢問或預訂。",
    },
    bestFit: {
      th: "เมื่อโฆษณาบน Facebook และ Instagram มีคนเห็น แต่ยังไม่ชัดว่าใครเห็นข้อเสนอ และลูกค้าสอบถามหรือจองต่อได้อย่างไร",
      en: "Ads may get reach, but the hotel still needs the right people to see the offer and a clear path to enquire or book.",
      ru: "Реклама может набирать охват, но отелю всё равно нужно, чтобы нужные люди увидели предложение и смогли спросить или забронировать.",
      zh: "廣告可能有觸及，但飯店仍須讓對的人看到方案，並有清楚路徑可以詢問或預訂。",
    },
    prepare: {
      th: "เตรียมชื่อโรงแรม ลิงก์เพจหรือเว็บไซต์ เป้าหมายการขาย และสถานะบัญชี Meta Ads ถ้ามี",
      en: "Prepare the hotel name, a page or website link, the sales goal, and whether a Meta Ads account already exists.",
      ru: "Подготовьте название отеля, ссылку на страницу или сайт, цель продаж и статус аккаунта Meta Ads при наличии.",
      zh: "準備飯店名稱、粉絲頁或網站連結、銷售目標，以及是否已有 Meta Ads 帳戶。",
    },
    cover: {
      th: "ตามขอบเขตที่ตกลง — เช่น ทบทวนบัญชี กลุ่มลูกค้า ครีเอทีฟ หน้าปลายทาง เส้นทางสอบถามหรือจอง และการวัดผล ไม่ใช่การรับรองจาก Meta และไม่สัญญาผลจอง",
      en: "Subject to agreed scope — for example reviewing the account, audience, creative, destination page, enquiry or booking path, and tracking. Not a Meta endorsement, and not a booking promise.",
      ru: "В согласованном объёме — например обзор аккаунта, аудитории, креатива, страницы, пути enquiry/брони и трекинга. Не endorsement Meta и не обещание брони.",
      zh: "依約定範圍——例如檢視帳戶、受眾、素材、落地頁、詢問或預訂路徑與追蹤。非 Meta 背書，亦不承諾預訂結果。",
    },
  },
  {
    href: "/solutions/hotel-seo-google-maps-ai-search",
    objective: {
      th: "ให้ลูกค้าค้นพบธุรกิจของคุณ เข้าใจว่าคุณเหมาะกับเขา และติดต่อได้",
      en: "Help customers find the business, see why it fits, and make contact.",
      ru: "Помочь клиентам найти бизнес, понять, почему он подходит, и связаться.",
      zh: "協助顧客找到事業、理解為何適合，並能聯繫。",
    },
    bestFit: {
      th: "เมื่อลูกค้าค้นหาโรงแรม สปา หรือคาเฟ่แล้วไม่เจอข้อมูลที่ถูกต้อง หรือเว็บไซต์กับ Google Maps ยังไม่ตอบคำถามเดียวกัน",
      en: "Customers may search the hotel, spa, or café and still miss the right facts if the website and Google Maps do not answer the same questions.",
      ru: "Клиент может искать отель, спа или кафе и всё равно не найти верные факты, если сайт и Google Maps отвечают по-разному.",
      zh: "客人搜尋飯店、spa 或咖啡店時，若網站與 Google Maps 沒有回答同一組問題，仍可能找不到正確資料。",
    },
    prepare: {
      th: "เตรียมชื่อ ที่อยู่ เวลาเปิด โทรศัพท์ เว็บไซต์ บริการหรือห้องพัก รูป และราคาที่ยืนยันได้ — การเข้าถึง Google Business Profile หรือ Search Console ช่วยได้ถ้ามี แต่ไม่บังคับก่อนเริ่ม",
      en: "Prepare name, address, hours, phone, website, services or rooms, photos, and prices the hotel can stand behind. Google Business Profile or Search Console access helps when it exists, but is not required to start.",
      ru: "Подготовьте название, адрес, часы, телефон, сайт, услуги или номера, фото и цены, которые отель готов подтвердить. Доступ к Google Business Profile или Search Console помогает, но не обязателен для старта.",
      zh: "準備名稱、地址、營業時間、電話、網站、服務或客房、照片，以及可站得住腳的價格。若有 Google Business Profile 或 Search Console 權限會有幫助，但非開始的必要條件。",
    },
    cover: {
      th: "ตามขอบเขตที่ตกลง — เช่น ทบทวนการมองเห็นการค้นหา เว็บไซต์กับ Google Maps / Business Profile ความสอดคล้องของข้อมูล และแผนวัดผล ไม่การันตีอันดับ หรือการปรากฏใน AI Search",
      en: "Subject to agreed scope — for example reviewing search visibility, the website with Google Maps / Business Profile, fact consistency, and a measurement plan. No guaranteed ranking or AI Search appearance.",
      ru: "В согласованном объёме — например обзор видимости, сайта с Google Maps / Business Profile, согласованности фактов и плана измерения. Без гарантии рейтинга или появления в AI Search.",
      zh: "依約定範圍——例如檢視搜尋能見度、網站與 Google Maps／Business Profile、資料一致性與衡量計畫。不保證排名或出現在 AI Search。",
    },
  },
  {
    href: "/solutions/hotel-website-design",
    objective: {
      th: "เว็บไซต์ที่ทำให้ลูกค้ามั่นใจก่อนจอง และทีมโรงแรมใช้งานและแก้เนื้อหาต่อได้",
      en: "A website that helps guests feel sure before they book, and that the hotel team can keep using and updating.",
      ru: "Сайт, который помогает гостю уверенно бронировать, и который команда отеля может дальше вести и обновлять.",
      zh: "讓客人在預訂前更有把握的網站，且飯店團隊能持續使用與更新內容。",
    },
    bestFit: {
      th: "เมื่อเว็บไซต์ยังไม่ช่วยให้ลูกค้ามั่นใจก่อนจอง หรือทีมโรงแรมยังแก้ข้อมูลห้องพักและโปรโมชั่นได้ยาก",
      en: "When the website does not help guests feel sure before they book, or the hotel team cannot easily update rooms and offers.",
      ru: "Когда сайт ещё не помогает гостю уверенно забронировать, или команде отеля трудно менять номера и акции.",
      zh: "當網站還不能讓客人在預訂前更有把握，或飯店團隊很難自己更新客房與促銷。",
    },
    prepare: {
      th: "เตรียมลิงก์เว็บไซต์ ลิงก์ Booking Engine ถ้ามี และสิ่งที่อยากให้ดู — ไม่ต้องตัดสินใจก่อนว่าจะสร้างใหม่หรือปรับเว็บเดิม",
      en: "Prepare the website link, a booking-engine link if you have one, and what you want reviewed. You do not need to decide first whether to rebuild or improve the current site.",
      ru: "Подготовьте ссылку на сайт, ссылку Booking Engine при наличии и что нужно проверить. Не обязательно заранее решать: новый сайт или доработка текущего.",
      zh: "準備網站連結、若有預訂引擎連結，以及想檢視的重點。不必先決定要重建或改善現有網站。",
    },
    cover: {
      th: "ตามขอบเขตที่ตกลง — เช่น ทบทวนเว็บไซต์ มือถือ เส้นทางจอง ความเหมาะสมของ CMS และการวัดผล ไม่ได้หมายความว่าระบบจองทุกรายการเชื่อมได้ทุกกรณี",
      en: "Subject to agreed scope — for example reviewing the website, mobile use, booking path, CMS fit, and measurement. This does not mean every booking engine connects in every case.",
      ru: "В согласованном объёме — например обзор сайта, мобильной версии, пути брони, CMS и измерения. Это не означает, что любой booking engine подключается в каждом случае.",
      zh: "依約定範圍——例如檢視網站、行動版、預訂路徑、CMS 適配與衡量。不代表每種預訂引擎都能在所有情況下串接。",
    },
  },
  {
    href: "/solutions/hotel-direct-bookings",
    objective: {
      th: "หาว่าลูกค้าหยุดก่อนจองตรงตรงไหน แล้วสรุปจุดที่ควรปรับให้ทีมใช้งานได้",
      en: "Find where guests stop before a direct booking, then summarise practical changes the hotel team can use.",
      ru: "Найти, где гости останавливаются до прямой брони, и дать практичный список изменений для команды отеля.",
      zh: "找出客人在完成直銷預訂前停在哪一步，並整理團隊可執行的調整重點。",
    },
    bestFit: {
      th: "เมื่อมีคนเข้าเว็บแล้ว แต่ยังไม่กดดูห้อง ไม่เข้าสู่ระบบจอง หรือไม่รู้ว่าลูกค้าหยุดตรงไหนก่อนจองสำเร็จ",
      en: "When people reach the website but do not open a room, enter the booking system, or finish the booking, and it is unclear where they stop.",
      ru: "Когда люди заходят на сайт, но не открывают номер, не входят в систему брони или неясно, где останавливаются до завершения брони.",
      zh: "當已有人進站，卻沒有查看客房、沒有進入預訂系統，或不清楚客人在完成預訂前停在哪一步。",
    },
    prepare: {
      th: "เตรียมลิงก์เว็บไซต์และหน้าจอง พร้อมบอกจุดที่กังวล — การวัดผลขึ้นกับระบบที่รองรับจริง",
      en: "Prepare the website and booking-page links, plus the step that worries you. Measurement follows what the systems can actually support.",
      ru: "Подготовьте ссылки на сайт и страницу брони и укажите тревожный шаг. Измерение зависит от того, что системы реально поддерживают.",
      zh: "準備網站與預訂頁連結，並說明擔心的步驟。衡量範圍依系統實際能支援為準。",
    },
    cover: {
      th: "ตามขอบเขตที่ตกลง — เช่น ตรวจเส้นทางจากค้นพบถึงจองตรง จุดเสียดทาน และขอบเขตการวัดผลที่ระบบรองรับ ไม่การันตีอัตราแปลงหรือยอดจอง",
      en: "Subject to agreed scope — for example reviewing the path from discovery to direct booking, friction points, and measurement boundaries the systems support. No guaranteed conversion rate or booking volume.",
      ru: "В согласованном объёме — например обзор пути от discovery до прямой брони, точек трения и границ измерения. Без гарантии конверсии или объёма броней.",
      zh: "依約定範圍——例如檢視從發現到直銷預訂的路徑、摩擦點，以及系統能支援的衡量邊界。不保證轉換率或預訂量。",
    },
  },
];

export function marketingCategoryCard(href: string) {
  return MARKETING_CATEGORY_CARDS.find((card) => card.href === href);
}
