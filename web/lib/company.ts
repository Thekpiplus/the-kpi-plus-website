export type CompanyPhone = {
  display: string;
  href: string;
};

export type ContactSocialLink = {
  name: string;
  href: string;
};

/** Locale-resolved contact object for ContactCard and other chrome. */
export type ContactInfo = {
  companyName: string;
  address: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  whatsappNumber?: string;
  googleMapsUrl?: string;
  businessHours?: string;
  socialLinks?: ContactSocialLink[];
};

export type CompanyContact = {
  taxId: string;
  companyNameTh: string;
  companyNameEn: string;
  addressTh: string;
  addressEn: string;
  email: string;
  phones: CompanyPhone[];
  whatsappHref: string;
  lineHref: string;
  mapsShare: string;
  mapsEmbed: string;
  geo: { latitude: number; longitude: number };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
  };
  hoursTh: string;
  hoursEn: string;
  officePhoto: string;
  officePhotoAlt: string;
  consultantPhoto: string;
  consultantPhotoAlt: string;
};

export type SiteContactOverrides = {
  email?: string;
  phone1?: string;
  phone2?: string;
  whatsappHref?: string;
  lineHref?: string;
  addressTh?: string;
  addressEn?: string;
  mapsShare?: string;
  mapsEmbed?: string;
  hoursTh?: string;
  hoursEn?: string;
  officePhoto?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  companyNameTh?: string;
  companyNameEn?: string;
  officePhotoAlt?: string;
  consultantPhoto?: string;
  consultantPhotoAlt?: string;
};

export function phoneHref(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("66")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+66${digits.slice(1)}`;
  return `tel:+${digits}`;
}

function phone(display: string): CompanyPhone {
  return { display, href: phoneHref(display) };
}

function pick(value: string | undefined, fallback: string) {
  const next = value?.trim();
  return next ? next : fallback;
}

export const COMPANY: CompanyContact = {
  taxId: "0835564008629",
  companyNameTh: "บริษัท เดอะ เคพีไอ พลัส จำกัด",
  companyNameEn: "The KPI Plus Co., Ltd.",
  addressTh: "58/15 ถนนเจ้าฟ้าตะวันออก ตำบลตลาดเหนือ อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000 ประเทศไทย",
  addressEn: "58/15 E Chaofah Rd, Talat Nuea, Mueang Phuket, Phuket 83000, Thailand",
  email: "info@thekpiplus.com",
  phones: [phone("+66 82 635 6266"), phone("+66 62 635 6646")],
  whatsappHref: "https://wa.me/66826356266",
  lineHref: "https://lin.ee/TQibLMD",
  mapsShare: "https://maps.app.goo.gl/NH9nL4gnbEPNDrKHA",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1730606366514!2d98.37976420000001!3d7.876953599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f58d4421b81%3A0xe198314f812e6886!2sThe%20KPI%20Plus%20Co.%2C%20Ltd.!5e0!3m2!1sen!2sth!4v1790311990658!5m2!1sen!2sth",
  geo: { latitude: 7.8769536, longitude: 98.3797642 },
  social: {
    facebook: "https://www.facebook.com/thekpiplus/",
    instagram: "https://www.instagram.com/thekpiplus/",
    linkedin: "https://www.linkedin.com/company/thekpiplus/",
    tiktok: "https://www.tiktok.com/@thekpiplus",
  },
  hoursTh: "",
  hoursEn: "",
  officePhoto: "",
  officePhotoAlt: "",
  consultantPhoto: "",
  consultantPhotoAlt: "",
};

export function mergeCompany(overrides: SiteContactOverrides | null | undefined): CompanyContact {
  const over = overrides ?? {};
  const phone1 = pick(over.phone1, COMPANY.phones[0]?.display ?? "");
  const phone2 = pick(over.phone2, COMPANY.phones[1]?.display ?? "");
  return {
    taxId: COMPANY.taxId,
    companyNameTh: pick(over.companyNameTh, COMPANY.companyNameTh),
    companyNameEn: pick(over.companyNameEn, COMPANY.companyNameEn),
    addressTh: pick(over.addressTh, COMPANY.addressTh),
    addressEn: pick(over.addressEn, COMPANY.addressEn),
    email: pick(over.email, COMPANY.email),
    phones: [phone1, phone2].filter(Boolean).map(phone),
    whatsappHref: pick(over.whatsappHref, COMPANY.whatsappHref),
    lineHref: pick(over.lineHref, COMPANY.lineHref),
    mapsShare: pick(over.mapsShare, COMPANY.mapsShare),
    mapsEmbed: pick(over.mapsEmbed, COMPANY.mapsEmbed),
    geo: COMPANY.geo,
    social: {
      facebook: pick(over.facebook, COMPANY.social.facebook),
      instagram: pick(over.instagram, COMPANY.social.instagram),
      linkedin: pick(over.linkedin, COMPANY.social.linkedin),
      tiktok: pick(over.tiktok, COMPANY.social.tiktok),
    },
    hoursTh: pick(over.hoursTh, COMPANY.hoursTh),
    hoursEn: pick(over.hoursEn, COMPANY.hoursEn),
    officePhoto: pick(over.officePhoto, COMPANY.officePhoto),
    officePhotoAlt: pick(over.officePhotoAlt, COMPANY.officePhotoAlt),
    consultantPhoto: pick(over.consultantPhoto, COMPANY.consultantPhoto),
    consultantPhotoAlt: pick(over.consultantPhotoAlt, COMPANY.consultantPhotoAlt),
  };
}

export function companyAddress(company: CompanyContact, locale: string) {
  return locale === "th" ? company.addressTh : company.addressEn;
}

export function companyHours(company: CompanyContact, locale: string) {
  return locale === "th" ? company.hoursTh : company.hoursEn || company.hoursTh;
}

function nonempty(value: string | undefined | null) {
  return value?.trim() ? value.trim() : "";
}

export function isHttpUrl(value: string | undefined | null) {
  return /^https?:\/\//i.test(nonempty(value));
}

export function formatPhoneDisplay(value: string | undefined | null) {
  const digits = nonempty(value).replace(/\D/g, "");
  if (!digits) return "";
  let local = digits;
  if (local.startsWith("66")) local = local.slice(2);
  else if (local.startsWith("0")) local = local.slice(1);
  if (local.length === 9) return `+66 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  if (local.length === 8) return `+66 ${local.slice(0, 1)} ${local.slice(1, 5)} ${local.slice(5)}`;
  if (digits.startsWith("66")) return `+${digits}`;
  return nonempty(value);
}

export function telHref(value: string | undefined | null) {
  return phoneHref(formatPhoneDisplay(value) || nonempty(value));
}

export function mailtoHref(email: string | undefined | null) {
  const next = nonempty(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) return "";
  return `mailto:${next}`;
}

export function whatsappNumberFrom(value: string | undefined | null) {
  const raw = nonempty(value);
  if (!raw) return "";
  const fromUrl = raw.match(/wa\.me\/(\+?\d+)/i)?.[1] ?? "";
  let digits = (fromUrl || raw).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) digits = `66${digits.slice(1)}`;
  if (!digits.startsWith("66") && digits.length === 9) digits = `66${digits}`;
  return digits.length >= 8 ? digits : "";
}

export function whatsappHrefFromNumber(value: string | undefined | null) {
  const digits = whatsappNumberFrom(value);
  return digits ? `https://wa.me/${digits}` : "";
}

function socialLink(name: string, href: string | undefined): ContactSocialLink | null {
  const next = nonempty(href);
  if (!isHttpUrl(next)) return null;
  return { name, href: next };
}

export function contactInfoFromCompany(company: CompanyContact, locale: string): ContactInfo {
  const phone = formatPhoneDisplay(company.phones[0]?.display);
  const secondaryPhone = formatPhoneDisplay(company.phones[1]?.display);
  const email = nonempty(company.email);
  const address = nonempty(companyAddress(company, locale));
  const hours = nonempty(companyHours(company, locale));
  const maps = isHttpUrl(company.mapsShare) ? company.mapsShare : "";
  const whatsappNumber = whatsappNumberFrom(company.whatsappHref);
  const socialLinks = [
    socialLink("LINE", company.lineHref),
    socialLink("Facebook", company.social.facebook),
    socialLink("Instagram", company.social.instagram),
    socialLink("LinkedIn", company.social.linkedin),
    socialLink("TikTok", company.social.tiktok),
  ].filter((item): item is ContactSocialLink => Boolean(item));

  return {
    companyName:
      locale === "th"
        ? company.companyNameTh || COMPANY.companyNameTh
        : company.companyNameEn || company.companyNameTh || COMPANY.companyNameEn,
    address,
    phone,
    ...(secondaryPhone && secondaryPhone !== phone ? { secondaryPhone } : {}),
    email: mailtoHref(email) ? email : "",
    ...(whatsappNumber ? { whatsappNumber } : {}),
    ...(maps ? { googleMapsUrl: maps } : {}),
    ...(hours ? { businessHours: hours } : {}),
    ...(socialLinks.length ? { socialLinks } : {}),
  };
}
