/** CMS admin navigation — real routes only. */

export type CmsNavLink = {
  href: string;
  label: string;
  children?: CmsNavLink[];
};

/** Primary Content Management links shown in the CMS subnav / rail. */
export const CMS_CONTENT_LINKS: CmsNavLink[] = [
  { href: "/crm/cms", label: "ภาพรวม" },
  { href: "/crm/cms/pages", label: "หน้าเว็บ" },
  { href: "/crm/cms/insights", label: "บทความ" },
  { href: "/crm/cms/solutions", label: "บริการ" },
  { href: "/crm/cms/menus", label: "เมนูเว็บ" },
  { href: "/crm/cms/media", label: "คลังไฟล์" },
  { href: "/crm/cms/seo", label: "SEO" },
];

/** Site settings that belong with CMS content (users stay under ตั้งค่าระบบ). */
export const CMS_SYSTEM_LINKS: CmsNavLink[] = [
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บ" },
];

export const CMS_ACCOUNT_LINKS: CmsNavLink[] = [
  { href: "/crm/users", label: "ผู้ใช้งานและสิทธิ์" },
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บไซต์" },
];

/** Solution / specialty page editors kept reachable without cluttering the primary IA. */
export const CMS_SOLUTION_LINKS: CmsNavLink[] = [
  { href: "/crm/cms/about-us", label: "เกี่ยวกับเรา" },
  { href: "/crm/cms/contact-us", label: "ติดต่อเรา" },
  { href: "/crm/cms/case-studies", label: "ผลงานลูกค้า" },
  { href: "/crm/cms/case-studies-page", label: "หน้าผลงาน" },
  { href: "/crm/cms/client-logos", label: "โลโก้ลูกค้า" },
  { href: "/crm/cms/hotel-marketing", label: "Hotel Marketing" },
  { href: "/crm/cms/reservations", label: "Reservations" },
  { href: "/crm/cms/b2b", label: "B2B Agent Sales" },
  { href: "/crm/cms/google-ads", label: "Google Ads" },
  { href: "/crm/cms/meta-ads", label: "Meta Ads" },
  { href: "/crm/cms/hotel-seo", label: "Hotel SEO" },
  { href: "/crm/cms/hotel-website", label: "Hotel Website" },
  { href: "/crm/cms/hotel-direct-bookings", label: "Direct Bookings" },
  { href: "/crm/cms/independent-hotel", label: "Independent Hotel" },
  { href: "/crm/cms/hotel-systems", label: "Hotel Systems" },
  { href: "/crm/cms/hotel-ai", label: "Hotel AI" },
  { href: "/crm/cms/hotel-training", label: "Hotel Training" },
];

export const CMS_EXTRA_LINKS: CmsNavLink[] = [
  { href: "/crm/cms/faqs", label: "FAQ" },
  { href: "/crm/cms/redirects", label: "Redirect" },
  { href: "/crm/cms/trash", label: "ถังขยะ" },
];

/** Flat subnav model used by CrmSubNav (supports one level of children). */
export function cmsSubNavItems(): CmsNavLink[] {
  return [
    ...CMS_CONTENT_LINKS,
    ...CMS_SYSTEM_LINKS,
    {
      href: "/crm/cms/about-us",
      label: "หน้าโซลูชัน",
      children: CMS_SOLUTION_LINKS,
    },
    {
      href: "/crm/cms/trash",
      label: "เครื่องมือเพิ่มเติม",
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
