"use client";

import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logoutAction } from "@/lib/crm/actions";
import { ADMIN_MODULES, MODULE_PATH, type AdminModule } from "@/lib/crm/modules";
import { CrmThemeToggle } from "@/components/crm/CrmThemeToggle";
import { CrmSubNav, type CrmSubNavItem } from "@/components/crm/CrmSubNav";
import { NewLeadModalProvider } from "@/components/crm/ui/NewLeadModal";
import { NewPartnerModalProvider } from "@/components/crm/ui/NewPartnerModal";
import { ProfileMenu } from "@/components/crm/ui/ProfileMenu";

type Workspace = "home" | AdminModule;
type NavKey = "home" | AdminModule | "settings";
type ContextLink = CrmSubNavItem;

const leadLinks: ContextLink[] = [
  { href: "/crm/sales", label: "วันนี้" },
  { href: "/crm/pipeline", label: "Pipeline" },
  { href: "/crm/leads", label: "ลีดทั้งหมด" },
  { href: "/crm/leads?origin=web", label: "จากเว็บ" },
  { href: "/crm/leads?origin=manual", label: "คีย์เอง" },
  { href: "/crm/activities", label: "กิจกรรม" },
];

const partnerLinks: ContextLink[] = [
  { href: "/crm/partners", label: "คิวงาน" },
  { href: "/crm/partners/list", label: "อนุมัติพาร์ตเนอร์" },
  { href: "/crm/partners/referrals", label: "แนะนำลูกค้า" },
  { href: "/crm/partners/commissions", label: "ค่าคอมมิชชัน" },
  { href: "/crm/partners/payouts", label: "การจ่ายเงิน" },
  { href: "/crm/partners/settings", label: "กติกา" },
];

const reservationLinks: ContextLink[] = [
  { href: "/crm/reservations", label: "คิวงาน" },
  { href: "/crm/reservations?status=new", label: "ใหม่" },
  { href: "/crm/reservations?status=in_progress", label: "กำลังดำเนินการ" },
  { href: "/crm/reservations?status=escalated", label: "เร่งด่วน" },
];

const userLinks: ContextLink[] = [
  { href: "/crm/users", label: "รายชื่อผู้ใช้" },
  { href: "/crm/users/logs", label: "บันทึกการเข้าใช้" },
  { href: "/crm/users/roles", label: "บทบาทและสิทธิ์" },
];

const b2bLinks: ContextLink[] = [
  { href: "/crm/b2b", label: "Partner Pipeline" },
  { href: "/crm/b2b/directory", label: "Partner Directory" },
  { href: "/crm/b2b/rates", label: "Rate & Commission" },
  { href: "/crm/b2b/materials", label: "Sales Materials" },
  { href: "/crm/b2b/activities", label: "Activities / Follow-up" },
  { href: "/crm/b2b/bookings", label: "Booking Outcomes" },
  { href: "/crm/b2b/reports", label: "Reports / KPI" },
  { href: "/crm/b2b/settings", label: "Settings" },
];

const adsLinks: ContextLink[] = [
  { href: "/crm/ads", label: "Campaigns" },
  { href: "/crm/ads/search", label: "Search Ads" },
  { href: "/crm/ads/hotel", label: "Hotel Ads" },
  { href: "/crm/ads/free-links", label: "Free Booking Links" },
  { href: "/crm/ads/landing-pages", label: "Landing Pages" },
  { href: "/crm/ads/tracking", label: "Tracking & Conversions" },
  { href: "/crm/ads/optimization", label: "Optimization Log" },
  { href: "/crm/ads/reports", label: "Reports / KPI" },
  { href: "/crm/ads/approvals", label: "Approvals" },
  { href: "/crm/ads/settings", label: "Settings" },
];

const metaLinks: ContextLink[] = [
  { href: "/crm/meta", label: "Campaigns" },
  { href: "/crm/meta/audiences", label: "Audiences" },
  { href: "/crm/meta/creative-matrix", label: "Creative Matrix" },
  { href: "/crm/meta/ads", label: "Meta Ads" },
  { href: "/crm/meta/landing-pages", label: "Landing Pages" },
  { href: "/crm/meta/tracking", label: "Tracking & Conversions" },
  { href: "/crm/meta/remarketing", label: "Remarketing" },
  { href: "/crm/meta/optimization", label: "Optimization Log" },
  { href: "/crm/meta/reports", label: "Reports / KPI" },
  { href: "/crm/meta/approvals", label: "Approvals" },
  { href: "/crm/meta/settings", label: "Settings" },
];

const conversionLinks: ContextLink[] = [
  { href: "/crm/conversion", label: "Direct Booking Projects" },
  { href: "/crm/conversion/review", label: "Website Review" },
  { href: "/crm/conversion/room", label: "Room and Offer Information" },
  { href: "/crm/conversion/friction", label: "Conversion Friction" },
  { href: "/crm/conversion/booking", label: "Booking Engine" },
  { href: "/crm/conversion/mobile", label: "Mobile UX" },
  { href: "/crm/conversion/tracking", label: "Tracking and Analytics" },
  { href: "/crm/conversion/experiments", label: "Experiments / Changes" },
  { href: "/crm/conversion/reports", label: "Reports / KPI" },
  { href: "/crm/conversion/approvals", label: "Approvals" },
  { href: "/crm/conversion/handover", label: "Handover and Ownership" },
  { href: "/crm/conversion/settings", label: "Settings" },
];

const systemsLinks: ContextLink[] = [
  { href: "/crm/systems", label: "Overview" },
  { href: "/crm/systems/properties", label: "Properties" },
  { href: "/crm/systems/inventory", label: "System Inventory" },
  { href: "/crm/systems/architecture", label: "Architecture and Data Flow" },
  { href: "/crm/systems/mapping", label: "Data Mapping" },
  { href: "/crm/systems/readiness", label: "Integration Readiness" },
  { href: "/crm/systems/configuration", label: "Configuration" },
  { href: "/crm/systems/testing", label: "Testing and QA" },
  { href: "/crm/systems/issues", label: "Error and Issue Log" },
  { href: "/crm/systems/distribution", label: "Booking Engine / Distribution" },
  { href: "/crm/systems/analytics", label: "Analytics and Reporting" },
  { href: "/crm/systems/handover", label: "Handover and Ownership" },
  { href: "/crm/systems/approvals", label: "Approvals" },
  { href: "/crm/systems/kpi", label: "Reports / KPI" },
  { href: "/crm/systems/settings", label: "Settings" },
];

const hotelAiLinks: ContextLink[] = [
  { href: "/crm/hotel-ai", label: "Overview" },
  { href: "/crm/hotel-ai/inventory", label: "Workflow Inventory" },
  { href: "/crm/hotel-ai/backlog", label: "Automation Backlog" },
  { href: "/crm/hotel-ai/pilots", label: "Pilot Projects" },
  { href: "/crm/hotel-ai/use-cases", label: "Use Cases" },
  { href: "/crm/hotel-ai/data-access", label: "Data & Access" },
  { href: "/crm/hotel-ai/approvals", label: "Approvals" },
  { href: "/crm/hotel-ai/tests", label: "Test Cases" },
  { href: "/crm/hotel-ai/issues", label: "Issue Log" },
  { href: "/crm/hotel-ai/metrics", label: "Pilot Metrics" },
  { href: "/crm/hotel-ai/handover", label: "Handover / SOP" },
  {
    href: "/crm/hotel-ai/departments",
    label: "Departments",
    children: [
      { href: "/crm/hotel-ai/departments/reservations", label: "Reservations" },
      { href: "/crm/hotel-ai/departments/revenue", label: "Revenue" },
      { href: "/crm/hotel-ai/departments/distribution", label: "Distribution" },
      { href: "/crm/hotel-ai/departments/marketing", label: "Marketing" },
      { href: "/crm/hotel-ai/departments/operations", label: "Operations" },
      { href: "/crm/hotel-ai/departments/sales", label: "Sales" },
      { href: "/crm/hotel-ai/departments/management", label: "Management" },
      { href: "/crm/hotel-ai/departments/it-data", label: "IT / Data" },
    ],
  },
  { href: "/crm/hotel-ai/audit", label: "Audit History" },
  { href: "/crm/hotel-ai/settings", label: "Settings" },
];

const trainingLinks: ContextLink[] = [
  { href: "/crm/training", label: "Overview" },
  { href: "/crm/training/requests", label: "Requests" },
  { href: "/crm/training/calendar", label: "Calendar" },
  { href: "/crm/training/programs", label: "Programs" },
  { href: "/crm/training/groups", label: "Learner Groups" },
  { href: "/crm/training/needs", label: "Needs Assessment" },
  { href: "/crm/training/materials", label: "Materials" },
  { href: "/crm/training/sessions", label: "Sessions" },
  { href: "/crm/training/assessment", label: "Assessment" },
  { href: "/crm/training/follow-up", label: "Follow-up" },
  { href: "/crm/training/trainers", label: "Trainers" },
  {
    href: "/crm/training/departments",
    label: "Departments",
    children: [
      { href: "/crm/training/departments/reservations", label: "Reservations" },
      { href: "/crm/training/departments/revenue", label: "Revenue" },
      { href: "/crm/training/departments/distribution", label: "Distribution" },
      { href: "/crm/training/departments/marketing", label: "Marketing" },
      { href: "/crm/training/departments/operations", label: "Operations" },
      { href: "/crm/training/departments/sales", label: "Sales" },
      { href: "/crm/training/departments/management", label: "Management" },
      { href: "/crm/training/departments/hr-ld", label: "HR / L&D" },
      { href: "/crm/training/departments/it-data", label: "IT / Data" },
    ],
  },
  { href: "/crm/training/feedback", label: "Feedback" },
  { href: "/crm/training/reports", label: "Reports / KPI" },
  { href: "/crm/training/approvals", label: "Approvals" },
  { href: "/crm/training/audit", label: "Audit History" },
  { href: "/crm/training/settings", label: "Settings" },
];

const hotelMarketingLinks: ContextLink[] = [
  { href: "/crm/hotel-marketing", label: "Overview" },
  { href: "/crm/hotel-marketing/editorial-calendar", label: "Editorial Calendar" },
  { href: "/crm/hotel-marketing/backlog", label: "Article Backlog" },
  { href: "/crm/hotel-marketing/drafts", label: "Drafts" },
  { href: "/crm/hotel-marketing/seo-briefs", label: "SEO Briefs" },
  { href: "/crm/hotel-marketing/campaigns", label: "Campaigns" },
  { href: "/crm/hotel-marketing/channels", label: "Channels" },
  { href: "/crm/hotel-marketing/metrics", label: "Metrics" },
  { href: "/crm/hotel-marketing/assets", label: "Assets" },
  { href: "/crm/hotel-marketing/approvals", label: "Approvals" },
  { href: "/crm/hotel-marketing/related-links", label: "Related Links" },
  { href: "/crm/hotel-marketing/translation", label: "Translation" },
  { href: "/crm/hotel-marketing/reports", label: "Reports" },
  {
    href: "/crm/hotel-marketing/departments",
    label: "Departments",
    children: [
      { href: "/crm/hotel-marketing/departments/marketing-content", label: "Marketing / Content" },
      { href: "/crm/hotel-marketing/departments/revenue", label: "Revenue" },
      { href: "/crm/hotel-marketing/departments/distribution", label: "Distribution" },
      { href: "/crm/hotel-marketing/departments/sales", label: "Sales" },
      { href: "/crm/hotel-marketing/departments/reservations", label: "Reservations" },
      { href: "/crm/hotel-marketing/departments/operations", label: "Operations" },
      { href: "/crm/hotel-marketing/departments/management", label: "Management" },
      { href: "/crm/hotel-marketing/departments/it-data", label: "IT / Data" },
    ],
  },
  { href: "/crm/hotel-marketing/audit", label: "Audit History" },
  { href: "/crm/hotel-marketing/settings", label: "Settings" },
];

const solutionsLinks: ContextLink[] = [
  { href: "/crm/solutions", label: "Overview" },
  { href: "/crm/solutions/catalog", label: "Service Catalog" },
  { href: "/crm/solutions/categories", label: "Service Categories" },
  { href: "/crm/solutions/relationships", label: "Service Relationships" },
  { href: "/crm/solutions/preview", label: "Public Page Preview" },
  { href: "/crm/solutions/inquiries", label: "Inquiry Queue" },
  { href: "/crm/solutions/proof", label: "Case Studies / Proof" },
  { href: "/crm/solutions/assets", label: "Asset and Permission Review" },
  { href: "/crm/solutions/translations", label: "Translation Review" },
  { href: "/crm/solutions/seo", label: "SEO / Page Metadata" },
  { href: "/crm/solutions/approvals", label: "Approvals" },
  { href: "/crm/solutions/audit", label: "Activity / Audit Log" },
  { href: "/crm/solutions/settings", label: "Settings" },
  {
    href: "/crm/solutions/departments",
    label: "Departments",
    children: [
      { href: "/crm/solutions/departments/revenue", label: "Revenue" },
      { href: "/crm/solutions/departments/marketing", label: "Marketing" },
      { href: "/crm/solutions/departments/distribution", label: "Distribution" },
      { href: "/crm/solutions/departments/reservations", label: "Reservations" },
      { href: "/crm/solutions/departments/sales", label: "Sales" },
      { href: "/crm/solutions/departments/operations", label: "Operations" },
      { href: "/crm/solutions/departments/systems-it-data", label: "Systems / IT" },
      { href: "/crm/solutions/departments/training-hr-ld", label: "Training / HR" },
      { href: "/crm/solutions/departments/management", label: "Management" },
    ],
  },
];

const managementLinks: ContextLink[] = [
  { href: "/crm/management", label: "Overview" },
  { href: "/crm/management/properties", label: "Properties" },
  { href: "/crm/management/assessment", label: "Hotel Assessments" },
  { href: "/crm/management/plan", label: "Operating Plans" },
  { href: "/crm/management/commercial", label: "Commercial / Revenue" },
  { href: "/crm/management/marketing", label: "Marketing" },
  { href: "/crm/management/distribution", label: "Distribution" },
  { href: "/crm/management/operations", label: "Operations" },
  { href: "/crm/management/guest", label: "Guest Experience" },
  { href: "/crm/management/people", label: "People and Roles" },
  { href: "/crm/management/meetings", label: "Meetings / Cadence" },
  { href: "/crm/management/kpi", label: "KPI and Reports" },
  { href: "/crm/management/actions", label: "Action Log" },
  { href: "/crm/management/approvals", label: "Approvals" },
  { href: "/crm/management/handover", label: "Handover and Ownership" },
  { href: "/crm/management/settings", label: "Settings" },
];

const websiteLinks: ContextLink[] = [
  { href: "/crm/website", label: "Website Projects" },
  { href: "/crm/website/discovery", label: "Discovery and Content" },
  { href: "/crm/website/ux", label: "UX / Mobile" },
  { href: "/crm/website/cms", label: "CMS and Technology" },
  { href: "/crm/website/booking", label: "Booking Engine" },
  { href: "/crm/website/tracking", label: "Tracking and Analytics" },
  { href: "/crm/website/seo", label: "SEO and Search" },
  { href: "/crm/website/qa", label: "QA and Handover" },
  { href: "/crm/website/reports", label: "Reports / KPI" },
  { href: "/crm/website/approvals", label: "Approvals" },
  { href: "/crm/website/settings", label: "Settings" },
];

const seoLinks: ContextLink[] = [
  { href: "/crm/seo", label: "Search Visibility" },
  { href: "/crm/seo/website", label: "Website / SEO" },
  { href: "/crm/seo/gbp", label: "Google Business Profile" },
  { href: "/crm/seo/maps", label: "Maps / Local Listings" },
  { href: "/crm/seo/aeo", label: "AI Search / AEO" },
  { href: "/crm/seo/reviews", label: "Reviews and Questions" },
  { href: "/crm/seo/contact", label: "Contact / Booking Paths" },
  { href: "/crm/seo/audit", label: "Audit Actions" },
  { href: "/crm/seo/reports", label: "Reports / KPI" },
  { href: "/crm/seo/sources", label: "Sources and Approvals" },
  { href: "/crm/seo/settings", label: "Settings" },
];

const cmsLinks: ContextLink[] = [
  { href: "/crm/cms", label: "ทุกหน้า" },
  { href: "/crm/cms/insights", label: "บทความ" },
  { href: "/crm/cms/hotel-marketing", label: "Hotel Marketing" },
  { href: "/crm/cms/case-studies", label: "ผลงานลูกค้า" },
  { href: "/crm/cms/client-logos", label: "โลโก้ลูกค้า" },
  { href: "/crm/cms/about-us", label: "หน้าเกี่ยวกับเรา" },
  { href: "/crm/cms/trash", label: "ถังขยะ" },
  { href: "/crm/cms/media", label: "สื่อและรูปภาพ" },
  { href: "/crm/cms/redirects", label: "Redirect" },
  { href: "/crm/cms/globals", label: "ตั้งค่าเว็บ" },
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
  { href: "/crm/cms/solutions", label: "Hotel Solutions" },
];

/** Shorter module titles for the context subnav (sidebar keeps full NAV_LABEL). */
const SUBNAV_MODULE_LABEL: Record<Exclude<Workspace, "home">, string> = {
  leads: "Lead Management",
  partners: "Partner Management",
  reservations: "Reservations",
  b2b: "B2B Sales",
  ads: "Google Ads",
  meta: "Meta Ads",
  seo: "Local Search",
  website: "Website",
  conversion: "Direct Booking",
  management: "Hotel Management",
  systems: "Hotel Systems",
  hotel_ai: "Hotel AI",
  training: "Hotel Training",
  hotel_marketing: "Hotel Marketing",
  solutions: "Hotel Solutions",
  users: "Users",
  cms: "CMS",
};

const contextByWorkspace: Record<Exclude<Workspace, "home">, ContextLink[]> = {
  leads: leadLinks,
  partners: partnerLinks,
  reservations: reservationLinks,
  b2b: b2bLinks,
  ads: adsLinks,
  meta: metaLinks,
  seo: seoLinks,
  website: websiteLinks,
  conversion: conversionLinks,
  management: managementLinks,
  systems: systemsLinks,
  hotel_ai: hotelAiLinks,
  training: trainingLinks,
  hotel_marketing: hotelMarketingLinks,
  solutions: solutionsLinks,
  users: userLinks,
  cms: cmsLinks,
};

const NAV_LABEL: Record<NavKey, string> = {
  home: "หน้าหลัก",
  leads: "Lead Management",
  partners: "Partner Management",
  reservations: "Reservation Operations",
  b2b: "B2B Sales Operations",
  ads: "Google Ads Operations",
  meta: "Meta Ads Operations",
  seo: "Local Search Operations",
  website: "Website Operations",
  conversion: "Direct Booking Operations",
  management: "Hotel Management Operations",
  systems: "Hotel Systems Operations",
  hotel_ai: "Hotel AI & Automation Workflow",
  training: "Hotel Training Operations",
  hotel_marketing: "Hotel Marketing Editorial Operations",
  solutions: "Hotel Solutions Service Directory",
  users: "Users Management",
  cms: "Content Management",
  settings: "ตั้งค่า",
};

/** Sidebar groups — only existing routes/modules; no invented menu items. */
type NavSectionId = "sales" | "hotel" | "marketing" | "content" | "system";

const NAV_SECTIONS: { id: NavSectionId; label: string; items: NavKey[] }[] = [
  { id: "sales", label: "การขายและลูกค้า", items: ["leads", "partners", "b2b"] },
  {
    id: "hotel",
    label: "การจองและโรงแรม",
    items: ["reservations", "conversion", "management", "training", "systems", "hotel_ai"],
  },
  {
    id: "marketing",
    label: "การตลาดและช่องทางออนไลน์",
    items: ["ads", "meta", "seo", "website", "hotel_marketing"],
  },
  { id: "content", label: "ข้อมูลและเนื้อหา", items: ["solutions", "cms"] },
  { id: "system", label: "จัดการระบบ", items: ["users", "settings"] },
];

const SECTION_STORAGE_KEY = "crm-rail-sections";

function sectionIdForNavKey(key: NavKey): NavSectionId | null {
  for (const section of NAV_SECTIONS) {
    if (section.items.includes(key)) return section.id;
  }
  return null;
}

function navHref(key: NavKey) {
  if (key === "home") return "/crm";
  if (key === "settings") return "/crm/settings";
  return MODULE_PATH[key];
}

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconLeads() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 18c.5-2.4 2.5-3.8 4.5-3.8s4 1.4 4.5 3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.5 17.5c.4-1.6 1.7-2.6 3.2-2.6 1.1 0 2 .5 2.6 1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconPartners() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 13.5c-1.8-.2-3.5.7-4.2 2.2M16 13.5c1.8-.2 3.5.7 4.2 2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.2 14.2c1 .9 2.1 1.3 2.8 1.3s1.8-.4 2.8-1.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.5 18.5c.7-2.8 2.8-4.2 5.5-4.2s4.8 1.4 5.5 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconReservations() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v12A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V7A1.5 1.5 0 0 1 6 5.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v4M16 3.5v4M8 12h8M8 15.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconB2b() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8.5h14v11H5V8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 8.5V6.8A4 4 0 0 1 12 4a4 4 0 0 1 4 2.8v1.7M9 13h6M9 16.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconSeo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3 6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10.8" r="2.1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconCms() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4.5h7l3 3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 4.5V8h3.5M9 12h6M9 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 4.5v1.4M12 18.1v1.4M4.5 12h1.4M18.1 12h1.4M6.4 6.4l1 1M16.6 16.6l1 1M17.6 6.4l-1 1M7.4 16.6l-1 1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg className="crm-rail-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13V11a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 13v3.5A1.5 1.5 0 0 0 6.5 18H8v-5H5Zm14 0v3.5A1.5 1.5 0 0 1 17.5 18H16v-5h3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 6H6.5A1.5 1.5 0 0 0 5 7.5v10A1.5 1.5 0 0 0 6.5 19h10a1.5 1.5 0 0 0 1.5-1.5V14M14 5h5v5M12 12 19 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAds() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 18.5 10.2 5.5h3.6L19 18.5M8.2 14.2h7.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMeta() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 14.5c1.8-4.2 3.6-6.5 5.5-6.5 1.5 0 2.4 1.2 3.5 3.2 1.1 2 2.1 3.3 3.5 3.3 1.9 0 3.7-2.3 5.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconSystems() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="6.2" height="6.2" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.3" y="4.5" width="6.2" height="6.2" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4.5" y="13.3" width="6.2" height="6.2" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.3" y="13.3" width="6.2" height="6.2" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconHotel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 19.5V8.2L12 4.5l7.5 3.7v11.3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 19.5v-5h6v5M9.5 10.5h.1M12 10.5h.1M14.5 10.5h.1M9.5 13h.1M12 13h.1M14.5 13h.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconWebsite() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 12h15M12 4.5c2.2 2.3 3.3 4.8 3.3 7.5S14.2 17.2 12 19.5C9.8 17.2 8.7 14.7 8.7 12S9.8 6.8 12 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconAi() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M7 7l1.5 1.5M15.5 15.5 17 17M17 7l-1.5 1.5M8.5 15.5 7 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

const NAV_ICON: Record<NavKey, () => ReactNode> = {
  home: IconHome,
  leads: IconLeads,
  partners: IconPartners,
  reservations: IconReservations,
  b2b: IconB2b,
  ads: IconAds,
  meta: IconMeta,
  seo: IconSeo,
  website: IconWebsite,
  conversion: IconHotel,
  management: IconHotel,
  systems: IconSystems,
  hotel_ai: IconAi,
  training: IconLeads,
  hotel_marketing: IconCms,
  solutions: IconCms,
  users: IconUsers,
  cms: IconCms,
  settings: IconSettings,
};

function workspaceOf(pathname: string): Workspace {
  if (pathname.startsWith("/crm/cms")) return "cms";
  if (pathname.startsWith("/crm/users")) return "users";
  if (pathname.startsWith("/crm/partners")) return "partners";
  if (pathname.startsWith("/crm/reservations")) return "reservations";
  if (pathname.startsWith("/crm/b2b")) return "b2b";
  if (pathname.startsWith("/crm/ads")) return "ads";
  if (pathname.startsWith("/crm/meta")) return "meta";
  if (pathname.startsWith("/crm/seo")) return "seo";
  if (pathname.startsWith("/crm/website")) return "website";
  if (pathname.startsWith("/crm/conversion")) return "conversion";
  if (pathname.startsWith("/crm/management")) return "management";
  if (pathname.startsWith("/crm/systems")) return "systems";
  if (pathname.startsWith("/crm/hotel-ai")) return "hotel_ai";
  if (pathname.startsWith("/crm/training")) return "training";
  if (pathname.startsWith("/crm/hotel-marketing")) return "hotel_marketing";
  if (pathname.startsWith("/crm/solutions")) return "solutions";
  if (
    pathname.startsWith("/crm/sales") ||
    pathname.startsWith("/crm/pipeline") ||
    pathname.startsWith("/crm/leads") ||
    pathname.startsWith("/crm/activities")
  ) {
    return "leads";
  }
  return "home";
}

function RailLink({
  href,
  navKey,
  current,
  nested = false,
  onNavigate,
}: {
  href: string;
  navKey: NavKey;
  current: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = NAV_ICON[navKey];
  const label = NAV_LABEL[navKey];
  return (
    <Link
      href={href}
      className={`crm-rail-link${nested ? " is-nested" : ""}${current ? " is-active" : ""}`}
      aria-current={current ? "page" : undefined}
      aria-label={label}
      title={label}
      onClick={onNavigate}
    >
      <span className="crm-rail-ico" aria-hidden="true">
        <Icon />
      </span>
      <em>{label}</em>
    </Link>
  );
}

function isNavKeyCurrent(key: NavKey, workspace: Workspace, pathname: string) {
  if (key === "home") return workspace === "home";
  if (key === "settings") return pathname.startsWith("/crm/settings");
  return workspace === key;
}

export function CrmShell({
  userName,
  userRole = "Administrator",
  userAvatarUrl,
  userTeam,
  modules,
  showLogout = false,
  leadForm,
  partnerModal = false,
  children,
}: {
  userName: string;
  userRole?: string;
  userAvatarUrl?: string | null;
  /** Optional team / org label from profile. Empty → show muted placeholder. */
  userTeam?: string | null;
  modules: AdminModule[];
  showLogout?: boolean;
  leadForm?: {
    partners: { id: string; displayName: string; tier: string }[];
    owners: { id: string; name: string }[];
    currentUserId?: string;
  };
  partnerModal?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/crm";
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const workspace = workspaceOf(pathname);
  const contextLinks = workspace === "home" ? [] : contextByWorkspace[workspace];
  const allowed = ADMIN_MODULES.filter((module) => modules.includes(module));
  const allowedSet = new Set<NavKey>(["home", "settings", ...allowed]);
  const currentSectionId: NavSectionId | null = pathname.startsWith("/crm/settings")
    ? "system"
    : workspace === "home"
      ? null
      : sectionIdForNavKey(workspace);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState<Partial<Record<NavSectionId, boolean>>>({});
  const [sectionsReady, setSectionsReady] = useState(false);
  const [railExpanded, setRailExpanded] = useState(true);
  const [railReady, setRailReady] = useState(false);
  const drawerId = useId();
  const teamLabel = userTeam?.trim() || "ยังไม่ระบุทีม";
  const initials = userInitials(userName);
  const avatar = userAvatarUrl?.trim() || "";
  const newLeadOpen = searchParams.get("newLead") === "1";
  const newLeadDuplicate = searchParams.get("duplicate") || undefined;
  const newLeadError = searchParams.get("error") || undefined;
  const newPartnerOpen = searchParams.get("newPartner") === "1";
  const newPartnerError = searchParams.get("error") || undefined;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("crm-rail-expanded");
      if (stored === "0") setRailExpanded(false);
      if (stored === "1") setRailExpanded(true);
    } catch {
      // ignore
    }
    setRailReady(true);
  }, []);

  useEffect(() => {
    if (!railReady) return;
    try {
      window.localStorage.setItem("crm-rail-expanded", railExpanded ? "1" : "0");
    } catch {
      // ignore
    }
  }, [railExpanded, railReady]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SECTION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Record<NavSectionId, boolean>>;
        if (parsed && typeof parsed === "object") setSectionOpen(parsed);
      }
    } catch {
      // ignore
    }
    setSectionsReady(true);
  }, []);

  useEffect(() => {
    if (!sectionsReady) return;
    try {
      window.localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(sectionOpen));
    } catch {
      // ignore
    }
  }, [sectionOpen, sectionsReady]);

  useEffect(() => {
    if (!currentSectionId) return;
    setSectionOpen((prev) => {
      if (prev[currentSectionId] === true) return prev;
      return { ...prev, [currentSectionId]: true };
    });
  }, [currentSectionId]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function sectionIsOpen(id: NavSectionId, containsCurrent: boolean) {
    if (Object.prototype.hasOwnProperty.call(sectionOpen, id)) return Boolean(sectionOpen[id]);
    return containsCurrent;
  }

  function toggleSection(id: NavSectionId, containsCurrent: boolean) {
    const next = !sectionIsOpen(id, containsCurrent);
    setSectionOpen((prev) => ({ ...prev, [id]: next }));
  }

  const navBody = (onNavigate?: () => void, opts?: { forceExpanded?: boolean }) => {
    const expandedChrome = Boolean(opts?.forceExpanded || railExpanded);
    return (
      <>
        <div className="crm-rail-group crm-rail-group-home">
          {expandedChrome ? <p className="crm-rail-section">หน้าหลัก</p> : null}
          <RailLink href="/crm" navKey="home" current={workspace === "home"} onNavigate={onNavigate} />
        </div>

        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => allowedSet.has(item));
          if (!visibleItems.length) return null;
          const containsCurrent = visibleItems.some((item) => isNavKeyCurrent(item, workspace, pathname));
          const open = sectionIsOpen(section.id, containsCurrent);
          const panelId = `${drawerId}-section-${section.id}`;

          return (
            <div
              key={section.id}
              className={`crm-rail-group${containsCurrent ? " is-current" : ""}${open ? " is-open" : ""}`}
            >
              <button
                type="button"
                className={`crm-rail-section-toggle${containsCurrent ? " is-current" : ""}`}
                aria-expanded={open}
                aria-controls={panelId}
                title={section.label}
                onClick={() => toggleSection(section.id, containsCurrent)}
              >
                <span className="crm-rail-section-label">{section.label}</span>
                <span className={`crm-rail-section-chevron${open ? " is-open" : ""}`} aria-hidden="true">
                  <IconChevron />
                </span>
              </button>
              <div
                id={panelId}
                className={`crm-rail-section-panel${open ? " is-open" : ""}`}
                hidden={!open && expandedChrome}
                role="group"
                aria-label={section.label}
              >
                {visibleItems.map((item) => (
                  <RailLink
                    key={item}
                    href={navHref(item)}
                    navKey={item}
                    current={isNavKeyCurrent(item, workspace, pathname)}
                    nested
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const railCards = (
    <div className="crm-rail-cards">
      <div
        className="crm-rail-user"
        title={`${userName} · ${userRole}${teamLabel ? ` · ${teamLabel}` : ""}`}
      >
        <span className={`crm-rail-user-avatar${avatar ? " has-photo" : ""}`} aria-hidden="true">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-uploaded /media path
            <img src={avatar} alt="" />
          ) : (
            initials
          )}
        </span>
        <span className="crm-rail-user-copy">
          <strong>{userName}</strong>
          <em>{userRole}</em>
          <span className={`crm-rail-user-team${userTeam?.trim() ? "" : " is-empty"}`}>{teamLabel}</span>
        </span>
      </div>
      <a className="crm-rail-support" href="mailto:support@thekpiplus.com" title="ติดต่อทีม Support">
        <span className="crm-rail-support-ico" aria-hidden="true">
          <IconHeadset />
        </span>
        <span className="crm-rail-support-copy">
          <strong>ช่วยเหลือ / แจ้งปัญหา</strong>
          <em>ติดต่อทีม Support</em>
        </span>
        <span className="crm-rail-support-ext" aria-hidden="true">
          <IconExternal />
        </span>
      </a>
      <div className="crm-rail-workspace" title="KPI PLUS Admin Workspace">
        <span className="crm-rail-workspace-plus" aria-hidden="true">
          +
        </span>
        <strong>KPI PLUS</strong>
        <em>Admin Workspace</em>
        <span>Version 3.0.0</span>
      </div>
      {showLogout ? (
        <div className="crm-rail-tools">
          <form action={logoutAction}>
            <button type="submit" className="crm-rail-logout-btn" title="ออกจากระบบ" aria-label="ออกจากระบบ">
              ออกจากระบบ
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );

  const shell = (
    <div
      className={`crm-shell crm-shell-app kpi-locale-th${railExpanded ? " is-rail-expanded" : ""}${workspace === "b2b" ? " crm-shell-b2b" : ""}${workspace === "ads" ? " crm-shell-ads" : ""}${workspace === "meta" ? " crm-shell-meta" : ""}${workspace === "seo" ? " crm-shell-seo" : ""}${workspace === "website" ? " crm-shell-website" : ""}${workspace === "conversion" ? " crm-shell-conversion" : ""}${workspace === "management" ? " crm-shell-management" : ""}${workspace === "systems" ? " crm-shell-systems" : ""}${workspace === "hotel_ai" ? " crm-shell-hotel-ai" : ""}${workspace === "training" ? " crm-shell-training" : ""}${workspace === "hotel_marketing" ? " crm-shell-hotel-marketing" : ""}${workspace === "solutions" ? " crm-shell-solutions" : ""}`}
      suppressHydrationWarning
    >
      <aside
        className={`crm-rail crm-rail-desktop${railExpanded ? " is-expanded" : ""}`}
        aria-label="เมนูหลัก"
        suppressHydrationWarning
      >
        <div className="crm-rail-head">
          <a href="/crm" className="crm-rail-brand" title="The KPI Plus">
            <img src="/brand/KPIPlus_Symbol_FullColor.svg" alt="" width={36} height={36} />
            <strong className="crm-rail-brand-text">THE KPI PLUS</strong>
          </a>
          <button
            type="button"
            className="crm-rail-toggle"
            aria-label={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนู"}
            aria-expanded={railExpanded}
            title={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนู"}
            onClick={() => setRailExpanded((value) => !value)}
          >
            <span aria-hidden="true">{railExpanded ? "‹" : "›"}</span>
          </button>
        </div>
        <nav className="crm-rail-nav">{navBody()}</nav>
        <div className="crm-rail-foot">{railCards}</div>
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          className="crm-drawer-backdrop"
          aria-label="ปิดเมนู"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        id={drawerId}
        className={`crm-drawer${drawerOpen ? " is-open" : ""}`}
        aria-label="เมนูมือถือ"
        aria-hidden={!drawerOpen}
      >
        <div className="crm-drawer-head">
          <a href="/crm" className="crm-rail-brand" onClick={() => setDrawerOpen(false)}>
            <img src="/brand/KPIPlus_Symbol_FullColor.svg" alt="The KPI Plus" width={36} height={36} />
            <strong className="crm-rail-brand-text">THE KPI PLUS</strong>
          </a>
          <button type="button" className="crm-drawer-close" aria-label="ปิดเมนู" onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="crm-drawer-nav">{navBody(() => setDrawerOpen(false), { forceExpanded: true })}</nav>
        <div className="crm-drawer-foot">{railCards}</div>
      </aside>

      <div className="crm-app">
        <header className="crm-app-top">
          <button
            type="button"
            className="crm-rail-expand-btn"
            aria-label={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนู"}
            aria-expanded={railExpanded}
            title={railExpanded ? "ย่อแถบเมนู" : "ขยายแถบเมนูเพื่อเห็นชื่อเมนู"}
            onClick={() => setRailExpanded((value) => !value)}
          >
            <span aria-hidden="true">{railExpanded ? "◧" : "☰"}</span>
          </button>
          <button
            type="button"
            className="crm-menu-toggle"
            aria-label="เปิดเมนูนำทาง"
            title="เปิดเมนูนำทาง"
            aria-expanded={drawerOpen}
            aria-controls={drawerId}
            onClick={() => setDrawerOpen(true)}
          >
            <span aria-hidden="true">☰</span>
          </button>
          <label
            className="crm-app-search"
            title="การค้นหาทั้งระบบจะเปิดใช้เมื่อพร้อม"
            tabIndex={0}
            aria-label="ค้นหาทั้งระบบ (ยังไม่เปิดใช้)"
          >
            <span className="sr-only">ค้นหาทั้งระบบ (ยังไม่เปิดใช้)</span>
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="ค้นหาข้อมูล เมนู หรือคำสั่ง..." disabled aria-disabled="true" tabIndex={-1} />
            <kbd aria-hidden="true">⌘ K</kbd>
          </label>
          <div className="crm-app-top-right">
            <CrmThemeToggle className="crm-top-theme" />
            <ProfileMenu
              userName={userName}
              userRole={userRole}
              userAvatarUrl={userAvatarUrl}
              showLogout={showLogout}
            />
          </div>
        </header>

        {workspace !== "home" && contextLinks.length ? (
          <CrmSubNav
            moduleLabel={SUBNAV_MODULE_LABEL[workspace]}
            items={contextLinks}
            pathname={pathname}
            search={search}
            showModuleLabel={workspace !== "users"}
          />
        ) : null}

        <main className="crm-main" id="crm-main">
          {children}
        </main>
      </div>
    </div>
  );

  let content: ReactNode = shell;

  if (partnerModal) {
    content = (
      <NewPartnerModalProvider autoOpen={newPartnerOpen} error={newPartnerError}>
        {content}
      </NewPartnerModalProvider>
    );
  }

  if (leadForm) {
    content = (
      <NewLeadModalProvider
        partners={leadForm.partners}
        owners={leadForm.owners}
        currentUserId={leadForm.currentUserId}
        duplicateId={newLeadDuplicate}
        error={newLeadError}
        autoOpen={newLeadOpen}
      >
        {content}
      </NewLeadModalProvider>
    );
  }

  return content;
}
