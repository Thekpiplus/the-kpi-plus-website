import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { RevenueEnquiry } from "@/components/RevenueEnquiry";
import { RevenueStickyCta } from "@/components/RevenueStickyCta";
import { SiteShell } from "@/components/SiteShell";
import { caseStudiesHeading } from "@/components/CaseStudiesView";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const relatedInsightHrefs = ["/insights/hotel-revenue-meetings-that-lead-to-decisions"] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "บริหารรายได้และกลยุทธ์การขาย",
    title: "ดูแลมากกว่าราคาห้องพัก เพื่อให้ทุกช่องทางขายทำงานร่วมกัน",
    lead: "การเพิ่มรายได้โรงแรมไม่ได้จบที่การปรับราคาห้อง เดอะ เคพีไอ พลัส ช่วยดูทั้งราคา ห้องว่าง OTA การจองตรง การตลาด ระบบที่ใช้ และข้อมูลผลประกอบการ เพื่อให้โรงแรมเห็นว่าโอกาสอยู่ตรงไหนและทีมควรลงมือทำอะไรต่อ",
    leadClose:
      "โรงแรมสามารถเริ่มจาก Revenue Management เฉพาะส่วนที่ต้องการ หรือให้เราช่วยดูแล Commercial Management ในภาพกว้างขึ้นตามขอบเขตงานที่ตกลงกัน",
    cta: "ให้ทีมดูโอกาสเพิ่มรายได้ของโรงแรม",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม จำนวนห้อง และลิงก์ที่พัก เพื่อให้ทีมดูจุดเริ่มต้น",
    photoAlt: "ทีมโรงแรมดูราคา ช่องทางขาย และแผนรายได้ร่วมกัน",
    problemTitle: "โรงแรมของคุณกำลังเจอเรื่องนี้หรือไม่?",
    problems: [
      "ห้องพักเต็มหลายคืน แต่ราคาเฉลี่ยยังต่ำ",
      "มีห้องว่างบางช่วง และไม่แน่ใจว่าควรปรับราคา โปรโมชัน หรือช่องทางขาย",
      "OTA สร้างยอดจอง แต่ยังไม่เห็นชัดว่ารายได้หลังต้นทุนเหลือเท่าไร",
      "อยากเพิ่มการจองตรง แต่เว็บไซต์ ระบบจอง และการตลาดยังไม่เชื่อมกัน",
      "มีข้อมูลในหลายระบบ แต่ไม่มีใครนำมารวมเป็นแผนที่ทีมลงมือทำได้",
      "ทีมขาย การตลาด และปฏิบัติการทำงานหนัก แต่ยังไม่เห็นเป้าหมายรายได้ร่วมกัน",
    ],
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยดูแลส่วนไหนได้บ้าง?",
    help: [
      ["01", "Revenue Management", "วิเคราะห์ยอดจองล่วงหน้า ความต้องการของตลาด ราคา และห้องว่าง เพื่อวางแผนว่าวันไหนควรรักษาราคา ปรับราคา หรือเปลี่ยนข้อเสนอ"],
      ["02", "Distribution และ OTA", "ดูว่าโรงแรมขายผ่านช่องทางใด แต่ละช่องทางสร้างยอดจองแบบไหน มีต้นทุนเท่าไร และควรจัดห้องว่างหรือข้อเสนออย่างไร"],
      ["03", "Direct Booking", "ตรวจเส้นทางจากเว็บไซต์ Google หรือสื่อการตลาด ไปจนถึงระบบจองและการตอบคำถาม เพื่อหาจุดที่ทำให้ลูกค้าตัดสินใจจองตรงได้ง่ายขึ้น"],
      ["04", "Marketing และ Demand", "เชื่อมแผนการตลาดกับวันที่โรงแรมต้องการยอดขายจริง ไม่ว่าจะเป็นการค้นหาบน Google โฆษณา เนื้อหา หรือโปรโมชัน โดยเลือกงานตามความพร้อมและเป้าหมายของโรงแรม"],
      ["05", "Systems, Data และ Reporting", "ดูว่า PMS, Channel Manager, Booking Engine และรายงานที่มีอยู่ช่วยให้ทีมตัดสินใจได้หรือยัง พร้อมจัดข้อมูลให้เห็นผลและสิ่งที่ต้องทำต่อ"],
    ],
    helpClose: "โรงแรมไม่จำเป็นต้องใช้ทุกบริการพร้อมกัน เราจะช่วยจัดลำดับว่าส่วนใดมีผลต่อรายได้และควรเริ่มก่อน",
    methodTitle: "เราทำงานจากข้อมูลไปสู่การตัดสินใจ",
    steps: [
      ["01", "ดูภาพรวมโรงแรม", "ราคา ห้องว่าง ยอดจอง ช่องทางขาย เว็บไซต์ ระบบ และวิธีทำงานของทีม"],
      ["02", "หาจุดที่เสียโอกาส", "เช่น ห้องที่ขายเร็วเกินไป วันที่ยังขายช้า ต้นทุนช่องทางสูง หรือขั้นตอนจองตรงที่ไม่สะดวก"],
      ["03", "กำหนดขอบเขตและแผนงาน", "เลือกว่าจะเริ่มจาก Revenue Management หรือให้ทีมช่วยดูแล Commercial Management หลายส่วนร่วมกัน"],
      ["04", "ลงมือและทบทวนผล", "ระบุสิ่งที่ต้องทำ ผู้รับผิดชอบ และตัวเลขที่ใช้ติดตาม แล้วปรับแผนตามสถานการณ์จริง"],
    ],
    measureTitle: "เราดูผลอย่างไร?",
    measureBody:
      "เราเริ่มจากตัวเลขห้องพัก เช่น Occupancy, ADR, RevPAR และความเร็วของการจองล่วงหน้า แล้วดูต่อถึงสัดส่วนยอดขายแต่ละช่องทาง ต้นทุนการขาย การสอบถาม และการจองตรงตามข้อมูลที่โรงแรมตรวจสอบได้",
    measureClose: "เป้าหมายคือให้เจ้าของโรงแรมเห็นมากกว่า “เดือนนี้ขายได้เท่าไร” แต่เห็นด้วยว่ารายได้มาจากไหน ต้นทุนเป็นอย่างไร และควรทำอะไรต่อ",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับรายได้ ช่องทาง และการจองตรง",
    details: "ดูรายละเอียด",
    toolName: "คำนวณ RevPAR, ADR และ Occupancy",
    toolBody: "ดูตัวเลขห้องพักพื้นฐานก่อนคุยเรื่องราคา ช่องทางขาย หรือแผนรายได้",
    toolCta: "ใช้เครื่องมือฟรี",
    reservationTitle: "บริการทีมรับจองสำหรับโรงแรม",
    reservationBody: "เมื่อมีคำถามเข้ามาแล้ว เส้นทางจากสอบถามถึงการจองต้องชัดพอให้ทีมปิดการขายได้",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Revenue & Commercial Management for hotels",
    title: "Look after more than the room rate, so every sales channel can work together",
    lead: "Growing hotel revenue does not end with a rate change. The KPI Plus reviews rates, rooms, OTAs, direct booking, marketing, the systems in use, and the result, so the hotel can see where the chance sits and what the team should do next.",
    leadClose:
      "A hotel can start with the Revenue Management it needs, or ask us to look after a wider Commercial Management scope that is agreed in advance.",
    cta: "Ask the team to review a hotel revenue opportunity",
    secondary: "All solutions",
    underCta: "Send the hotel name, room count, and a listing link for a first look.",
    photoAlt: "A hotel team reviewing rates, channels, and a revenue plan together",
    problemTitle: "Does any of this sound like the hotel now?",
    problems: [
      "Many nights are full, but the average rate is still low",
      "Some dates still have rooms, and it is unclear whether to change the rate, the offer, or the channel",
      "OTAs create bookings, but the revenue left after cost is still unclear",
      "The hotel wants more direct bookings, but the website, booking path, and marketing are not connected",
      "Data sits in several systems, and no one has turned it into a plan the team can run",
      "Sales, marketing, and operations work hard, but they do not share one revenue goal",
    ],
    helpTitle: "Which parts can The KPI Plus look after?",
    help: [
      ["01", "Revenue Management", "Review forward bookings, market demand, rates, and rooms, then plan which dates should hold rate, change rate, or change the offer."],
      ["02", "Distribution and OTAs", "See which channels the hotel sells through, what each channel books, what it costs, and how rooms or offers should be allocated."],
      ["03", "Direct Booking", "Check the path from the website, Google, or marketing through to the booking system and the reply, and find the points that make a direct booking easier."],
      ["04", "Marketing and demand", "Connect the marketing plan to the dates the hotel actually needs to sell, whether that is Google search, ads, content, or a promotion, chosen from the hotel’s readiness and goal."],
      ["05", "Systems, data, and reporting", "See whether the PMS, channel manager, booking engine, and current reports help the team decide, then organise the data so the result and the next action are visible."],
    ],
    helpClose: "The hotel does not have to use every service at once. We help set the order of the parts that affect revenue and should start first.",
    methodTitle: "We work from the data to a decision",
    steps: [
      ["01", "See the hotel as a whole", "Rates, rooms, bookings, channels, the website, the systems, and how the team works."],
      ["02", "Find the missed chance", "Rooms that sold too fast, dates that still sell slowly, high channel cost, or a direct-booking path that is hard to finish."],
      ["03", "Set the scope and the plan", "Choose whether to start with Revenue Management or have the team look after several Commercial Management parts together."],
      ["04", "Act and review", "Name the work, the owner, and the numbers used to review, then adjust the plan from the real situation."],
    ],
    measureTitle: "How do we review the result?",
    measureBody:
      "We start with room numbers such as occupancy, ADR, RevPAR, and booking pace, then look at channel mix, selling cost, enquiries, and direct bookings from data the hotel can check.",
    measureClose: "The aim is for the owner to see more than “how much we sold this month”: where the revenue came from, what it cost, and what to do next.",
    relatedTitle: "Related reading on revenue, channels, and direct booking",
    details: "Read more",
    toolName: "RevPAR, ADR and occupancy",
    toolBody: "See the basic room numbers before the conversation about rates, channels, or a revenue plan.",
    toolCta: "Use the free tool",
    reservationTitle: "Reservation Management",
    reservationBody: "After the enquiry arrives, the path from the question to a booking still has to be clear enough for the team to close.",
  },
  ru: {
    crumb: "Решения",
    eyebrow: "Revenue & Commercial Management для отелей",
    title: "Смотреть шире цены номера, чтобы каналы продаж работали вместе",
    lead: "Рост дохода отеля не заканчивается сменой цены. The KPI Plus смотрит цену, номера, OTA, прямое бронирование, маркетинг, системы и результат, чтобы отель видел, где шанс и что команде делать дальше.",
    leadClose:
      "Отель может начать с нужной части Revenue Management или попросить нас вести более широкий Commercial Management в согласованных границах.",
    cta: "Попросить команду посмотреть, где отель может увеличить доход",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, число номеров и ссылку на объект для первого просмотра.",
    photoAlt: "Команда отеля вместе смотрит цены, каналы и план по доходу",
    problemTitle: "Похоже ли это на ваш отель сейчас?",
    problems: [
      "Много ночей занято, но средняя цена всё ещё низкая",
      "На часть дат есть номера, и непонятно, менять цену, предложение или канал",
      "OTA дают брони, но доход после затрат всё ещё неясен",
      "Хочется больше прямых броней, но сайт, путь бронирования и маркетинг не связаны",
      "Данные лежат в разных системах, и никто не собрал их в план, который команда может выполнить",
      "Продажи, маркетинг и операции работают много, но общей цели по доходу нет",
    ],
    helpTitle: "Какие части может взять The KPI Plus?",
    help: [
      ["01", "Revenue Management", "Смотреть бронь вперёд, спрос, цену и номера, затем планировать, какие даты держать цену, менять цену или менять предложение."],
      ["02", "Дистрибуция и OTA", "Видеть, через какие каналы отель продаёт, какие брони даёт каждый канал, сколько это стоит и как распределять номера или предложения."],
      ["03", "Direct Booking", "Проверить путь с сайта, Google или маркетинга до системы брони и ответа и найти места, где прямую бронь сделать проще."],
      ["04", "Маркетинг и спрос", "Связать план маркетинга с датами, которые отелю реально нужно продавать: поиск в Google, реклама, контент или акция — по готовности и цели отеля."],
      ["05", "Системы, данные и отчётность", "Понять, помогают ли PMS, channel manager, booking engine и текущие отчёты команде решать, затем собрать данные так, чтобы был виден результат и следующий шаг."],
    ],
    helpClose: "Отелю не нужно брать все услуги сразу. Мы поможем выстроить порядок частей, которые влияют на доход и должны начаться первыми.",
    methodTitle: "Идём от данных к решению",
    steps: [
      ["01", "Посмотреть отель целиком", "Цена, номера, брони, каналы, сайт, системы и как работает команда."],
      ["02", "Найти упущенный шанс", "Номера, которые ушли слишком быстро, даты, которые ещё продаются медленно, дорогой канал или неудобный путь прямой брони."],
      ["03", "Задать границы и план", "Выбрать, начинать с Revenue Management или вести несколько частей Commercial Management вместе."],
      ["04", "Действовать и разбирать результат", "Назвать работу, ответственного и цифры для проверки, затем скорректировать план по реальной ситуации."],
    ],
    measureTitle: "Как мы смотрим результат?",
    measureBody:
      "Начинаем с цифр по номерам: загрузка, ADR, RevPAR и скорость брони вперёд. Затем смотрим долю каналов, стоимость продаж, вопросы и прямые брони по данным, которые отель может проверить.",
    measureClose: "Цель — чтобы собственник видел больше, чем «сколько продали в этом месяце»: откуда пришёл доход, какая была стоимость и что делать дальше.",
    relatedTitle: "Материалы про доход, каналы и прямое бронирование",
    details: "Подробнее",
    toolName: "RevPAR, ADR и загрузка",
    toolBody: "Посмотреть базовые цифры по номерам до разговора о цене, каналах или плане дохода.",
    toolCta: "Использовать бесплатный инструмент",
    reservationTitle: "Reservation Management",
    reservationBody: "Когда вопрос уже пришёл, путь от запроса до брони всё равно должен быть достаточно ясным, чтобы команда могла закрыть продажу.",
  },
  zh: {
    crumb: "解決方案",
    eyebrow: "飯店的 Revenue & Commercial Management",
    title: "看的不只是房價，讓每個銷售通路一起運作",
    lead: "增加飯店收益，不會停在調一次房價。The KPI Plus 會看價格、空房、OTA、直銷預訂、行銷、現有系統與營運結果，讓飯店看清機會在哪，以及團隊接下來該做什麼。",
    leadClose:
      "飯店可以先從需要的 Revenue Management 開始，或依事先談好的範圍，讓我們協助看更廣的 Commercial Management。",
    cta: "請團隊看這間飯店哪裡有機會增加收益",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、房數與住宿連結，讓團隊先看起點。",
    photoAlt: "飯店團隊一起檢視價格、通路與收益計畫",
    problemTitle: "你的飯店現在是否遇到這些情況？",
    problems: [
      "很多晚上都客滿，平均房價卻仍然偏低",
      "某些日期還有空房，卻不確定該調價格、方案還是通路",
      "OTA 帶來預訂，卻還看不清扣掉成本後剩多少收益",
      "想增加直銷預訂，但網站、預訂系統與行銷還沒連在一起",
      "資料散在多個系統，沒有人把它整理成團隊做得到的計畫",
      "業務、行銷與營運都很忙，卻還沒有共同的收益目標",
    ],
    helpTitle: "The KPI Plus 能看哪些部分？",
    help: [
      ["01", "Revenue Management", "分析未來預訂、市場需求、價格與空房，規劃哪些日期該守價、調價或改方案。"],
      ["02", "通路與 OTA", "看飯店透過哪些通路賣、各通路帶來什麼預訂、成本多少，以及空房或方案該怎麼分配。"],
      ["03", "Direct Booking", "檢查從網站、Google 或行銷，走到預訂系統與回覆的路徑，找出讓客人更容易直銷預訂的點。"],
      ["04", "行銷與需求", "把行銷計畫接到飯店真正需要銷售的日期，無論是 Google 搜尋、廣告、內容或促銷，都依飯店的準備程度與目標來選。"],
      ["05", "系統、資料與報表", "看現有的 PMS、Channel Manager、Booking Engine 與報表是否幫得了團隊做決定，再把資料整理到看得到結果與下一步。"],
    ],
    helpClose: "飯店不必一次用全部服務。我們會幫忙排出哪些部分影響收益，以及該先從哪裡開始。",
    methodTitle: "從資料走到決策",
    steps: [
      ["01", "先看飯店全貌", "價格、空房、預訂、通路、網站、系統，以及團隊怎麼工作。"],
      ["02", "找出錯過的機會", "例如賣得太快的房間、仍賣得慢的日期、通路成本偏高，或直銷預訂流程不好走。"],
      ["03", "訂範圍與計畫", "決定先從 Revenue Management 開始，或讓團隊一起看 Commercial Management 的多個部分。"],
      ["04", "執行並檢視結果", "寫明要做的事、負責人與用來追蹤的數字，再依實際情況調整計畫。"],
    ],
    measureTitle: "我們怎麼看結果？",
    measureBody:
      "先從住房率、ADR、RevPAR 與預訂速度這些客房數字開始，再看各通路占比、銷售成本、詢問與直銷預訂，且只用飯店能核對的資料。",
    measureClose: "目標是讓業主看到的不只是「這個月賣了多少」，還要看到收益從哪裡來、成本如何，以及接下來該做什麼。",
    relatedTitle: "與收益、通路與直銷預訂相關的內容",
    details: "查看詳情",
    toolName: "計算 RevPAR、ADR 與住房率",
    toolBody: "在談價格、通路或收益計畫前，先看基礎客房數字。",
    toolCta: "使用免費工具",
    reservationTitle: "Reservation Management",
    reservationBody: "詢問進來之後，從提問走到預訂的路徑仍須清楚到團隊能成交。",
  },
} as const;

export function RevenueView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const insights = insightPosts
    .filter((post) => relatedInsightHrefs.includes(post.href as (typeof relatedInsightHrefs)[number]))
    .filter((post) => existingHref(post.href, locale));
  const reservationHref = localizePath("/solutions/outsourced-hotel-reservations", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/revenue-commercial-management", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/revenue-commercial-management", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <div className="kpi-actions">
          <a href="#revenue-enquiry" className="kpi-button">
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
            <img src="/media/the-kpi-plus-revenue-scene_4932d3c7.jpg" alt={t.photoAlt} width={1200} height={900} />
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
          <p className="mt-8 max-w-3xl text-base leading-8 text-[#3B3B3B]">{t.helpClose}</p>
          <a href="#revenue-enquiry" className="kpi-button mt-8">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
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
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{t.toolName}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.toolBody}</p>
              <Link href="/tools/revpar-calculator" className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.toolCta}
              </Link>
            </article>
            {existingHref("/case-studies", locale) ? (
              <article className="kpi-card relative flex flex-col overflow-hidden p-7">
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{caseStudiesHeading[locale]}</h3>
                <Link href={existingHref("/case-studies", locale) ?? "/case-studies"} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                  {t.details}
                </Link>
              </article>
            ) : null}
            <article className="kpi-card relative flex flex-col overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{solutionNavLabel("/solutions/outsourced-hotel-reservations", locale)}</h3>
              <p className="mt-3 text-base leading-7 text-[#555555]">{t.reservationBody}</p>
              <Link href={reservationHref} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                {t.details}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <RevenueEnquiry locale={locale} />
      <RevenueStickyCta label={t.cta} />
    </SiteShell>
  );
}
