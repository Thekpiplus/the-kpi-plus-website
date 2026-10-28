import Link from "next/link";
import { ConversionEnquiry } from "@/components/ConversionEnquiry";
import { ConversionStickyCta } from "@/components/ConversionStickyCta";
import { ConversionConfidenceVisual } from "@/components/direct-bookings/ConversionConfidenceVisual";
import { ConversionDecision } from "@/components/direct-bookings/ConversionDecision";
import { ConversionFramework } from "@/components/direct-bookings/ConversionFramework";
import { ConversionFrictionAudit } from "@/components/direct-bookings/ConversionFrictionAudit";
import { ConversionFrictionMap } from "@/components/direct-bookings/ConversionFrictionTable";
import { ConversionHeroVisual } from "@/components/direct-bookings/ConversionHeroVisual";
import { ConversionMeasure } from "@/components/direct-bookings/ConversionMeasure";
import { ConversionRelated } from "@/components/direct-bookings/ConversionRelated";
import { ConversionWorkflow } from "@/components/direct-bookings/ConversionWorkflow";
import "@/components/direct-bookings/conversion-visuals.css";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import type { CmsDirectBookingPage } from "@/lib/cms/hotel-direct-bookings-page";
import {
  directBookingConfidenceVisualUrl,
  directBookingDecisionVisualUrl,
  directBookingFrameworkVisualUrl,
  directBookingFrictionVisualUrl,
  directBookingHeroVisualUrl,
  directBookingMeasureVisualUrl,
  directBookingAuditVisualUrl,
  directBookingEnquiryVisualUrl,
  directBookingRelatedVisualUrl,
  directBookingWorkflowVisualUrl,
  hotelDirectBookingFaqsFromCms,
  loadDirectBookingPage,
} from "@/lib/cms/hotel-direct-bookings-page-public";
import {
  DIRECT_BOOKING_CONFIDENCE_PATH,
  DIRECT_BOOKING_CONFIDENCE_VISUAL,
  DIRECT_BOOKING_HERO_CAPABILITIES,
  DIRECT_BOOKING_HERO_JOURNEY,
  DIRECT_BOOKING_HERO_VISUAL,
  DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
  DIRECT_BOOKING_SOURCES,
} from "@/lib/direct-bookings";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "เพิ่มการจองผ่านเว็บไซต์",
    title: "มีคนเข้าเว็บไซต์แล้ว แต่เขาหยุดก่อนจองตรงไหน?",
    lead: "โรงแรมอาจมีคนเข้าเว็บไซต์จาก SEO หรือโฆษณาแล้ว แต่ลูกค้ายังหยุดก่อนจอง จุดที่ทำให้หยุดอาจเป็น Message Match ข้อมูลห้องพัก ราคาและนโยบาย การใช้บนมือถือ การส่งต่อไป Booking Engine หรือการวัดผล",
    leadClose:
      "เดอะ เคพีไอ พลัส ตรวจเส้นทางตั้งแต่ค้นพบโรงแรมจนถึงจองตรง แล้วสรุปจุดที่ควรปรับเป็นรายการใช้งาน พร้อมขอบเขตการวัดผลที่ระบบรองรับจริง",
    cta: "ขอให้ทีมตรวจเว็บไซต์เพื่อการจองตรง",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งลิงก์เว็บไซต์และหน้าจอง พร้อมบอกจุดที่กังวล",
    photoAlt: "แผนภาพตัวอย่างเส้นทางจองตรง แสดง Website ไป Room Detail ราคาและนโยบาย แล้วส่งต่อไป Booking Engine ไม่ใช่เว็บไซต์ลูกค้าจริง",
    whyTitle: "ลูกค้ายังเปลี่ยนใจได้จนกว่าจะจองสำเร็จ",
    whyBody:
      "งานสำรวจ Google/Ipsos ในหลายตลาดเอเชียแปซิฟิกพบว่า ผู้เดินทางที่สำรวจในประเทศไทยและอินเดียเกือบ 4 ใน 5 เปลี่ยนตัวเลือกด้านการเดินทางก่อนจอง เว็บไซต์โรงแรมจึงมีหน้าที่มากกว่าบอกว่า “มีห้องพักอะไร” แต่ต้องช่วยให้ลูกค้าเปรียบเทียบและมั่นใจในตัวเลือกนั้น",
    whyStudy:
      "งานวิจัยในประเทศไทยกับผู้ตอบ 510 คน พบว่าราคาและเงื่อนไขการยกเลิกมีผลร่วมกันต่อความตั้งใจจอง หากหน้าเว็บแสดงราคาแต่ลูกค้าต้องค้นหาเงื่อนไขเอง ความลังเลอาจเกิดขึ้นในขั้นตอนสำคัญ",
    whyFlowTitle: "ลำดับที่ลูกค้าใช้ตัดสินใจก่อนจองสำเร็จ",
    whyContext:
      "ตัวเลขนี้เป็นบริบทจากงานวิจัย ไม่ใช่ผลที่บริการนี้หรือการแก้เว็บไซต์การันตี และไม่ได้หมายความว่าเดอะ เคพีไอ พลัส หรือเว็บไซต์เพียงอย่างเดียวทำให้เกิดผลจองหรือยกเลิกตามที่รายงาน",
    whyNote:
      "ตัวเลขเหล่านี้อธิบายว่าทำไมหน้าเว็บต้องตอบข้อสงสัยให้ทันจังหวะตัดสินใจ แต่ไม่ได้หมายความว่าการแก้หน้าเว็บจะเพิ่มยอดจองในอัตราเดียวกันทุกโรงแรม",
    sourceLabel: "ที่มา",
    sourceGoogle: "Google/Ipsos – พฤติกรรมผู้เดินทางในเอเชียแปซิฟิก",
    sourceThai: "งานวิจัยเรื่องราคาและเงื่อนไขการยกเลิกในการจองโรงแรมออนไลน์ในไทย",
    stopTitle: "จุดที่มักทำให้ลูกค้าหยุดก่อนจอง",
    stops: [
      "โฆษณาพูดถึงข้อเสนอหนึ่ง แต่หน้าเว็บที่คลิกไปแสดงข้อมูลอีกอย่าง",
      "หน้าห้องพักมีภาพและคำอธิบาย แต่ไม่บอกความต่างของแต่ละประเภทให้ชัด",
      "ราคา สิ่งที่รวมในราคา และเงื่อนไขการยกเลิกหาเจอยาก",
      "ปุ่มจองมองไม่เห็นหรือใช้งานลำบากบนมือถือ",
      "กดจองแล้วเข้าสู่ระบบใหม่ที่หน้าตาและข้อมูลไม่ต่อเนื่องกับเว็บไซต์",
      "โรงแรมเห็นจำนวนคลิกปุ่มจอง แต่ไม่รู้ว่าลูกค้าจองสำเร็จหรือหยุดตรงไหน",
    ],
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยปรับอะไร?",
    checklistTitle: "Friction Audit Checklist",
    checklistLead:
      "รายการนี้ให้ทีมโรงแรมไล่จุดที่มักทำให้ลูกค้าหยุดก่อนจอง สถานะเป็นตัวอย่าง ไม่ได้ตรวจอัตโนมัติทุกข้อ และไม่ใช่ผลโรงแรมจริง",
    help: [
      ["01", "เริ่มจากข้อมูลและการใช้งานจริง", "ดูหน้าที่คนเข้าชมมาก เส้นทางที่พาไปหน้าห้องพัก ปุ่มที่ถูกกด และจุดที่คนออกจากเว็บไซต์ พร้อมทดลองใช้งานจริงบนมือถือ ไม่ตัดสินจากรายงานตัวเลขเพียงอย่างเดียว"],
      ["02", "ทำให้ข้อมูลช่วยตัดสินใจ", "ปรับข้อความและลำดับข้อมูลให้ลูกค้าเห็นความต่างของห้องพัก จุดเด่น ทำเล ราคา ข้อเสนอ และเงื่อนไขที่ต้องรู้ก่อนจอง"],
      ["03", "ทำให้การกระทำถัดไปชัดเจน", "วางปุ่ม “ดูห้องว่าง” “ดูราคา” “จองห้องพัก” หรือ “สอบถาม” ให้เหมาะกับเนื้อหาในแต่ละหน้า ไม่บังคับให้ลูกค้าทุกคนกดปุ่มเดียวกันตั้งแต่ยังไม่รู้รายละเอียด"],
      ["04", "ตรวจเส้นทางไป Booking Engine", "ดูว่าข้อมูลวันที่ ห้องพัก ราคา และข้อเสนอที่ลูกค้าเห็นบนเว็บไซต์สอดคล้องกับระบบจองหรือไม่ หากระบบจองอยู่บนอีกโดเมน จะตรวจความสามารถในการติดตามเส้นทางข้ามระบบร่วมกับผู้ให้บริการ"],
      ["05", "ทดสอบและปรับต่อ", "จัดลำดับจุดที่ควรแก้ก่อน แล้วเทียบผลก่อนและหลังปรับตามข้อมูลที่เก็บได้ หากจำนวนผู้ใช้งานเพียงพอและระบบรองรับ จึงพิจารณาทดสอบหน้าเว็บหรือข้อความหลายรูปแบบ"],
    ],
    vsTitle: "งานนี้ต่างจากการสร้างเว็บไซต์ใหม่อย่างไร?",
    vsBody:
      "บริการนี้เริ่มจากเว็บไซต์ปัจจุบันและเส้นทางลูกค้าที่ใช้จริง เพื่อหาจุดที่ลูกค้าหยุด แล้วปรับระบบเดิมเมื่อแก้ไขได้อย่างปลอดภัย จะเสนอสร้างใหม่เฉพาะเมื่อแพลตฟอร์ม สถาปัตยกรรม กรรมสิทธิ์ ความปลอดภัย หรือการเชื่อมระบบจำกัดการแก้ไข",
    vsClose: "การเลือกปรับหรือสร้างใหม่ขึ้นกับหลักฐานจากเว็บไซต์และระบบจองที่มี ความสามารถของทีมโรงแรม กรรมสิทธิ์ งบประมาณ ระยะเวลา และข้อจำกัดของ Booking Engine ไม่ได้หมายความว่าการสร้างใหม่ดีกว่าเสมอ",
    measureTitle: "เราวัดผลเป็นขั้น ไม่เหมารวมว่าทุกคลิกคือยอดจอง",
    tableStep: "ขั้นตอน",
    tableLook: "สิ่งที่ดู",
    stages: [
      ["เข้าชมเว็บไซต์", "ลูกค้าเข้าหน้าไหน และมาจากช่องทางใด"],
      ["สนใจห้องพัก", "ดูรายละเอียดห้องพัก ข้อเสนอ หรือกดดูราคา"],
      ["เริ่มจอง", "คลิกเข้าสู่ Booking Engine หรือส่งคำถาม"],
      ["จองสำเร็จ", "จำนวนการจองและรายได้ เมื่อระบบจองส่งข้อมูลให้ตรวจสอบได้"],
    ],
    measureNote: "การคลิกปุ่มจองเป็นเพียงสัญญาณเริ่มต้น หาก Booking Engine ไม่ส่งข้อมูลกลับ จะยังไม่ควรรายงานว่าเป็นยอดจองสำเร็จ",
    methodTitle: "วิธีทำงาน",
    steps: [
      ["01", "Review", "ตรวจ Website Analytics หน้าสำคัญ เส้นทางมือถือ รายละเอียดห้องพัก CTA Booking Engine และการวัดผลที่มีอยู่"],
      ["02", "Prioritize", "จัดลำดับหน้าหรือขั้นตอนที่เกี่ยวกับการสอบถามและการเริ่มจองมากที่สุด"],
      ["03", "Adjust", "ปรับข้อความ ข้อมูลห้องพัก ภาพ CTA ราคา นโยบาย การนำทาง และการส่งต่อไป Booking Engine ตามที่จำเป็น"],
      ["04", "Measure", "รายงาน Visit, Room Interest, Booking Start และ Booking Complete เฉพาะจากแหล่งที่ตรวจสอบได้"],
    ],
    relatedTitle: "เรื่องที่เกี่ยวข้องกับเว็บไซต์และการจองตรง",
    details: "ดูรายละเอียด",
    toolName: "ตรวจสุขภาพการค้นหาเว็บไซต์",
    toolBody: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าหาข้อมูลห้องพักและเดินทางไปจองต่อหรือไม่",
    toolCta: "ใช้เครื่องมือฟรี",
    designTitle: "Website Design",
    designBody: "หากโครงสร้างเดิมหรือระบบจองจำกัดการแก้ไข การวางเว็บไซต์ใหม่หรือเลือก CMS ที่ทีมดูแลต่อได้อาจเป็นงานถัดไป",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Website Conversion & Direct Bookings",
    title: "People reach the website. Where do they stop before a direct booking?",
    lead: "A hotel may already have website traffic from SEO or ads, yet guests still stop before they book. The gap may be Message Match, Room Information, Price and Policy, Mobile UX, Booking Engine handoff, or tracking.",
    leadClose:
      "The KPI Plus reviews the complete path from discovery to direct booking, then gives the hotel team a practical list of changes and the measurement boundaries the systems can actually support.",
    cta: "Request a direct-booking website review",
    secondary: "All solutions",
    underCta: "Send the website and booking-page links, plus the step that worries you.",
    photoAlt: "Sample Website diagram of a direct-booking path from Website to Room Detail, Price/Policy, then Booking Engine — not a live client site",
    whyTitle: "Guests can still change their mind until the booking is complete",
    whyBody:
      "A Google/Ipsos study across several Asia-Pacific markets found that almost four in five surveyed travellers in Thailand and India change a travel choice before they book. The hotel website has to do more than list the rooms. It has to help the guest compare and feel sure about that choice.",
    whyStudy:
      "A study in Thailand with 510 respondents found that price and cancellation terms together affect booking intention. If the page shows a rate but the guest has to hunt for the conditions, doubt can appear at a key step.",
    whyFlowTitle: "The sequence guests use before a booking is complete",
    whyContext:
      "This figure is research context, not a guaranteed result from this service or from a website change. It does not mean The KPI Plus or a website alone caused the reported booking or cancellation outcome.",
    whyNote:
      "These figures explain why a page should answer doubts at the decision moment. They do not mean that changing a page will raise bookings at the same rate for every hotel.",
    sourceLabel: "Source",
    sourceGoogle: "Google/Ipsos – Asia-Pacific traveller behaviour",
    sourceThai: "Research on price and cancellation terms in online hotel booking in Thailand",
    stopTitle: "Where guests often stop before they book",
    stops: [
      "The ad talks about one offer, but the page they open shows something else",
      "Room pages have photos and copy, but do not make the difference between types clear",
      "The rate, what is included, and the cancellation terms are hard to find",
      "The book button is hard to see or hard to use on a phone",
      "Tapping Book opens a new system whose look and facts do not continue from the website",
      "The hotel sees book-button clicks, but does not know whether guests completed the booking or where they stopped",
    ],
    helpTitle: "What The KPI Plus adjusts",
    checklistTitle: "Friction Audit Checklist",
    checklistLead:
      "A working list for the hotel team. Sample status only. Items are not automatically checked, and this is not a live hotel audit.",
    help: [
      ["01", "Start with real usage data", "Look at the pages people visit most, the path to room pages, the buttons they tap, and where they leave, then try the path on a phone. We do not judge from a report alone."],
      ["02", "Make information support the booking decision", "Adjust the copy and the order of facts so guests see how rooms differ, the strengths, the location, the rate, the offer, and the conditions they need before they book."],
      ["03", "Make the next action clear", "Place Check availability, See rates, Book, or Enquire where it fits the page. We do not force every guest to tap the same button before they have the details."],
      ["04", "Review the path to the Booking Engine", "Check whether the dates, room, rate, and offer the guest saw on the website match the booking system. If the engine sits on another domain, we review how far the path can be tracked across systems with the provider."],
      ["05", "Test and continue improving", "Order the changes that should come first, then compare before and after from the data that can be collected. If there is enough use and the system can support it, we may test more than one page or message."],
    ],
    vsTitle: "How is this different from building a new website?",
    vsBody:
      "This work starts from the current website and the actual customer path. We identify the point where users stop, then improve the existing system when it can be fixed safely. A rebuild is recommended only when platform, architecture, ownership, security, or integration constraints require it.",
    vsClose: "The choice depends on evidence from the current website and booking engine, hotel-team capability, ownership, budget, timeline, and Booking Engine constraints. A rebuild is not always better.",
    measureTitle: "We measure in steps. Not every click is a booking.",
    tableStep: "Step",
    tableLook: "What we look at",
    stages: [
      ["Website visit", "Which pages guests open, and which channel they came from"],
      ["Interest in a room", "They open room details, an offer, or a rate"],
      ["Start of booking", "They click into the booking engine or send a question"],
      ["Completed booking", "Bookings and revenue, when the booking system can send data that can be checked"],
    ],
    measureNote: "A Book click is only a start signal. If the Booking Engine does not send data back, it should not yet be reported as a completed booking.",
    methodTitle: "How the work runs",
    steps: [
      ["01", "Review", "Review Website Analytics, key pages, mobile path, room detail, CTA, Booking Engine, and existing tracking."],
      ["02", "Prioritize", "Rank the pages or steps that matter most to enquiries and Booking Start."],
      ["03", "Adjust", "Adjust copy, room information, images, CTA labels, price/offer display, cancellation policy visibility, navigation, and Booking Engine handoff messaging as needed."],
      ["04", "Measure", "Report Website Visit, Room Interest, Booking Start, and Booking Complete only from verifiable sources."],
    ],
    relatedTitle: "Related reading on the website and direct booking",
    details: "Read more",
    toolName: "Hotel searchability check",
    toolBody: "See whether the pages are ready for a guest to find room facts and continue to a booking.",
    toolCta: "Use the free tool",
    designTitle: "Website Design",
    designBody: "If the current structure or booking system limits the change, planning a new site or a CMS the team can look after may be the next piece of work.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Конверсия сайта и прямые брони",
    title: "Люди уже заходят на сайт. Где они останавливаются до брони?",
    lead: "Отель может уже вкладываться в сайт, SEO или рекламу и получать визиты. Гость всё равно может не открыть наличие номеров, не войти в систему брони или уйти со страницы брони до завершения.",
    leadClose:
      "The KPI Plus проверяет путь гостя на уже существующем сайте отеля, затем правит факты о номерах, предложения, кнопки брони, удобство на телефоне и связь с booking engine, чтобы гость понимал, что бронирует, и мог пройти дальше.",
    cta: "Попросить команду проверить путь брони",
    secondary: "Все решения",
    underCta: "Отправьте ссылки на сайт и страницу брони и скажите, какой шаг беспокоит.",
    photoAlt: "Гость открывает сайт отеля на телефоне и останавливается до страницы брони",
    whyTitle: "Гость может передумать, пока бронь не завершена",
    whyBody:
      "Исследование Google/Ipsos в нескольких рынках Азиатско-Тихоокеанского региона показало: почти четверо из пяти опрошенных путешественников в Таиланде и Индии меняют выбор по поездке до брони. Сайт отеля должен не только перечислить номера, но помочь сравнить и почувствовать уверенность в этом выборе.",
    whyStudy:
      "Исследование в Таиланде среди 510 респондентов показало, что цена и условия отмены вместе влияют на намерение забронировать. Если страница показывает цену, а условия гость ищет сам, сомнение может появиться на важном шаге.",
    whyFlowTitle: "The sequence guests use before a booking is complete",
    whyContext:
      "This figure is research context, not a guaranteed result from this service or from a website change. It does not mean The KPI Plus or a website alone caused the reported booking or cancellation outcome.",
    whyNote:
      "Эти цифры объясняют, почему страница должна отвечать на сомнения в момент решения. Они не значат, что правка страницы повысит брони в одинаковой мере у каждого отеля.",
    sourceLabel: "Источник",
    sourceGoogle: "Google/Ipsos – поведение путешественников в Азиатско-Тихоокеанском регионе",
    sourceThai: "Исследование цены и условий отмены при онлайн-бронировании отелей в Таиланде",
    stopTitle: "Где гости часто останавливаются до брони",
    stops: [
      "Реклама говорит об одном предложении, а страница после клика показывает другое",
      "На страницах номеров есть фото и текст, но разница типов не ясна",
      "Цену, что в неё входит, и условия отмены трудно найти",
      "Кнопку брони плохо видно или ею неудобно пользоваться с телефона",
      "После нажатия «забронировать» открывается новая система, которая не продолжает вид и данные сайта",
      "Отель видит клики по кнопке брони, но не знает, завершил ли гость бронь и где остановился",
    ],
    helpTitle: "Что правит The KPI Plus",
    checklistTitle: "Friction Audit Checklist",
    checklistLead:
      "A working list for the hotel team. Sample status only. Items are not automatically checked, and this is not a live hotel audit.",
    help: [
      ["01", "Начать с реальных данных и реального использования", "Смотреть самые посещаемые страницы, путь к номерам, нажатые кнопки и места ухода, затем пройти путь с телефона. Не судить только по отчёту."],
      ["02", "Сделать факты полезными для решения", "Править тексты и порядок фактов, чтобы гость видел разницу номеров, сильные стороны, локацию, цену, предложение и условия, которые нужно знать до брони."],
      ["03", "Сделать следующее действие ясным", "Ставить «посмотреть наличие», «цену», «забронировать» или «спросить» там, где это подходит странице. Не заставлять каждого гостя жать одну и ту же кнопку, пока нет деталей."],
      ["04", "Проверить путь в booking engine", "Смотреть, совпадают ли даты, номер, цена и предложение с сайта с системой брони. Если система на другом домене, проверяем вместе с провайдером, как далеко путь можно отследить между системами."],
      ["05", "Тестировать и править дальше", "Сначала выбрать, что менять, затем сравнить до и после по тем данным, которые можно собрать. Если трафика достаточно и система позволяет, можно тестировать разные страницы или тексты."],
    ],
    vsTitle: "Чем это отличается от нового сайта?",
    vsBody:
      "Эта работа начинается с текущего сайта отеля. Мы ищем, где гость останавливается, и правим те части, которые делают путь к вопросу или брони яснее.",
    vsClose: "Если текущая структура или система брони ограничивает правки, команда объяснит ограничение до того, как предложит править часть сайта или делать новый.",
    measureTitle: "Мы измеряем по шагам. Не каждый клик — это бронь.",
    tableStep: "Шаг",
    tableLook: "Что смотрим",
    stages: [
      ["Визит на сайт", "Какие страницы открывает гость и с какого канала пришёл"],
      ["Интерес к номеру", "Открывает детали номера, предложение или цену"],
      ["Начало брони", "Переходит в booking engine или отправляет вопрос"],
      ["Завершённая бронь", "Число броней и доход, когда система брони отдаёт проверяемые данные"],
    ],
    measureNote: "Клик по кнопке брони — только начало. Если booking engine не отдаёт данные назад, мы не будем считать этот клик завершённой бронью.",
    methodTitle: "Как идёт работа",
    steps: [
      ["01", "Проверить текущий путь", "Сайт, аналитика, ключевые страницы и booking engine."],
      ["02", "Выбрать, что править первым", "Страницы или шаги, которые сильнее всего связаны с вопросами и бронями."],
      ["03", "Править вместе с отелем", "The KPI Plus смотрит тексты, кнопки и путь. Отель подтверждает цены, предложения и правила."],
      ["04", "Смотреть результат", "Изменения в использовании, вопросах, началах брони и завершённых бронях настолько, насколько системы умеют измерять."],
    ],
    relatedTitle: "Материалы про сайт и прямое бронирование",
    details: "Подробнее",
    toolName: "Проверка поисковой готовности сайта",
    toolBody: "Посмотреть, готовы ли страницы к тому, чтобы гость нашёл факты о номерах и дошёл до брони.",
    toolCta: "Использовать бесплатный инструмент",
    designTitle: "Website Design",
    designBody: "Если текущая структура или система брони ограничивает правки, следующим шагом может быть новый сайт или CMS, который команда сможет вести.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "網站轉換與直銷預訂",
    title: "已經有人進站了，他們在預訂前停在哪一步？",
    lead: "飯店可能已投資網站、SEO 或廣告，也有人造訪。但客人仍可能沒有查看空房、沒有進入預訂系統，或在預訂頁完成前就離開。",
    leadClose:
      "The KPI Plus 會檢查飯店現有網站上的客人路徑，再調整客房資訊、方案、預訂按鈕、手機使用，以及與 Booking Engine 的連接，讓客人理解自己即將預訂什麼，並較容易繼續下一步。",
    cta: "請團隊檢查網站上的預訂路徑",
    secondary: "查看全部方案",
    underCta: "留下網站與預訂頁連結，以及目前最擔心的步驟。",
    photoAlt: "客人用手機打開飯店網站，在進入預訂頁前停下",
    whyTitle: "在預訂完成之前，客人隨時可能改主意",
    whyBody:
      "Google/Ipsos 在多個亞太市場的調查發現，泰國與印度受訪旅客中，近五分之四會在預訂前改變行程選擇。飯店網站的工作不只是列出有哪些客房，還要幫助客人比較，並對該選擇感到有把握。",
    whyStudy:
      "泰國一項 510 人的研究發現，價格與取消條件會共同影響預訂意向。若頁面只顯示價格，客人還得自己找條件，猶豫可能出現在關鍵步驟。",
    whyFlowTitle: "The sequence guests use before a booking is complete",
    whyContext:
      "This figure is research context, not a guaranteed result from this service or from a website change. It does not mean The KPI Plus or a website alone caused the reported booking or cancellation outcome.",
    whyNote: "這些數字說明為什麼網頁必須在決策當下回答疑問，並不表示改頁面就能讓每間飯店以同樣幅度增加預訂。",
    sourceLabel: "來源",
    sourceGoogle: "Google/Ipsos – 亞太旅客行為",
    sourceThai: "泰國線上飯店預訂之價格與取消條件研究",
    stopTitle: "客人常在預訂前停下的地方",
    stops: [
      "廣告講的是一套方案，點進去的頁面卻是另一套資料",
      "客房頁有照片與說明，卻沒把各房型差異講清楚",
      "價格、價格包含什麼、取消條件很難找到",
      "預訂按鈕在手機上不易看見或不好按",
      "按下預訂後進入另一套系統，外觀與資料沒有接上網站",
      "飯店看得到預訂按鈕點擊，卻不知道客人是否完成預訂，或停在哪一步",
    ],
    helpTitle: "The KPI Plus 會調整什麼？",
    checklistTitle: "Friction Audit Checklist",
    checklistLead:
      "A working list for the hotel team. Sample status only. Items are not automatically checked, and this is not a live hotel audit.",
    help: [
      ["01", "從實際資料與實際使用開始", "看人造訪最多的頁面、通往客房頁的路徑、被點的按鈕，以及離開的位置，並在手機上實際走一遍。不只看報表就下判斷。"],
      ["02", "讓資訊真正幫得上決定", "調整文字與資訊順序，讓客人看到房型差異、特色、位置、價格、方案，以及預訂前必須知道的條件。"],
      ["03", "讓下一步很清楚", "依各頁內容放置「查看空房」「看價格」「預訂」或「詢問」，不強迫每個客人在還沒看懂細節時就按同一個按鈕。"],
      ["04", "檢查通往 Booking Engine 的路徑", "核對客人在網站上看到的日期、客房、價格與方案，是否與預訂系統一致。若預訂系統在另一個網域，會連同供應商一起檢查跨系統追蹤能做到哪一步。"],
      ["05", "測試並繼續調整", "先排出該改的優先順序，再依能蒐集到的資料比較調整前後。若使用量足夠且系統支援，才考慮測試不同頁面或文案。"],
    ],
    vsTitle: "這和做新網站有什麼不同？",
    vsBody: "這項服務從飯店現有網站開始，找出客人停下的位置，只調整能讓詢問或預訂路徑更清楚的部分。",
    vsClose: "若現有結構或預訂系統限制了修改，團隊會先說明限制，再建議該局部調整，或另外開發。",
    measureTitle: "我們分階段衡量，不把每一次點擊都當成預訂。",
    tableStep: "步驟",
    tableLook: "看什麼",
    stages: [
      ["造訪網站", "客人進了哪些頁，從哪個通路來"],
      ["對客房產生興趣", "查看客房詳情、方案，或點看價格"],
      ["開始預訂", "點進 Booking Engine，或送出問題"],
      ["預訂完成", "預訂筆數與收益，且須預訂系統能回傳可核對的資料"],
    ],
    measureNote: "點擊預訂按鈕只是開始。若 Booking Engine 無法回傳資料，我們不會把該次點擊回報成完成預訂。",
    methodTitle: "怎麼進行",
    steps: [
      ["01", "檢查目前路徑", "看網站、Analytics、重要頁面與 Booking Engine。"],
      ["02", "找出該先改的點", "選擇與詢問、預訂最相關的頁面或步驟。"],
      ["03", "與飯店一起調整", "The KPI Plus 看內容、按鈕與使用路徑；飯店確認價格、方案與政策。"],
      ["04", "追蹤結果", "在系統能量到的範圍內，看使用、詢問、開始預訂與完成預訂的變化。"],
    ],
    relatedTitle: "與網站和直銷預訂相關的內容",
    details: "查看詳情",
    toolName: "網站搜尋健康檢查",
    toolBody: "查看頁面是否已準備好，讓客人找到客房資訊並走到預訂。",
    toolCta: "使用免費工具",
    designTitle: "Website Design",
    designBody: "若現有結構或預訂系統限制了修改，下一步可能是規劃新網站，或選擇團隊帶得動的 CMS。",
  },
} as const;

export async function ConversionView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsDirectBookingPage;
  embedded?: boolean;
}) {
  const cms = previewContent
    ? { ...previewContent, fromCms: true }
    : await loadDirectBookingPage(locale);
  const fromCms = cms.fromCms;
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const faqItems = hotelDirectBookingFaqsFromCms(fromCms ? cms : null, locale);
  const whySources =
    fromCms && cms.confidence.sources.length
      ? cms.confidence.sources
      : [DIRECT_BOOKING_SOURCES.googleIpsos, DIRECT_BOOKING_SOURCES.thaiCancellation];
  const relatedCards = existingHref("/tools/hotel-searchability-check", locale) || existingHref("/solutions/hotel-website-design", locale);
  const dummyHeroSrc = directBookingHeroVisualUrl() || "";
  const dummyConfidenceSrc = directBookingConfidenceVisualUrl() || "";
  const dummyFrictionSrc = directBookingFrictionVisualUrl() || "";
  const dummyFrameworkSrc = directBookingFrameworkVisualUrl() || "";
  const dummyAuditSrc = directBookingAuditVisualUrl() || "";
  const dummyDecisionSrc = directBookingDecisionVisualUrl() || "";
  const dummyMeasureSrc = directBookingMeasureVisualUrl() || "";
  const dummyWorkflowSrc = directBookingWorkflowVisualUrl() || "";
  const dummyRelatedSrc = directBookingRelatedVisualUrl() || "";
  const dummyEnquirySrc = directBookingEnquiryVisualUrl() || "";
  const heroSrc = (() => {
    const next = cms.hero.visual.src.trim();
    if (next && next !== dummyHeroSrc) return next;
    return dummyHeroSrc || next;
  })();
  const confidenceSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.confidence.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyConfidenceSrc) return next;
    return dummyConfidenceSrc && !blocked.has(dummyConfidenceSrc) ? dummyConfidenceSrc : "";
  })();
  const frictionSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.friction.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyFrictionSrc) return next;
    return dummyFrictionSrc && !blocked.has(dummyFrictionSrc) ? dummyFrictionSrc : "";
  })();
  const frameworkSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.framework.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyFrameworkSrc) return next;
    return dummyFrameworkSrc && !blocked.has(dummyFrameworkSrc) ? dummyFrameworkSrc : "";
  })();
  const auditSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, dummyFrameworkSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.audit.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyAuditSrc) return next;
    return dummyAuditSrc && !blocked.has(dummyAuditSrc) ? dummyAuditSrc : "";
  })();
  const decisionSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, dummyFrameworkSrc, dummyAuditSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.rebuild.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyDecisionSrc) return next;
    return dummyDecisionSrc && !blocked.has(dummyDecisionSrc) ? dummyDecisionSrc : "";
  })();
  const measureSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, dummyFrameworkSrc, dummyAuditSrc, dummyDecisionSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.measure.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyMeasureSrc) return next;
    return dummyMeasureSrc && !blocked.has(dummyMeasureSrc) ? dummyMeasureSrc : "";
  })();
  const workflowSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, dummyFrameworkSrc, dummyAuditSrc, dummyDecisionSrc, dummyMeasureSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.workflow.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyWorkflowSrc) return next;
    return dummyWorkflowSrc && !blocked.has(dummyWorkflowSrc) ? dummyWorkflowSrc : "";
  })();
  const relatedSrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, dummyFrameworkSrc, dummyAuditSrc, dummyDecisionSrc, dummyMeasureSrc, dummyWorkflowSrc, dummyEnquirySrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.related.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyRelatedSrc) return next;
    return dummyRelatedSrc && !blocked.has(dummyRelatedSrc) ? dummyRelatedSrc : "";
  })();
  const enquirySrc = (() => {
    const blocked = new Set([heroSrc, dummyHeroSrc, dummyConfidenceSrc, dummyFrictionSrc, dummyFrameworkSrc, dummyAuditSrc, dummyDecisionSrc, dummyMeasureSrc, dummyWorkflowSrc, dummyRelatedSrc, DIRECT_BOOKING_HERO_VISUAL_CANDIDATE, ""]);
    const next = cms.form.visual.src.trim();
    if (next && !blocked.has(next) && next !== dummyEnquirySrc) return next;
    return dummyEnquirySrc && !blocked.has(dummyEnquirySrc) ? dummyEnquirySrc : "";
  })();
  const heroAlt = locale === "th" ? cms.hero.visual.altTh || DIRECT_BOOKING_HERO_VISUAL.altTh || t.photoAlt : cms.hero.visual.altEn || DIRECT_BOOKING_HERO_VISUAL.altEn || t.photoAlt;
  const confidenceAlt =
    locale === "th"
      ? cms.confidence.visual.altTh || DIRECT_BOOKING_CONFIDENCE_VISUAL.altTh
      : cms.confidence.visual.altEn || DIRECT_BOOKING_CONFIDENCE_VISUAL.altEn;
  const heroCtaHref = existingHref(fromCms ? cms.hero.primaryCta.href.trim() || "#conversion-enquiry" : "#conversion-enquiry", locale) || "#conversion-enquiry";
  const heroCtaLabel = fromCms && cms.hero.primaryCta.label.trim() ? cms.hero.primaryCta.label : t.cta;
  const heroSecondaryHref = existingHref(fromCms ? cms.hero.secondaryCta.href.trim() || "/solutions" : "/solutions", locale) || solutions;
  const heroSecondaryLabel = fromCms && cms.hero.secondaryCta.label.trim() ? cms.hero.secondaryCta.label : t.secondary;

  const inner = (
    <div className="kpi-conversion">
      <section className="kpi-hero kpi-home-hero-section kpi-conversion-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-conversion-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-direct-bookings", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{fromCms && cms.hero.eyebrow.trim() ? cms.hero.eyebrow : t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {fromCms && cms.hero.title.trim() ? (
                  cms.hero.title
                ) : locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">
                      มีคนเข้าเว็บไซต์แล้ว แต่เขา<span className="kpi-home-accent">หยุดก่อนจอง</span>
                    </span>
                    <span className="kpi-home-h1-rest">ตรงไหน?</span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{fromCms && cms.hero.description.trim() ? cms.hero.description : t.lead}</p>
              <p className="kpi-conversion-lead-close">{fromCms && cms.hero.close.trim() ? cms.hero.close : t.leadClose}</p>
              <div className="kpi-actions">
                <a href={heroCtaHref} className="kpi-button">
                  {heroCtaLabel} <span aria-hidden="true">↗</span>
                </a>
                <Link href={heroSecondaryHref} className="kpi-button-ghost">
                  {heroSecondaryLabel}
                </Link>
              </div>
              <p className="kpi-conversion-hero-note">{fromCms && cms.hero.underCta.trim() ? cms.hero.underCta : t.underCta}</p>
              <p className="kpi-home-trust kpi-conversion-journey" aria-label={locale === "th" ? "เส้นทางจากค้นพบถึงจองตรง" : "Path from discovery to direct booking"}>
                {DIRECT_BOOKING_HERO_JOURNEY.map((step, index) => (
                  <span key={step.id}>
                    <span className={locale === "th" ? undefined : "kpi-latin"}>
                      {String(index + 1).padStart(2, "0")} {locale === "th" ? step.th : step.en}
                    </span>
                  </span>
                ))}
              </p>
              <p className="kpi-conversion-hero-trust" aria-label={locale === "th" ? "ขอบเขตงานที่ตรวจได้" : "Review capabilities"}>
                {DIRECT_BOOKING_HERO_CAPABILITIES.map((item) => (
                  <span key={item.en} className={locale === "th" ? undefined : "kpi-latin"}>
                    {locale === "th" ? item.th : item.en}
                  </span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <ConversionHeroVisual
                locale={locale}
                src={heroSrc}
                alt={heroAlt}
                status={cms.hero.visual.status}
                label={cms.hero.visual.label}
                caption={cms.hero.visual.caption}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-conversion-why">
        <div className="kpi-conversion-why-grid">
          <div className="kpi-conversion-why-copy">
            <h2 className="kpi-h2">{fromCms && cms.confidence.title.trim() ? cms.confidence.title : t.whyTitle}</h2>
            {locale === "th" || locale === "en" ? (
              <>
                <div className="kpi-conversion-why-findings">
                  <article className="kpi-conversion-why-finding">
                    <p className="kpi-conversion-why-stat">
                      {locale === "th" ? <span className="kpi-conversion-why-stat-label">เกือบ </span> : null}
                      <span className="kpi-latin kpi-conversion-why-number">4</span>
                      <span className="kpi-conversion-why-stat-mid">{locale === "th" ? " ใน " : " in "}</span>
                      <span className="kpi-latin kpi-conversion-why-number">5</span>
                    </p>
                    <p className="kpi-conversion-why-finding-body">{fromCms && cms.confidence.body.trim() ? cms.confidence.body : t.whyBody}</p>
                    <p className="kpi-conversion-why-cite">
                      <span className="kpi-latin">{t.sourceLabel}:</span>{" "}
                      <a href={DIRECT_BOOKING_SOURCES.googleIpsos.url} target="_blank" rel="noreferrer">
                        {DIRECT_BOOKING_SOURCES.googleIpsos.name}
                      </a>
                      <span className="web-source-meta">
                        {` · ${DIRECT_BOOKING_SOURCES.googleIpsos.publishedAt} · ${DIRECT_BOOKING_SOURCES.googleIpsos.market}`}
                        {` · ${locale === "th" ? DIRECT_BOOKING_SOURCES.googleIpsos.definitionTh : DIRECT_BOOKING_SOURCES.googleIpsos.definition}`}
                        {` · ${DIRECT_BOOKING_SOURCES.googleIpsos.status} · accessed ${DIRECT_BOOKING_SOURCES.googleIpsos.accessedAt}`}
                      </span>
                    </p>
                  </article>
                  <article className="kpi-conversion-why-finding">
                    <h3>{locale === "th" ? "ราคาและเงื่อนไขมีผลร่วมกัน" : "Price and terms affect booking intent"}</h3>
                    <p className="kpi-conversion-why-finding-body">{fromCms && cms.confidence.study.trim() ? cms.confidence.study : t.whyStudy}</p>
                    <p className="kpi-conversion-why-cite">
                      <span className="kpi-latin">{t.sourceLabel}:</span>{" "}
                      <a href={DIRECT_BOOKING_SOURCES.thaiCancellation.url} target="_blank" rel="noreferrer">
                        {DIRECT_BOOKING_SOURCES.thaiCancellation.name}
                      </a>
                      <span className="web-source-meta">
                        {` · ${DIRECT_BOOKING_SOURCES.thaiCancellation.publishedAt} · ${DIRECT_BOOKING_SOURCES.thaiCancellation.market}`}
                        {` · ${locale === "th" ? DIRECT_BOOKING_SOURCES.thaiCancellation.definitionTh : DIRECT_BOOKING_SOURCES.thaiCancellation.definition}`}
                        {` · ${DIRECT_BOOKING_SOURCES.thaiCancellation.status} · accessed ${DIRECT_BOOKING_SOURCES.thaiCancellation.accessedAt}`}
                      </span>
                    </p>
                  </article>
                </div>
                {locale === "th" ? (
                  <p className="kpi-conversion-why-takeaway">
                    <span>เว็บไซต์จึงมีหน้าที่มากกว่าบอกว่ามีห้องพักอะไร</span>
                    <span className="kpi-conversion-why-takeaway-strong">
                      แต่ต้องช่วยให้ลูกค้าเปรียบเทียบและมั่นใจในตัวเลือกนั้น
                    </span>
                  </p>
                ) : null}
                <p className="kpi-conversion-why-flow-label">{t.whyFlowTitle}</p>
                <ol className="kpi-website-why-flow db-confidence-path" aria-label={t.whyFlowTitle}>
                  {DIRECT_BOOKING_CONFIDENCE_PATH.map((step, index) => (
                    <li key={step.en}>
                      <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                      <span className={locale === "th" ? undefined : "kpi-latin"}>{locale === "th" ? step.th : step.en}</span>
                    </li>
                  ))}
                </ol>
                <p className="kpi-conversion-why-note">{fromCms && cms.confidence.evidence.trim() ? cms.confidence.evidence : t.whyContext}</p>
                <p className="kpi-conversion-why-note">{t.whyNote}</p>
              </>
            ) : (
              <>
                <p className="kpi-conversion-why-fallback">{fromCms && cms.confidence.body.trim() ? cms.confidence.body : t.whyBody}</p>
                <p className="kpi-conversion-why-fallback">{fromCms && cms.confidence.study.trim() ? cms.confidence.study : t.whyStudy}</p>
                <p className="kpi-conversion-why-flow-label">{t.whyFlowTitle}</p>
                <ol className="kpi-website-why-flow db-confidence-path" aria-label={t.whyFlowTitle}>
                  {DIRECT_BOOKING_CONFIDENCE_PATH.map((step, index) => (
                    <li key={step.en}>
                      <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                      <span className="kpi-latin">{step.en}</span>
                    </li>
                  ))}
                </ol>
                <p className="kpi-conversion-why-note">{fromCms && cms.confidence.evidence.trim() ? cms.confidence.evidence : t.whyContext}</p>
                <p className="kpi-conversion-why-note">{t.whyNote}</p>
              </>
            )}
            <div className="kpi-conversion-why-sources">
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
                    {` · ${source.status} · accessed ${source.accessedAt}`}
                  </span>
                </p>
              ))}
            </div>
          </div>
          <figure className="kpi-conversion-why-media">
            <ConversionConfidenceVisual
              locale={locale}
              src={confidenceSrc}
              alt={confidenceAlt}
              status={cms.confidence.visual.status}
              label={cms.confidence.visual.label}
              caption={cms.confidence.visual.caption}
            />
          </figure>
        </div>
      </section>

      <section className="kpi-conversion-stops border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms.friction.title.trim() ? cms.friction.title : t.stopTitle}</h2>
          <ConversionFrictionMap
            locale={locale}
            src={frictionSrc}
            rows={fromCms && cms.friction.rows.length ? cms.friction.rows : undefined}
            visual={{
              alt: locale === "th" ? cms.friction.visual.altTh : cms.friction.visual.altEn,
              label: cms.friction.visual.label,
              caption: cms.friction.visual.caption,
              status: cms.friction.visual.status,
            }}
          />
        </div>
      </section>

      <section className="kpi-section kpi-conversion-help">
        <h2 className="kpi-h2">{fromCms && cms.framework.title.trim() ? cms.framework.title : t.helpTitle}</h2>
          <ConversionFramework
            locale={locale}
            src={frameworkSrc}
            steps={fromCms && cms.framework.steps.length ? cms.framework.steps : undefined}
            boundaryNote={fromCms ? cms.framework.boundaryNote : undefined}
            supportTitle={fromCms ? cms.framework.supportTitle : undefined}
            hotelTitle={fromCms ? cms.framework.hotelTitle : undefined}
            support={fromCms && cms.framework.support.length ? cms.framework.support : undefined}
            hotel={fromCms && cms.framework.hotel.length ? cms.framework.hotel : undefined}
            visual={{
              alt: locale === "th" ? cms.framework.visual.altTh : cms.framework.visual.altEn,
              label: cms.framework.visual.label,
              caption: cms.framework.visual.caption,
              status: cms.framework.visual.status,
            }}
          />
          <h3 className="db-audit-heading">{fromCms && cms.audit.title.trim() ? cms.audit.title : t.checklistTitle}</h3>
          <p className="db-audit-lead">{fromCms && cms.audit.lead.trim() ? cms.audit.lead : t.checklistLead}</p>
          <ConversionFrictionAudit
            locale={locale}
            src={auditSrc}
            rows={fromCms && cms.audit.rows.length ? cms.audit.rows : undefined}
            visual={{
              alt: locale === "th" ? cms.audit.visual.altTh : cms.audit.visual.altEn,
              label: cms.audit.visual.label,
              caption: cms.audit.visual.caption,
              status: cms.audit.visual.status,
            }}
          />
          <a href="#conversion-enquiry" className="kpi-button kpi-conversion-help-cta">
          {heroCtaLabel} <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="kpi-conversion-vs border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms.rebuild.title.trim() ? cms.rebuild.title : t.vsTitle}</h2>
          <ConversionDecision
            locale={locale}
            lead={fromCms && cms.rebuild.body.trim() ? cms.rebuild.body : t.vsBody}
            src={decisionSrc}
            note={fromCms ? cms.rebuild.note || cms.rebuild.close : undefined}
            paths={fromCms && cms.rebuild.paths.length ? cms.rebuild.paths : undefined}
            visual={{
              alt: locale === "th" ? cms.rebuild.visual.altTh : cms.rebuild.visual.altEn,
              label: cms.rebuild.visual.label,
              caption: cms.rebuild.visual.caption,
              status: cms.rebuild.visual.status,
            }}
          />
        </div>
      </section>

      <section className="kpi-section kpi-conversion-measure">
        <h2 className="kpi-h2">{fromCms && cms.measure.title.trim() ? cms.measure.title : t.measureTitle}</h2>
        <ConversionMeasure
          locale={locale}
          src={measureSrc}
          bookingEngineConfigured={cms.measure.bookingEngineConfigured}
          trackingConfigured={cms.measure.trackingConfigured}
          stages={fromCms && cms.measure.stages.length ? cms.measure.stages : undefined}
          kpis={fromCms && cms.measure.kpis.length ? cms.measure.kpis : undefined}
          note={fromCms ? cms.measure.note : undefined}
          boundary={fromCms ? cms.measure.boundary : undefined}
          visual={{
            alt: locale === "th" ? cms.measure.visual.altTh : cms.measure.visual.altEn,
            label: cms.measure.visual.label,
            caption: cms.measure.visual.caption,
            status: cms.measure.visual.status,
          }}
        />
      </section>

      <section className="kpi-conversion-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms.workflow.title.trim() ? cms.workflow.title : t.methodTitle}</h2>
          <ConversionWorkflow
            locale={locale}
            src={workflowSrc}
            steps={fromCms && cms.workflow.steps.length ? cms.workflow.steps : undefined}
            visual={{
              alt: locale === "th" ? cms.workflow.visual.altTh : cms.workflow.visual.altEn,
              label: cms.workflow.visual.label,
              caption: cms.workflow.visual.caption,
              status: cms.workflow.visual.status,
            }}
          />
        </div>
      </section>

      {relatedCards ? (
        <section className="kpi-conversion-related">
          <div className="kpi-section">
            <h2 className="kpi-h2">{fromCms && cms.related.title.trim() ? cms.related.title : t.relatedTitle}</h2>
            <ConversionRelated
              locale={locale}
              src={relatedSrc}
              overrides={fromCms ? cms.related.cards : undefined}
              visual={{
                alt: locale === "th" ? cms.related.visual.altTh : cms.related.visual.altEn,
                label: cms.related.visual.label,
                caption: cms.related.visual.caption,
                status: cms.related.visual.status,
              }}
            />
          </div>
        </section>
      ) : null}

      <ConversionEnquiry locale={locale} visualSrc={enquirySrc} helper={fromCms ? cms.form : undefined} />
      <PageFaqs items={faqItems} locale={locale} sectionId="hotel-direct-bookings-faq" />
      <ConversionStickyCta label={fromCms && cms.form.submit.trim() ? cms.form.submit : t.cta} />
    </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-direct-bookings", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}
