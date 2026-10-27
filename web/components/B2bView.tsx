import Link from "next/link";
import { B2bEnquiry } from "@/components/B2bEnquiry";
import { B2bFrameworkMatrix } from "@/components/b2b/B2bFrameworkMatrix";
import { B2bFunnelStages } from "@/components/b2b/B2bFunnelStages";
import { B2bFunnelVisual } from "@/components/b2b/B2bFunnelVisual";
import { B2bHeroVisual } from "@/components/b2b/B2bHeroVisual";
import { B2bReadinessVisual } from "@/components/b2b/B2bReadinessVisual";
import { B2bKpiChart } from "@/components/b2b/B2bKpiChart";
import { B2bKpiVisual } from "@/components/b2b/B2bKpiVisual";
import { B2bRelatedVisual } from "@/components/b2b/B2bRelatedVisual";
import { B2bServiceMatrix } from "@/components/b2b/B2bServiceMatrix";
import { B2bStickyCta } from "@/components/B2bStickyCta";
import { B2bWorkflowBoundary } from "@/components/b2b/B2bWorkflowBoundary";
import { B2bWorkflowSteps } from "@/components/b2b/B2bWorkflowSteps";
import { B2bWorkflowVisual } from "@/components/b2b/B2bWorkflowVisual";
import { PageFaqs } from "@/components/PageFaqs";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import {
  B2B_FUNNEL_SECTION,
  B2B_HERO_VISUAL,
  B2B_KPI_SECTION,
  B2B_WORKFLOW_SECTION,
  b2bApprovedSeries,
  b2bEvidenceKpis,
  b2bFrameworkCopy,
  b2bFunnelCopy,
  b2bScopeCopy,
  b2bWorkflowBoundaryCopy,
  b2bWorkflowCopy,
  type B2bEvidenceKpi,
  type B2bServiceRow,
} from "@/lib/b2b";
import type { CmsB2bPage, CmsRelatedCard } from "@/lib/cms/b2b-page";
import { relatedCardDateLabel, relatedCardTypeLabel } from "@/lib/cms/b2b-page";
import { b2bFunnelVisualUrl, b2bHeroVisualUrl, b2bKpiVisualUrl, b2bPublicTeamPhoto, b2bReadinessVisualUrl, b2bRelatedVisualUrl, b2bWorkflowVisualUrl, resolveB2bPage } from "@/lib/cms/b2b-page-public";
import { faqsForRoute } from "@/lib/faqs";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";
import "@/components/b2b/b2b-ops.css";

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "การขายผ่านเอเจนต์และคู่ค้า",
    title: "หาพาร์ตเนอร์ที่เหมาะกับโรงแรม ไม่ใช่เพิ่มรายชื่อเอเยนต์ให้มากที่สุด",
    lead: "Partner Fit สำคัญกว่าจำนวนพาร์ตเนอร์ และไม่ใช่การเลือกจากราคาอย่างเดียว โรงแรมต้องมีข้อเสนอ B2B โครงสร้างราคา และ Sales Material ที่ชัดก่อนเริ่มประสานงาน",
    leadNext:
      "การออกไปหาพาร์ตเนอร์ต้องโยงกับการจองและผลรายได้ ไม่ใช่แค่มีรายชื่อหรือสัญญา",
    leadClose:
      "เดอะ เคพีไอ พลัส ช่วยวางกระบวนการขาย B2B ให้เป็นระบบได้ เมื่อโรงแรมอนุมัติให้ใช้บริการนี้",
    fit: "บริการนี้เหมาะเป็นพิเศษกับโรงแรมขนาดกลางถึงขนาดใหญ่ ที่มีจำนวนห้องและทีมรองรับการขายผ่านพาร์ตเนอร์หลายราย",
    cta: "ให้ทีมประเมินช่องทาง B2B ของโรงแรม",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม จำนวนห้อง และสถานะพาร์ตเนอร์ปัจจุบัน",
    photoAlt: "ตัวอย่างการทบทวนงานขายพาร์ตเนอร์ B2B ด้าน Partner ราคา และการจอง",
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
      "มีสัญญาหลายฉบับ แต่ยังไม่รู้ว่าพาร์ตเนอร์รายไหนสร้างยอดขายจริง",
      "กันห้องไว้ให้พาร์ตเนอร์ แต่ยอดขายไม่เป็นไปตามที่คาด",
      "ราคาและเงื่อนไขแต่ละราย ไม่สอดคล้องกัน",
      "ขาดการอัปเดตสินค้า และการติดตามกับเอเจนต์อย่างต่อเนื่อง",
      "ยังไม่ได้มอง B2B ร่วมกับ OTA และ Direct Booking ในภาพเดียวกัน",
    ],
    methodTitle: "วิธีที่เราทำงานร่วมกับโรงแรม",
    steps: [
      ["01", "ดูภาพรวมโรงแรม", "จำนวนห้อง ตลาดหลัก ฤดูกาล ราคา และช่องทางขายปัจจุบัน"],
      ["02", "ประเมินโอกาส B2B", "ดูว่าตลาดหรือช่วงไหนที่พาร์ตเนอร์อาจช่วยเพิ่มยอดขายได้ และมีข้อจำกัดอะไรบ้าง"],
      ["03", "คัดเลือกและเริ่มพูดคุย", "ประสานพาร์ตเนอร์ที่เหมาะสม พร้อมทบทวนราคาและเงื่อนไขร่วมกับโรงแรม"],
      ["04", "เริ่มขายและติดตามผล", "ดูยอดจอง การใช้ห้องที่จัดสรร และผลต่อรายได้เมื่อเทียบกับช่องทางอื่น"],
      ["05", "ปรับความร่วมมือ", "ตัดสินใจจากผลงานจริงว่าควรทำต่อ ปรับเงื่อนไข หรือเปลี่ยนพาร์ตเนอร์"],
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
    lead: "Partner Fit matters more than how many names are on the list, and partners should not be chosen on price alone. The hotel needs a clear B2B offer, rate structure, and sales material before outreach starts.",
    leadNext: "Partner outreach has to connect to bookings and revenue, not stop at a contact list or a signed paper.",
    leadClose:
      "The KPI Plus can help set a structured B2B sales process, only where this service is approved.",
    fit: "This service is especially suited to mid-size and larger hotels that have enough rooms and team capacity to sell through several partners.",
    cta: "Ask the team to review the hotel’s B2B path",
    secondary: "All solutions",
    underCta: "Send the hotel name, room count, and whether partners already exist.",
    photoAlt: "Sample B2B partner sales review of partner fit, rates, and booking flow",
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
    leadNext: "",
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
    leadNext: "",
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

export async function B2bView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsB2bPage | null;
  embedded?: boolean;
}) {
  const t = copy[locale];
  const cms = await resolveB2bPage(locale, previewContent);
  const fromCms = cms.fromCms;
  const solutions = localizePath("/solutions", locale);
  const pageRoute = localizePath("/solutions/b2b-agent-sales", locale);
  const heroTitle = fromCms ? cms.hero.title : t.title;
  const primaryCta = fromCms ? cms.hero.primaryCta : { label: t.cta, href: "#b2b-enquiry" };
  const secondaryCta = fromCms ? cms.hero.secondaryCta : { label: t.secondary, href: solutions };
  const readinessTitle = fromCms ? cms.readiness.title : t.shouldTitle;
  const readinessBody = fromCms ? cms.readiness.body : t.shouldBody;
  const readinessClose = fromCms ? cms.readiness.close : t.shouldClose;
  const frameworkCopy = b2bFrameworkCopy(locale);
  const frameworkRows =
    fromCms && cms.readiness.items?.some((item) => item.area?.trim())
      ? cms.readiness.items.map((item) => ({
          id: item.id,
          area: item.area,
          problem: item.problem,
          prepare: item.prepare,
          output: item.output,
        }))
      : frameworkCopy.rows;
  const helpTitle = fromCms ? cms.scopeSection.title : t.helpTitle;
  const scopeCopy = b2bScopeCopy(locale);
  const scopeRows: B2bServiceRow[] = (fromCms ? cms.scopeItems : scopeCopy.rows).map((item) => {
    const href = item.href ? existingHref(item.href, locale) ?? "" : "";
    return {
      id: item.id,
      area: item.area,
      action: item.action,
      input: item.input,
      output: item.output,
      owner: item.owner,
      ownerKind: item.ownerKind,
      href,
      linkLabel: href ? item.linkLabel || solutionNavLabel(item.href, locale) : "",
    };
  });
  const funnelSteps = fromCms && cms.funnelSteps.length ? cms.funnelSteps : b2bFunnelCopy(locale);
  const funnelTitle = fromCms ? cms.funnelSection.title : locale === "th" ? B2B_FUNNEL_SECTION.title.th : B2B_FUNNEL_SECTION.title.en;
  const funnelLead = fromCms ? cms.funnelSection.lead : locale === "th" ? B2B_FUNNEL_SECTION.lead.th : B2B_FUNNEL_SECTION.lead.en;
  const methodTitle = fromCms ? cms.workflowSection.title : t.methodTitle;
  const methodLead = fromCms
    ? cms.workflowSection.lead
    : locale === "th"
      ? B2B_WORKFLOW_SECTION.lead.th
      : B2B_WORKFLOW_SECTION.lead.en;
  const methodSteps = fromCms && cms.workflowSteps.length ? cms.workflowSteps : b2bWorkflowCopy(locale);
  const methodBoundary =
    fromCms && cms.workflowSection.boundary.support.length
      ? cms.workflowSection.boundary
      : b2bWorkflowBoundaryCopy(locale);
  const measureTitle = fromCms ? cms.measureSection.title : t.measureTitle;
  const measureIntro = fromCms ? cms.measureSection.intro : t.measureBody;
  const measureClose = fromCms ? cms.measureSection.close : t.measureClose;
  const publicKpis = cms.kpis;
  const evidenceKpis = b2bEvidenceKpis(publicKpis, locale);
  const evidenceSeries = b2bApprovedSeries(evidenceKpis);
  const relatedTitle = fromCms ? cms.related.title : t.relatedTitle;
  const relatedCards = cms.related.cards;
  const featuredCard = relatedCards.find((card) => card.featured) ?? relatedCards[0];
  const supportingCards = relatedCards.filter((card) => card.id !== featuredCard?.id);
  const faqs = cms.faqs.length ? cms.faqs : faqsForRoute(pageRoute);
  const faqIntro = cms.faqIntro || undefined;
  const heroSrc = (fromCms ? cms.hero.visual.src : "") || b2bHeroVisualUrl() || "";
  const cmsReadinessSrc = fromCms ? cms.readiness.visual.src : "";
  const readinessSrc =
    (cmsReadinessSrc &&
    !cmsReadinessSrc.includes("b2b-agent-sales-hero") &&
    !cmsReadinessSrc.includes("b2b-agent-sales-related") &&
    !cmsReadinessSrc.includes("b2b-agent-sales-funnel") &&
    !cmsReadinessSrc.includes("b2b-agent-sales-workflow") &&
    !cmsReadinessSrc.includes("b2b-agent-sales-kpi") &&
    !cmsReadinessSrc.includes("b2b-agent-sales-team") &&
    !cmsReadinessSrc.includes("b2b-agent-sales-readiness-framework")
      ? cmsReadinessSrc
      : "") ||
    b2bReadinessVisualUrl() ||
    "";
  const cmsFunnelSrc = fromCms ? cms.funnelSection.visual.src : "";
  const funnelSrc =
    (cmsFunnelSrc &&
    !cmsFunnelSrc.includes("b2b-agent-sales-hero") &&
    !cmsFunnelSrc.includes("b2b-agent-sales-framework") &&
    !cmsFunnelSrc.includes("b2b-agent-sales-readiness")
      ? cmsFunnelSrc
      : "") ||
    b2bFunnelVisualUrl() ||
    "";
  const cmsWorkflowSrc = fromCms ? cms.workflowSection.visual.src : "";
  const workflowSrc =
    (cmsWorkflowSrc &&
    !cmsWorkflowSrc.includes("b2b-agent-sales-hero") &&
    !cmsWorkflowSrc.includes("b2b-agent-sales-framework") &&
    !cmsWorkflowSrc.includes("b2b-agent-sales-funnel") &&
    !cmsWorkflowSrc.includes("b2b-agent-sales-readiness")
      ? cmsWorkflowSrc
      : "") ||
    b2bWorkflowVisualUrl() ||
    "";
  const cmsKpiSrc = fromCms ? cms.measureSection.visual.src : "";
  const kpiVisualSrc =
    (cmsKpiSrc &&
    !cmsKpiSrc.includes("b2b-agent-sales-hero") &&
    !cmsKpiSrc.includes("b2b-agent-sales-framework") &&
    !cmsKpiSrc.includes("b2b-agent-sales-funnel") &&
    !cmsKpiSrc.includes("b2b-agent-sales-workflow") &&
    !cmsKpiSrc.includes("b2b-agent-sales-readiness")
      ? cmsKpiSrc
      : "") ||
    b2bKpiVisualUrl() ||
    "";
  const cmsRelatedSrc = fromCms ? cms.related.visual.src : "";
  const relatedVisualSrc =
    (cmsRelatedSrc &&
    !cmsRelatedSrc.includes("b2b-agent-sales-hero") &&
    !cmsRelatedSrc.includes("b2b-agent-sales-framework") &&
    !cmsRelatedSrc.includes("b2b-agent-sales-funnel") &&
    !cmsRelatedSrc.includes("b2b-agent-sales-workflow") &&
    !cmsRelatedSrc.includes("b2b-agent-sales-readiness") &&
    !cmsRelatedSrc.includes("b2b-agent-sales-kpi")
      ? cmsRelatedSrc
      : "") ||
    b2bRelatedVisualUrl() ||
    "";
  const stickyLabel = primaryCta.label || t.cta;

  const inner = (
    <div className="kpi-b2b-page">
      <PageHero className="kpi-b2b-hero">
        <div className="kpi-b2b-hero-grid">
          <div className="kpi-b2b-hero-copy">
            <nav aria-label="Breadcrumb" className="kpi-b2b-hero-crumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href={solutions}>{t.crumb}</Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span>{solutionNavLabel("/solutions/b2b-agent-sales", locale)}</span>
                </li>
              </ol>
            </nav>
            <h1 className="kpi-h1 kpi-b2b-hero-title">
              {fromCms ? (
                heroTitle
              ) : locale === "th" ? (
                <>
                  <span className="kpi-b2b-hero-line">
                    หา<span className="kpi-b2b-hero-em">พาร์ตเนอร์ที่เหมาะกับโรงแรม</span>
                  </span>
                  <span className="kpi-b2b-hero-br"> </span>
                  <span className="kpi-b2b-hero-line">ไม่ใช่เพิ่มรายชื่อ</span>
                  <span className="kpi-b2b-hero-br"> </span>
                  <span className="kpi-b2b-hero-line">เอเจนต์ให้มากที่สุด</span>
                </>
              ) : (
                t.title
              )}
            </h1>
            {fromCms ? (
              <>
                <p className="kpi-b2b-hero-lead">{cms.hero.description}</p>
                {cms.hero.leadNext ? <p className="kpi-b2b-hero-lead kpi-b2b-hero-lead-next">{cms.hero.leadNext}</p> : null}
                {cms.hero.leadClose ? <p className="kpi-b2b-hero-outcome">{cms.hero.leadClose}</p> : null}
              </>
            ) : locale === "th" ? (
              <>
                <p className="kpi-b2b-hero-lead">
                  <span className="kpi-latin">Partner Fit</span> สำคัญกว่าจำนวนพาร์ตเนอร์ และไม่ใช่การเลือกจากราคาอย่างเดียว
                  โรงแรมต้องมีข้อเสนอ <span className="kpi-latin">B2B</span> โครงสร้างราคา และ{" "}
                  <span className="kpi-latin">Sales Material</span> ที่ชัดก่อนเริ่มประสานงาน
                </p>
                <p className="kpi-b2b-hero-lead kpi-b2b-hero-lead-next">{t.leadNext}</p>
                <p className="kpi-b2b-hero-outcome">
                  <span>
                    <span className="kpi-latin">The KPI Plus</span> ช่วยวางกระบวนการขาย <span className="kpi-latin">B2B</span> ให้เป็นระบบได้
                  </span>
                  <span className="kpi-b2b-hero-outcome-strong">เมื่อโรงแรมอนุมัติให้ใช้บริการนี้</span>
                </p>
              </>
            ) : (
              <>
                <p className="kpi-b2b-hero-lead">{t.lead}</p>
                {t.leadNext ? <p className="kpi-b2b-hero-lead kpi-b2b-hero-lead-next">{t.leadNext}</p> : null}
                <p className="kpi-b2b-hero-outcome">{t.leadClose}</p>
              </>
            )}
            <div className="kpi-actions">
              <a href={primaryCta.href || "#b2b-enquiry"} className="kpi-button">
                {primaryCta.label}{" "}
                <span className="kpi-b2b-hero-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <Link href={secondaryCta.href || solutions} className="kpi-button-ghost kpi-b2b-hero-secondary">
                {secondaryCta.label}
              </Link>
            </div>
            <p className="kpi-b2b-hero-note">{fromCms ? cms.hero.underCta : t.underCta}</p>
          </div>
          <B2bHeroVisual
            locale={locale}
            src={heroSrc}
            status={cms.hero.visual.status}
            alt={fromCms ? (locale === "th" ? cms.hero.visual.altTh : cms.hero.visual.altEn) : t.photoAlt}
            label={fromCms ? cms.hero.visual.label : undefined}
            meta={
              fromCms
                ? cms.hero.visual.caption || (locale === "th" ? B2B_HERO_VISUAL.meta.th : B2B_HERO_VISUAL.meta.en)
                : undefined
            }
            caption={fromCms ? cms.hero.caption : locale === "th" ? B2B_HERO_VISUAL.caption.th : B2B_HERO_VISUAL.caption.en}
          />
        </div>
      </PageHero>

      <section className="kpi-section kpi-b2b-framework">
        <p className="kpi-latin kpi-b2b-framework-kicker">{frameworkCopy.kicker}</p>
        <h2 className="kpi-h2">{readinessTitle}</h2>
        <p className="kpi-b2b-framework-lead">{readinessBody}</p>
        <B2bFrameworkMatrix
          caption={frameworkCopy.kicker}
          columns={frameworkCopy.columns}
          rows={frameworkRows}
        />
        <B2bGuideLists
          locale={locale}
          checks={cms.guides?.readinessChecks ?? []}
          checksTitle={cms.guides?.readinessTitle}
          partnerFit={cms.guides?.partnerFit ?? []}
          partnerFitTitle={cms.guides?.partnerFitTitle}
          salesMaterial={cms.guides?.salesMaterial ?? []}
          salesMaterialTitle={cms.guides?.salesMaterialTitle}
        />
        <B2bReadinessVisual
          locale={locale}
          src={readinessSrc}
          status={cms.readiness.visual.status}
          alt={fromCms ? (locale === "th" ? cms.readiness.visual.altTh : cms.readiness.visual.altEn) : undefined}
          label={fromCms ? cms.readiness.visual.label : undefined}
          caption={fromCms ? cms.readiness.visual.caption : undefined}
        />
        <p className="kpi-b2b-framework-close">{readinessClose}</p>
        <a href={primaryCta.href || "#b2b-enquiry"} className="kpi-button kpi-b2b-framework-cta">
          {primaryCta.label}{" "}
          <span className="kpi-b2b-hero-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </section>

      <section className="kpi-section kpi-b2b-funnel-section">
        <p className="kpi-latin kpi-b2b-funnel-kicker">Agent Sales Funnel</p>
        <h2 className="kpi-h2">{funnelTitle}</h2>
        {funnelLead ? <p className="kpi-b2b-funnel-lead">{funnelLead}</p> : null}
        <B2bFunnelVisual
          locale={locale}
          src={funnelSrc}
          status={cms.funnelSection.visual.status}
          alt={fromCms ? (locale === "th" ? cms.funnelSection.visual.altTh : cms.funnelSection.visual.altEn) : undefined}
          label={fromCms ? cms.funnelSection.visual.label : undefined}
          caption={fromCms ? cms.funnelSection.visual.caption || cms.funnelSection.caption : undefined}
        />
        <B2bFunnelStages locale={locale} steps={funnelSteps} kpis={publicKpis} />
      </section>

      <section className="kpi-b2b-help border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-latin kpi-b2b-service-kicker">{scopeCopy.kicker}</p>
          <h2 className="kpi-h2 kpi-b2b-help-title">{helpTitle}</h2>
          <B2bServiceMatrix
            caption={helpTitle}
            columns={scopeCopy.columns}
            rows={scopeRows}
            expand={scopeCopy.expand}
            collapse={scopeCopy.collapse}
            related={scopeCopy.related}
          />
        </div>
      </section>

      <section className="kpi-b2b-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section kpi-b2b-method-grid">
          <p className="kpi-latin kpi-b2b-workflow-kicker">Partner Sales Workflow</p>
          <h2 className="kpi-h2 kpi-b2b-method-title">{methodTitle}</h2>
          {methodLead ? <p className="kpi-b2b-workflow-lead">{methodLead}</p> : null}
          <B2bWorkflowVisual
            locale={locale}
            src={workflowSrc}
            status={cms.workflowSection.visual.status}
            alt={fromCms ? (locale === "th" ? cms.workflowSection.visual.altTh : cms.workflowSection.visual.altEn) : undefined}
            label={fromCms ? cms.workflowSection.visual.label : undefined}
            caption={fromCms ? cms.workflowSection.visual.caption : undefined}
          />
          <B2bWorkflowSteps locale={locale} steps={methodSteps} />
          <B2bWorkflowBoundary
            kicker={methodBoundary.kicker}
            note={methodBoundary.note}
            supportTitle={methodBoundary.supportTitle}
            approveTitle={methodBoundary.approveTitle}
            support={methodBoundary.support}
            approve={methodBoundary.approve}
          />
          {cms.guides?.rateCommissionBody?.trim() ? (
            <aside className="kpi-b2b-rate-boundary">
              <p className="kpi-latin kpi-b2b-rate-kicker">{cms.guides.rateCommissionTitle}</p>
              <p>{cms.guides.rateCommissionBody}</p>
            </aside>
          ) : null}
        </div>
      </section>

      <section className="kpi-section kpi-b2b-measure">
          <p className="kpi-latin kpi-b2b-measure-kicker">{B2B_KPI_SECTION.kicker}</p>
          <h2 className="kpi-h2 kpi-b2b-measure-title">{measureTitle}</h2>
          {measureIntro ? <p className="kpi-b2b-measure-intro">{measureIntro}</p> : null}
          {cms.showSample || !evidenceKpis.length ? (
            <p className="kpi-b2b-measure-sample">{cms.measureSection.sampleLabel || (locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data")}</p>
          ) : null}
          {evidenceKpis.length ? (
            <div className="kpi-b2b-measure-metrics">
              {evidenceKpis.map((kpi) => (
                <B2bKpiCard key={kpi.id} kpi={kpi} locale={locale} />
              ))}
            </div>
          ) : null}
          {evidenceSeries.length ? (
            <B2bKpiChart
              locale={locale}
              kpis={evidenceSeries}
              title={locale === "th" ? "ตัวชี้วัดงานขาย B2B" : "B2B Agent Sales KPI"}
              subtitle={locale === "th" ? "ชุดข้อมูลที่อนุมัติหรือปกปิดตัวตนแล้ว" : "Approved or anonymised figures only"}
              status={evidenceSeries.every((item) => item.dataStatus === "Anonymised") ? "Anonymised" : "Approved"}
            />
          ) : (
            <B2bKpiVisual
              locale={locale}
              src={kpiVisualSrc}
              status={cms.measureSection.visual.status}
              alt={fromCms ? (locale === "th" ? cms.measureSection.visual.altTh : cms.measureSection.visual.altEn) : undefined}
              label={fromCms ? cms.measureSection.visual.label : undefined}
              caption={fromCms ? cms.measureSection.visual.caption : undefined}
            />
          )}
          {measureClose ? <p className="kpi-b2b-measure-close">{measureClose}</p> : null}
        </section>

      {relatedCards.length ? (
        <section className="kpi-b2b-related border-t border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2 kpi-b2b-related-title">
              {fromCms || locale !== "th" ? (
                relatedTitle
              ) : (
                <>
                  เรื่องที่เกี่ยวข้องกับช่องทางขาย
                  <span className="kpi-b2b-related-br"> </span>
                  และแผนรายได้
                </>
              )}
            </h2>
            <div className="kpi-b2b-related-layout">
              <B2bRelatedVisual
                locale={locale}
                src={relatedVisualSrc}
                status={cms.related.visual.status}
                alt={fromCms ? (locale === "th" ? cms.related.visual.altTh : cms.related.visual.altEn) : undefined}
                label={fromCms ? cms.related.visual.label : undefined}
                caption={fromCms ? cms.related.visual.caption : undefined}
              />
              <div className="kpi-b2b-related-cards">
                {featuredCard ? <B2bRelatedCard key={featuredCard.id} card={featuredCard} locale={locale} featured /> : null}
                {supportingCards.map((card) => (
                  <B2bRelatedCard key={card.id} card={card} locale={locale} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <PageFaqs items={faqs} locale={locale} sectionId="b2b-faq" intro={faqIntro} />
      <B2bEnquiry locale={locale} helper={cms.form} teamPhotoSrc={b2bPublicTeamPhoto(cms.form.visual)} />
      <B2bStickyCta label={stickyLabel} />
    </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={pageRoute} hideFaqs>
      {inner}
    </SiteShell>
  );
}

function B2bGuideLists({
  locale,
  checks,
  checksTitle,
  partnerFit,
  partnerFitTitle,
  salesMaterial,
  salesMaterialTitle,
}: {
  locale: Locale;
  checks: Array<{ id: string; check: string; why: string; output: string }>;
  checksTitle?: string;
  partnerFit: Array<{ id: string; text: string }>;
  partnerFitTitle?: string;
  salesMaterial: Array<{ id: string; text: string }>;
  salesMaterialTitle?: string;
}) {
  const visibleChecks = checks.filter((item) => item.check.trim());
  const visibleFit = partnerFit.filter((item) => item.text.trim());
  const visibleSales = salesMaterial.filter((item) => item.text.trim());
  if (!visibleChecks.length && !visibleFit.length && !visibleSales.length) return null;
  return (
    <div className="kpi-b2b-guides">
      {visibleChecks.length ? (
        <section className="kpi-b2b-guide">
          <h3 className="kpi-b2b-guide-title">{checksTitle || (locale === "th" ? "รายการตรวจความพร้อม B2B" : "B2B Readiness checklist")}</h3>
          <ul className="kpi-b2b-guide-list">
            {visibleChecks.map((item) => (
              <li key={item.id}>
                <strong>{item.check}</strong>
                {item.why ? <span>{item.why}</span> : null}
                {item.output ? <em>{item.output}</em> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {visibleFit.length ? (
        <section className="kpi-b2b-guide">
          <h3 className="kpi-b2b-guide-title">{partnerFitTitle || "Partner Fit"}</h3>
          <ul className="kpi-b2b-guide-list kpi-b2b-guide-list-plain">
            {visibleFit.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {visibleSales.length ? (
        <section className="kpi-b2b-guide">
          <h3 className="kpi-b2b-guide-title">{salesMaterialTitle || "Sales Material"}</h3>
          <ul className="kpi-b2b-guide-list kpi-b2b-guide-list-plain">
            {visibleSales.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function B2bRelatedCard({
  card,
  locale,
  featured = false,
}: {
  card: CmsRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const dateLabel = relatedCardDateLabel(card, locale);
  const typeLabel = relatedCardTypeLabel(card);
  const meta = dateLabel || typeLabel ? "" : card.meta;
  const datetime = (card.updatedAt || card.publishedAt).trim();
  return (
    <Link href={card.href} className={`kpi-b2b-related-item${featured ? " is-featured" : ""}`}>
      {featured ? <span className="kpi-b2b-related-rule" aria-hidden="true" /> : null}
      {card.category ? <p className="kpi-b2b-related-kicker">{card.category}</p> : null}
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      {dateLabel || typeLabel || meta ? (
        <p className="kpi-b2b-related-meta">
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
          {dateLabel && typeLabel ? <span aria-hidden="true"> · </span> : null}
          {typeLabel ? <span>{typeLabel}</span> : null}
          {!dateLabel && !typeLabel && meta ? <span>{meta}</span> : null}
        </p>
      ) : null}
      <span className="kpi-b2b-related-cta">
        {card.cta}{" "}
        <span className="kpi-b2b-related-arrow" aria-hidden="true">
          ↗
        </span>
      </span>
    </Link>
  );
}

function B2bKpiCard({ kpi, locale }: { kpi: B2bEvidenceKpi; locale: Locale }) {
  const thai = locale === "th";
  return (
    <article className="kpi-b2b-measure-metric">
      <p className="kpi-latin kpi-b2b-measure-name">{kpi.name}</p>
      <p className="kpi-latin kpi-b2b-measure-value">{kpi.display}</p>
      <p className="kpi-b2b-measure-label">{kpi.definition}</p>
      <dl className="kpi-b2b-kpi-meta">
        <div>
          <dt>{thai ? "ช่วงเวลา" : "Period"}</dt>
          <dd>{kpi.period}</dd>
        </div>
        <div>
          <dt>{thai ? "หน่วย / คำนิยาม" : "Unit / definition"}</dt>
          <dd>{kpi.unit || kpi.definition}</dd>
        </div>
        <div>
          <dt>{thai ? "เป้าหมายหรือเปรียบเทียบ" : "Target or comparison"}</dt>
          <dd>{kpi.comparison || "—"}</dd>
        </div>
        <div>
          <dt>{thai ? "สถานะข้อมูล" : "Data status"}</dt>
          <dd>
            <span className={`kpi-b2b-kpi-status is-${kpi.dataStatus.toLowerCase()}`}>{kpi.dataStatus}</span>
          </dd>
        </div>
        <div>
          <dt>{thai ? "วันที่อัปเดต" : "Updated date"}</dt>
          <dd>{kpi.updatedLabel || (thai ? B2B_KPI_SECTION.emptyDate.th : B2B_KPI_SECTION.emptyDate.en)}</dd>
        </div>
      </dl>
    </article>
  );
}
