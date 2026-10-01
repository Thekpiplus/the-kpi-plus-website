import Link from "next/link";
import { ClientLogoMarquee } from "@/components/ClientLogoMarquee";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const copy = {
  th: {
    kicker: "พาร์ตเนอร์ด้านการบริหารรายได้และการเติบโตของธุรกิจโรงแรม",
    h1: "เดอะ เคพีไอ พลัส ทำงานร่วมกับเจ้าของโรงแรม ผู้บริหาร และทีม Commercial ทั่วประเทศไทย เพื่อช่วยให้เห็นภาพธุรกิจชัดขึ้นว่า",
    highlight: "รายได้กำลังหายไปตรงไหน โอกาสอยู่ตรงไหน และอะไรคือสิ่งที่ควรทำก่อน",
    heroBody:
      "ผลประกอบการของโรงแรมไม่ได้เกิดจาก Revenue Management, OTA, Website, Direct Booking หรือ Marketing เพียงเรื่องใดเรื่องหนึ่ง ทุกส่วนเชื่อมโยงกัน เราจึงนำข้อมูลด้าน Revenue, Demand, Pricing, Distribution และ Direct Booking มามองเป็นภาพเดียวกัน เพื่อเปลี่ยนข้อมูลให้เป็น Action และเปลี่ยน Action ให้เป็นผลลัพธ์ที่วัดได้",
    auditCta: "ขอวิเคราะห์ Performance โรงแรม",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "เราทำงานร่วมกับโรงแรมตั้งแต่ต้นจนจบกระบวนการ และติดตามผลลัพธ์ต่อเนื่อง",
    partnerLead:
      "เดอะ เคพีไอ พลัส ไม่ใช่เพียง Digital Marketing Agency และไม่ใช่ที่ปรึกษาที่เข้ามาวิเคราะห์แล้วส่งรายงานให้โรงแรม เราทำงานร่วมกับโรงแรมตั้งแต่ต้นจนจบกระบวนการ และติดตามผลลัพธ์ต่อเนื่อง",
    partnerGoal: "เป้าหมายของเราไม่ใช่การทำให้โรงแรม “ทำมากขึ้น” แต่คือการช่วยให้โรงแรม",
    partnerAccent: "ทำสิ่งที่ใช่ ในเวลาที่ใช่ เพื่อผลประกอบการที่ดีขึ้น",
    visionLabel: "Vision",
    vision:
      "เป็นหนึ่งใน Hospitality Performance Partner ชั้นนำของประเทศไทย ที่ช่วยให้โรงแรมเติบโตจากการตัดสินใจที่ถูกต้อง บนข้อมูลที่ชัดเจนและประสบการณ์จริงในธุรกิจโรงแรม",
    missionLabel: "Mission",
    mission:
      "ช่วยเจ้าของและทีมโรงแรมมองเห็นโอกาสจากข้อมูล วาง Action ที่ชัดเจน และติดตามผล เพื่อพัฒนารายได้และผลประกอบการอย่างต่อเนื่อง",
    methodTitle: "วิธีการทำงานของเรา",
    methods: [
      ["01", "เข้าใจสถานการณ์"],
      ["02", "หาโอกาส"],
      ["03", "กำหนด Action"],
      ["04", "ลงมือทำ"],
      ["05", "วัดผล"],
      ["06", "ปรับให้ดีขึ้น"],
    ],
    methodNote:
      "ก่อนเสนอทุก Action เราต้องเข้าใจก่อนว่าปัญหาอยู่ตรงไหน และโอกาสอยู่ตรงไหน เพราะ Occupancy ที่ลดลงไม่ได้แปลว่าต้องลดราคาเสมอไป และ Revenue ที่เพิ่มขึ้นก็ไม่ได้แปลว่าโรงแรมจะเหลือรายได้มากขึ้นเสมอไป",
    pillarsTitle: "สามเสาหลักของบริการ",
    pillars: [
      {
        num: "01",
        title: "เพิ่มรายได้และผลตอบแทน",
        subtitle: "Revenue & Commercial Performance",
        body: "ช่วยให้โรงแรมขายห้องได้เหมาะสมกับ Demand และสร้างรายได้ที่มีคุณภาพมากขึ้น ขายอะไร ราคาเท่าไร ช่วงไหน ผ่านช่องทางไหน และสุดท้ายโรงแรมเหลือรายได้เท่าไร",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
      },
      {
        num: "02",
        title: "เพิ่มโอกาสในการจอง",
        subtitle: "Demand & Direct Booking",
        body: "ช่วยให้โรงแรมเข้าถึงลูกค้าที่เหมาะสม สร้าง Demand และเปลี่ยนความสนใจให้เป็นยอดจอง ให้คนที่ใช่เจอโรงแรมในเวลาที่ใช่",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
      },
      {
        num: "03",
        title: "เพิ่มประสิทธิภาพในการบริหาร",
        subtitle: "Team, Systems & Ways of Working",
        body: "ช่วยให้ทีมโรงแรมมีข้อมูล เครื่องมือ และวิธีการทำงานที่ช่วยให้ตัดสินใจและลงมือได้เร็วขึ้น",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
      },
    ],
    experienceTitle: "ประสบการณ์ที่เติบโตไปพร้อมกับลูกค้า",
    experienceBody:
      "เราทำงานร่วมกับธุรกิจ Hospitality มาแล้วกว่า 100 แห่ง ตั้งแต่โรงแรมอิสระขนาดเล็กไปจนถึงธุรกิจที่มีความซับซ้อนมากขึ้น หลักการของเรายังคงเหมือนเดิม: เข้าใจธุรกิจ อ่านข้อมูล เลือกสิ่งที่ควรทำ ลงมือทำ และวัดผล",
    experienceMetric: "ธุรกิจ Hospitality ที่เราได้ร่วมงานด้วย",
    valuesTitle: "สิ่งที่เราให้ความสำคัญ",
    values: [
      ["มองแบบธุรกิจ", "เรามองมากกว่ายอดขาย ทุกคำแนะนำคำนึงถึงราคา ช่องทาง ต้นทุน และรายได้ที่โรงแรมเหลือจริง"],
      ["พูดให้เข้าใจง่าย", "เรื่อง Revenue หรือ Distribution อาจซับซ้อน แต่เราไม่จำเป็นต้องพูดให้ซับซ้อน"],
      ["ใช้ได้จริง", "ทุก Analysis ต้องนำไปสู่คำถามว่า “แล้วเราจะทำอะไรต่อ?”"],
      ["วัดผลได้", "เราไม่ใช้คำว่า “ดีขึ้น” โดยไม่มีตัววัด"],
      ["เข้าใจโรงแรม", "เราเข้าใจทั้งมุมของเจ้าของ GM ทีม Commercial และหน้างานของโรงแรม เพราะเรามาจากธุรกิจนี้"],
      ["ใช้เทคโนโลยีเมื่อช่วยได้จริง", "ถ้าเทคโนโลยีช่วยลดงานซ้ำ ทำให้ทีมเห็นข้อมูลเร็วขึ้น และมีเวลาดูแลรายได้กับลูกค้ามากขึ้น เราจะนำมาใช้ ถ้าไม่ ก็ไม่จำเป็นต้องใช้"],
    ],
    foundersEyebrow: "Our Founders",
    foundersTitle: "สองประสบการณ์ หนึ่งเป้าหมาย",
    foundersLead:
      "เดอะ เคพีไอ พลัส เกิดจากประสบการณ์ที่แตกต่างกันของผู้ก่อตั้งทั้งสองคน ที่เชื่อร่วมกันว่าธุรกิจโรงแรมที่ดีควรเติบโตไปพร้อมกันทั้งด้านรายได้ ระบบ และคน",
    foundersAlt: "ผู้ก่อตั้ง เดอะ เคพีไอ พลัส",
    founderAName: "คุณเนตรนภิส",
    founderARole: "ผู้ก่อตั้ง",
    founderABody:
      "ประสบการณ์ในธุรกิจโรงแรมกว่า 21 ปี กับ Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket และ Phuket Marriott Resort & Spa, Merlin Beach เข้าใจทั้งงานบริการ การบริหารทีม ประสบการณ์ของแขก และการทำให้ธุรกิจเติบโตอย่างยั่งยืน",
    founderBName: "คุณอิศรา อิสรนิรันดร์",
    founderBRole: "ผู้ร่วมก่อตั้ง และประธานเจ้าหน้าที่บริหาร",
    founderBBody:
      "ประสบการณ์กว่า 15 ปีด้าน Hospitality Technology, Sales, Digital Marketing และ Hotel Solutions กับ ReverseAds, eZee Technosys, Compass Edge และ OYO Hotels ในฐานะ CEO ของ เดอะ เคพีไอ พลัส ดูแลทิศทางธุรกิจ และการพัฒนาโซลูชันที่ช่วยให้ทีมโรงแรมทำงานง่ายขึ้นและตัดสินใจได้เร็วขึ้น",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "ตัวเลขไม่ใช่แค่ข้อมูลในรายงาน แต่ต้องช่วยให้ทีมเห็นว่าควรทำอะไรต่อ",
    closerBody:
      "พฤติกรรมนักเดินทาง ช่องทางการค้นหา OTA และ Digital Marketing เปลี่ยนเร็ว สิ่งสำคัญคือการรู้ว่าตัวเลขกำลังบอกอะไร ปัญหาจริงคืออะไร และสิ่งที่ทำไปสร้างผลลัพธ์ให้โรงแรมหรือไม่",
    closerLine: "หาโอกาสให้เจอ · ลงมือให้ถูกจุด · วัดผลให้ชัด",
    closerSecondary: "คุยกับทีม เดอะ เคพีไอ พลัส",
    joinTitle: "ร่วมงานกับ เดอะ เคพีไอ พลัส",
    joinBody:
      "เรามองหาคนที่รักธุรกิจโรงแรม ชอบเรียนรู้ สนใจเทคโนโลยี และไม่หยุดถามว่า “มีวิธีที่ดีกว่านี้ไหม?” หากคุณอยากสร้างงานที่มีผลต่อธุรกิจและผู้คนจริง เรายินดีที่จะได้รู้จักคุณ",
    joinCta: "ติดต่อเรา",
  },
  en: {
    kicker: "Your partner in hotel revenue and growth",
    h1: "The KPI Plus works with hotel owners, executives, and commercial teams across Thailand to get a clearer view of the business:",
    highlight: "Where revenue is being lost, where the opportunities are, and what to do first.",
    heroBody:
      "Hotel performance doesn't come from revenue management, OTAs, the website, direct booking, or marketing alone. Every part is connected. That's why we bring revenue, demand, pricing, distribution, and direct booking data into one view, so data becomes action, and action becomes measurable results.",
    auditCta: "Request a Hotel Performance Audit",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "We work alongside your team from start to finish, and stay with the results.",
    partnerLead:
      "The KPI Plus isn't just a digital marketing agency, and we're not consultants who analyze your hotel, hand over a report, and leave. We work alongside your team from start to finish, and stay with the results.",
    partnerGoal: "Our goal isn't to help hotels “do more.” It's to help hotels",
    partnerAccent: "do the right things, at the right time, for better performance.",
    visionLabel: "Vision",
    vision:
      "To be one of Thailand's leading Hospitality Performance Partners, helping hotels grow through the right decisions, built on clear data and real hotel experience.",
    missionLabel: "Mission",
    mission:
      "To help hotel owners and teams see opportunities in their data, set clear actions, and track results, so revenue and performance keep improving.",
    methodTitle: "How we work",
    methods: [
      ["01", "Understand the situation"],
      ["02", "Find the opportunity"],
      ["03", "Define the action"],
      ["04", "Put it into practice"],
      ["05", "Measure the results"],
      ["06", "Improve"],
    ],
    methodNote:
      "Before recommending any action, we need to understand where the problem is and where the opportunity lies. Falling occupancy doesn't always mean you should cut rates, and rising revenue doesn't always mean your hotel is keeping more of it.",
    pillarsTitle: "Our three service pillars",
    pillars: [
      {
        num: "01",
        title: "Grow revenue and returns",
        subtitle: "Revenue & Commercial Performance",
        body: "Helping hotels sell rooms in line with demand and generate higher-quality revenue: what to sell, at what price, when, through which channel, and how much the hotel keeps in the end.",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
      },
      {
        num: "02",
        title: "Create more booking opportunities",
        subtitle: "Demand & Direct Booking",
        body: "Helping hotels reach the right guests, build demand, and turn interest into bookings, so the right people find your hotel at the right time.",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
      },
      {
        num: "03",
        title: "Run the business more effectively",
        subtitle: "Team, Systems & Ways of Working",
        body: "Giving hotel teams the data, tools, and ways of working that help them decide and act faster.",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
      },
    ],
    experienceTitle: "Experience that grows with our clients",
    experienceBody:
      "We've worked with more than 100 hospitality businesses, from small independent hotels to more complex operations. Our approach stays the same: understand the business, read the data, choose what to do, act, and measure.",
    experienceMetric: "Hospitality businesses we've worked with",
    valuesTitle: "What we stand for",
    values: [
      ["Commercial", "We look beyond sales. Every recommendation considers price, channel, cost, and the revenue your hotel actually keeps."],
      ["Clear", "Revenue and distribution can be complex, but the way we explain them doesn't have to be."],
      ["Practical", "Every analysis should lead to one question: “So what do we do next?”"],
      ["Measured", "We don't say “better” without something to measure it by."],
      ["Hospitality", "We understand the owner, the GM, the commercial team, and the front line, because we come from this industry."],
      [
        "Technology when it truly helps",
        "If technology cuts repetitive work, gets data to your team faster, and frees up time for revenue and guests, we'll use it. If not, there's no need.",
      ],
    ],
    foundersEyebrow: "Our Founders",
    foundersTitle: "Two backgrounds, one goal",
    foundersLead:
      "The KPI Plus brings together the different experience of its two founders, who share one belief: a good hotel business should grow in revenue, systems, and people together.",
    foundersAlt: "The KPI Plus founders",
    founderAName: "Natenapit Isaraniran",
    founderARole: "Founder",
    founderABody:
      "More than 21 years in the hotel industry, with Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket, and Phuket Marriott Resort & Spa, Merlin Beach. She understands service, team leadership, the guest experience, and how to grow a business sustainably.",
    founderBName: "Isara Isaraniran",
    founderBRole: "Co-Founder & Chief Executive Officer",
    founderBBody:
      "More than 15 years in hospitality technology, sales, digital marketing, and hotel solutions, with ReverseAds, eZee Technosys, Compass Edge, and OYO Hotels. As CEO of The KPI Plus, he leads the company's direction and the development of solutions that make hotel teams' work easier and decisions faster.",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "Numbers shouldn't just sit in a report. They should show your team what to do next.",
    closerBody:
      "Traveler behavior, search, OTAs, and digital marketing change quickly. What matters is knowing what the numbers are telling you, what the real problem is, and whether what you're doing is actually delivering results for your hotel.",
    closerLine: "Find the opportunity · Act where it matters · Measure what changes",
    closerSecondary: "Review Your Hotel Performance",
    joinTitle: "Join The KPI Plus",
    joinBody:
      "We're looking for people who love the hotel business, enjoy learning, are curious about technology, and keep asking, “Is there a better way?” If you want to do work that makes a real difference for businesses and people, we'd love to hear from you.",
    joinCta: "Contact Us",
  },
  ru: {
    kicker: "Партнёр по управлению доходами и росту отелей",
    h1: "The KPI Plus работает с владельцами, руководством и коммерческими командами отелей по всему Таиланду, чтобы яснее видеть бизнес:",
    highlight: "где теряется доход, где возможность и что делать сначала.",
    heroBody:
      "Результат отеля не складывается из Revenue Management, OTA, сайта, прямого бронирования или маркетинга по отдельности. Всё связано. Поэтому мы собираем данные по доходу, спросу, ценам, дистрибуции и прямому бронированию в одну картину: данные становятся действием, а действие — измеримым результатом.",
    auditCta: "Запросить аудит Performance отеля",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "Мы работаем с командой отеля от начала до конца и остаёмся с результатом.",
    partnerLead:
      "The KPI Plus — не просто digital-агентство и не консультанты, которые анализируют отель, передают отчёт и уходят. Мы работаем вместе с командой от начала до конца и остаёмся с результатом.",
    partnerGoal: "Наша цель — не помочь отелю «делать больше». Мы помогаем отелю",
    partnerAccent: "делать правильные вещи в правильное время ради лучшего результата.",
    visionLabel: "Vision",
    vision:
      "Стать одним из ведущих Hospitality Performance Partner в Таиланде и помогать отелям расти за счёт правильных решений на ясных данных и реальном гостиничном опыте.",
    missionLabel: "Mission",
    mission:
      "Помогать владельцам и командам отелей видеть возможности в данных, ставить ясные действия и отслеживать результат, чтобы доход и эффективность росли постоянно.",
    methodTitle: "Как мы работаем",
    methods: [
      ["01", "Понять ситуацию"],
      ["02", "Найти возможность"],
      ["03", "Определить действие"],
      ["04", "Внедрить"],
      ["05", "Измерить результат"],
      ["06", "Улучшить"],
    ],
    methodNote:
      "Прежде чем рекомендовать действие, нужно понять, где проблема и где возможность. Падение загрузки не всегда значит снижать цену, а рост выручки не всегда значит, что отель оставляет себе больше.",
    pillarsTitle: "Три опоры наших услуг",
    pillars: [
      {
        num: "01",
        title: "Растить доход и отдачу",
        subtitle: "Revenue & Commercial Performance",
        body: "Помогать отелю продавать номера в соответствии со спросом и получать более качественный доход: что продавать, по какой цене, когда, через какой канал и сколько отель оставляет себе в итоге.",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
      },
      {
        num: "02",
        title: "Создавать больше возможностей для бронирования",
        subtitle: "Demand & Direct Booking",
        body: "Помогать отелю находить нужных гостей, создавать спрос и превращать интерес в бронирования, чтобы нужные люди находили отель в нужное время.",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
      },
      {
        num: "03",
        title: "Управлять бизнесом эффективнее",
        subtitle: "Team, Systems & Ways of Working",
        body: "Давать команде отеля данные, инструменты и способы работы, которые помогают быстрее решать и действовать.",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
      },
    ],
    experienceTitle: "Опыт, который растёт вместе с клиентами",
    experienceBody:
      "Мы работали с более чем 100 hospitality-бизнесами: от небольших независимых отелей до более сложных операций. Подход тот же: понять бизнес, прочитать данные, выбрать действие, сделать и измерить.",
    experienceMetric: "Hospitality-бизнесы, с которыми мы работали",
    valuesTitle: "Что для нас важно",
    values: [
      ["Коммерческий взгляд", "Мы смотрим дальше продаж. Каждая рекомендация учитывает цену, канал, затраты и доход, который отель реально оставляет себе."],
      ["Ясно", "Revenue и дистрибуция могут быть сложными, но объяснять их не обязательно сложно."],
      ["Практично", "Каждый анализ должен вести к одному вопросу: «Что делаем дальше?»"],
      ["Измеримо", "Мы не говорим «лучше», если нечем это измерить."],
      ["Hospitality", "Мы понимаем владельца, GM, коммерческую команду и линейный персонал, потому что пришли из этой отрасли."],
      [
        "Технологии, когда они реально помогают",
        "Если технология сокращает повторяющуюся работу, быстрее даёт команде данные и освобождает время для дохода и гостей — мы её используем. Если нет, в ней нет нужды.",
      ],
    ],
    foundersEyebrow: "Our Founders",
    foundersTitle: "Два опыта, одна цель",
    foundersLead:
      "The KPI Plus объединяет разный опыт двух основателей, которые верят в одно: хороший гостиничный бизнес должен расти вместе — в доходе, системах и людях.",
    foundersAlt: "Основатели The KPI Plus",
    founderAName: "Natenapit Isaraniran",
    founderARole: "Основатель",
    founderABody:
      "Более 21 года в гостиничном бизнесе: Mandarin Oriental Bangkok, The Westin Siray Bay Resort & Spa Phuket и Phuket Marriott Resort & Spa, Merlin Beach. Она понимает сервис, управление командой, опыт гостя и как растить бизнес устойчиво.",
    founderBName: "Isara Isaraniran",
    founderBRole: "Сооснователь и генеральный директор",
    founderBBody:
      "Более 15 лет в hospitality-технологиях, продажах, digital-маркетинге и hotel solutions: ReverseAds, eZee Technosys, Compass Edge и OYO Hotels. Как CEO The KPI Plus он определяет направление компании и развивает решения, которые упрощают работу команд отелей и ускоряют решения.",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "Цифры не должны оставаться в отчёте. Они должны показывать команде, что делать дальше.",
    closerBody:
      "Поведение путешественников, поиск, OTA и digital-маркетинг меняются быстро. Важно понимать, что говорят цифры, в чём реальная проблема и даёт ли то, что вы делаете, результат отелю.",
    closerLine: "Найти возможность · Действовать в нужной точке · Измерить изменение",
    closerSecondary: "Разобрать Performance отеля",
    joinTitle: "Присоединиться к The KPI Plus",
    joinBody:
      "Мы ищем людей, которые любят гостиничный бизнес, любят учиться, интересуются технологиями и не перестают спрашивать: «Есть ли способ лучше?» Если вы хотите делать работу, которая реально меняет бизнес и людей, мы будем рады познакомиться.",
    joinCta: "Связаться с нами",
  },
  zh: {
    kicker: "飯店收益與成長夥伴",
    h1: "The KPI Plus 與泰國各地的飯店業主、高階主管與 Commercial 團隊合作，讓事業看得更清楚：",
    highlight: "收益流失在哪、機會在哪，以及該先做什麼。",
    heroBody:
      "飯店績效不是只靠 Revenue Management、OTA、網站、直銷預訂或行銷任何單一環節。每一部分都連在一起。因此我們把收益、需求、定價、通路與直銷預訂資料看成同一張圖，讓資料變成行動，行動變成可衡量的結果。",
    auditCta: "申請飯店 Performance 分析",
    partnerEyebrow: "Hospitality Performance Partner",
    partnerTitle: "我們從開始到結束與飯店團隊一起做，並持續跟進結果。",
    partnerLead:
      "The KPI Plus 不只是數位行銷公司，也不是分析完就交報告離開的顧問。我們從開始到結束與團隊一起做，並持續跟進結果。",
    partnerGoal: "我們的目標不是讓飯店「做得更多」，而是協助飯店",
    partnerAccent: "在對的時間做對的事，讓績效更好。",
    visionLabel: "Vision",
    vision:
      "成為泰國領先的 Hospitality Performance Partner 之一，協助飯店用清楚的資料與真實的飯店經驗，做出正確決策並成長。",
    missionLabel: "Mission",
    mission:
      "協助飯店業主與團隊從資料看見機會、訂出清楚的行動並追蹤結果，讓收益與績效持續進步。",
    methodTitle: "我們如何工作",
    methods: [
      ["01", "理解現況"],
      ["02", "找出機會"],
      ["03", "訂出行動"],
      ["04", "落地執行"],
      ["05", "衡量結果"],
      ["06", "持續改善"],
    ],
    methodNote:
      "在提出任何行動前，我們必須先理解問題在哪、機會在哪。住房率下降不一定代表該降價，收益上升也不一定代表飯店留下更多錢。",
    pillarsTitle: "三個服務支柱",
    pillars: [
      {
        num: "01",
        title: "提升收益與回報",
        subtitle: "Revenue & Commercial Performance",
        body: "協助飯店依需求賣房，並創造更高品質的收益：賣什麼、什麼價格、什麼時候、透過哪個通路，以及最後飯店留下多少。",
        tags: "Revenue Management · Pricing Strategy · Demand Analysis · Distribution · OTA Strategy · Channel Performance · Direct Booking Strategy · Commercial Planning",
      },
      {
        num: "02",
        title: "創造更多預訂機會",
        subtitle: "Demand & Direct Booking",
        body: "協助飯店接觸對的客人、創造需求，並把興趣轉成預訂，讓對的人在對的時間找到飯店。",
        tags: "Google Search · Local Search · SEO · Paid Advertising · Social Media Advertising · Hotel Website · Booking Journey · Conversion",
      },
      {
        num: "03",
        title: "讓營運更有效",
        subtitle: "Team, Systems & Ways of Working",
        body: "讓飯店團隊擁有資料、工具與工作方式，以便更快決策、更快行動。",
        tags: "Hotel Systems · Reporting · Performance Dashboard · Workflow · Automation · AI · Team Training · Commercial Training",
      },
    ],
    experienceTitle: "與客戶一起成長的經驗",
    experienceBody:
      "我們已與超過 100 家旅宿事業合作，從小型獨立飯店到較複雜的營運都有。做法始終一樣：理解事業、讀資料、選擇該做的事、執行，並衡量。",
    experienceMetric: "曾合作的旅宿事業",
    valuesTitle: "我們看重的事",
    values: [
      ["商業視角", "我們看的不只是銷售。每一項建議都會考慮價格、通路、成本，以及飯店真正留下的收益。"],
      ["說得清楚", "收益與通路可以很複雜，但我們不必說得複雜。"],
      ["用得上", "每一次分析都應回到一個問題：「那下一步要做什麼？」"],
      ["能量得到", "沒有衡量標準，我們不會說「變好了」。"],
      ["懂飯店", "我們理解業主、總經理、Commercial 團隊與第一線，因為我們來自這個產業。"],
      [
        "科技要真的有幫助才用",
        "如果科技能減少重複工作、讓團隊更快看到資料，並把時間留給收益與客人，我們會用。如果不能，就不必用。",
      ],
    ],
    foundersEyebrow: "Our Founders",
    foundersTitle: "兩段經歷，同一個目標",
    foundersLead:
      "The KPI Plus 由兩位創辦人不同的經驗組成，他們共同相信：好的飯店事業應同時在收益、系統與人一起成長。",
    foundersAlt: "The KPI Plus 創辦人",
    founderAName: "Natenapit Isaraniran",
    founderARole: "創辦人",
    founderABody:
      "超過 21 年飯店產業經驗，曾任職 Mandarin Oriental Bangkok、The Westin Siray Bay Resort & Spa Phuket，以及 Phuket Marriott Resort & Spa, Merlin Beach。她理解服務、帶團隊、客人體驗，以及如何讓事業永續成長。",
    founderBName: "Isara Isaraniran",
    founderBRole: "共同創辦人暨執行長",
    founderBBody:
      "超過 15 年旅宿科技、銷售、數位行銷與飯店解決方案經驗，曾任職 ReverseAds、eZee Technosys、Compass Edge 與 OYO Hotels。作為 The KPI Plus 執行長，他負責公司方向，並開發讓飯店團隊工作更輕鬆、決策更快的解決方案。",
    closerEyebrow: "Better Decisions. Better Hotel Performance.",
    closerTitle: "數字不該只停在報告裡，而要讓團隊看見下一步該做什麼。",
    closerBody:
      "旅客行為、搜尋、OTA 與數位行銷變化很快。重要的是知道數字在說什麼、真正的問題是什麼，以及現在做的事是否真的為飯店帶來結果。",
    closerLine: "找到機會 · 做在對的點 · 把變化量清楚",
    closerSecondary: "檢視飯店績效",
    joinTitle: "加入 The KPI Plus",
    joinBody:
      "我們尋找熱愛飯店事業、喜歡學習、對科技好奇，並持續問「有沒有更好的方法？」的人。如果你想做真正影響事業與人的工作，我們很樂意認識你。",
    joinCta: "聯絡我們",
  },
} as const;

export function AboutView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact", locale);

  return (
    <SiteShell locale={locale} route={localizePath("/about", locale)}>
      <PageHero>
        <p className="kpi-kicker text-[#F2F8E2]">{t.kicker}</p>
        <h1 className="kpi-h1 mt-5">{t.h1}</h1>
        <p className="mt-5 max-w-4xl text-xl font-semibold leading-8 text-[#E6E81F] sm:text-2xl">{t.highlight}</p>
        <div className="kpi-actions">
          <Link href={audit} className="kpi-button">
            {t.auditCta}
          </Link>
        </div>
      </PageHero>

      <section className="kpi-section">
        <p className="kpi-kicker text-[#0B6660]">{t.partnerEyebrow}</p>
        <h2 className="kpi-h2 mt-4">{t.partnerTitle}</h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.heroBody}</p>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.partnerLead}</p>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#555555]">{t.partnerGoal}</p>
        <p className="mt-4 max-w-3xl text-2xl font-extrabold leading-9 text-[#0B1F33]">{t.partnerAccent}</p>
        <div className="kpi-grid-2 mt-12">
          <article className="kpi-card p-7">
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0B6660]">{t.visionLabel}</p>
            <p className="mt-4 text-base leading-8 text-[#555555]">{t.vision}</p>
          </article>
          <article className="kpi-card p-7">
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0B6660]">{t.missionLabel}</p>
            <p className="mt-4 text-base leading-8 text-[#555555]">{t.mission}</p>
          </article>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.methodTitle}</h2>
          <div className="kpi-grid-3 mt-10">
            {t.methods.map(([num, title]) => (
              <article key={num} className="kpi-card p-6">
                <span className="text-sm font-black tracking-[.16em] text-[#0B6660]">{num}</span>
                <h3 className="mt-4 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-[#555555]">{t.methodNote}</p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.pillarsTitle}</h2>
        <div className="kpi-grid-3 mt-10">
          {t.pillars.map((pillar) => (
            <article key={pillar.num} className="kpi-card relative overflow-hidden p-7">
              <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
              <span className="text-sm font-black tracking-[.16em] text-[#0B6660]">{pillar.num}</span>
              <h3 className="mt-6 text-2xl font-extrabold tracking-[-.04em] text-[#3B3B3B]">{pillar.title}</h3>
              <p className="mt-3 text-sm font-bold text-[#0B6660]">{pillar.subtitle}</p>
              <p className="mt-4 text-base leading-7 text-[#555555]">{pillar.body}</p>
              <p className="mt-6 text-sm leading-7 text-[#555555]">{pillar.tags}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{t.experienceTitle}</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.experienceBody}</p>
          <div className="mt-10 kpi-card p-8">
            <p className="text-6xl font-extrabold tracking-[-.06em] text-[#0B1F33]">100+</p>
            <p className="mt-3 text-base font-semibold text-[#3B3B3B]">{t.experienceMetric}</p>
          </div>
          <ClientLogoMarquee label={t.experienceMetric} />
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.valuesTitle}</h2>
        <div className="kpi-grid-2 mt-10">
          {t.values.map(([title, body]) => (
            <article key={title} className="kpi-card p-7">
              <h3 className="text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
              <p className="mt-4 text-base leading-7 text-[#555555]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#0B6660]">{t.foundersEyebrow}</p>
          <h2 className="kpi-h2 mt-4">{t.foundersTitle}</h2>
          <p className="kpi-lead mt-5">{t.foundersLead}</p>
          <div className="kpi-split-founders mt-10">
            <img
              src="/media/the-kpi-plus-founders_f4c8516e.webp"
              alt={t.foundersAlt}
              width={705}
              height={1024}
              className="w-full rounded-[1.25rem] object-cover object-[50%_18%]"
            />
            <div className="grid gap-4">
              <article className="kpi-card p-7">
                <h3 className="text-2xl font-extrabold text-[#3B3B3B]">{t.founderAName}</h3>
                <p className="mt-2 text-sm font-bold text-[#0B6660]">{t.founderARole}</p>
                <p className="mt-4 text-base leading-7 text-[#555555]">{t.founderABody}</p>
              </article>
              <article className="kpi-card p-7">
                <h3 className="text-2xl font-extrabold text-[#3B3B3B]">{t.founderBName}</h3>
                <p className="mt-2 text-sm font-bold text-[#0B6660]">{t.founderBRole}</p>
                <p className="mt-4 text-base leading-7 text-[#555555]">{t.founderBBody}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1F33] text-white">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#F2F8E2]">{t.closerEyebrow}</p>
          <h2 className="kpi-h2 mt-5 text-white">{t.closerTitle}</h2>
          <p className="kpi-lead mt-6 text-white/72">{t.closerBody}</p>
          <p className="mt-6 text-base font-semibold text-[#E6E81F]">{t.closerLine}</p>
          <div className="kpi-actions">
            <Link href={audit} className="kpi-button">
              {t.auditCta}
            </Link>
            <Link href={contact} className="kpi-button-ghost">
              {t.closerSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{t.joinTitle}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#555555]">{t.joinBody}</p>
        <Link href="mailto:info@thekpiplus.com?subject=Join%20The%20KPI%20Plus" className="kpi-button mt-8">
          {t.joinCta}
        </Link>
      </section>
    </SiteShell>
  );
}
