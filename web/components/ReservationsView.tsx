import { Fragment } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ReservationsEnquiry } from "@/components/ReservationsEnquiry";
import { ReservationScopeIcon } from "@/components/reservations/ReservationScopeIcon";
import { ReservationsHeroVisual } from "@/components/reservations/ReservationsHeroVisual";
import { ReservationsKpiVisual } from "@/components/reservations/ReservationsKpiVisual";
import { ReservationsProblemVisual } from "@/components/reservations/ReservationsProblemVisual";
import { ReservationsRelatedVisual } from "@/components/reservations/ReservationsRelatedVisual";
import { ReservationsBookingFlow } from "@/components/reservations/ReservationsBookingFlow";
import { ReservationsServiceMap } from "@/components/reservations/ReservationsServiceMap";
import { ReservationsWorkflowMap } from "@/components/reservations/ReservationsWorkflowMap";
import { PageFaqs } from "@/components/PageFaqs";
import { ReservationsStickyCta } from "@/components/ReservationsStickyCta";
import { SiteShell } from "@/components/SiteShell";
import "@/components/reservations/reservations-ops.css";
import { faqsForRoute } from "@/lib/faqs";
import { formatInsightDate, insightExcerpt, insightPosts, insightUpdatedAt, insightsIndexCopy } from "@/lib/insights";
import { solutionsIndexCopy } from "@/lib/localized-ui";
import { solutionNavLabel } from "@/lib/nav";
import {
  RESERVATION_SERVICE_SETTINGS,
  reservationsBookingFlowVisualUrl,
  reservationsHeroVisualUrl,
  reservationsKpiVisualUrl,
  reservationsProblemVisualUrl,
  reservationsRelatedVisualUrl,
  reservationsServiceMapVisualUrl,
  reservationsTeamVisualUrl,
  reservationsWorkflowVisualUrl,
  formatReservationKpiUpdatedAt,
  formatReservationKpiValue,
  reservationKpiPeriod,
  reservationKpiUnitLabel,
  reservationKpisForPublic,
  HERO_CAPABILITIES,
  HOTEL_OWNED_WHEN_APPLICABLE,
  RESERVATION_BENEFIT_GROUPS,
  RESERVATION_PROBLEM_ITEMS,
  SCOPE_ITEMS,
  type ReservationKpi,
} from "@/lib/reservations";
import { existingHref, localizePath, pageByRoute, type Locale } from "@/lib/seo";

const relatedInsightHrefs = ["/insights/direct-booking-journey-audit"] as const;

const methodPhases = ["Assess", "Setup", "Operate", "Review"] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "บริการทีมรับจองสำหรับโรงแรม",
    title: "ให้เราช่วยดูแลงานจอง เพื่อให้ทีมของคุณมีเวลาดูแลแขก",
    lead: "ระหว่างเช็กอิน รับโทรศัพท์ ตอบคำถาม และดูแลแขก\nทีมโรงแรมอาจไม่มีเวลาติดตามทุกคำถามเรื่องห้องว่างและราคา",
    leadNext: "The KPI Plus ช่วยรับและจัดการงานสำรองห้องพัก\nตั้งแต่ตอบคำถาม เสนอห้อง ติดตามลูกค้า\nไปจนถึงส่งต่อข้อมูลให้ทีมโรงแรม",
    leadClose: "โรงแรมจึงไม่พลาดโอกาสการขาย\nและทีมหน้างานมีเวลาโฟกัสกับประสบการณ์ของแขกมากขึ้น",
    cta: "ให้ทีมประเมินงานจองของโรงแรม",
    heroCta: "ขอประเมินงานจอง",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งช่องทางที่ลูกค้าติดต่อ\nและช่วงเวลาที่อยากให้ทีมช่วยดูแล",
    photoAlt: "พนักงานโรงแรมรับสายเรื่องการจองที่โต๊ะทำงานหน้างาน",
    problemTitle: "งานจองกำลังดึงเวลาทีมหน้างานไปมากแค่ไหน?",
    problemItems: [
      { text: "ทีมต้องสลับระหว่างดูแลแขกตรงหน้า\nกับตอบลูกค้าที่กำลังจะจอง", mark: "ตอบลูกค้าที่กำลังจะจอง" },
      { text: "คำถามเข้ามาหลายช่องทาง\nแต่ไม่มีคนติดตามต่อจนจบ", mark: "หลายช่องทาง" },
      { text: "ราคาและเงื่อนไขไม่ตรงกัน\nเพราะข้อมูลกระจายอยู่หลายที่", mark: "ไม่ตรงกัน" },
      { text: "ลูกค้าสนใจจองตรง\nแต่ขั้นตอนเสนอราคา ชำระเงิน และยืนยันยังไม่ชัด", mark: "จองตรง" },
      { text: "ยืนยันการจองแล้ว\nแต่ข้อมูลไม่ครบตอนส่งต่อให้หน้างาน", mark: "ข้อมูลไม่ครบ" },
      { text: "เจ้าของโรงแรมยังไม่เห็นว่า\nลูกค้าหายไปตรงไหนในขั้นตอนการจอง", mark: "ลูกค้าหายไปตรงไหน" },
    ],
    problemCaption: "งานจองที่ชัดเจน ช่วยให้ทีมหน้างานโฟกัสกับแขกได้มากขึ้น",
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยดูแลงานอะไร?",
    help: [
      ["01", "รับและตอบคำถามเรื่องการจอง", "ดูแลคำถามจากทุกช่องทาง\nพร้อมตอบเรื่องห้องว่าง ราคา และเงื่อนไข"],
      ["02", "เสนอห้องพักและติดตามลูกค้า", "ช่วยแนะนำตัวเลือกที่เหมาะสม\nและติดตามลูกค้าที่สนใจแต่ยังไม่ยืนยัน"],
      ["03", "จัดการขั้นตอนยืนยันการจอง", "ตรวจรายละเอียดการเข้าพัก ราคา การชำระเงิน\nและข้อมูลสำคัญก่อนยืนยัน"],
      ["04", "ส่งต่องานให้ทีมโรงแรม", "สรุปข้อมูลการจองและคำขอพิเศษ\nให้ทีมหน้างานรับช่วงต่อได้ทันที"],
      ["05", "สรุปข้อมูลเพื่อปรับการขาย", "ดูว่าลูกค้ามาจากช่องทางไหน\nถามเรื่องอะไร ตอบกลับได้เร็วเพียงใด\nและติดตรงจุดไหน\nเพื่อนำข้อมูลไปปรับข้อเสนอ ราคา\nหรือขั้นตอนการขายร่วมกัน"],
    ],
    directTitle: "การจองตรงดีขึ้นได้อย่างไร?",
    directBody:
      "เมื่อมีคนดูแลคำถามและติดตามอย่างต่อเนื่อง ลูกค้าที่ติดต่อโรงแรมโดยตรงจะได้รับข้อมูลที่ชัดและรู้ว่าจะจองต่ออย่างไร ไม่ว่าจะเริ่มจากเว็บไซต์ Google, LINE หรือโทรศัพท์",
    directClose:
      "เดอะ เคพีไอ พลัส ยังสามารถเชื่อมข้อมูลจากงาน Reservations เข้ากับงาน Revenue Management, OTA และการตลาดได้ตามขอบเขตที่ตกลงกัน เช่น หากลูกค้าถามราคาในบางช่วงบ่อยแต่ไม่จอง ทีมจะนำข้อมูลนั้นกลับไปทบทวนราคา ข้อเสนอ หรือเส้นทางจอง แทนที่จะปล่อยให้ข้อมูลจบอยู่ในแชต",
    splitTitle: "ทีม เดอะ เคพีไอ พลัส กับทีมโรงแรมแบ่งงานกันอย่างไร?",
    splitUs: "เดอะ เคพีไอ พลัส",
    splitUsBody: "ดูแลงานรับคำถาม เสนอห้อง ติดตาม ยืนยัน และบันทึกหรือส่งต่อการจองตามขอบเขตบริการ",
    splitHotel: "ทีมโรงแรม",
    splitHotelBody: "ยืนยันข้อมูลห้องพัก ราคา นโยบาย และข้อยกเว้นที่ใช้ตอบลูกค้า พร้อมดูแลแขกเมื่อเข้าพักจริง",
    splitClose:
      "ก่อนเริ่มงาน ทั้งสองทีมจะตกลงเรื่องช่องทางที่ดูแล เวลาทำการ ผู้มีสิทธิ์อนุมัติราคา ขั้นตอนชำระเงิน การใช้ระบบ และวิธีส่งต่อกรณีเร่งด่วนให้ชัดเจน",
    methodTitle: "เริ่มทำงานอย่างไร?",
    steps: [
      ["01", "ดูงานที่มีอยู่", "ตรวจช่องทางติดต่อ ปริมาณคำถาม\nระบบที่ใช้ และปัญหาที่ทีมเจอ"],
      ["02", "กำหนดขอบเขตการดูแล", "ตกลงช่องทาง เวลา ราคา เงื่อนไข\nสิทธิ์การเข้าถึงระบบ และขั้นตอนส่งต่อ"],
      ["03", "เริ่มรับงานและประสานทีม", "ดูแลคำถามและการจองตามขั้นตอนที่อนุมัติ\nพร้อมส่งข้อมูลให้ทีมโรงแรม"],
      ["04", "ทบทวนและพัฒนางาน", "ดูเวลาตอบ จำนวนคำถาม การติดตาม\nผลการจอง และจุดที่ควรปรับร่วมกัน"],
    ],
    measureTitle: "เราติดตามผลอะไร?",
    measureBody:
      "ตัวชี้วัดที่เหมาะสมอาจรวมถึงเวลาตอบกลับ จำนวนลูกค้าที่สอบถาม ช่องทางที่ติดต่อ สัดส่วนคำถามที่กลายเป็นการจอง และงานติดตามที่เสร็จตามกำหนด",
    measureClose:
      "ข้อมูลเหล่านี้ช่วยให้โรงแรมเห็นทั้งคุณภาพการตอบลูกค้าและโอกาสรายได้ โดยวิธีรายงานจะขึ้นอยู่กับช่องทางและระบบที่โรงแรมใช้อยู่",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับการจองตรง และงานจอง",
    details: "ดูรายละเอียด",
    relatedCategoryService: "บริการ",
    relatedMetaService: "หน้าบริการ",
    conversionTitle: "เพิ่มการจองผ่านเว็บไซต์",
    conversionBody: "เมื่อลูกค้าเริ่มจากเว็บไซต์ เส้นทางสอบถามและจองบนหน้าเว็บยังต้องชัดพอให้เดินต่อได้",
    websiteTitle: "ออกแบบเว็บไซต์โรงแรม",
    websiteBody: "เมื่อเว็บไซต์ยังไม่ช่วยให้ลูกค้ามั่นใจก่อนจอง หรือทีมโรงแรมยังแก้ข้อมูลห้องพักและโปรโมชั่นได้ยาก",
    faqIntro:
      "อ่านคำตอบเหล่านี้ก่อนส่งแบบฟอร์ม เพื่อดูขอบเขตงาน ช่องทาง ระบบ และสิ่งที่โรงแรมต้องเตรียม SLA เวลาทำงาน และการเชื่อมระบบจะตกลงเป็นลายลักษณ์อักษรก่อนเริ่มงาน",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Outsourced Reservation Management for hotels",
    title: "Let us look after the reservation work, so your team has time for the guest in front of them",
    lead: "While the team checks guests in, answers the phone, and looks after people already in-house, a new guest asking about rooms or rates can wait too long. The KPI Plus can take and run reservation work on the channels and hours you agree: answering, offering a room, following up, confirming the booking, and handing the details to the hotel team.",
    leadClose: "The hotel then has help looking after a sales chance, while the people on the floor can stay with the guest experience.",
    cta: "Ask the team to review the hotel’s reservation work",
    secondary: "All solutions",
    underCta: "Send the channels guests use, and the hours or tasks you want help with.",
    photoAlt: "A hotel team looking after a guest at the desk while new booking questions arrive",
    problemTitle: "How much reservation work is taking the floor team away from guests?",
    problems: [
      "Staff have to switch between the guest in front of them and a message from someone about to book",
      "Questions arrive on several channels, and no one follows them through to a result",
      "Guests get different rates and conditions because the facts sit in several places",
      "A guest wants to book direct, but the quote, payment, and confirmation steps are still unclear",
      "The booking is confirmed, but key details do not reach the front desk in full",
      "The owner cannot see how many people asked, or where a direct booking was lost",
    ],
    helpTitle: "What reservation work can The KPI Plus look after?",
    help: [
      ["01", "Receive and answer booking questions", "Look after questions on the agreed channels, such as LINE, email, social messages, or the phone, using rooms, rates, and conditions the hotel has approved."],
      ["02", "Offer rooms and follow the guest", "Check availability, state the options and conditions clearly, then follow people who asked but have not decided yet, in the way and at the times agreed with the hotel."],
      ["03", "Run the confirmation step", "Check the stay dates, number of guests, rate, and needed details before recording or handing the booking in the hotel’s system. Taking or confirming payment follows the hotel’s process and authority."],
      ["04", "Hand the work to the hotel team", "Summarise the booking and special requests for the team who will meet the guest, so the guest does not have to tell the same story on arrival."],
      ["05", "Share facts that help the next sale", "See which channel the guest used, what they asked, how fast the reply was, and what still stopped the booking, then use that to adjust the offer, the rate, or the way of working."],
    ],
    directTitle: "How can direct bookings improve?",
    directBody:
      "When someone looks after the questions and the follow-up, a guest who contacts the hotel directly gets a clear answer and knows how to book, whether they started on the website, Google, LINE, or the phone.",
    directClose:
      "The KPI Plus can also connect reservation facts to Revenue Management, OTAs, and marketing in the agreed scope. If guests often ask about a date and then do not book, the team takes that back to the rate, the offer, or the booking path, instead of leaving it inside a chat.",
    splitTitle: "How do The KPI Plus and the hotel team share the work?",
    splitUs: "The KPI Plus",
    splitUsBody: "Looks after receiving questions, offering rooms, follow-up, confirmation, and recording or handing the booking within the service scope.",
    splitHotel: "The hotel team",
    splitHotelBody: "Confirms rooms, rates, policies, and exceptions used in the reply, and looks after the guest when they arrive.",
    splitClose:
      "Before work starts, both teams agree the channels, working hours, who can approve a rate, the payment steps, system access, and how urgent cases are handed over.",
    methodTitle: "How does the work start?",
    steps: [
      ["01", "See the current reservation work", "Review the contact channels, question volume, systems in use, and the problems the team meets."],
      ["02", "Set the scope", "Agree the channels, hours, rates and conditions used in replies, system access, and the hand-over steps."],
      ["03", "Start taking work and stay in contact", "Look after questions and bookings by the approved process, and send the details to the hotel."],
      ["04", "Review the quality of the work", "Look at reply time, question volume, follow-up, booking results, and issues to fix together."],
    ],
    measureTitle: "What do we review?",
    measureBody:
      "Useful measures can include reply time, how many people asked, which channel they used, how many questions became bookings, and follow-up finished on time.",
    measureClose:
      "These facts help the hotel see both the quality of the reply and a revenue chance. How we report depends on the channels and systems the hotel already uses.",
    relatedTitle: "Related Direct Booking and Reservations content",
    details: "Read more",
    relatedCategoryService: "Service",
    relatedMetaService: "Service page",
    conversionTitle: "Website Conversion",
    conversionBody: "When the guest starts on the website, the enquiry and booking path still has to be clear enough to continue.",
    websiteTitle: "Hotel Website Design",
    websiteBody: "When the website does not help guests feel sure before they book, or the hotel team cannot easily update rooms and offers.",
    faqIntro:
      "Read these answers before sending the form, so the hotel can see the scope, channels, systems, and what to prepare. SLA, hours of cover, and any system connection are agreed in writing before work starts.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Outsourced Reservation Management для отелей",
    title: "Пусть мы ведём работу брони, чтобы ваша команда могла быть с гостем",
    lead: "Пока команда заселяет, отвечает на звонки и смотрит за гостями в доме, новый вопрос про номер или цену может ждать слишком долго. The KPI Plus может принимать и вести работу брони по согласованным каналам и часам: отвечать, предлагать номер, напоминать, подтверждать бронь и передавать данные команде отеля.",
    leadClose: "У отеля появляется помощь с шансом продажи, а люди на стойке могут оставаться с гостем.",
    cta: "Попросить команду оценить работу брони отеля",
    secondary: "Все решения",
    underCta: "Отправьте каналы, по которым пишут гости, и часы или задачи, с которыми нужна помощь.",
    photoAlt: "Команда отеля встречает гостя на стойке, пока приходят новые вопросы о брони",
    problemTitle: "Насколько работа брони отнимает команду у гостя?",
    problems: [
      "Сотрудники переключаются между гостем перед ними и сообщением от человека, который собирается бронировать",
      "Вопросы приходят по нескольким каналам, и никто не ведёт их до результата",
      "Гости получают разные цены и условия, потому что данные лежат в разных местах",
      "Гость хочет бронировать напрямую, но шаги цены, оплаты и подтверждения ещё неясны",
      "Бронь подтверждена, но важные данные не доходят до стойки полностью",
      "Собственник не видит, сколько людей спросили и на каком шаге потерялась прямая бронь",
    ],
    helpTitle: "Какую работу брони может взять The KPI Plus?",
    help: [
      ["01", "Принимать и отвечать на вопросы о брони", "Вести вопросы по согласованным каналам: LINE, email, соцсети или телефон, используя номера, цены и условия, которые одобрил отель."],
      ["02", "Предлагать номер и вести гостя", "Проверять наличие, ясно называть варианты и условия, затем напоминать тем, кто спросил, но ещё не решил, способом и в часы, согласованные с отелем."],
      ["03", "Вести шаг подтверждения", "Проверять даты, число гостей, цену и нужные данные, затем записывать или передавать бронь в системе отеля. Приём или подтверждение оплаты идёт по процессу и полномочиям отеля."],
      ["04", "Передавать работу команде отеля", "Кратко передавать бронь и особые просьбы команде, которая встретит гостя, чтобы гостю не пришлось повторять историю на стойке."],
      ["05", "Делиться фактами для следующей продажи", "Видеть канал, вопрос, скорость ответа и то, что ещё мешало брони, затем использовать это, чтобы поправить предложение, цену или способ работы."],
    ],
    directTitle: "Как могут вырасти прямые брони?",
    directBody:
      "Когда кто-то ведёт вопросы и напоминания, гость, который пишет отелю напрямую, получает ясный ответ и понимает, как бронировать: с сайта, Google, LINE или телефона.",
    directClose:
      "The KPI Plus может также связать факты из брони с Revenue Management, OTA и маркетингом в согласованных границах. Если гости часто спрашивают цену на даты и не бронируют, команда возвращает это к цене, предложению или пути брони, а не оставляет внутри чата.",
    splitTitle: "Как The KPI Plus и команда отеля делят работу?",
    splitUs: "The KPI Plus",
    splitUsBody: "Ведёт приём вопросов, предложение номера, напоминание, подтверждение и запись или передачу брони в границах услуги.",
    splitHotel: "Команда отеля",
    splitHotelBody: "Подтверждает номера, цены, правила и исключения для ответа и встречает гостя при заезде.",
    splitClose:
      "До старта обе команды согласовывают каналы, часы, кто может утвердить цену, шаги оплаты, доступ к системе и как передавать срочные случаи.",
    methodTitle: "С чего начинается работа?",
    steps: [
      ["01", "Посмотреть текущую работу брони", "Каналы, объём вопросов, системы и проблемы, которые встречает команда."],
      ["02", "Задать границы", "Согласовать каналы, часы, цены и условия для ответа, доступ к системе и шаги передачи."],
      ["03", "Начать принимать работу и держать связь", "Вести вопросы и брони по утверждённому процессу и передавать данные отелю."],
      ["04", "Разбирать качество работы", "Время ответа, число вопросов, напоминания, результат броней и то, что нужно править вместе."],
    ],
    measureTitle: "Что мы смотрим?",
    measureBody:
      "Полезные показатели могут включать время ответа, число спросивших, канал, долю вопросов, ставших бронью, и напоминания, закрытые вовремя.",
    measureClose:
      "Эти факты помогают отелю видеть и качество ответа, и шанс дохода. Способ отчёта зависит от каналов и систем, которые отель уже использует.",
    relatedTitle: "Материалы про прямое бронирование, доход и сайт",
    details: "Подробнее",
    relatedCategoryService: "Service",
    relatedMetaService: "Service page",
    conversionTitle: "Website Conversion",
    conversionBody: "Если гость начинает с сайта, путь к вопросу и брони на странице всё равно должен быть достаточно ясным.",
    websiteTitle: "Hotel Website Design",
    websiteBody: "When the website does not help guests feel sure before they book, or the hotel team cannot easily update rooms and offers.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "飯店的 Outsourced Reservation Management",
    title: "讓我們協助照顧訂房工作，好讓你的團隊有時間照顧眼前的客人",
    lead: "當團隊在辦理入住、接電話、照顧已入住的客人時，新客人問空房或價格，可能等太久。The KPI Plus 可依談好的管道與時段，接手並處理訂房工作：回覆、提供房型、追蹤、確認預訂，再把資料交給飯店團隊。",
    leadClose: "飯店因此有人幫忙看銷售機會，現場人員也能更專注在客人的住宿體驗。",
    cta: "請團隊評估飯店的訂房工作",
    secondary: "查看全部方案",
    underCta: "留下客人聯繫的管道，以及希望協助的時段或工作。",
    photoAlt: "飯店團隊在櫃檯照顧客人，同時有新的訂房詢問進來",
    problemTitle: "訂房工作佔走現場團隊多少時間？",
    problems: [
      "員工必須在眼前的客人，和即將預訂的訊息之間切換",
      "詢問從多個管道進來，卻沒有人追到結果",
      "客人拿到的價格與條件不一致，因為資料散在多處",
      "客人想直銷預訂，但報價、付款與確認步驟還不清楚",
      "預訂已確認，重要資料卻沒完整傳到櫃檯",
      "業主看不到有多少人詢問，以及直銷預訂卡在哪一步",
    ],
    helpTitle: "The KPI Plus 能照顧哪些訂房工作？",
    help: [
      ["01", "接收並回覆訂房詢問", "依談好的管道照顧詢問，例如 LINE、電子郵件、社群訊息或電話，並使用飯店核准的房型、價格與條件。"],
      ["02", "提供房型並追蹤客人", "檢查空房、清楚說明選項與條件，再依與飯店談好的方式與時段，追蹤已要資料但尚未決定的人。"],
      ["03", "處理確認預訂的步驟", "先核對入住日期、人數、價格與必要資料，再記入或轉入飯店使用的系統。收款或確認付款，依飯店規定的流程與權限進行。"],
      ["04", "把工作交給飯店團隊", "把預訂與特殊需求摘要給現場接待團隊，讓客人到達時不必重講一次。"],
      ["05", "整理能幫助下一筆銷售的資料", "看客人從哪裡來、問什麼、回覆多快，以及還有什麼讓對方沒預訂，再一起調整方案、價格或工作方式。"],
    ],
    directTitle: "直銷預訂可以怎麼變好？",
    directBody:
      "當有人持續回覆與追蹤，直接聯繫飯店的客人會拿到清楚資料，也知道接下來怎麼預訂，無論是從網站、Google、LINE 還是電話開始。",
    directClose:
      "The KPI Plus 也能依談好的範圍，把訂房資料接到 Revenue Management、OTA 與行銷。例如客人常問某些日期的價格卻不預訂，團隊會把這件事帶回價格、方案或預訂路徑，而不是讓它停在聊天室。",
    splitTitle: "The KPI Plus 與飯店團隊如何分工？",
    splitUs: "The KPI Plus",
    splitUsBody: "依服務範圍照顧接詢問、提供房型、追蹤、確認，以及記錄或轉交預訂。",
    splitHotel: "飯店團隊",
    splitHotelBody: "確認回覆客人時使用的房型、價格、政策與例外，並在客人入住時照顧對方。",
    splitClose:
      "開始前，雙方會談清楚照顧的管道、工作時間、誰能核准價格、付款步驟、系統使用，以及緊急情況如何轉交。",
    methodTitle: "如何開始？",
    steps: [
      ["01", "先看現有的訂房工作", "檢查聯繫管道、詢問量、使用中的系統，以及團隊遇到的問題。"],
      ["02", "訂出照顧範圍", "談定管道、時段、回覆用的價格與條件、系統權限，以及轉交步驟。"],
      ["03", "開始接案並與團隊協調", "依核准流程照顧詢問與預訂，並把資料交給飯店。"],
      ["04", "檢視工作品質", "看回覆時間、詢問數、追蹤、預訂結果，以及該一起調整的問題。"],
    ],
    measureTitle: "我們追蹤什麼？",
    measureBody:
      "合適的指標可能包括回覆時間、詢問人數、聯繫管道、詢問轉成預訂的比例，以及依時完成的追蹤。",
    measureClose:
      "這些資料讓飯店同時看到回覆品質與收益機會。報告方式會依飯店現有的管道與系統而定。",
    relatedTitle: "與直銷預訂、收益與網站相關的內容",
    details: "查看詳情",
    relatedCategoryService: "Service",
    relatedMetaService: "Service page",
    conversionTitle: "Website Conversion",
    conversionBody: "當客人從網站開始，詢問與預訂路徑仍須清楚到走得下去。",
    websiteTitle: "Hotel Website Design",
    websiteBody: "When the website does not help guests feel sure before they book, or the hotel team cannot easily update rooms and offers.",
  },
} as const;

export async function ReservationsView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const insights = insightPosts
    .filter((post) => relatedInsightHrefs.includes(post.href as (typeof relatedInsightHrefs)[number]))
    .map((post) => ({
      post,
      href: existingHref(post.href, locale) ?? (pageByRoute.has(post.href) ? post.href : null),
    }))
    .filter((item): item is { post: (typeof insightPosts)[number]; href: string } => Boolean(item.href));
  const conversionHref = existingHref("/solutions/hotel-direct-bookings", locale);
  const websiteHref = existingHref("/solutions/hotel-website-design", locale);
  const heroSrc = reservationsHeroVisualUrl();
  const problemSrc = reservationsProblemVisualUrl();
  const workflowSrc = reservationsWorkflowVisualUrl();
  const serviceMapSrc = reservationsServiceMapVisualUrl();
  const bookingFlowSrc = reservationsBookingFlowVisualUrl();
  const kpiSrc = reservationsKpiVisualUrl();
  const relatedSrc = reservationsRelatedVisualUrl([heroSrc, problemSrc]);
  const teamPhotoSrc = reservationsTeamVisualUrl([heroSrc, problemSrc]);
  const publicKpis = reservationKpisForPublic();
  const websiteBody = solutionsIndexCopy[locale].problems["/solutions/hotel-website-design"] || t.websiteBody;
  const scopeLabel = locale === "th" ? "งานที่อาจอยู่ในขอบเขตที่ตกลงกัน" : "Work that may be in the agreed scope";
  const pageRoute = localizePath("/solutions/outsourced-hotel-reservations", locale);
  const faqs = faqsForRoute(pageRoute);

  return (
    <SiteShell locale={locale} route={pageRoute} hideFaqs>
      <PageHero className="kpi-reservations-hero">
        <div className="kpi-reservations-hero-grid">
          <div className="kpi-reservations-hero-copy">
            <nav aria-label="Breadcrumb" className="kpi-reservations-hero-crumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href={solutions}>{t.crumb}</Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span>{solutionNavLabel("/solutions/outsourced-hotel-reservations", locale)}</span>
                </li>
              </ol>
            </nav>
            <h1 className="kpi-h1 kpi-reservations-hero-title">
              {locale === "th" ? (
                <>
                  <span className="kpi-reservations-hero-line">ให้เราช่วยดูแลงานจอง</span>
                  <span className="kpi-reservations-hero-line">เพื่อให้ทีมของคุณ</span>
                  <span className="kpi-reservations-hero-line kpi-reservations-hero-em">มีเวลาดูแลแขก</span>
                </>
              ) : (
                t.title
              )}
            </h1>
            {locale === "th" ? (
              <>
                <p className="kpi-reservations-hero-lead">{copy.th.lead.replaceAll("\n", " ")}</p>
                <p className="kpi-reservations-hero-lead kpi-reservations-hero-lead-next">
                  {copy.th.leadNext.replaceAll("\n", " ")}
                </p>
                <p className="kpi-reservations-hero-outcome">
                  {copy.th.leadClose.split("\n").map((line) => (
                    <span key={line} className="kpi-reservations-hero-outcome-line">
                      {line}
                    </span>
                  ))}
                </p>
              </>
            ) : (
              <>
                <p className="kpi-reservations-hero-lead">{t.lead}</p>
                <p className="kpi-reservations-hero-outcome">{t.leadClose}</p>
              </>
            )}
            <p className="kpi-reservations-hero-scope-intro">
              {locale === "th"
                ? "เมื่อโรงแรมอนุมัติขอบเขตแล้ว บริการนี้ช่วยดูแลได้"
                : "When the hotel approves the scope, the service can support"}
            </p>
            <ul className="kpi-reservations-hero-scope" aria-label={scopeLabel}>
              {HERO_CAPABILITIES.map((item) => (
                <li key={item.id}>{locale === "th" ? item.th : item.en}</li>
              ))}
            </ul>
            <div className="kpi-actions">
              <a href="#reservations-enquiry" className="kpi-button">
                {locale === "th" ? copy.th.heroCta : t.cta}{" "}
                <span className="kpi-reservations-hero-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <Link href={solutions} className="kpi-button-ghost kpi-reservations-hero-secondary">
                {t.secondary}
              </Link>
            </div>
            <p className="kpi-reservations-hero-note">
              {locale === "th" ? copy.th.underCta.replaceAll("\n", " ") : t.underCta}
            </p>
          </div>
          <ReservationsHeroVisual locale={locale} src={heroSrc} />
        </div>
      </PageHero>

      <section className="kpi-section kpi-reservations-problems">
        <h2 className="kpi-h2 kpi-reservations-problem-title">
          {locale === "th" ? (
            <>
              <span className="kpi-reservations-problem-title-line">
                งานจองกำลัง<span className="kpi-reservations-problem-title-em">ดึงเวลา</span>
              </span>
              <span className="kpi-reservations-problem-title-br"> </span>
              <span className="kpi-reservations-problem-title-line">ทีมหน้างานไปมากแค่ไหน?</span>
            </>
          ) : (
            t.problemTitle
          )}
        </h2>
        <div className="kpi-reservations-problems-grid">
          <div className="kpi-reservations-problem-list">
            {RESERVATION_PROBLEM_ITEMS.map((item, index) => (
              <article key={item.problemEn} className="kpi-reservations-problem">
                <span className="kpi-reservations-problem-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <div className="kpi-reservations-problem-body">
                  <p className="kpi-reservations-problem-text">
                    <span className="kpi-reservations-problem-layer-label kpi-latin">Problem</span>
                    {locale === "th"
                      ? item.problemTh
                      : locale === "en"
                        ? item.problemEn
                        : copy[locale].problems[index]}
                  </p>
                  <p className="kpi-reservations-problem-impact">
                    <span className="kpi-reservations-problem-layer-label kpi-latin">Impact</span>
                    {locale === "th" ? item.impactTh : item.impactEn}
                  </p>
                  <p className="kpi-reservations-problem-support">
                    <span className="kpi-reservations-problem-layer-label kpi-latin">Support</span>
                    {locale === "th" ? item.supportTh : item.supportEn}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <ReservationsProblemVisual
            locale={locale}
            src={problemSrc}
            caption={locale === "th" ? copy.th.problemCaption : "Sample data · Reservation Queue / Booking Inbox"}
          />
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-reservations-help">
          <p className="kpi-reservations-help-kicker kpi-latin">RESERVATION SUPPORT</p>
          <h2 className="kpi-h2 kpi-reservations-help-title">{t.helpTitle}</h2>
          <div className="kpi-reservations-scope-grid">
            {SCOPE_ITEMS.map((item) => (
              <article key={item.id} className="kpi-reservations-scope-card">
                <span className="kpi-reservations-scope-icon" aria-hidden="true">
                  <ReservationScopeIcon id={item.id} />
                </span>
                <div className="kpi-reservations-scope-copy">
                  <h3 className="kpi-reservations-help-name kpi-latin">{item.titleEn}</h3>
                  <p className="kpi-reservations-help-body">
                    {locale === "th" ? item.descriptionTh : item.descriptionEn}
                  </p>
                  <dl className="kpi-reservations-scope-io">
                    <div>
                      <dt className="kpi-latin">Input</dt>
                      <dd>{locale === "th" ? item.inputTh : item.inputEn}</dd>
                    </div>
                    <div>
                      <dt className="kpi-latin">Output</dt>
                      <dd>{locale === "th" ? item.outputTh : item.outputEn}</dd>
                    </div>
                  </dl>
                  {item.channels?.length ? (
                    <ul className="kpi-reservations-scope-channels" aria-label="Channels">
                      {item.channels.map((channel) => (
                        <li key={channel} className="kpi-latin">
                          {channel}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <aside className="kpi-reservations-hotel-owns">
            <p className="kpi-reservations-hotel-owns-title">
              {locale === "th"
                ? "โรงแรมเป็นผู้พิจารณาหรือเป็นเจ้าของเรื่องต่อไปนี้ ตามที่ใช้กับแต่ละงาน"
                : "The hotel approves or owns the following, when they apply to the work"}
            </p>
            <ul>
              {HOTEL_OWNED_WHEN_APPLICABLE.map((item) => (
                <li key={item.id}>{locale === "th" ? item.th : item.en}</li>
              ))}
            </ul>
            <p className="kpi-reservations-hotel-owns-note">
              {locale === "th"
                ? "ขอบเขตจริงขึ้นกับข้อตกลงของแต่ละโรงแรม ไม่ได้ประกาศเส้นแบ่งงานตายตัวในหน้านี้"
                : "The live split follows each hotel’s agreement. This page does not publish a fixed ownership boundary."}
            </p>
          </aside>
          <ReservationsServiceMap locale={locale} src={serviceMapSrc} />
          <a href="#reservations-enquiry" className="kpi-button kpi-reservations-help-cta">
            {t.cta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="kpi-section kpi-reservations-direct">
        <div className="kpi-reservations-direct-inner">
          <h2 className="kpi-h2 kpi-reservations-direct-title">
            {locale === "th" ? (
              <>
                <span className="kpi-reservations-direct-em">การจองตรง</span>ดีขึ้นได้อย่างไร?
              </>
            ) : (
              t.directTitle
            )}
          </h2>
          <p className="kpi-reservations-direct-intro">
            {locale === "th" ? (
              <>
                เมื่อมีคนดูแลคำถามและติดตามลูกค้าอย่างต่อเนื่อง
                <span className="kpi-reservations-direct-br"> </span>
                ทุก <span className="kpi-latin">enquiry</span> จะชัดเจนขึ้น ตั้งแต่ลูกค้าติดต่อเข้ามา
                <span className="kpi-reservations-direct-br"> </span>
                จนถึงการยืนยันการจอง
              </>
            ) : (
              t.directBody
            )}
          </p>
          <ReservationsBookingFlow locale={locale} src={bookingFlowSrc} />
          <div className="kpi-reservations-benefits-grid">
            {RESERVATION_BENEFIT_GROUPS.map((group) => (
              <article key={group.id} className="kpi-reservations-benefit-group">
                <h3 className="kpi-latin">{group.titleEn}</h3>
                {locale === "th" ? <p className="kpi-reservations-benefit-kicker">{group.titleTh}</p> : null}
                <ul>
                  {group.items.map((item) => (
                    <li key={item.en}>{locale === "th" ? item.th : item.en}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-reservations-split">
          <h2 className="kpi-h2 kpi-reservations-split-title">{t.splitTitle}</h2>
          <ReservationsWorkflowMap locale={locale} src={workflowSrc} />
          {locale === "th" ? (
            <div className="kpi-reservations-split-note">
              <p className="kpi-reservations-split-note-title">ก่อนเริ่มงาน เราจะตกลงร่วมกันเรื่อง</p>
              <p className="kpi-reservations-split-note-body">
                ช่องทางที่ดูแล · เวลาทำการ · สิทธิ์อนุมัติราคา · ขั้นตอนชำระเงิน · ระบบที่ใช้ · วิธีส่งต่อกรณีเร่งด่วน
              </p>
            </div>
          ) : (
            <p className="kpi-reservations-split-note kpi-reservations-split-note-body">{t.splitClose}</p>
          )}
          <dl className="reservations-settings">
            <div>
              <dt>{locale === "th" ? "ช่องทางที่ดูแล" : "Supported channels"}</dt>
              <dd>{RESERVATION_SERVICE_SETTINGS.supportedChannels.join(" · ")}</dd>
            </div>
            <div>
              <dt>{locale === "th" ? "เวลาทำการ" : "Hours of cover"}</dt>
              <dd>
                {locale === "th"
                  ? RESERVATION_SERVICE_SETTINGS.slaTextTh
                  : RESERVATION_SERVICE_SETTINGS.slaTextEn}
              </dd>
            </div>
            <div>
              <dt>{locale === "th" ? "วิธีส่งต่อกรณีเร่งด่วน" : "Escalation"}</dt>
              <dd>{RESERVATION_SERVICE_SETTINGS.escalationPath}</dd>
            </div>
            <div>
              <dt>{locale === "th" ? "ระบบที่ใช้" : "Systems"}</dt>
              <dd>{RESERVATION_SERVICE_SETTINGS.integrationNotes}</dd>
            </div>
          </dl>
          <ReservationsWorkflowMap locale={locale} src={workflowSrc} />
        </div>
      </section>

      <section className="kpi-section kpi-reservations-method">
        <h2 className="kpi-h2 kpi-reservations-method-title">{t.methodTitle}</h2>
        <ol className="kpi-reservations-method-list">
          {t.steps.map(([num, title, body], index) => (
            <li key={num} className="kpi-reservations-method-step">
              <span className="kpi-reservations-method-num kpi-latin">{num}</span>
              <div className="kpi-reservations-method-copy">
                <p className="kpi-reservations-method-phase kpi-latin">{methodPhases[index]}</p>
                <h3>{title}</h3>
                <p className="kpi-reservations-method-body">
                  {body.split("\n").map((line, lineIndex) => (
                    <Fragment key={`${num}-${lineIndex}`}>
                      {lineIndex > 0 ? <span className="kpi-reservations-method-br"> </span> : null}
                      {line}
                    </Fragment>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-reservations-measure">
          <h2 className="kpi-h2 kpi-reservations-measure-title">{t.measureTitle}</h2>
          {locale === "th" ? (
            <p className="kpi-reservations-measure-intro">
              ไม่ใช่แค่ตอบลูกค้าให้เร็ว
              <span className="kpi-reservations-measure-br"> </span>
              แต่ดูว่าคำถามแต่ละช่องทางเปลี่ยนเป็นยอดจองได้แค่ไหน
            </p>
          ) : (
            <p className="kpi-reservations-measure-intro">{t.measureBody}</p>
          )}
          <p className="kpi-reservations-measure-sample">
            {locale === "th"
              ? "ตัวอย่างข้อมูล · ไม่ใช่ผลลัพธ์ของโรงแรม และไม่มีค่า SLA"
              : "Sample Visual. Not hotel results, and no SLA values."}
          </p>
          <div className="kpi-reservations-measure-metrics">
            {publicKpis.map((kpi) => (
              <ReservationKpiMetricCard key={kpi.id} kpi={kpi} locale={locale} />
            ))}
          </div>
          <ReservationsKpiVisual locale={locale} src={kpiSrc} />
          {locale === "th" ? (
            <p className="kpi-reservations-measure-close">
              <span>เพื่อให้โรงแรมเห็นทั้งคุณภาพการตอบลูกค้า</span>
              <span className="kpi-reservations-measure-close-strong">และโอกาสรายได้ที่เกิดขึ้นจริง</span>
            </p>
          ) : (
            <p className="kpi-reservations-measure-close">{t.measureClose}</p>
          )}
        </div>
      </section>

      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-reservations-related">
          <h2 className="kpi-h2 kpi-reservations-related-title">
            {locale === "th" ? (
              <>
                <span className="kpi-reservations-related-title-line">เรื่องที่เกี่ยวข้องกับการจองตรง</span>
                <span className="kpi-reservations-related-br"> </span>
                <span className="kpi-reservations-related-title-line">และงานจอง</span>
              </>
            ) : (
              t.relatedTitle
            )}
          </h2>
          <div className="kpi-reservations-related-grid">
            {insights.map(({ post, href }) => {
              const updated = insightUpdatedAt(post);
              const dateIso = updated || post.publishedAt;
              const dateLabel = dateIso
                ? `${updated ? insightsUi.updated : insightsUi.published} ${formatInsightDate(dateIso, locale)}`
                : undefined;
              return (
                <Link key={post.slug} href={href} className="kpi-reservations-related-item is-featured">
                  <ReservationsRelatedVisual locale={locale} src={relatedSrc} />
                  <p className="kpi-reservations-related-cat">{post.category[locale]}</p>
                  <h3>{post.title[locale] || post.title.th}</h3>
                  <p>{insightExcerpt(post, locale)}</p>
                  <p className="kpi-reservations-related-meta">
                    {dateLabel ? <span>{dateLabel}</span> : null}
                    <span>
                      {post.readingTimeMinutes} {insightsUi.minutes}
                    </span>
                  </p>
                  <span className="kpi-reservations-related-cta">
                    {insightsUi.read}
                    <span className="kpi-reservations-related-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </Link>
              );
            })}
            <div className="kpi-reservations-related-side">
              {conversionHref ? (
                <Link href={conversionHref} className="kpi-reservations-related-item">
                  <p className="kpi-reservations-related-cat">{t.relatedCategoryService}</p>
                  <h3>{solutionNavLabel("/solutions/hotel-direct-bookings", locale)}</h3>
                  <p>{t.conversionBody}</p>
                  <p className="kpi-reservations-related-meta">
                    <span>{t.relatedMetaService}</span>
                  </p>
                  <span className="kpi-reservations-related-cta">
                    {t.details}
                    <span className="kpi-reservations-related-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </Link>
              ) : null}
              {websiteHref ? (
                <Link href={websiteHref} className="kpi-reservations-related-item">
                  <p className="kpi-reservations-related-cat">{t.relatedCategoryService}</p>
                  <h3>{solutionNavLabel("/solutions/hotel-website-design", locale)}</h3>
                  <p>{websiteBody}</p>
                  <p className="kpi-reservations-related-meta">
                    <span>{t.relatedMetaService}</span>
                  </p>
                  <span className="kpi-reservations-related-cta">
                    {t.details}
                    <span className="kpi-reservations-related-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <PageFaqs
        items={faqs}
        locale={locale}
        sectionId="reservations-faq"
        intro={locale === "th" ? copy.th.faqIntro : copy.en.faqIntro}
      />
      <ReservationsEnquiry locale={locale} teamPhotoSrc={teamPhotoSrc} />
      <ReservationsStickyCta label={t.cta} />
    </SiteShell>
  );
}

function ReservationKpiMetricCard({ kpi, locale }: { kpi: ReservationKpi; locale: Locale }) {
  const thai = locale === "th";
  const value = formatReservationKpiValue(kpi);
  const updated = formatReservationKpiUpdatedAt(kpi.updatedAt);
  const unit = reservationKpiUnitLabel(kpi, locale);
  const period = reservationKpiPeriod(kpi, locale);
  const labels = thai
    ? {
        period: "ช่วงวัด",
        unit: "หน่วย",
        value: "ค่า",
        target: "เป้าหมาย",
        status: "สถานะข้อมูล",
        updated: "อัปเดต",
      }
    : {
        period: "Period",
        unit: "Unit",
        value: "Value",
        target: "Target",
        status: "Data status",
        updated: "Updated",
      };
  const target =
    typeof kpi.target === "number" && Number.isFinite(kpi.target)
      ? kpi.unit === "%"
        ? `${kpi.target}%`
        : String(kpi.target)
      : undefined;

  return (
    <article className="kpi-reservations-measure-metric">
      <p className="kpi-reservations-measure-name kpi-latin">{kpi.name}</p>
      {value ? (
        <p className="kpi-reservations-measure-value">
          <span className="kpi-reservations-measure-value-label">{labels.value}</span>
          {value}
        </p>
      ) : null}
      <p className="kpi-reservations-measure-label">{thai ? kpi.definitionTh : kpi.definitionEn}</p>
      <dl className="kpi-reservations-measure-meta">
        <div>
          <dt>{labels.period}</dt>
          <dd>{period}</dd>
        </div>
        {unit ? (
          <div>
            <dt>{labels.unit}</dt>
            <dd>{unit}</dd>
          </div>
        ) : null}
        {target ? (
          <div>
            <dt>{labels.target}</dt>
            <dd>{target}</dd>
          </div>
        ) : null}
        <div>
          <dt>{labels.status}</dt>
          <dd>{kpi.dataStatus}</dd>
        </div>
        {updated ? (
          <div>
            <dt>{labels.updated}</dt>
            <dd>{updated}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
