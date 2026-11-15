export type DashTone = "rose" | "amber" | "sky" | "brand" | "neutral";

export type DashKpi = {
  key: string;
  label: string;
  value: number;
  note: string;
  tone: DashTone;
  href?: string;
};

export type DashTask = {
  title: string;
  meta: string;
  priority: "urgent" | "medium" | "low";
  href: string;
};

export type DashModule = {
  href: string;
  code: string;
  name: string;
  blurb: string;
  icon: string;
  tone: string;
  metrics: Array<{ label: string; value: number }>;
  cta: string;
};

export type DashActivity = {
  title: string;
  meta: string;
  tone: "leads" | "partners" | "reservations" | "b2b" | "users" | "cms";
};
