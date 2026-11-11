import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    ...props,
  };
}

function IconHome(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

function IconPages(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function IconArticle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2Z" />
      <path d="M18 6v14a2 2 0 0 0 2-2V8" />
      <path d="M8 10h6" />
      <path d="M8 14h5" />
    </svg>
  );
}

function IconGrid(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  );
}

function IconMedia(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="m21 15-4.5-4.5L9 18" />
    </svg>
  );
}

function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function IconSettings(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2.2" />
      <path d="M12 19.8V22" />
      <path d="m4.9 4.9 1.6 1.6" />
      <path d="m17.5 17.5 1.6 1.6" />
      <path d="M2 12h2.2" />
      <path d="M19.8 12H22" />
      <path d="m4.9 19.1 1.6-1.6" />
      <path d="m17.5 6.5 1.6-1.6" />
    </svg>
  );
}

function IconUsers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 19a4.5 4.5 0 0 1 5 0" />
    </svg>
  );
}

function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5" />
    </svg>
  );
}

function IconHistory(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconChart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M3 19h18" />
    </svg>
  );
}

function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 11h18" />
    </svg>
  );
}

function IconInbox(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16v12H4Z" />
      <path d="m4 10 4 4h8l4-4" />
    </svg>
  );
}

function IconBuilding(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M14 10h5a1 1 0 0 1 1 1v10" />
      <path d="M8 8h2" />
      <path d="M8 12h2" />
      <path d="M8 16h2" />
    </svg>
  );
}

function IconLink(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.41a5 5 0 0 0 7.07 7.07L14 18.5" />
    </svg>
  );
}

function IconLayers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 9 5-9 5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </svg>
  );
}

function IconSpark(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="m5.6 5.6 2.8 2.8" />
      <path d="m15.6 15.6 2.8 2.8" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m5.6 18.4 2.8-2.8" />
      <path d="m15.6 8.4 2.8-2.8" />
    </svg>
  );
}

function IconFolder(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

function IconTrash(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

function IconMap(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  );
}

function IconMegaphone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 11 18-5v12L3 13Z" />
      <path d="M11.6 16.8a3.5 3.5 0 1 1-6.2-3.2" />
    </svg>
  );
}

function IconHandshake(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 15 2.5 2.5a2.1 2.1 0 0 0 3 0L21 14" />
      <path d="m3 14 3.5 3.5a2.1 2.1 0 0 0 3 0L12 15" />
      <path d="M8 11 4.5 7.5a2.1 2.1 0 0 1 0-3L6 3" />
      <path d="m16 11 3.5-3.5a2.1 2.1 0 0 0 0-3L18 3" />
    </svg>
  );
}

function IconList(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function IconChevron(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconDot(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

const ICONS = {
  home: IconHome,
  pages: IconPages,
  article: IconArticle,
  grid: IconGrid,
  menu: IconMenu,
  media: IconMedia,
  search: IconSearch,
  settings: IconSettings,
  users: IconUsers,
  check: IconCheck,
  history: IconHistory,
  chart: IconChart,
  calendar: IconCalendar,
  inbox: IconInbox,
  building: IconBuilding,
  link: IconLink,
  layers: IconLayers,
  spark: IconSpark,
  folder: IconFolder,
  trash: IconTrash,
  map: IconMap,
  megaphone: IconMegaphone,
  handshake: IconHandshake,
  list: IconList,
  chevron: IconChevron,
  dot: IconDot,
} as const;

export type CrmSubNavIconName = keyof typeof ICONS;

export function CrmSubNavIcon({ name, className }: { name: CrmSubNavIconName; className?: string }) {
  const Icon = ICONS[name] ?? IconDot;
  return <Icon className={className} />;
}

export function resolveSubNavIcon(href: string, label: string): CrmSubNavIconName {
  const path = href.split("?")[0].toLowerCase();
  const text = `${label} ${path}`.toLowerCase();

  if (path === "/crm/cms" || text.includes("ภาพรวม") || text.includes("overview")) return "home";
  if (path.includes("/about") || text.includes("เกี่ยวกับ")) return "users";
  if (path.includes("/approach") || text.includes("แนวทาง")) return "layers";
  if (path.includes("/contact") || text.includes("ติดต่อ")) return "handshake";
  if (path.includes("/case-studies-page") || text.includes("หน้าผลงาน")) return "pages";
  if (path.includes("/case-stud") || text.includes("ผลงาน")) return "chart";
  if (path.includes("/client-logo") || text.includes("โลโก้")) return "media";
  if (path.includes("/revenue") || text.includes("commercial")) return "chart";
  if (path.includes("/reservation") || text.includes("booking")) return "calendar";
  if (path.includes("/b2b") || text.includes("agent sales")) return "handshake";
  if (path.includes("/google-ads") || path.includes("/crm/ads")) return "megaphone";
  if (path.includes("/meta-ads") || path.includes("/crm/meta")) return "megaphone";
  if (path.includes("/hotel-seo") || path.includes("/gbp") || path.includes("/aeo")) return "search";
  if (path.includes("/hotel-website") || path.includes("/website")) return "pages";
  if (path.includes("/direct-booking") || path.includes("/conversion")) return "link";
  if (path.includes("/independent-hotel") || path.includes("/management")) return "building";
  if (path.includes("/hotel-systems") || path.includes("/systems")) return "settings";
  if (path.includes("/hotel-ai") || path.includes("/automation") || text.includes(" ai")) return "spark";
  if (path.includes("/hotel-training") || path.includes("/training")) return "folder";
  if (path.includes("/hotel-marketing") || text.includes("marketing")) return "megaphone";
  if (path.includes("/pages") || text.includes("หน้าเว็บ")) return "pages";
  if (path.includes("/insight") || text.includes("บทความ") || text.includes("article") || text.includes("editorial") || text.includes("draft")) return "article";
  if (path.includes("/solutions") || text.includes("บริการ") || text.includes("catalog") || text.includes("categories") || text.includes("service") || text.includes("หน้าโซลูชัน")) return "grid";
  if (path.includes("/menus") || text.includes("เมนู")) return "menu";
  if (path.includes("/media") || path.includes("/assets") || text.includes("คลัง") || text.includes("asset") || text.includes("รูป")) return "media";
  if (path.includes("/seo") || text.includes("seo") || text.includes("search") || text.includes("maps")) return "search";
  if (path.includes("/settings") || text.includes("ตั้งค่า") || text.includes("settings") || text.includes("globals") || text.includes("configuration")) return "settings";
  if (path.includes("/users") || path.includes("/roles") || text.includes("ผู้ใช้") || text.includes("people") || text.includes("trainer") || text.includes("group")) return "users";
  if (path.includes("/approvals") || text.includes("อนุมัติ") || text.includes("approval") || text.includes("source")) return "check";
  if (path.includes("/audit") || text.includes("audit") || text.includes("history") || text.includes("activity")) return "history";
  if (path.includes("/report") || path.includes("/kpi") || path.includes("/metric") || text.includes("report") || text.includes("kpi") || text.includes("metric")) return "chart";
  if (path.includes("/calendar") || text.includes("calendar") || text.includes("session") || text.includes("meeting")) return "calendar";
  if (path.includes("/inquir") || path.includes("/queue") || path.includes("/request") || path.includes("/inbox") || path.includes("/leads") || text.includes("inquiry") || text.includes("queue") || text.includes("request") || text.includes("lead")) return "inbox";
  if (path.includes("/depart") || path.includes("/properties") || text.includes("department") || text.includes("propert") || text.includes("hotel") || text.includes("building")) return "building";
  if (path.includes("/link") || path.includes("/redirect") || path.includes("/relationship") || text.includes("link") || text.includes("redirect") || text.includes("relationship")) return "link";
  if (path.includes("/faq") || text.includes("faq")) return "list";
  if (path.includes("/trash") || text.includes("ถังขยะ") || text.includes("trash")) return "trash";
  if (path.includes("/pilot") || path.includes("/program") || path.includes("/material") || path.includes("/folder") || path.includes("/backlog") || text.includes("program") || text.includes("material") || text.includes("backlog")) return "folder";
  if (path.includes("/map") || path.includes("/local") || text.includes("map") || text.includes("local")) return "map";
  if (path.includes("/campaign") || path.includes("/channel") || text.includes("campaign") || text.includes("channel")) return "megaphone";
  if (path.includes("/partner") || path.includes("/handover") || text.includes("partner") || text.includes("handover") || text.includes("owner")) return "handshake";
  if (path.includes("/inventory") || path.includes("/architecture") || path.includes("/layer") || text.includes("inventory") || text.includes("architecture") || text.includes("flow")) return "layers";
  if (path.includes("/preview") || text.includes("preview")) return "pages";
  if (path.includes("/translation") || text.includes("translation") || text.includes("แปล")) return "article";
  if (path.includes("/test") || path.includes("/issue") || path.includes("/qa") || text.includes("test") || text.includes("issue") || text.includes("qa")) return "list";
  if (text.includes("เครื่องมือ")) return "settings";

  return "list";
}
