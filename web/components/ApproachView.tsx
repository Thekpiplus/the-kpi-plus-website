import Link from "next/link";
import { HeroCta } from "@/components/HeroCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const copy = {
  th: {
    title: "บริหารราคาและช่องทางการขายให้ชัด ทุกการตัดสินใจด้านรายได้มีข้อมูลรองรับ",
    lead: "ราคา ช่องทางการขาย และ Demand จะสร้างรายได้ได้เต็มที่ เมื่อทีมโรงแรมเห็นข้อมูลชุดเดียวกัน รู้ว่าใครรับผิดชอบ และวัดผลได้ทั้ง ADR, Occupancy และรายได้สุทธิหลังหักค่าคอมมิชชัน",
    subline: "ขายห้องให้ถูกคน ในราคาที่เหมาะสม ผ่านช่องทางที่คุ้มค่าที่สุด",
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
      "ดู Booking Pace และ Pickup เทียบกับปีก่อนและ Budget",
      "ดู Market Demand ทั้งฤดูกาล อีเวนต์ และเที่ยวบินเข้าพื้นที่",
      "ตรวจ Competitor Rate Positioning",
      "ทบทวน Channel Performance: สัดส่วน Direct กับ OTA, Conversion และต้นทุนต่อการจอง",
      "ตรวจ Rate Parity และ Inventory ที่เปิดขายในแต่ละช่องทาง",
      "ทบทวน Segment Mix และ Restriction เช่น Minimum Stay หรือ Close to Arrival",
      "เลือกว่าควรทำ Pricing, Promotion เฉพาะกลุ่ม, ปรับ Distribution หรือ Demand Generation",
      "กำหนดเจ้าของงานและกรอบเวลา",
      "ทบทวนผลที่ 7 และ 14 วัน แล้วปรับแผนต่อ",
    ],
    close: "อยากรู้ว่าช่องทางไหนสร้างรายได้สุทธิให้โรงแรมคุณมากที่สุด?",
    cta: "เริ่มต้นด้วยการทบทวน Revenue & Distribution กับ เดอะ เคพีไอ พลัส",
  },
  en: {
    title: "Make pricing and distribution clear, so every revenue decision is backed by data",
    lead: "Pricing, channels, and demand deliver their full revenue potential when your hotel team works from the same data, knows who owns each action, and can measure results across ADR, occupancy, and net revenue after commissions.",
    subline: "Sell the right room to the right guest, at the right price, through the most profitable channel.",
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
      "Check booking pace and pickup against last year and budget",
      "Review market demand, including seasonality, events, and inbound flights",
      "Check competitor rate positioning",
      "Review channel performance: direct vs. OTA mix, conversion, and cost per booking",
      "Check rate parity and inventory availability on each channel",
      "Review segment mix and restrictions such as minimum stay or closed to arrival",
      "Choose the right lever: pricing, targeted promotion, distribution changes, or demand generation",
      "Assign owners and timelines",
      "Review results at 7 and 14 days, then adjust the plan",
    ],
    close: "Want to know which channels bring your hotel the most net revenue?",
    cta: "Start with a Revenue & Distribution review from The KPI Plus.",
  },
  ru: {
    title: "Сделать цену и дистрибуцию ясными, чтобы каждое решение по доходу опиралось на данные",
    lead: "Цена, каналы и спрос дают полный доход, когда команда отеля работает с одним набором данных, знает, кто за что отвечает, и может измерить ADR, загрузку и чистый доход после комиссии.",
    subline: "Продавать нужный номер нужному гостю, по нужной цене, через самый выгодный канал.",
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
      "Сравнить booking pace и pickup с прошлым годом и бюджетом",
      "Посмотреть спрос рынка: сезон, события и входящие рейсы",
      "Проверить позиционирование цены конкурентов",
      "Разобрать каналы: долю Direct и OTA, конверсию и стоимость брони",
      "Проверить паритет цен и наличие в каждом канале",
      "Посмотреть mix сегментов и ограничения, например minimum stay или close to arrival",
      "Выбрать рычаг: цена, акция для нужной группы, дистрибуция или создание спроса",
      "Назначить владельцев и сроки",
      "Пересмотреть результат на 7 и 14 день, затем скорректировать план",
    ],
    close: "Хотите знать, какие каналы дают отелю больше всего чистого дохода?",
    cta: "Начните с обзора Revenue & Distribution от The KPI Plus.",
  },
  zh: {
    title: "讓價格與通路清楚，每項收益決策都有資料支撐",
    lead: "當飯店團隊用同一組資料做事、知道誰負責、並能量 ADR、住房率與扣除佣金後的淨收益時，價格、通路與需求才能把收益做滿。",
    subline: "把對的房間，用對的價格，透過最划算的通路，賣給對的客人。",
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
      "把 Booking Pace 與 Pickup 對去年和 Budget 比較",
      "看市場需求，包括淡旺季、活動與入境航班",
      "檢查競爭對手的價格定位",
      "檢視通路表現：直銷與 OTA 占比、轉換與每筆預訂成本",
      "檢查各通路的價格一致性與可售庫存",
      "檢視客群組合與限制，例如 Minimum Stay 或 Close to Arrival",
      "選擇槓桿：定價、針對特定客群的促銷、調整通路，或創造需求",
      "指定負責人與時間",
      "在第 7 與第 14 天回顧結果，再調整計畫",
    ],
    close: "想知道哪些通路為飯店帶來最多淨收益？",
    cta: "從 The KPI Plus 的 Revenue & Distribution 檢視開始。",
  },
} as const;

export function ApproachView({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <SiteShell locale={locale} route={localizePath("/approach", locale)}>
      <PageHero>
        <h1 className="kpi-h1">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-[#F2F8E2]">{t.subline}</p>
        <HeroCta locale={locale} className="mt-8" />
      </PageHero>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.method}</h2>
        <div className="kpi-grid-2 mt-10">
          {t.steps.map((step) => (
            <article key={step.num} className="kpi-card p-7">
              <span className="text-sm font-black tracking-[.16em] text-[#0B6660]">{step.num}</span>
              <h3 className="mt-6 text-2xl font-extrabold tracking-[-.04em] text-[#3B3B3B]">{step.title}</h3>
              <p className="mt-4 text-base leading-7 text-[#555555]">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#0B6660]">{t.exampleEyebrow}</p>
          <h2 className="kpi-h2 mt-4">{t.exampleTitle}</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.exampleLead}</p>
          <ol className="mt-10 grid gap-3">
            {t.exampleSteps.map((item, index) => (
              <li key={item} className="kpi-card flex gap-4 p-5 sm:items-center">
                <span className="text-sm font-black tracking-[.14em] text-[#0B6660]">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-base leading-7 text-[#555555]">{item}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl text-lg leading-8 text-[#3B3B3B]">{t.close}</p>
          <Link href={auditHref(locale, "ota")} className="kpi-button mt-5">
            {t.cta}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
