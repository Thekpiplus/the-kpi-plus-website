import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { AdsChannelDecisions } from "@/components/google-ads/AdsChannelDecisions";
import { AdsChannelMatrix } from "@/components/google-ads/AdsChannelMatrix";
import { AdsChannelVisual } from "@/components/google-ads/AdsChannelVisual";
import { AdsFrameworkMatrix } from "@/components/google-ads/AdsFrameworkMatrix";
import { AdsFrameworkVisual } from "@/components/google-ads/AdsFrameworkVisual";
import { AdsHeroVisual } from "@/components/google-ads/AdsHeroVisual";
import { AdsKpiCards } from "@/components/google-ads/AdsKpiCards";
import { AdsKpiChart } from "@/components/google-ads/AdsKpiChart";
import { AdsKpiVisual } from "@/components/google-ads/AdsKpiVisual";
import { AdsRelatedVisual } from "@/components/google-ads/AdsRelatedVisual";
import { AdsVisibilityVisual } from "@/components/google-ads/AdsVisibilityVisual";
import { AdsWorkflowSteps } from "@/components/google-ads/AdsWorkflowSteps";
import { AdsWorkflowVisual } from "@/components/google-ads/AdsWorkflowVisual";
import { GoogleAdsEnquiry } from "@/components/GoogleAdsEnquiry";
import { GoogleAdsStickyCta } from "@/components/GoogleAdsStickyCta";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import { relatedCardDateLabel, relatedCardTypeLabel, type CmsAdsRelatedCard, type CmsGoogleAdsPage } from "@/lib/cms/google-ads-page";
import { adsHeroVisualUrl, adsPublicTeamPhoto, adsRelatedVisualUrl, adsVisibilityVisualUrl, resolveGoogleAdsPage } from "@/lib/cms/google-ads-page-public";
import { ADS_CHANNEL_ROWS, ADS_CHANNEL_VISUAL, ADS_CHANNEL_VISUAL_CANDIDATE, ADS_FRAMEWORK_ROWS, ADS_FRAMEWORK_VISUAL_CANDIDATE, ADS_HERO_VISUAL, ADS_HERO_VISUAL_CANDIDATE, ADS_KPI_VISUAL, ADS_KPI_VISUAL_CANDIDATE, ADS_LANDING_CHECKLIST, ADS_READINESS_VISUAL, ADS_RELATED_VISUAL, ADS_RELATED_VISUAL_CANDIDATE, ADS_TRACKING_BOUNDARY, ADS_VISIBILITY_PATH, ADS_VISIBILITY_VISUAL, ADS_VISIBILITY_VISUAL_CANDIDATE, ADS_WORKFLOW_STEPS, ADS_WORKFLOW_VISUAL, ADS_WORKFLOW_VISUAL_CANDIDATE, adsFaqs, adsKpiSeriesReady } from "@/lib/google-ads";
import { solutionNavLabel } from "@/lib/nav";
import { localizePath, type Locale } from "@/lib/seo";
import "@/components/google-ads/google-ads-visuals.css";

const hotelAdsSource = "https://support.google.com/hotelprices/answer/11946932?hl=en";
const freeLinksSource = "https://support.google.com/hotelprices/answer/10472393?hl=en";

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Google Ads สำหรับโรงแรม",
    title: "เมื่อลูกค้าค้นหาที่พัก ให้เขาเจอโรงแรมของคุณและจองต่อได้ง่าย",
    lead: "คำค้นชื่อโรงแรมหรือที่พักในพื้นที่ต้องโยงกับโครงสร้างแคมเปญ โฆษณาต้องพาไปหน้าโรงแรมที่เกี่ยวข้อง และเส้นทางจองต้องวัดผลได้ เดอะ เคพีไอ พลัส ช่วยทบทวนและปรับกระบวนการนี้ เมื่อโรงแรมอนุมัติให้ใช้บริการ",
    cta: "ให้ทีมดูโอกาสเพิ่มการจองตรง",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม เว็บไซต์ และลิงก์หน้าจองให้ทีมดูเบื้องต้น",
    photoAlt: "นักเดินทางค้นหาที่พักบน Google ก่อนตัดสินใจจอง",
    flow: ["คำค้นหา", "โครงสร้างแคมเปญ", "หน้าโรงแรม", "เส้นทางจอง", "วัดผล"],
    whyTitle: "ลูกค้ากำลังเปรียบเทียบที่พักของคุณอยู่บน Google",
    whyBody:
      "เมื่อลูกค้าค้นหาที่พัก โรงแรมอาจปรากฏจาก Search Ads, Hotel Ads, Free Booking Links หรือผลการค้นหาทั่วไป แต่ละช่องทางควรพาไปหน้าโรงแรมที่เกี่ยวข้อง แล้วเข้าสู่ระบบจองได้ ทีมไม่สัญญาอันดับแรก ยอดจอง หรือ ROAS",
    searchAdsTitle: "Search Ads",
    searchAdsBody:
      "โฆษณาข้อความที่ตอบคำค้นชื่อโรงแรมหรือที่พักในพื้นที่ ควรพาไปหน้าห้องพักหรือข้อเสนอที่เกี่ยวข้อง ไม่ใช่แค่หน้าแรก",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google ระบุว่าโรงแรมสามารถแสดงชื่อ ราคา และจุดเด่นของการจองผ่านเว็บไซต์ตนเองใน Hotel Ads เพื่อพาผู้เดินทางเข้าสู่เว็บไซต์โรงแรม",
    hotelAdsSource: "ที่มา: Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "Google ยังมีลิงก์จองแบบไม่เสียค่าโฆษณา ซึ่งสามารถพาลูกค้าไปยังหน้าจองของโรงแรมได้ หากข้อมูลราคา ห้องว่าง และการเชื่อมต่อพร้อม",
    freeSource: "ที่มา: Google Hotel Center Help",
    organicNote:
      "ผลการค้นหาทั่วไปอาจพาลูกค้าไปหน้าโรงแรมเดียวกันได้ หากหน้าเว็บพร้อม แต่ไม่ได้หมายถึงการติดอันดับหนึ่ง",
    whyNote:
      "Search Ads, Hotel Ads, Free Booking Links และการค้นหาทั่วไปมีรูปแบบต่างกัน หลังคลิก หน้าโรงแรมและเส้นทางจองต้องเดินต่อได้ ทีมไม่สัญญาอันดับแรก ยอดจอง หรือ ROAS",
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
    channelLead:
      "เปรียบเทียบ Search Ads, Hotel Ads และ Free Booking Links จากกรณีที่ใช้ สิ่งที่ควบคุมได้ สิ่งที่ต้องมี ผลที่คาดหวัง และตัวชี้วัด ไม่จำเป็นต้องเริ่มทุกช่องทางพร้อมกัน",
    channels: [
      ["Search Ads", "โฆษณาข้อความที่ตอบคำค้น เช่น ชื่อโรงแรมหรือที่พักในทำเลหนึ่ง เหมาะสำหรับพาคนไปยังหน้าเว็บไซต์ที่ตรงกับความต้องการ"],
      ["Hotel Ads", "แสดงข้อมูลโรงแรมและราคาห้องพักในพื้นที่การค้นหาโรงแรมของ Google ต้องตรวจการเชื่อมต่อราคาและห้องว่าง"],
      ["Free booking links", "ลิงก์จองที่ไม่คิดค่าโฆษณา การแสดงผลขึ้นอยู่กับข้อมูลและการเชื่อมต่อที่ถูกต้อง รวมถึงเกณฑ์ของ Google"],
    ],
    channelClose: "ช่องทางที่เหมาะขึ้นอยู่กับระบบจอง เว็บไซต์ งบประมาณ ตลาด และเป้าหมายรายได้ของโรงแรม",
    methodTitle: "ดูทั้งโฆษณาและการจอง ไม่ดูแค่จำนวนคลิก",
    methodLead:
      "งานแคมเปญเดินห้าขั้น จาก Audit ไป Structure, Launch, Optimize และ Report แต่ละขั้นมีผู้รับผิดชอบ สิ่งที่รับ สิ่งที่ทำ สิ่งที่ได้ และการตัดสินใจขั้นถัดไป",
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
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Google Ads for hotels",
    title: "When guests search for a stay, help them find your hotel and book without extra friction",
    lead: "Hotel-name searches and area-stay searches need a campaign structure that matches intent. The ad should open a relevant hotel page, and the booking path has to be measurable. The KPI Plus reviews and improves this process where the service is approved.",
    cta: "Ask the team to review a direct-booking opportunity",
    secondary: "All solutions",
    underCta: "Send the hotel name, website, and booking-page link for a first look.",
    photoAlt: "A traveller comparing hotel options on Google before booking",
    flow: ["Search intent", "Campaign", "Hotel page", "Booking path", "Review"],
    whyTitle: "Guests are already comparing your hotel on Google",
    whyBody:
      "When a guest searches for a stay, the hotel may appear through Search Ads, Hotel Ads, free booking links, or organic results. Each of those should open a relevant hotel page, then a booking engine. The team does not promise top ranking, guaranteed bookings, or a set ROAS.",
    searchAdsTitle: "Search Ads",
    searchAdsBody:
      "Text ads that answer a hotel-name or area-stay search. They should open a room or offer page that matches the query, not only the homepage.",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google says hotels can show the name, rate, and reasons to book on the hotel website in Hotel Ads, to send travellers to that website.",
    hotelAdsSource: "Source: Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "Google also has booking links that do not charge an advertising fee. They can send a guest to the hotel booking page when rates, availability, and the connection are ready.",
    freeSource: "Source: Google Hotel Center Help",
    organicNote:
      "Organic results can also send a guest to the same hotel page when the site is ready. That is not a claim of first place in search.",
    whyNote:
      "Search Ads, Hotel Ads, free booking links, and organic results have different formats and conditions. After the click, the hotel page and booking path still have to work. The team does not promise top ranking, bookings, or ROAS.",
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
    channelLead:
      "Compare Search Ads, Hotel Ads, and Free Booking Links by use case, what can be controlled, required input, expected output, and KPIs. The hotel does not have to start every path at once.",
    channels: [
      ["Search Ads", "Text ads that answer a search, such as the hotel name or a stay in one area. Useful for sending people to a page that matches what they asked for."],
      ["Hotel Ads", "Hotel and room-rate information in Google’s hotel-search surfaces. The rate and availability connection has to be checked first."],
      ["Free booking links", "Booking links that do not charge an advertising fee. Visibility depends on correct data, a working connection, and Google’s own criteria."],
    ],
    channelClose: "The right channel depends on the booking system, website, budget, market, and revenue goal.",
    methodTitle: "Review the ads and the booking, not clicks alone",
    methodLead:
      "Campaign work runs in five steps: Audit, Structure, Launch, Optimize, and Report. Each step has an owner, input, action, output, and a next decision.",
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
    searchAdsTitle: "Search Ads",
    searchAdsBody:
      "Текстовая реклама, которая отвечает на запрос: название отеля или жильё в районе. Подходит, чтобы вести человека на страницу, совпадающую с запросом.",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google указывает, что отель может показывать название, цену и причины бронировать на своём сайте в Hotel Ads, чтобы направить путешественника на сайт и поддержать прямое бронирование.",
    hotelAdsSource: "Источник: Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "У Google также есть ссылки бронирования без платы за рекламу. Они могут привести гостя на страницу брони отеля, если цена, наличие номеров и подключение готовы.",
    freeSource: "Источник: Google Hotel Center Help",
    organicNote: "",
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
    channelLead:
      "Compare Search Ads, Hotel Ads, and Free Booking Links by use case, what can be controlled, required input, expected output, and KPIs. The hotel does not have to start every path at once.",
    channels: [
      ["Search Ads", "Текстовая реклама, которая отвечает на запрос: название отеля или жильё в районе. Подходит, чтобы вести человека на страницу, совпадающую с запросом."],
      ["Hotel Ads", "Данные об отеле и цене номера в гостиничном поиске Google. Сначала нужно проверить подключение цены и наличия номеров."],
      ["Free booking links", "Ссылки бронирования без платы за рекламу. Показ зависит от корректных данных, рабочего подключения и критериев Google."],
    ],
    channelClose: "Не обязательно запускать все каналы сразу. Команда сначала смотрит систему брони, бюджет, рынок и цель по доходу.",
    methodTitle: "Смотреть рекламу и бронь, а не только клики",
    methodLead:
      "Campaign work runs in five steps: Audit, Structure, Launch, Optimize, and Report. Each step has an owner, input, action, output, and a next decision.",
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
    searchAdsTitle: "Search Ads",
    searchAdsBody:
      "回應搜尋的文字廣告，例如飯店名稱或某一地區的住宿。適合把人帶到與需求相符的網頁。",
    hotelAdsTitle: "Google Hotel Ads",
    hotelAdsBody:
      "Google 指出，飯店可在 Hotel Ads 顯示名稱、價格，以及透過自家網站預訂的重點，把旅客帶到網站，並增加直銷預訂的機會。",
    hotelAdsSource: "來源：Google Hotel Center Help",
    freeTitle: "Free booking links",
    freeBody:
      "Google 也有不收取廣告費的預訂連結。只要價格、空房與系統連接準備好，就能把客人帶到飯店的預訂頁。",
    freeSource: "來源：Google Hotel Center Help",
    organicNote: "",
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
    channelLead:
      "Compare Search Ads, Hotel Ads, and Free Booking Links by use case, what can be controlled, required input, expected output, and KPIs. The hotel does not have to start every path at once.",
    channels: [
      ["Search Ads", "回應搜尋的文字廣告，例如飯店名稱或某一地區的住宿。適合把人帶到與需求相符的網頁。"],
      ["Hotel Ads", "在 Google 的飯店搜尋畫面顯示飯店與房價。必須先檢查價格與空房的連接。"],
      ["Free booking links", "不收取廣告費的預訂連結。能不能出現，取決於資料是否正確、連接是否可用，以及 Google 的條件。"],
    ],
    channelClose: "不必一次啟動所有通路。團隊會先看預訂系統、預算、市場與收益目標，再提出做法。",
    methodTitle: "看廣告，也看預訂，不只看點擊數",
    methodLead:
      "Campaign work runs in five steps: Audit, Structure, Launch, Optimize, and Report. Each step has an owner, input, action, output, and a next decision.",
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
  },
} as const;

export async function GoogleAdsView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsGoogleAdsPage | null;
  embedded?: boolean;
}) {
  const t = copy[locale];
  const cms = await resolveGoogleAdsPage(locale, previewContent);
  const fromCms = cms.fromCms;
  const thai = locale === "th";
  const solutions = localizePath("/solutions", locale);
  const heroVisual = cms.hero.visual;
  const visibilityVisual = cms.visibility.visual;
  const heroSrc = heroVisual.src.trim() || adsHeroVisualUrl() || "";
  const visibilitySrc = (() => {
    const cmsSrc = visibilityVisual.src.trim();
    const dummy = adsVisibilityVisualUrl() || "";
    const blocked = new Set([heroSrc, ADS_HERO_VISUAL_CANDIDATE, ADS_RELATED_VISUAL_CANDIDATE, ""]);
    if (cmsSrc && !blocked.has(cmsSrc)) return cmsSrc;
    if (dummy && !blocked.has(dummy)) return dummy;
    return "";
  })();
  const visibilityCaption =
    visibilityVisual.caption.trim() || (thai ? ADS_VISIBILITY_VISUAL.caption.th : ADS_VISIBILITY_VISUAL.caption.en);
  const visibilityLabel =
    visibilityVisual.label.trim() || (thai ? ADS_VISIBILITY_VISUAL.label.th : ADS_VISIBILITY_VISUAL.label.en);
  const heroTitle = fromCms && cms.hero.title.trim() ? cms.hero.title : t.title;
  const heroLead = fromCms && cms.hero.description.trim() ? cms.hero.description : t.lead;
  const heroCta = fromCms && cms.hero.primaryCta.label.trim() ? cms.hero.primaryCta.label : t.cta;
  const heroSecondary = fromCms && cms.hero.secondaryCta.label.trim() ? cms.hero.secondaryCta.label : t.secondary;
  const heroUnder = fromCms && cms.hero.underCta.trim() ? cms.hero.underCta : t.underCta;
  const visibilityTitle = fromCms && cms.visibility.title.trim() ? cms.visibility.title : t.whyTitle;
  const visibilityBody = fromCms && cms.visibility.body.trim() ? cms.visibility.body : t.whyBody;
  const visibilityNote = fromCms && cms.visibility.note.trim() ? cms.visibility.note : t.whyNote;
  const useSplitThaiWhy = locale === "th" && visibilityTitle === copy.th.whyTitle;
  const useSplitThaiWhyBody = locale === "th" && visibilityBody === copy.th.whyBody;
  const useSplitThaiTitle = locale === "th" && heroTitle === copy.th.title;
  const heroCaption = heroVisual.caption.trim() || (thai ? ADS_HERO_VISUAL.caption.th : ADS_HERO_VISUAL.caption.en);
  const heroLabel = heroVisual.label.trim() || (thai ? ADS_HERO_VISUAL.label.th : ADS_HERO_VISUAL.label.en);
  const frameworkRows = (() => {
    const fallback = ADS_FRAMEWORK_ROWS.map((row) => ({
      id: row.id,
      area: row.area,
      problem: thai ? row.problemTh : row.problemEn,
      inspect: thai ? row.inspectTh : row.inspectEn,
      improve: thai ? row.improveTh : row.improveEn,
      output: thai ? row.outputTh : row.outputEn,
    }));
    if (!fromCms || !cms.readiness.items.length) return fallback;
    const mapped = cms.readiness.items
      .map((item) => ({
        id: item.id,
        area: item.area.trim(),
        problem: (item.problem || item.why).trim(),
        inspect: (item.inspect || item.check).trim(),
        improve: item.improve.trim(),
        output: item.output.trim(),
      }))
      .filter((row) => row.area && row.problem && row.inspect && row.improve && row.output);
    return mapped.length ? mapped : fallback;
  })();
  const frameworkSrc = (() => {
    const cmsSrc = cms.readiness.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      ADS_HERO_VISUAL_CANDIDATE,
      ADS_VISIBILITY_VISUAL_CANDIDATE,
      ADS_FRAMEWORK_VISUAL_CANDIDATE,
      ADS_RELATED_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const frameworkTitle =
    fromCms && cms.readiness.title.trim()
      ? cms.readiness.title
      : locale === "th"
        ? "กรอบความพร้อมจากคำค้นถึงการจอง"
        : "Search-to-Booking Readiness Framework";
  const frameworkLead =
    fromCms && cms.readiness.body.trim()
      ? cms.readiness.body
      : locale === "th"
        ? "ก่อนขยายงบ ทีมดู Search Intent, โครงสร้างแคมเปญ, หน้าโรงแรม, ประสบการณ์จอง และการวัดผลในตารางเดียว"
        : "Before extra spend, the team reviews search intent, campaign structure, the landing page, the booking path, and measurement in one framework.";
  const channelRows = (() => {
    const fallback = ADS_CHANNEL_ROWS.map((row) => ({
      id: row.id,
      channel: row.channel,
      useCase: thai ? row.useCaseTh : row.useCaseEn,
      control: thai ? row.controlTh : row.controlEn,
      input: thai ? row.inputTh : row.inputEn,
      output: thai ? row.outputTh : row.outputEn,
      kpi: thai ? row.kpiTh : row.kpiEn,
    }));
    if (!fromCms || !cms.channels.rows.length) return fallback;
    const mapped = cms.channels.rows
      .map((item) => ({
        id: item.id,
        channel: item.channel.trim(),
        useCase: (item.useCase || item.role).trim(),
        control: item.control.trim(),
        input: (item.input || item.need).trim(),
        output: item.output.trim(),
        kpi: item.kpi.trim(),
      }))
      .filter((row) => row.channel && row.useCase && row.control && row.input && row.output && row.kpi);
    return mapped.length ? mapped : fallback;
  })();
  const channelSrc = (() => {
    const cmsSrc = cms.channels.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      ADS_HERO_VISUAL_CANDIDATE,
      ADS_VISIBILITY_VISUAL_CANDIDATE,
      ADS_FRAMEWORK_VISUAL_CANDIDATE,
      ADS_CHANNEL_VISUAL_CANDIDATE,
      ADS_RELATED_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const channelTitle = fromCms && cms.channels.title.trim() ? cms.channels.title : t.channelTitle;
  const workflowSteps = (() => {
    const fallback = ADS_WORKFLOW_STEPS.map((step) => ({
      id: step.id,
      number: step.number,
      title: thai ? step.titleTh : step.titleEn,
      owner: thai ? step.ownerTh : step.ownerEn,
      input: thai ? step.inputTh : step.inputEn,
      action: thai ? step.actionTh : step.actionEn,
      output: thai ? step.outputTh : step.outputEn,
      nextDecision: thai ? step.nextDecisionTh : step.nextDecisionEn,
    }));
    if (!fromCms || !cms.workflow.steps.length) return fallback;
    const mapped = cms.workflow.steps
      .map((item) => ({
        id: item.id,
        number: item.number.trim() || "00",
        title: item.title.trim(),
        owner: item.owner.trim(),
        input: item.input.trim(),
        action: item.action.trim(),
        output: item.output.trim(),
        nextDecision: (item.nextDecision || item.handoff).trim(),
      }))
      .filter((step) => step.title && step.owner && step.input && step.action && step.output && step.nextDecision);
    return mapped.length ? mapped : fallback;
  })();
  const workflowSrc = (() => {
    const cmsSrc = cms.workflow.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      channelSrc,
      ADS_HERO_VISUAL_CANDIDATE,
      ADS_VISIBILITY_VISUAL_CANDIDATE,
      ADS_FRAMEWORK_VISUAL_CANDIDATE,
      ADS_CHANNEL_VISUAL_CANDIDATE,
      ADS_WORKFLOW_VISUAL_CANDIDATE,
      ADS_RELATED_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const workflowTitle = fromCms && cms.workflow.title.trim() ? cms.workflow.title : t.methodTitle;
  const evidenceKpis = cms.publicKpis.map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    definition: kpi.definition,
    unit: kpi.unit,
    period: kpi.period,
    target: kpi.target,
    value: kpi.value.trim() || (adsKpiSeriesReady(kpi.labels, kpi.values) ? String(kpi.values[kpi.values.length - 1]) : ""),
    context: kpi.context,
    dataStatus: kpi.dataStatus,
    updatedAt: kpi.updatedAt,
  }));
  const evidenceSeries = cms.publicKpis
    .filter((kpi) => adsKpiSeriesReady(kpi.labels, kpi.values))
    .map((kpi) => ({
      id: kpi.id,
      name: kpi.name,
      labels: kpi.labels,
      values: kpi.values,
      target: kpi.target,
      tone: kpi.tone,
      dataStatus: kpi.dataStatus,
    }));
  const kpiSrc = (() => {
    const cmsSrc = cms.measure.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      channelSrc,
      workflowSrc,
      ADS_HERO_VISUAL_CANDIDATE,
      ADS_VISIBILITY_VISUAL_CANDIDATE,
      ADS_FRAMEWORK_VISUAL_CANDIDATE,
      ADS_CHANNEL_VISUAL_CANDIDATE,
      ADS_WORKFLOW_VISUAL_CANDIDATE,
      ADS_KPI_VISUAL_CANDIDATE,
      ADS_RELATED_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const relatedCards = cms.related.cards;
  const featuredRelated = relatedCards.find((card) => card.featured) ?? relatedCards[0];
  const supportingRelated = relatedCards.filter((card) => card.id !== featuredRelated?.id);
  const relatedTitle = fromCms && cms.related.title.trim() ? cms.related.title : t.relatedTitle;
  const trackingChecklist = cms.checklists?.tracking.items.length
    ? cms.checklists.tracking
    : {
        title: thai ? ADS_TRACKING_BOUNDARY.title.th : ADS_TRACKING_BOUNDARY.title.en,
        note: thai ? ADS_TRACKING_BOUNDARY.note.th : ADS_TRACKING_BOUNDARY.note.en,
        items: [...(thai ? ADS_TRACKING_BOUNDARY.items.th : ADS_TRACKING_BOUNDARY.items.en)],
      };
  const landingChecklist = cms.checklists?.landing.items.length
    ? cms.checklists.landing
    : {
        title: thai ? ADS_LANDING_CHECKLIST.title.th : ADS_LANDING_CHECKLIST.title.en,
        note: thai ? ADS_LANDING_CHECKLIST.note.th : ADS_LANDING_CHECKLIST.note.en,
        items: [...(thai ? ADS_LANDING_CHECKLIST.items.th : ADS_LANDING_CHECKLIST.items.en)],
      };
  const faqItems = fromCms && cms.faqs.length ? cms.faqs : adsFaqs(locale);
  const relatedSrc = (() => {
    const cmsSrc = cms.related.visual.src.trim();
    const dummy = adsRelatedVisualUrl() || "";
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      channelSrc,
      workflowSrc,
      kpiSrc,
      ADS_HERO_VISUAL_CANDIDATE,
      ADS_VISIBILITY_VISUAL_CANDIDATE,
      ADS_FRAMEWORK_VISUAL_CANDIDATE,
      ADS_CHANNEL_VISUAL_CANDIDATE,
      ADS_WORKFLOW_VISUAL_CANDIDATE,
      ADS_KPI_VISUAL_CANDIDATE,
    ]);
    if (cmsSrc && !blocked.has(cmsSrc) && cmsSrc !== ADS_RELATED_VISUAL_CANDIDATE) return cmsSrc;
    if (dummy && !blocked.has(dummy)) return dummy;
    return "";
  })();
  const showKpiSection = evidenceKpis.length > 0;
  const inner = (
    <>
      <section className="kpi-hero kpi-home-hero-section kpi-google-ads-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-google-ads-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/google-ads-management", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">Hotel Search &amp; Direct Booking</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {useSplitThaiTitle ? (
                  <>
                    <span className="kpi-home-h1-lead">เมื่อลูกค้าค้นหาที่พัก</span>
                    <span className="kpi-home-h1-rest">
                      ให้เขาเจอโรงแรมของคุณ
                      <span className="kpi-home-h1-close">และจองต่อได้ง่าย</span>
                    </span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
              {locale === "th" && heroLead === copy.th.lead ? (
                <p className="kpi-lead kpi-home-lead">
                  <span className="kpi-google-ads-lead-line">
                    คำค้นชื่อโรงแรมหรือที่พักในพื้นที่ต้องโยงกับโครงสร้างแคมเปญ และโฆษณาต้องพาไปหน้าโรงแรมที่เกี่ยวข้อง
                  </span>
                  <span className="kpi-google-ads-lead-line">
                    เส้นทางจองต้องวัดผลได้ <span className="kpi-latin">The KPI Plus</span> ช่วยทบทวนและปรับกระบวนการนี้ เมื่อโรงแรมอนุมัติให้ใช้บริการ
                  </span>
                </p>
              ) : (
                <p className="kpi-lead kpi-home-lead">{heroLead}</p>
              )}
              <div className="kpi-actions">
                <a href={fromCms ? cms.hero.primaryCta.href || "#google-ads-enquiry" : "#google-ads-enquiry"} className="kpi-button">
                  {locale === "th" && heroCta === copy.th.cta ? (
                    <>
                      ดูโอกาสเพิ่ม <span className="kpi-latin">Direct Booking</span>
                    </>
                  ) : (
                    heroCta
                  )}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
                <Link href={fromCms ? localizePath(cms.hero.secondaryCta.href || "/solutions", locale) : solutions} className="kpi-button-ghost">
                  {heroSecondary}
                </Link>
              </div>
              <p className="kpi-google-ads-hero-under">{heroUnder}</p>
              <p className="kpi-home-trust kpi-google-ads-journey">
                {t.flow.map((step, index) => (
                  <span key={step}>
                    <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span> {step}
                  </span>
                ))}
              </p>
            </div>
            <div className="kpi-google-ads-hero-visual">
              <AdsHeroVisual
                locale={locale}
                src={heroSrc}
                status={heroVisual.status || "sample"}
                alt={thai ? heroVisual.altTh || ADS_HERO_VISUAL.alt.th : heroVisual.altEn || ADS_HERO_VISUAL.alt.en}
                label={heroLabel}
                caption={heroCaption}
                meta={thai ? ADS_HERO_VISUAL.meta.th : ADS_HERO_VISUAL.meta.en}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-google-ads-compare">
        <div className="kpi-google-ads-compare-grid">
          <div className="kpi-google-ads-compare-copy">
            <h2 className="kpi-h2">
              {useSplitThaiWhy ? (
                <>
                  <span className="kpi-google-ads-compare-line">ลูกค้ากำลังเปรียบเทียบที่พัก</span>
                  <span className="kpi-google-ads-compare-br"> </span>
                  <span className="kpi-google-ads-compare-line">
                    ของคุณอยู่บน <span className="kpi-latin kpi-google-ads-compare-em">Google</span>
                  </span>
                </>
              ) : (
                visibilityTitle
              )}
            </h2>
            {useSplitThaiWhyBody ? (
              <p className="kpi-google-ads-compare-lead">
                <span className="kpi-google-ads-compare-lead-line">
                  เมื่อลูกค้าค้นหาที่พัก โรงแรมอาจปรากฏจาก <span className="kpi-latin">Search Ads</span>,{" "}
                  <span className="kpi-latin">Hotel Ads</span>, <span className="kpi-latin">Free Booking Links</span>
                  {" "}หรือผลการค้นหาทั่วไป
                </span>
                <span className="kpi-google-ads-compare-lead-line">
                  แต่ละช่องทางควรพาไปหน้าโรงแรมที่เกี่ยวข้อง แล้วเข้าสู่ระบบจองได้ ทีมไม่สัญญาอันดับแรก ยอดจอง หรือ{" "}
                  <span className="kpi-latin">ROAS</span>
                </span>
              </p>
            ) : (
              <p className="kpi-google-ads-compare-lead">{visibilityBody}</p>
            )}
            <ol className="kpi-google-ads-compare-path" aria-label={thai ? "เส้นทางจากคำค้นถึงการจอง" : "Search to booking path"}>
              {ADS_VISIBILITY_PATH.map((step) => (
                <li key={step.en}>
                  <span className="kpi-latin">{step.en}</span>
                  {thai ? <small>{step.th}</small> : null}
                </li>
              ))}
            </ol>
            <div className="kpi-google-ads-compare-cols">
              <article>
                <h3 className="kpi-latin">{t.searchAdsTitle}</h3>
                <p>{t.searchAdsBody}</p>
              </article>
              <article>
                <img src="/brand/google/google.svg" alt="" width={18} height={18} className="kpi-google-ads-compare-mark" />
                <h3 className="kpi-latin">{t.hotelAdsTitle}</h3>
                <p>{locale === "th" ? "แสดงชื่อ ราคา และช่องทางจองของโรงแรมในพื้นที่ค้นหาที่เกี่ยวข้อง แล้วพาลูกค้าไปหน้าโรงแรมหรือระบบจอง" : t.hotelAdsBody}</p>
              </article>
              <article>
                <img src="/brand/google/google.svg" alt="" width={18} height={18} className="kpi-google-ads-compare-mark" />
                <h3 className="kpi-latin">Free Booking Links</h3>
                <p>{t.freeBody}</p>
              </article>
            </div>
            {t.organicNote ? <p className="kpi-google-ads-compare-organic">{t.organicNote}</p> : null}
            <p className="kpi-google-ads-compare-note">{visibilityNote}</p>
            <p className="kpi-google-ads-compare-source">
              <a href={hotelAdsSource} target="_blank" rel="noreferrer">
                {t.hotelAdsSource.replace("Google Hotel Center Help", "")}
                <span className="kpi-latin">Google Hotel Center Help</span>
              </a>
              <a href={freeLinksSource} target="_blank" rel="noreferrer" className="sr-only">
                {t.freeSource}
              </a>
            </p>
          </div>
          <AdsVisibilityVisual
            locale={locale}
            src={visibilitySrc}
            status={visibilityVisual.status || "sample"}
            alt={thai ? visibilityVisual.altTh || ADS_VISIBILITY_VISUAL.alt.th : visibilityVisual.altEn || ADS_VISIBILITY_VISUAL.alt.en}
            label={visibilityLabel}
            caption={visibilityCaption}
            meta={thai ? ADS_VISIBILITY_VISUAL.meta.th : ADS_VISIBILITY_VISUAL.meta.en}
          />
        </div>
      </section>

      <section className="kpi-section kpi-google-ads-framework">
        <p className="kpi-latin kpi-google-ads-readiness-kicker">Search-to-Booking Readiness</p>
        <h2 className="kpi-h2">{frameworkTitle}</h2>
        <p className="kpi-google-ads-readiness-lead">{frameworkLead}</p>
        <AdsFrameworkMatrix locale={locale} rows={frameworkRows} />
        <AdsFrameworkVisual
          locale={locale}
          src={frameworkSrc}
          status={cms.readiness.visual.status || "sample"}
          alt={thai ? cms.readiness.visual.altTh || ADS_READINESS_VISUAL.alt.th : cms.readiness.visual.altEn || ADS_READINESS_VISUAL.alt.en}
          label={cms.readiness.visual.label.trim() || (thai ? ADS_READINESS_VISUAL.label.th : ADS_READINESS_VISUAL.label.en)}
          caption={cms.readiness.visual.caption.trim() || (thai ? ADS_READINESS_VISUAL.caption.th : ADS_READINESS_VISUAL.caption.en)}
          meta={thai ? ADS_READINESS_VISUAL.meta.th : ADS_READINESS_VISUAL.meta.en}
        />
        <a href="#google-ads-enquiry" className="kpi-button kpi-google-ads-framework-cta">
          {t.problemCta} <span aria-hidden="true">↗</span>
        </a>
        <div className="kpi-google-ads-checklists">
          {trackingChecklist.items.length ? (
            <article>
              <h3 className="kpi-latin">{trackingChecklist.title}</h3>
              {trackingChecklist.note ? <p>{trackingChecklist.note}</p> : null}
              <ul>
                {trackingChecklist.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {landingChecklist.items.length ? (
            <article>
              <h3 className="kpi-latin">{landingChecklist.title}</h3>
              {landingChecklist.note ? <p>{landingChecklist.note}</p> : null}
              <ul>
                {landingChecklist.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-google-ads-channels">
          <p className="kpi-latin kpi-google-ads-channels-kicker-section">Service Types</p>
          <h2 className="kpi-h2">{channelTitle}</h2>
          <p className="kpi-google-ads-channels-lead">{t.channelLead}</p>
          <AdsChannelMatrix locale={locale} rows={channelRows} />
          <AdsChannelVisual
            locale={locale}
            src={channelSrc}
            status={cms.channels.visual.status || "sample"}
            alt={thai ? cms.channels.visual.altTh || ADS_CHANNEL_VISUAL.alt.th : cms.channels.visual.altEn || ADS_CHANNEL_VISUAL.alt.en}
            label={cms.channels.visual.label.trim() || (thai ? ADS_CHANNEL_VISUAL.label.th : ADS_CHANNEL_VISUAL.label.en)}
            caption={cms.channels.visual.caption.trim() || (thai ? ADS_CHANNEL_VISUAL.caption.th : ADS_CHANNEL_VISUAL.caption.en)}
            meta={thai ? ADS_CHANNEL_VISUAL.meta.th : ADS_CHANNEL_VISUAL.meta.en}
          />
          <AdsChannelDecisions locale={locale} />
          <p className="kpi-google-ads-channels-close">{t.channelClose}</p>
        </div>
      </section>

      <section className="kpi-section kpi-google-ads-method">
        <p className="kpi-latin kpi-google-ads-workflow-kicker">Campaign Workflow</p>
        <h2 className="kpi-h2">
          {locale === "th" && workflowTitle === copy.th.methodTitle ? (
            <>
              <span className="kpi-google-ads-method-line">ดูทั้งโฆษณาและการจอง</span>
              <span className="kpi-google-ads-method-br"> </span>
              <span className="kpi-google-ads-method-line">ไม่ดูแค่จำนวนคลิก</span>
            </>
          ) : (
            workflowTitle
          )}
        </h2>
        <p className="kpi-google-ads-workflow-lead">{t.methodLead}</p>
        <AdsWorkflowSteps locale={locale} steps={workflowSteps} />
        <AdsWorkflowVisual
          locale={locale}
          src={workflowSrc}
          status={cms.workflow.visual.status || "sample"}
          alt={thai ? cms.workflow.visual.altTh || ADS_WORKFLOW_VISUAL.alt.th : cms.workflow.visual.altEn || ADS_WORKFLOW_VISUAL.alt.en}
          label={cms.workflow.visual.label.trim() || (thai ? ADS_WORKFLOW_VISUAL.label.th : ADS_WORKFLOW_VISUAL.label.en)}
          caption={cms.workflow.visual.caption.trim() || (thai ? ADS_WORKFLOW_VISUAL.caption.th : ADS_WORKFLOW_VISUAL.caption.en)}
          meta={thai ? ADS_WORKFLOW_VISUAL.meta.th : ADS_WORKFLOW_VISUAL.meta.en}
        />
      </section>

      {showKpiSection ? (
      <section className="kpi-section kpi-google-ads-measure">
        <p className="kpi-latin kpi-google-ads-measure-sample">Performance Evidence</p>
        <h2 className="kpi-h2">
          {fromCms && cms.measure.title.trim()
            ? cms.measure.title
            : locale === "th"
              ? (
                <>
                  <span className="kpi-google-ads-measure-line">ตัวเลขที่สำคัญกว่าคลิก</span>
                  <span className="kpi-google-ads-measure-br"> </span>
                  <span className="kpi-google-ads-measure-line">คือสิ่งที่ลูกค้าทำต่อ</span>
                </>
              )
              : t.measureTitle}
        </h2>
        <p className="kpi-google-ads-measure-lead">
          {fromCms && cms.measure.intro.trim()
            ? cms.measure.intro
            : locale === "th"
              ? (
                <>
                  แสดงเฉพาะตัวชี้วัดที่มีสถานะ Approved, Anonymised หรือ Sample ที่ติดป้ายชัดเจน
                  <span className="kpi-google-ads-measure-br"> </span>
                  ทีมไม่ใส่ ROAS อัตราแปลง ยอดจอง หรือรายได้ที่ยังไม่อนุมัติ
                </>
              )
              : "Only Approved, Anonymised, or clearly labelled Sample metrics are shown. The team does not publish ROAS, conversion rate, bookings, or revenue that has not been approved."}
        </p>
        <AdsKpiCards locale={locale} kpis={evidenceKpis} />
        {evidenceSeries.length ? (
          <AdsKpiChart locale={locale} series={evidenceSeries} />
        ) : (
          <AdsKpiVisual
            locale={locale}
            src={kpiSrc}
            status={cms.measure.visual.status || "sample"}
            alt={thai ? cms.measure.visual.altTh || ADS_KPI_VISUAL.alt.th : cms.measure.visual.altEn || ADS_KPI_VISUAL.alt.en}
            label={cms.measure.visual.label.trim() || (thai ? ADS_KPI_VISUAL.label.th : ADS_KPI_VISUAL.label.en)}
            caption={cms.measure.visual.caption.trim() || (thai ? ADS_KPI_VISUAL.caption.th : ADS_KPI_VISUAL.caption.en)}
            meta={thai ? ADS_KPI_VISUAL.meta.th : ADS_KPI_VISUAL.meta.en}
          />
        )}
        <p className="kpi-google-ads-measure-close">{fromCms && cms.measure.close.trim() ? cms.measure.close : t.measureNote}</p>
      </section>
      ) : null}

      {relatedCards.length ? (
      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-google-ads-related">
          <h2 className="kpi-h2">
            {locale === "th" && relatedTitle === copy.th.relatedTitle ? (
              <>
                <span className="kpi-google-ads-related-line">เรื่องที่เกี่ยวข้องกับการค้นหา</span>
                <span className="kpi-google-ads-related-br"> </span>
                <span className="kpi-google-ads-related-line">เว็บไซต์ และการจองตรง</span>
              </>
            ) : (
              relatedTitle
            )}
          </h2>
          <div className="kpi-google-ads-related-layout">
            <AdsRelatedVisual
              locale={locale}
              src={relatedSrc}
              status={cms.related.visual.status || "sample"}
              alt={thai ? cms.related.visual.altTh || ADS_RELATED_VISUAL.alt.th : cms.related.visual.altEn || ADS_RELATED_VISUAL.alt.en}
              label={cms.related.visual.label.trim() || (thai ? ADS_RELATED_VISUAL.label.th : ADS_RELATED_VISUAL.label.en)}
              caption={cms.related.visual.caption.trim() || (thai ? ADS_RELATED_VISUAL.caption.th : ADS_RELATED_VISUAL.caption.en)}
            />
            <div className="kpi-google-ads-related-cards">
              {featuredRelated ? <AdsRelatedCard key={featuredRelated.id} card={featuredRelated} locale={locale} featured /> : null}
              {supportingRelated.map((card) => (
                <AdsRelatedCard key={card.id} card={card} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      <GoogleAdsEnquiry
        locale={locale}
        helper={cms.form}
        teamPhotoSrc={adsPublicTeamPhoto(fromCms ? cms.form.visual : undefined)}
      />
      <PageFaqs items={faqItems} locale={locale} sectionId="google-ads-faq" />
      <GoogleAdsStickyCta label={t.cta} />
    </>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/google-ads-management", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}

function AdsRelatedCard({
  card,
  locale,
  featured = false,
}: {
  card: CmsAdsRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const dateLabel = relatedCardDateLabel(card, locale);
  const typeLabel = relatedCardTypeLabel(card);
  const meta = dateLabel || typeLabel ? "" : card.meta;
  const datetime = (card.updatedAt || card.publishedAt).trim();
  return (
    <Link href={card.href} className={`kpi-google-ads-related-item${featured ? " is-featured" : ""}`}>
      {featured ? <span className="kpi-google-ads-related-accent" aria-hidden="true" /> : null}
      {card.category ? <p className="kpi-google-ads-related-kicker">{card.category}</p> : null}
      <h3>{card.title}</h3>
      {card.description ? <p>{card.description}</p> : null}
      {dateLabel || typeLabel || meta ? (
        <p className="kpi-google-ads-related-meta">
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
          {dateLabel && typeLabel ? <span aria-hidden="true"> · </span> : null}
          {typeLabel ? <span>{typeLabel}</span> : null}
          {!dateLabel && !typeLabel && meta ? <span>{meta}</span> : null}
        </p>
      ) : null}
      <span className="kpi-google-ads-related-cta">
        {card.cta} <ArrowUpRight aria-hidden="true" />
      </span>
    </Link>
  );
}
