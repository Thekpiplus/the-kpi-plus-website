import { existingHref, localizePath, type Locale } from "./seo";

export const solutionGroups = [
  {
    id: "grow-revenue",
    title: "Grow Revenue",
    items: [
      { href: "/solutions/revenue-commercial-management", label: "Revenue & Commercial Management" },
      { href: "/solutions/outsourced-hotel-reservations", label: "Outsourced Reservation Management" },
      { href: "/solutions/b2b-agent-sales", label: "B2B & Agent Sales" },
    ],
  },
  {
    id: "grow-demand",
    title: "Grow Demand",
    items: [
      { href: "/solutions/google-ads-management", label: "Google Ads Management" },
      { href: "/solutions/meta-ads-management", label: "Facebook & Meta Ads" },
      { href: "/solutions/hotel-seo-google-maps-ai-search", label: "SEO, Google Maps & AI Search" },
      { href: "/solutions/hotel-website-design", label: "Hotel Website Design" },
      { href: "/solutions/hotel-direct-bookings", label: "Website Conversion & Direct Bookings" },
    ],
  },
  {
    id: "grow-capability",
    title: "Strengthen Operations",
    items: [
      { href: "/solutions/independent-hotel-management", label: "Independent Hotel Management" },
      { href: "/solutions/hotel-systems-implementation", label: "Hotel Systems & Implementation" },
      { href: "/solutions/hotel-ai-automation", label: "Technology, AI & Automation" },
      { href: "/solutions/hotel-training-team-development", label: "Training & Team Development" },
    ],
  },
] as const;

export const locales: { id: Locale; label: string }[] = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "zh", label: "繁體中文" },
];

export const copy = {
  th: {
    solutions: "โซลูชัน",
    approach: "แนวทางการทำงาน",
    insights: "บทความและมุมมอง",
    caseStudies: "ผลงานลูกค้า",
    about: "เกี่ยวกับเรา",
    contact: "ติดต่อเรา",
    audit: "ขอวิเคราะห์ Performance โรงแรม",
    footerAudit: "ขอวิเคราะห์ประสิทธิภาพและโอกาสของโรงแรม",
    follow: "ติดตาม เดอะ เคพีไอ พลัส",
    statement: "พันธมิตรด้าน Revenue Management และการเติบโตของธุรกิจโรงแรม",
    description:
      "เราช่วยโรงแรมเพิ่มรายได้ สร้าง Demand พัฒนาช่องทางการขาย และใช้ Data, Technology และ AI เพื่อให้ตัดสินใจได้ดีขึ้นและทำงานได้มีประสิทธิภาพมากขึ้น",
    knowUs: "รู้จัก เดอะ เคพีไอ พลัส",
    ourStory: "เรื่องราวของ เดอะ เคพีไอ พลัส",
    partners: "พันธมิตรของเรา",
    tools: "เครื่องมือฟรีสำหรับโรงแรม",
    allSolutions: "ดูโซลูชันทั้งหมด",
    openSolutions: "เปิดรายการโซลูชัน",
    allTools: "ดูเครื่องมือทั้งหมด",
    academy: "The KPI Plus Academy",
    academyBody: "หลักสูตรอบรมด้าน AI ทักษะดิจิทัล และการพัฒนาทักษะการทำงานสำหรับองค์กร",
    academyCta: "ดูหลักสูตรและกิจกรรม",
    contactTitle: "ติดต่อ เดอะ เคพีไอ พลัส",
    address:
      "58/15 ถนนเจ้าฟ้าตะวันออก ตำบลตลาดเหนือ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000 ประเทศไทย",
    privacy: "นโยบายความเป็นส่วนตัว",
    cookies: "นโยบายคุกกี้",
    cookieSettings: "ตั้งค่าคุกกี้",
    language: "ภาษา",
    openMenu: "เปิดเมนู",
    toolLinks: [
      { href: "/tools/revpar-calculator", label: "คำนวณ RevPAR, ADR และ Occupancy" },
      { href: "/tools/ota-commission-calculator", label: "คำนวณค่าคอมมิชชัน OTA" },
      { href: "/tools/hotel-profit-calculator", label: "คำนวณรายได้และกำไรโรงแรม" },
      { href: "/tools/hotel-searchability-check", label: "ตรวจสุขภาพการค้นหาเว็บไซต์" },
    ],
    knowLinks: [
      { href: "/approach", label: "แนวทางการทำงาน" },
      { href: "/insights", label: "บทความและมุมมอง" },
      { href: "/case-studies", label: "ผลงานลูกค้า" },
      { href: "/about", label: "เรื่องราวของ เดอะ เคพีไอ พลัส" },
      { href: "/associations", label: "พันธมิตรของเรา" },
      { href: "/partner", label: "สมัครเป็น Partner" },
      { href: "/contact", label: "ติดต่อเรา" },
    ],
  },
  en: {
    solutions: "Solutions",
    approach: "Approach",
    insights: "Insights",
    caseStudies: "Case studies",
    about: "About",
    contact: "Contact",
    audit: "Request a Hotel Performance Audit",
    footerAudit: "Request a performance and opportunity review",
    follow: "Follow The KPI Plus",
    statement: "Hotel revenue management and commercial growth partner",
    description:
      "We help hotels grow revenue, create demand, strengthen distribution, and use data, technology, and AI to decide and operate more effectively.",
    knowUs: "The KPI Plus",
    ourStory: "Our story",
    partners: "Companies in association",
    tools: "Free hotel tools",
    allSolutions: "View all solutions",
    openSolutions: "Open solutions menu",
    allTools: "See all tools",
    academy: "The KPI Plus Academy",
    academyBody: "AI, digital skills, and commercial capability programmes for hotel teams.",
    academyCta: "See programmes",
    contactTitle: "Contact The KPI Plus",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    privacy: "Privacy Notice",
    cookies: "Cookie Policy",
    cookieSettings: "Cookie settings",
    language: "Language",
    openMenu: "Open menu",
    toolLinks: [
      { href: "/tools/revpar-calculator", label: "RevPAR, ADR & occupancy" },
      { href: "/tools/ota-commission-calculator", label: "OTA commission calculator" },
      { href: "/tools/hotel-profit-calculator", label: "Hotel profit calculator" },
      { href: "/tools/hotel-searchability-check", label: "Hotel searchability check" },
    ],
    knowLinks: [
      { href: "/approach", label: "Approach" },
      { href: "/insights", label: "Insights" },
      { href: "/case-studies", label: "Case studies" },
      { href: "/about", label: "Our story" },
      { href: "/associations", label: "Companies in association" },
      { href: "/contact", label: "Contact" },
    ],
  },
  ru: {
    solutions: "Решения",
    approach: "Подход",
    insights: "Инсайты",
    caseStudies: "Кейсы",
    about: "О нас",
    contact: "Контакты",
    audit: "Запросить аудит",
    footerAudit: "Запросить аудит эффективности отеля",
    follow: "The KPI Plus в соцсетях",
    statement: "Партнёр по управлению доходами и коммерческому росту отелей",
    description:
      "Мы помогаем отелям увеличивать доход, создавать спрос, усиливать дистрибуцию и использовать данные, технологии и ИИ.",
    knowUs: "The KPI Plus",
    ourStory: "О компании",
    partners: "Партнёры",
    tools: "Бесплатные инструменты для отелей",
    allSolutions: "Все решения",
    openSolutions: "Открыть меню решений",
    allTools: "Все инструменты",
    academy: "The KPI Plus Academy",
    academyBody: "Программы по ИИ, цифровым навыкам и коммерческим компетенциям для команд отелей.",
    academyCta: "Смотреть программы",
    contactTitle: "Связаться с The KPI Plus",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    privacy: "Политика конфиденциальности",
    cookies: "Политика cookie",
    cookieSettings: "Cookie settings",
    language: "Язык",
    openMenu: "Открыть меню",
    toolLinks: [
      { href: "/tools/revpar-calculator", label: "RevPAR, ADR и загрузка" },
      { href: "/tools/ota-commission-calculator", label: "Комиссия OTA" },
      { href: "/tools/hotel-profit-calculator", label: "Прибыль и выручка" },
      { href: "/tools/hotel-searchability-check", label: "Проверка поисковой готовности" },
    ],
    knowLinks: [
      { href: "/approach", label: "Подход" },
      { href: "/insights", label: "Инсайты" },
      { href: "/case-studies", label: "Кейсы" },
      { href: "/about", label: "О компании" },
      { href: "/associations", label: "Партнёры" },
      { href: "/contact", label: "Контакты" },
    ],
  },
  zh: {
    solutions: "解決方案",
    approach: "服務方式",
    insights: "洞察",
    caseStudies: "客戶案例",
    about: "關於我們",
    contact: "聯絡我們",
    audit: "申請評估",
    footerAudit: "申請酒店績效評估",
    follow: "追蹤 The KPI Plus",
    statement: "酒店收益管理與商業成長夥伴",
    description: "我們協助酒店提升收益、創造需求、強化通路，並運用資料、科技與 AI 做出更好的決策。",
    knowUs: "The KPI Plus",
    ourStory: "公司故事",
    partners: "合作夥伴",
    tools: "免費酒店工具",
    allSolutions: "查看全部方案",
    openSolutions: "開啟方案選單",
    allTools: "查看全部工具",
    academy: "The KPI Plus Academy",
    academyBody: "為酒店團隊提供 AI、數位技能與商業能力課程。",
    academyCta: "查看課程",
    contactTitle: "聯絡 The KPI Plus",
    address: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
    privacy: "隱私權政策",
    cookies: "Cookie 政策",
    cookieSettings: "Cookie settings",
    language: "語言",
    openMenu: "開啟選單",
    toolLinks: [
      { href: "/tools/revpar-calculator", label: "RevPAR、ADR 與住房率" },
      { href: "/tools/ota-commission-calculator", label: "OTA 佣金" },
      { href: "/tools/hotel-profit-calculator", label: "收益與利潤" },
      { href: "/tools/hotel-searchability-check", label: "網站搜尋健康檢查" },
    ],
    knowLinks: [
      { href: "/approach", label: "服務方式" },
      { href: "/insights", label: "洞察" },
      { href: "/case-studies", label: "客戶案例" },
      { href: "/about", label: "公司故事" },
      { href: "/associations", label: "合作夥伴" },
      { href: "/contact", label: "聯絡我們" },
    ],
  },
} as const;

export function uiCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}

const groupTitles: Record<Locale, Record<(typeof solutionGroups)[number]["id"], string>> = {
  th: {
    "grow-revenue": "บริหารรายได้และการขาย",
    "grow-demand": "การตลาดและการจองตรง",
    "grow-capability": "บริหารและพัฒนาโรงแรม",
  },
  en: {
    "grow-revenue": "Grow Revenue",
    "grow-demand": "Grow Demand",
    "grow-capability": "Strengthen Operations",
  },
  ru: {
    "grow-revenue": "Рост дохода",
    "grow-demand": "Рост спроса",
    "grow-capability": "Усиление операций",
  },
  zh: {
    "grow-revenue": "提升收益",
    "grow-demand": "提升需求",
    "grow-capability": "強化營運",
  },
};

const solutionLabels: Record<Locale, Record<string, string>> = {
  th: {
    "/solutions/revenue-commercial-management": "บริหารรายได้และกลยุทธ์การขาย",
    "/solutions/outsourced-hotel-reservations": "บริการทีมรับจองสำหรับโรงแรม",
    "/solutions/b2b-agent-sales": "การขายผ่านเอเจนต์และคู่ค้า",
    "/solutions/google-ads-management": "Google Ads",
    "/solutions/meta-ads-management": "Facebook และ Meta Ads",
    "/solutions/hotel-seo-google-maps-ai-search": "SEO, Google Maps และ AI Search",
    "/solutions/hotel-website-design": "ออกแบบเว็บไซต์โรงแรม",
    "/solutions/hotel-direct-bookings": "เพิ่มการจองผ่านเว็บไซต์",
    "/solutions/independent-hotel-management": "บริหารโรงแรมอิสระ",
    "/solutions/hotel-systems-implementation": "ระบบโรงแรมและการนำไปใช้",
    "/solutions/hotel-ai-automation": "AI และ Automation",
    "/solutions/hotel-training-team-development": "ฝึกอบรมและพัฒนาทีม",
  },
  en: {
    "/solutions/revenue-commercial-management": "Revenue & Commercial Management",
    "/solutions/outsourced-hotel-reservations": "Outsourced Reservation Management",
    "/solutions/b2b-agent-sales": "B2B & Agent Sales",
    "/solutions/google-ads-management": "Google Ads Management",
    "/solutions/meta-ads-management": "Facebook & Meta Ads",
    "/solutions/hotel-seo-google-maps-ai-search": "SEO, Google Maps & AI Search",
    "/solutions/hotel-website-design": "Hotel Website Design",
    "/solutions/hotel-direct-bookings": "Website Conversion & Direct Bookings",
    "/solutions/independent-hotel-management": "Independent Hotel Management",
    "/solutions/hotel-systems-implementation": "Hotel Systems & Implementation",
    "/solutions/hotel-ai-automation": "Technology, AI & Automation",
    "/solutions/hotel-training-team-development": "Training & Team Development",
  },
  ru: {
    "/solutions/revenue-commercial-management": "Управление доходом и коммерцией",
    "/solutions/outsourced-hotel-reservations": "Аутсорсинг бронирования",
    "/solutions/b2b-agent-sales": "B2B и продажи через агентов",
    "/solutions/google-ads-management": "Управление Google Ads",
    "/solutions/meta-ads-management": "Facebook и Meta Ads",
    "/solutions/hotel-seo-google-maps-ai-search": "SEO, Google Maps и AI Search",
    "/solutions/hotel-website-design": "Дизайн сайта отеля",
    "/solutions/hotel-direct-bookings": "Конверсия сайта и прямые брони",
    "/solutions/independent-hotel-management": "Управление независимым отелем",
    "/solutions/hotel-systems-implementation": "Системы отеля и внедрение",
    "/solutions/hotel-ai-automation": "Технологии, ИИ и автоматизация",
    "/solutions/hotel-training-team-development": "Обучение и развитие команды",
  },
  zh: {
    "/solutions/revenue-commercial-management": "收益與商務管理",
    "/solutions/outsourced-hotel-reservations": "外包訂房服務",
    "/solutions/b2b-agent-sales": "B2B 與旅行社銷售",
    "/solutions/google-ads-management": "Google Ads 管理",
    "/solutions/meta-ads-management": "Facebook 與 Meta Ads",
    "/solutions/hotel-seo-google-maps-ai-search": "SEO、Google Maps 與 AI Search",
    "/solutions/hotel-website-design": "飯店網站設計",
    "/solutions/hotel-direct-bookings": "網站轉換與直銷預訂",
    "/solutions/independent-hotel-management": "獨立飯店管理",
    "/solutions/hotel-systems-implementation": "飯店系統與導入",
    "/solutions/hotel-ai-automation": "科技、AI 與自動化",
    "/solutions/hotel-training-team-development": "培訓與團隊發展",
  },
};

function keepExisting(links: readonly { href: string; label: string }[], locale: Locale) {
  return links.map((item) => ({
    href: existingHref(item.href, locale) ?? localizePath(item.href, locale),
    label: item.label,
  }));
}

function solutionItems(links: readonly { href: string; label: string }[], locale: Locale) {
  const labels = solutionLabels[locale];
  return keepExisting(links, locale).map((item, index) => {
    const href = links[index]?.href;
    return {
      ...item,
      label: (href ? labels[href] : undefined) ?? item.label,
    };
  });
}

export function solutionNavLabel(href: string, locale: Locale) {
  const labels = solutionLabels[locale];
  if (labels[href]) return labels[href];
  for (const group of solutionGroups) {
    for (const item of group.items) {
      if (item.href === href) return item.label;
    }
  }
  return href;
}

export function visibleSolutionGroups(locale: Locale) {
  const titles = groupTitles[locale];
  return solutionGroups
    .map((group) => ({
      id: group.id,
      title: titles[group.id],
      items: solutionItems(group.items, locale),
    }))
    .filter((group) => group.items.length > 0);
}

export function visiblePrimaryLinks(locale: Locale) {
  const t = uiCopy(locale);
  return keepExisting(
    [
      { href: "/approach", label: t.approach },
      { href: "/insights", label: t.insights },
      { href: "/case-studies", label: t.caseStudies },
      { href: "/about", label: t.about },
      { href: "/contact", label: t.contact },
    ],
    locale,
  );
}

export function visibleKnowLinks(locale: Locale) {
  return keepExisting(uiCopy(locale).knowLinks, locale);
}

export function visibleToolLinks(locale: Locale) {
  return keepExisting(uiCopy(locale).toolLinks, locale);
}
