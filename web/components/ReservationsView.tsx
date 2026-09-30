import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { ReservationsEnquiry } from "@/components/ReservationsEnquiry";
import { ReservationsStickyCta } from "@/components/ReservationsStickyCta";
import { SiteShell } from "@/components/SiteShell";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const relatedInsightHrefs = ["/insights/direct-booking-journey-audit"] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "บริการทีมรับจองสำหรับโรงแรม",
    title: "ให้เราช่วยดูแลงานจอง เพื่อให้ทีมของคุณมีเวลาดูแลแขก",
    lead: "ระหว่างเช็กอิน รับโทรศัพท์ และดูแลแขกที่เข้าพัก คำถามเรื่องห้องว่างหรือราคาจากลูกค้าใหม่อาจรอตอบนานเกินไป เดอะ เคพีไอ พลัส ช่วยรับและจัดการงานสำรองห้องพักตามช่องทางและเวลาที่ตกลงกัน ตั้งแต่ตอบคำถาม เสนอห้องพัก ติดตามลูกค้า ยืนยันการจอง ไปจนถึงส่งต่อข้อมูลให้ทีมโรงแรม",
    leadClose: "โรงแรมจึงมีทีมช่วยดูแลโอกาสการขาย ขณะที่พนักงานหน้างานมีสมาธิกับประสบการณ์ของแขกมากขึ้น",
    cta: "ให้ทีมประเมินงานจองของโรงแรม",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งช่องทางที่ลูกค้าติดต่อ และช่วงเวลาที่อยากให้ทีมช่วยดูแล",
    photoAlt: "ทีมโรงแรมดูแลแขกที่เคาน์เตอร์ ขณะมีคำถามจองเข้ามาจากช่องทางอื่น",
    problemTitle: "งานจองกำลังดึงเวลาทีมหน้างานไปมากแค่ไหน?",
    problems: [
      "พนักงานต้องสลับระหว่างดูแลแขกตรงหน้าและตอบข้อความลูกค้าที่กำลังจะจอง",
      "มีคำถามเข้ามาจากหลายช่องทาง แต่ไม่มีคนติดตามต่อจนทราบผล",
      "ลูกค้าได้รับราคาและเงื่อนไขไม่ตรงกัน เพราะข้อมูลกระจายอยู่หลายที่",
      "ลูกค้าสนใจจองตรง แต่ขั้นตอนเสนอราคา ชำระเงิน และยืนยันการจองยังไม่ชัด",
      "การจองถูกยืนยันแล้ว แต่ข้อมูลสำคัญส่งต่อไปหน้าเคาน์เตอร์ไม่ครบ",
      "เจ้าของโรงแรมไม่เห็นว่ามีลูกค้าสอบถามเข้ามากี่ราย และพลาดการจองตรงที่ขั้นตอนไหน",
    ],
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยดูแลงานอะไร?",
    help: [
      ["01", "รับและตอบคำถามเรื่องการจอง", "ดูแลคำถามจากช่องทางที่ตกลงร่วมกัน เช่น LINE อีเมล ข้อความบนโซเชียล หรือโทรศัพท์ โดยใช้ข้อมูลห้องพัก ราคา และเงื่อนไขที่โรงแรมอนุมัติ"],
      ["02", "เสนอห้องพักและติดตามลูกค้า", "ตรวจห้องว่าง แจ้งตัวเลือกและเงื่อนไขให้ชัด แล้วติดตามผู้ที่ขอข้อมูลไปแต่ยังไม่ได้ตัดสินใจ ตามวิธีและช่วงเวลาที่ตกลงกับโรงแรม"],
      ["03", "จัดการขั้นตอนยืนยันการจอง", "ตรวจรายละเอียดวันเข้าพัก จำนวนผู้เข้าพัก ราคา และข้อมูลที่จำเป็น ก่อนบันทึกหรือส่งต่อการจองในระบบที่โรงแรมใช้ การรับเงินหรือยืนยันการชำระเงินจะดำเนินการตามขั้นตอนและสิทธิ์ที่โรงแรมกำหนด"],
      ["04", "ส่งต่องานให้ทีมโรงแรม", "สรุปข้อมูลการจองและคำขอพิเศษให้ทีมที่ดูแลแขกหน้างาน เพื่อให้แขกไม่ต้องเล่าเรื่องเดิมซ้ำเมื่อมาถึง"],
      ["05", "สรุปข้อมูลที่ช่วยปรับการขาย", "ดูว่าลูกค้าติดต่อมาจากช่องทางไหน ถามเรื่องอะไร ตอบกลับได้เร็วเพียงใด และมีเรื่องใดที่ทำให้ลูกค้ายังไม่จอง เพื่อนำข้อมูลไปปรับข้อเสนอ ราคา หรือขั้นตอนทำงานร่วมกัน"],
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
      ["01", "ดูงานจองที่มีอยู่", "ตรวจช่องทางติดต่อ ปริมาณคำถาม ระบบที่ใช้ และปัญหาที่ทีมเจอ"],
      ["02", "กำหนดขอบเขตการดูแล", "ตกลงช่องทาง เวลา ราคาและเงื่อนไขที่ใช้ตอบ สิทธิ์การเข้าถึงระบบ และขั้นตอนส่งต่อ"],
      ["03", "เริ่มรับงานและประสานทีม", "ดูแลคำถามและการจองตามขั้นตอนที่อนุมัติ พร้อมส่งข้อมูลให้โรงแรม"],
      ["04", "ทบทวนคุณภาพงาน", "ดูเวลาตอบ จำนวนคำถาม การติดตาม ผลการจอง และปัญหาที่ควรแก้ร่วมกัน"],
    ],
    measureTitle: "เราติดตามผลอะไร?",
    measureBody:
      "ตัวชี้วัดที่เหมาะสมอาจรวมถึงเวลาตอบกลับ จำนวนลูกค้าที่สอบถาม ช่องทางที่ติดต่อ สัดส่วนคำถามที่กลายเป็นการจอง และงานติดตามที่เสร็จตามกำหนด",
    measureClose:
      "ข้อมูลเหล่านี้ช่วยให้โรงแรมเห็นทั้งคุณภาพการตอบลูกค้าและโอกาสรายได้ โดยวิธีรายงานจะขึ้นอยู่กับช่องทางและระบบที่โรงแรมใช้อยู่",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับการจองตรง รายได้ และเว็บไซต์",
    details: "ดูรายละเอียด",
    revenueTitle: "บริหารรายได้และกลยุทธ์การขาย",
    revenueBody: "ข้อมูลจากงานจอง เช่น คำถามเรื่องราคาในช่วงที่ยังไม่จอง สามารถนำกลับไปทบทวนราคา ข้อเสนอ หรือช่องทางขาย",
    conversionTitle: "เพิ่มการจองผ่านเว็บไซต์",
    conversionBody: "เมื่อลูกค้าเริ่มจากเว็บไซต์ เส้นทางสอบถามและจองบนหน้าเว็บยังต้องชัดพอให้เดินต่อได้",
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
    relatedTitle: "Related reading on direct booking, revenue, and the website",
    details: "Read more",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "Reservation facts, such as rate questions on dates that do not convert, can go back into a review of the rate, the offer, or the channel.",
    conversionTitle: "Website Conversion",
    conversionBody: "When the guest starts on the website, the enquiry and booking path still has to be clear enough to continue.",
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
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "Факты из брони, например вопросы о цене на даты без брони, можно вернуть в разбор цены, предложения или канала.",
    conversionTitle: "Website Conversion",
    conversionBody: "Если гость начинает с сайта, путь к вопросу и брони на странице всё равно должен быть достаточно ясным.",
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
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "訂房工作裡的資料，例如某些日期常被問價卻沒預訂，可以帶回價格、方案或通路的檢視。",
    conversionTitle: "Website Conversion",
    conversionBody: "當客人從網站開始，詢問與預訂路徑仍須清楚到走得下去。",
  },
} as const;

export function ReservationsView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const insights = insightPosts
    .filter((post) => relatedInsightHrefs.includes(post.href as (typeof relatedInsightHrefs)[number]))
    .filter((post) => existingHref(post.href, locale));
  const revenueHref = localizePath("/solutions/revenue-commercial-management", locale);
  const conversionHref = localizePath("/solutions/hotel-direct-bookings", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/outsourced-hotel-reservations", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/outsourced-hotel-reservations", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#reservations-enquiry" className="kpi-button">
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
              {t.problems.map((problem, index) => (
                <article key={problem} className="kpi-card flex gap-4 p-6">
                  <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-7 text-[#555555]">{problem}</p>
                </article>
              ))}
            </div>
          </div>
          <figure className="kpi-home-photo">
            <img src="/media/kpi-grow-revenue_f786a5a5.jpg" alt={t.photoAlt} width={1200} height={900} />
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
          <a href="#reservations-enquiry" className="kpi-button mt-10">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.directTitle}</h2>
        <p className="kpi-lead mt-5">{t.directBody}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.directClose}</p>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.splitTitle}</h2>
          <div className="kpi-grid-2 mt-10">
            <article className="kpi-card relative overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.splitUs}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.splitUsBody}</p>
            </article>
            <article className="kpi-card relative overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.splitHotel}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.splitHotelBody}</p>
            </article>
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.splitClose}</p>
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
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.measureTitle}</h2>
          <p className="kpi-lead mt-5">{t.measureBody}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.measureClose}</p>
        </div>
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
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/revenue-commercial-management", locale)}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.revenueBody}</p>
              <Link href={revenueHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.details}
              </Link>
            </article>
            <article className="kpi-card relative flex flex-col overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/hotel-direct-bookings", locale)}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.conversionBody}</p>
              <Link href={conversionHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.details}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <ReservationsEnquiry locale={locale} />
      <ReservationsStickyCta label={t.cta} />
    </SiteShell>
  );
}
