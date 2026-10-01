import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { SeoLocalEnquiry } from "@/components/SeoLocalEnquiry";
import { SeoLocalStickyCta } from "@/components/SeoLocalStickyCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const relatedInsightHrefs = ["/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on"] as const;

const sources = {
  aiFeatures: "https://developers.google.com/search/docs/appearance/ai-features",
  aiModeTh: "https://blog.google/intl/th-th/products/consumer-products/ai-mode/",
  searchIo: "https://blog.google/intl/th-th/products/consumer-products/search-io-2026/",
  localRank: "https://support.google.com/business/answer/7091?hl=en",
} as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "SEO, Google Maps และ AI Search",
    title: "ให้ลูกค้าค้นพบธุรกิจของคุณ เข้าใจว่าคุณเหมาะกับเขา และติดต่อได้ทันที",
    lead: "วันนี้ลูกค้าไม่ได้ค้นหาเพียงชื่อโรงแรมหรือชื่อร้าน แต่อาจถามว่า “สปาใกล้ฉันที่มีนวดคู่” “คาเฟ่เงียบ ๆ ในภูเก็ต” หรือ “โรงแรมใกล้สนามบินที่เช็กอินดึกได้” จากนั้นดูคำตอบจาก AI เปิด Google Maps อ่านรีวิว และเปรียบเทียบเว็บไซต์ก่อนตัดสินใจ",
    leadClose:
      "เดอะ เคพีไอ พลัส ช่วยจัดข้อมูลบนเว็บไซต์และ Google Business Profile ให้ถูกต้อง ชัดเจน และตอบคำถามที่ลูกค้าถามจริง เพื่อเพิ่มโอกาสให้ธุรกิจถูกค้นพบและพาลูกค้าไปสู่การโทร ขอเส้นทาง สอบถาม หรือจอง",
    cta: "ให้ทีมดูการค้นพบธุรกิจของคุณ",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อธุรกิจ ลิงก์เว็บไซต์หรือ Google Maps และปัญหาที่พบ",
    photoAlt: "ลูกค้าค้นหาธุรกิจท่องเที่ยวและบริการบน Google ก่อนตัดสินใจติดต่อ",
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
      "แนวทาง SEO พื้นฐานยังใช้กับ AI Overviews และ AI Mode ไม่มีวิธีพิเศษที่รับประกันว่าธุรกิจจะปรากฏในคำตอบ AI",
    aiNoteSource: "ที่มา: Google Search Central",
    compareTitle: "SEO, AEO และ Local SEO ช่วยต่างกันอย่างไร?",
    compare: [
      ["SEO", "หน้าเว็บไซต์ที่ตอบสิ่งที่ค้นหา", "เช่น หน้า “โรงแรมใกล้สนามบินภูเก็ต” พร้อมข้อมูลห้องพัก การเดินทาง และวิธีจอง"],
      ["AEO / ความพร้อมสำหรับ AI Search", "ข้อมูลที่ชัดเจนพอให้ระบบค้นหาเข้าใจและนำไปประกอบคำตอบ", "เช่น หน้า FAQ ที่ระบุว่าสปามีบริการอะไร ใช้เวลานานเท่าไร อยู่ที่ไหน และจองอย่างไร"],
      ["Local SEO", "ข้อมูลธุรกิจบน Google Search และ Maps", "เช่น โปรไฟล์คาเฟ่ที่มีเวลาเปิด เมนู รูปจริง รีวิว และปุ่มนำทาง"],
    ],
    compareClose:
      "ทั้งสามส่วนควรใช้ข้อมูลจริงชุดเดียวกัน หากเวลาเปิดบน Maps ไม่ตรงกับเว็บไซต์ หรือหน้าเว็บบอกว่ามีบริการที่ร้านไม่ได้ให้แล้ว ลูกค้าอาจตัดสินใจผิดหรือเสียความเชื่อมั่น",
    problemTitle: "ธุรกิจของคุณกำลังเจอปัญหาเหล่านี้หรือไม่?",
    problems: [
      "มีเว็บไซต์ แต่ค้นหาบริการหรือทำเลที่เกี่ยวข้องแล้วไม่พบหน้าเว็บ",
      "ลูกค้าเห็นธุรกิจบน Maps แต่เวลาเปิด เบอร์โทร รูปภาพ หรือบริการไม่เป็นปัจจุบัน",
      "มีคนเข้าชมเว็บไซต์ แต่หาคำตอบเรื่องราคา บริการ ทำเล หรือวิธีจองไม่เจอ",
      "รีวิวมีอยู่แล้ว แต่ทีมยังไม่ได้ดูประเด็นที่ลูกค้าชื่นชมหรือร้องเรียนเพื่อนำมาปรับข้อมูลธุรกิจ",
      "ไม่ทราบว่าลูกค้าค้นพบธุรกิจผ่านคำค้นใด และกดโทร ขอเส้นทาง หรือเข้าเว็บไซต์ต่อมากน้อยแค่ไหน",
    ],
    problemCta: "ให้ทีมช่วยดูจุดที่ควรปรับก่อน",
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยอะไร?",
    help: [
      ["01", "ทำให้เว็บไซต์ตอบคำถามของลูกค้า", "ดูว่าลูกค้าค้นหาอะไรในพื้นที่และช่วงตัดสินใจ แล้วจัดหน้าเว็บไซต์ให้ตอบได้ชัด เช่น ห้องพักและทำเลสำหรับโรงแรม ประเภททรีตเมนต์สำหรับสปา หรือเมนูและบรรยากาศสำหรับคาเฟ่"],
      ["02", "จัดข้อมูลให้ Google และระบบค้นหาเข้าใจ", "ตรวจโครงสร้างเว็บไซต์ หน้าเป้าหมาย การเชื่อมโยงระหว่างหน้า ข้อมูลธุรกิจ และเนื้อหาที่อาจยังไม่ครบ งานด้าน AI Search เริ่มจากข้อมูลที่ถูกต้องและมีประโยชน์ต่อคนอ่าน ไม่ใช่การใส่คำว่า “AI” เพิ่มลงในหน้าเว็บ"],
      ["03", "ดูแล Google Business Profile อย่างจริงจัง", "ตรวจหมวดหมู่ธุรกิจ ที่อยู่ เวลาเปิด ลิงก์เว็บไซต์ รายการบริการหรือเมนู ภาพถ่าย และข้อมูลที่ลูกค้าใช้ตัดสินใจ รวมถึงวางแนวทางดูแลและตอบรีวิวตามข้อเท็จจริงของธุรกิจ"],
      ["04", "เชื่อมการค้นพบกับการติดต่อและการจอง", "ตรวจว่าหลังลูกค้าพบธุรกิจแล้วสามารถโทร ขอเส้นทาง ส่งคำถาม หรือจองได้สะดวกหรือไม่ เพราะการถูกค้นพบเป็นเพียงจุดเริ่มต้น"],
    ],
    gbpTitle: "ทำไม Google Business Profile สำคัญกับสปา คาเฟ่ และธุรกิจหน้าร้าน?",
    gbpBody:
      "ลูกค้าของธุรกิจเหล่านี้มักต้องตัดสินใจเรื่องระยะทาง เวลาเปิด บริการ และความน่าเชื่อถือก่อนเดินทางไปจริง Business Profile แสดงข้อมูลเหล่านี้บน Search และ Maps และ Google มีข้อมูลประสิทธิภาพให้ดู เช่น การเข้าชมโปรไฟล์ การกดโทร การขอเส้นทาง และการคลิกเข้าเว็บไซต์ ทั้งนี้ตัวชี้วัดที่แสดงอาจต่างกันตามประเภทธุรกิจและการตั้งค่าโปรไฟล์",
    gbpSource: "ที่มา: Google Business Profile Help",
    gbpExample:
      "ตัวอย่างเช่น สปาที่มีหน้าบริการนวดคู่แต่ไม่ระบุเวลาให้บริการหรือวิธีจอง อาจเสียลูกค้าในขั้นตัดสินใจ ส่วนคาเฟ่ที่เวลาเปิดบน Maps ไม่ตรงกับเวลาจริง อาจทำให้ลูกค้าเดินทางมาเสียเที่ยว เรื่องเล็กบนหน้าจอจึงกลายเป็นประสบการณ์จริงของลูกค้า",
    methodTitle: "เราเริ่มทำงานอย่างไร?",
    steps: [
      ["01", "ดูการค้นพบปัจจุบัน", "ตรวจเว็บไซต์ Google Search Console และ Google Business Profile เท่าที่ธุรกิจมีข้อมูลและสิทธิ์เข้าถึง"],
      ["02", "ตรวจข้อมูลที่ลูกค้าต้องใช้ตัดสินใจ", "ดูบริการ ทำเล ราคา เวลาเปิด ภาพ รีวิว และช่องทางติดต่อหรือจอง"],
      ["03", "จัดลำดับงาน", "แยกสิ่งที่ควรแก้ทันทีออกจากงานเนื้อหาและเว็บไซต์ที่ต้องทำต่อเนื่อง"],
      ["04", "ติดตามการเปลี่ยนแปลง", "ดูการค้นพบ การเข้าชมเว็บไซต์ การกดโทร การขอเส้นทาง และการสอบถามหรือจองที่ติดตามได้"],
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
    reviewBody: "ให้ลูกค้าจริงเขียนรีวิวจากลิงก์ที่ทีมส่งได้สะดวก เพื่อดูแลข้อมูลบน Google Maps อย่างต่อเนื่อง",
    reviewCta: "ใช้เครื่องมือฟรี",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "SEO, Google Maps & AI Search",
    title: "Help customers find the business, see why it fits, and contact you at once",
    lead: "People no longer search only the hotel or shop name. They may ask for “a couples massage spa near me”, “a quiet café in Phuket”, or “a hotel near the airport with late check-in”, then read an AI answer, open Google Maps, check reviews, and compare the website before they decide.",
    leadClose:
      "The KPI Plus helps put the website and Google Business Profile in order so the facts are correct, clear, and useful for the questions customers actually ask. That gives the business a better chance of being found, then of a call, a direction request, an enquiry, or a booking.",
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
      "The usual SEO work still applies to AI Overviews and AI Mode. There is no special method that guarantees a business will appear in an AI answer.",
    aiNoteSource: "Source: Google Search Central",
    compareTitle: "How do SEO, AEO, and Local SEO differ?",
    compare: [
      ["SEO", "Website pages that answer the search", "For example, a page for “hotels near Phuket airport” with rooms, how to get there, and how to book."],
      ["AEO / AI Search readiness", "Clear facts a search system can understand and use in an answer", "For example, an FAQ that says what the spa offers, how long it takes, where it is, and how to book."],
      ["Local SEO", "Business information on Google Search and Maps", "For example, a café profile with hours, menu, real photos, reviews, and a directions button."],
    ],
    compareClose:
      "All three should use the same real facts. If Maps hours do not match the website, or the site lists a service the place no longer offers, a customer can decide wrongly or lose trust.",
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

export function SeoLocalView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const insights = insightPosts
    .filter((post) => relatedInsightHrefs.includes(post.href as (typeof relatedInsightHrefs)[number]))
    .filter((post) => existingHref(post.href, locale));

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-seo-google-maps-ai-search", locale)}>
      <PageHero>
        <nav aria-label="Breadcrumb" className="text-sm text-white/70">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={solutions} className="hover:text-white">
                {t.crumb}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              <span className="text-white">{solutionNavLabel("/solutions/hotel-seo-google-maps-ai-search", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#search-enquiry" className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href={solutions} className="kpi-button-ghost">
            {t.secondary}
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/64">{t.underCta}</p>
      </PageHero>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.changeTitle}</h2>
        <div className="kpi-grid-3 mt-10">
          <article className="kpi-card p-6">
            <img src="/brand/google/google.svg" alt="" className="kpi-platform-mark" />
            <h3 className="mt-4 text-lg font-extrabold text-[#3B3B3B]">{t.aiTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-[#555555]">{t.aiBody}</p>
            <p className="mt-4 text-sm">
              <a href={sources.aiModeTh} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                {t.aiSource}
              </a>
            </p>
          </article>
          <article className="kpi-card p-6">
            <img src="/brand/google/google.svg" alt="" className="kpi-platform-mark" />
            <p className="kpi-latin mt-4 text-3xl font-extrabold tracking-[-.04em] text-[#0B1F33]">{t.growthStat}</p>
            <h3 className="mt-3 text-lg font-extrabold text-[#3B3B3B]">{t.growthTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-[#555555]">{t.growthLabel}</p>
            <p className="mt-3 text-xs leading-6 text-[#555555]">{t.growthNote}</p>
            <p className="mt-4 text-sm">
              <a href={sources.searchIo} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                {t.growthSource}
              </a>
            </p>
          </article>
          <article className="kpi-card p-6">
            <img src="/brand/google/business-profile.jpg" alt="" className="h-10 w-auto max-w-[13rem] object-contain" />
            <h3 className="mt-4 text-lg font-extrabold text-[#3B3B3B]">{t.mapsTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-[#555555]">{t.mapsBody}</p>
            <p className="mt-4 text-sm">
              <a href={sources.localRank} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                {t.mapsSource}
              </a>
            </p>
          </article>
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-[#555555]">{t.changeClose}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#555555]">{t.aiNote}</p>
        <p className="mt-2 text-sm">
          <a href={sources.aiFeatures} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
            {t.aiNoteSource}
          </a>
        </p>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.compareTitle}</h2>
          <div className="kpi-grid-3 mt-10">
            {t.compare.map(([title, see, example]) => (
              <article key={title} className="kpi-card relative overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#3B3B3B]">{see}</p>
                <p className="mt-3 text-sm leading-7 text-[#555555]">{example}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-[#555555]">{t.compareClose}</p>
        </div>
      </section>

      <section className="kpi-section">
        <div className="kpi-split">
          <div>
            <h2 className="kpi-h2">{t.problemTitle}</h2>
            <div className="mt-10 grid gap-4">
              {t.problems.map((problem, index) => (
                <article key={problem} className="kpi-card flex gap-4 p-6">
                  <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-7 text-[#555555]">{problem}</p>
                </article>
              ))}
            </div>
            <a href="#search-enquiry" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B6660]">
              {t.problemCta} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <figure className="kpi-home-photo">
            <img src="/media/kpi-grow-demand_24299cd0.jpg" alt={t.photoAlt} width={1200} height={900} />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.helpTitle}</h2>
          <div className="kpi-grid-2 mt-10">
            {t.help.map(([num, title, body]) => (
              <article key={num} className="kpi-card relative overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <span className="kpi-latin text-sm font-black tracking-[.16em] text-[#0B6660]">{num}</span>
                <h3 className="mt-5 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#555555]">{body}</p>
              </article>
            ))}
          </div>
          <a href="#search-enquiry" className="kpi-button mt-10">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="kpi-section">
        <div className="kpi-split">
          <div>
            <h2 className="kpi-h2">{t.gbpTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555555]">{t.gbpBody}</p>
            <p className="mt-4 text-sm">
              <a href={sources.localRank} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                {t.gbpSource}
              </a>
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#555555]">{t.gbpExample}</p>
          </div>
          <figure className="overflow-hidden rounded-[1.5rem] border border-[#E3E8EB] bg-white p-10">
            <img
              src="/brand/google/business-profile.jpg"
              alt="Google Business Profile"
              className="mx-auto w-full max-w-sm object-contain"
            />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.methodTitle}</h2>
          <ol className="mt-10 grid gap-4">
            {t.steps.map(([num, title, body]) => (
              <li key={num} className="kpi-card flex gap-4 p-6 sm:items-start">
                <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">{num}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                  <p className="mt-2 text-base leading-7 text-[#555555]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-lead mt-5">{t.measureWeb}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.measureMaps}</p>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#555555]">{t.measureNote}</p>
      </section>

      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.relatedTitle}</h2>
          <div className="kpi-grid-3 mt-10">
            {insights.map((post) => {
              const href = existingHref(post.href, locale) ?? post.href;
              return (
                <article key={post.slug} className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0B6660]">{post.category[locale]}</p>
                  <h3 className="mt-4 text-xl font-extrabold leading-snug text-[#3B3B3B]">{post.title[locale]}</h3>
                  <Link href={href} className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[#0B6660]">
                    {insightsUi.read} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
            <article className="kpi-card relative flex flex-col overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.toolName}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.toolBody}</p>
              <Link href="/tools/hotel-searchability-check" className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.toolCta}
              </Link>
            </article>
            <article className="kpi-card relative flex flex-col overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.reviewName}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.reviewBody}</p>
              <Link href="/tools/hotel-review-link" className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.reviewCta}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <SeoLocalEnquiry locale={locale} />
      <SeoLocalStickyCta label={t.cta} />
    </SiteShell>
  );
}
