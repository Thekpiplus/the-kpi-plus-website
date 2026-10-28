import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { WebsiteEnquiry } from "@/components/WebsiteEnquiry";
import { WebsiteStickyCta } from "@/components/WebsiteStickyCta";
import { WebsiteCmsStack } from "@/components/hotel-website/WebsiteCmsStack";
import { WebsiteConfidenceVisual } from "@/components/hotel-website/WebsiteConfidenceVisual";
import { WebsiteDecision } from "@/components/hotel-website/WebsiteDecision";
import { WebsiteHeroVisual } from "@/components/hotel-website/WebsiteHeroVisual";
import { WebsiteMeasure } from "@/components/hotel-website/WebsiteMeasure";
import { WebsiteFramework } from "@/components/hotel-website/WebsiteFramework";
import { WebsiteReadinessChecklist } from "@/components/hotel-website/WebsiteReadinessChecklist";
import { PageFaqs } from "@/components/PageFaqs";
import { WebsiteRelated } from "@/components/hotel-website/WebsiteRelated";
import { WebsiteWorkflow } from "@/components/hotel-website/WebsiteWorkflow";
import "@/components/hotel-website/hotel-website-visuals.css";
import type { CmsHotelWebsitePage } from "@/lib/cms/hotel-website-page";
import {
  loadHotelWebsitePage,
  websiteCmsStackVisualUrl,
  websiteConfidenceVisualUrl,
  websiteDecisionVisualUrl,
  websiteFrameworkVisualUrl,
  websiteHeroVisualUrl,
  websiteKpiVisualUrl,
  hotelWebsiteFaqsFromCms,
  websiteRelatedVisualUrl,
  websiteWorkflowVisualUrl,
} from "@/lib/cms/hotel-website-page-public";
import {
  WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
  WEBSITE_CONFIDENCE_PATH,
  WEBSITE_CONFIDENCE_VISUAL,
  WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
  WEBSITE_DECISION_VISUAL_CANDIDATE,
  WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
  WEBSITE_HERO_CAPABILITIES,
  WEBSITE_HERO_VISUAL_CANDIDATE,
  WEBSITE_KPI_VISUAL_CANDIDATE,
  WEBSITE_SOURCES,
  WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
} from "@/lib/hotel-website";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, solutionsIndexHref, type Locale } from "@/lib/seo";

function emphasizePhrase(text: string, em: string, className = "kpi-website-questions-em") {
  const index = text.indexOf(em);
  if (!em || index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className={className}>{em}</span>
      {text.slice(index + em.length)}
    </>
  );
}

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Hotel Website & Direct Booking",
    title: "เว็บไซต์ที่ทำให้ลูกค้ามั่นใจก่อนจอง และทีมโรงแรมใช้งานต่อได้จริง",
    lead: "ลูกค้าควรเข้าใจโรงแรม ห้องพัก ข้อเสนอ เงื่อนไข และทำเลได้ก่อนจอง เว็บไซต์จึงต้องพาจากจุดที่พบโรงแรมไปสู่การจองตรงได้ชัด และทีมโรงแรมแก้เนื้อหาต่อได้หลังส่งมอบ",
    leadClose:
      "The KPI Plus ช่วยออกแบบและพัฒนาเว็บไซต์ให้รองรับการใช้งานจริงด้าน Responsive, CMS, Booking Engine และการวัดผล ตามความสามารถที่โรงแรมต้องใช้",
    cta: "ขอให้ทีมรีวิวเว็บไซต์โรงแรม",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "Responsive · CMS-ready · Booking Engine-ready · Measurement-ready",
    photoAlt: "ตัวอย่างเว็บไซต์โรงแรมและเส้นทางจองตรง แสดงเดสก์ท็อป มือถือ และลำดับ Home ห้องพัก ข้อเสนอ ไปสู่ระบบจอง ไม่ใช่เว็บไซต์ลูกค้าจริง",
    whyTitle: "ทำไมเว็บไซต์ทางการจึงช่วยสร้างความมั่นใจ?",
    whyBody:
      "ต้องการข้อมูลและเงื่อนไขที่ชัดเจนจากแหล่งเพิ่มเติมก่อนตัดสินใจจอง",
    whyStudy:
      "ราคาและเงื่อนไขการยกเลิกมีผลร่วมกันต่อความตั้งใจจอง เว็บไซต์ทางการควรช่วยให้ลูกค้าเห็นรายละเอียดห้องพัก ข้อเสนอ นโยบาย และเส้นทางจองตรงก่อนตัดสินใจ",
    whyContext:
      "ตัวเลขนี้เป็นบริบทจากงานวิจัย ไม่ใช่ผลลัพธ์ที่บริการนี้รับประกัน และไม่ได้แปลว่าเว็บไซต์เพียงอย่างเดียวทำให้เกิดการจองหรือการยกเลิกตามที่รายงาน",
    whyFlowTitle: "ลำดับที่ลูกค้าใช้ตัดสินใจก่อนจอง",
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
    measureBody: "เราดู Engagement, Mobile, Contact Intent และ Booking Outcome การคลิกจองยังไม่ใช่การจองสำเร็จ",
    measureNote: "Booking Outcome จะแสดงได้เมื่อ Booking Engine และ Tracking Event เชื่อมต่อและได้รับอนุญาตให้ใช้ข้อมูล",
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
    lead: "Guests should understand the hotel, rooms, offers, policies, and location before they book. The website can guide them from discovery to a direct booking, and the hotel team can keep updating content after handover.",
    leadClose:
      "The KPI Plus designs and builds the website so it can stay responsive, CMS-ready, booking-engine-ready, and measurement-ready when those capabilities are part of the brief.",
    cta: "Ask the team to review the hotel website",
    secondary: "All solutions",
    underCta: "Responsive · CMS-ready · Booking Engine-ready · Measurement-ready",
    photoAlt: "Sample hotel website and direct booking flow showing desktop, mobile, and Home to Room, Offer, then Booking Engine — not a live client site",
    whyTitle: "Why does an official website help guests feel sure?",
    whyBody:
      "need to feel sure before they book, and more than half check travel details from another source.",
    whyStudy:
      "Price and cancellation terms together affect booking intention. The official website should show room details, the offer, policy, and a direct-booking path before the guest decides.",
    whyContext:
      "These figures are research context, not a result this service guarantees. They do not mean a website alone caused the reported booking or cancellation outcome.",
    whyFlowTitle: "The path guests use before they book",
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
    measureBody: "We look at Engagement, Mobile, Contact Intent, and Booking Outcome. A Book click is not a completed booking.",
    measureNote: "Booking Outcome is shown only when the Booking Engine and tracking events are connected and approved for use.",
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
    photoAlt: "Sample hotel website and direct booking flow showing desktop, mobile, and Home to Room, Offer, then Booking Engine — not a live client site",
    whyTitle: "Почему официальный сайт помогает гостю чувствовать уверенность?",
    whyBody:
      "Исследование путешественников в нескольких рынках Азиатско-Тихоокеанского региона, включая Таиланд, показало: больше трёх из пяти респондентов на каждом рынке хотят уверенности перед бронью, и больше половины дополнительно проверяют данные о поездке из другого источника. Официальный сайт — место, где отель должен дать ясные, проверяемые факты о номерах и условиях, совпадающие с другими каналами.",
    whyStudy:
      "Исследование 2025 года в Таиланде среди 510 респондентов также показало, что цена и условия отмены вместе влияют на намерение забронировать. Сайт должен помочь гостю понять, что он получит, какова цена и какие условия, до нажатия «забронировать».",
    whyContext:
      "These figures are research context, not a result this service guarantees. They do not mean a website alone caused the reported booking or cancellation outcome.",
    whyFlowTitle: "The path guests use before they book",
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
    photoAlt: "Sample hotel website and direct booking flow showing desktop, mobile, and Home to Room, Offer, then Booking Engine — not a live client site",
    whyTitle: "為什麼官方網站能幫助客人更有把握？",
    whyBody:
      "一項涵蓋多個亞太市場、包括泰國的旅客調查發現，各市場超過五分之三的受訪者預訂前需要感到有把握，超過一半會再從其他來源核對行程資料。官方網站因此應提供清楚、可核對、並與其他通路一致的客房與條件資訊。",
    whyStudy:
      "2025 年泰國一項 510 人的研究也發現，價格與取消條件會共同影響預訂意向。網站應幫助客人在按下預訂前，理解將得到什麼、價格如何，以及條件是什麼。",
    whyContext:
      "These figures are research context, not a result this service guarantees. They do not mean a website alone caused the reported booking or cancellation outcome.",
    whyFlowTitle: "The path guests use before they book",
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

export async function WebsiteView({
  locale,
  previewContent,
  embedded,
}: {
  locale: Locale;
  previewContent?: CmsHotelWebsitePage;
  embedded?: boolean;
}) {
  const t = copy[locale];
  const cms = previewContent ? { ...previewContent, fromCms: true } : await loadHotelWebsitePage(locale);
  const fromCms = cms.fromCms;
  const solutions = solutionsIndexHref(locale);
  const dummyHeroSrc = websiteHeroVisualUrl() || "";
  const heroSrc = (() => {
    const cmsSrc = cms.hero.visual.src.trim();
    if (cmsSrc && cmsSrc !== dummyHeroSrc) return cmsSrc;
    return dummyHeroSrc || cmsSrc;
  })();
  const dummyConfidenceSrc = websiteConfidenceVisualUrl() || "";
  const confidenceSrc = (() => {
    const next = cms.confidence.visual.src.trim();
    const blocked = new Set([heroSrc, dummyHeroSrc, WEBSITE_HERO_VISUAL_CANDIDATE, ""]);
    if (next && !blocked.has(next) && next !== dummyConfidenceSrc) return next;
    if (dummyConfidenceSrc && !blocked.has(dummyConfidenceSrc)) return dummyConfidenceSrc;
    return "";
  })();
  const dummyFrameworkSrc = websiteFrameworkVisualUrl() || "";
  const frameworkSrc = (() => {
    const blocked = new Set([
      heroSrc,
      dummyHeroSrc,
      dummyConfidenceSrc,
      WEBSITE_HERO_VISUAL_CANDIDATE,
      WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
      "",
    ]);
    const next = cms.framework.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyFrameworkSrc) return next;
    return dummyFrameworkSrc && !blocked.has(dummyFrameworkSrc) ? dummyFrameworkSrc : "";
  })();
  const dummyCmsSrc = websiteCmsStackVisualUrl() || "";
  const cmsStackSrc = (() => {
    const blocked = new Set([
      heroSrc,
      dummyHeroSrc,
      dummyConfidenceSrc,
      dummyFrameworkSrc,
      WEBSITE_HERO_VISUAL_CANDIDATE,
      WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
      WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
      "",
    ]);
    const next = cms.cms.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyCmsSrc) return next;
    return dummyCmsSrc && !blocked.has(dummyCmsSrc) ? dummyCmsSrc : "";
  })();
  const dummyDecisionSrc = websiteDecisionVisualUrl() || "";
  const decisionSrc = (() => {
    const blocked = new Set([
      heroSrc,
      dummyHeroSrc,
      dummyConfidenceSrc,
      dummyFrameworkSrc,
      dummyCmsSrc,
      WEBSITE_HERO_VISUAL_CANDIDATE,
      WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
      WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
      WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
      "",
    ]);
    const next = cms.rebuild.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyDecisionSrc) return next;
    return dummyDecisionSrc && !blocked.has(dummyDecisionSrc) ? dummyDecisionSrc : "";
  })();
  const dummyWorkflowSrc = websiteWorkflowVisualUrl() || "";
  const workflowSrc = (() => {
    const blocked = new Set([
      heroSrc,
      dummyHeroSrc,
      dummyConfidenceSrc,
      dummyFrameworkSrc,
      dummyCmsSrc,
      dummyDecisionSrc,
      WEBSITE_HERO_VISUAL_CANDIDATE,
      WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
      WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
      WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
      WEBSITE_DECISION_VISUAL_CANDIDATE,
      "",
    ]);
    const next = cms.workflow.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyWorkflowSrc) return next;
    return dummyWorkflowSrc && !blocked.has(dummyWorkflowSrc) ? dummyWorkflowSrc : "";
  })();
  const dummyMeasureSrc = websiteKpiVisualUrl() || "";
  const measureSrc = (() => {
    const blocked = new Set([
      heroSrc,
      dummyHeroSrc,
      dummyConfidenceSrc,
      dummyFrameworkSrc,
      dummyCmsSrc,
      dummyDecisionSrc,
      dummyWorkflowSrc,
      WEBSITE_HERO_VISUAL_CANDIDATE,
      WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
      WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
      WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
      WEBSITE_DECISION_VISUAL_CANDIDATE,
      WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
      "",
    ]);
    const next = cms.measure.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyMeasureSrc) return next;
    return dummyMeasureSrc && !blocked.has(dummyMeasureSrc) ? dummyMeasureSrc : "";
  })();
  const dummyRelatedSrc = websiteRelatedVisualUrl() || "";
  const relatedSrc = (() => {
    const blocked = new Set([
      heroSrc,
      dummyHeroSrc,
      dummyConfidenceSrc,
      dummyFrameworkSrc,
      dummyCmsSrc,
      dummyDecisionSrc,
      dummyWorkflowSrc,
      dummyMeasureSrc,
      WEBSITE_HERO_VISUAL_CANDIDATE,
      WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
      WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
      WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
      WEBSITE_DECISION_VISUAL_CANDIDATE,
      WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
      WEBSITE_KPI_VISUAL_CANDIDATE,
      "",
    ]);
    const next = cms.related.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyRelatedSrc) return next;
    return dummyRelatedSrc && !blocked.has(dummyRelatedSrc) ? dummyRelatedSrc : "";
  })();
  const whySources =
    fromCms && cms.confidence.sources.length
      ? cms.confidence.sources
      : [WEBSITE_SOURCES.googleIpsos, WEBSITE_SOURCES.thaiCancellation];
  const heroCtaHref =
    existingHref(fromCms ? cms.hero.primaryCta.href.trim() || "#website-enquiry" : "#website-enquiry", locale) ||
    "#website-enquiry";
  const heroCtaLabel = fromCms && cms.hero.primaryCta.label.trim() ? cms.hero.primaryCta.label : t.cta;
  const heroSecondaryHref =
    existingHref(fromCms ? cms.hero.secondaryCta.href.trim() || "/solutions" : "/solutions", locale) || solutions;
  const heroSecondaryLabel =
    fromCms && cms.hero.secondaryCta.label.trim() ? cms.hero.secondaryCta.label : t.secondary;
  const heroAlt = locale === "th" ? cms.hero.visual.altTh || t.photoAlt : cms.hero.visual.altEn || t.photoAlt;
  const confidenceAlt =
    locale === "th"
      ? cms.confidence.visual.altTh || WEBSITE_CONFIDENCE_VISUAL.altTh
      : cms.confidence.visual.altEn || WEBSITE_CONFIDENCE_VISUAL.altEn;
  const relatedOverrides = cms.related.cards;
  const faqItems = hotelWebsiteFaqsFromCms(fromCms ? cms : null, locale);
  const inner = (
    <div className="kpi-website">
      <section className="kpi-hero kpi-home-hero-section kpi-website-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-website-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-website-design", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{fromCms ? cms.hero.eyebrow || t.eyebrow : t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {fromCms ? (
                  cms.hero.title || t.title
                ) : locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">
                      เว็บไซต์ที่ทำให้ลูกค้า<span className="kpi-home-accent">มั่นใจก่อนจอง</span>
                    </span>
                    <span className="kpi-home-h1-rest">และทีมโรงแรมใช้งานต่อได้จริง</span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              {locale === "th" ? (
                <p className="kpi-lead kpi-home-lead">
                  ลูกค้าควรเข้าใจโรงแรม ห้องพัก ข้อเสนอ เงื่อนไข และทำเลได้ก่อนจอง
                  เว็บไซต์จึงต้องพาจากจุดที่พบโรงแรมไปสู่การจองตรงได้ชัด
                  และทีมโรงแรมแก้เนื้อหาต่อได้หลังส่งมอบ
                </p>
              ) : (
                <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              )}
              <div className="kpi-actions">
                <a href={heroCtaHref} className="kpi-button kpi-website-hero-cta">
                  {heroCtaLabel} <span aria-hidden="true">↗</span>
                </a>
                <Link href={heroSecondaryHref} className="kpi-button-ghost">
                  {heroSecondaryLabel}
                </Link>
              </div>
              <p className="kpi-website-hero-trust">
                {WEBSITE_HERO_CAPABILITIES.map((item) => (
                  <span key={item} className="kpi-latin">
                    {item}
                  </span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <WebsiteHeroVisual locale={locale} src={heroSrc} alt={heroAlt} status={cms.hero.visual.status} />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-website-why">
        <div className="kpi-website-why-grid">
          <div className="kpi-website-why-copy">
            <h2 className="kpi-h2">
              {locale === "th" ? (
                <>
                  ทำไมเว็บไซต์ทางการจึงช่วย
                  <span className="kpi-website-why-em">สร้างความมั่นใจ</span>?
                </>
              ) : (
                t.whyTitle
              )}
            </h2>
            {locale === "th" || locale === "en" ? (
              <div className="kpi-website-why-findings">
                <article className="kpi-website-why-finding">
                  <p className="kpi-website-why-stat">
                    <span className="kpi-latin kpi-website-why-number">3</span>
                    <span className="kpi-website-why-stat-mid">{locale === "th" ? " ใน " : " in "}</span>
                    <span className="kpi-latin kpi-website-why-number">5</span>
                    <span className="kpi-website-why-stat-label">
                      {locale === "th" ? " นักเดินทาง" : " travellers"}
                    </span>
                  </p>
                  <p className="kpi-website-why-finding-body">{t.whyBody}</p>
                </article>
                <article className="kpi-website-why-finding">
                  <h3>{locale === "th" ? "ราคาและเงื่อนไขมีผลต่อความตั้งใจจอง" : "Price and terms affect booking intent"}</h3>
                  <p className="kpi-website-why-finding-body">{t.whyStudy}</p>
                </article>
              </div>
            ) : (
              <>
                <p className="kpi-website-why-fallback">{t.whyBody}</p>
                <p className="kpi-website-why-fallback">{t.whyStudy}</p>
              </>
            )}
            <p className="kpi-website-why-flow-label">{t.whyFlowTitle}</p>
            <ol className="kpi-website-why-flow">
              {WEBSITE_CONFIDENCE_PATH.map((step, index) => (
                <li key={step.en}>
                  <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <span className={locale === "th" ? undefined : "kpi-latin"}>{locale === "th" ? step.th : step.en}</span>
                </li>
              ))}
            </ol>
            {locale === "th" ? (
              <p className="kpi-website-why-takeaway">
                <span>เว็บไซต์ทางการจึงไม่ใช่แค่ช่องทางขาย</span>
                <span className="kpi-website-why-takeaway-strong">
                  แต่เป็นจุดที่ช่วยยืนยันว่าข้อมูลนี้เชื่อถือได้
                  <span className="kpi-website-why-br"> </span>
                  และจองต่อได้จริง
                </span>
              </p>
            ) : null}
            <p className="kpi-website-why-note">{t.whyContext}</p>
            <div className="kpi-website-why-sources">
              {whySources.map((source) => (
                <p key={source.url}>
                  <span className="kpi-latin">{t.sourceLabel}:</span>{" "}
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.name}
                  </a>
                  <span className="web-source-meta">
                    {source.publishedAt} · {source.market}
                    {source.period ? ` · ${source.period}` : ""}
                    {source.definition ? ` · ${source.definition}` : ""}
                    {` · accessed ${source.accessedAt}`}
                  </span>
                </p>
              ))}
            </div>
          </div>
          <figure className="kpi-website-why-media">
            <WebsiteConfidenceVisual
              locale={locale}
              src={confidenceSrc}
              alt={confidenceAlt}
              status={cms.confidence.visual.status}
            />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-website-questions">
          <h2 className="kpi-h2">
            {locale === "th" ? (
              <>
                <span className="kpi-website-questions-line">เว็บไซต์โรงแรมของคุณ</span>
                <span className="kpi-website-questions-br"> </span>
                <span className="kpi-website-questions-line kpi-website-questions-em">
                  ตอบคำถามเหล่านี้ได้ไหม?
                </span>
              </>
            ) : (
              t.questionsTitle
            )}
          </h2>
          <p className="kpi-website-questions-lead">
            {locale === "th"
              ? "ตรวจจากหลักฐานบนเว็บไซต์ว่าลูกค้าเข้าใจห้องพัก ทำเล ราคา เงื่อนไข และเส้นทางจองได้หรือไม่ สถานะในตารางเป็นตัวอย่างการตรวจ ไม่ใช่คะแนนโรงแรมรายใด"
              : "Review the evidence on the website: rooms, location, price, policy, and the booking path. Status in this table is sample review state, not a scored hotel result."}
          </p>
          <WebsiteReadinessChecklist
            locale={locale}
            questions={fromCms && cms.readiness.items.length ? cms.readiness.items : undefined}
            rows={fromCms && cms.readiness.rows.length ? cms.readiness.rows : undefined}
          />
          {locale === "th" ? (
            <>
              <p className="kpi-website-questions-close">
                <span>เว็บไซต์ที่ดีไม่ควรแค่ดูสวย</span>
                <span className="kpi-website-questions-close-strong">
                  แต่ควรช่วยให้ลูกค้า
                  <span className="kpi-website-questions-br"> </span>
                  เข้าใจ มั่นใจ และเดินต่อไปสู่การจองได้ง่าย
                </span>
              </p>
              <a href="#website-enquiry" className="kpi-website-questions-cta">
                ให้ทีมช่วยดูเว็บไซต์โรงแรมของคุณ
                <span aria-hidden="true">↗</span>
              </a>
            </>
          ) : (
            <a href="#website-enquiry" className="kpi-website-questions-cta">
              {t.cta}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>

      <section className="kpi-section kpi-website-help">
        <h2 className="kpi-h2">{fromCms && cms.framework.title.trim() ? cms.framework.title : t.helpTitle}</h2>
        <WebsiteFramework locale={locale} src={frameworkSrc || cms.framework.visual.src} steps={cms.framework.steps} />
        {locale === "th" ? (
          <a href="#website-enquiry" className="kpi-button kpi-website-help-cta">
            ดูโอกาสเพิ่ม <span className="kpi-latin">Direct Booking</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <a href="#website-enquiry" className="kpi-button kpi-website-help-cta">
            {t.cta} <span aria-hidden="true">↗</span>
          </a>
        )}
      </section>

      <section className="kpi-website-cms border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms.cms.title.trim() ? cms.cms.title : t.cmsTitle}</h2>
          <WebsiteCmsStack
            locale={locale}
            src={cmsStackSrc}
            alt={locale === "th" ? cms.cms.visual.altTh : cms.cms.visual.altEn}
            status={cms.cms.visual.status}
            lead={fromCms && cms.cms.body.trim() ? cms.cms.body : t.cmsBody}
            rows={fromCms && cms.cms.rows.length ? cms.cms.rows : undefined}
            note={fromCms ? cms.cms.note : undefined}
            disclaimer={fromCms ? cms.cms.disclaimer : undefined}
          />
        </div>
      </section>

      <section className="kpi-section kpi-website-new">
        <h2 className="kpi-h2">{fromCms && cms.rebuild.title.trim() ? cms.rebuild.title : t.newTitle}</h2>
        <WebsiteDecision
          locale={locale}
          src={decisionSrc || cms.rebuild.visual.src}
          alt={locale === "th" ? cms.rebuild.visual.altTh : cms.rebuild.visual.altEn}
          status={cms.rebuild.visual.status}
          lead={fromCms && cms.rebuild.body.trim() ? cms.rebuild.body : t.newBody}
          note={fromCms ? cms.rebuild.note : undefined}
          paths={fromCms && cms.rebuild.paths.length ? cms.rebuild.paths : undefined}
          close={
            fromCms && cms.rebuild.close.trim()
              ? cms.rebuild.close
              : locale === "th"
                ? "เราไม่เริ่มจากคำว่า “ต้องทำใหม่” แต่เริ่มจากดูว่าเว็บไซต์เดิมยังพาโรงแรมไปต่อได้แค่ไหน"
                : t.newClose
          }
        />
      </section>

      <section className="kpi-website-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms.workflow.title.trim() ? cms.workflow.title : t.methodTitle}</h2>
          <WebsiteWorkflow
            locale={locale}
            src={workflowSrc}
            alt={locale === "th" ? cms.workflow.visual.altTh : cms.workflow.visual.altEn}
            status={cms.workflow.visual.status}
            steps={cms.workflow.steps}
            handover={fromCms && cms.workflow.handover.length ? cms.workflow.handover : undefined}
          />
        </div>
      </section>

      <section className="kpi-section kpi-website-measure">
        <h2 className="kpi-h2">{fromCms && cms.measure.title.trim() ? cms.measure.title : t.measureTitle}</h2>
        {fromCms && cms.measure.body.trim() ? <p className="kpi-lead mt-5">{cms.measure.body}</p> : <p className="kpi-lead mt-5">{t.measureBody}</p>}
        <WebsiteMeasure
          locale={locale}
          src={measureSrc}
          alt={locale === "th" ? cms.measure.visual.altTh : cms.measure.visual.altEn}
          status={cms.measure.visual.status}
          kpis={cms.measure.kpis.map((kpi) => ({
            id: kpi.id,
            name: kpi.name,
            group: kpi.group,
            period: kpi.period,
            unit: kpi.unit,
            definition: kpi.definition,
            comparison: kpi.comparison,
            market: kpi.market,
            source: kpi.source,
            dataStatus: kpi.dataStatus,
            hideUntilData:
              kpi.group === "outcome" && !(cms.measure.tracking.bookingEngineConfigured && cms.measure.tracking.trackingConfigured)
                ? true
                : kpi.hideUntilData,
            value: kpi.value,
            updatedAt: kpi.updatedAt,
            tone: kpi.tone,
          }))}
          chart={cms.measure.kpis
            .filter((kpi) => kpi.group !== "outcome" && kpi.labels.length && kpi.values.length)
            .map((kpi) => ({
              id: kpi.id,
              name: kpi.name,
              labels: kpi.labels,
              values: kpi.values,
              target: kpi.target || kpi.comparison,
            }))}
          trackingBoundary={fromCms ? cms.measure.tracking.boundary || cms.measure.note : undefined}
          trackingReady={cms.measure.tracking.bookingEngineConfigured && cms.measure.tracking.trackingConfigured}
        />
      </section>

      <section className="kpi-website-related border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">
            {fromCms && cms.related.title.trim()
              ? cms.related.title
              : locale === "th"
                ? (
                    <>
                      <span className="kpi-website-related-line">เรื่องที่เกี่ยวข้องกับเว็บไซต์</span>
                      <span className="kpi-website-related-br"> </span>
                      <span className="kpi-website-related-line">การค้นหา และการจองตรง</span>
                    </>
                  )
                : t.relatedTitle}
          </h2>
          <WebsiteRelated
            locale={locale}
            src={relatedSrc}
            alt={locale === "th" ? cms.related.visual.altTh : cms.related.visual.altEn}
            status={cms.related.visual.status}
            overrides={relatedOverrides}
          />
        </div>
      </section>

      <WebsiteEnquiry locale={locale} helper={fromCms ? cms.form : undefined} />
      <PageFaqs items={faqItems} locale={locale} sectionId="hotel-website-faq" />
      <WebsiteStickyCta label={fromCms && cms.form.submit.trim() ? cms.form.submit : t.cta} />
    </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-website-design", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}
