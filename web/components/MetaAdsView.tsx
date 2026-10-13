import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { MetaAdsEnquiry } from "@/components/MetaAdsEnquiry";
import { MetaAdsStickyCta } from "@/components/MetaAdsStickyCta";
import { SiteShell } from "@/components/SiteShell";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const methodPhases = ["Share", "Review", "Plan"] as const;

const thaiMethodSteps = [
  {
    num: "01",
    title: "ส่งข้อมูลเบื้องต้น",
    lines: ["ชื่อโรงแรม ลิงก์เพจหรือเว็บไซต์", "และสิ่งที่อยากให้ทีมช่วย"],
  },
  {
    num: "02",
    title: "ทีมดูความพร้อม",
    lines: ["ตรวจเป้าหมาย ข้อเสนอ ภาพและวิดีโอ", "ช่องทางรับลูกค้า และข้อมูลที่ใช้วัดผล"],
  },
  {
    num: "03",
    title: "วางแผนร่วมกัน",
    lines: ["กำหนดแนวทางแคมเปญ", "สิ่งที่ต้องเตรียม", "และวิธีติดตามผลที่เหมาะกับโรงแรม"],
  },
] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Facebook และ Meta Ads",
    title: "ทำให้คนที่ใช่เห็นโรงแรมของคุณ แล้วมีเหตุผลที่จะสอบถามหรือจอง",
    lead: "โฆษณาที่ดีไม่จบแค่ยอดเห็นหรือยอดกดถูกใจ เดอะ เคพีไอ พลัส ช่วยโรงแรมวางแผน Meta Ads ตั้งแต่เลือกกลุ่มลูกค้า สื่อสารจุดเด่นและข้อเสนอ ไปจนถึงตรวจว่าหลังคลิกโฆษณาแล้วลูกค้าสอบถามหรือจองต่อได้สะดวกแค่ไหน",
    cta: "ให้ทีมประเมินแนวทาง Meta Ads",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรมและลิงก์เพจหรือเว็บไซต์ เพื่อเริ่มพูดคุยกับทีม",
    photoAlt: "นักเดินทางดูเนื้อหาโรงแรมบนสมาร์ทโฟนในบรรยากาศที่พัก",
    whyTitle: "ลูกค้าอยู่บนแพลตฟอร์ม แต่การเข้าถึงอย่างเดียวไม่พอ",
    facebookStat: "51.5 ล้าน",
    facebookLabel: "ขนาดกลุ่มเป้าหมายโฆษณา Facebook ในไทย",
    instagramStat: "20.6 ล้าน",
    instagramLabel: "ขนาดกลุ่มเป้าหมายโฆษณา Instagram ในไทย",
    whyBody:
      "ข้อมูล ณ ปลายปี 2025 แสดงให้เห็นโอกาสในการเข้าถึงผู้คนบนทั้งสองแพลตฟอร์ม แต่สิ่งที่โรงแรมต้องวางแผนต่อคือ จะให้ใครเห็นข้อเสนออะไร และหลังจากสนใจแล้วจะไปสอบถามหรือจองที่ไหน",
    source: "ที่มา: DataReportal Digital 2026 Thailand",
    note: "ตัวเลขเป็นข้อมูลการเข้าถึงโฆษณาจากเครื่องมือ Meta ผู้ใช้ Facebook และ Instagram อาจซ้ำกัน และตัวเลขนี้ไม่ใช่จำนวนผู้ที่จะจองโรงแรม",
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
    methodTitle: "เริ่มจากสถานการณ์จริงของโรงแรม",
    steps: [
      ["01", "ส่งข้อมูลเบื้องต้น", "ชื่อโรงแรม ลิงก์เพจหรือเว็บไซต์ และสิ่งที่อยากให้ทีมช่วย"],
      ["02", "ทีมดูความพร้อม", "ตรวจเป้าหมาย ข้อเสนอ ภาพและวิดีโอ ช่องทางรับลูกค้า และข้อมูลที่ใช้วัดผล"],
      ["03", "วางแผนร่วมกัน", "กำหนดแนวทางแคมเปญ สิ่งที่ต้องเตรียม และวิธีติดตามผลที่เหมาะกับโรงแรม"],
    ],
    measureTitle: "ดูมากกว่ายอด Reach และยอดกดถูกใจ",
    measureBody:
      "ตัวชี้วัดจะเลือกตามเป้าหมายและข้อมูลที่โรงแรมมี เช่น การเข้าชมหน้าโปรโมชัน จำนวนคำถามเกี่ยวกับการเข้าพัก คุณภาพของผู้สอบถาม และยอดจองที่ตรวจสอบแหล่งที่มาได้",
    measureNote:
      "หากต้องการวัดผลถึงขั้นการจอง ทีมจะตรวจความพร้อมของเว็บไซต์ ระบบจอง และการติดตามข้อมูลก่อนกำหนดวิธีรายงานร่วมกัน",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับการวัดผล เว็บไซต์ และการจองตรง",
    details: "ดูรายละเอียด",
    toolTitle: "ตรวจเว็บไซต์ก่อนเริ่มคุยเรื่องโฆษณา",
    toolName: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
    toolBody: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าจากโฆษณาหาข้อมูลและเดินทางไปสอบถามหรือจองต่อหรือไม่",
    toolCta: "ใช้เครื่องมือฟรี",
    conversionTitle: "เพิ่มการจองผ่านเว็บไซต์",
    conversionBody:
      "เมื่อโฆษณาพาคนมาแล้ว เส้นทางจากหน้าเว็บไปสู่การสอบถามหรือระบบจอง ต้องชัดพอให้ลูกค้าเดินต่อได้",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Facebook and Instagram ads for hotels",
    title: "Help the right people see your hotel, then give them a reason to enquire or book",
    lead: "A useful ad does more than collect views or likes. The KPI Plus helps hotels plan Meta Ads from the audience and the offer through to whether a guest can enquire or book after the click.",
    cta: "Ask the team to review a Meta Ads approach",
    secondary: "All solutions",
    underCta: "Send the hotel name and a page or website link to start the conversation.",
    photoAlt: "A traveller viewing hotel content on a smartphone in a hospitality setting",
    whyTitle: "Guests are on the platforms, but reach alone is not the plan",
    facebookStat: "51.5 million",
    facebookLabel: "Facebook advertising audience size in Thailand",
    instagramStat: "20.6 million",
    instagramLabel: "Instagram advertising audience size in Thailand",
    whyBody:
      "Late-2025 figures show the chance to reach people on both platforms. The hotel still has to decide who should see which offer, and where they go to enquire or book after they are interested.",
    source: "Source: DataReportal Digital 2026 Thailand",
    note: "These figures are Meta advertising-reach estimates. Facebook and Instagram users can overlap, and this is not the number of people who will book a hotel.",
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
    methodTitle: "Start from the hotel’s real situation",
    steps: [
      ["01", "Send a few basics", "The hotel name, a page or website link, and what you want the ads to help with."],
      ["02", "The team checks readiness", "Goals, offers, photos and video, how guests can reply, and the data you can use to review results."],
      ["03", "Plan together", "Agree the campaign direction, what to prepare, and a review method that fits the hotel’s systems."],
    ],
    measureTitle: "Look beyond reach and likes",
    measureBody:
      "Measures are chosen from the hotel’s goal and the data it already has, such as visits to a promotion page, stay enquiries, the quality of those enquiries, and bookings whose source can be checked.",
    measureNote:
      "If you want to review bookings, the team first checks the website, booking path, and tracking, then agrees how results will be reported.",
    relatedTitle: "Related reading on measurement, the website, and direct booking",
    details: "Read more",
    toolTitle: "Check the website before the ads conversation",
    toolName: "Hotel Searchability Check",
    toolBody: "See whether the page is ready for a guest from an ad to find details and continue to an enquiry or booking.",
    toolCta: "Use the free tool",
    conversionTitle: "Website Conversion",
    conversionBody: "After the ad, the enquiry and booking path still has to be clear enough to continue.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Facebook и Instagram Ads для отелей",
    title: "Пусть нужные люди увидят отель и поймут, зачем спрашивать или бронировать",
    lead: "Хорошая реклама не заканчивается просмотрами и лайками. The KPI Plus помогает отелю спланировать Meta Ads: кого показывать, что сказать про проживание и предложение, и сможет ли гость после клика удобно спросить или забронировать.",
    cta: "Попросить команду оценить подход к Meta Ads",
    secondary: "Все решения",
    underCta: "Отправьте название отеля и ссылку на страницу или сайт, чтобы начать разговор.",
    photoAlt: "Отель и команда, которая занимается проживанием и продажей номеров",
    whyTitle: "Гости уже на платформах, но одного охвата недостаточно",
    facebookStat: "51,5 млн",
    facebookLabel: "Размер рекламной аудитории Facebook в Таиланде",
    instagramStat: "20,6 млн",
    instagramLabel: "Размер рекламной аудитории Instagram в Таиланде",
    whyBody:
      "Данные конца 2025 года показывают возможность охвата на обеих платформах. Отелю всё равно нужно решить, кто должен увидеть какое предложение и куда гость пойдёт спрашивать или бронировать после интереса.",
    source: "Источник: DataReportal Digital 2026 Thailand",
    note: "Цифры — оценка рекламного охвата из инструментов Meta. Пользователи Facebook и Instagram могут пересекаться, и это не число людей, которые забронируют отель.",
    problemTitle: "Реклама уже идёт. Понятно ли, что гость делает дальше?",
    problems: [
      "Люди видят рекламу, но неясно, сколько потом спрашивают или бронируют",
      "Одна и та же картинка и текст идут всем группам гостей",
      "На часть дат ещё есть номера, но предложение не доходит до подходящих людей",
      "После клика сложно найти описание номера, цену или способ связаться",
      "У тех, кто уже проявил интерес, нет понятного плана повторного контакта",
    ],
    problemClose: "Если знакома хотя бы одна ситуация, команда поможет понять, с чего начать.",
    problemCta: "Попросить команду посмотреть ситуацию отеля",
    helpTitle: "Связать рекламу с тем, что отелю нужно продать",
    help: [
      ["01", "Цель и аудитория", "Понять, нужно ли больше узнаваемости, больше вопросов про номера или более ясный путь к бронированию, и подобрать рекламу под эту цель."],
      ["02", "Сильные стороны и предложение", "Соединить локацию, номера, опыт проживания и даты, которые нужно продать, с подходящими изображением, текстом и аудиторией."],
      ["03", "Путь после клика", "Проверить, доходит ли гость из рекламы до описания номера, чата или бронирования, и отметить, что стоит поправить вместе с командой отеля."],
      ["04", "Разбор результата и следующий шаг", "Смотреть результат рекламы вместе с качеством вопросов и бронями, которые можно проверить, затем выбрать, что делать дальше."],
    ],
    methodTitle: "Начинаем с реальной ситуации отеля",
    steps: [
      ["01", "Пришлите базовые данные", "Название отеля, ссылку на страницу или сайт и то, чем должна помочь реклама."],
      ["02", "Команда смотрит готовность", "Цели, предложение, фото и видео, как гости могут ответить, и какие данные можно использовать для разбора."],
      ["03", "Планируем вместе", "Согласуем направление кампании, что подготовить и как отслеживать результат в системах отеля."],
    ],
    measureTitle: "Смотреть шире, чем охват и лайки",
    measureBody:
      "Показатели выбираются по цели отеля и данным, которые уже есть: визиты на страницу предложения, вопросы про проживание, качество этих вопросов и брони, чей источник можно проверить.",
    measureNote:
      "Если нужно смотреть до брони, команда сначала проверит сайт, путь бронирования и отслеживание, затем согласует, как отчитываться о результате.",
    relatedTitle: "Материалы про измерение, сайт и прямое бронирование",
    details: "Подробнее",
    toolTitle: "Проверьте сайт до разговора о рекламе",
    toolName: "Проверка поисковой готовности сайта отеля",
    toolBody: "Понять, сможет ли гость из рекламы найти информацию и перейти к вопросу или бронированию.",
    toolCta: "Использовать бесплатный инструмент",
    conversionTitle: "Website Conversion",
    conversionBody: "После рекламы путь к вопросу и бронированию на сайте всё равно должен быть достаточно понятным.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "飯店的 Facebook 與 Instagram 廣告",
    title: "讓對的人看到你的飯店，並有理由詢問或預訂",
    lead: "好的廣告不會停在曝光或按讚。The KPI Plus 協助飯店規劃 Meta Ads：該給誰看、如何說明住宿亮點與方案，以及點擊之後，客人能否順利詢問或預訂。",
    cta: "請團隊評估 Meta Ads 做法",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱，以及粉絲專頁或網站連結，即可開始與團隊討論。",
    photoAlt: "飯店與團隊處理入住與客房銷售",
    whyTitle: "客人已在這些平台上，但只有觸及還不夠",
    facebookStat: "5,150 萬",
    facebookLabel: "泰國 Facebook 廣告目標對象規模",
    instagramStat: "2,060 萬",
    instagramLabel: "泰國 Instagram 廣告目標對象規模",
    whyBody:
      "2025 年底的資料顯示兩個平台都有觸及機會。飯店仍須決定：該讓誰看到什麼方案，以及對方有興趣之後，要去哪裡詢問或預訂。",
    source: "來源：DataReportal Digital 2026 Thailand",
    note: "數字來自 Meta 廣告工具的觸及估計。Facebook 與 Instagram 使用者可能重複，這也不是會預訂飯店的人數。",
    problemTitle: "也許已經在投廣告，但知不知道客人接下來怎麼走？",
    problems: [
      "有人看到廣告，卻不清楚之後有多少人詢問或預訂",
      "對每個客群都用同一組圖片和文字",
      "某些日期還有空房，方案卻還沒到適合的人面前",
      "點擊之後找不到房型、價格或聯絡方式",
      "曾經表示興趣的人，還沒有合適的後續追蹤計畫",
    ],
    problemClose: "如果以上任一情況很熟悉，團隊可以一起看該先從哪裡調整。",
    problemCta: "請團隊先看飯店的現況",
    helpTitle: "把廣告接到飯店真正要賣的目標",
    help: [
      ["01", "訂目標與客群", "先看飯店要提高認識、增加客房詢問，還是讓人更容易走進預訂通路，再讓廣告做法對應該目標。"],
      ["02", "說明亮點與方案", "把地點、客房、住宿體驗，以及需要銷售的日期，配上合適的圖片、文字與客群。"],
      ["03", "檢查點擊後的路徑", "看廣告來的客人能否順利找到房型、聊天管道或預訂系統，並與飯店團隊一起標出該調整的地方。"],
      ["04", "檢視結果再調整", "把廣告結果，連同可檢查的詢問品質與預訂資料一起看，再決定下一步。"],
    ],
    methodTitle: "從飯店的真實情況開始",
    steps: [
      ["01", "先提供基本資料", "飯店名稱、粉絲專頁或網站連結，以及希望廣告幫忙的事情。"],
      ["02", "團隊檢查準備程度", "看目標、方案、照片與影片、接待客人的管道，以及能用來檢視結果的資料。"],
      ["03", "一起規劃", "確認活動方向、需要準備的內容，以及適合飯店現有系統的追蹤方式。"],
    ],
    measureTitle: "看的不只是觸及和按讚",
    measureBody:
      "指標會依飯店目標與既有資料來選，例如促銷頁瀏覽、住宿相關詢問、詢問者的品質，以及能核對來源的預訂。",
    measureNote:
      "若要追到預訂，團隊會先檢查網站、預訂路徑與追蹤設定，再一起決定如何回報結果。",
    relatedTitle: "與成效、網站與直銷預訂相關的內容",
    details: "查看詳情",
    toolTitle: "談廣告前，先檢查網站",
    toolName: "飯店網站搜尋健康檢查",
    toolBody: "看從廣告進來的客人，是否找得到資料，並能繼續詢問或預訂。",
    toolCta: "使用免費工具",
    conversionTitle: "Website Conversion",
    conversionBody: "廣告把人帶來之後，網站上的詢問與預訂路徑仍須清楚到走得下去。",
  },
} as const;

export function MetaAdsView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const featuredInsight = insightPosts.find(
    (post) => post.href === "/insights/direct-booking-journey-audit" && existingHref(post.href, locale),
  );
  const seoInsight = insightPosts.find(
    (post) =>
      post.href === "/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on" &&
      existingHref(post.href, locale),
  );
  const conversionHref = localizePath("/solutions/hotel-direct-bookings", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/meta-ads-management", locale)}>
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
              <p className="kpi-home-eyebrow kpi-latin">Social Demand &amp; Direct Response</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">ทำให้คนที่ใช่เห็นโรงแรมของคุณ</span>
                    <span className="kpi-home-h1-rest">แล้วมีเหตุผลที่จะ</span>
                    <span className="kpi-home-h1-close kpi-home-accent">สอบถามหรือจอง</span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              {locale === "th" ? (
                <p className="kpi-lead kpi-home-lead">
                  <span className="kpi-meta-ads-lead-line">
                    <span className="kpi-latin">Meta Ads</span> ไม่ควรวัดแค่ยอดเห็น หรือยอดกดถูกใจ
                  </span>
                  <span className="kpi-meta-ads-lead-line">
                    เราวางตั้งแต่กลุ่มลูกค้า คอนเทนต์ และข้อเสนอ ไปจนถึงเส้นทางหลังคลิก เพื่อให้ความสนใจมีโอกาสกลายเป็น การสอบถามหรือยอดจอง
                  </span>
                </p>
              ) : (
                <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              )}
              <div className="kpi-actions">
                <a href="#meta-ads-enquiry" className="kpi-button">
                  {locale === "th" ? (
                    <>
                      ดูโอกาสเพิ่ม <span className="kpi-latin">Enquiry</span> และ <span className="kpi-latin">Booking</span>
                    </>
                  ) : (
                    t.cta
                  )}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
                <Link href={solutions} className="kpi-button-ghost">
                  {t.secondary}
                </Link>
              </div>
              <p className="kpi-meta-ads-hero-note">
                {locale === "th" ? (
                  <>
                    ส่งชื่อโรงแรม เว็บไซต์หรือเพจ
                    <span className="kpi-meta-ads-hero-note-br"> </span>
                    เพื่อให้ทีมดูจุดเริ่มต้น
                  </>
                ) : (
                  t.underCta
                )}
              </p>
              <p className="kpi-home-trust kpi-meta-ads-journey">
                {(locale === "th"
                  ? (["กลุ่มลูกค้า", "คอนเทนต์", "หน้าเว็บ / แชต", "Enquiry", "Booking"] as const)
                  : (["Audience", "Content", "Page / Chat", "Enquiry", "Booking"] as const)
                ).map((step, index) => (
                  <span key={step}>
                    <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>{" "}
                    {step === "Enquiry" || step === "Booking" ? <span className="kpi-latin">{step}</span> : step}
                  </span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <img src="/media/meta-ads-hero-phone.jpg" alt={t.photoAlt} width={1200} height={900} />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-meta-ads-audience">
        <div className="kpi-meta-ads-audience-grid">
          <div className="kpi-meta-ads-audience-copy">
            <h2 className="kpi-h2">
              {locale === "th" ? (
                <>
                  <span className="kpi-meta-ads-audience-line">ลูกค้าอยู่บนแพลตฟอร์ม</span>
                  <span className="kpi-meta-ads-audience-br"> </span>
                  <span className="kpi-meta-ads-audience-line">
                    แต่<span className="kpi-meta-ads-audience-em">การเข้าถึงอย่างเดียวไม่พอ</span>
                  </span>
                </>
              ) : (
                t.whyTitle
              )}
            </h2>
            <div className="kpi-meta-ads-audience-stats">
              <article>
                <p className="kpi-meta-ads-audience-platform">
                  <img src="/brand/meta/facebook.svg" alt="" width={22} height={22} />
                  <span className="kpi-latin">Facebook</span>
                </p>
                <p className="kpi-meta-ads-audience-number kpi-latin">
                  {locale === "th" ? (
                    <>
                      51.5 <span>ล้าน</span>
                    </>
                  ) : (
                    t.facebookStat
                  )}
                </p>
                <p className="kpi-meta-ads-audience-label">
                  {locale === "th" ? "ขนาดกลุ่มเป้าหมายโฆษณาในไทย" : t.facebookLabel}
                </p>
              </article>
              <article>
                <p className="kpi-meta-ads-audience-platform">
                  <img src="/brand/meta/instagram.svg" alt="" width={22} height={22} />
                  <span className="kpi-latin">Instagram</span>
                </p>
                <p className="kpi-meta-ads-audience-number kpi-latin">
                  {locale === "th" ? (
                    <>
                      20.6 <span>ล้าน</span>
                    </>
                  ) : (
                    t.instagramStat
                  )}
                </p>
                <p className="kpi-meta-ads-audience-label">
                  {locale === "th" ? "ขนาดกลุ่มเป้าหมายโฆษณาในไทย" : t.instagramLabel}
                </p>
              </article>
            </div>
            {locale === "th" ? (
              <div className="kpi-meta-ads-audience-body">
                <p>
                  <span className="kpi-latin">Reach</span> บอกได้ว่ามีโอกาสเข้าถึงคนมากแค่ไหน
                </p>
                <p className="kpi-meta-ads-audience-body-strong">
                  แต่ผลลัพธ์จริงอยู่ที่ว่า คนที่เห็นแล้วสนใจ คลิก{" "}
                  <span className="kpi-meta-ads-audience-em">สอบถาม หรือจองต่อ</span> หรือไม่
                </p>
              </div>
            ) : (
              <p className="kpi-meta-ads-audience-body">{t.whyBody}</p>
            )}
            <p className="kpi-meta-ads-audience-source">
              <a href="https://datareportal.com/reports/digital-2026-thailand" target="_blank" rel="noreferrer">
                <span className="kpi-latin">Source: DataReportal Digital 2026 Thailand</span>
              </a>
            </p>
            <p className="kpi-meta-ads-audience-note">{t.note}</p>
          </div>
          <figure className="kpi-meta-ads-audience-photo">
            <img
              src="/media/meta-ads-audience-phone.jpg"
              alt={
                locale === "th"
                  ? "นักเดินทางดูเนื้อหาโรงแรมบนสมาร์ทโฟนในบรรยากาศที่พัก"
                  : t.photoAlt
              }
              width={1200}
              height={900}
            />
          </figure>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-meta-ads-problems">
          <h2 className="kpi-h2">
            {locale === "th" ? (
              <>
                <span className="kpi-meta-ads-problem-line">ลงโฆษณาอยู่แล้ว</span>
                <span className="kpi-meta-ads-problem-br"> </span>
                <span className="kpi-meta-ads-problem-line">
                  แต่รู้หรือไม่ว่า<span className="kpi-meta-ads-problem-em">ลูกค้าไปต่ออย่างไร?</span>
                </span>
              </>
            ) : (
              t.problemTitle
            )}
          </h2>
          <ol className="kpi-meta-ads-problems-list">
            {locale === "th" ? (
              <>
                <li>
                  <span className="kpi-latin">01</span>
                  <p>
                    มีคนเห็นโฆษณา
                    <span className="kpi-meta-ads-problem-br"> </span>
                    แต่ยังไม่รู้ว่า<span className="kpi-meta-ads-problem-em">กี่คนสอบถามหรือจองต่อ</span>
                  </p>
                </li>
                <li>
                  <span className="kpi-latin">02</span>
                  <p>
                    ใช้ภาพและข้อความแบบเดียว
                    <span className="kpi-meta-ads-problem-br"> </span>
                    กับ<span className="kpi-meta-ads-problem-em">ลูกค้าทุกกลุ่ม</span>
                  </p>
                </li>
                <li>
                  <span className="kpi-latin">03</span>
                  <p>
                    มีห้องว่างบางช่วง
                    <span className="kpi-meta-ads-problem-br"> </span>
                    แต่ข้อเสนอ<span className="kpi-meta-ads-problem-em">ยังไปไม่ถึงกลุ่มที่เหมาะสม</span>
                  </p>
                </li>
                <li>
                  <span className="kpi-latin">04</span>
                  <p>
                    คนคลิกแล้ว
                    <span className="kpi-meta-ads-problem-br"> </span>
                    แต่หาข้อมูล ราคา หรือ<span className="kpi-meta-ads-problem-em">ช่องทางติดต่อไม่เจอ</span>
                  </p>
                </li>
                <li>
                  <span className="kpi-latin">05</span>
                  <p>
                    คนเคยสนใจโรงแรมแล้ว
                    <span className="kpi-meta-ads-problem-br"> </span>
                    แต่ยังไม่มี<span className="kpi-meta-ads-problem-em">แผนติดตามที่เหมาะสม</span>
                  </p>
                </li>
              </>
            ) : (
              t.problems.map((problem, index) => (
                <li key={problem}>
                  <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                  <p>{problem}</p>
                </li>
              ))
            )}
          </ol>
          {locale === "th" ? (
            <p className="kpi-meta-ads-problem-close">
              <span>การเห็นโฆษณาเป็นเพียงจุดเริ่มต้น</span>
              <span className="kpi-meta-ads-problem-close-strong">
                สิ่งสำคัญคือรู้ว่า <span className="kpi-meta-ads-problem-em">ลูกค้าเดินต่อไปถึงไหน</span>
              </span>
            </p>
          ) : (
            <p className="kpi-meta-ads-problem-close">{t.problemClose}</p>
          )}
          <a href="#meta-ads-enquiry" className="kpi-button">
            {locale === "th" ? (
              <>
                ให้ทีมดูเส้นทางลูกค้าจาก <span className="kpi-latin">Meta Ads</span>
              </>
            ) : (
              t.problemCta
            )}{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="kpi-section kpi-meta-ads-help">
        <h2 className="kpi-h2">
          {locale === "th" ? (
            <>
              เชื่อมโฆษณากับ<span className="kpi-meta-ads-help-em">เป้าหมายการขาย</span>ของโรงแรม
            </>
          ) : (
            t.helpTitle
          )}
        </h2>
        <ol className="kpi-meta-ads-help-steps">
          {locale === "th" ? (
            <>
              <li>
                <span className="kpi-latin kpi-meta-ads-help-num">01</span>
                <h3>
                  วาง<span className="kpi-meta-ads-help-em">เป้าหมายและกลุ่มลูกค้า</span>
                </h3>
                <p>
                  ดูว่าโรงแรมต้องการเพิ่มการรับรู้
                  <span className="kpi-meta-ads-help-br"> </span>
                  เติมยอดในช่วงไหน
                  <span className="kpi-meta-ads-help-br"> </span>
                  หรือพาลูกค้าเข้าสู่ช่องทางจอง
                </p>
              </li>
              <li>
                <span className="kpi-latin kpi-meta-ads-help-num">02</span>
                <h3>
                  สื่อสาร<span className="kpi-meta-ads-help-em">จุดเด่นและข้อเสนอ</span>
                </h3>
                <p>
                  นำห้องพัก ประสบการณ์
                  <span className="kpi-meta-ads-help-br"> </span>
                  และช่วงเวลาที่ต้องการขาย
                  <span className="kpi-meta-ads-help-br"> </span>
                  มาจับคู่กับข้อความและกลุ่มลูกค้าที่เหมาะสม
                </p>
              </li>
              <li>
                <span className="kpi-latin kpi-meta-ads-help-num">03</span>
                <h3>
                  ตรวจ<span className="kpi-meta-ads-help-em">เส้นทางหลังคลิก</span>
                </h3>
                <p>
                  ดูว่าหลังจากเห็นโฆษณา
                  <span className="kpi-meta-ads-help-br"> </span>
                  ลูกค้าไปต่อที่เว็บไซต์ แชต
                  <span className="kpi-meta-ads-help-br"> </span>
                  หรือระบบจองได้สะดวกแค่ไหน
                </p>
              </li>
              <li>
                <span className="kpi-latin kpi-meta-ads-help-num">04</span>
                <h3>ทบทวนผลและปรับแผน</h3>
                <p>
                  ดูทั้งผลโฆษณา คุณภาพคำถาม
                  <span className="kpi-meta-ads-help-br"> </span>
                  และ<span className="kpi-meta-ads-help-em">ยอดจองที่ตรวจสอบได้</span>
                  <span className="kpi-meta-ads-help-br"> </span>
                  เพื่อเลือกสิ่งที่ควรทำต่อ
                </p>
              </li>
            </>
          ) : (
            t.help.map(([num, title, body]) => (
              <li key={num}>
                <span className="kpi-latin kpi-meta-ads-help-num">{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))
          )}
        </ol>
        <a href="#meta-ads-enquiry" className="kpi-button">
          {locale === "th" ? (
            <>
              ให้ทีมประเมินแนวทาง <span className="kpi-latin">Meta Ads</span>
            </>
          ) : (
            t.cta
          )}{" "}
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="kpi-meta-ads-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-latin kpi-meta-ads-method-eyebrow">How we start</p>
          <h2 className="kpi-h2">{t.methodTitle}</h2>
          <ol className="kpi-meta-ads-method-list">
            {locale === "th"
              ? thaiMethodSteps.map((step, index) => (
                  <li key={step.num} className="kpi-meta-ads-method-step">
                    <span className="kpi-latin kpi-meta-ads-method-num">{step.num}</span>
                    <div className="kpi-meta-ads-method-copy">
                      <p className="kpi-latin kpi-meta-ads-method-phase">
                        {step.num} / {methodPhases[index]}
                      </p>
                      <h3>{step.title}</h3>
                      <p className="kpi-meta-ads-method-body">
                        {step.lines.map((line, lineIndex) => (
                          <span key={line}>
                            {lineIndex > 0 ? <span className="kpi-meta-ads-method-br"> </span> : null}
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                ))
              : t.steps.map(([num, title, body], index) => (
                  <li key={num} className="kpi-meta-ads-method-step">
                    <span className="kpi-latin kpi-meta-ads-method-num">{num}</span>
                    <div className="kpi-meta-ads-method-copy">
                      <p className="kpi-latin kpi-meta-ads-method-phase">
                        {num} / {methodPhases[index]}
                      </p>
                      <h3>{title}</h3>
                      <p className="kpi-meta-ads-method-body">{body}</p>
                    </div>
                  </li>
                ))}
          </ol>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-lead mt-5">{t.measureBody}</p>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#555555]">{t.measureNote}</p>
      </section>

      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-meta-ads-related">
          <h2 className="kpi-h2">
            {locale === "th" ? (
              <>
                <span className="kpi-meta-ads-related-line">เรื่องที่เกี่ยวข้องกับการวัดผล</span>
                <span className="kpi-meta-ads-related-br"> </span>
                <span className="kpi-meta-ads-related-line">เว็บไซต์ และการจองตรง</span>
              </>
            ) : (
              t.relatedTitle
            )}
          </h2>
          <div className="kpi-meta-ads-related-layout">
            {featuredInsight ? (
              <article className="kpi-meta-ads-related-featured">
                <span className="kpi-meta-ads-related-accent" aria-hidden="true" />
                <p className="kpi-meta-ads-related-kicker">{featuredInsight.category[locale]}</p>
                <h3>
                  {locale === "th" ? (
                    <>
                      วิเคราะห์เส้นทาง <span className="kpi-latin">Direct Booking</span> ของโรงแรม
                    </>
                  ) : (
                    featuredInsight.title[locale]
                  )}
                </h3>
                <Link
                  href={existingHref(featuredInsight.href, locale) ?? featuredInsight.href}
                  className="kpi-meta-ads-related-cta"
                >
                  {insightsUi.read} <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            ) : null}
            <div className="kpi-meta-ads-related-stack">
              {seoInsight ? (
                <article>
                  <p className="kpi-meta-ads-related-kicker">
                    {locale === "th" ? (
                      <>
                        <span className="kpi-latin">SEO</span> และ <span className="kpi-latin">LOCAL SEARCH</span>
                      </>
                    ) : (
                      seoInsight.category[locale]
                    )}
                  </p>
                  <h3>
                    {locale === "th" ? (
                      <>
                        <span className="kpi-latin">SEO vs SEM</span> สำหรับโรงแรม:
                        <span className="kpi-meta-ads-related-br"> </span>
                        ควรเริ่มจากอะไรและเลือกอย่างไร?
                      </>
                    ) : (
                      seoInsight.title[locale]
                    )}
                  </h3>
                  <Link
                    href={existingHref(seoInsight.href, locale) ?? seoInsight.href}
                    className="kpi-meta-ads-related-cta"
                  >
                    {insightsUi.read} <ArrowUpRight aria-hidden="true" />
                  </Link>
                </article>
              ) : null}
              <article>
                <h3>{t.toolName}</h3>
                <p>
                  {locale === "th" ? (
                    <>
                      ดูว่าหน้าเว็บพร้อมให้ลูกค้าจากโฆษณา
                      <span className="kpi-meta-ads-related-br"> </span>
                      หาข้อมูลและเดินทางไปสอบถามหรือจองต่อหรือไม่
                    </>
                  ) : (
                    t.toolBody
                  )}
                </p>
                <Link href="/tools/hotel-searchability-check" className="kpi-meta-ads-related-cta">
                  {t.toolCta} <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
              <article>
                <h3>{t.conversionTitle}</h3>
                <p>
                  {locale === "th" ? (
                    <>
                      เมื่อโฆษณาพาคนมาแล้ว
                      <span className="kpi-meta-ads-related-br"> </span>
                      เส้นทางจากหน้าเว็บไปสู่การสอบถามหรือระบบจอง
                      <span className="kpi-meta-ads-related-br"> </span>
                      ต้องชัดพอให้ลูกค้าเดินต่อได้
                    </>
                  ) : (
                    t.conversionBody
                  )}
                </p>
                <Link href={conversionHref} className="kpi-meta-ads-related-cta">
                  {t.details} <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <MetaAdsEnquiry locale={locale} />
      <MetaAdsStickyCta label={t.cta} />
    </SiteShell>
  );
}
