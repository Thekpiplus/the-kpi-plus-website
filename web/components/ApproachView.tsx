import Link from "next/link";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const heroPhoto = "/media/revenue-hero-desk.jpg";

const copy = {
  th: {
    eyebrow: "Revenue & Commercial Management",
    title: "บริหารราคาและช่องทางการขายให้ชัด ทุกการตัดสินใจด้านรายได้มีข้อมูลรองรับ",
    lead: "ราคา ช่องทางการขาย และ Demand จะสร้างรายได้ได้เต็มที่ เมื่อทีมโรงแรมเห็นข้อมูลชุดเดียวกัน รู้ว่าใครรับผิดชอบ และวัดผลได้ทั้ง ADR, Occupancy และรายได้สุทธิหลังหักค่าคอมมิชชัน",
    subline: "ขายห้องให้ถูกคน ในราคาที่เหมาะสม ผ่านช่องทางที่คุ้มค่าที่สุด",
    photoAlt: "ทีมโรงแรมทบทวน Booking Pace ราคา และช่องทางการขาย",
    method: "แนวทางการทำงานของ เดอะ เคพีไอ พลัส",
    steps: [
      {
        num: "01",
        title: "อ่านสัญญาณให้ชัด",
        body: "ดู Booking Pace, Pickup, Forecast, Market Demand และ Channel Mix ในภาพเดียวกัน เพื่อแยกให้ออกว่าแรงกดดันมาจากราคา Demand หรือช่องทางการขาย",
      },
      {
        num: "02",
        title: "เลือกสิ่งที่ควรทำต่อ",
        body: "ตัดสินใจว่าควรปรับ Pricing, Restriction, Inventory Allocation หรือ Channel Strategy แล้วเปลี่ยนเป็นงานที่มีเจ้าของชัดเจน",
      },
      {
        num: "03",
        title: "เชื่อมงานที่เกี่ยวข้อง",
        body: "ให้ทีม Revenue, Sales, Reservation และ Marketing ทำงานบนข้อมูลเดียวกัน พร้อมเชื่อม PMS, Channel Manager, RMS และ Booking Engine ให้ราคาและ Inventory ตรงกันทุกช่องทาง",
      },
      {
        num: "04",
        title: "วัดการเปลี่ยนแปลง",
        body: "ติดตาม RevPAR, Net RevPAR, ADR, Occupancy และต้นทุนต่อการจองของแต่ละช่องทาง แล้วทบทวนผลเพื่อกำหนดเรื่องสำคัญลำดับถัดไป",
      },
    ],
    exampleEyebrow: "ตัวอย่าง",
    exampleTitle: "เมื่อ Occupancy ในอีก 60 วันข้างหน้าต่ำกว่าเป้า",
    exampleLead:
      "แทนที่จะลดราคาทุกช่องทางในทันที เดอะ เคพีไอ พลัส ช่วยทีมโรงแรมหาต้นเหตุก่อน แล้ววางแผนที่เพิ่มยอดจองโดยยังรักษา ADR และรายได้สุทธิไว้ได้",
    exampleSteps: [
      ["01", "DEMAND", "ดู Booking Pace และ Pickup เทียบกับปีก่อนและ Budget"],
      ["02", "DEMAND", "ดู Market Demand ทั้งฤดูกาล อีเวนต์ และเที่ยวบินเข้าพื้นที่"],
      ["03", "PRICING", "ตรวจ Competitor Rate Positioning"],
      ["04", "CHANNEL", "ทบทวน Channel Performance: สัดส่วน Direct กับ OTA, Conversion และต้นทุนต่อการจอง"],
      ["05", "DISTRIBUTION", "ตรวจ Rate Parity และ Inventory ที่เปิดขายในแต่ละช่องทาง"],
      ["06", "SEGMENT", "ทบทวน Segment Mix และ Restriction เช่น Minimum Stay หรือ Close to Arrival"],
      ["07", "PRICING", "เลือกว่าควรทำ Pricing, Promotion เฉพาะกลุ่ม, ปรับ Distribution หรือ Demand Generation"],
      ["08", "REVIEW", "กำหนดเจ้าของงานและกรอบเวลา"],
      ["09", "REVIEW", "ทบทวนผลที่ 7 และ 14 วัน แล้วปรับแผนต่อ"],
    ],
    close: "อยากรู้ว่าช่องทางไหนสร้างรายได้สุทธิให้โรงแรมคุณมากที่สุด?",
    cta: "เริ่มต้นด้วยการทบทวน Revenue & Distribution กับ เดอะ เคพีไอ พลัส",
  },
  en: {
    eyebrow: "Revenue & Commercial Management",
    title: "Make pricing and distribution clear, so every revenue decision is backed by data",
    lead: "Pricing, channels, and demand deliver their full revenue potential when your hotel team works from the same data, knows who owns each action, and can measure results across ADR, occupancy, and net revenue after commissions.",
    subline: "Sell the right room to the right guest, at the right price, through the most profitable channel.",
    photoAlt: "A hotel team reviewing booking pace, pricing, and distribution",
    method: "The KPI Plus Approach",
    steps: [
      {
        num: "01",
        title: "Read the signals clearly",
        body: "Look at booking pace, pickup, forecast, market demand, and channel mix in one view, so you can tell whether the pressure is coming from price, demand, or distribution.",
      },
      {
        num: "02",
        title: "Choose the next move",
        body: "Decide whether to adjust pricing, restrictions, inventory allocation, or channel strategy, then turn that decision into actions with clear owners.",
      },
      {
        num: "03",
        title: "Connect the work",
        body: "Get Revenue, Sales, Reservations, and Marketing working from the same data, and connect your PMS, channel manager, RMS, and booking engine so rates and inventory stay consistent across every channel.",
      },
      {
        num: "04",
        title: "Measure the change",
        body: "Track RevPAR, net RevPAR, ADR, occupancy, and cost of acquisition by channel, then review results to set the next priority.",
      },
    ],
    exampleEyebrow: "Example",
    exampleTitle: "When occupancy for the next 60 days is falling short of target",
    exampleLead:
      "Instead of cutting rates across every channel right away, The KPI Plus helps your team find the root cause first, then build a plan that lifts bookings while protecting ADR and net revenue.",
    exampleSteps: [
      ["01", "DEMAND", "Check booking pace and pickup against last year and budget"],
      ["02", "DEMAND", "Review market demand, including seasonality, events, and inbound flights"],
      ["03", "PRICING", "Check competitor rate positioning"],
      ["04", "CHANNEL", "Review channel performance: direct vs. OTA mix, conversion, and cost per booking"],
      ["05", "DISTRIBUTION", "Check rate parity and inventory availability on each channel"],
      ["06", "SEGMENT", "Review segment mix and restrictions such as minimum stay or closed to arrival"],
      ["07", "PRICING", "Choose the right lever: pricing, targeted promotion, distribution changes, or demand generation"],
      ["08", "REVIEW", "Assign owners and timelines"],
      ["09", "REVIEW", "Review results at 7 and 14 days, then adjust the plan"],
    ],
    close: "Want to know which channels bring your hotel the most net revenue?",
    cta: "Start with a Revenue & Distribution review from The KPI Plus",
  },
  ru: {
    eyebrow: "Revenue & Commercial Management",
    title: "Сделать цену и дистрибуцию ясными, чтобы каждое решение по доходу опиралось на данные",
    lead: "Цена, каналы и спрос дают полный доход, когда команда отеля работает с одним набором данных, знает, кто за что отвечает, и может измерить ADR, загрузку и чистый доход после комиссии.",
    subline: "Продавать нужный номер нужному гостю, по нужной цене, через самый выгодный канал.",
    photoAlt: "Команда отеля разбирает booking pace, цены и дистрибуцию",
    method: "Подход The KPI Plus",
    steps: [
      {
        num: "01",
        title: "Ясно прочитать сигналы",
        body: "Смотреть booking pace, pickup, прогноз, спрос рынка и channel mix в одной картине, чтобы понять, давление идёт от цены, спроса или дистрибуции.",
      },
      {
        num: "02",
        title: "Выбрать следующий шаг",
        body: "Решить, менять цену, ограничения, распределение номеров или стратегию каналов, затем превратить это в работу с ясным владельцем.",
      },
      {
        num: "03",
        title: "Связать работу",
        body: "Чтобы Revenue, Sales, Reservations и Marketing работали с одними данными, а PMS, channel manager, RMS и booking engine держали цену и наличие одинаковыми во всех каналах.",
      },
      {
        num: "04",
        title: "Измерить изменение",
        body: "Следить за RevPAR, net RevPAR, ADR, загрузкой и стоимостью брони по каналам, затем пересматривать результат и ставить следующий приоритет.",
      },
    ],
    exampleEyebrow: "Пример",
    exampleTitle: "Когда загрузка на ближайшие 60 дней ниже цели",
    exampleLead:
      "Вместо того чтобы сразу снижать цену во всех каналах, The KPI Plus помогает команде сначала найти причину, затем построить план, который поднимает брони и защищает ADR и чистый доход.",
    exampleSteps: [
      ["01", "DEMAND", "Сравнить booking pace и pickup с прошлым годом и бюджетом"],
      ["02", "DEMAND", "Посмотреть спрос рынка: сезон, события и входящие рейсы"],
      ["03", "PRICING", "Проверить позиционирование цены конкурентов"],
      ["04", "CHANNEL", "Разобрать каналы: долю Direct и OTA, конверсию и стоимость брони"],
      ["05", "DISTRIBUTION", "Проверить паритет цен и наличие в каждом канале"],
      ["06", "SEGMENT", "Посмотреть mix сегментов и ограничения, например minimum stay или close to arrival"],
      ["07", "PRICING", "Выбрать рычаг: цена, акция для нужной группы, дистрибуция или создание спроса"],
      ["08", "REVIEW", "Назначить владельцев и сроки"],
      ["09", "REVIEW", "Пересмотреть результат на 7 и 14 день, затем скорректировать план"],
    ],
    close: "Хотите знать, какие каналы дают отелю больше всего чистого дохода?",
    cta: "Начните с обзора Revenue & Distribution от The KPI Plus",
  },
  zh: {
    eyebrow: "Revenue & Commercial Management",
    title: "讓價格與通路清楚，每項收益決策都有資料支撐",
    lead: "當飯店團隊用同一組資料做事、知道誰負責、並能量 ADR、住房率與扣除佣金後的淨收益時，價格、通路與需求才能把收益做滿。",
    subline: "把對的房間，用對的價格，透過最划算的通路，賣給對的客人。",
    photoAlt: "飯店團隊檢視 Booking Pace、價格與通路",
    method: "The KPI Plus 的做法",
    steps: [
      {
        num: "01",
        title: "把訊號看清楚",
        body: "把 Booking Pace、Pickup、預測、市場需求與 Channel Mix 看成同一張圖，才能分辨壓力來自價格、需求還是通路。",
      },
      {
        num: "02",
        title: "選擇下一步",
        body: "決定該調整價格、限制、庫存分配或通路策略，再把決定變成有明確負責人的工作。",
      },
      {
        num: "03",
        title: "把相關工作連起來",
        body: "讓 Revenue、Sales、Reservations 與 Marketing 用同一組資料工作，並串接 PMS、Channel Manager、RMS 與 Booking Engine，讓各通路的價格與庫存一致。",
      },
      {
        num: "04",
        title: "衡量變化",
        body: "追蹤 RevPAR、Net RevPAR、ADR、住房率與各通路的獲客成本，再回顧結果以決定下一件優先事項。",
      },
    ],
    exampleEyebrow: "例子",
    exampleTitle: "當未來 60 天住房率低於目標",
    exampleLead:
      "不必立刻在所有通路降價。The KPI Plus 會先幫團隊找出原因，再擬定能提高預訂、同時保護 ADR 與淨收益的計畫。",
    exampleSteps: [
      ["01", "DEMAND", "把 Booking Pace 與 Pickup 對去年和 Budget 比較"],
      ["02", "DEMAND", "看市場需求，包括淡旺季、活動與入境航班"],
      ["03", "PRICING", "檢查競爭對手的價格定位"],
      ["04", "CHANNEL", "檢視通路表現：直銷與 OTA 占比、轉換與每筆預訂成本"],
      ["05", "DISTRIBUTION", "檢查各通路的價格一致性與可售庫存"],
      ["06", "SEGMENT", "檢視客群組合與限制，例如 Minimum Stay 或 Close to Arrival"],
      ["07", "PRICING", "選擇槓桿：定價、針對特定客群的促銷、調整通路，或創造需求"],
      ["08", "REVIEW", "指定負責人與時間"],
      ["09", "REVIEW", "在第 7 與第 14 天回顧結果，再調整計畫"],
    ],
    close: "想知道哪些通路為飯店帶來最多淨收益？",
    cta: "從 The KPI Plus 的 Revenue & Distribution 檢視開始",
  },
} as const;

export function ApproachView({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <SiteShell locale={locale} route={localizePath("/approach", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-approach-hero">
        <div className="kpi-wrap">
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {locale === "th" ? (
                  <>
                    <span className="kpi-home-h1-lead">บริหารราคาและช่องทางการขายให้ชัด</span>
                    <span className="kpi-home-h1-rest">
                      ทุกการตัดสินใจด้านรายได้มี<span className="kpi-home-accent">ข้อมูลรองรับ</span>
                    </span>
                  </>
                ) : (
                  t.title
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              <p className="kpi-approach-subline">{t.subline}</p>
              <HeroCta locale={locale} className="kpi-approach-hero-cta" />
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <img src={heroPhoto} alt={t.photoAlt} width={1200} height={900} />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-approach-method">
        <h2 className="kpi-h2">{t.method}</h2>
        <ol className="kpi-approach-steps">
          {t.steps.map((step, index) => (
            <li key={step.num} className="kpi-approach-step">
              {index < t.steps.length - 1 ? (
                <span className="kpi-approach-step-connector" aria-hidden="true" />
              ) : null}
              <span className="kpi-latin kpi-approach-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="kpi-approach-example border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-latin kpi-approach-example-eyebrow">{t.exampleEyebrow}</p>
          <h2 className="kpi-h2">{t.exampleTitle}</h2>
          <p className="kpi-approach-example-lead">{t.exampleLead}</p>
          <ol className="kpi-approach-checklist">
            {t.exampleSteps.map(([num, label, text]) => (
              <li key={num} className="kpi-approach-check-item">
                <span className="kpi-latin kpi-approach-num">{num}</span>
                <div className="kpi-approach-check-copy">
                  <span className="kpi-latin kpi-approach-check-label">{label}</span>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <aside className="kpi-approach-closer">
            <p className="kpi-approach-close">{t.close}</p>
            <Link href={auditHref(locale, "ota")} className="kpi-button kpi-approach-cta">
              {t.cta} <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
