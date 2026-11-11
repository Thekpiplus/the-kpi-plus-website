export const STAGES = [
  { name: "New lead", nameTh: "ลีดใหม่", sortOrder: 1, isWon: false, isLost: false },
  { name: "Contact attempted", nameTh: "พยายามติดต่อแล้ว", sortOrder: 2, isWon: false, isLost: false },
  { name: "Connected", nameTh: "คุยได้แล้ว", sortOrder: 3, isWon: false, isLost: false },
  { name: "Discovery / assessing needs", nameTh: "สำรวจความต้องการ", sortOrder: 4, isWon: false, isLost: false },
  { name: "Proposal sent", nameTh: "ส่งข้อเสนอแล้ว", sortOrder: 5, isWon: false, isLost: false },
  { name: "Negotiation", nameTh: "เจรจา", sortOrder: 6, isWon: false, isLost: false },
  { name: "Won", nameTh: "ปิดได้", sortOrder: 7, isWon: true, isLost: false },
  { name: "Lost", nameTh: "ไม่สำเร็จ", sortOrder: 8, isWon: false, isLost: true },
] as const;

/** Preset CRM services — full KPI Plus commercial catalogue. */
export const SERVICE_GROUPS = [
  {
    id: "revenue_reservations_sales",
    labelTh: "รายได้ จอง และการขาย",
    labelEn: "Revenue, Reservations & Sales",
    items: [
      "Revenue Management",
      "Outsourced Reservations",
      "B2B Sales & Agent Representation",
      "Revenue & Distribution Audit",
      "Revenue Strategy & Advisory",
      "OTA Setup & Optimisation",
      "Annual Revenue Budget & Forecast",
    ],
  },
  {
    id: "digital_marketing",
    labelTh: "การตลาดดิจิทัล",
    labelEn: "Digital Marketing",
    items: [
      "Social Media Management",
      "Meta Ads Management",
      "Google Ads Management",
      "Metasearch Ads Management",
      "SEO Management",
      "Local SEO & Google Business Profile Management",
      "AEO / GEO",
      "Email Marketing",
      "Influencer Campaign Management",
      "Marketing Audit & Strategy",
    ],
  },
  {
    id: "content_creative",
    labelTh: "คอนเทนต์และครีเอทีฟ",
    labelEn: "Content & Creative",
    items: [
      "Graphic Design",
      "Photography",
      "Photo & Video Production",
      "Reel Editing",
      "Blog & SEO Article Writing",
      "Translation & Localisation",
    ],
  },
  {
    id: "websites_technology",
    labelTh: "เว็บไซต์และเทคโนโลยี",
    labelEn: "Websites & Technology",
    items: [
      "Website Development",
      "Landing Page Development",
      "Website Maintenance",
      "Hosting & Domain Management",
      "Direct Booking Engine Integration",
      "LINE Official Account Setup",
      "Analytics & Conversion Tracking",
      "Performance Dashboards",
      "Property Management Systems",
      "Channel Manager Integration",
      "Hotel Systems Implementation",
    ],
  },
  {
    id: "hotel_consultancy",
    labelTh: "ที่ปรึกษาโรงแรม",
    labelEn: "Hotel Consultancy",
    items: [
      "Hotel Feasibility Studies",
      "Pre-Opening Commercial Setup",
      "Pre-Opening Consultancy",
      "Rebranding Strategy",
      "Owner Representation & Asset Management",
      "GM & Owner Mentorship",
      "Mystery Shopper Audits",
      "Sustainability Certification Support",
      "Investment Deck & Fundraising Preparation",
    ],
  },
  {
    id: "training_development",
    labelTh: "การฝึกอบรมและพัฒนา",
    labelEn: "Training & Development",
    items: [
      "Front Office & Reservations Training",
      "Revenue Management Training",
      "Housekeeping & Service Excellence",
      "Guest Experience & Complaint Handling",
      "Leadership Development",
      "Digital Skills for Hoteliers",
      "Sustainability & Eco Training",
      "Mystery Guest Roleplay Training",
      "Train-the-Trainer",
      "Custom Workshops",
    ],
  },
  {
    id: "real_estate_tourism",
    labelTh: "อสังหาฯ และการตลาดท่องเที่ยว",
    labelEn: "Real Estate & Tourism Marketing",
    items: [
      "Property Lead Generation",
      "Tour & Experience Advertising",
      "Tourism Booking Funnels",
    ],
  },
  {
    id: "integrated_packages",
    labelTh: "แพ็กเกจรวม",
    labelEn: "Integrated Packages",
    items: [
      "Revenue & Reservations",
      "Full Commercial Management",
      "Social Media & Meta Ads",
      "Social Content, Meta Ads & Google Ads",
      "Revenue Management & Content",
      "Revenue Management, Content & Meta Ads",
      "Revenue Management, Content, Meta Ads & Google Ads",
      "OTA Setup, Revenue Management & Content",
      "OTA Setup & Social Content",
      "Custom Service Packages",
    ],
  },
] as const;

export const SERVICES = SERVICE_GROUPS.flatMap((group) => [...group.items]) as readonly string[];

export type CrmService = (typeof SERVICES)[number];

export const SOURCES = [
  "website_form",
  "phone",
  "line",
  "whatsapp",
  "referral",
  "partner_referral",
  "event",
  "manual",
] as const;

export const ACTIVITY_TYPES = [
  "call",
  "email",
  "line",
  "whatsapp",
  "meeting",
  "proposal",
  "task",
] as const;

export const ACTIVITY_LABEL: Record<(typeof ACTIVITY_TYPES)[number], string> = {
  call: "โทร",
  email: "อีเมล",
  line: "LINE",
  whatsapp: "WhatsApp",
  meeting: "นัดคุย",
  proposal: "ส่งข้อเสนอ",
  task: "งานติดตาม",
};

export const LOST_REASONS = [
  "ราคาไม่ตรง",
  "เลือกคู่แข่ง",
  "ยังไม่พร้อม",
  "ติดต่อไม่ได้",
  "ไม่เข้าเงื่อนไขบริการ",
  "อื่น ๆ",
] as const;

export const FORM_SERVICE: Record<string, string> = {
  hotel_performance_audit: "Revenue & Distribution Audit",
  contact_enquiry: "Revenue Management",
  revenue_enquiry: "Revenue Management",
  reservations_enquiry: "Outsourced Reservations",
  b2b_enquiry: "B2B Sales & Agent Representation",
  google_ads_enquiry: "Google Ads Management",
  meta_ads_enquiry: "Meta Ads Management",
  search_enquiry: "SEO Management",
  website_enquiry: "Website Development",
  conversion_enquiry: "Direct Booking Engine Integration",
  hotel_systems_enquiry: "Hotel Systems Implementation",
  technology_enquiry: "Analytics & Conversion Tracking",
  training_enquiry: "Custom Workshops",
  independent_hotel_enquiry: "Full Commercial Management",
  general_enquiry: "Revenue Management",
};

export const SESSION_HOURS = 12;
export const DEVICE_CODE_MINUTES = 15;
export const RESET_MINUTES = 20;
export const IP_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const IP_ATTEMPT_LIMIT = 20;
export const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;
