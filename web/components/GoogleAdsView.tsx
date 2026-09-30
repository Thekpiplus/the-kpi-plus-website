import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { GoogleAdsEnquiry } from "@/components/GoogleAdsEnquiry";
import { GoogleAdsStickyCta } from "@/components/GoogleAdsStickyCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const relatedInsightHrefs = ["/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on"] as const;

const hotelAdsSource = "https://support.google.com/hotelprices/answer/11946932?hl=en";
const freeLinksSource = "https://support.google.com/hotelprices/answer/10472393?hl=en";

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Google Ads สำหรับโรงแรม",
    title: "เมื่อลูกค้าค้นหาที่พัก ให้เขาเจอโรงแรมของคุณและจองต่อได้ง่าย",
    lead: "นักเดินทางอาจค้นหาชื่อโรงแรม ทำเล หรือที่พักแบบที่ต้องการบน Google แต่การได้คลิกยังไม่ใช่การได้ยอดจอง เดอะ เคพีไอ พลัส ช่วยวางแผนโฆษณาควบคู่กับหน้าเว็บไซต์ ราคา ข้อเสนอ และระบบจอง เพื่อเพิ่มโอกาสให้ความสนใจกลายเป็นการจองตรงที่ตรวจสอบได้",
    cta: "ให้ทีมดูโอกาสเพิ่มการจองตรง",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม เว็บไซต์ และลิงก์หน้าจองให้ทีมดูเบื้องต้น",
    photoAlt: "นักเดินทางค้นหาที่พักบน Google ก่อนตัดสินใจจอง",
    flow: ["คำค้นหา", "โฆษณา", "หน้าเว็บ", "ระบบจอง", "การวัดผล"],
    whyTitle: "ลูกค้ากำลังเปรียบเทียบที่พักของคุณอยู่บน Google",
    whyBody:
      "ผู้เดินทางค้นหาทั้งชื่อโรงแรม ที่พักในทำเลที่ต้องการ และข้อมูลราคา ก่อนตัดสินใจว่าจะจองผ่านช่องทางใด หากเว็บไซต์โรงแรมปรากฏในจังหวะที่เหมาะสม พร้อมข้อมูลและเส้นทางจองที่ชัดเจน ก็มีโอกาสพาลูกค้าเข้าสู่ช่องทางจองตรงของโรงแรม",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google ระบุว่าโรงแรมสามารถแสดงชื่อ ราคา และจุดเด่นของการจองผ่านเว็บไซต์ตนเองใน Hotel Ads เพื่อพาผู้เดินทางเข้าสู่เว็บไซต์และเพิ่มโอกาสการจองตรง",
    hotelAdsSource: "ที่มา: Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "Google ยังมีลิงก์จองแบบไม่เสียค่าโฆษณา ซึ่งสามารถพาลูกค้าไปยังหน้าจองของโรงแรมได้ หากข้อมูลราคา ห้องว่าง และการเชื่อมต่อพร้อม",
    freeSource: "ที่มา: Google Hotel Center Help",
    whyNote:
      "Search Ads, Hotel Ads และ free booking links มีรูปแบบและเงื่อนไขต่างกัน ทีมจะตรวจความพร้อมของโรงแรมก่อนแนะนำว่าควรใช้ช่องทางใด",
    problemTitle: "มีคนค้นหาโรงแรม แต่ยอดจองตรงไปไม่ถึงเป้าหมาย?",
    problems: [
      "ค้นหาชื่อโรงแรมแล้วพบตัวเลือกจองหลายช่องทาง แต่เว็บไซต์ของโรงแรมยังไม่เด่น",
      "จ่ายค่าโฆษณาแล้วได้คลิก แต่ไม่รู้ว่ามีการสอบถามหรือจองจริงเท่าไร",
      "โฆษณาพาลูกค้าไปหน้าแรก ทั้งที่ลูกค้ากำลังหาห้องพักหรือข้อเสนอเฉพาะ",
      "ราคา ห้องว่าง หรือเงื่อนไขในหน้าจองไม่ชัดเจน",
      "แคมเปญคำค้นชื่อโรงแรมกับคำค้นหาที่พักในพื้นที่ถูกรวมกัน จึงดูผลแยกได้ยาก",
    ],
    problemClose: "ปัญหาอาจไม่ได้อยู่ที่งบโฆษณาเพียงอย่างเดียว ทีมจะช่วยดูทั้งโฆษณาและเส้นทางการจองก่อนเสนอว่าควรปรับตรงไหน",
    problemCta: "ให้ทีมดูเส้นทางการจองของโรงแรม",
    helpTitle: "จากคำค้นหา ไปสู่การจองตรงที่วัดผลได้",
    help: [
      ["01", "เลือกคำค้นและเป้าหมายให้เหมาะกับโรงแรม", "แยกการค้นหาชื่อโรงแรมออกจากการค้นหาที่พักตามทำเล ประเภทห้อง หรือความต้องการ เพื่อดูว่าคำค้นกลุ่มไหนควรได้รับงบและข้อความแบบใด"],
      ["02", "จับคู่โฆษณากับราคาและข้อเสนอจริง", "โฆษณาควรบอกสิ่งที่ลูกค้าจะพบเมื่อคลิก และสอดคล้องกับห้องว่าง ราคา และเงื่อนไขที่โรงแรมพร้อมขาย"],
      ["03", "ปรับเส้นทางเข้าสู่เว็บไซต์และระบบจอง", "ตรวจว่าลูกค้าเห็นข้อมูลห้องพัก กดดูราคา เลือกวันเข้าพัก และดำเนินการจองได้สะดวก โดยเฉพาะบนมือถือ"],
      ["04", "ติดตามผลที่เกี่ยวกับธุรกิจ", "ดูคำค้น การเข้าชมหน้าเว็บ การเข้าสู่ระบบจอง การสอบถาม และยอดจองที่ติดตามได้ พร้อมพิจารณาต้นทุนโฆษณาเทียบกับคุณค่าของการจอง"],
    ],
    channelTitle: "โรงแรมของคุณควรเริ่มจากช่องทางไหน?",
    channels: [
      ["Search Ads", "โฆษณาข้อความที่ตอบคำค้น เช่น ชื่อโรงแรมหรือที่พักในทำเลหนึ่ง เหมาะสำหรับพาคนไปยังหน้าเว็บไซต์ที่ตรงกับความต้องการ"],
      ["Hotel Ads", "แสดงข้อมูลโรงแรมและราคาห้องพักในพื้นที่การค้นหาโรงแรมของ Google ต้องตรวจการเชื่อมต่อราคาและห้องว่าง"],
      ["Free booking links", "ลิงก์จองที่ไม่คิดค่าโฆษณา การแสดงผลขึ้นอยู่กับข้อมูลและการเชื่อมต่อที่ถูกต้อง รวมถึงเกณฑ์ของ Google"],
    ],
    channelClose: "ไม่จำเป็นต้องเริ่มทุกช่องทางพร้อมกัน ทีมจะดูระบบจอง งบประมาณ ตลาด และเป้าหมายรายได้ก่อนเสนอแนวทาง",
    methodTitle: "ดูทั้งโฆษณาและการจอง ไม่ดูแค่จำนวนคลิก",
    steps: [
      ["01", "ตรวจสถานการณ์", "ดูเว็บไซต์ ระบบจอง Google Ads ที่ใช้อยู่ ตลาดเป้าหมาย และช่วงที่โรงแรมต้องการเพิ่มยอดขาย"],
      ["02", "ตรวจเส้นทางลูกค้า", "จากคำค้นและโฆษณา ไปถึงหน้าเว็บ ราคา ห้องว่าง และหน้าชำระเงินหรือยืนยันการจอง"],
      ["03", "วางแผนแคมเปญ", "กำหนดคำค้น ข้อความโฆษณา หน้าเว็บปลายทาง งบประมาณ และสิ่งที่จะวัด"],
      ["04", "ทบทวนผล", "ดูข้อมูลที่ตรวจสอบได้ แล้วปรับคำค้น งบ และข้อเสนอร่วมกับสถานการณ์ยอดขายของโรงแรม"],
    ],
    measureTitle: "ตัวเลขที่สำคัญกว่าคลิก คือสิ่งที่ลูกค้าทำต่อ",
    measureBody:
      "เราดูว่าคำค้นใดพาลูกค้ามาถึงหน้าเว็บ ลูกค้าเข้าสู่หน้าห้องพักหรือระบบจองหรือไม่ มีการสอบถามหรือจองจริงเท่าไร และต้นทุนของผลลัพธ์นั้นเหมาะกับรายได้ที่โรงแรมได้รับหรือไม่",
    measureNote:
      "ความสามารถในการวัดยอดจองและรายได้ขึ้นอยู่กับเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลของโรงแรม ทีมจะตรวจสิ่งที่วัดได้จริงก่อนกำหนดรายงาน",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับการค้นหา เว็บไซต์ และการจองตรง",
    details: "ดูรายละเอียด",
    toolName: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
    toolBody: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าจากโฆษณาหาข้อมูลห้องพักและเดินทางไปจองต่อหรือไม่",
    toolCta: "ใช้เครื่องมือฟรี",
    conversionTitle: "เพิ่มการจองผ่านเว็บไซต์",
    conversionBody: "เมื่อโฆษณาพาคนมาแล้ว เส้นทางจากหน้าเว็บสู่ระบบจองต้องชัดพอให้เดินต่อได้",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Google Ads for hotels",
    title: "When guests search for a stay, help them find your hotel and book without extra friction",
    lead: "A traveller may search the hotel name, the area, or the type of stay on Google. A click is not a booking. The KPI Plus plans the ads together with the website, the rate, the offer, and the booking path, so interest has a better chance of becoming a direct booking you can check.",
    cta: "Ask the team to review a direct-booking opportunity",
    secondary: "All solutions",
    underCta: "Send the hotel name, website, and booking-page link for a first look.",
    photoAlt: "A traveller comparing hotel options on Google before booking",
    flow: ["Search", "Ad", "Website", "Booking path", "Review"],
    whyTitle: "Guests are already comparing your hotel on Google",
    whyBody:
      "Travellers search the hotel name, stays in the area they want, and rate information before they choose a booking channel. If the hotel website appears at the right moment, with clear details and a clear booking path, there is a chance to bring the guest onto the hotel’s own booking route.",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google says hotels can show the name, rate, and reasons to book on the hotel website in Hotel Ads, to send travellers to that website and support a direct booking.",
    hotelAdsSource: "Source: Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "Google also has booking links that do not charge an advertising fee. They can send a guest to the hotel booking page when rates, availability, and the connection are ready.",
    freeSource: "Source: Google Hotel Center Help",
    whyNote:
      "Search Ads, Hotel Ads, and free booking links have different formats and conditions. The team checks the hotel’s readiness before recommending which path to use.",
    problemTitle: "People are searching the hotel, but direct bookings are not reaching the goal?",
    problems: [
      "A search for the hotel name shows several booking options, and the hotel website is not the clear one",
      "The ads get clicks, but it is unclear how many enquiries or bookings follow",
      "The ad sends guests to the homepage while they are looking for a room or a specific offer",
      "The rate, availability, or booking conditions are unclear on the booking page",
      "Hotel-name searches and area searches sit in the same campaign, so results are hard to review separately",
    ],
    problemClose: "The issue may not sit in the ad budget alone. The team looks at the ads and the booking path before saying what to change.",
    problemCta: "Ask the team to review the hotel’s booking path",
    helpTitle: "From the search to a direct booking you can review",
    help: [
      ["01", "Match the searches and the goal to the hotel", "Separate hotel-name searches from searches for a stay by location, room type, or need, then decide which group should get which budget and message."],
      ["02", "Pair the ad with the real rate and offer", "The ad should describe what the guest will see after the click, and match the rooms, rates, and conditions the hotel can actually sell."],
      ["03", "Improve the path into the website and booking system", "Check that the guest can see the room, open the rate, choose dates, and complete the booking, especially on a phone."],
      ["04", "Review the numbers that matter to the business", "Look at the searches, page visits, booking-engine entries, enquiries, and bookings you can track, then weigh ad cost against the value of those bookings."],
    ],
    channelTitle: "Which path should this hotel start with?",
    channels: [
      ["Search Ads", "Text ads that answer a search, such as the hotel name or a stay in one area. Useful for sending people to a page that matches what they asked for."],
      ["Hotel Ads", "Hotel and room-rate information in Google’s hotel-search surfaces. The rate and availability connection has to be checked first."],
      ["Free booking links", "Booking links that do not charge an advertising fee. Visibility depends on correct data, a working connection, and Google’s own criteria."],
    ],
    channelClose: "The hotel does not have to start every path at once. The team looks at the booking system, budget, market, and revenue goal first.",
    methodTitle: "Review the ads and the booking, not clicks alone",
    steps: [
      ["01", "Check the situation", "Look at the website, booking system, current Google Ads, the target market, and the dates the hotel wants to sell."],
      ["02", "Check the guest path", "From the search and the ad through to the page, the rate, availability, and the payment or confirmation step."],
      ["03", "Plan the campaign", "Agree the searches, ad copy, destination pages, budget, and what will be measured."],
      ["04", "Review the result", "Use data that can be checked, then adjust searches, budget, and the offer with the hotel’s sales situation."],
    ],
    measureTitle: "What the guest does next matters more than the click",
    measureBody:
      "We look at which searches bring guests to the site, whether they reach a room page or the booking system, how many enquire or book, and whether the cost of that result fits the revenue the hotel receives.",
    measureNote:
      "How far bookings and revenue can be measured depends on the website, booking system, and tracking the hotel already has. The team checks what can actually be measured before agreeing the report.",
    relatedTitle: "Related reading on search, the website, and direct booking",
    details: "Read more",
    toolName: "Hotel Searchability Check",
    toolBody: "See whether the page is ready for a guest from an ad to find the room and continue to a booking.",
    toolCta: "Use the free tool",
    conversionTitle: "Website Conversion",
    conversionBody: "After the ad, the path from the website into the booking system still has to be clear enough to continue.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Google Ads для отелей",
    title: "Когда гость ищет жильё, пусть он найдёт ваш отель и сможет спокойно забронировать",
    lead: "Путешественник может искать название отеля, район или нужный тип проживания в Google. Клик ещё не бронь. The KPI Plus планирует рекламу вместе с сайтом, ценой, предложением и путём бронирования, чтобы интерес чаще становился прямой бронью, которую можно проверить.",
    cta: "Попросить команду оценить шанс прямого бронирования",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, сайт и ссылку на страницу бронирования для первого просмотра.",
    photoAlt: "Путешественник сравнивает варианты проживания в Google перед бронированием",
    flow: ["Поиск", "Реклама", "Сайт", "Бронь", "Разбор"],
    whyTitle: "Гости уже сравнивают ваш отель в Google",
    whyBody:
      "Путешественники ищут название отеля, жильё в нужном районе и цены, прежде чем выбрать канал бронирования. Если сайт отеля появляется в нужный момент с понятными данными и понятным путём брони, есть шанс привести гостя на собственный канал отеля.",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google указывает, что отель может показывать название, цену и причины бронировать на своём сайте в Hotel Ads, чтобы направить путешественника на сайт и поддержать прямое бронирование.",
    hotelAdsSource: "Источник: Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "У Google также есть ссылки бронирования без платы за рекламу. Они могут привести гостя на страницу брони отеля, если цена, наличие номеров и подключение готовы.",
    freeSource: "Источник: Google Hotel Center Help",
    whyNote:
      "Search Ads, Hotel Ads и free booking links имеют разные форматы и условия. Команда сначала проверяет готовность отеля, затем рекомендует, какой путь использовать.",
    problemTitle: "Отель ищут, но прямые брони не доходят до цели?",
    problems: [
      "Поиск названия отеля показывает несколько вариантов брони, а сайт отеля не выглядит главным",
      "Реклама даёт клики, но неясно, сколько потом вопросов или броней",
      "Реклама ведёт на главную, хотя гость ищет номер или конкретное предложение",
      "Цена, наличие номеров или условия на странице брони неясны",
      "Поиск названия отеля и поиск жилья в районе собраны в одну кампанию, поэтому результат трудно разобрать отдельно",
    ],
    problemClose: "Дело может быть не только в бюджете. Команда смотрит и рекламу, и путь бронирования, прежде чем сказать, что менять.",
    problemCta: "Попросить команду посмотреть путь бронирования отеля",
    helpTitle: "От поискового запроса к прямой брони, которую можно разобрать",
    help: [
      ["01", "Подобрать запросы и цель под отель", "Отделить поиск названия отеля от поиска жилья по району, типу номера или потребности и решить, какой группе какой бюджет и текст нужны."],
      ["02", "Связать рекламу с реальной ценой и предложением", "Реклама должна говорить то, что гость увидит после клика, и совпадать с номерами, ценой и условиями, которые отель готов продавать."],
      ["03", "Настроить путь на сайт и в систему бронирования", "Проверить, видит ли гость номер, цену, может выбрать даты и завершить бронь, особенно с телефона."],
      ["04", "Смотреть показатели, важные бизнесу", "Смотреть запросы, визиты, вход в систему брони, вопросы и брони, которые можно отследить, затем сопоставить стоимость рекламы с ценностью этих броней."],
    ],
    channelTitle: "С какого канала начать этому отелю?",
    channels: [
      ["Search Ads", "Текстовая реклама, которая отвечает на запрос: название отеля или жильё в районе. Подходит, чтобы вести человека на страницу, совпадающую с запросом."],
      ["Hotel Ads", "Данные об отеле и цене номера в гостиничном поиске Google. Сначала нужно проверить подключение цены и наличия номеров."],
      ["Free booking links", "Ссылки бронирования без платы за рекламу. Показ зависит от корректных данных, рабочего подключения и критериев Google."],
    ],
    channelClose: "Не обязательно запускать все каналы сразу. Команда сначала смотрит систему брони, бюджет, рынок и цель по доходу.",
    methodTitle: "Смотреть рекламу и бронь, а не только клики",
    steps: [
      ["01", "Проверить ситуацию", "Сайт, систему брони, текущие Google Ads, целевой рынок и даты, которые отелю нужно продавать."],
      ["02", "Проверить путь гостя", "От запроса и рекламы до страницы, цены, наличия номеров и шага оплаты или подтверждения."],
      ["03", "Спланировать кампанию", "Согласовать запросы, тексты, страницы назначения, бюджет и то, что будем измерять."],
      ["04", "Разобрать результат", "Использовать проверяемые данные, затем скорректировать запросы, бюджет и предложение вместе с продажами отеля."],
    ],
    measureTitle: "Важнее клика то, что гость делает дальше",
    measureBody:
      "Мы смотрим, какие запросы приводят на сайт, доходит ли гость до страницы номера или системы брони, сколько спрашивает или бронирует, и подходит ли стоимость этого результата доходу отеля.",
    measureNote:
      "Насколько можно измерить брони и доход, зависит от сайта, системы брони и уже настроенного отслеживания. Команда сначала проверяет, что реально измеримо, затем согласовывает отчёт.",
    relatedTitle: "Материалы про поиск, сайт и прямое бронирование",
    details: "Подробнее",
    toolName: "Проверка поисковой готовности сайта отеля",
    toolBody: "Понять, сможет ли гость из рекламы найти номер и перейти к бронированию.",
    toolCta: "Использовать бесплатный инструмент",
    conversionTitle: "Website Conversion",
    conversionBody: "После рекламы путь с сайта в систему бронирования всё равно должен быть достаточно понятным.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "飯店的 Google Ads",
    title: "當客人在搜尋住宿時，讓他找到你的飯店，並能順利預訂",
    lead: "旅客可能在 Google 搜尋飯店名稱、地點，或想要的住宿類型。有點擊還不是有預訂。The KPI Plus 會把廣告，連同網站、價格、方案與預訂系統一起規劃，讓興趣比較有機會變成可核對的直銷預訂。",
    cta: "請團隊看增加直銷預訂的機會",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、網站與預訂頁連結，讓團隊先看一輪。",
    photoAlt: "旅客在 Google 上比較住宿後再決定預訂",
    flow: ["搜尋", "廣告", "網站", "預訂系統", "檢視結果"],
    whyTitle: "客人已經在 Google 上比較你的飯店",
    whyBody:
      "旅客會先搜尋飯店名稱、想去的地點，以及價格資訊，再決定從哪個通路預訂。若飯店網站在對的時間出現，資料與預訂路徑又清楚，就比較有機會把客人帶進飯店自己的預訂通路。",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google 指出，飯店可在 Hotel Ads 顯示名稱、價格，以及透過自家網站預訂的重點，把旅客帶到網站，並增加直銷預訂的機會。",
    hotelAdsSource: "來源：Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "Google 也有不收取廣告費的預訂連結。只要價格、空房與系統連接準備好，就能把客人帶到飯店的預訂頁。",
    freeSource: "來源：Google Hotel Center Help",
    whyNote:
      "Search Ads、Hotel Ads 與 free booking links 的形式與條件不同。團隊會先檢查飯店準備程度，再建議該走哪一條。",
    problemTitle: "有人在搜尋飯店，直銷預訂卻還沒到目標？",
    problems: [
      "搜尋飯店名稱後出現多個預訂選項，飯店自己的網站還不夠突出",
      "付了廣告費也有點擊，卻不清楚之後有多少詢問或實際預訂",
      "廣告把客人帶到首頁，但其實對方在找特定房型或方案",
      "預訂頁上的價格、空房或條件不夠清楚",
      "飯店名稱搜尋與地區住宿搜尋被放在同一組活動，結果很難分開看",
    ],
    problemClose: "問題不一定只在廣告預算。團隊會先看廣告與預訂路徑，再說明該調整哪一段。",
    problemCta: "請團隊先看飯店的預訂路徑",
    helpTitle: "從搜尋走到可檢視的直銷預訂",
    help: [
      ["01", "依飯店選對搜尋詞與目標", "把飯店名稱搜尋，和依地點、房型或需求找住宿的搜尋分開，再決定哪一組該用什麼預算與文案。"],
      ["02", "讓廣告對上真實價格與方案", "廣告應說明點擊後會看到什麼，並與飯店實際可賣的空房、價格與條件一致。"],
      ["03", "調整進入網站與預訂系統的路徑", "檢查客人能否看到房型、打開價格、選擇入住日期並完成預訂，尤其是在手機上。"],
      ["04", "追蹤與生意有關的結果", "看搜尋詞、網頁瀏覽、進入預訂系統、詢問，以及能追蹤的預訂，再把廣告成本對上這些預訂的價值。"],
    ],
    channelTitle: "這間飯店該先從哪一條開始？",
    channels: [
      ["Search Ads", "回應搜尋的文字廣告，例如飯店名稱或某一地區的住宿。適合把人帶到與需求相符的網頁。"],
      ["Hotel Ads", "在 Google 的飯店搜尋畫面顯示飯店與房價。必須先檢查價格與空房的連接。"],
      ["Free booking links", "不收取廣告費的預訂連結。能不能出現，取決於資料是否正確、連接是否可用，以及 Google 的條件。"],
    ],
    channelClose: "不必一次啟動所有通路。團隊會先看預訂系統、預算、市場與收益目標，再提出做法。",
    methodTitle: "看廣告，也看預訂，不只看點擊數",
    steps: [
      ["01", "先看現況", "檢查網站、預訂系統、目前的 Google Ads、目標市場，以及飯店想加強銷售的時段。"],
      ["02", "檢查客人路徑", "從搜尋與廣告，走到網頁、價格、空房，以及付款或確認預訂的頁面。"],
      ["03", "規劃活動", "確認搜尋詞、廣告文案、落地頁、預算，以及要衡量的項目。"],
      ["04", "檢視結果", "用可核對的資料，再依飯店的銷售情況調整搜尋詞、預算與方案。"],
    ],
    measureTitle: "比點擊更重要的，是客人接下來做了什麼",
    measureBody:
      "我們會看哪些搜尋把客人帶到網站、是否進入房型頁或預訂系統、實際詢問或預訂有多少，以及這個結果的成本是否適合飯店拿到的收益。",
    measureNote:
      "預訂與收益能量到什麼程度，取決於網站、預訂系統與飯店既有的追蹤設定。團隊會先確認實際能量到什麼，再一起決定報告方式。",
    relatedTitle: "與搜尋、網站與直銷預訂相關的內容",
    details: "查看詳情",
    toolName: "飯店網站搜尋健康檢查",
    toolBody: "看從廣告進來的客人，是否找得到房型並能繼續預訂。",
    toolCta: "使用免費工具",
    conversionTitle: "Website Conversion",
    conversionBody: "廣告把人帶來之後，從網站走進預訂系統的路徑仍須清楚到走得下去。",
  },
} as const;

export function GoogleAdsView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const insights = insightPosts
    .filter((post) => relatedInsightHrefs.includes(post.href as (typeof relatedInsightHrefs)[number]))
    .filter((post) => existingHref(post.href, locale));
  const conversionHref = localizePath("/solutions/hotel-direct-bookings", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/google-ads-management", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/google-ads-management", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <div className="kpi-actions">
          <a href="#google-ads-enquiry" className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href={solutions} className="kpi-button-ghost">
            {t.secondary}
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/64">{t.underCta}</p>
        <div className="kpi-platform-row mt-8">
          {t.flow.map((step, index) => (
            <span key={step} className="kpi-platform">
              <span className="kpi-latin ml-2 text-xs font-black tracking-[.14em] text-[#0B6660]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {step}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="kpi-section">
        <div className="kpi-split">
          <div>
            <h2 className="kpi-h2">{t.whyTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555555]">{t.whyBody}</p>
            <div className="kpi-grid-2 mt-8">
              <article className="kpi-card p-6">
                <img src="/brand/google/google.svg" alt="" className="kpi-platform-mark" />
                <h3 className="mt-4 text-lg font-extrabold text-[#3B3B3B]">{t.hotelAdsTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-[#555555]">{t.hotelAdsBody}</p>
                <p className="mt-4 text-sm">
                  <a href={hotelAdsSource} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                    {t.hotelAdsSource}
                  </a>
                </p>
              </article>
              <article className="kpi-card p-6">
                <img src="/brand/google/google.svg" alt="" className="kpi-platform-mark" />
                <h3 className="mt-4 text-lg font-extrabold text-[#3B3B3B]">{t.freeTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-[#555555]">{t.freeBody}</p>
                <p className="mt-4 text-sm">
                  <a href={freeLinksSource} target="_blank" rel="noreferrer" className="font-semibold text-[#0B6660]">
                    {t.freeSource}
                  </a>
                </p>
              </article>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#555555]">{t.whyNote}</p>
          </div>
          <figure className="kpi-home-photo">
            <img src="/media/kpi-grow-demand_24299cd0.jpg" alt={t.photoAlt} width={1200} height={900} />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.problemTitle}</h2>
          <div className="kpi-grid-2 mt-10">
            {t.problems.map((problem, index) => (
              <article key={problem} className="kpi-card flex gap-4 p-6">
                <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-7 text-[#555555]">{problem}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-base leading-8 text-[#3B3B3B]">{t.problemClose}</p>
          <a href="#google-ads-enquiry" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B6660]">
            {t.problemCta} <ArrowUpRight className="h-4 w-4" />
          </a>
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
        <a href="#google-ads-enquiry" className="kpi-button mt-10">
          {t.cta} <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.channelTitle}</h2>
          <div className="kpi-grid-3 mt-10">
            {t.channels.map(([title, body]) => (
              <article key={title} className="kpi-card relative overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <img src="/brand/google/google.svg" alt="" className="kpi-platform-mark" />
                <h3 className="mt-5 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#555555]">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-base leading-8 text-[#3B3B3B]">{t.channelClose}</p>
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

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-lead mt-5">{t.measureBody}</p>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#555555]">{t.measureNote}</p>
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
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/hotel-direct-bookings", locale)}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.conversionBody}</p>
              <Link href={conversionHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.details}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <GoogleAdsEnquiry locale={locale} />
      <GoogleAdsStickyCta label={t.cta} />
    </SiteShell>
  );
}
