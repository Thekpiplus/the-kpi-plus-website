import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { B2bEnquiry } from "@/components/B2bEnquiry";
import { B2bStickyCta } from "@/components/B2bStickyCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "การขายผ่านเอเจนต์และคู่ค้า",
    title: "หาพาร์ตเนอร์ที่เหมาะกับโรงแรม ไม่ใช่เพิ่มรายชื่อเอเยนต์ให้มากที่สุด",
    lead: "Agent, Wholesaler และพาร์ตเนอร์ B2B อาจช่วยให้โรงแรมเข้าถึงตลาดใหม่หรือเติมยอดขายในช่วงที่ต้องการได้ แต่ช่องทางนี้มาพร้อมงานเรื่องราคา สัญญา ห้องพักที่กันไว้ เงื่อนไขการจอง และการติดตามผล",
    leadClose:
      "เดอะ เคพีไอ พลัส เริ่มจากประเมินว่า B2B เหมาะกับโรงแรมของคุณหรือไม่ หากเหมาะ เราช่วยคัดเลือกและประสานพาร์ตเนอร์จากเครือข่ายที่มีอยู่ รวมถึงช่วยวางเงื่อนไขการขายและดูว่าความร่วมมือนั้นสร้างรายได้ให้โรงแรมจริงหรือเปล่า",
    fit: "บริการนี้เหมาะเป็นพิเศษกับโรงแรมขนาดกลางถึงขนาดใหญ่ ที่มีจำนวนห้องและทีมรองรับการขายผ่านพาร์ตเนอร์หลายราย",
    cta: "ให้ทีมประเมินช่องทาง B2B ของโรงแรม",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม จำนวนห้อง และสถานะพาร์ตเนอร์ปัจจุบัน",
    photoAlt: "ทีมโรงแรมทบทวนช่องทางขายและพาร์ตเนอร์ B2B",
    shouldTitle: "โรงแรมของคุณควรเพิ่มช่องทาง B2B ไหม?",
    shouldBody:
      "ก่อนแนะนำเอเยนต์รายใหม่ เราดูว่าโรงแรมต้องการลูกค้าจากตลาดใด มีห้องว่างในช่วงไหน ราคาปัจจุบันเป็นอย่างไร และทีมสามารถดูแลการจองและเงื่อนไขของพาร์ตเนอร์ได้แค่ไหน",
    shouldClose:
      "บางโรงแรมอาจได้ประโยชน์จาก B2B ขณะที่บางแห่งควรปรับราคา OTA หรือการจองตรงให้แข็งแรงก่อน เราเสนอช่องทางตามสถานการณ์ของโรงแรม ไม่ใช่เสนอพาร์ตเนอร์เพียงเพราะมีรายชื่ออยู่ในมือ",
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยอะไร?",
    help: [
      ["01", "ประเมินตลาดและความเหมาะสม", "ดูขนาดโรงแรม กลุ่มลูกค้า ฤดูกาล ห้องว่าง และช่องทางขายที่มีอยู่ เพื่อประเมินว่าพาร์ตเนอร์ประเภทใดมีโอกาสช่วยเติมยอดขายโดยไม่กระทบช่องทางอื่นเกินความจำเป็น"],
      ["02", "คัดเลือกและประสานพาร์ตเนอร์", "ค้นหาพาร์ตเนอร์ที่เกี่ยวข้องจากเครือข่ายของเรา และพิจารณาว่าแต่ละรายเข้าถึงตลาดหรือลูกค้าประเภทใด ก่อนเริ่มพูดคุยเรื่องความร่วมมือกับโรงแรม"],
      ["03", "ช่วยวางราคาและเงื่อนไขการขาย", "ทบทวนราคา ช่วงเวลาที่เปิดขาย ห้องพักที่จัดสรร เงื่อนไขการยกเลิก การชำระเงิน และการส่งคืนห้องที่กันไว้ เพื่อให้โรงแรมเข้าใจสิ่งที่ตกลงก่อนเริ่มขาย"],
      ["04", "ประสานสัญญาและการเริ่มขาย", "ช่วยรวบรวมข้อมูลสินค้า ประสานเงื่อนไขกับพาร์ตเนอร์ และเตรียมงานที่ต้องใช้ในการเริ่มขาย โดยโรงแรมเป็นผู้พิจารณาและอนุมัติข้อตกลงก่อนลงนาม"],
      ["05", "ติดตามว่าพาร์ตเนอร์สร้างยอดขายจริงไหม", "ดูจำนวนคืนห้องพัก รายได้ ช่วงวันที่จอง ตลาดต้นทาง และการใช้ห้องที่จัดสรรไว้ เพื่อทบทวนว่าควรขยาย ปรับเงื่อนไข หรือหยุดความร่วมมือรายใด"],
    ],
    existingTitle: "มีพาร์ตเนอร์อยู่แล้ว แต่ยังไม่เห็นผลชัด?",
    existing: [
      "มีสัญญาหลายฉบับ แต่ไม่ชัดว่ารายใดส่งยอดขายจริง",
      "กันห้องไว้ให้พาร์ตเนอร์ แต่ห้องไม่ได้ถูกขายตามที่คาด",
      "ราคาและเงื่อนไขของแต่ละรายไม่สอดคล้องกัน",
      "ขาดการอัปเดตสินค้าและการติดตามกับเอเยนต์",
      "ไม่ได้นำยอดขาย B2B ไปพิจารณาร่วมกับ OTA และการจองตรง",
    ],
    methodTitle: "วิธีทำงาน",
    steps: [
      ["01", "ดูภาพรวมโรงแรม", "จำนวนห้อง ตลาดหลัก ฤดูกาล ราคา และช่องทางขายปัจจุบัน"],
      ["02", "ประเมินโอกาส B2B", "ระบุตลาดหรือช่วงวันที่พาร์ตเนอร์อาจช่วยได้ พร้อมข้อจำกัดที่ต้องจัดการ"],
      ["03", "คัดเลือกและเริ่มพูดคุย", "ประสานพาร์ตเนอร์ที่เหมาะสมจากเครือข่าย และทบทวนราคาและเงื่อนไขร่วมกับโรงแรม"],
      ["04", "เริ่มขายและติดตามผล", "ดูยอดจอง การใช้ห้องที่จัดสรร และผลต่อรายได้และช่องทางขายอื่น"],
      ["05", "ปรับความร่วมมือ", "ตัดสินใจจากผลงานจริงว่าควรทำต่อ เปลี่ยนเงื่อนไข หรือจัดลำดับพาร์ตเนอร์ใหม่"],
    ],
    measureTitle: "เราวัดผลอะไร?",
    measureBody: "เราไม่ได้ดูเพียงจำนวนพาร์ตเนอร์ที่เซ็นสัญญา แต่ดูจำนวนคืนห้องพัก รายได้ และผลงานของแต่ละราย เทียบกับเงื่อนไขที่ตกลงไว้",
    measureClose:
      "เมื่อโรงแรมมีข้อมูลเพียงพอ ทีมจะพิจารณาต่อถึงช่วงเวลาจอง ตลาดต้นทาง การใช้ห้องที่จัดสรร และรายได้หลังต้นทุน เพื่อดูว่า B2B มีบทบาทที่เหมาะสมในภาพรวมของ OTA การจองตรง และช่องทางขายอื่นหรือไม่",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับช่องทางขายและแผนรายได้",
    details: "ดูรายละเอียด",
    toolName: "เครื่องคำนวณ Budget โรงแรม",
    toolBody: "ดูแผนรายได้และค่าใช้จ่ายของโรงแรมก่อนคุยเรื่องช่องทางขายเพิ่ม ไม่ใช่เครื่องคำนวณต้นทุนสัญญา B2B",
    toolCta: "ใช้เครื่องมือฟรี",
    revenueTitle: "บริหารรายได้และกลยุทธ์การขาย",
    revenueBody: "B2B ต้องดูร่วมกับราคา OTA และการจองตรง ไม่ใช่เพิ่มช่องทางโดยไม่ดูภาพรวมรายได้",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "B2B & Agent Sales",
    title: "Find partners that fit the hotel, not the longest agent list",
    lead: "Agents, wholesalers, and B2B partners can help a hotel reach a new market or fill dates that need sales. The channel also brings rate work, contracts, held rooms, booking conditions, and follow-up.",
    leadClose:
      "The KPI Plus starts by asking whether B2B fits this hotel. If it does, we help choose and introduce partners from the current network, set the selling conditions, and review whether the relationship actually creates hotel revenue.",
    fit: "This service is especially suited to mid-size and larger hotels that have enough rooms and team capacity to sell through several partners.",
    cta: "Ask the team to review the hotel’s B2B path",
    secondary: "All solutions",
    underCta: "Send the hotel name, room count, and whether partners already exist.",
    photoAlt: "A hotel team reviewing sales channels and B2B partners",
    shouldTitle: "Should this hotel add a B2B channel yet?",
    shouldBody:
      "Before we introduce a new agent, we look at the market the hotel needs, which dates still have rooms, the current rates, and whether the team can look after partner bookings and conditions.",
    shouldClose:
      "Some hotels can gain from B2B. Others should strengthen OTA rates or direct booking first. We recommend a channel from the hotel’s situation, not because a name is already on a list.",
    helpTitle: "What The KPI Plus helps with",
    help: [
      ["01", "Review the market and the fit", "Look at hotel size, guest mix, season, empty dates, and current channels, then judge which partner type could add sales without harming other channels more than needed."],
      ["02", "Choose and introduce partners", "Find relevant partners from our network and see which market or guest type each one reaches, before any cooperation talk with the hotel."],
      ["03", "Help set rates and selling conditions", "Review the rate, selling dates, allocated rooms, cancellation, payment, and return of held rooms, so the hotel understands the agreement before selling starts."],
      ["04", "Coordinate the contract and the start of sales", "Help gather product facts, align conditions with the partner, and prepare what is needed to start selling. The hotel reviews and approves the agreement before signing."],
      ["05", "Review whether the partner actually sells", "Look at room nights, revenue, booked dates, source market, and use of allocated rooms, then decide whether to grow, change terms, or stop a relationship."],
    ],
    existingTitle: "Already have partners, but the result is still unclear?",
    existing: [
      "There are several contracts, but it is unclear who actually sends sales",
      "Rooms are held for a partner and are not sold as expected",
      "Rates and conditions are not consistent across partners",
      "Product updates and follow-up with agents are missing",
      "B2B sales are not reviewed together with OTAs and direct booking",
    ],
    methodTitle: "How the work runs",
    steps: [
      ["01", "See the hotel as a whole", "Rooms, main markets, season, rates, and current channels."],
      ["02", "Review the B2B chance", "Name the market or dates a partner could help, and the limits that have to be managed."],
      ["03", "Choose and start the conversation", "Introduce a suitable partner from the network and review rates and conditions with the hotel."],
      ["04", "Start selling and review the result", "Look at bookings, use of allocated rooms, and the effect on revenue and other channels."],
      ["05", "Adjust the relationship", "Decide from real results whether to continue, change terms, or re-order partners."],
    ],
    measureTitle: "What do we measure?",
    measureBody: "We do not look only at how many partners signed. We look at room nights, revenue, and each partner’s result against the agreed conditions.",
    measureClose:
      "When the hotel has enough data, the team also reviews booking window, source market, use of allocated rooms, and revenue after cost, to see whether B2B has a useful role next to OTAs, direct booking, and other channels.",
    relatedTitle: "Related reading on channels and the revenue plan",
    details: "Read more",
    toolName: "Hotel budget calculator",
    toolBody: "See the hotel’s revenue and cost plan before adding another sales channel. This is not a B2B contract-cost calculator.",
    toolCta: "Use the free tool",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "B2B has to sit with rates, OTAs, and direct booking. It is not another channel added without the revenue picture.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "B2B и продажи через агентов",
    title: "Найти партнёров, которые подходят отелю, а не самый длинный список агентов",
    lead: "Агенты, wholesaler и B2B-партнёры могут помочь отелю выйти на новый рынок или закрыть даты, которые нужно продавать. Канал также несёт работу с ценой, договором, зарезервированными номерами, условиями брони и проверкой результата.",
    leadClose:
      "The KPI Plus начинает с вопроса, подходит ли B2B этому отелю. Если да, мы помогаем выбрать и представить партнёров из текущей сети, согласовать условия продажи и проверить, создаёт ли сотрудничество реальный доход отеля.",
    fit: "Эта услуга особенно подходит средним и более крупным отелям, у которых хватает номеров и команды, чтобы продавать через нескольких партнёров.",
    cta: "Попросить команду оценить B2B-канал отеля",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, число номеров и есть ли уже партнёры.",
    photoAlt: "Команда отеля разбирает каналы продаж и B2B-партнёров",
    shouldTitle: "Стоит ли этому отелю уже добавлять B2B?",
    shouldBody:
      "Прежде чем представить нового агента, мы смотрим нужный рынок, даты с номерами, текущую цену и может ли команда вести брони и условия партнёров.",
    shouldClose:
      "Одним отелям B2B помогает. Другим сначала стоит укрепить цены OTA или прямое бронирование. Мы рекомендуем канал по ситуации отеля, а не потому что имя уже есть в списке.",
    helpTitle: "Чем помогает The KPI Plus",
    help: [
      ["01", "Оценить рынок и пригодность", "Смотреть размер отеля, гостей, сезон, пустые даты и текущие каналы, затем понять, какой тип партнёра может добавить продажи, не вредя другим каналам больше нужного."],
      ["02", "Выбрать и представить партнёров", "Найти подходящих партнёров из нашей сети и понять, какой рынок или тип гостя даёт каждый, до разговора о сотрудничестве с отелем."],
      ["03", "Помочь задать цену и условия продажи", "Разобрать цену, даты продажи, выделенные номера, отмену, оплату и возврат зарезервированных номеров, чтобы отель понимал договор до старта продаж."],
      ["04", "Согласовать договор и старт продаж", "Помочь собрать данные продукта, согласовать условия с партнёром и подготовить старт. Отель рассматривает и утверждает соглашение до подписи."],
      ["05", "Проверить, продаёт ли партнёр на самом деле", "Смотреть ночи, доход, даты броней, рынок источника и использование выделенных номеров, затем решать: расти, менять условия или остановить сотрудничество."],
    ],
    existingTitle: "Партнёры уже есть, но результат всё ещё неясен?",
    existing: [
      "Договоров много, но непонятно, кто реально даёт продажи",
      "Номера зарезервированы партнёру и не продаются как ждали",
      "Цены и условия у разных партнёров не согласованы",
      "Нет обновления продукта и сопровождения агентов",
      "Продажи B2B не разбирают вместе с OTA и прямым бронированием",
    ],
    methodTitle: "Как идёт работа",
    steps: [
      ["01", "Посмотреть отель целиком", "Номера, основные рынки, сезон, цена и текущие каналы."],
      ["02", "Оценить шанс B2B", "Назвать рынок или даты, где партнёр может помочь, и ограничения, которые нужно вести."],
      ["03", "Выбрать и начать разговор", "Представить подходящего партнёра из сети и разобрать цену и условия с отелем."],
      ["04", "Начать продажи и смотреть результат", "Брони, использование выделенных номеров и влияние на доход и другие каналы."],
      ["05", "Скорректировать сотрудничество", "По реальному результату решить: продолжать, менять условия или менять порядок партнёров."],
    ],
    measureTitle: "Что мы измеряем?",
    measureBody: "Мы смотрим не только сколько партнёров подписали договор, а ночи, доход и результат каждого по согласованным условиям.",
    measureClose:
      "Когда данных достаточно, команда также смотрит окно брони, рынок источника, использование выделенных номеров и доход после затрат, чтобы понять, есть ли у B2B полезная роль рядом с OTA, прямым бронированием и другими каналами.",
    relatedTitle: "Материалы про каналы и план дохода",
    details: "Подробнее",
    toolName: "Калькулятор бюджета отеля",
    toolBody: "Посмотреть план дохода и затрат отеля до разговора о новом канале. Это не калькулятор стоимости B2B-договора.",
    toolCta: "Использовать бесплатный инструмент",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "B2B нужно смотреть вместе с ценой, OTA и прямым бронированием, а не добавлять канал без картины дохода.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "B2B 與旅行社銷售",
    title: "找適合這間飯店的夥伴，不是把旅行社名單加到最長",
    lead: "Agent、Wholesaler 與 B2B 夥伴，可能幫飯店進入新市場，或補上需要銷售的日期。但這條通路也帶來價格、合約、保留房、預訂條件與後續追蹤的工作。",
    leadClose:
      "The KPI Plus 會先問：B2B 適不適合這間飯店。若適合，我們會從現有網絡幫忙挑選並牽線夥伴、整理銷售條件，並檢視這段合作是否真的為飯店帶來收益。",
    fit: "這項服務特別適合中大型飯店，客房數與團隊足以承接多家夥伴的銷售條件。",
    cta: "請團隊評估飯店的 B2B 通路",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、房數，以及目前是否已有夥伴。",
    photoAlt: "飯店團隊檢視銷售通路與 B2B 夥伴",
    shouldTitle: "這間飯店現在該加 B2B 通路嗎？",
    shouldBody:
      "在介紹新旅行社之前，我們會先看飯店需要哪個市場、哪些日期還有空房、目前價格如何，以及團隊能否照顧夥伴的預訂與條件。",
    shouldClose:
      "有些飯店能從 B2B 獲益，有些則應先把 OTA 價格或直銷預訂做穩。我們依飯店現況建議通路，不會只因為手上有名單就推薦夥伴。",
    helpTitle: "The KPI Plus 能幫什麼？",
    help: [
      ["01", "評估市場與適配程度", "看飯店規模、客群、淡旺季、空房與現有通路，判斷哪一類夥伴比較能補銷售，又不過度影響其他通路。"],
      ["02", "挑選並牽線夥伴", "從我們的網絡找出相關夥伴，並看各家能接觸哪些市場或客群，再與飯店開始談合作。"],
      ["03", "協助整理價格與銷售條件", "檢視價格、開賣時段、分配客房、取消、付款與保留房退回條件，讓飯店在開始賣之前就理解約定。"],
      ["04", "協調合約與開賣", "協助整理產品資料、與夥伴對條件，並準備開賣所需事項。飯店在簽署前自行審核並核准協議。"],
      ["05", "追蹤夥伴是否真的帶來銷售", "看房晚、收益、預訂日期、客源市場與分配房使用情況，再決定該擴大、調整條件，或停止哪一段合作。"],
    ],
    existingTitle: "已經有夥伴，結果卻還不清楚？",
    existing: [
      "合約很多，卻不清楚哪一家真正帶來銷售",
      "為夥伴保留了房間，卻沒有如預期賣出",
      "各家價格與條件彼此不一致",
      "缺少產品更新，也缺少對旅行社的追蹤",
      "沒有把 B2B 銷售，連同 OTA 與直銷預訂一起看",
    ],
    methodTitle: "怎麼進行",
    steps: [
      ["01", "先看飯店全貌", "客房數、主要市場、淡旺季、價格與現有通路。"],
      ["02", "評估 B2B 機會", "指出夥伴可能幫忙的市場或日期，以及必須處理的限制。"],
      ["03", "挑選並開始討論", "從網絡牽線合適夥伴，並與飯店一起檢視價格與條件。"],
      ["04", "開始銷售並追蹤結果", "看預訂、分配房使用，以及對收益與其他通路的影響。"],
      ["05", "調整合作", "依實際成果決定繼續、改條件，或重新排序夥伴。"],
    ],
    measureTitle: "我們量什麼？",
    measureBody: "我們看的不只是簽了幾家夥伴，而是各家的房晚、收益，以及相對談好條件的實際成果。",
    measureClose:
      "當飯店資料夠用，團隊會再看預訂時窗、客源市場、分配房使用，以及扣成本後的收益，判斷 B2B 在 OTA、直銷預訂與其他通路裡是否扮演合適角色。",
    relatedTitle: "與銷售通路和收益計畫相關的內容",
    details: "查看詳情",
    toolName: "飯店預算計算機",
    toolBody: "在談新增銷售通路前，先看飯店的收益與支出計畫。這不是用來算 B2B 合約成本的工具。",
    toolCta: "使用免費工具",
    revenueTitle: "Revenue & Commercial Management",
    revenueBody: "B2B 必須和價格、OTA 與直銷預訂一起看，而不是在沒有收益全貌時再加一條通路。",
  },
} as const;

export function B2bView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);
  const revenueHref = existingHref("/solutions/revenue-commercial-management", locale);
  const budgetHref = existingHref("/tools/hotel-budget-calculator", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/b2b-agent-sales", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/b2b-agent-sales", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/64">{t.fit}</p>
        <div className="kpi-actions">
          <a href="#b2b-enquiry" className="kpi-button">
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
            <h2 className="kpi-h2">{t.shouldTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555555]">{t.shouldBody}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#3B3B3B]">{t.shouldClose}</p>
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
          <a href="#b2b-enquiry" className="kpi-button mt-10">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.existingTitle}</h2>
        <div className="mt-10 grid gap-4">
          {t.existing.map((item, index) => (
            <article key={item} className="kpi-card flex gap-4 p-6">
              <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-7 text-[#555555]">{item}</p>
            </article>
          ))}
        </div>
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

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.measureTitle}</h2>
        <p className="kpi-lead mt-5">{t.measureBody}</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.measureClose}</p>
      </section>

      {budgetHref || revenueHref ? (
        <section className="border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.relatedTitle}</h2>
            <div className="kpi-grid-2 mt-10">
              {budgetHref ? (
                <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.toolName}</h3>
                  <p className="mt-3 text-base leading-7 text-[#555555]">{t.toolBody}</p>
                  <Link href={budgetHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                    {t.toolCta}
                  </Link>
                </article>
              ) : null}
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
            </div>
          </div>
        </section>
      ) : null}

      <B2bEnquiry locale={locale} />
      <B2bStickyCta label={t.cta} />
    </SiteShell>
  );
}
