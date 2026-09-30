import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { WebsiteEnquiry } from "@/components/WebsiteEnquiry";
import { WebsiteStickyCta } from "@/components/WebsiteStickyCta";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const googleIpsos = "https://business.google.com/in/think/consumer-insights/insights-apac-traveler-behaviors/";
const thaiStudy = "https://so03.tci-thaijo.org/index.php/art/article/view/288881";

const tools = [
  { name: "WordPress", src: "/brand/tools/wordpress.webp", mark: "plain", kind: "cms" },
  { name: "Cursor", src: "/brand/tools/cursor.png", mark: "plain", kind: "dev" },
  { name: "Claude", src: "/brand/tools/claude.png", mark: "wordmark", kind: "dev" },
  { name: "Manus", src: "/brand/tools/manus.png", mark: "tile", kind: "dev" },
] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "ออกแบบเว็บไซต์โรงแรม",
    title: "เว็บไซต์ที่ทำให้ลูกค้ามั่นใจก่อนจอง และทีมโรงแรมใช้งานต่อได้จริง",
    lead: "ลูกค้าอาจพบโรงแรมจาก OTA, Google Maps หรือโซเชียลมีเดีย แล้วเข้ามาดูเว็บไซต์ทางการเพื่อเช็กห้องพัก ทำเล ราคา และเงื่อนไขอีกครั้ง เว็บไซต์ที่ดีจึงต้องแสดงตัวตนของโรงแรม ตอบคำถามสำคัญ และพาลูกค้าไปสู่การติดต่อหรือจองได้สะดวก",
    leadClose:
      "เดอะ เคพีไอ พลัส ช่วยวางโครงสร้าง ออกแบบ และพัฒนาเว็บไซต์ให้เชื่อมกับเป้าหมายด้านรายได้และการจองตรง โดยเลือก CMS หรือแนวทางพัฒนาตามสิ่งที่โรงแรมต้องการ ไม่ยึดติดกับเครื่องมือเดียว",
    cta: "ให้ทีมดูเว็บไซต์โรงแรมของคุณ",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม ลิงก์เว็บไซต์เดิม และสิ่งที่อยากปรับ",
    photoAlt: "ลูกค้าเปิดเว็บไซต์โรงแรมบนมือถือเพื่อดูห้องพักก่อนจอง",
    whyTitle: "ทำไมเว็บไซต์ทางการจึงช่วยสร้างความมั่นใจ?",
    whyBody:
      "งานสำรวจผู้เดินทางในหลายประเทศเอเชียแปซิฟิก รวมประเทศไทย พบว่า มากกว่า 3 ใน 5 ของผู้ตอบในแต่ละตลาดต้องมั่นใจก่อนจอง และมากกว่าครึ่งตรวจสอบข้อมูลการเดินทางจากแหล่งอื่นเพิ่มเติม เว็บไซต์ทางการจึงเป็นที่ที่โรงแรมควรให้ข้อมูลห้องพักและเงื่อนไขที่ชัดเจน ตรวจสอบได้ และตรงกับช่องทางอื่น",
    whyStudy:
      "งานวิจัยในประเทศไทยปี 2025 กับผู้ตอบ 510 คน ยังพบว่าราคาและเงื่อนไขการยกเลิกมีผลร่วมกันต่อความตั้งใจจอง เว็บไซต์จึงควรช่วยให้ลูกค้าเข้าใจทั้งสิ่งที่จะได้รับ ราคา และเงื่อนไขก่อนกดจอง",
    sourceLabel: "ที่มา",
    sourceGoogle: "Google/Ipsos – พฤติกรรมผู้เดินทางในเอเชียแปซิฟิก",
    sourceThai: "งานวิจัยเรื่องราคาและเงื่อนไขการยกเลิกในการจองโรงแรมออนไลน์ในไทย",
    questionsTitle: "เว็บไซต์โรงแรมของคุณตอบคำถามเหล่านี้ได้ไหม?",
    questions: [
      "ห้องพักแต่ละประเภทต่างกันอย่างไร และภาพตรงกับประสบการณ์จริงหรือไม่?",
      "โรงแรมอยู่ตรงไหน เดินทางอย่างไร และอยู่ใกล้อะไร?",
      "ราคาที่แสดงรวมอะไรบ้าง มีเงื่อนไขการยกเลิกอย่างไร?",
      "ลูกค้าหาปุ่มจองหรือช่องทางติดต่อได้ง่ายบนมือถือหรือไม่?",
      "เมื่อกดจองแล้ว ไปสู่ระบบจองที่ชัดเจนและใช้งานต่อได้หรือไม่?",
      "ทีมโรงแรมแก้ข้อมูลห้องพัก โปรโมชั่น และภาพได้สะดวกแค่ไหน?",
    ],
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยอะไร?",
    help: [
      ["01", "วางเว็บไซต์จากมุมมองของผู้เข้าพัก", "จัดหน้าและลำดับข้อมูลให้ลูกค้าเข้าใจโรงแรม ตั้งแต่ภาพรวม ห้องพัก ทำเล สิ่งอำนวยความสะดวก ไปจนถึงข้อเสนอและวิธีจอง"],
      ["02", "เล่าเรื่องโรงแรมด้วยข้อมูลและภาพจริง", "พัฒนาเนื้อหาที่แสดงจุดเด่นโดยไม่กล่าวเกินจริง พร้อมวางรายการภาพที่มีอยู่และภาพที่ควรจัดทำเพิ่ม"],
      ["03", "ออกแบบให้ใช้งานง่ายบนมือถือ", "ดูทั้งการอ่าน การนำทาง ความเร็วของหน้า ปุ่มติดต่อ และเส้นทางไปหน้าจองบนอุปกรณ์ที่ลูกค้าใช้งานจริง"],
      ["04", "เชื่อมระบบจองและการวัดผล", "ตรวจว่าหน้าห้องพักและข้อเสนอพาลูกค้าไปยัง Booking Engine ได้ชัด พร้อมตั้งค่าการวัดผลตามความสามารถของเว็บไซต์และระบบจอง"],
      ["05", "ทำให้ทีมโรงแรมดูแลเว็บต่อได้", "เลือกวิธีจัดการเนื้อหาให้เหมาะกับคนที่จะใช้งานจริง หากทีมต้องอัปเดตรูป ข้อความ หรือโปรโมชั่นเอง เว็บไซต์ควรมีขั้นตอนแก้ไขที่เข้าใจง่ายและกำหนดสิทธิ์ได้เหมาะสม"],
    ],
    cmsTitle: "ใช้ CMS และเครื่องมือแบบไหน?",
    cmsBody:
      "เราเลือกเทคโนโลยีจากความต้องการของโรงแรม เช่น จำนวนหน้าที่ต้องดูแล ความถี่ในการเปลี่ยนเนื้อหา ระบบจองที่ต้องเชื่อม งบประมาณ และผู้ที่จะรับผิดชอบเว็บไซต์หลังเปิดใช้",
    cmsWordpress:
      "WordPress อาจเหมาะกับโรงแรมที่ต้องการระบบจัดการเนื้อหาซึ่งทีมคุ้นเคยอยู่แล้ว ส่วนโรงแรมที่มีข้อกำหนดต่างออกไปสามารถพิจารณา CMS หรือเว็บไซต์ที่พัฒนาตามความต้องการได้ ทีมจะตรวจความเข้ากันได้ของระบบจอง โฮสติ้ง และการดูแลระยะยาวก่อนเสนอแนวทาง",
    cmsTools:
      "ในการวางแผน ออกแบบ และพัฒนา ทีมสามารถใช้เครื่องมืออย่าง Cursor, Claude และ Manus เพื่อช่วยจัดการงานและทำต้นแบบได้ แต่สิ่งที่โรงแรมได้รับคือเว็บไซต์ที่ใช้งานและดูแลต่อได้ ไม่จำเป็นต้องเรียนรู้เครื่องมือเหล่านั้นเพื่อแก้ไขเนื้อหาประจำวัน",
    newTitle: "สร้างเว็บไซต์ใหม่หรือปรับเว็บเดิม?",
    newBody:
      "ไม่จำเป็นต้องสร้างใหม่ทุกครั้ง หากเว็บไซต์เดิมแก้เนื้อหาได้ ใช้งานบนมือถือสะดวก และเชื่อมระบบจองได้ ทีมอาจแนะนำให้ปรับโครงสร้าง หน้าห้องพัก ภาพ หรือข้อความก่อน",
    newClose: "หากระบบเดิมจำกัดการใช้งานหรือดูแลต่อยาก เราจะอธิบายเหตุผลและขอบเขตของการสร้างใหม่ให้โรงแรมเห็นก่อนตัดสินใจ",
    methodTitle: "วิธีทำงาน",
    steps: [
      ["01", "เข้าใจโรงแรม", "ดูกลุ่มลูกค้า ห้องพัก จุดเด่น เว็บไซต์เดิม และระบบจอง"],
      ["02", "วางโครงสร้าง", "กำหนดหน้าที่จำเป็น ข้อมูลที่ลูกค้าต้องเห็น และเส้นทางติดต่อหรือจอง"],
      ["03", "เลือกวิธีพัฒนา", "พิจารณา CMS เครื่องมือ และการเชื่อมต่อให้เหมาะกับทีมและระบบที่โรงแรมมี"],
      ["04", "ออกแบบและพัฒนา", "ทำงานร่วมกับโรงแรมเพื่อยืนยันภาพ ข้อความ ราคา และเงื่อนไข"],
      ["05", "ตรวจและส่งมอบ", "ทดสอบมือถือ ลิงก์ ระบบจอง แบบฟอร์ม และการวัดผล พร้อมเตรียมวิธีดูแลเนื้อหาหลังเปิดใช้"],
    ],
    toolsTitle: "เครื่องมือที่ทีมใช้ตามความเหมาะสม",
    toolsBody: "เราเลือกใช้ตามงาน ไม่ได้บังคับโรงแรมให้เลือกหนึ่งในนี้เป็นระบบเว็บไซต์",
    cmsExample: "ตัวอย่าง CMS",
    devAid: "เครื่องมือช่วยพัฒนา",
    measureTitle: "เราวัดผลอะไร?",
    measureBody: "เราดูการเข้าชมหน้าสำคัญ การใช้งานบนมือถือ การกดติดต่อ และการคลิกเข้าสู่ระบบจอง หาก Booking Engine ส่งข้อมูลกลับมาได้ จึงดูการจองสำเร็จร่วมด้วย",
    measureNote: "การคลิกปุ่มจองไม่เท่ากับการจองสำเร็จ ทีมจะระบุให้ชัดว่าระบบของโรงแรมติดตามผลได้ถึงขั้นใด",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับเว็บไซต์ การค้นหา และการจองตรง",
    details: "ดูรายละเอียด",
    toolName: "ตรวจสุขภาพการค้นหาเว็บไซต์",
    toolBody: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าหาข้อมูลห้องพักและเดินทางไปจองต่อหรือไม่",
    toolCta: "ใช้เครื่องมือฟรี",
    conversionTitle: "เพิ่มการจองผ่านเว็บไซต์",
    conversionBody: "เมื่อโครงสร้างเว็บพร้อมแล้ว เส้นทางจากหน้าห้องพักสู่การสอบถามหรือจองยังต้องชัดพอให้เดินต่อได้",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Hotel Website Design",
    title: "A website that helps guests feel sure before they book, and that the hotel team can keep using",
    lead: "A guest may find the hotel on an OTA, Google Maps, or social media, then open the official website to check the rooms, the location, the rate, and the conditions again. A useful website shows the hotel clearly, answers the important questions, and makes it easy to enquire or book.",
    leadClose:
      "The KPI Plus helps plan, design, and build the website so it connects to the hotel’s revenue and direct-booking goal. We choose a CMS or a development approach from what the hotel needs, not from a single tool.",
    cta: "Ask the team to review the hotel website",
    secondary: "All solutions",
    underCta: "Send the hotel name, the current website, and what you want to change.",
    photoAlt: "A guest opening a hotel website on a phone to check rooms before booking",
    whyTitle: "Why does an official website help guests feel sure?",
    whyBody:
      "A traveller study across several Asia-Pacific markets, including Thailand, found that more than three in five respondents in each market need to feel sure before they book, and more than half check travel details from another source. The official website is where the hotel should give clear, checkable room and condition facts that match other channels.",
    whyStudy:
      "A 2025 study in Thailand with 510 respondents also found that price and cancellation terms together affect booking intention. The website should help the guest understand what they will get, the rate, and the conditions before they book.",
    sourceLabel: "Source",
    sourceGoogle: "Google/Ipsos – Asia-Pacific traveller behaviour",
    sourceThai: "Research on price and cancellation terms in online hotel booking in Thailand",
    questionsTitle: "Can this hotel website answer these questions?",
    questions: [
      "How do the room types differ, and do the photos match the real stay?",
      "Where is the hotel, how do guests get there, and what is nearby?",
      "What does the shown rate include, and what are the cancellation terms?",
      "Can a guest find the book button or a contact path easily on a phone?",
      "After they tap Book, do they reach a clear booking system they can use?",
      "How easily can the hotel team update rooms, offers, and photos?",
    ],
    helpTitle: "What The KPI Plus helps with",
    help: [
      ["01", "Plan the site from the guest’s point of view", "Arrange the pages and the order of facts so guests understand the hotel, from the overview, rooms, location, and facilities through to the offer and how to book."],
      ["02", "Tell the hotel story with real facts and photos", "Develop copy that shows the strengths without overstating them, and list which photos already exist and which ones still need to be made."],
      ["03", "Design for easy use on a phone", "Review reading, navigation, page speed, contact buttons, and the path to the booking page on the devices guests actually use."],
      ["04", "Connect the booking system and measurement", "Check that room and offer pages send guests clearly into the booking engine, and set measurement according to what the website and booking system can actually report."],
      ["05", "Make the site something the hotel team can look after", "Choose a content method that fits the people who will use it. If the team will update photos, copy, or offers themselves, the edit steps should be easy to understand and the access rights should be set."],
    ],
    cmsTitle: "Which CMS and tools do we use?",
    cmsBody:
      "We choose the technology from the hotel’s needs: how many pages must be looked after, how often content changes, which booking system must connect, the budget, and who will own the website after launch.",
    cmsWordpress:
      "WordPress can fit a hotel that wants a content system the team already knows. A hotel with different requirements can consider another CMS or a site built to those needs. The team checks booking-system fit, hosting, and long-term care before recommending a path.",
    cmsTools:
      "In planning, design, and development, the team can use tools such as Cursor, Claude, and Manus to manage the work and make prototypes. What the hotel receives is a website it can use and look after. The hotel does not need to learn those tools to change everyday content.",
    newTitle: "A new website, or improve the current one?",
    newBody:
      "A rebuild is not always needed. If the current site can be edited, works on a phone, and can connect to the booking system, the team may first recommend changing the structure, room pages, photos, or copy.",
    newClose: "If the current system limits use or is hard to look after, we explain the reason and the scope of a new build before the hotel decides.",
    methodTitle: "How the work runs",
    steps: [
      ["01", "Understand the hotel", "Guests, rooms, strengths, the current website, and the booking system."],
      ["02", "Plan the structure", "Name the pages that are needed, the facts guests must see, and the path to contact or book."],
      ["03", "Choose how to build it", "Review the CMS, tools, and connections that fit the hotel team and the systems already in place."],
      ["04", "Design and develop", "Work with the hotel to confirm photos, copy, rates, and conditions."],
      ["05", "Check and hand over", "Test phones, links, the booking system, forms, and measurement, and prepare how content will be looked after after launch."],
    ],
    toolsTitle: "Tools the team uses when they fit the work",
    toolsBody: "We choose them for the task. The hotel is not asked to pick one of these as its website system.",
    cmsExample: "CMS example",
    devAid: "Development aid",
    measureTitle: "What do we measure?",
    measureBody: "We look at visits to key pages, use on a phone, contact clicks, and clicks into the booking system. If the booking engine can send data back, we also review completed bookings.",
    measureNote: "A click on Book is not a completed booking. The team will say clearly how far the hotel’s systems can track the result.",
    relatedTitle: "Related reading on the website, search, and direct booking",
    details: "Read more",
    toolName: "Hotel searchability check",
    toolBody: "See whether the pages are ready for a guest to find room facts and continue to a booking.",
    toolCta: "Use the free tool",
    conversionTitle: "Website Conversion",
    conversionBody: "Once the site structure is ready, the path from a room page to an enquiry or booking still has to be clear enough to continue.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Дизайн сайта отеля",
    title: "Сайт, который помогает гостю уверенно забронировать, и который команда отеля может дальше вести",
    lead: "Гость может найти отель на OTA, в Google Maps или в соцсетях, затем открыть официальный сайт, чтобы ещё раз проверить номера, локацию, цену и условия. Полезный сайт показывает отель ясно, отвечает на важные вопросы и ведёт к контакту или брони.",
    leadClose:
      "The KPI Plus помогает спланировать, спроектировать и разработать сайт так, чтобы он был связан с целью по доходу и прямому бронированию. CMS или способ разработки выбираем по потребности отеля, а не по одному инструменту.",
    cta: "Попросить команду посмотреть сайт отеля",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, текущий сайт и что хотите изменить.",
    photoAlt: "Гость открывает сайт отеля на телефоне, чтобы посмотреть номера перед бронью",
    whyTitle: "Почему официальный сайт помогает гостю чувствовать уверенность?",
    whyBody:
      "Исследование путешественников в нескольких рынках Азиатско-Тихоокеанского региона, включая Таиланд, показало: больше трёх из пяти респондентов на каждом рынке хотят уверенности перед бронью, и больше половины дополнительно проверяют данные о поездке из другого источника. Официальный сайт — место, где отель должен дать ясные, проверяемые факты о номерах и условиях, совпадающие с другими каналами.",
    whyStudy:
      "Исследование 2025 года в Таиланде среди 510 респондентов также показало, что цена и условия отмены вместе влияют на намерение забронировать. Сайт должен помочь гостю понять, что он получит, какова цена и какие условия, до нажатия «забронировать».",
    sourceLabel: "Источник",
    sourceGoogle: "Google/Ipsos – поведение путешественников в Азиатско-Тихоокеанском регионе",
    sourceThai: "Исследование цены и условий отмены при онлайн-бронировании отелей в Таиланде",
    questionsTitle: "Отвечает ли сайт отеля на эти вопросы?",
    questions: [
      "Чем типы номеров отличаются и совпадают ли фото с реальным пребыванием?",
      "Где отель, как добраться и что рядом?",
      "Что входит в показанную цену и какие условия отмены?",
      "Легко ли на телефоне найти кнопку брони или путь для связи?",
      "После нажатия «забронировать» гость попадает в понятную систему брони, которой можно пользоваться?",
      "Насколько удобно команде отеля менять номера, акции и фото?",
    ],
    helpTitle: "Чем помогает The KPI Plus",
    help: [
      ["01", "Планировать сайт с точки зрения гостя", "Выстроить страницы и порядок фактов так, чтобы гость понял отель: обзор, номера, локация, удобства, предложение и способ брони."],
      ["02", "Рассказать об отеле реальными фактами и фото", "Сделать тексты, которые показывают сильные стороны без преувеличения, и составить список уже существующих и ещё нужных фото."],
      ["03", "Сделать удобным на телефоне", "Смотреть чтение, навигацию, скорость страниц, кнопки связи и путь к брони на устройствах, которыми гости реально пользуются."],
      ["04", "Связать систему брони и измерение", "Проверить, что страницы номеров и предложений ясно ведут в booking engine, и настроить измерение по тому, что сайт и система брони реально могут отдать."],
      ["05", "Сделать сайт таким, чтобы команда отеля могла его вести", "Выбрать способ управления контентом под тех, кто будет им пользоваться. Если команда сама обновляет фото, тексты или акции, шаги правки должны быть понятны, а права доступа заданы."],
    ],
    cmsTitle: "Какой CMS и какие инструменты мы используем?",
    cmsBody:
      "Технологию выбираем по потребности отеля: сколько страниц нужно вести, как часто меняется контент, какую систему брони надо связать, какой бюджет и кто будет отвечать за сайт после запуска.",
    cmsWordpress:
      "WordPress может подойти отелю, которому нужна система контента, которую команда уже знает. Если требования другие, можно рассмотреть другой CMS или сайт, сделанный под эти нужды. Команда проверяет совместимость с системой брони, хостинг и долгосрочный уход, прежде чем предложить путь.",
    cmsTools:
      "В планировании, дизайне и разработке команда может использовать инструменты вроде Cursor, Claude и Manus, чтобы вести работу и делать прототипы. Отель получает сайт, которым можно пользоваться и который можно вести дальше. Учиться этим инструментам, чтобы менять повседневный контент, не нужно.",
    newTitle: "Новый сайт или доработать текущий?",
    newBody:
      "Не всегда нужно делать заново. Если текущий сайт можно править, он удобен на телефоне и его можно связать с системой брони, команда может сначала предложить изменить структуру, страницы номеров, фото или тексты.",
    newClose: "Если текущая система ограничивает работу или её трудно вести, мы объясним причину и объём новой разработки до решения отеля.",
    methodTitle: "Как идёт работа",
    steps: [
      ["01", "Понять отель", "Гости, номера, сильные стороны, текущий сайт и система брони."],
      ["02", "Спланировать структуру", "Назвать нужные страницы, факты, которые гость должен увидеть, и путь к контакту или брони."],
      ["03", "Выбрать способ разработки", "Посмотреть CMS, инструменты и связи, подходящие команде отеля и уже имеющимся системам."],
      ["04", "Спроектировать и разработать", "Работать с отелем, чтобы подтвердить фото, тексты, цены и условия."],
      ["05", "Проверить и передать", "Протестировать телефон, ссылки, систему брони, формы и измерение, и подготовить, как вести контент после запуска."],
    ],
    toolsTitle: "Инструменты, которые команда использует по задаче",
    toolsBody: "Мы выбираем их под работу. Отелю не предлагают выбрать один из них как систему сайта.",
    cmsExample: "пример CMS",
    devAid: "вспомогательный инструмент",
    measureTitle: "Что мы измеряем?",
    measureBody: "Смотрим визиты ключевых страниц, использование с телефона, клики на связь и переходы в систему брони. Если booking engine отдаёт данные, смотрим и завершённые брони.",
    measureNote: "Клик по кнопке брони — это ещё не завершённая бронь. Команда ясно скажет, до какого шага системы отеля могут отследить результат.",
    relatedTitle: "Материалы про сайт, поиск и прямое бронирование",
    details: "Подробнее",
    toolName: "Проверка поисковой готовности сайта",
    toolBody: "Посмотреть, готовы ли страницы к тому, чтобы гость нашёл факты о номерах и дошёл до брони.",
    toolCta: "Использовать бесплатный инструмент",
    conversionTitle: "Website Conversion",
    conversionBody: "Когда структура сайта готова, путь со страницы номера к вопросу или брони всё равно должен быть достаточно ясным, чтобы гость пошёл дальше.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "飯店網站設計",
    title: "讓客人在預訂前更有把握，也讓飯店團隊之後用得下去的網站",
    lead: "客人可能先從 OTA、Google Maps 或社群媒體找到飯店，再打開官方網站核對客房、位置、價格與條件。有用的網站要能清楚呈現飯店、回答重要問題，並讓客人方便詢問或預訂。",
    leadClose:
      "The KPI Plus 協助規劃、設計與開發網站，讓它接上飯店的收益與直銷預訂目標。CMS 或開發方式依飯店需求選擇，不綁單一工具。",
    cta: "請團隊查看飯店網站",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、現有網站，以及想調整的地方。",
    photoAlt: "客人用手機打開飯店網站，在預訂前查看客房",
    whyTitle: "為什麼官方網站能幫助客人更有把握？",
    whyBody:
      "一項涵蓋多個亞太市場、包括泰國的旅客調查發現，各市場超過五分之三的受訪者預訂前需要感到有把握，超過一半會再從其他來源核對行程資料。官方網站因此應提供清楚、可核對、並與其他通路一致的客房與條件資訊。",
    whyStudy:
      "2025 年泰國一項 510 人的研究也發現，價格與取消條件會共同影響預訂意向。網站應幫助客人在按下預訂前，理解將得到什麼、價格如何，以及條件是什麼。",
    sourceLabel: "來源",
    sourceGoogle: "Google/Ipsos – 亞太旅客行為",
    sourceThai: "泰國線上飯店預訂之價格與取消條件研究",
    questionsTitle: "這間飯店的網站答得了這些問題嗎？",
    questions: [
      "各房型差在哪裡，照片是否符合實際入住體驗？",
      "飯店在哪、怎麼去，附近有什麼？",
      "顯示的價格包含什麼，取消條件如何？",
      "客人在手機上是否容易找到預訂按鈕或聯絡方式？",
      "按下預訂後，是否進入清楚、用得下去的預訂系統？",
      "飯店團隊要改客房資料、促銷與照片，方便嗎？",
    ],
    helpTitle: "The KPI Plus 能幫什麼？",
    help: [
      ["01", "從入住者的角度規劃網站", "安排頁面與資訊順序，讓客人理解飯店：從總覽、客房、位置、設施，到方案與預訂方式。"],
      ["02", "用真實資料與照片說飯店的故事", "撰寫能呈現特色、但不誇大的內容，並列出現有照片與還需要補拍的照片。"],
      ["03", "設計成手機上好用", "檢視閱讀、導覽、頁面速度、聯絡按鈕，以及到預訂頁的路徑，並以客人實際使用的裝置來看。"],
      ["04", "接上預訂系統與成效追蹤", "檢查客房與方案頁是否清楚帶客人進入 Booking Engine，並依網站與預訂系統實際能回傳的資料設定追蹤。"],
      ["05", "讓飯店團隊之後帶得動網站", "選擇適合實際使用者的內容管理方式。若團隊要自己更新照片、文字或促銷，修改步驟應好懂，權限也應設定妥當。"],
    ],
    cmsTitle: "會用哪一種 CMS 和工具？",
    cmsBody:
      "我們依飯店需求選擇技術：要照顧多少頁、內容多久改一次、要接哪套預訂系統、預算多少，以及上線後誰負責網站。",
    cmsWordpress:
      "若飯店需要團隊已經熟悉的內容管理系統，WordPress 可能合適。需求不同的飯店，也可以考慮其他 CMS，或依需求開發的網站。團隊會先檢查預訂系統相容性、主機與長期維護，再提出做法。",
    cmsTools:
      "在規劃、設計與開發時，團隊可以使用 Cursor、Claude 與 Manus 等工具協助管理工作與製作原型。飯店拿到的是用得下去、也帶得動的網站，不必為了日常改內容而去學這些工具。",
    newTitle: "做新網站，還是改現有網站？",
    newBody:
      "不必每次都重做。若現有網站改得了內容、手機好用，也能接預訂系統，團隊可能先建議調整結構、客房頁、照片或文字。",
    newClose: "若現有系統限制使用，或之後很難照顧，我們會先說明重做的原因與範圍，再讓飯店決定。",
    methodTitle: "怎麼進行",
    steps: [
      ["01", "先理解飯店", "客群、客房、特色、現有網站與預訂系統。"],
      ["02", "規劃結構", "確定必要頁面、客人必須看到的資訊，以及詢問或預訂路徑。"],
      ["03", "選擇開發方式", "依飯店團隊與現有系統，考慮 CMS、工具與串接。"],
      ["04", "設計與開發", "與飯店一起確認照片、文字、價格與條件。"],
      ["05", "檢查並交付", "測試手機、連結、預訂系統、表單與追蹤，並準備上線後如何照顧內容。"],
    ],
    toolsTitle: "團隊依工作需要使用的工具",
    toolsBody: "我們依任務選用，不會要求飯店從這裡面選一個當網站系統。",
    cmsExample: "CMS 範例",
    devAid: "開發輔助工具",
    measureTitle: "我們量什麼？",
    measureBody: "我們看重要頁面的造訪、手機使用、聯絡點擊，以及進入預訂系統的點擊。若 Booking Engine 能回傳資料，才一併看完成的預訂。",
    measureNote: "點擊預訂按鈕，不等於預訂成功。團隊會清楚說明飯店系統追蹤得到哪一步。",
    relatedTitle: "與網站、搜尋和直銷預訂相關的內容",
    details: "查看詳情",
    toolName: "網站搜尋健康檢查",
    toolBody: "查看頁面是否已準備好，讓客人找到客房資訊並走到預訂。",
    toolCta: "使用免費工具",
    conversionTitle: "Website Conversion",
    conversionBody: "網站結構就緒後，從客房頁走到詢問或預訂的路徑，仍須清楚到足以讓客人繼續。",
  },
} as const;

function toolMarkClass(mark: (typeof tools)[number]["mark"]) {
  if (mark === "tile") return "kpi-tool-mark-tile";
  if (mark === "wordmark") return "kpi-tool-wordmark";
  return "kpi-tool-mark";
}

export function WebsiteView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const conversionHref = existingHref("/solutions/hotel-direct-bookings", locale);
  const toolHref = existingHref("/tools/hotel-searchability-check", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-website-design", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/hotel-website-design", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#website-enquiry" className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href={solutions} className="kpi-button-ghost">
            {t.secondary}
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/64">{t.underCta}</p>
      </PageHero>

      <section className="kpi-section">
        <div className="kpi-split">
          <div>
            <h2 className="kpi-h2">{t.whyTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555555]">{t.whyBody}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#3B3B3B]">{t.whyStudy}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#555555]">
              {t.sourceLabel}:{" "}
              <a href={googleIpsos} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                {t.sourceGoogle}
              </a>
              {" · "}
              <a href={thaiStudy} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                {t.sourceThai}
              </a>
            </p>
          </div>
          <figure className="kpi-home-photo">
            <img src="/media/kpi-grow-demand_24299cd0.jpg" alt={t.photoAlt} width={1200} height={900} />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.questionsTitle}</h2>
          <div className="mt-10 grid gap-4">
            {t.questions.map((item, index) => (
              <article key={item} className="kpi-card flex gap-4 p-6">
                <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-7 text-[#555555]">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-section">
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
        <a href="#website-enquiry" className="kpi-button mt-10">
          {t.cta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.cmsTitle}</h2>
          <p className="kpi-lead mt-5">{t.cmsBody}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.cmsWordpress}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.cmsTools}</p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.newTitle}</h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.newBody}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.newClose}</p>
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

          <div className="mt-12 rounded-[1.5rem] border border-[#E3E8EB] bg-[#F4F4F4] p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-[#3B3B3B]">{t.toolsTitle}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#555555]">{t.toolsBody}</p>
            <div className="kpi-tool-grid mt-6">
              {tools.map((tool) => (
                <article key={tool.name} className="kpi-tool-card">
                  <img src={tool.src} alt="" className={toolMarkClass(tool.mark)} />
                  <p className="kpi-latin text-base font-extrabold text-[#3B3B3B]">{tool.name}</p>
                  <p className="text-sm leading-6 text-[#555555]">{tool.kind === "cms" ? t.cmsExample : t.devAid}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-lead mt-5">{t.measureBody}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.measureNote}</p>
      </section>

      {toolHref || conversionHref ? (
        <section className="border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.relatedTitle}</h2>
            <div className="kpi-grid-2 mt-10">
              {toolHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.toolName}</h3>
                  <p className="mt-3 text-base leading-7 text-[#555555]">{t.toolBody}</p>
                  <Link href={toolHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.toolCta}
                  </Link>
                </article>
              ) : null}
              {conversionHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/hotel-direct-bookings", locale)}</h3>
                  <p className="mt-3 text-base leading-7 text-[#555555]">{t.conversionBody}</p>
                  <Link href={conversionHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <WebsiteEnquiry locale={locale} />
      <WebsiteStickyCta label={t.cta} />
    </SiteShell>
  );
}
