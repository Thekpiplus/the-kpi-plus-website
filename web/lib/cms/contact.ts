import {
  COMPANY,
  formatPhoneDisplay,
  isHttpUrl,
  mailtoHref,
  phoneHref,
  whatsappHrefFromNumber,
  whatsappNumberFrom,
  type CompanyContact,
} from "@/lib/company";
import type { CmsContactRow } from "./types";

export const LOCATION_IMAGE_HINT = "แนะนำ 1600×1067 พิกเซล (3:2) JPG / PNG / WEBP ไม่เกิน 5MB";
export const CONSULTANT_IMAGE_HINT = "แนะนำ 800×1000 พิกเซล (4:5) JPG / PNG / WEBP ไม่เกิน 5MB";
export const MAX_CONTACT_IMAGE_BYTES = 5 * 1024 * 1024;
export const CONTACT_IMAGE_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MAPS_HOST = /(?:^https:\/\/(?:www\.)?(?:google\.[^/]+\/maps|maps\.google\.[^/]+|maps\.app\.goo\.gl|goo\.gl\/maps))/i;

export type ContactSaveInput = {
  id?: string;
  label: string;
  companyNameTh: string;
  companyNameEn: string;
  addressTh: string;
  addressEn: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  hoursTh: string;
  hoursEn: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  lineHref: string;
  locationImage: string;
  locationImageAlt: string;
  consultantImage: string;
  consultantImageAlt: string;
  adminNotes: string;
  isPrimary: boolean;
};

export type ContactSaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isMapsUrl(value: string) {
  const next = trim(value);
  if (!next) return true;
  return isHttpUrl(next) && MAPS_HOST.test(next);
}

export function isMapsEmbedUrl(value: string) {
  const next = trim(value);
  if (!next) return true;
  return /^https:\/\//i.test(next) && /google\.[^/]+\/maps\/embed/i.test(next);
}

export function hasVerifiedMapsUrl(value: string | undefined | null) {
  const next = trim(value);
  return Boolean(next) && isMapsUrl(next);
}

export function hasVerifiedMapsEmbed(value: string | undefined | null) {
  const next = trim(value);
  return Boolean(next) && isMapsEmbedUrl(next);
}

export function hasUsableChannel(input: Pick<ContactSaveInput, "phone" | "secondaryPhone" | "email" | "whatsappNumber">) {
  return Boolean(
    formatPhoneDisplay(input.phone) ||
      formatPhoneDisplay(input.secondaryPhone) ||
      mailtoHref(input.email) ||
      whatsappNumberFrom(input.whatsappNumber),
  );
}

export function validateContactInput(input: ContactSaveInput): string | null {
  if (input.email && !mailtoHref(input.email)) return "invalid_email";
  if (input.phone && !formatPhoneDisplay(input.phone)) return "invalid_phone";
  if (input.secondaryPhone && !formatPhoneDisplay(input.secondaryPhone)) return "invalid_phone";
  if (input.whatsappNumber) {
    const digits = whatsappNumberFrom(input.whatsappNumber);
    if (!digits || !/^[1-9]\d{9,14}$/.test(digits)) return "invalid_whatsapp";
  }
  if (input.googleMapsUrl && !isMapsUrl(input.googleMapsUrl)) return "invalid_maps";
  if (input.googleMapsEmbed && !isMapsEmbedUrl(input.googleMapsEmbed)) return "invalid_maps_embed";
  for (const href of [input.facebook, input.instagram, input.linkedin, input.tiktok, input.lineHref]) {
    if (href && !isHttpUrl(href)) return "invalid_social";
  }
  if (!hasUsableChannel(input)) return "missing_channel";
  return null;
}

export function contactErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_email: "รูปแบบอีเมลไม่ถูกต้อง",
    invalid_phone: "รูปแบบเบอร์โทรไม่ถูกต้อง",
    invalid_whatsapp: "หมายเลข WhatsApp ต้องมีรหัสประเทศ เช่น 66826356266",
    invalid_maps: "ลิงก์ Google Maps ต้องเป็น https://maps.app.goo.gl หรือ Google Maps",
    invalid_maps_embed: "Embed URL ต้องเป็น https://www.google.com/maps/embed...",
    invalid_social: "ลิงก์โซเชียลต้องขึ้นต้นด้วย https://",
    missing_channel: "ต้องมีช่องทางติดต่ออย่างน้อยหนึ่งอย่าง: โทร อีเมล หรือ WhatsApp",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบรายการติดต่อ",
    last_primary: "ไม่สามารถลบรายการหลักรายการเดียวได้ — ตั้งรายการอื่นเป็นหลักก่อน",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function inputFromForm(formData: FormData): ContactSaveInput {
  return {
    id: trim(formData.get("id")) || undefined,
    label: trim(formData.get("label")),
    companyNameTh: trim(formData.get("companyNameTh")),
    companyNameEn: trim(formData.get("companyNameEn")),
    addressTh: trim(formData.get("addressTh")),
    addressEn: trim(formData.get("addressEn")),
    phone: formatPhoneDisplay(trim(formData.get("phone"))),
    secondaryPhone: formatPhoneDisplay(trim(formData.get("secondaryPhone"))),
    email: trim(formData.get("email")),
    whatsappNumber: whatsappNumberFrom(trim(formData.get("whatsappNumber"))),
    googleMapsUrl: trim(formData.get("googleMapsUrl")),
    googleMapsEmbed: trim(formData.get("googleMapsEmbed")),
    hoursTh: trim(formData.get("hoursTh")),
    hoursEn: trim(formData.get("hoursEn")),
    facebook: trim(formData.get("facebook")),
    instagram: trim(formData.get("instagram")),
    linkedin: trim(formData.get("linkedin")),
    tiktok: trim(formData.get("tiktok")),
    lineHref: trim(formData.get("lineHref")),
    locationImage: trim(formData.get("locationImage")),
    locationImageAlt: trim(formData.get("locationImageAlt")),
    consultantImage: trim(formData.get("consultantImage")),
    consultantImageAlt: trim(formData.get("consultantImageAlt")),
    adminNotes: trim(formData.get("adminNotes")),
    isPrimary: formData.get("isPrimary") === "1",
  };
}

export function emptyContactInput(): ContactSaveInput {
  return {
    label: "",
    companyNameTh: "",
    companyNameEn: "",
    addressTh: "",
    addressEn: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    whatsappNumber: "",
    googleMapsUrl: "",
    googleMapsEmbed: "",
    hoursTh: "",
    hoursEn: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    lineHref: "",
    locationImage: "",
    locationImageAlt: "",
    consultantImage: "",
    consultantImageAlt: "",
    adminNotes: "",
    isPrimary: false,
  };
}

export function inputFromRow(row: CmsContactRow): ContactSaveInput {
  return {
    id: row.id,
    label: row.label,
    companyNameTh: row.companyNameTh,
    companyNameEn: row.companyNameEn,
    addressTh: row.addressTh,
    addressEn: row.addressEn,
    phone: row.phone,
    secondaryPhone: row.secondaryPhone,
    email: row.email,
    whatsappNumber: row.whatsappNumber,
    googleMapsUrl: row.googleMapsUrl,
    googleMapsEmbed: row.googleMapsEmbed,
    hoursTh: row.hoursTh,
    hoursEn: row.hoursEn,
    facebook: row.facebook,
    instagram: row.instagram,
    linkedin: row.linkedin,
    tiktok: row.tiktok,
    lineHref: row.lineHref,
    locationImage: row.locationImage,
    locationImageAlt: row.locationImageAlt,
    consultantImage: row.consultantImage,
    consultantImageAlt: row.consultantImageAlt,
    adminNotes: row.adminNotes,
    isPrimary: row.isPrimary,
  };
}

export function publicFieldsFromInput(input: ContactSaveInput) {
  return {
    label: input.label,
    companyNameTh: input.companyNameTh,
    companyNameEn: input.companyNameEn,
    addressTh: input.addressTh,
    addressEn: input.addressEn,
    phone: input.phone,
    secondaryPhone: input.secondaryPhone,
    email: input.email,
    whatsappNumber: input.whatsappNumber,
    googleMapsUrl: input.googleMapsUrl,
    googleMapsEmbed: input.googleMapsEmbed,
    hoursTh: input.hoursTh,
    hoursEn: input.hoursEn,
    facebook: input.facebook,
    instagram: input.instagram,
    linkedin: input.linkedin,
    tiktok: input.tiktok,
    lineHref: input.lineHref,
    locationImage: input.locationImage,
    locationImageAlt: input.locationImageAlt,
    consultantImage: input.consultantImage,
    consultantImageAlt: input.consultantImageAlt,
    isPrimary: input.isPrimary,
  };
}

export function companyFromInput(input: ContactSaveInput): CompanyContact {
  const phone1 = formatPhoneDisplay(input.phone);
  const phone2 = formatPhoneDisplay(input.secondaryPhone);
  return {
    taxId: COMPANY.taxId,
    companyNameTh: input.companyNameTh,
    companyNameEn: input.companyNameEn,
    addressTh: input.addressTh,
    addressEn: input.addressEn,
    email: input.email,
    phones: [phone1, phone2].filter(Boolean).map((display) => ({ display, href: phoneHref(display) })),
    whatsappHref: whatsappHrefFromNumber(input.whatsappNumber),
    lineHref: input.lineHref,
    mapsShare: input.googleMapsUrl,
    mapsEmbed: input.googleMapsEmbed,
    geo: COMPANY.geo,
    social: {
      facebook: input.facebook,
      instagram: input.instagram,
      linkedin: input.linkedin,
      tiktok: input.tiktok,
    },
    hoursTh: input.hoursTh,
    hoursEn: input.hoursEn,
    officePhoto: input.locationImage,
    officePhotoAlt: input.locationImageAlt,
    consultantPhoto: input.consultantImage,
    consultantPhotoAlt: input.consultantImageAlt,
  };
}

export function companyFromContact(row: CmsContactRow): CompanyContact {
  return companyFromInput(inputFromRow(row));
}

export function seedInputFromCompany(company: CompanyContact): ContactSaveInput {
  return {
    label: "สำนักงานภูเก็ต",
    companyNameTh: company.companyNameTh || "บริษัท เดอะ เคพีไอ พลัส จำกัด",
    companyNameEn: company.companyNameEn || "The KPI Plus Co., Ltd.",
    addressTh: company.addressTh,
    addressEn: company.addressEn,
    phone: company.phones[0]?.display ?? "",
    secondaryPhone: company.phones[1]?.display ?? "",
    email: company.email,
    whatsappNumber: whatsappNumberFrom(company.whatsappHref),
    googleMapsUrl: company.mapsShare,
    googleMapsEmbed: company.mapsEmbed,
    hoursTh: company.hoursTh,
    hoursEn: company.hoursEn,
    facebook: company.social.facebook,
    instagram: company.social.instagram,
    linkedin: company.social.linkedin,
    tiktok: company.social.tiktok,
    lineHref: company.lineHref,
    locationImage: company.officePhoto,
    locationImageAlt: "",
    consultantImage: company.consultantPhoto,
    consultantImageAlt: company.consultantPhotoAlt,
    adminNotes: "",
    isPrimary: true,
  };
}

export function placeholdersFromCompany() {
  return seedInputFromCompany(COMPANY);
}
