import type { Locale } from "@/lib/seo";

export type EnquiryServiceId =
  | "revenue"
  | "reservations"
  | "b2b"
  | "google_ads"
  | "meta_ads"
  | "search"
  | "website"
  | "conversion"
  | "hotel_systems"
  | "technology"
  | "training"
  | "independent_hotel"
  | "general";

export type EnquiryService = {
  id: EnquiryServiceId;
  form: string;
  crmService: string;
  label: Record<Locale, string>;
  kicker: Record<Locale, string>;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  submit: Record<Locale, string>;
};

/** Shared service catalog for public enquiry forms and Lead Management. */
export const ENQUIRY_SERVICES: EnquiryService[] = [
  {
    id: "revenue",
    form: "revenue_enquiry",
    crmService: "Revenue Management",
    label: {
      th: "Revenue Management / รายได้",
      en: "Revenue Management",
      ru: "Revenue Management",
      zh: "收益管理",
    },
    kicker: {
      th: "Revenue & Commercial",
      en: "Revenue & Commercial",
      ru: "Revenue & Commercial",
      zh: "Revenue & Commercial",
    },
    title: {
      th: "คุยเรื่องรายได้และโอกาสของโรงแรม",
      en: "Talk about hotel revenue and commercial opportunity",
      ru: "Обсудить доход и коммерческие возможности отеля",
      zh: "討論飯店收益與商業機會",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "reservations",
    form: "reservations_enquiry",
    crmService: "OTA / Distribution",
    label: {
      th: "Outsourced Reservations",
      en: "Outsourced Reservations",
      ru: "Аутсорс бронирований",
      zh: "外包訂房",
    },
    kicker: {
      th: "Reservations",
      en: "Reservations",
      ru: "Reservations",
      zh: "Reservations",
    },
    title: {
      th: "คุยเรื่องงานสำรองห้องพัก",
      en: "Talk about outsourced reservations",
      ru: "Обсудить аутсорс бронирований",
      zh: "討論外包訂房",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "b2b",
    form: "b2b_enquiry",
    crmService: "OTA / Distribution",
    label: {
      th: "B2B & Agent Sales",
      en: "B2B & Agent Sales",
      ru: "B2B и агентские продажи",
      zh: "B2B 與代理銷售",
    },
    kicker: {
      th: "B2B & Distribution",
      en: "B2B & Distribution",
      ru: "B2B & Distribution",
      zh: "B2B & Distribution",
    },
    title: {
      th: "คุยเรื่อง B2B และเอเยนต์",
      en: "Talk about B2B and agent sales",
      ru: "Обсудить B2B и агентские продажи",
      zh: "討論 B2B 與代理銷售",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "google_ads",
    form: "google_ads_enquiry",
    crmService: "Marketing",
    label: {
      th: "Google Ads",
      en: "Google Ads",
      ru: "Google Ads",
      zh: "Google Ads",
    },
    kicker: {
      th: "Google Ads",
      en: "Google Ads",
      ru: "Google Ads",
      zh: "Google Ads",
    },
    title: {
      th: "คุยเรื่อง Google Ads สำหรับโรงแรม",
      en: "Talk about Google Ads for hotels",
      ru: "Обсудить Google Ads для отелей",
      zh: "討論飯店 Google Ads",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "meta_ads",
    form: "meta_ads_enquiry",
    crmService: "Marketing",
    label: {
      th: "Meta Ads",
      en: "Meta Ads",
      ru: "Meta Ads",
      zh: "Meta Ads",
    },
    kicker: {
      th: "Meta Ads",
      en: "Meta Ads",
      ru: "Meta Ads",
      zh: "Meta Ads",
    },
    title: {
      th: "คุยเรื่อง Meta Ads สำหรับโรงแรม",
      en: "Talk about Meta Ads for hotels",
      ru: "Обсудить Meta Ads для отелей",
      zh: "討論飯店 Meta Ads",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "search",
    form: "search_enquiry",
    crmService: "Marketing",
    label: {
      th: "SEO / Google Maps / AI Search",
      en: "SEO / Google Maps / AI Search",
      ru: "SEO / Google Maps / AI Search",
      zh: "SEO／Google Maps／AI Search",
    },
    kicker: {
      th: "SEO & Local Search",
      en: "SEO & Local Search",
      ru: "SEO & Local Search",
      zh: "SEO & Local Search",
    },
    title: {
      th: "คุยเรื่อง SEO และการค้นหาท้องถิ่น",
      en: "Talk about SEO and local search",
      ru: "Обсудить SEO и локальный поиск",
      zh: "討論 SEO 與在地搜尋",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "website",
    form: "website_enquiry",
    crmService: "Marketing",
    label: {
      th: "Hotel Website Design",
      en: "Hotel Website Design",
      ru: "Дизайн сайта отеля",
      zh: "飯店網站設計",
    },
    kicker: {
      th: "Website Design",
      en: "Website Design",
      ru: "Website Design",
      zh: "Website Design",
    },
    title: {
      th: "คุยเรื่องเว็บไซต์โรงแรม",
      en: "Talk about hotel website design",
      ru: "Обсудить дизайн сайта отеля",
      zh: "討論飯店網站設計",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "conversion",
    form: "conversion_enquiry",
    crmService: "Marketing",
    label: {
      th: "Website Conversion / Direct Booking",
      en: "Website Conversion / Direct Booking",
      ru: "Конверсия сайта / прямые бронирования",
      zh: "網站轉換／直銷預訂",
    },
    kicker: {
      th: "Direct Booking",
      en: "Direct Booking",
      ru: "Direct Booking",
      zh: "Direct Booking",
    },
    title: {
      th: "คุยเรื่องการจองตรงและ Conversion",
      en: "Talk about direct booking and conversion",
      ru: "Обсудить прямые бронирования и конверсию",
      zh: "討論直銷預訂與轉換",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "hotel_systems",
    form: "hotel_systems_enquiry",
    crmService: "Hotel systems",
    label: {
      th: "Hotel Systems Implementation",
      en: "Hotel Systems Implementation",
      ru: "Внедрение систем отеля",
      zh: "飯店系統導入",
    },
    kicker: {
      th: "Hotel Systems",
      en: "Hotel Systems",
      ru: "Hotel Systems",
      zh: "Hotel Systems",
    },
    title: {
      th: "คุยเรื่องระบบโรงแรม",
      en: "Talk about hotel systems",
      ru: "Обсудить системы отеля",
      zh: "討論飯店系統",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "technology",
    form: "technology_enquiry",
    crmService: "AI implementation",
    label: {
      th: "Technology / AI",
      en: "Technology / AI",
      ru: "Технологии / ИИ",
      zh: "科技／AI",
    },
    kicker: {
      th: "Technology & AI",
      en: "Technology & AI",
      ru: "Technology & AI",
      zh: "Technology & AI",
    },
    title: {
      th: "คุยเรื่องเทคโนโลยีและ AI",
      en: "Talk about technology and AI",
      ru: "Обсудить технологии и ИИ",
      zh: "討論科技與 AI",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "training",
    form: "training_enquiry",
    crmService: "Training",
    label: {
      th: "Training & Team Development",
      en: "Training & Team Development",
      ru: "Обучение и развитие команды",
      zh: "培訓與團隊發展",
    },
    kicker: {
      th: "Training",
      en: "Training",
      ru: "Training",
      zh: "Training",
    },
    title: {
      th: "คุยเรื่องการฝึกอบรมทีม",
      en: "Talk about team training",
      ru: "Обсудить обучение команды",
      zh: "討論團隊培訓",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "independent_hotel",
    form: "independent_hotel_enquiry",
    crmService: "Revenue Management",
    label: {
      th: "Independent Hotel Management",
      en: "Independent Hotel Management",
      ru: "Управление независимым отелем",
      zh: "獨立飯店管理",
    },
    kicker: {
      th: "Hotel Management",
      en: "Hotel Management",
      ru: "Hotel Management",
      zh: "Hotel Management",
    },
    title: {
      th: "คุยเรื่องการบริหารโรงแรมอิสระ",
      en: "Talk about independent hotel management",
      ru: "Обсудить управление независимым отелем",
      zh: "討論獨立飯店管理",
    },
    body: {
      th: "ส่งชื่อ กิจการ ช่องทางติดต่อ และข้อความสั้น ๆ ทีมจะติดต่อกลับเพื่อคุยต่อ",
      en: "Share your name, property, a contact detail, and an optional note. The team will reply to continue.",
      ru: "Оставьте имя, объект, контакт и короткое сообщение. Команда ответит, чтобы продолжить разговор.",
      zh: "留下姓名、飯店／事業、聯絡方式與簡短備註，團隊會回覆並繼續討論。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
  {
    id: "general",
    form: "contact_enquiry",
    crmService: "Revenue Management",
    label: {
      th: "ยังไม่แน่ใจ / อยากคุยภาพรวม",
      en: "Not sure yet / general enquiry",
      ru: "Пока не уверен / общий запрос",
      zh: "還不確定／一般諮詢",
    },
    kicker: {
      th: "Enquiry",
      en: "Enquiry",
      ru: "Enquiry",
      zh: "Enquiry",
    },
    title: {
      th: "ส่งข้อความถึงทีม เดอะ เคพีไอ พลัส",
      en: "Send a message to The KPI Plus",
      ru: "Написать команде The KPI Plus",
      zh: "傳送訊息給 The KPI Plus",
    },
    body: {
      th: "กรอกเฉพาะข้อมูลที่จำเป็น ทีมจะติดต่อกลับเพื่อถามรายละเอียดต่อหากต้องการ",
      en: "Share only what is needed to start. The team will ask for more detail later if useful.",
      ru: "Укажите только необходимое для старта. Команда уточнит детали позже, если нужно.",
      zh: "先填啟動所需資料即可，若有需要團隊稍後再補問細節。",
    },
    submit: {
      th: "ส่งข้อความถึงทีม",
      en: "Send to the team",
      ru: "Отправить команде",
      zh: "送出給團隊",
    },
  },
];

export const ENQUIRY_UI = {
  th: {
    name: "ชื่อผู้ติดต่อ",
    business: "ชื่อโรงแรม / กิจการ",
    contact: "เบอร์โทรหรืออีเมล",
    service: "บริการที่สนใจ",
    servicePlaceholder: "เลือกบริการ",
    message: "ข้อความ",
    messageOptional: "ไม่บังคับ",
    messageHint: "บอกสั้น ๆ ว่าอยากคุยเรื่องอะไร",
    consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
    privacy: "นโยบายความเป็นส่วนตัว",
    sending: "กำลังส่ง...",
    success: "ได้รับข้อความแล้ว ขอบคุณที่ติดต่อ เดอะ เคพีไอ พลัส ทีมจะติดต่อกลับผ่านช่องทางที่คุณให้ไว้",
    required: "กรุณากรอกข้อมูลนี้",
    invalidEmail: "กรุณาใส่อีเมลให้ถูกต้อง หรือใช้เบอร์โทร",
    failed: "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อทีมโดยตรง",
    unavailable: "ขณะนี้ยังส่งต่อทีมไม่ได้ กรุณาติดต่อทางอีเมลหรือโทรศัพท์",
    orTalk: "หรือคุยกับทีมโดยตรง",
    assessmentNote: "หากต้องการประเมินโรงแรมแบบละเอียด สามารถเริ่มจากแบบฟอร์มวิเคราะห์ Performance ได้จากหน้าแรก",
  },
  en: {
    name: "Your name",
    business: "Hotel / business name",
    contact: "Phone or email",
    service: "Service of interest",
    servicePlaceholder: "Choose a service",
    message: "Message",
    messageOptional: "Optional",
    messageHint: "A short note on what you want to discuss",
    consent: "I agree that The KPI Plus may use this information to reply about this request, under the",
    privacy: "privacy policy",
    sending: "Sending...",
    success: "Message received. Thank you for contacting The KPI Plus. The team will reply on the channel you shared.",
    required: "This field is required",
    invalidEmail: "Enter a valid email, or use a phone number",
    failed: "Could not send. Please try again, or contact the team directly.",
    unavailable: "This page cannot send the request right now. Please email or call the team.",
    orTalk: "Or talk to the team directly",
    assessmentNote: "For a fuller hotel assessment, use the Performance Audit form on the homepage.",
  },
  ru: {
    name: "Ваше имя",
    business: "Название отеля / бизнеса",
    contact: "Телефон или email",
    service: "Интересующая услуга",
    servicePlaceholder: "Выберите услугу",
    message: "Сообщение",
    messageOptional: "Необязательно",
    messageHint: "Коротко, о чём хотите поговорить",
    consent: "Я соглашаюсь, что The KPI Plus использует эти данные, чтобы ответить по этому запросу, согласно",
    privacy: "политике конфиденциальности",
    sending: "Отправка...",
    success: "Сообщение получено. Спасибо за обращение в The KPI Plus. Команда ответит по указанному каналу.",
    required: "Заполните это поле",
    invalidEmail: "Введите корректный email или укажите телефон",
    failed: "Не удалось отправить. Попробуйте ещё раз или свяжитесь с командой напрямую.",
    unavailable: "Сейчас страница не может передать запрос. Напишите на email или позвоните.",
    orTalk: "Или свяжитесь с командой напрямую",
    assessmentNote: "Для подробной оценки отеля используйте форму Performance Audit на главной странице.",
  },
  zh: {
    name: "聯絡人姓名",
    business: "飯店／事業名稱",
    contact: "電話或電子郵件",
    service: "感興趣的服務",
    servicePlaceholder: "選擇服務",
    message: "訊息",
    messageOptional: "選填",
    messageHint: "簡短說明想討論的事",
    consent: "我同意 The KPI Plus 使用這些資料以回覆此請求，並依",
    privacy: "隱私權政策",
    sending: "傳送中...",
    success: "已收到訊息。感謝聯繫 The KPI Plus，團隊會透過你留下的管道回覆。",
    required: "請填寫此欄",
    invalidEmail: "請輸入正確的電子郵件，或改填電話",
    failed: "無法送出。請再試一次，或直接聯繫團隊。",
    unavailable: "此頁目前無法把資料轉給團隊。請改用電子郵件或電話。",
    orTalk: "或直接與團隊聯繫",
    assessmentNote: "若需要更完整的飯店評估，可使用首頁的 Performance Audit 表單。",
  },
} as const;

export function enquiryServiceById(id: string | undefined | null) {
  return ENQUIRY_SERVICES.find((item) => item.id === id) ?? null;
}

export function enquiryServiceByForm(form: string | undefined | null) {
  return ENQUIRY_SERVICES.find((item) => item.form === form) ?? null;
}

export function isEnquiryServiceId(value: string): value is EnquiryServiceId {
  return ENQUIRY_SERVICES.some((item) => item.id === value);
}
