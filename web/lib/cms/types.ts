export type CmsDocumentRow = {
  id: string;
  kind: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  template: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  imageAlt: string;
  category: string;
  tags: string;
  author: string;
  seoTitle: string;
  metaDescription: string;
  canonical: string;
  ogImage: string;
  noindex: boolean;
  showInMenu: boolean;
  menu: string;
  menuLabel: string;
  menuParent: string;
  menuPosition: number;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  trashedAt: Date | null;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CmsMediaRow = {
  id: string;
  filename: string;
  path: string;
  alt: string;
  caption: string;
  mime: string;
  size: number;
  createdAt: Date;
};

export type CmsRedirectRow = {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  active: boolean;
  createdAt: Date;
};

export type CmsSettingRow = {
  id: string;
  value: string;
  updatedAt: Date;
};

export type CmsContactRow = {
  id: string;
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
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export const CMS_LOCALES = ["th", "en", "ru", "zh"] as const;
export type CmsLocale = (typeof CMS_LOCALES)[number];

export const CMS_STATUSES = ["draft", "published", "scheduled"] as const;
export const CMS_MENUS = ["none", "header", "footer"] as const;

export function asBool(value: unknown) {
  return value === true || value === 1 || value === "1";
}
