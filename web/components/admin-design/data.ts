export type NavItem = {
  id: string;
  label: string;
  icon: string;
  section?: string;
  children?: { id: string; label: string }[];
};

/** Information architecture for KPI Plus Admin */
export const NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "⌂",
    section: "Overview",
  },
  {
    id: "leads",
    label: "Leads",
    icon: "◎",
    section: "Pipeline",
    children: [
      { id: "leads-inbox", label: "Inbox" },
      { id: "leads-today", label: "Today" },
      { id: "leads-pipeline", label: "Pipeline" },
      { id: "leads-forms", label: "Form submissions" },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: "◈",
    section: "Website",
    children: [
      { id: "articles", label: "Articles / Insights" },
      { id: "services", label: "Services" },
      { id: "case-studies", label: "Case Studies" },
      { id: "pages", label: "Website Pages" },
      { id: "faqs", label: "FAQs" },
      { id: "media", label: "Media Library" },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    icon: "⟐",
    section: "Website",
    children: [
      { id: "seo-meta", label: "Metadata" },
      { id: "seo-redirects", label: "Redirects" },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: "◉",
    section: "Workspace",
    children: [
      { id: "authors", label: "Authors" },
      { id: "users", label: "Users / Permissions" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "⚙",
    section: "Workspace",
  },
];

export const TOP_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "pipeline", label: "Pipeline" },
  { id: "website", label: "Website" },
  { id: "workspace", label: "Workspace" },
];

export const STATS = [
  { label: "New leads", value: "28", delta: "+12%", tone: "up" as const },
  { label: "Due today", value: "9", delta: "3 overdue", tone: "warn" as const },
  { label: "Published articles", value: "46", delta: "+2 this week", tone: "neutral" as const },
  { label: "Form conversion", value: "4.8%", delta: "+0.6%", tone: "up" as const },
];

export const QUICK_ACTIONS = [
  { label: "Add lead", hint: "Manual entry" },
  { label: "New article", hint: "Draft insight" },
  { label: "Upload media", hint: "Library" },
  { label: "Review SEO", hint: "Metadata" },
];

export const ACTIVITY = [
  { title: "New lead from Contact form", meta: "Baan Test Resort · 12 min ago", tag: "Lead" },
  { title: "Article published", meta: "Hotel website CRO checklist · 1 hr ago", tag: "Content" },
  { title: "SEO title updated", meta: "Revenue Management · 3 hr ago", tag: "SEO" },
  { title: "Media uploaded", meta: "hero-lobby-02.jpg · Yesterday", tag: "Media" },
];

export const LEADS = [
  { hotel: "Northern Hill Hotel", contact: "สมชาย วัฒนา", source: "Website", status: "New", owner: "Isara", updated: "Today" },
  { hotel: "Coral Bay Villa", contact: "อริยา พงศ์เพ็ชร", source: "LINE", status: "Contacted", owner: "Manee", updated: "Today" },
  { hotel: "Harbor View Inn", contact: "James Carter", source: "Form", status: "Qualified", owner: "Isara", updated: "Yesterday" },
  { hotel: "Lotus Garden Hostel", contact: "นภา ตั้งตรง", source: "Event", status: "Proposal", owner: "Ping", updated: "2 days ago" },
  { hotel: "Baan Test Resort", contact: "กมลวรรณ ศรีสุข", source: "Website", status: "New", owner: "Unassigned", updated: "3 days ago" },
];

export const ARTICLES = [
  { title: "Hotel website CRO checklist", status: "Published", author: "Isara", locale: "TH", updated: "Mar 10" },
  { title: "OTA margin leak points", status: "Draft", author: "Manee", locale: "EN", updated: "Mar 9" },
  { title: "Meta ads for resort launches", status: "Review", author: "Ping", locale: "TH", updated: "Mar 8" },
];

export type ConceptId = "atlas" | "pulse" | "harbor" | "mosaic";

export const CONCEPTS: Array<{
  id: ConceptId;
  name: string;
  subtitle: string;
  bestFor: string;
  pros: string[];
}> = [
  {
    id: "atlas",
    name: "Atlas",
    subtitle: "Left Sidebar Classic",
    bestFor: "ทีมที่มีหลายเมนู / subsection และต้องการโครงแบบมาตรฐาน",
    pros: ["สแกนเมนูเร็ว", "ขยาย subsection ได้ดี", "คุ้นเคยสำหรับทีม ops"],
  },
  {
    id: "pulse",
    name: "Pulse",
    subtitle: "Slim Sidebar + Content Focus",
    bestFor: "ทีมใช้งานทุกวัน ต้องการพื้นที่ตารางและรายละเอียดกว้าง",
    pros: ["Content กว้าง", "ลด noise จากเมนู", "เหมาะกับ list-heavy work"],
  },
  {
    id: "harbor",
    name: "Harbor",
    subtitle: "Top Navigation + Section Sidebar",
    bestFor: "ระบบที่แบ่งหมวดชัด: Pipeline / Website / Workspace",
    pros: ["แยก domain ชัด", "เมนูย่อยตามบริบท", "ลดความยาว sidebar"],
  },
  {
    id: "mosaic",
    name: "Mosaic",
    subtitle: "Modular Workspace",
    bestFor: "ผู้บริหาร / lead ที่ต้อง monitor หลายงานพร้อมกัน",
    pros: ["Dashboard เป็นศูนย์กลาง", "Quick actions เด่น", "รู้สึก flexible / modern"],
  },
];
