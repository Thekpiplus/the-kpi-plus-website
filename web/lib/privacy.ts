import { LEGAL_NAME } from "@/lib/seo";

export const POLICY_VERSION = "1.0";
export const CONSENT_VERSION = "1.0";
export const EFFECTIVE_DATE_ISO = "2026-09-28";
export const CONSENT_MAX_AGE_DAYS = 365;

export const PRIVACY_CONTACT = {
  name: "Isara Isaraniran",
  roleTh: "ผู้ประสานงานด้านข้อมูลส่วนบุคคล",
  roleEn: "privacy contact",
  addressTh: "58/15 ถนนเจ้าฟ้าตะวันออก ตำบลตลาดเหนือ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000 ประเทศไทย",
  addressEn: "58/15 Chao Fa East Road, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
  email: "info@thekpiplus.com",
  phone: "+66 82 635 6266",
  whatsapp: "https://wa.me/66826356266",
  line: "https://lin.ee/TQibLMD",
} as const;

export const CONTROLLER = {
  th: `${LEGAL_NAME.th} (เลขประจำตัวผู้เสียภาษี 0835564008629)`,
  en: `${LEGAL_NAME.en} (Tax ID 0835564008629)`,
} as const;

export function formatPolicyDate(locale: "th" | "en") {
  const date = new Date(`${EFFECTIVE_DATE_ISO}T00:00:00+07:00`);
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

export function policyMeta(locale: "th" | "en") {
  const date = formatPolicyDate(locale);
  if (locale === "th") {
    return `The KPI Plus · ฉบับที่ ${POLICY_VERSION} · มีผลบังคับใช้ตั้งแต่ ${date} · ปรับปรุงล่าสุด ${date}`;
  }
  return `The KPI Plus · Version ${POLICY_VERSION} · Effective ${date} · Last updated ${date}`;
}

export const CONSENT_COPY = {
  th: {
    bannerTitle: "คุกกี้บนเว็บไซต์นี้",
    bannerBody:
      "เราใช้คุกกี้ที่จำเป็นเพื่อให้เว็บไซต์ทำงานได้ และจะใช้คุกกี้เพื่อการวิเคราะห์ (Google Analytics) ก็ต่อเมื่อคุณอนุญาต คุณเปลี่ยนใจได้ทุกเมื่อที่ “ตั้งค่าคุกกี้” ด้านล่างของทุกหน้า",
    acceptAll: "ยอมรับทั้งหมด",
    rejectAll: "ปฏิเสธทั้งหมด",
    settings: "ตั้งค่า",
    dialogTitle: "ตั้งค่าคุกกี้",
    dialogIntro: "เลือกได้ว่าจะอนุญาตคุกกี้หมวดใด การปิดหมวดที่ไม่จำเป็นไม่มีผลต่อการใช้งานพื้นฐานของเว็บไซต์",
    necessary: "จำเป็น — ทำให้เว็บไซต์ทำงานได้อย่างปลอดภัยและจดจำตัวเลือกของคุณ",
    necessaryState: "เปิดตลอด",
    analytics: "การวิเคราะห์ — ช่วยให้เราเข้าใจการใช้งานเว็บไซต์ผ่าน Google Analytics เพื่อปรับปรุงเนื้อหา",
    on: "เปิด",
    off: "ปิด",
    save: "บันทึกการตั้งค่า",
    close: "ปิดหน้าต่างตั้งค่า (ไม่เปลี่ยนตัวเลือก)",
    saved: "บันทึกการตั้งค่าคุกกี้แล้ว",
    footer: "ตั้งค่าคุกกี้",
    reconsent: "เราปรับปรุงการใช้คุกกี้ของเรา โปรดตรวจสอบและเลือกอีกครั้ง",
    cookiePolicy: "นโยบายคุกกี้",
    privacy: "นโยบายความเป็นส่วนตัว",
    alwaysOn: "เปิดตลอด",
    mapPlaceholder: "เนื้อหานี้มาจาก Google Maps ซึ่งอาจตั้งคุกกี้ของตนเอง",
    showMap: "แสดงแผนที่",
  },
  en: {
    bannerTitle: "Cookies on this site",
    bannerBody:
      "We use necessary cookies to make this site work. We’ll use analytics cookies (Google Analytics) only if you allow them. You can change your mind any time under “Cookie settings” at the bottom of every page.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    settings: "Settings",
    dialogTitle: "Cookie settings",
    dialogIntro: "Choose which cookies you allow. Switching off optional categories won’t affect the basic use of the site.",
    necessary: "Necessary — keep the site working securely and remember your choices.",
    necessaryState: "Always on",
    analytics: "Analytics — help us understand how the site is used, through Google Analytics, so we can improve it.",
    on: "On",
    off: "Off",
    save: "Save settings",
    close: "Close settings (no changes saved)",
    saved: "Cookie settings saved",
    footer: "Cookie settings",
    reconsent: "We’ve updated how we use cookies. Please review and choose again.",
    cookiePolicy: "Cookie Policy",
    privacy: "Privacy Notice",
    alwaysOn: "Always on",
    mapPlaceholder: "This content is from Google Maps, which may set its own cookies.",
    showMap: "Show map",
  },
} as const;

export const FORM_NOTICE = {
  th: {
    contact:
      "เราจะใช้ชื่อ ข้อมูลติดต่อ และข้อความของคุณเพื่อตอบคำถามและติดต่อกลับเรื่องที่คุณสอบถาม โปรดอย่าใส่ข้อมูลอ่อนไหว เช่น ข้อมูลสุขภาพ",
    partner:
      "เราจะใช้ข้อมูลในใบสมัครเพื่อพิจารณาความร่วมมือ ติดต่อกลับ และให้คุณเข้า Partner Portal เพื่อคีย์ลีดและแนบเอกสาร",
    more: "อ่านเพิ่มเติมใน",
    privacy: "นโยบายความเป็นส่วนตัว",
  },
  en: {
    contact:
      "We’ll use your name, contact details and message to answer your enquiry and get back to you. Please don’t include sensitive information such as health details.",
    partner:
      "We’ll use the details in your application to assess the partnership, contact you, and give you Partner Portal access to submit leads and documents.",
    more: "See our",
    privacy: "Privacy Notice",
  },
} as const;

export type ConsentChoice = {
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  v: string;
  ts: string;
  id: string;
  c: ConsentChoice;
};

export function emptyChoice(): ConsentChoice {
  return { preferences: false, analytics: false, marketing: false };
}
