import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { ConversionEnquiry } from "@/components/ConversionEnquiry";
import { ConversionStickyCta } from "@/components/ConversionStickyCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const googleIpsos = "https://business.google.com/in/think/consumer-insights/insights-apac-traveler-behaviors/";
const thaiStudy = "https://so03.tci-thaijo.org/index.php/art/article/view/288881";

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "เพิ่มการจองผ่านเว็บไซต์",
    title: "มีคนเข้าเว็บไซต์แล้ว แต่เขาหยุดก่อนจองตรงไหน?",
    lead: "โรงแรมอาจลงทุนกับเว็บไซต์ SEO หรือโฆษณาจนมีคนเข้าชม แต่ลูกค้ายังไม่กดดูห้องว่าง ไม่เข้าสู่ระบบจอง หรือออกจากหน้าจองก่อนทำรายการสำเร็จ",
    leadClose:
      "เดอะ เคพีไอ พลัส ช่วยตรวจเส้นทางของลูกค้าบนเว็บไซต์ที่โรงแรมมีอยู่แล้ว แล้วปรับข้อมูลห้องพัก ข้อเสนอ ปุ่มจอง การใช้งานบนมือถือ และการเชื่อมต่อ Booking Engine เพื่อให้ลูกค้าเข้าใจสิ่งที่กำลังจองและไปต่อได้สะดวกขึ้น",
    cta: "ให้ทีมตรวจเส้นทางจองบนเว็บไซต์",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งลิงก์เว็บไซต์และหน้าจอง พร้อมบอกจุดที่กังวล",
    photoAlt: "ลูกค้าเปิดเว็บไซต์โรงแรมบนมือถือแล้วหยุดก่อนถึงหน้าจอง",
    whyTitle: "ลูกค้ายังเปลี่ยนใจได้จนกว่าจะจองสำเร็จ",
    whyBody:
      "งานสำรวจ Google/Ipsos ในหลายตลาดเอเชียแปซิฟิกพบว่า ผู้เดินทางที่สำรวจในประเทศไทยและอินเดียเกือบ 4 ใน 5 เปลี่ยนตัวเลือกด้านการเดินทางก่อนจอง เว็บไซต์โรงแรมจึงมีหน้าที่มากกว่าบอกว่า “มีห้องพักอะไร” แต่ต้องช่วยให้ลูกค้าเปรียบเทียบและมั่นใจในตัวเลือกนั้น",
    whyStudy:
      "งานวิจัยในประเทศไทยกับผู้ตอบ 510 คน พบว่าราคาและเงื่อนไขการยกเลิกมีผลร่วมกันต่อความตั้งใจจอง หากหน้าเว็บแสดงราคาแต่ลูกค้าต้องค้นหาเงื่อนไขเอง ความลังเลอาจเกิดขึ้นในขั้นตอนสำคัญ",
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
    help: [
      ["01", "เริ่มจากข้อมูลและการใช้งานจริง", "ดูหน้าที่คนเข้าชมมาก เส้นทางที่พาไปหน้าห้องพัก ปุ่มที่ถูกกด และจุดที่คนออกจากเว็บไซต์ พร้อมทดลองใช้งานจริงบนมือถือ ไม่ตัดสินจากรายงานตัวเลขเพียงอย่างเดียว"],
      ["02", "ทำให้ข้อมูลช่วยตัดสินใจ", "ปรับข้อความและลำดับข้อมูลให้ลูกค้าเห็นความต่างของห้องพัก จุดเด่น ทำเล ราคา ข้อเสนอ และเงื่อนไขที่ต้องรู้ก่อนจอง"],
      ["03", "ทำให้การกระทำถัดไปชัดเจน", "วางปุ่ม “ดูห้องว่าง” “ดูราคา” “จองห้องพัก” หรือ “สอบถาม” ให้เหมาะกับเนื้อหาในแต่ละหน้า ไม่บังคับให้ลูกค้าทุกคนกดปุ่มเดียวกันตั้งแต่ยังไม่รู้รายละเอียด"],
      ["04", "ตรวจเส้นทางไป Booking Engine", "ดูว่าข้อมูลวันที่ ห้องพัก ราคา และข้อเสนอที่ลูกค้าเห็นบนเว็บไซต์สอดคล้องกับระบบจองหรือไม่ หากระบบจองอยู่บนอีกโดเมน จะตรวจความสามารถในการติดตามเส้นทางข้ามระบบร่วมกับผู้ให้บริการ"],
      ["05", "ทดสอบและปรับต่อ", "จัดลำดับจุดที่ควรแก้ก่อน แล้วเทียบผลก่อนและหลังปรับตามข้อมูลที่เก็บได้ หากจำนวนผู้ใช้งานเพียงพอและระบบรองรับ จึงพิจารณาทดสอบหน้าเว็บหรือข้อความหลายรูปแบบ"],
    ],
    vsTitle: "งานนี้ต่างจากการสร้างเว็บไซต์ใหม่อย่างไร?",
    vsBody:
      "บริการนี้เริ่มจากเว็บไซต์ปัจจุบันของโรงแรม เพื่อหาว่าจุดไหนทำให้ลูกค้าหยุด และปรับเฉพาะส่วนที่ช่วยให้เส้นทางสอบถามหรือจองชัดขึ้น",
    vsClose: "หากพบว่าโครงสร้างเว็บไซต์เดิมหรือระบบจองจำกัดการแก้ไข ทีมจะอธิบายข้อจำกัดก่อนเสนอว่าควรปรับบางส่วนหรือพัฒนาใหม่",
    measureTitle: "เราวัดผลเป็นขั้น ไม่เหมารวมว่าทุกคลิกคือยอดจอง",
    tableStep: "ขั้นตอน",
    tableLook: "สิ่งที่ดู",
    stages: [
      ["เข้าชมเว็บไซต์", "ลูกค้าเข้าหน้าไหน และมาจากช่องทางใด"],
      ["สนใจห้องพัก", "ดูรายละเอียดห้องพัก ข้อเสนอ หรือกดดูราคา"],
      ["เริ่มจอง", "คลิกเข้าสู่ Booking Engine หรือส่งคำถาม"],
      ["จองสำเร็จ", "จำนวนการจองและรายได้ เมื่อระบบจองส่งข้อมูลให้ตรวจสอบได้"],
    ],
    measureNote: "การคลิกปุ่มจองเป็นเพียงการเริ่มต้น หาก Booking Engine ไม่รองรับการส่งข้อมูลกลับมา เราจะไม่รายงานคลิกนั้นเป็นยอดจองสำเร็จ",
    methodTitle: "วิธีทำงาน",
    steps: [
      ["01", "ตรวจเส้นทางปัจจุบัน", "ดูเว็บไซต์ Analytics หน้าสำคัญ และ Booking Engine"],
      ["02", "หาจุดที่ควรแก้ก่อน", "เลือกหน้าหรือขั้นตอนที่เกี่ยวกับการสอบถามและจองมากที่สุด"],
      ["03", "ปรับร่วมกับโรงแรม", "เดอะ เคพีไอ พลัส ดูเนื้อหา ปุ่ม และเส้นทางใช้งาน โรงแรมยืนยันราคา ข้อเสนอ และนโยบาย"],
      ["04", "ติดตามผล", "ดูการเปลี่ยนแปลงของการใช้งาน การสอบถาม การเริ่มจอง และการจองสำเร็จเท่าที่ระบบวัดได้"],
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
    lead: "A hotel may already invest in the website, SEO, or ads and get visits. Guests still may not open availability, enter the booking system, or they leave the booking page before they finish a direct booking.",
    leadClose:
      "The KPI Plus reviews the guest path on the website the hotel already has, then adjusts room facts, offers, book buttons, phone use, and the booking-engine connection, so guests understand what they are about to book and can continue more easily toward a direct booking.",
    cta: "Ask the team to review the booking path",
    secondary: "All solutions",
    underCta: "Send the website and booking-page links, plus the step that worries you.",
    photoAlt: "A guest opening a hotel website on a phone and stopping before the booking page",
    whyTitle: "Guests can still change their mind until the booking is complete",
    whyBody:
      "A Google/Ipsos study across several Asia-Pacific markets found that almost four in five surveyed travellers in Thailand and India change a travel choice before they book. The hotel website has to do more than list the rooms. It has to help the guest compare and feel sure about that choice.",
    whyStudy:
      "A study in Thailand with 510 respondents found that price and cancellation terms together affect booking intention. If the page shows a rate but the guest has to hunt for the conditions, doubt can appear at a key step.",
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
    help: [
      ["01", "Start from real use and real data", "Look at the pages people visit most, the path to room pages, the buttons they tap, and where they leave, then try the path on a phone. We do not judge from a report alone."],
      ["02", "Make the facts help the decision", "Adjust the copy and the order of facts so guests see how rooms differ, the strengths, the location, the rate, the offer, and the conditions they need before they book."],
      ["03", "Make the next action clear", "Place Check availability, See rates, Book, or Enquire where it fits the page. We do not force every guest to tap the same button before they have the details."],
      ["04", "Review the path into the booking engine", "Check whether the dates, room, rate, and offer the guest saw on the website match the booking system. If the engine sits on another domain, we review how far the path can be tracked across systems with the provider."],
      ["05", "Test and keep adjusting", "Order the changes that should come first, then compare before and after from the data that can be collected. If there is enough use and the system can support it, we may test more than one page or message."],
    ],
    vsTitle: "How is this different from building a new website?",
    vsBody:
      "This work starts from the hotel’s current website. We find where guests stop, then change the parts that make the enquiry or booking path clearer.",
    vsClose: "If the current structure or booking system limits the change, the team explains that limit before saying whether to adjust part of the site or build something new.",
    measureTitle: "We measure in steps. Not every click is a booking.",
    tableStep: "Step",
    tableLook: "What we look at",
    stages: [
      ["Website visit", "Which pages guests open, and which channel they came from"],
      ["Interest in a room", "They open room details, an offer, or a rate"],
      ["Start of booking", "They click into the booking engine or send a question"],
      ["Completed booking", "Bookings and revenue, when the booking system can send data that can be checked"],
    ],
    measureNote: "A click on Book is only the start. If the booking engine cannot send data back, we will not report that click as a completed booking.",
    methodTitle: "How the work runs",
    steps: [
      ["01", "Review the current path", "Look at the website, analytics, key pages, and the booking engine."],
      ["02", "Choose what to change first", "Pick the pages or steps that matter most to enquiries and bookings."],
      ["03", "Adjust with the hotel", "The KPI Plus reviews copy, buttons, and the path. The hotel confirms rates, offers, and policy."],
      ["04", "Review the result", "Look at changes in use, enquiries, starts of booking, and completed bookings as far as the systems can measure."],
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

export function ConversionView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const designHref = existingHref("/solutions/hotel-website-design", locale);
  const toolHref = existingHref("/tools/hotel-searchability-check", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-direct-bookings", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/hotel-direct-bookings", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#conversion-enquiry" className="kpi-button">
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
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#555555]">{t.whyNote}</p>
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
          <h2 className="kpi-h2">{t.stopTitle}</h2>
          <div className="mt-10 grid gap-4">
            {t.stops.map((item, index) => (
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
        <a href="#conversion-enquiry" className="kpi-button mt-10">
          {t.cta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.vsTitle}</h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.vsBody}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.vsClose}</p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <div className="mt-10 overflow-x-auto rounded-[1.5rem] border border-[#E3E8EB] bg-white">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead className="bg-[#F2F8E2]">
              <tr>
                <th className="px-6 py-4 text-sm font-extrabold text-[#0B1F33]">{t.tableStep}</th>
                <th className="px-6 py-4 text-sm font-extrabold text-[#0B1F33]">{t.tableLook}</th>
              </tr>
            </thead>
            <tbody>
              {t.stages.map(([step, look], index) => (
                <tr key={step} className={index % 2 ? "bg-[#F4F4F4]" : "bg-white"}>
                  <th className="px-6 py-5 align-top text-base font-extrabold text-[#3B3B3B]">{step}</th>
                  <td className="px-6 py-5 text-base leading-7 text-[#555555]">{look}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.measureNote}</p>
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

      {toolHref || designHref ? (
        <section className="kpi-section">
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
            {designHref ? (
              <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.designTitle}</h3>
                <p className="mt-3 text-base leading-7 text-[#555555]">{t.designBody}</p>
                <Link href={designHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                  {t.details}
                </Link>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      <ConversionEnquiry locale={locale} />
      <ConversionStickyCta label={t.cta} />
    </SiteShell>
  );
}
