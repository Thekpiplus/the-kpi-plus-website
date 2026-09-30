import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { IndependentHotelEnquiry } from "@/components/IndependentHotelEnquiry";
import { IndependentHotelStickyCta } from "@/components/IndependentHotelStickyCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { solutionNavLabel } from "@/lib/nav";
import { localizePath, type Locale } from "@/lib/seo";

const photo = "/media/kpi-grow-revenue_f786a5a5.jpg";

const copy = {
  th: {
    crumb: "โซลูชัน",
    crumbCurrent: "บริหารโรงแรมอิสระ",
    eyebrow: "บริหารโรงแรมอิสระ",
    title: "บริหารโรงแรมอิสระให้เดินงานได้จริง และเติบโตอย่างมีทิศทาง",
    lead: "โรงแรมที่ดีต้องมีมากกว่าห้องพักที่พร้อมขาย ต้องมีทีมที่เหมาะสม ระบบงานที่ชัดเจน การบริการที่สม่ำเสมอ และแผนสร้างรายได้ที่สอดคล้องกับตลาด",
    leadClose:
      "เดอะ เคพีไอ พลัส ช่วยเจ้าของโรงแรมอิสระวางแนวทางบริหารให้เหมาะกับทรัพย์สินและเป้าหมายของตัวเอง ตั้งแต่การจัดหาทีมบริหาร วางระบบการดำเนินงาน ไปจนถึงการดูแลรายได้ ช่องทางขาย และผลประกอบการ",
    start: "เราเริ่มจากการพูดคุย เพื่อให้เข้าใจว่าโรงแรมของคุณมีอะไรอยู่แล้ว ต้องการความช่วยเหลือส่วนไหน และควรทำงานร่วมกันอย่างไร",
    cta: "นัดพูดคุยเรื่องโรงแรมของคุณ",
    underCta: "ไม่ต้องเตรียมขอบเขตงานไว้ก่อน เล่าให้เราฟังเกี่ยวกับโรงแรมและเป้าหมาย",
    photoAlt: "เจ้าของโรงแรมอิสระทบทวนทีม ระบบงาน และแผนรายได้",
    needTitle: "โรงแรมของคุณต้องการความช่วยเหลือแบบไหน?",
    needLead:
      "บางโรงแรมมีทีมงานพร้อม แต่ต้องการผู้ช่วยวางกลยุทธ์และติดตามผล บางโรงแรมกำลังเปลี่ยนผ่านทีมบริหาร ขณะที่บางแห่งต้องการเริ่มวางระบบใหม่ตั้งแต่ต้น",
    needClose: "เราไม่ได้กำหนดขอบเขตบริการเหมือนกันทุกแห่ง แต่ร่วมกับเจ้าของออกแบบวิธีบริหารที่ตอบโจทย์โรงแรมจริง",
    helpTitle: "สิ่งที่เราช่วยโรงแรมได้",
    help: [
      ["01", "จัดหาและวางทีมบริหาร", "ประเมินโครงสร้างทีมที่โรงแรมต้องการ ช่วยค้นหาผู้บริหารและบุคลากรที่เหมาะสม พร้อมกำหนดบทบาท หน้าที่ และวิธีทำงานร่วมกันให้ชัดเจน"],
      ["02", "วางระบบการดำเนินงาน", "ทบทวนและพัฒนาขั้นตอนการทำงานของโรงแรม ทั้งการรับจอง การต้อนรับแขก งานห้องพัก การประสานงานระหว่างแผนก และการติดตามปัญหาหน้างาน เพื่อให้ทีมทำงานได้ต่อเนื่องและรักษามาตรฐานบริการ"],
      ["03", "บริหารรายได้และช่องทางขาย", "วิเคราะห์ตลาด วางราคาและโปรโมชั่น ดูแลช่องทางจองออนไลน์ และติดตามผลการขาย เพื่อให้โรงแรมปรับตัวตามความต้องการของลูกค้าและใช้ศักยภาพของห้องพักได้ดีขึ้น"],
      ["04", "พัฒนาการตลาดและการจองตรง", "ดูว่าลูกค้าค้นพบ เปรียบเทียบ และตัดสินใจจองโรงแรมอย่างไร แล้ววางแนวทางพัฒนาเว็บไซต์ ข้อมูลบนช่องทางออนไลน์ และการสื่อสารที่ช่วยสร้างโอกาสในการจองตรง"],
      ["05", "เลือกใช้ระบบและเทคโนโลยี", "ช่วยประเมินและจัดระบบที่จำเป็นต่อการทำงาน เช่น PMS, Channel Manager และระบบจองตรง รวมถึงนำ AI และ Automation มาใช้ในจุดที่ช่วยลดงานซ้ำและทำให้ทีมมีเวลาดูแลแขกมากขึ้น"],
      ["06", "ติดตามผลประกอบการร่วมกับเจ้าของ", "กำหนดเป้าหมาย ตัวชี้วัด และรูปแบบรายงานที่เจ้าของใช้ตัดสินใจได้จริง พร้อมพูดคุยอย่างสม่ำเสมอว่าอะไรได้ผล อะไรเป็นปัญหา และควรปรับแผนอย่างไร"],
    ],
    methodTitle: "วิธีเริ่มต้นทำงานร่วมกัน",
    steps: [
      ["01", "พูดคุยและเข้าใจโรงแรม", "เราเรียนรู้เป้าหมายของเจ้าของ สภาพการดำเนินงาน ทีมที่มีอยู่ ผลประกอบการ และความท้าทายของโรงแรม"],
      ["02", "กำหนดขอบเขตงานร่วมกัน", "ตกลงให้ชัดว่า เดอะ เคพีไอ พลัส จะรับผิดชอบเรื่องใด ทีมโรงแรมรับผิดชอบเรื่องใด ต้องจัดหาคนเพิ่มเติมหรือไม่ และจะประสานงานกันอย่างไร"],
      ["03", "วางแผนและเริ่มดำเนินงาน", "จัดลำดับสิ่งที่ต้องทำก่อน กำหนดผู้รับผิดชอบและเป้าหมาย แล้วติดตามผลเพื่อปรับแผนตามสถานการณ์จริง"],
    ],
    fitTitle: "เหมาะกับเจ้าของโรงแรมอิสระที่…",
    fit: [
      "ต้องการทีมบริหารหรือผู้ช่วยดูแลการดำเนินงาน",
      "มีทีมอยู่แล้ว แต่อยากให้ระบบงานและความรับผิดชอบชัดขึ้น",
      "ต้องการพัฒนารายได้ การขาย และผลประกอบการ",
      "กำลังเตรียมเปิดโรงแรม หรือปรับแนวทางบริหารโรงแรมเดิม",
      "ต้องการเห็นข้อมูลและความคืบหน้าเพื่อใช้ตัดสินใจในฐานะเจ้าของ",
    ],
    closerTitle: "มาคุยกันว่าโรงแรมของคุณควรเริ่มตรงไหน",
    closerBody:
      "คุณไม่จำเป็นต้องเตรียมขอบเขตงานไว้ก่อน เพียงเล่าให้เราฟังเกี่ยวกับโรงแรม เป้าหมาย และเรื่องที่อยากให้ช่วย เราจะร่วมกันหาวิธีทำงานที่เหมาะสม พร้อมกำหนดหน้าที่และความรับผิดชอบให้ชัดเจนก่อนเริ่มงาน",
    closerCta: "นัดพูดคุยเรื่องการบริหารโรงแรม",
  },
  en: {
    crumb: "Solutions",
    crumbCurrent: "Independent Hotel Management",
    eyebrow: "Independent Hotel Management",
    title: "Run an independent hotel so the work moves, and growth has a direction",
    lead: "A good hotel needs more than rooms that are ready to sell. It needs the right team, a clear way of working, consistent service, and a revenue plan that fits the market.",
    leadClose:
      "The KPI Plus helps independent hotel owners set a way of running the hotel that fits the property and their own goal, from finding a management team and setting operations through to looking after revenue, sales channels, and the result.",
    start: "We start with a conversation, so we understand what the hotel already has, which part needs help, and how we should work together.",
    cta: "Book a conversation about your hotel",
    underCta: "You do not need a scope in advance. Tell us about the hotel and the goal.",
    photoAlt: "An independent hotel owner reviewing the team, the way of working, and the revenue plan",
    needTitle: "What kind of help does the hotel need?",
    needLead:
      "Some hotels already have a team, but need someone to set the strategy and follow the result. Some are changing the management team. Others need to set a new way of working from the start.",
    needClose: "We do not set the same service scope for every hotel. We design the way of running it with the owner, around the real hotel.",
    helpTitle: "What we can help a hotel with",
    help: [
      ["01", "Find and set the management team", "Review the team structure the hotel needs, help find suitable managers and people, and make roles, duties, and how people work together clear."],
      ["02", "Set the operating system", "Review and develop the hotel’s work steps: taking bookings, receiving guests, housekeeping, work between departments, and following floor problems, so the team can keep going and hold the service standard."],
      ["03", "Look after revenue and sales channels", "Read the market, set rates and offers, look after online booking channels, and follow sales results, so the hotel can adjust to guest demand and use the rooms better."],
      ["04", "Develop marketing and direct booking", "See how guests find, compare, and decide to book the hotel, then set a path to improve the website, online facts, and the communication that creates a direct-booking chance."],
      ["05", "Choose systems and technology", "Help assess and set the systems the work needs, such as the PMS, channel manager, and direct booking system, and use AI and automation where they cut repeated work and free time to look after guests."],
      ["06", "Follow the result with the owner", "Set goals, measures, and a report format the owner can actually decide from, and talk regularly about what works, what is a problem, and how the plan should change."],
    ],
    methodTitle: "How we start working together",
    steps: [
      ["01", "Talk and understand the hotel", "We learn the owner’s goal, how the hotel is running, the team in place, the result, and the hotel’s challenges."],
      ["02", "Agree the scope together", "Make it clear what The KPI Plus will own, what the hotel team will own, whether more people must be found, and how we will coordinate."],
      ["03", "Plan and start the work", "Put first things first, name owners and goals, then follow the result and adjust the plan to the real situation."],
    ],
    fitTitle: "This fits independent hotel owners who…",
    fit: [
      "Need a management team, or someone to help look after operations",
      "Already have a team, but want clearer work systems and ownership",
      "Want to develop revenue, sales, and the hotel result",
      "Are preparing to open a hotel, or to change how the current hotel is run",
      "Want facts and progress they can use to decide as the owner",
    ],
    closerTitle: "Let’s talk about where your hotel should start",
    closerBody:
      "You do not need a scope in advance. Tell us about the hotel, the goal, and what you want help with. We will find a way of working that fits, and make roles and ownership clear before the work starts.",
    closerCta: "Book a conversation about hotel management",
  },
  ru: {
    crumb: "Решения",
    crumbCurrent: "Управление независимым отелем",
    eyebrow: "Управление независимым отелем",
    title: "Управлять независимым отелем так, чтобы работа шла и рост имел направление",
    lead: "Хорошему отелю нужно больше, чем номера, готовые к продаже. Нужна подходящая команда, ясный способ работы, стабильный сервис и план дохода, который соответствует рынку.",
    leadClose:
      "The KPI Plus помогает владельцам независимых отелей выстроить управление под объект и их цель: от подбора управляющей команды и операционной системы до дохода, каналов продаж и результата.",
    start: "Мы начинаем с разговора, чтобы понять, что у отеля уже есть, какая часть нужна помощь и как нам работать вместе.",
    cta: "Назначить разговор об отеле",
    underCta: "Готовить объём работы заранее не нужно. Расскажите об отеле и цели.",
    photoAlt: "Владелец независимого отеля разбирает команду, способ работы и план дохода",
    needTitle: "Какая помощь нужна отелю?",
    needLead:
      "У одних отелей команда уже есть, но нужен человек, который выстроит стратегию и будет следить за результатом. Другие меняют управляющую команду. Третьим нужно выстроить систему работы с нуля.",
    needClose: "Мы не задаём один и тот же объём услуг для каждого отеля. Вместе с владельцем проектируем способ управления под реальный объект.",
    helpTitle: "Чем мы можем помочь отелю",
    help: [
      ["01", "Подобрать и выстроить управляющую команду", "Оценить нужную структуру команды, помочь найти подходящих руководителей и людей, ясно задать роли, обязанности и способ совместной работы."],
      ["02", "Выстроить операционную систему", "Разобрать и развить шаги работы отеля: приём брони, встречу гостя, работу номерного фонда, взаимодействие отделов и разбор проблем на смене, чтобы команда работала непрерывно и держала стандарт сервиса."],
      ["03", "Вести доход и каналы продаж", "Читать рынок, ставить цены и акции, вести онлайн-каналы брони и смотреть результат продаж, чтобы отель подстраивался под спрос и лучше использовал номера."],
      ["04", "Развивать маркетинг и прямое бронирование", "Понять, как гость находит, сравнивает и решает бронировать отель, затем выстроить путь улучшения сайта, онлайн-данных и коммуникации, которая даёт шанс прямой брони."],
      ["05", "Выбрать системы и технологии", "Помочь оценить и выстроить нужные системы — PMS, Channel Manager и систему прямой брони — и использовать ИИ и автоматизацию там, где они сокращают повторную работу и оставляют команде время на гостя."],
      ["06", "Следить за результатом вместе с владельцем", "Задать цели, показатели и формат отчёта, по которому владелец реально решает, и регулярно говорить, что работает, что является проблемой и как менять план."],
    ],
    methodTitle: "Как мы начинаем работать вместе",
    steps: [
      ["01", "Поговорить и понять отель", "Узнать цель владельца, как отель работает сейчас, какая команда есть, какой результат и какие сложности."],
      ["02", "Совместно задать границы работы", "Ясно договориться, за что отвечает The KPI Plus, за что — команда отеля, нужно ли искать людей дополнительно и как будем координироваться."],
      ["03", "Спланировать и начать работу", "Поставить сначала то, что нужно раньше, назвать ответственных и цели, затем следить за результатом и править план по реальной ситуации."],
    ],
    fitTitle: "Подходит владельцам независимых отелей, которые…",
    fit: [
      "Нуждаются в управляющей команде или помощнике по операциям",
      "Команда уже есть, но хотят яснее систему работы и ответственность",
      "Хотят развивать доход, продажи и результат отеля",
      "Готовят открытие отеля или меняют способ управления существующим",
      "Хотят видеть данные и прогресс, чтобы решать как владелец",
    ],
    closerTitle: "Давайте поговорим, с чего начать вашему отелю",
    closerBody:
      "Готовить объём работы заранее не нужно. Расскажите об отеле, цели и том, с чем нужна помощь. Вместе найдём подходящий способ работы и ясно зададим роли и ответственность до старта.",
    closerCta: "Назначить разговор об управлении отелем",
  },
  zh: {
    crumb: "方案",
    crumbCurrent: "獨立飯店管理",
    eyebrow: "獨立飯店管理",
    title: "讓獨立飯店真正把工作跑起來，成長也有方向",
    lead: "一間好飯店需要的不只是準備好可賣的客房，還要有合適的團隊、清楚的作業系統、穩定的服務，以及符合市場的收益計畫。",
    leadClose:
      "The KPI Plus 協助獨立飯店業主，依自己的資產與目標規劃管理方式：從尋找管理團隊、建立營運系統，到照顧收益、銷售通路與經營結果。",
    start: "我們從對談開始，先了解飯店已有什麼、需要協助哪一部分，以及雙方該如何合作。",
    cta: "預約談你的飯店",
    underCta: "不必先準備工作範圍。告訴我們飯店情況與目標即可。",
    photoAlt: "獨立飯店業主檢視團隊、作業系統與收益計畫",
    needTitle: "你的飯店需要哪一種協助？",
    needLead:
      "有的飯店已有團隊，但需要有人協助訂策略並追蹤結果；有的正在轉換管理團隊；也有的需要從頭建立新的作業系統。",
    needClose: "我們不會對每間飯店訂同一套服務範圍，而是與業主一起設計真正符合該飯店的管理方式。",
    helpTitle: "我們能協助飯店的事",
    help: [
      ["01", "尋找並安排管理團隊", "評估飯店需要的團隊結構，協助找到合適的主管與人員，並把角色、職責與合作方式講清楚。"],
      ["02", "建立營運系統", "檢視並發展飯店工作步驟：接訂、接待客人、客房作業、部門協調，以及追蹤現場問題，讓團隊能持續運作並維持服務標準。"],
      ["03", "管理收益與銷售通路", "分析市場、規劃價格與促銷、照顧線上預訂通路，並追蹤銷售結果，讓飯店能依客人需求調整，也更好發揮客房產能。"],
      ["04", "發展行銷與直銷預訂", "看客人如何發現、比較並決定預訂飯店，再規劃網站、線上資料與溝通方式，以創造直銷預訂機會。"],
      ["05", "選擇系統與科技", "協助評估並安排工作所需系統，例如 PMS、Channel Manager 與直銷預訂系統，並在能減少重複工作、讓團隊有時間照顧客人的地方使用 AI 與 Automation。"],
      ["06", "與業主一起追蹤經營結果", "約定目標、指標，以及業主能據以決策的報告形式，並定期談什麼有效、什麼是問題，以及計畫該如何調整。"],
    ],
    methodTitle: "如何開始合作",
    steps: [
      ["01", "對談並理解飯店", "了解業主目標、目前營運狀況、既有團隊、經營結果，以及飯店面對的挑戰。"],
      ["02", "一起約定工作範圍", "清楚約定 The KPI Plus 負責什麼、飯店團隊負責什麼、是否需要再找人，以及如何協調。"],
      ["03", "規劃並開始執行", "排出該先做的事、指定負責人與目標，再依實際情況追蹤結果並調整計畫。"],
    ],
    fitTitle: "適合這些獨立飯店業主…",
    fit: [
      "需要管理團隊，或需要有人協助照顧營運",
      "已有團隊，但希望作業系統與責任更清楚",
      "想發展收益、銷售與經營結果",
      "正在準備開幕，或要調整現有飯店的管理方式",
      "希望看到資料與進度，以便以業主身份做決定",
    ],
    closerTitle: "一起來談，你的飯店該從哪裡開始",
    closerBody:
      "你不必先準備好工作範圍。只要告訴我們飯店情況、目標，以及希望協助的事。我們會一起找出合適的合作方式，並在開始前把職責與責任講清楚。",
    closerCta: "預約談飯店管理",
  },
} as const;

export function IndependentHotelView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const solutions = localizePath("/solutions", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/solutions/independent-hotel-management", locale)}>
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
              <span className="text-white">{solutionNavLabel("/solutions/independent-hotel-management", locale)}</span>
            </li>
          </ol>
        </nav>
        <p className="kpi-kicker mt-5 text-[#F2F8E2]">{t.eyebrow}</p>
        <h1 className="kpi-h1 mt-5">{t.title}</h1>
        <p className="kpi-lead mt-5 text-white/72">{t.lead}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.leadClose}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/64">{t.start}</p>
        <div className="kpi-actions">
          <a href="#independent-hotel-enquiry" className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/64">{t.underCta}</p>
      </PageHero>

      <section className="kpi-section">
        <div className="kpi-split">
          <div>
            <h2 className="kpi-h2">{t.needTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555555]">{t.needLead}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#3B3B3B]">{t.needClose}</p>
          </div>
          <figure className="kpi-home-photo">
            <img src={photo} alt={t.photoAlt} width={1200} height={900} />
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
          <h2 className="kpi-h2">{t.fitTitle}</h2>
          <div className="mt-8 grid gap-4">
            {t.fit.map((item, index) => (
              <article key={item} className="kpi-card flex gap-4 p-6">
                <span className="kpi-latin text-sm font-black tracking-[.14em] text-[#0B6660]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-7 text-[#555555]">{item}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 max-w-3xl rounded-[1.5rem] border border-[#E3E8EB] bg-[#F4F4F4] p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-[#3B3B3B]">{t.closerTitle}</h3>
            <p className="mt-4 text-base leading-8 text-[#555555]">{t.closerBody}</p>
            <a href="#independent-hotel-enquiry" className="kpi-button mt-6">
              {t.closerCta} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <IndependentHotelEnquiry locale={locale} />
      <IndependentHotelStickyCta label={t.cta} />
    </SiteShell>
  );
}
