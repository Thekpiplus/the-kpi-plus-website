import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { HotelSystemsEnquiry } from "@/components/HotelSystemsEnquiry";
import { HotelSystemsStickyCta } from "@/components/HotelSystemsStickyCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const platforms = [
  { name: "Cloudbeds", src: "/brand/platforms/cloudbeds.png" },
  { name: "SiteMinder", src: "/brand/platforms/siteminder.png" },
  { name: "Yanolja Cloud", src: "/brand/platforms/yanolja.png" },
  { name: "OPERA Cloud", src: "/brand/platforms/opera-cloud.png" },
  { name: "NAWA", src: "/brand/platforms/nawa.png" },
  { name: "HotelierGuru", src: "/brand/platforms/hotelierguru.png" },
] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "ระบบโรงแรมและการนำไปใช้",
    title: "ระบบเชื่อมกันได้ แต่ทีมและข้อมูลต้องทำงานไปด้วยกัน",
    lead: "PMS, Channel Manager, Booking Engine และ OTA เป็นส่วนสำคัญของการขายห้องพัก หากประเภทห้อง ราคา หรือจำนวนห้องว่างตั้งค่าไม่ตรงกัน ทีมอาจต้องแก้ข้อมูลซ้ำ ตอบลูกค้าลำบาก และใช้รายงานประกอบการตัดสินใจได้ไม่เต็มที่",
    leadClose:
      "เดอะ เคพีไอ พลัส ช่วยโรงแรมเลือก ตั้งค่า เชื่อมต่อ และปรับการใช้ระบบ โดยมองทั้งงานหน้าโรงแรม การสำรองห้องพัก การขายออนไลน์ และการบริหารรายได้ เพื่อให้เทคโนโลยีรองรับวิธีทำงานจริง",
    cta: "ให้ทีมตรวจโครงสร้างระบบโรงแรม",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม ระบบที่ใช้อยู่ และปัญหาที่พบ ไม่ต้องส่งรหัสผ่าน",
    photoAlt: "ทีมโรงแรมตรวจโครงสร้างห้องพัก ราคา และช่องทางขายบนระบบ",
    problemTitle: "โรงแรมของคุณกำลังเจอเรื่องนี้หรือไม่?",
    problems: [
      "ประเภทห้องหรือ Rate Plan ในแต่ละระบบจับคู่กันไม่ชัด",
      "เปลี่ยนราคาในระบบหนึ่งแล้วไม่แน่ใจว่า OTA หรือเว็บไซต์อัปเดตถูกต้องหรือไม่",
      "จำนวนห้องว่างและเงื่อนไขการขายในแต่ละช่องทางไม่ตรงกัน",
      "พนักงานต้องทำงานซ้ำ เพราะระบบกับขั้นตอนของทีมไม่สอดคล้องกัน",
      "มีรายงานจำนวนมาก แต่ตอบไม่ได้ว่ายอดขายมาจากช่องทางไหนหรือควรปรับอะไร",
      "กำลังจะเปิดโรงแรมหรือย้ายระบบ แต่ยังไม่รู้ว่าต้องเตรียมข้อมูลและทดสอบอะไรบ้าง",
    ],
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยส่วนไหนได้บ้าง?",
    help: [
      ["01", "PMS และโครงสร้างห้องพัก", "จัดประเภทห้อง จำนวนห้อง ราคา นโยบาย และข้อมูลหลักที่ทีมต้องใช้ เพื่อให้การจองและการทำงานประจำวันมีจุดอ้างอิงที่ชัดเจน"],
      ["02", "Channel Manager และ OTA", "ตรวจการจับคู่ห้องและ Rate Plan การส่งราคาและห้องว่างไปยังช่องทางขาย รวมถึงทดสอบว่าข้อมูลและการจองกลับมาถูกต้อง"],
      ["03", "Booking Engine และการจองตรง", "ดูราคา แพ็กเกจ เงื่อนไข และเส้นทางจองบนเว็บไซต์ เพื่อให้ข้อมูลที่ลูกค้าเห็นตรงกับสิ่งที่โรงแรมพร้อมขาย"],
      ["04", "รายงานที่ใช้ตัดสินใจ", "จัดข้อมูลจากระบบให้ทีมดูรายได้ อัตราเข้าพัก ราคาเฉลี่ย ยอดจองล่วงหน้า และผลงานแต่ละช่องทางตามข้อมูลที่ระบบรองรับ"],
      ["05", "วิธีทำงานและการอบรมทีม", "กำหนดว่าใครเปลี่ยนราคา ใครตรวจการจอง ใครแก้ข้อมูลเมื่อเกิดปัญหา พร้อมอบรมจากสถานการณ์ที่พนักงานเจอจริง"],
    ],
    existingTitle: "เริ่มจากระบบที่มีอยู่ก่อน",
    existingBody:
      "โรงแรมไม่จำเป็นต้องเปลี่ยน PMS หรือ Channel Manager ทุกครั้งที่พบปัญหา บางกรณีเกิดจากการตั้งค่า การจับคู่ข้อมูล หรือขั้นตอนทำงานที่แก้ไขได้ในระบบเดิม",
    existingClose: "หากระบบปัจจุบันมีข้อจำกัด ทีมจะช่วยระบุว่าข้อจำกัดนั้นกระทบงานส่วนใด ก่อนพิจารณาทางเลือกและการย้ายระบบร่วมกับโรงแรม",
    stageTitle: "รองรับทั้งโรงแรมก่อนเปิดและโรงแรมที่ดำเนินงานอยู่",
    stages: [
      ["โรงแรมก่อนเปิด", "วางประเภทห้อง ราคา ระบบจอง ช่องทาง OTA รายงาน และวิธีทำงานให้พร้อมก่อนเริ่มรับแขก"],
      ["โรงแรมที่เปิดแล้ว", "ตรวจการตั้งค่าที่ใช้อยู่ แก้ปัญหาการเชื่อมต่อ ลดงานซ้ำ และปรับรายงานให้ช่วยการตัดสินใจมากขึ้น"],
      ["โรงแรมที่กำลังย้ายระบบ", "วางแผนข้อมูลที่ต้องย้าย ขั้นตอนการเชื่อมต่อ การทดสอบ การอบรม และช่วงส่งต่องานกับผู้ให้บริการระบบ"],
    ],
    methodTitle: "เราทำงานอย่างไร?",
    steps: [
      ["01", "ตรวจระบบและปัญหาจริง", "ดูระบบที่ใช้ โครงสร้างห้องและราคา ช่องทางขาย และขั้นตอนของทีม"],
      ["02", "ออกแบบวิธีทำงาน", "ระบุว่าข้อมูลใดควรอยู่ในระบบไหน และใครรับผิดชอบการอัปเดต"],
      ["03", "ตั้งค่าหรือปรับโครงสร้าง", "ทำงานตามสิทธิ์เข้าถึงและความสามารถของแต่ละแพลตฟอร์ม"],
      ["04", "เชื่อมต่อและทดสอบ", "ตรวจราคา ห้องว่าง เงื่อนไข และการรับจองจากช่องทางสำคัญ"],
      ["05", "อบรมและส่งต่องาน", "ให้ทีมทดลองทำงานจริงและรู้วิธีตรวจหรือแจ้งปัญหา"],
      ["06", "ทบทวนหลังเริ่มใช้", "แก้จุดที่พบจากการใช้งานจริงตามขอบเขตที่ตกลงกัน"],
    ],
    methodNote: "งานเชื่อมต่อบางส่วนต้องดำเนินการหรืออนุมัติโดยผู้ให้บริการระบบ เดอะ เคพีไอ พลัส จะช่วยประสานและตรวจผลร่วมกับโรงแรม",
    platformsTitle: "ระบบที่ทีมมีประสบการณ์ทำงานร่วมด้วย",
    platformsBody:
      "ขอบเขตงานอาจเกี่ยวข้องกับแพลตฟอร์มที่โรงแรมใช้อยู่ เช่น Cloudbeds, SiteMinder, Yanolja Cloud Solution, Oracle Hospitality OPERA Cloud, NAWA และ HotelierGuru รวมถึงระบบอื่นที่ต้องตรวจความสามารถและสิทธิ์การเข้าถึงเป็นรายกรณี",
    platformsNote: "ชื่อและโลโก้ใช้เพื่อระบุแพลตฟอร์มที่เกี่ยวข้องกับงานเท่านั้น ไม่ได้หมายถึงการรับรองหรือความร่วมมืออย่างเป็นทางการจากเจ้าของแพลตฟอร์ม",
    readyTitle: "เราดูอย่างไรว่าระบบพร้อมใช้งาน?",
    readyBody: "เราไม่ได้ดูเพียงสถานะว่า “เชื่อมต่อแล้ว” แต่ตรวจงานที่โรงแรมต้องใช้จริง เช่น:",
    ready: [
      "ห้องและราคาจับคู่ถูกต้องในช่องทางสำคัญ",
      "การเปลี่ยนราคาและห้องว่างส่งไปถึงช่องทางที่เกี่ยวข้อง",
      "การจองจาก OTA หรือเว็บไซต์เข้าระบบตามที่ควร",
      "ทีมรู้ว่าใครเป็นผู้ตรวจและแก้ปัญหา",
      "รายงานตอบคำถามด้านยอดขายและรายได้ที่โรงแรมต้องใช้",
    ],
    readyClose: "รายละเอียดการทดสอบจะกำหนดตามระบบและขอบเขตงานของแต่ละโรงแรม",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับรายได้ งานจอง และระบบ",
    details: "ดูรายละเอียด",
    revenueTitle: "บริหารรายได้และกลยุทธ์การขาย",
    revenueBody: "ระบบที่ตั้งค่าแล้ว ยังต้องดูร่วมกับราคา ช่องทางขาย และการจองตรงในภาพรวมรายได้",
    reservationsTitle: "บริการทีมรับจองสำหรับโรงแรม",
    reservationsBody: "เมื่อระบบพร้อมแล้ว ทีมยังต้องมีคนดูแลคำถามและการจองจากช่องทางที่ตกลงกัน",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Set up hotel systems and put them to work",
    title: "Systems can connect. The team and the data still have to work together.",
    lead: "The PMS, channel manager, booking engine, and OTAs are a core part of selling rooms. If room types, rates, or availability are not set the same way, the team may edit the same facts twice, find it hard to answer guests, and cannot fully use reports to decide.",
    leadClose:
      "The KPI Plus helps hotels choose, set up, connect, and adjust how systems are used. We look at the front desk, reservations, online sales, and revenue work, so the technology supports the way the hotel actually works.",
    cta: "Ask the team to review the hotel system setup",
    secondary: "All solutions",
    underCta: "Send the hotel name, the systems in use, and the problem. Do not send a password.",
    photoAlt: "A hotel team reviewing room types, rates, and sales channels in their systems",
    problemTitle: "Is the hotel meeting one of these?",
    problems: [
      "Room types or rate plans are not clearly mapped across systems",
      "A rate is changed in one system, and it is unclear whether the OTA or website updated correctly",
      "Availability and selling conditions do not match across channels",
      "Staff repeat the same work because the system and the team process do not match",
      "There are many reports, but they do not say which channel created the sales or what to change",
      "The hotel is about to open or move systems, and it is still unclear what data to prepare and what to test",
    ],
    helpTitle: "What The KPI Plus can help with",
    help: [
      ["01", "PMS and room structure", "Set room types, room count, rates, policy, and the core facts the team needs, so daily bookings and work have a clear source."],
      ["02", "Channel manager and OTAs", "Review room and rate-plan mapping, how rates and availability are sent to sales channels, and test that facts and bookings come back correctly."],
      ["03", "Booking engine and direct booking", "Review rates, packages, conditions, and the booking path on the website, so what the guest sees matches what the hotel can sell."],
      ["04", "Reports the team can decide from", "Arrange system data so the team can see revenue, occupancy, average rate, future bookings, and each channel’s result, as far as the systems can support."],
      ["05", "Ways of working and team training", "Agree who changes the rate, who checks bookings, and who fixes facts when something breaks, then train from the situations staff actually meet."],
    ],
    existingTitle: "Start with the systems you already have",
    existingBody:
      "A hotel does not have to change the PMS or channel manager every time there is a problem. Some cases come from settings, mapping, or a work step that can be fixed in the current systems.",
    existingClose: "If the current system has a limit, the team will name which part of the work it affects before looking at options and a move with the hotel.",
    stageTitle: "For hotels before opening, and hotels already running",
    stages: [
      ["Before opening", "Set room types, rates, the booking system, OTA channels, reports, and the way of working before guests arrive."],
      ["Already operating", "Review the current setup, fix connection problems, reduce repeated work, and make reports more useful for decisions."],
      ["Moving systems", "Plan the data that must move, the connection steps, testing, training, and the hand-over period with the system provider."],
    ],
    methodTitle: "How we work",
    steps: [
      ["01", "Review the systems and the real problem", "Look at the systems in use, room and rate structure, sales channels, and the team’s steps."],
      ["02", "Design the way of working", "Name which facts should sit in which system, and who owns the update."],
      ["03", "Set up or adjust the structure", "Work within the access and the capability of each platform."],
      ["04", "Connect and test", "Check rates, availability, conditions, and bookings from the main channels."],
      ["05", "Train and hand over", "Let the team try the real work, and know how to check or report a problem."],
      ["06", "Review after go-live", "Fix issues found in real use, within the agreed scope."],
    ],
    methodNote: "Some connection work has to be done or approved by the system provider. The KPI Plus helps coordinate and review the result with the hotel.",
    platformsTitle: "Systems the team has worked with",
    platformsBody:
      "The work may involve platforms the hotel already uses, such as Cloudbeds, SiteMinder, Yanolja Cloud Solution, Oracle Hospitality OPERA Cloud, NAWA, and HotelierGuru, and other systems that have to be reviewed case by case for capability and access.",
    platformsNote: "Names and logos are used only to name platforms related to the work. They do not mean an endorsement or a formal partnership with the platform owners.",
    readyTitle: "How do we know a system is ready to use?",
    readyBody: "We do not only look at a status that says “connected”. We check the work the hotel actually needs, such as:",
    ready: [
      "Rooms and rates are mapped correctly on the main channels",
      "A change to the rate or availability reaches the related channels",
      "A booking from an OTA or the website enters the system as it should",
      "The team knows who checks and who fixes a problem",
      "Reports answer the sales and revenue questions the hotel needs",
    ],
    readyClose: "The test detail is set from the systems and the scope of work for each hotel.",
    relatedTitle: "Related reading on revenue, reservations, and systems",
    details: "Read more",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "Once the systems are set, rates, channels, and direct booking still have to sit in one revenue picture.",
    reservationsTitle: "Outsourced Reservation Management",
    reservationsBody: "When the systems are ready, someone still has to look after questions and bookings on the agreed channels.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Настроить системы отеля и запустить их в работу",
    title: "Системы могут быть связаны. Команда и данные всё равно должны работать вместе.",
    lead: "PMS, channel manager, booking engine и OTA — важная часть продажи номеров. Если типы номеров, цены или наличие настроены по-разному, команда может править одни и те же данные дважды, с трудом отвечать гостям и не полностью использовать отчёты для решений.",
    leadClose:
      "The KPI Plus помогает отелю выбрать, настроить, связать и скорректировать использование систем. Смотрим стойку, бронь, онлайн-продажи и работу с доходом, чтобы технология поддерживала реальный способ работы отеля.",
    cta: "Попросить команду проверить структуру систем отеля",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, системы и проблему. Пароль отправлять не нужно.",
    photoAlt: "Команда отеля проверяет типы номеров, цены и каналы продаж в системах",
    problemTitle: "Отель встречает что-то из этого?",
    problems: [
      "Типы номеров или rate plan в разных системах сопоставлены неясно",
      "Цену меняют в одной системе и не уверены, что OTA или сайт обновились верно",
      "Наличие и условия продажи на разных каналах не совпадают",
      "Сотрудники делают одну и ту же работу повторно, потому что система и процесс команды не совпадают",
      "Отчётов много, но они не говорят, какой канал дал продажи и что менять",
      "Отель скоро откроется или меняет систему и ещё не ясно, какие данные готовить и что тестировать",
    ],
    helpTitle: "Чем может помочь The KPI Plus",
    help: [
      ["01", "PMS и структура номеров", "Задать типы номеров, число номеров, цены, правила и основные данные, которые нужны команде, чтобы бронь и ежедневная работа имели ясную точку опоры."],
      ["02", "Channel manager и OTA", "Проверить сопоставление номеров и rate plan, отправку цен и наличия в каналы продаж и протестировать, что данные и брони возвращаются верно."],
      ["03", "Booking engine и прямое бронирование", "Смотреть цены, пакеты, условия и путь брони на сайте, чтобы гость видел то, что отель реально готов продавать."],
      ["04", "Отчёты, по которым можно решать", "Собрать данные из систем так, чтобы команда видела доход, загрузку, среднюю цену, будущие брони и результат каждого канала, насколько системы это позволяют."],
      ["05", "Способ работы и обучение команды", "Договориться, кто меняет цену, кто проверяет брони и кто правит данные при сбое, затем обучать на ситуациях, которые сотрудники реально встречают."],
    ],
    existingTitle: "Сначала смотреть текущие системы",
    existingBody:
      "Отелю не нужно менять PMS или channel manager каждый раз, когда есть проблема. Иногда дело в настройках, сопоставлении данных или шаге работы, который можно поправить в текущих системах.",
    existingClose: "Если у текущей системы есть ограничение, команда назовёт, какую часть работы оно бьёт, прежде чем смотреть варианты и переезд вместе с отелем.",
    stageTitle: "И для отелей до открытия, и для уже работающих",
    stages: [
      ["До открытия", "Задать типы номеров, цены, систему брони, каналы OTA, отчёты и способ работы до приёма гостей."],
      ["Уже работает", "Проверить текущие настройки, починить связи, снизить повторную работу и сделать отчёты полезнее для решений."],
      ["Переезд на другую систему", "Спланировать данные для переноса, шаги связи, тесты, обучение и период передачи работы с провайдером системы."],
    ],
    methodTitle: "Как мы работаем",
    steps: [
      ["01", "Проверить системы и реальную проблему", "Системы в работе, структура номеров и цен, каналы продаж и шаги команды."],
      ["02", "Спроектировать способ работы", "Назвать, какие данные должны жить в какой системе и кто отвечает за обновление."],
      ["03", "Настроить или поправить структуру", "Работать в рамках доступа и возможностей каждой платформы."],
      ["04", "Связать и протестировать", "Проверить цены, наличие, условия и приём броней с ключевых каналов."],
      ["05", "Обучить и передать работу", "Дать команде попробовать реальную работу и знать, как проверять или сообщать о проблеме."],
      ["06", "Проверить после запуска", "Править то, что всплыло в реальном использовании, в согласованном объёме."],
    ],
    methodNote: "Часть работ по связи должна сделать или утвердить провайдер системы. The KPI Plus помогает согласовать и проверить результат вместе с отелем.",
    platformsTitle: "Системы, с которыми команда уже работала",
    platformsBody:
      "Работа может касаться платформ, которые отель уже использует: Cloudbeds, SiteMinder, Yanolja Cloud Solution, Oracle Hospitality OPERA Cloud, NAWA и HotelierGuru, а также других систем, которые нужно смотреть отдельно по возможностям и доступу.",
    platformsNote: "Названия и логотипы используем только чтобы назвать платформы, связанные с работой. Это не означает одобрение или официальное партнёрство с владельцами платформ.",
    readyTitle: "Как мы понимаем, что система готова к работе?",
    readyBody: "Мы смотрим не только статус «подключено». Проверяем работу, которая отелю реально нужна, например:",
    ready: [
      "Номера и цены верно сопоставлены на ключевых каналах",
      "Изменение цены и наличия доходит до связанных каналов",
      "Бронь с OTA или сайта входит в систему как должна",
      "Команда знает, кто проверяет и кто чинит проблему",
      "Отчёты отвечают на вопросы о продажах и доходе, которые нужны отелю",
    ],
    readyClose: "Детали теста задаём по системам и объёму работы каждого отеля.",
    relatedTitle: "Материалы про доход, бронь и системы",
    details: "Подробнее",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "Когда системы настроены, цену, каналы и прямое бронирование всё равно нужно смотреть в общей картине дохода.",
    reservationsTitle: "Outsourced Reservation Management",
    reservationsBody: "Когда системы готовы, кто-то всё равно должен вести вопросы и брони по согласованным каналам.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "把飯店系統規劃好，並真正用起來",
    title: "系統可以串起來，但團隊和資料仍須一起運作",
    lead: "PMS、Channel Manager、Booking Engine 與 OTA 是賣房的核心。若房型、價格或空房設定不一致，團隊可能重複改同一筆資料、難以回覆客人，也無法充分利用報表做決定。",
    leadClose:
      "The KPI Plus 協助飯店選擇、設定、串接並調整系統用法。我們會看櫃檯、訂房、線上銷售與收益工作，讓技術支援飯店實際的作業方式。",
    cta: "請團隊檢查飯店系統結構",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、目前系統與問題。不必傳送密碼。",
    photoAlt: "飯店團隊在系統中檢查房型、價格與銷售通路",
    problemTitle: "飯店正在遇到這些事嗎？",
    problems: [
      "各系統的房型或 Rate Plan 對應不清楚",
      "在一個系統改了價格，卻不確定 OTA 或網站是否更新正確",
      "各通路的空房與銷售條件不一致",
      "員工重複作業，因為系統與團隊流程對不上",
      "報表很多，卻答不出銷售來自哪條通路，或該調整什麼",
      "即將開幕或換系統，還不知道該準備哪些資料、測試什麼",
    ],
    helpTitle: "The KPI Plus 能幫哪些部分？",
    help: [
      ["01", "PMS 與客房結構", "整理房型、房數、價格、政策，以及團隊需要的主資料，讓日常預訂與作業有清楚依據。"],
      ["02", "Channel Manager 與 OTA", "檢查客房與 Rate Plan 對應、價格與空房送到銷售通路的方式，並測試資料與預訂是否正確回來。"],
      ["03", "Booking Engine 與直銷預訂", "查看網站上的價格、方案、條件與預訂路徑，讓客人看到的內容與飯店能賣的一致。"],
      ["04", "能用來做決定的報表", "整理系統資料，讓團隊在系統支援的範圍內，看到收益、住房率、平均房價、未來預訂與各通路成果。"],
      ["05", "作業方式與團隊培訓", "約定誰改價格、誰檢查預訂、出問題時誰改資料，並用員工實際遇到的情況來培訓。"],
    ],
    existingTitle: "先從現有系統開始",
    existingBody: "不是每次出問題都要換 PMS 或 Channel Manager。有些情況來自設定、資料對應或作業步驟，可以在現有系統裡修正。",
    existingClose: "若現有系統有限制，團隊會先指出它影響哪一段工作，再與飯店一起考慮選項與換系統。",
    stageTitle: "開幕前的飯店，與已在營運的飯店都適用",
    stages: [
      ["開幕前", "在開始接待客人前，把房型、價格、預訂系統、OTA 通路、報表與作業方式準備好。"],
      ["已在營運", "檢查現有設定、處理串接問題、減少重複作業，並讓報表更能協助決策。"],
      ["正在換系統", "規劃要搬的資料、串接步驟、測試、培訓，以及與系統供應商交接的期間。"],
    ],
    methodTitle: "我們怎麼做？",
    steps: [
      ["01", "檢查系統與實際問題", "看正在用的系統、客房與價格結構、銷售通路，以及團隊步驟。"],
      ["02", "設計作業方式", "指出哪些資料該在哪個系統，以及誰負責更新。"],
      ["03", "設定或調整結構", "依各平台的權限與能力進行。"],
      ["04", "串接並測試", "檢查價格、空房、條件，以及主要通路的收訂。"],
      ["05", "培訓並交接", "讓團隊實際操作，並知道如何檢查或回報問題。"],
      ["06", "上線後再檢視", "依談好的範圍，修正實際使用後發現的點。"],
    ],
    methodNote: "部分串接必須由系統供應商執行或核准。The KPI Plus 會與飯店一起協調並檢查結果。",
    platformsTitle: "團隊有合作經驗的系統",
    platformsBody:
      "工作範圍可能涉及飯店現有平台，例如 Cloudbeds、SiteMinder、Yanolja Cloud Solution、Oracle Hospitality OPERA Cloud、NAWA 與 HotelierGuru，以及其他需依能力與權限個案檢查的系統。",
    platformsNote: "名稱與標誌僅用來標示與工作相關的平台，不代表平台擁有者的背書或正式合作。",
    readyTitle: "我們如何判斷系統已可使用？",
    readyBody: "我們看的不只是「已連接」狀態，而是飯店實際要用的工作，例如：",
    ready: [
      "重要通路上的客房與價格對應正確",
      "價格與空房的變更有送到相關通路",
      "來自 OTA 或網站的預訂依應有方式進入系統",
      "團隊知道誰檢查、誰處理問題",
      "報表能回答飯店需要的銷售與收益問題",
    ],
    readyClose: "測試細節會依各飯店的系統與工作範圍決定。",
    relatedTitle: "與收益、訂房和系統相關的內容",
    details: "查看詳情",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "系統設定好之後，價格、銷售通路與直銷預訂仍須放在同一張收益全貌裡看。",
    reservationsTitle: "Outsourced Reservation Management",
    reservationsBody: "系統就緒後，仍需要有人依談好的通路照顧詢問與預訂。",
  },
} as const;

export function HotelSystemsView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const revenueHref = existingHref("/solutions/revenue-commercial-management", locale);
  const reservationsHref = existingHref("/solutions/outsourced-hotel-reservations", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-systems-implementation", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/hotel-systems-implementation", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#hotel-systems-enquiry" className="kpi-button">
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
            <h2 className="kpi-h2">{t.problemTitle}</h2>
            <div className="mt-10 grid gap-4">
              {t.problems.map((item, index) => (
                <article key={item} className="kpi-card flex gap-4 p-6">
                  <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-7 text-[#555555]">{item}</p>
                </article>
              ))}
            </div>
          </div>
          <figure className="kpi-home-photo">
            <img src="/media/kpi-grow-capability_7bba9d6e.jpg" alt={t.photoAlt} width={1200} height={900} />
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
          <a href="#hotel-systems-enquiry" className="kpi-button mt-10">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.existingTitle}</h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.existingBody}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.existingClose}</p>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.stageTitle}</h2>
          <div className="kpi-grid-3 mt-10">
            {t.stages.map(([title, body]) => (
              <article key={title} className="kpi-card relative overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#555555]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-section">
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
        <p className="mt-8 max-w-3xl text-sm leading-7 text-[#555555]">{t.methodNote}</p>

        <div className="mt-12 rounded-[1.5rem] border border-[#E3E8EB] bg-[#F4F4F4] p-6 sm:p-8">
          <h3 className="text-lg font-extrabold text-[#3B3B3B]">{t.platformsTitle}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#555555]">{t.platformsBody}</p>
          <div className="kpi-tool-grid kpi-tool-grid-3 mt-6">
            {platforms.map((platform) => (
              <article key={platform.name} className="kpi-tool-card overflow-hidden">
                <div className="kpi-platform-logo">
                  {platform.src ? <img src={platform.src} alt="" /> : null}
                </div>
                <p className="kpi-latin text-base font-extrabold text-[#3B3B3B]">{platform.name}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#555555]">{t.platformsNote}</p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.readyTitle}</h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.readyBody}</p>
        <div className="mt-8 grid gap-4">
          {t.ready.map((item, index) => (
            <article key={item} className="kpi-card flex gap-4 p-6">
              <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-7 text-[#555555]">{item}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.readyClose}</p>
      </section>

      {revenueHref || reservationsHref ? (
        <section className="border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.relatedTitle}</h2>
            <div className="kpi-grid-2 mt-10">
              {revenueHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/revenue-commercial-management", locale)}</h3>
                  <p className="mt-3 text-base leading-7 text-[#555555]">{t.revenueBody}</p>
                  <Link href={revenueHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
              {reservationsHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/outsourced-hotel-reservations", locale)}</h3>
                  <p className="mt-3 text-base leading-7 text-[#555555]">{t.reservationsBody}</p>
                  <Link href={reservationsHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.details}
                  </Link>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <HotelSystemsEnquiry locale={locale} />
      <HotelSystemsStickyCta label={t.cta} />
    </SiteShell>
  );
}
