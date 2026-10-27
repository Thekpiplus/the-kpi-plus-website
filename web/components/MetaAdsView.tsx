import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { MetaObjectiveBoundary } from "@/components/meta-ads/MetaObjectiveBoundary";
import { MetaScenarioMatrix } from "@/components/meta-ads/MetaScenarioMatrix";
import { MetaScenarioVisual } from "@/components/meta-ads/MetaScenarioVisual";
import { MetaFrameworkMatrix } from "@/components/meta-ads/MetaFrameworkMatrix";
import { MetaFrameworkVisual } from "@/components/meta-ads/MetaFrameworkVisual";
import { MetaHeroVisual } from "@/components/meta-ads/MetaHeroVisual";
import { MetaKpiCards } from "@/components/meta-ads/MetaKpiCards";
import { MetaKpiChart } from "@/components/meta-ads/MetaKpiChart";
import { MetaKpiFramework } from "@/components/meta-ads/MetaKpiFramework";
import { MetaKpiVisual } from "@/components/meta-ads/MetaKpiVisual";
import { MetaCreativeMatrix } from "@/components/meta-ads/MetaCreativeMatrix";
import { MetaHotelScenarioMatrix } from "@/components/meta-ads/MetaHotelScenarioMatrix";
import { MetaHotelScenarioVisual } from "@/components/meta-ads/MetaHotelScenarioVisual";
import { MetaRelatedVisual } from "@/components/meta-ads/MetaRelatedVisual";
import { MetaAudienceInsight } from "@/components/meta-ads/MetaAudienceInsight";
import { MetaAudienceVisual } from "@/components/meta-ads/MetaAudienceVisual";
import { MetaWorkflowSteps } from "@/components/meta-ads/MetaWorkflowSteps";
import { MetaWorkflowVisual } from "@/components/meta-ads/MetaWorkflowVisual";
import { MetaAdsEnquiry } from "@/components/MetaAdsEnquiry";
import { MetaAdsStickyCta } from "@/components/MetaAdsStickyCta";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import { relatedCardDateLabel, relatedCardTypeLabel, type CmsMetaAdsPage, type CmsMetaRelatedCard } from "@/lib/cms/meta-ads-page";
import { metaHeroVisualUrl, metaPublicTeamPhoto, metaAudienceVisualUrl, resolveMetaAdsPage } from "@/lib/cms/meta-ads-page-public";
import { META_SCENARIO_ROWS, META_SCENARIO_VISUAL, META_SCENARIO_VISUAL_CANDIDATE, META_SCENARIO_VISUAL_LEGACY, META_FRAMEWORK_ROWS, META_FRAMEWORK_VISUAL_CANDIDATE, META_HERO_VISUAL, META_HERO_VISUAL_CANDIDATE, META_KPI_VISUAL, META_KPI_VISUAL_CANDIDATE, META_READINESS_VISUAL, META_RELATED_VISUAL, META_RELATED_VISUAL_CANDIDATE, META_HOTEL_SCENARIO_ROWS, META_HOTEL_SCENARIO_VISUAL, META_HOTEL_SCENARIO_VISUAL_CANDIDATE, META_AUDIENCE_VISUAL, META_AUDIENCE_VISUAL_CANDIDATE, META_AUDIENCE_VISUAL_LEGACY, META_PLATFORM_AUDIENCE_SOURCE, META_WORKFLOW_STEPS, META_WORKFLOW_VISUAL, META_WORKFLOW_VISUAL_CANDIDATE, metaFaqs, metaFaqsAreStale, metaKpiSeriesReady, metaObjectiveRowsAreStale, metaWorkflowStepsAreStale, metaCreativePublicAssetSrc, metaCreativeRowsAreStale, metaKpiCatalogIsStale } from "@/lib/meta-ads";
import { defaultMetaCreativeRows } from "@/components/meta-ads/MetaCreativeMatrix";
import { solutionNavLabel } from "@/lib/nav";
import { localizePath, type Locale } from "@/lib/seo";
import "@/components/meta-ads/meta-ads-visuals.css";

const dataReportalSource = META_PLATFORM_AUDIENCE_SOURCE.href;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Facebook และ Meta Ads",
    title: "ทำให้คนที่ใช่เห็นโรงแรมของคุณ แล้วมีเหตุผลที่จะสอบถามหรือจอง",
    lead: "Meta Ads เริ่มจากเป้าหมายธุรกิจที่ชัด กลุ่มลูกค้าและครีเอทีฟต้องเข้ากับตลาดของโรงแรม โฆษณาต้องพาไปหน้าโรงแรมหรือข้อเสนอที่เกี่ยวข้อง และเส้นทางจากโฆษณาไปสู่การสอบถามหรือจองตรงควรวัดผลได้ เดอะ เคพีไอ พลัส ช่วยทบทวนและปรับแคมเปญ เมื่อโรงแรมอนุมัติให้ใช้บริการ",
    cta: "ให้ทีมประเมินแนวทาง Meta Ads",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรมและลิงก์เพจหรือเว็บไซต์ เพื่อเริ่มพูดคุยกับทีม",
    photoAlt: "ตัวอย่าง Meta Ad Creative และ Hotel Booking Funnel ไม่ใช่รูปบุคคล",
    flow: ["เป้าหมาย", "กลุ่มลูกค้า", "ครีเอทีฟ", "หน้าเว็บ / แชต", "สอบถามหรือจอง"],
    whyTitle: "ลูกค้าอยู่บนแพลตฟอร์ม แต่การเข้าถึงอย่างเดียวไม่พอ",
    facebookStat: "51.5 ล้าน",
    facebookLabel: "ขนาดกลุ่มเป้าหมายโฆษณา Facebook ในไทย",
    instagramStat: "20.6 ล้าน",
    instagramLabel: "ขนาดกลุ่มเป้าหมายโฆษณา Instagram ในไทย",
    whyBody:
      "ขนาดกลุ่มเป้าหมายโฆษณาของแพลตฟอร์มบอกได้แค่ว่าในประเทศมีคนที่โฆษณาเข้าถึงได้กว้างแค่ไหน ไม่ใช่จำนวนคนที่โรงแรมอาจเข้าถึงได้ ไม่ใช่ยอดเห็นแคมเปญ และไม่ใช่จำนวนผู้เข้าชมเว็บหรือผลสอบถามหรือจอง โรงแรมยังต้องเลือกกลุ่มลูกค้าและความสนใจที่เข้ากับตลาด แล้ววางครีเอทีฟกับหน้าปลายทางให้คนที่สนใจไปต่อได้",
    searchAdsTitle: "Awareness",
    searchAdsBody:
      "ให้กลุ่มที่ยังไม่รู้จักโรงแรมเห็นจุดเด่นของที่พัก ก่อนตัดสินใจสอบถามหรือจอง",
    hotelAdsTitle: "Leads / Messages",
    hotelAdsBody:
      "รับคำถามเกี่ยวกับห้องพัก วันที่เข้าพัก หรือข้อเสนอ ผ่านข้อความหรือแบบฟอร์มที่โรงแรมตอบได้",
    hotelAdsSource: "ที่มา: DataReportal Digital 2026 Thailand",
    freeTitle: "Conversion",
    freeBody:
      "พาลูกค้าไปหน้าเว็บ แชต หรือระบบจองเมื่อเส้นทางพร้อม และวัดได้เฉพาะอีเวนต์ที่โรงแรมอนุญาต",
    freeSource: "ที่มา: DataReportal Digital 2026 Thailand",
    organicNote: "",
    whyNote:
      "ตัวเลขด้านล่างเป็นประมาณการกลุ่มเป้าหมายโฆษณาระดับประเทศจาก DataReportal ไม่ใช่ผลแคมเปญของโรงแรม ผู้ใช้ Facebook และ Instagram อาจซ้ำกัน",
    problemTitle: "ลงโฆษณาอยู่แล้ว แต่รู้หรือไม่ว่าลูกค้าไปต่ออย่างไร?",
    problems: [
      "มีคนเห็นโฆษณา แต่ไม่รู้ว่ามีคนสอบถามหรือจองต่อเท่าไร",
      "ใช้ภาพและข้อความเดียวกับลูกค้าทุกกลุ่ม",
      "มีห้องว่างบางช่วง แต่ข้อเสนอยังไปไม่ถึงกลุ่มที่เหมาะสม",
      "คนคลิกแล้วหาข้อมูลห้องพัก ราคา หรือช่องทางติดต่อไม่เจอ",
      "ผู้ที่เคยสนใจโรงแรมยังไม่มีแผนติดตามอย่างเหมาะสม",
    ],
    problemClose: "หากโรงแรมของคุณเจอข้อใดข้อหนึ่ง ทีมช่วยดูได้ว่าควรเริ่มแก้ตรงไหนก่อน",
    problemCta: "ให้ทีมดูสถานการณ์ของโรงแรม",
    helpTitle: "เชื่อมโฆษณากับเป้าหมายการขายของโรงแรม",
    help: [
      ["01", "วางเป้าหมายและกลุ่มลูกค้า", "ดูว่าโรงแรมต้องการเพิ่มการรับรู้ เพิ่มคำถามเกี่ยวกับห้องพัก หรือพาลูกค้าเข้าสู่ช่องทางจอง แล้วเลือกแนวทางโฆษณาให้สัมพันธ์กับเป้าหมายนั้น"],
      ["02", "สื่อสารจุดเด่นและข้อเสนอ", "นำทำเล ห้องพัก ประสบการณ์เข้าพัก และช่วงเวลาที่ต้องการขาย มาจับคู่กับภาพ ข้อความ และกลุ่มลูกค้าที่เหมาะสม"],
      ["03", "ตรวจเส้นทางหลังคลิก", "ดูว่าลูกค้าจากโฆษณาไปถึงข้อมูลห้องพัก ช่องทางแชต หรือระบบจองได้สะดวกหรือไม่ พร้อมชี้จุดที่ควรปรับร่วมกับทีมโรงแรม"],
      ["04", "ทบทวนผลและปรับแผน", "พิจารณาผลโฆษณาร่วมกับคุณภาพของคำถามและข้อมูลการจองที่ตรวจสอบได้ เพื่อเลือกสิ่งที่ควรทำต่อ"],
    ],
    channelTitle: "เชื่อม Meta Ads กับเป้าหมายการขายของโรงแรม",
    channelLead:
      "จับคู่ Objective กับการกระทำตัวอย่าง หน้าปลายทาง KPI และผลที่คาดหวัง ชื่อตัวชี้วัดไม่ใช่ผลแคมเปญของโรงแรม",
    channels: [
      ["Awareness", "แนะนำโรงแรมและจุดหมายปลายทาง"],
      ["Consideration", "แสดงห้องพัก สิ่งอำนวยความสะดวก และข้อเสนอ"],
      ["Inquiry", "ชวนให้ติดต่อหรือส่งข้อมูล"],
      ["Direct Booking", "พาไประบบจอง"],
      ["Remarketing", "กลับไปพูดกับผู้ที่เคยเข้าชมหรือเคยเห็นโฆษณา"],
    ],
    channelClose: "",
    methodTitle: "ดูทั้งโฆษณาและการจอง ไม่ดูแค่จำนวนคลิก",
    methodLead:
      "งานแคมเปญเดินหกขั้น จาก Audit ไป Plan, Create, Launch, Optimize และ Report แต่ละขั้นมีผู้รับผิดชอบ สิ่งที่รับ สิ่งที่ทำ สิ่งที่ได้ และการตัดสินใจขั้นถัดไป",
    creativeTitle: "จับคู่กลุ่มลูกค้า ข้อความ รูปแบบ หน้าปลายทาง และ KPI",
    creativeLead:
      "ตารางนี้เป็นกรอบวางครีเอทีฟ ไม่ใช่ผลแคมเปญ แสดงตัวเลขเมื่อมีข้อมูลที่อนุมัติแล้วเท่านั้น",
    steps: [
      ["01", "ตรวจสถานการณ์", "ดูเว็บไซต์ ระบบจอง Meta Ads ที่ใช้อยู่ ตลาดเป้าหมาย และช่วงที่โรงแรมต้องการเพิ่มยอดขาย"],
      ["02", "ตรวจเส้นทางลูกค้า", "จากโฆษณา ไปถึงหน้าเว็บ ราคา ห้องว่าง และหน้าชำระเงินหรือยืนยันการจอง"],
      ["03", "วางแผนแคมเปญ", "กำหนดกลุ่มลูกค้า ข้อความโฆษณา หน้าเว็บปลายทาง งบประมาณ และสิ่งที่จะวัด"],
      ["04", "ทบทวนผล", "ดูข้อมูลที่ตรวจสอบได้ แล้วปรับคำค้น งบ และข้อเสนอร่วมกับสถานการณ์ยอดขายของโรงแรม"],
    ],
    measureTitle: "แยกตัวชี้วัดแพลตฟอร์มกับผลธุรกิจ",
    measureBody:
      "เราดูว่าโฆษณาพาลูกค้ามาถึงหน้าเว็บ ลูกค้าเข้าสู่หน้าห้องพักหรือระบบจองหรือไม่ มีการสอบถามหรือจองจริงเท่าไร และต้นทุนของผลลัพธ์นั้นเหมาะกับรายได้ที่โรงแรมได้รับหรือไม่",
    measureNote:
      "ความสามารถในการวัดยอดจองและรายได้ขึ้นอยู่กับเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลของโรงแรม ทีมจะตรวจสิ่งที่วัดได้จริงก่อนกำหนดรายงาน",
    relatedTitle: "เริ่มจากสถานการณ์จริงของโรงแรม",
    relatedLead: "เลือกสถานการณ์ที่ใกล้โรงแรมที่สุด แล้วดูคำถามแรก สิ่งที่ควรเริ่ม และสิ่งที่ได้ก่อนขยายงบ",
    relatedReadingTitle: "เรื่องที่เกี่ยวข้องกับ Meta Ads และการตลาดโรงแรม",
    relatedReadingLead: "อ่านบทความและหน้าบริการที่มีอยู่จริงเรื่องการตลาดโรงแรม การจองตรง Conversion Tracking และ SEO กับ SEM",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Facebook and Instagram ads for hotels",
    title: "Help the right people see your hotel, then give them a reason to enquire or book",
    lead: "Meta Ads starts from a clear business objective. Audience and creative have to fit the hotel’s market. The ad should open a relevant hotel or offer page, and the path from the ad to an enquiry or direct booking should be measurable. The KPI Plus supports review and optimization where the service is approved.",
    cta: "Ask the team to review a Meta Ads approach",
    secondary: "All solutions",
    underCta: "Send the hotel name and a page or website link to start the conversation.",
    photoAlt: "Sample Meta Ad Creative and Hotel Booking Funnel, not a person photo",
    flow: ["Objective", "Audience", "Creative", "Landing / Chat", "Enquiry or booking"],
    whyTitle: "Guests are on the platforms, but reach alone is not the plan",
    facebookStat: "51.5 million",
    facebookLabel: "Facebook advertising audience size in Thailand",
    instagramStat: "20.6 million",
    instagramLabel: "Instagram advertising audience size in Thailand",
    whyBody:
      "A platform audience estimate only shows how many people in the country can be reached with ads. It is not the hotel’s potential reach, not campaign reach, and not website visitors or enquiry or booking results. The hotel still has to choose an audience and interests that fit its market, then match creative to a page those people can continue on.",
    searchAdsTitle: "Awareness",
    searchAdsBody:
      "Help people who do not yet know the hotel see what makes the stay distinctive before they enquire or book.",
    hotelAdsTitle: "Leads / Messages",
    hotelAdsBody:
      "Collect room, date, or offer questions through messages or a form the hotel can answer.",
    hotelAdsSource: "Source: DataReportal Digital 2026 Thailand",
    freeTitle: "Conversion",
    freeBody:
      "Send guests to a page, chat, or booking path when that path is ready, and measure only events the hotel allows.",
    freeSource: "Source: DataReportal Digital 2026 Thailand",
    organicNote: "",
    whyNote:
      "The figures below are country-level advertising-audience estimates from DataReportal, not a hotel campaign result. Facebook and Instagram users can overlap.",
    problemTitle: "You may already be advertising. Do you know what guests do next?",
    problems: [
      "People see the ads, but it is unclear how many enquire or book afterwards",
      "The same image and message is used for every guest group",
      "Some dates still have rooms, but the offer is not reaching the right people",
      "After the click, room details, rates, or a contact path are hard to find",
      "People who already showed interest have no clear follow-up plan",
    ],
    problemClose: "If any of these sound familiar, the team can help you see where to start.",
    problemCta: "Ask the team to look at the hotel’s situation",
    helpTitle: "Connect the ads to what the hotel actually wants to sell",
    help: [
      ["01", "Set the goal and the audience", "Decide whether the hotel needs more awareness, more room enquiries, or a clearer path to booking, then match the ads to that goal."],
      ["02", "Say what makes the stay worth asking about", "Pair location, rooms, the stay experience, and the dates you need to sell with the right image, message, and audience."],
      ["03", "Check the path after the click", "See whether guests from the ad can reach room details, chat, or the booking path, and note what the hotel team should fix."],
      ["04", "Review the result and adjust", "Look at ad results together with enquiry quality and bookings you can verify, then choose the next move."],
    ],
    channelTitle: "Connect Meta Ads to the hotel’s sales objectives",
    channelLead:
      "Match each Objective to an example action, destination page, KPI, and expected output. KPI names are not a hotel campaign result.",
    channels: [
      ["Awareness", "Introduce the hotel and destination"],
      ["Consideration", "Show rooms, facilities, and offer"],
      ["Inquiry", "Encourage contact or lead submission"],
      ["Direct Booking", "Send users to booking engine"],
      ["Remarketing", "Reconnect with previous visitors or viewers"],
    ],
    channelClose: "",
    methodTitle: "Review the ads and the booking, not clicks alone",
    methodLead:
      "Campaign work runs in six steps: Audit, Plan, Create, Launch, Optimize, and Report. Each step has an owner, input, action, output, and a next decision.",
    creativeTitle: "Match audience, message, format, destination, and KPI",
    creativeLead:
      "This matrix is a planning framework, not campaign results. Figures stay hidden until approved data exists.",
    steps: [
      ["01", "Check the situation", "Look at the website, booking system, current Meta Ads, the target market, and the dates the hotel wants to sell."],
      ["02", "Check the guest path", "From the ad through to the page, the rate, availability, and the payment or confirmation step."],
      ["03", "Plan the campaign", "Agree the audience, ad copy, destination pages, budget, and what will be measured."],
      ["04", "Review the result", "Use data that can be checked, then adjust searches, budget, and the offer with the hotel’s sales situation."],
    ],
    measureTitle: "Separate platform metrics from business metrics",
    measureBody:
      "We look at whether ads bring guests to the site, whether they reach a room page or the booking system, how many enquire or book, and whether the cost of that result fits the revenue the hotel receives.",
    measureNote:
      "How far bookings and revenue can be measured depends on the website, booking system, and tracking the hotel already has. The team checks what can actually be measured before agreeing the report.",
    relatedTitle: "Start from the hotel’s real situation",
    relatedLead: "Pick the closest hotel situation, then see the first diagnostic question, the starting action, and the output before extra spend.",
    relatedReadingTitle: "Related reading on Meta Ads and hotel marketing",
    relatedReadingLead: "Read existing hotel marketing, direct-booking, conversion-tracking, and SEO and SEM pages.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Meta Ads для отелей",
    facebookStat: "51,5 млн",
    facebookLabel: "Размер рекламной аудитории Facebook в Таиланде",
    instagramStat: "20,6 млн",
    instagramLabel: "Размер рекламной аудитории Instagram в Таиланде",
    title: "Пусть нужные люди увидят отель и поймут, зачем спрашивать или бронировать",
    lead: "Хорошая реклама не заканчивается просмотрами и лайками. The KPI Plus помогает отелю спланировать Meta Ads: кого показывать, что сказать про проживание и предложение, и сможет ли гость после клика удобно спросить или забронировать.",
    cta: "Попросить команду оценить подход к Meta Ads",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, сайт и ссылку на страницу бронирования для первого просмотра.",
    photoAlt: "Путешественник сравнивает варианты проживания в Google перед бронированием",
    flow: ["Поиск", "Реклама", "Сайт", "Бронь", "Разбор"],
    whyTitle: "Гости уже на платформах, но одного охвата недостаточно",
    whyBody:
      "Путешественники ищут название отеля, жильё в нужном районе и цены, прежде чем выбрать канал бронирования. Если сайт отеля появляется в нужный момент с понятными данными и понятным путём брони, есть шанс привести гостя на собственный канал отеля.",
    searchAdsTitle: "Awareness",
    searchAdsBody:
      "Текстовая реклама, которая отвечает на запрос: название отеля или жильё в районе. Подходит, чтобы вести человека на страницу, совпадающую с запросом.",
    hotelAdsTitle: "Google Leads",
    hotelAdsBody:
      "Google указывает, что отель может показывать название, цену и причины бронировать на своём сайте в Leads, чтобы направить путешественника на сайт и поддержать прямое бронирование.",
    hotelAdsSource: "Источник: DataReportal Digital 2026 Thailand",
    freeTitle: "Free booking links",
    freeBody:
      "У Google также есть ссылки бронирования без платы за рекламу. Они могут привести гостя на страницу брони отеля, если цена, наличие номеров и подключение готовы.",
    freeSource: "Источник: DataReportal Digital 2026 Thailand",
    organicNote: "",
    whyNote:
      "Awareness, Leads и free booking links имеют разные форматы и условия. Команда сначала проверяет готовность отеля, затем рекомендует, какой путь использовать.",
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
    channelTitle: "Connect Meta Ads to the hotel’s sales objectives",
    channelLead:
      "Match each Objective to an example action, destination page, KPI, and expected output. KPI names are not a hotel campaign result.",
    channels: [
      ["Awareness", "Introduce the hotel and destination"],
      ["Consideration", "Show rooms, facilities, and offer"],
      ["Inquiry", "Encourage contact or lead submission"],
      ["Direct Booking", "Send users to booking engine"],
      ["Remarketing", "Reconnect with previous visitors or viewers"],
    ],
    channelClose: "",
    methodTitle: "Смотреть рекламу и бронь, а не только клики",
    methodLead:
      "Campaign work runs in six steps: Audit, Plan, Create, Launch, Optimize, and Report. Each step has an owner, input, action, output, and a next decision.",
    creativeTitle: "Match audience, message, format, destination, and KPI",
    creativeLead:
      "This matrix is a planning framework, not campaign results. Figures stay hidden until approved data exists.",
    steps: [
      ["01", "Проверить ситуацию", "Сайт, систему брони, текущие Meta Ads, целевой рынок и даты, которые отелю нужно продавать."],
      ["02", "Проверить путь гостя", "От запроса и рекламы до страницы, цены, наличия номеров и шага оплаты или подтверждения."],
      ["03", "Спланировать кампанию", "Согласовать запросы, тексты, страницы назначения, бюджет и то, что будем измерять."],
      ["04", "Разобрать результат", "Использовать проверяемые данные, затем скорректировать запросы, бюджет и предложение вместе с продажами отеля."],
    ],
    measureTitle: "Separate platform metrics from business metrics",
    measureBody:
      "Мы смотрим, какие запросы приводят на сайт, доходит ли гость до страницы номера или системы брони, сколько спрашивает или бронирует, и подходит ли стоимость этого результата доходу отеля.",
    measureNote:
      "Насколько можно измерить брони и доход, зависит от сайта, системы брони и уже настроенного отслеживания. Команда сначала проверяет, что реально измеримо, затем согласовывает отчёт.",
    relatedTitle: "Start from the hotel’s real situation",
    relatedLead: "Pick the closest hotel situation, then see the first diagnostic question, the starting action, and the output before extra spend.",
    relatedReadingTitle: "Related reading on Meta Ads and hotel marketing",
    relatedReadingLead: "Read existing hotel marketing, direct-booking, conversion-tracking, and SEO and SEM pages.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "飯店的 Meta Ads",
    facebookStat: "5150 萬",
    facebookLabel: "泰國 Facebook 廣告目標對象規模",
    instagramStat: "2060 萬",
    instagramLabel: "泰國 Instagram 廣告目標對象規模",
    title: "讓對的人看到你的飯店，並有理由詢問或預訂",
    lead: "旅客可能在 Google 搜尋飯店名稱、地點，或想要的住宿類型。有點擊還不是有預訂。The KPI Plus 會把廣告，連同網站、價格、方案與預訂系統一起規劃，讓興趣比較有機會變成可核對的直銷預訂。",
    cta: "請團隊看增加直銷預訂的機會",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、網站與預訂頁連結，讓團隊先看一輪。",
    photoAlt: "旅客在 Google 上比較住宿後再決定預訂",
    flow: ["搜尋", "廣告", "網站", "預訂系統", "檢視結果"],
    whyTitle: "客人已經在 Google 上比較你的飯店",
    whyBody:
      "旅客會先搜尋飯店名稱、想去的地點，以及價格資訊，再決定從哪個通路預訂。若飯店網站在對的時間出現，資料與預訂路徑又清楚，就比較有機會把客人帶進飯店自己的預訂通路。",
    searchAdsTitle: "Awareness",
    searchAdsBody:
      "回應搜尋的文字廣告，例如飯店名稱或某一地區的住宿。適合把人帶到與需求相符的網頁。",
    hotelAdsTitle: "Google Leads",
    hotelAdsBody:
      "Google 指出，飯店可在 Leads 顯示名稱、價格，以及透過自家網站預訂的重點，把旅客帶到網站，並增加直銷預訂的機會。",
    hotelAdsSource: "來源：DataReportal Digital 2026 Thailand",
    freeTitle: "Free booking links",
    freeBody:
      "Google 也有不收取廣告費的預訂連結。只要價格、空房與系統連接準備好，就能把客人帶到飯店的預訂頁。",
    freeSource: "來源：DataReportal Digital 2026 Thailand",
    organicNote: "",
    whyNote:
      "Awareness、Leads 與 free booking links 的形式與條件不同。團隊會先檢查飯店準備程度，再建議該走哪一條。",
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
    channelTitle: "Connect Meta Ads to the hotel’s sales objectives",
    channelLead:
      "Match each Objective to an example action, destination page, KPI, and expected output. KPI names are not a hotel campaign result.",
    channels: [
      ["Awareness", "Introduce the hotel and destination"],
      ["Consideration", "Show rooms, facilities, and offer"],
      ["Inquiry", "Encourage contact or lead submission"],
      ["Direct Booking", "Send users to booking engine"],
      ["Remarketing", "Reconnect with previous visitors or viewers"],
    ],
    channelClose: "",
    methodTitle: "看廣告，也看預訂，不只看點擊數",
    methodLead:
      "Campaign work runs in six steps: Audit, Plan, Create, Launch, Optimize, and Report. Each step has an owner, input, action, output, and a next decision.",
    creativeTitle: "Match audience, message, format, destination, and KPI",
    creativeLead:
      "This matrix is a planning framework, not campaign results. Figures stay hidden until approved data exists.",
    steps: [
      ["01", "先看現況", "檢查網站、預訂系統、目前的 Meta Ads、目標市場，以及飯店想加強銷售的時段。"],
      ["02", "檢查客人路徑", "從搜尋與廣告，走到網頁、價格、空房，以及付款或確認預訂的頁面。"],
      ["03", "規劃活動", "確認搜尋詞、廣告文案、落地頁、預算，以及要衡量的項目。"],
      ["04", "檢視結果", "用可核對的資料，再依飯店的銷售情況調整搜尋詞、預算與方案。"],
    ],
    measureTitle: "Separate platform metrics from business metrics",
    measureBody:
      "我們會看哪些搜尋把客人帶到網站、是否進入房型頁或預訂系統、實際詢問或預訂有多少，以及這個結果的成本是否適合飯店拿到的收益。",
    measureNote:
      "預訂與收益能量到什麼程度，取決於網站、預訂系統與飯店既有的追蹤設定。團隊會先確認實際能量到什麼，再一起決定報告方式。",
    relatedTitle: "Start from the hotel’s real situation",
    relatedLead: "Pick the closest hotel situation, then see the first diagnostic question, the starting action, and the output before extra spend.",
    relatedReadingTitle: "Related reading on Meta Ads and hotel marketing",
    relatedReadingLead: "Read existing hotel marketing, direct-booking, conversion-tracking, and SEO and SEM pages.",
  },
} as const;

export async function MetaAdsView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsMetaAdsPage | null;
  embedded?: boolean;
}) {
  const t = copy[locale === "th" ? "th" : "en"];
  const cms = await resolveMetaAdsPage(locale, previewContent);
  const fromCms = cms.fromCms;
  const thai = locale === "th";
  const solutions = localizePath("/solutions", locale);
  const heroVisual = cms.hero.visual;
  const visibilityVisual = cms.visibility.visual;
  const heroSrc = heroVisual.src.trim() || metaHeroVisualUrl() || "";
  const visibilitySrc = (() => {
    const cmsSrc = visibilityVisual.src.trim();
    const dummy = metaAudienceVisualUrl() || "";
    const blocked = new Set([
      heroSrc,
      META_HERO_VISUAL_CANDIDATE,
      META_RELATED_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_LEGACY,
      "",
    ]);
    if (cmsSrc && !blocked.has(cmsSrc) && cmsSrc !== META_AUDIENCE_VISUAL_CANDIDATE) return cmsSrc;
    if (dummy && !blocked.has(dummy)) return dummy;
    return "";
  })();
  const usingDummyAudience =
    !visibilityVisual.src.trim() ||
    visibilityVisual.src === META_AUDIENCE_VISUAL_CANDIDATE ||
    visibilityVisual.src === META_AUDIENCE_VISUAL_LEGACY ||
    visibilitySrc === META_AUDIENCE_VISUAL_CANDIDATE;
  const visibilityCaption = usingDummyAudience
    ? thai
      ? META_AUDIENCE_VISUAL.caption.th
      : META_AUDIENCE_VISUAL.caption.en
    : visibilityVisual.caption.trim() || (thai ? META_AUDIENCE_VISUAL.caption.th : META_AUDIENCE_VISUAL.caption.en);
  const visibilityLabel = usingDummyAudience
    ? thai
      ? META_AUDIENCE_VISUAL.label.th
      : META_AUDIENCE_VISUAL.label.en
    : visibilityVisual.label.trim() || (thai ? META_AUDIENCE_VISUAL.label.th : META_AUDIENCE_VISUAL.label.en);
  const heroTitle =
    fromCms && cms.hero.title.trim() && !/เมื่อลูกค้าค้นหาที่พัก|When guests search for a stay/.test(cms.hero.title)
      ? cms.hero.title
      : t.title;
  const heroLead =
    fromCms &&
    cms.hero.description.trim() &&
    !/โฆษณาที่ดีไม่จบแค่ยอดเห็น|A useful ad does more than collect views/.test(cms.hero.description)
      ? cms.hero.description
      : t.lead;
  const heroCta = fromCms && cms.hero.primaryCta.label.trim() ? cms.hero.primaryCta.label : t.cta;
  const heroSecondary = fromCms && cms.hero.secondaryCta.label.trim() ? cms.hero.secondaryCta.label : t.secondary;
  const heroUnder = fromCms && cms.hero.underCta.trim() ? cms.hero.underCta : t.underCta;
  const visibilityTitle =
    locale === "zh" && /Google/.test(t.whyTitle)
      ? copy.en.whyTitle
      : fromCms && cms.visibility.title.trim() && !/เมื่อลูกค้าค้นหาที่พัก|When guests search for a stay/.test(cms.visibility.title)
        ? cms.visibility.title
        : t.whyTitle;
  const visibilityBody =
    fromCms &&
    cms.visibility.body.trim() &&
    !/ข้อมูล ณ ปลายปี 2025 แสดงให้เห็นโอกาส|Late-2025 figures show the chance/.test(cms.visibility.body)
      ? cms.visibility.body
      : locale === "th"
        ? copy.th.whyBody
        : copy.en.whyBody;
  const visibilityNote =
    fromCms &&
    cms.visibility.note.trim() &&
    !/ตัวเลขเป็นข้อมูลการเข้าถึงโฆษณาจากเครื่องมือ Meta|These figures are Meta advertising-reach estimates/.test(
      cms.visibility.note,
    )
      ? cms.visibility.note
      : locale === "th"
        ? copy.th.whyNote
        : copy.en.whyNote;
  const useSplitThaiWhy = locale === "th" && visibilityTitle === copy.th.whyTitle;
  const useSplitThaiWhyBody = locale === "th" && visibilityBody === copy.th.whyBody;
  const useSplitThaiTitle = locale === "th" && heroTitle === copy.th.title;
  const usingDummyHero =
    !heroVisual.src.trim() || heroVisual.src === META_HERO_VISUAL_CANDIDATE || heroSrc === META_HERO_VISUAL_CANDIDATE;
  const heroCaption = usingDummyHero
    ? thai
      ? META_HERO_VISUAL.caption.th
      : META_HERO_VISUAL.caption.en
    : heroVisual.caption.trim() || (thai ? META_HERO_VISUAL.caption.th : META_HERO_VISUAL.caption.en);
  const heroLabel = usingDummyHero
    ? thai
      ? META_HERO_VISUAL.label.th
      : META_HERO_VISUAL.label.en
    : heroVisual.label.trim() || (thai ? META_HERO_VISUAL.label.th : META_HERO_VISUAL.label.en);
  const frameworkRows = (() => {
    const fallback = META_FRAMEWORK_ROWS.map((row) => ({
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
    const stale = mapped.some(
      (row) => row.id === "campaign-structure" || row.area === "Campaign Structure" || row.area === "Booking Experience",
    );
    return !stale && mapped.length === META_FRAMEWORK_ROWS.length ? mapped : fallback;
  })();
  const frameworkSrc = (() => {
    const cmsSrc = cms.readiness.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      META_HERO_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_CANDIDATE,
      META_FRAMEWORK_VISUAL_CANDIDATE,
      META_RELATED_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const frameworkTitle =
    fromCms &&
    cms.readiness.title.trim() &&
    !/คำค้นถึงการจอง|Search-to-Booking|Objective-to-Booking Readiness Framework/.test(cms.readiness.title)
      ? cms.readiness.title
      : locale === "th"
        ? "กรอบความพร้อม Meta Ads"
        : "Meta Ads Readiness Framework";
  const frameworkLead =
    fromCms && cms.readiness.body.trim() && !/จากคำค้น|Search-to-Booking/.test(cms.readiness.body)
      ? cms.readiness.body
      : locale === "th"
        ? "รวมปัญหาที่พบซ้ำ — เป้าหมาย กลุ่มลูกค้า ครีเอทีฟ หน้าปลายทาง เส้นทางสอบถามหรือจอง และการวัดผล — ไว้ในตารางเดียว ก่อนขยายงบ"
        : "Bring the repeated issues — objective, audience, creative, landing page, enquiry or booking path, and measurement — into one matrix before extra spend.";
  const channelRows = (() => {
    const fallback = META_SCENARIO_ROWS.map((row) => ({
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
      .filter((row) => row.channel && row.useCase && (row.input || row.control) && row.output && row.kpi);
    const stale =
      mapped.length !== META_SCENARIO_ROWS.length || metaObjectiveRowsAreStale(mapped);
    return !stale && mapped.length ? mapped : fallback;
  })();
  const channelSrc = (() => {
    const cmsSrc = cms.channels.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      META_HERO_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_LEGACY,
      META_FRAMEWORK_VISUAL_CANDIDATE,
      META_SCENARIO_VISUAL_CANDIDATE,
      META_SCENARIO_VISUAL_LEGACY,
      META_RELATED_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const usingDummyChannel = !channelSrc;
  const channelTitle =
    fromCms &&
    cms.channels.title.trim() &&
    !/ช่องทางไหน|Which path|Awareness vs|Leads vs|Traffic vs/.test(cms.channels.title)
      ? cms.channels.title
      : t.channelTitle;
  const channelLabel = usingDummyChannel
    ? thai
      ? META_SCENARIO_VISUAL.label.th
      : META_SCENARIO_VISUAL.label.en
    : cms.channels.visual.label.trim() || (thai ? META_SCENARIO_VISUAL.label.th : META_SCENARIO_VISUAL.label.en);
  const channelCaption = usingDummyChannel
    ? thai
      ? META_SCENARIO_VISUAL.caption.th
      : META_SCENARIO_VISUAL.caption.en
    : cms.channels.visual.caption.trim() || (thai ? META_SCENARIO_VISUAL.caption.th : META_SCENARIO_VISUAL.caption.en);
  const workflowSteps = (() => {
    const fallback = META_WORKFLOW_STEPS.map((step) => ({
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
    const stale = mapped.length !== META_WORKFLOW_STEPS.length || metaWorkflowStepsAreStale(mapped);
    return !stale && mapped.length ? mapped : fallback;
  })();
  const workflowSrc = (() => {
    const cmsSrc = cms.workflow.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      channelSrc,
      META_HERO_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_CANDIDATE,
      META_FRAMEWORK_VISUAL_CANDIDATE,
      META_SCENARIO_VISUAL_CANDIDATE,
      META_WORKFLOW_VISUAL_CANDIDATE,
      META_RELATED_VISUAL_CANDIDATE,
      META_HOTEL_SCENARIO_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const usingDummyWorkflow = !workflowSrc;
  const workflowTitle =
    fromCms &&
    cms.workflow.title.trim() &&
    !/ห้าขั้น|five steps|Structure, Launch/.test(cms.workflow.title)
      ? cms.workflow.title
      : t.methodTitle;
  const workflowLabel = usingDummyWorkflow
    ? thai
      ? META_WORKFLOW_VISUAL.label.th
      : META_WORKFLOW_VISUAL.label.en
    : cms.workflow.visual.label.trim() || (thai ? META_WORKFLOW_VISUAL.label.th : META_WORKFLOW_VISUAL.label.en);
  const workflowCaption = usingDummyWorkflow
    ? thai
      ? META_WORKFLOW_VISUAL.caption.th
      : META_WORKFLOW_VISUAL.caption.en
    : cms.workflow.visual.caption.trim() || (thai ? META_WORKFLOW_VISUAL.caption.th : META_WORKFLOW_VISUAL.caption.en);
  const creativeRows = (() => {
    const fallback = defaultMetaCreativeRows(locale);
    if (!fromCms || !cms.creative?.rows?.length) return fallback;
    const mapped = cms.creative.rows.map((item) => ({
      id: item.id,
      audience: item.audience.trim(),
      market: item.market.trim(),
      hook: item.hook.trim(),
      offer: item.offer.trim(),
      format: item.format,
      formatLabel: item.formatLabel.trim(),
      landing: item.landing.trim(),
      kpi: item.kpi.trim(),
      status: item.status,
      assetSrc: metaCreativePublicAssetSrc(item.assetSrc),
      assetKind: item.assetKind,
      assetAlt: item.assetAlt.trim(),
    }));
    const stale = metaCreativeRowsAreStale(mapped);
    const ready = mapped.filter((row) => row.status !== "archived" && row.audience && row.hook && row.format && row.landing && row.kpi);
    return !stale && ready.length ? ready : fallback;
  })();
  const creativeTitle =
    fromCms && cms.creative?.title.trim() && !/related reading|เรื่องที่เกี่ยวข้อง/i.test(cms.creative.title)
      ? cms.creative.title
      : t.creativeTitle;
  const creativeLead =
    fromCms && cms.creative?.body.trim() && !/related reading|เรื่องที่เกี่ยวข้อง/i.test(cms.creative.body)
      ? cms.creative.body
      : t.creativeLead;
  const evidenceKpis = (metaKpiCatalogIsStale(cms.publicKpis) ? [] : cms.publicKpis).map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    group: kpi.group,
    objective: kpi.objective || kpi.context,
    market: kpi.market,
    definition: kpi.definition,
    unit: kpi.unit,
    period: kpi.period,
    target: kpi.target,
    value: kpi.value.trim() || (metaKpiSeriesReady(kpi.labels, kpi.values) ? String(kpi.values[kpi.values.length - 1]) : ""),
    context: kpi.context,
    dataStatus: kpi.dataStatus,
    updatedAt: kpi.updatedAt,
  }));
  const evidenceSeries = (metaKpiCatalogIsStale(cms.publicKpis) ? [] : cms.publicKpis)
    .filter((kpi) => metaKpiSeriesReady(kpi.labels, kpi.values))
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
      META_HERO_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_CANDIDATE,
      META_FRAMEWORK_VISUAL_CANDIDATE,
      META_SCENARIO_VISUAL_CANDIDATE,
      META_WORKFLOW_VISUAL_CANDIDATE,
      META_KPI_VISUAL_CANDIDATE,
      META_RELATED_VISUAL_CANDIDATE,
      META_HOTEL_SCENARIO_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const hotelScenarioTitle =
    fromCms && cms.scenario?.title.trim()
      ? cms.scenario.title
      : fromCms && cms.related.title.trim() && /สถานการณ์จริง|real situation|Hotel Scenario/i.test(cms.related.title)
        ? cms.related.title
        : t.relatedTitle;
  const relatedReadingTitle =
    fromCms &&
    cms.related.title.trim() &&
    /เรื่องที่เกี่ยวข้อง|Related reading|Meta Ads and hotel marketing|การตลาดโรงแรม/i.test(cms.related.title) &&
    !/สถานการณ์จริง|real situation|Hotel Scenario/i.test(cms.related.title)
      ? cms.related.title
      : t.relatedReadingTitle;
  const faqItems = fromCms && cms.faqs.length && !metaFaqsAreStale(cms.faqs) ? cms.faqs : metaFaqs(locale);
  const relatedSrc = (() => {
    const cmsSrc = cms.related.visual.src.trim();
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      channelSrc,
      workflowSrc,
      kpiSrc,
      META_HERO_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_LEGACY,
      META_FRAMEWORK_VISUAL_CANDIDATE,
      META_SCENARIO_VISUAL_CANDIDATE,
      META_WORKFLOW_VISUAL_CANDIDATE,
      META_KPI_VISUAL_CANDIDATE,
      META_RELATED_VISUAL_CANDIDATE,
      META_HOTEL_SCENARIO_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const usingDummyRelated = !relatedSrc;
  const scenarioSrc = (() => {
    const cmsSrc = cms.scenario?.visual.src.trim() || "";
    const blocked = new Set([
      "",
      heroSrc,
      visibilitySrc,
      frameworkSrc,
      channelSrc,
      workflowSrc,
      kpiSrc,
      relatedSrc,
      META_HERO_VISUAL_CANDIDATE,
      META_AUDIENCE_VISUAL_CANDIDATE,
      META_FRAMEWORK_VISUAL_CANDIDATE,
      META_SCENARIO_VISUAL_CANDIDATE,
      META_WORKFLOW_VISUAL_CANDIDATE,
      META_KPI_VISUAL_CANDIDATE,
      META_RELATED_VISUAL_CANDIDATE,
      META_HOTEL_SCENARIO_VISUAL_CANDIDATE,
    ]);
    return cmsSrc && !blocked.has(cmsSrc) ? cmsSrc : "";
  })();
  const usingDummyHotelScenario = !scenarioSrc;
  const relatedCards = cms.related.cards;
  const featuredRelated = relatedCards.find((card) => card.featured) ?? relatedCards[0];
  const supportingRelated = relatedCards.filter((card) => card.id !== featuredRelated?.id);
  const relatedLabel = usingDummyRelated
    ? thai
      ? META_RELATED_VISUAL.label.th
      : META_RELATED_VISUAL.label.en
    : cms.related.visual.label.trim() || (thai ? META_RELATED_VISUAL.label.th : META_RELATED_VISUAL.label.en);
  const relatedCaption = usingDummyRelated
    ? thai
      ? META_RELATED_VISUAL.caption.th
      : META_RELATED_VISUAL.caption.en
    : cms.related.visual.caption.trim() || (thai ? META_RELATED_VISUAL.caption.th : META_RELATED_VISUAL.caption.en);
  const hotelScenarioRows =
    fromCms && cms.scenario?.rows?.length
      ? cms.scenario.rows.map((row) => ({
          id: row.id,
          situation: row.situation,
          question: row.question,
          action: row.action,
          output: row.output,
          next: row.next,
        }))
      : META_HOTEL_SCENARIO_ROWS.map((row) => ({
          id: row.id,
          situation: thai ? row.situationTh : row.situationEn,
          question: thai ? row.questionTh : row.questionEn,
          action: thai ? row.actionTh : row.actionEn,
          output: thai ? row.outputTh : row.outputEn,
          next: thai ? row.nextTh : row.nextEn,
        }));
  const hotelScenarioLabel = usingDummyHotelScenario
    ? thai
      ? META_HOTEL_SCENARIO_VISUAL.label.th
      : META_HOTEL_SCENARIO_VISUAL.label.en
    : cms.scenario.visual.label.trim() || (thai ? META_HOTEL_SCENARIO_VISUAL.label.th : META_HOTEL_SCENARIO_VISUAL.label.en);
  const hotelScenarioCaption = usingDummyHotelScenario
    ? thai
      ? META_HOTEL_SCENARIO_VISUAL.caption.th
      : META_HOTEL_SCENARIO_VISUAL.caption.en
    : cms.scenario.visual.caption.trim() || (thai ? META_HOTEL_SCENARIO_VISUAL.caption.th : META_HOTEL_SCENARIO_VISUAL.caption.en);
  const hasApprovedKpis = evidenceKpis.length > 0;
  const usingDummyKpi = !kpiSrc;
  const kpiLabel = usingDummyKpi
    ? thai
      ? META_KPI_VISUAL.label.th
      : META_KPI_VISUAL.label.en
    : cms.measure.visual.label.trim() || (thai ? META_KPI_VISUAL.label.th : META_KPI_VISUAL.label.en);
  const kpiCaption = usingDummyKpi
    ? thai
      ? META_KPI_VISUAL.caption.th
      : META_KPI_VISUAL.caption.en
    : cms.measure.visual.caption.trim() || (thai ? META_KPI_VISUAL.caption.th : META_KPI_VISUAL.caption.en);
  const inner = (
    <>
      <section className="kpi-hero kpi-home-hero-section kpi-meta-ads-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-meta-ads-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/meta-ads-management", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{fromCms && cms.hero.eyebrow.trim() ? cms.hero.eyebrow : t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {useSplitThaiTitle ? (
                  <>
                    <span className="kpi-home-h1-lead">ทำให้คนที่ใช่เห็นโรงแรมของคุณ</span>
                    <span className="kpi-home-h1-rest">
                      แล้วมีเหตุผลที่จะสอบถาม
                      <span className="kpi-home-h1-close">หรือจอง</span>
                    </span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
              {locale === "th" && heroLead === copy.th.lead ? (
                <p className="kpi-lead kpi-home-lead">
                  <span className="kpi-meta-ads-lead-line">
                    <span className="kpi-latin">Meta Ads</span> เริ่มจากเป้าหมายธุรกิจที่ชัด กลุ่มลูกค้าและครีเอทีฟต้องเข้ากับตลาดของโรงแรม
                  </span>
                  <span className="kpi-meta-ads-lead-line">
                    โฆษณาต้องพาไปหน้าโรงแรมหรือข้อเสนอที่เกี่ยวข้อง และเส้นทางสอบถามหรือจองตรงควรวัดผลได้{" "}
                    <span className="kpi-latin">The KPI Plus</span> ช่วยทบทวนและปรับเมื่อโรงแรมอนุมัติให้ใช้บริการ
                  </span>
                </p>
              ) : (
                <p className="kpi-lead kpi-home-lead">{heroLead}</p>
              )}
              <div className="kpi-actions">
                <a href={fromCms ? cms.hero.primaryCta.href || "#meta-ads-enquiry" : "#meta-ads-enquiry"} className="kpi-button">
                  {heroCta}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
                <Link href={fromCms ? localizePath(cms.hero.secondaryCta.href || "/solutions", locale) : solutions} className="kpi-button-ghost">
                  {heroSecondary}
                </Link>
              </div>
              <p className="kpi-meta-ads-hero-under">{heroUnder}</p>
              <p className="kpi-home-trust kpi-meta-ads-journey">
                {t.flow.map((step, index) => (
                  <span key={step}>
                    <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span> {step}
                  </span>
                ))}
              </p>
            </div>
            <div className="kpi-meta-ads-hero-visual">
              <MetaHeroVisual
                locale={locale}
                src={heroSrc}
                status={usingDummyHero ? "sample" : heroVisual.status || "sample"}
                alt={
                  usingDummyHero
                    ? thai
                      ? META_HERO_VISUAL.alt.th
                      : META_HERO_VISUAL.alt.en
                    : thai
                      ? heroVisual.altTh || META_HERO_VISUAL.alt.th
                      : heroVisual.altEn || META_HERO_VISUAL.alt.en
                }
                label={heroLabel}
                caption={heroCaption}
                meta={thai ? META_HERO_VISUAL.meta.th : META_HERO_VISUAL.meta.en}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-meta-ads-compare">
        <div className="kpi-meta-ads-compare-grid">
          <div className="kpi-meta-ads-compare-copy">
            <h2 className="kpi-h2">
              {useSplitThaiWhy ? (
                <>
                  <span className="kpi-meta-ads-compare-line">ลูกค้าอยู่บนแพลตฟอร์ม</span>
                  <span className="kpi-meta-ads-compare-br"> </span>
                  <span className="kpi-meta-ads-compare-line">แต่การเข้าถึงอย่างเดียวไม่พอ</span>
                </>
              ) : (
                visibilityTitle
              )}
            </h2>
            {useSplitThaiWhyBody ? (
              <p className="kpi-meta-ads-compare-lead">
                <span className="kpi-meta-ads-compare-lead-line">
                  ขนาดกลุ่มเป้าหมายโฆษณาของแพลตฟอร์มบอกได้แค่ว่าในประเทศมีคนที่โฆษณาเข้าถึงได้กว้างแค่ไหน ไม่ใช่จำนวนคนที่โรงแรมอาจเข้าถึงได้
                </span>
                <span className="kpi-meta-ads-compare-lead-line">
                  ไม่ใช่ยอดเห็นแคมเปญ และไม่ใช่จำนวนผู้เข้าชมเว็บหรือผลสอบถามหรือจอง โรงแรมยังต้องเลือกกลุ่มลูกค้าและความสนใจที่เข้ากับตลาด
                  แล้ววางครีเอทีฟกับหน้าปลายทางให้คนที่สนใจไปต่อได้
                </span>
              </p>
            ) : (
              <p className="kpi-meta-ads-compare-lead">{visibilityBody}</p>
            )}
          </div>
          <MetaAudienceVisual
            locale={locale}
            src={visibilitySrc}
            status={usingDummyAudience ? "sample" : visibilityVisual.status || "sample"}
            alt={
              usingDummyAudience
                ? thai
                  ? META_AUDIENCE_VISUAL.alt.th
                  : META_AUDIENCE_VISUAL.alt.en
                : thai
                  ? visibilityVisual.altTh || META_AUDIENCE_VISUAL.alt.th
                  : visibilityVisual.altEn || META_AUDIENCE_VISUAL.alt.en
            }
            label={visibilityLabel}
            caption={visibilityCaption}
            meta={thai ? META_AUDIENCE_VISUAL.meta.th : META_AUDIENCE_VISUAL.meta.en}
          />
          <div className="kpi-meta-ads-compare-insight">
            <MetaAudienceInsight
              locale={locale}
              stats={fromCms ? cms.visibility.stats : undefined}
              sourceLabel={fromCms ? cms.visibility.sourceLabel : undefined}
              sourceHref={fromCms ? cms.visibility.sourceHref : undefined}
            />
            {t.organicNote ? <p className="kpi-meta-ads-compare-organic">{t.organicNote}</p> : null}
            <p className="kpi-meta-ads-compare-note">{visibilityNote}</p>
            <p className="kpi-meta-ads-compare-source">
              <a href={fromCms && cms.visibility.sourceHref.trim() ? cms.visibility.sourceHref : dataReportalSource} target="_blank" rel="noreferrer">
                {thai ? "ที่มา: " : "Source: "}
                <span className="kpi-latin">{fromCms && cms.visibility.sourceLabel.trim() ? cms.visibility.sourceLabel : META_PLATFORM_AUDIENCE_SOURCE.label}</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-meta-ads-framework">
        <p className="kpi-latin kpi-meta-ads-readiness-kicker">Meta Ads Readiness Framework</p>
        <h2 className="kpi-h2">{frameworkTitle}</h2>
        <p className="kpi-meta-ads-readiness-lead">{frameworkLead}</p>
        <MetaFrameworkMatrix locale={locale} rows={frameworkRows} />
        <MetaFrameworkVisual
          locale={locale}
          src={frameworkSrc}
          rows={frameworkRows}
          status={frameworkSrc ? cms.readiness.visual.status || "sample" : "sample"}
          alt={thai ? META_READINESS_VISUAL.alt.th : META_READINESS_VISUAL.alt.en}
          label={thai ? META_READINESS_VISUAL.label.th : META_READINESS_VISUAL.label.en}
          caption={thai ? META_READINESS_VISUAL.caption.th : META_READINESS_VISUAL.caption.en}
          meta={thai ? META_READINESS_VISUAL.meta.th : META_READINESS_VISUAL.meta.en}
        />
        <a href="#meta-ads-enquiry" className="kpi-button kpi-meta-ads-framework-cta">
          {t.problemCta} <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-meta-ads-channels">
          <p className="kpi-latin kpi-meta-ads-channels-kicker-section">Objective-to-Booking Map</p>
          <h2 className="kpi-h2">{channelTitle}</h2>
          <p className="kpi-meta-ads-channels-lead">{t.channelLead}</p>
          <MetaScenarioMatrix locale={locale} rows={channelRows} />
          <MetaScenarioVisual
            locale={locale}
            src={channelSrc}
            rows={channelRows}
            status={usingDummyChannel ? "sample" : cms.channels.visual.status || "sample"}
            alt={
              usingDummyChannel
                ? thai
                  ? META_SCENARIO_VISUAL.alt.th
                  : META_SCENARIO_VISUAL.alt.en
                : thai
                  ? cms.channels.visual.altTh || META_SCENARIO_VISUAL.alt.th
                  : cms.channels.visual.altEn || META_SCENARIO_VISUAL.alt.en
            }
            label={channelLabel}
            caption={channelCaption}
            meta={thai ? META_SCENARIO_VISUAL.meta.th : META_SCENARIO_VISUAL.meta.en}
          />
          <MetaObjectiveBoundary locale={locale} />
        </div>
      </section>

      <section className="kpi-section kpi-meta-ads-method">
        <p className="kpi-latin kpi-meta-ads-workflow-kicker">Campaign Workflow</p>
        <h2 className="kpi-h2">
          {locale === "th" && workflowTitle === copy.th.methodTitle ? (
            <>
              <span className="kpi-meta-ads-method-line">ดูทั้งโฆษณาและการจอง</span>
              <span className="kpi-meta-ads-method-br"> </span>
              <span className="kpi-meta-ads-method-line">ไม่ดูแค่จำนวนคลิก</span>
            </>
          ) : (
            workflowTitle
          )}
        </h2>
        <p className="kpi-meta-ads-workflow-lead">{t.methodLead}</p>
        <MetaWorkflowSteps locale={locale} steps={workflowSteps} />
        <MetaWorkflowVisual
          locale={locale}
          src={workflowSrc}
          steps={workflowSteps}
          status={usingDummyWorkflow ? "sample" : cms.workflow.visual.status || "sample"}
          alt={
            usingDummyWorkflow
              ? thai
                ? META_WORKFLOW_VISUAL.alt.th
                : META_WORKFLOW_VISUAL.alt.en
              : thai
                ? cms.workflow.visual.altTh || META_WORKFLOW_VISUAL.alt.th
                : cms.workflow.visual.altEn || META_WORKFLOW_VISUAL.alt.en
          }
          label={workflowLabel}
          caption={workflowCaption}
          meta={thai ? META_WORKFLOW_VISUAL.meta.th : META_WORKFLOW_VISUAL.meta.en}
        />
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-meta-ads-creative">
          <p className="kpi-latin kpi-meta-ads-channels-kicker-section">Creative Matrix</p>
          <h2 className="kpi-h2">{creativeTitle}</h2>
          <p className="kpi-meta-ads-channels-lead">{creativeLead}</p>
          <MetaCreativeMatrix locale={locale} rows={creativeRows} />
        </div>
      </section>

      <section className="kpi-section kpi-meta-ads-measure">
        <p className="kpi-latin kpi-meta-ads-measure-sample">KPI and Tracking</p>
        <h2 className="kpi-h2">
          {fromCms && cms.measure.title.trim() && !/ตัวเลขที่สำคัญกว่าคลิก|What the guest does next|Search-to-Booking/.test(cms.measure.title)
            ? cms.measure.title
            : t.measureTitle}
        </h2>
        <p className="kpi-meta-ads-measure-lead">
          {fromCms && cms.measure.intro.trim() && !/คำค้นใดพาลูกค้า|which searches bring/.test(cms.measure.intro)
            ? cms.measure.intro
            : thai
              ? "แยกตัวชี้วัดแพลตฟอร์มกับผลธุรกิจ Reach Frequency Impressions CTR และการมีส่วนร่วมไม่ใช่ผลรายได้ แสดงตัวเลขเฉพาะสถานะ Approved, Anonymised หรือ Sample ที่ติดป้ายชัดเจน"
              : "Separate platform metrics from business metrics. Reach, Frequency, Impressions, CTR, and engagement are not a revenue result. Figures are shown only with Approved, Anonymised, or clearly labelled Sample status."}
        </p>
        {hasApprovedKpis ? <MetaKpiCards locale={locale} kpis={evidenceKpis} /> : <MetaKpiFramework locale={locale} />}
        {hasApprovedKpis && evidenceSeries.length ? (
          <MetaKpiChart locale={locale} series={evidenceSeries} />
        ) : (
          <MetaKpiVisual
            locale={locale}
            src={kpiSrc}
            status={usingDummyKpi ? "sample" : cms.measure.visual.status || "sample"}
            alt={
              usingDummyKpi
                ? thai
                  ? META_KPI_VISUAL.alt.th
                  : META_KPI_VISUAL.alt.en
                : thai
                  ? cms.measure.visual.altTh || META_KPI_VISUAL.alt.th
                  : cms.measure.visual.altEn || META_KPI_VISUAL.alt.en
            }
            label={kpiLabel}
            caption={kpiCaption}
            meta={thai ? META_KPI_VISUAL.meta.th : META_KPI_VISUAL.meta.en}
          />
        )}
        <p className="kpi-meta-ads-measure-close">{fromCms && cms.measure.close.trim() ? cms.measure.close : t.measureNote}</p>
        {cms.checklists?.tracking?.items?.length || cms.checklists?.events?.items?.length || cms.checklists?.landing?.items?.length ? (
          <div className="kpi-meta-ads-tracking">
            {cms.checklists.tracking?.items?.length ? (
              <article>
                <h3>{cms.checklists.tracking.title || "Tracking Boundary"}</h3>
                {cms.checklists.tracking.note ? <p>{cms.checklists.tracking.note}</p> : null}
                <ul>
                  {cms.checklists.tracking.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {cms.checklists.events?.items?.length ? (
              <article>
                <h3>{cms.checklists.events.title || "Supported events"}</h3>
                {cms.checklists.events.note ? <p>{cms.checklists.events.note}</p> : null}
                <ul>
                  {cms.checklists.events.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {cms.checklists.landing?.items?.length ? (
              <article>
                <h3>{cms.checklists.landing.title || "Landing Page"}</h3>
                {cms.checklists.landing.note ? <p>{cms.checklists.landing.note}</p> : null}
                <ul>
                  {cms.checklists.landing.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-meta-ads-hotel-scenario">
          <p className="kpi-latin kpi-meta-ads-channels-kicker-section">Hotel Scenario Matrix</p>
          <h2 className="kpi-h2">{hotelScenarioTitle}</h2>
          <p className="kpi-meta-ads-channels-lead">{t.relatedLead}</p>
          <MetaHotelScenarioMatrix locale={locale} rows={hotelScenarioRows} />
          <MetaHotelScenarioVisual
            locale={locale}
            src={scenarioSrc}
            rows={hotelScenarioRows}
            status={usingDummyHotelScenario ? "sample" : cms.scenario.visual.status || "sample"}
            alt={
              usingDummyHotelScenario
                ? thai
                  ? META_HOTEL_SCENARIO_VISUAL.alt.th
                  : META_HOTEL_SCENARIO_VISUAL.alt.en
                : thai
                  ? cms.scenario.visual.altTh || META_HOTEL_SCENARIO_VISUAL.alt.th
                  : cms.scenario.visual.altEn || META_HOTEL_SCENARIO_VISUAL.alt.en
            }
            label={hotelScenarioLabel}
            caption={hotelScenarioCaption}
            meta={thai ? META_HOTEL_SCENARIO_VISUAL.meta.th : META_HOTEL_SCENARIO_VISUAL.meta.en}
          />
        </div>
      </section>

      {relatedCards.length ? (
        <section className="border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section kpi-meta-ads-related">
            <p className="kpi-latin kpi-meta-ads-channels-kicker-section">Related Content</p>
            <h2 className="kpi-h2">{relatedReadingTitle}</h2>
            <p className="kpi-meta-ads-channels-lead">{t.relatedReadingLead}</p>
            <div className="kpi-meta-ads-related-layout">
              <MetaRelatedVisual
                locale={locale}
                src={relatedSrc}
                status={usingDummyRelated ? "sample" : cms.related.visual.status || "sample"}
                alt={
                  usingDummyRelated
                    ? thai
                      ? META_RELATED_VISUAL.alt.th
                      : META_RELATED_VISUAL.alt.en
                    : thai
                      ? cms.related.visual.altTh || META_RELATED_VISUAL.alt.th
                      : cms.related.visual.altEn || META_RELATED_VISUAL.alt.en
                }
                label={relatedLabel}
                caption={relatedCaption}
              />
              {featuredRelated ? <MetaRelatedCard key={featuredRelated.id} card={featuredRelated} locale={locale} featured /> : null}
              {supportingRelated.length ? (
                <div className="kpi-meta-ads-related-cards">
                  {supportingRelated.map((card) => (
                    <MetaRelatedCard key={card.id} card={card} locale={locale} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <MetaAdsEnquiry
        locale={locale}
        helper={cms.form}
        teamPhotoSrc={metaPublicTeamPhoto(fromCms ? cms.form.visual : undefined)}
      />
      <PageFaqs items={faqItems} locale={locale} sectionId="meta-ads-faq" />
      <MetaAdsStickyCta label={t.cta} />
    </>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/meta-ads-management", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}

function MetaRelatedCard({
  card,
  locale,
  featured = false,
}: {
  card: CmsMetaRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const dateLabel = relatedCardDateLabel(card, locale);
  const typeLabel = relatedCardTypeLabel(card);
  const meta = dateLabel || typeLabel ? "" : card.meta;
  const datetime = (card.updatedAt || card.publishedAt).trim();
  return (
    <Link href={card.href} className={`kpi-meta-ads-related-item${featured ? " is-featured" : ""}`}>
      {featured ? <span className="kpi-meta-ads-related-accent" aria-hidden="true" /> : null}
      {card.category ? <p className="kpi-meta-ads-related-kicker">{card.category}</p> : null}
      <h3>{card.title}</h3>
      {card.description ? <p>{card.description}</p> : null}
      {dateLabel || typeLabel || meta ? (
        <p className="kpi-meta-ads-related-meta">
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
          {dateLabel && typeLabel ? <span aria-hidden="true"> · </span> : null}
          {typeLabel ? <span>{typeLabel}</span> : null}
          {!dateLabel && !typeLabel && meta ? <span>{meta}</span> : null}
        </p>
      ) : null}
      <span className="kpi-meta-ads-related-cta">
        {card.cta} <ArrowUpRight aria-hidden="true" />
      </span>
    </Link>
  );
}

