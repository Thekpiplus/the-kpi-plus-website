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

export const CMS_LOCALES = ["th", "en", "ru", "zh"] as const;
export type CmsLocale = (typeof CMS_LOCALES)[number];

export const CMS_STATUSES = ["draft", "published", "scheduled"] as const;
export const CMS_MENUS = ["none", "header", "footer"] as const;

export function asBool(value: unknown) {
  return value === true || value === 1 || value === "1";
}
