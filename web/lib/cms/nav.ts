/** CMS admin navigation — real routes only. */

import type { CrmSubNavIconName } from "@/components/crm/CrmSubNavIcons";

export type CmsNavLink = {
  href: string;
  label: string;
  icon?: CrmSubNavIconName;
  children?: CmsNavLink[];
};

/** Primary Content Management links shown in the CMS subnav / rail. */
export const CMS_CONTENT_LINKS: CmsNavLink[] = [
  { href: "/crm/cms", label: "ภาพรวม", icon: "home" },
  { href: "/crm/cms/pages", label: "หน้าเว็บ", icon: "pages" },
  { href: "/crm/cms/insights", label: "บทความ", icon: "article" },
  { href: "/crm/cms/solutions", label: "บริการ", icon: "grid" },
  { href: "/crm/cms/menus", label: "เมนูเว็บ", icon: "menu" },
  { href: "/crm/cms/media", label: "คลังไฟล์", icon: "media" },
  { href: "/crm/cms/seo", label: "SEO", icon: "search" },
];

/** Site settings that belong with CMS content (users stay under ตั้งค่าระบบ). */
export const CMS_SYSTEM_LINKS: CmsNavLink[] = [
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บ", icon: "settings" },
];

export const CMS_ACCOUNT_LINKS: CmsNavLink[] = [
  { href: "/crm/users", label: "ผู้ใช้งานและสิทธิ์", icon: "users" },
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บไซต์", icon: "settings" },
];

/** Solution / specialty page editors kept reachable without cluttering the primary IA. */
export const CMS_SOLUTION_LINKS: CmsNavLink[] = [
  { href: "/crm/cms/about-us", label: "เกี่ยวกับเรา", icon: "users" },
  { href: "/crm/cms/approach", label: "แนวทางของเรา", icon: "layers" },
  { href: "/crm/cms/contact-us", label: "ติดต่อเรา", icon: "handshake" },
  { href: "/crm/cms/case-studies", label: "ผลงานลูกค้า", icon: "chart" },
  { href: "/crm/cms/case-studies-page", label: "หน้าผลงาน", icon: "pages" },
  { href: "/crm/cms/client-logos", label: "โลโก้ลูกค้า", icon: "media" },
  { href: "/crm/cms/hotel-marketing", label: "Hotel Marketing", icon: "megaphone" },
  { href: "/crm/cms/revenue", label: "Revenue & Commercial", icon: "chart" },
  { href: "/crm/cms/reservations", label: "Reservations", icon: "calendar" },
  { href: "/crm/cms/b2b", label: "B2B Agent Sales", icon: "handshake" },
  { href: "/crm/cms/google-ads", label: "Google Ads", icon: "megaphone" },
  { href: "/crm/cms/meta-ads", label: "Meta Ads", icon: "megaphone" },
  { href: "/crm/cms/hotel-seo", label: "Hotel SEO", icon: "search" },
  { href: "/crm/cms/hotel-website", label: "Hotel Website", icon: "pages" },
  { href: "/crm/cms/hotel-direct-bookings", label: "Direct Bookings", icon: "link" },
  { href: "/crm/cms/independent-hotel", label: "Independent Hotel", icon: "building" },
  { href: "/crm/cms/hotel-systems", label: "Hotel Systems", icon: "settings" },
  { href: "/crm/cms/hotel-ai", label: "Hotel AI", icon: "spark" },
  { href: "/crm/cms/hotel-training", label: "Hotel Training", icon: "folder" },
];

export const CMS_EXTRA_LINKS: CmsNavLink[] = [
  { href: "/crm/cms/faqs", label: "FAQ", icon: "list" },
  { href: "/crm/cms/redirects", label: "Redirect", icon: "link" },
  { href: "/crm/cms/trash", label: "ถังขยะ", icon: "trash" },
];

/** Flat subnav model used by CrmSubNav (supports one level of children). */
export function cmsSubNavItems(): CmsNavLink[] {
  return [
    ...CMS_CONTENT_LINKS,
    ...CMS_SYSTEM_LINKS,
    {
      href: "/crm/cms/about-us",
      label: "หน้าโซลูชัน",
      icon: "grid",
      children: CMS_SOLUTION_LINKS,
    },
    {
      href: "/crm/cms/faqs",
      label: "เครื่องมือเพิ่มเติม",
      icon: "settings",
      children: CMS_EXTRA_LINKS,
    },
  ];
}

/** Compact rail labels under the single Content Management section. */
export function cmsRailLinks(): CmsNavLink[] {
  return [...CMS_CONTENT_LINKS, ...CMS_SYSTEM_LINKS];
}

export function isCmsPath(pathname: string) {
  return pathname === "/crm/cms" || pathname.startsWith("/crm/cms/");
}
