import type { ReactNode } from "react";
import Link from "next/link";
import { HeroCta } from "@/components/HeroCta";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";

export function ToolPage({
  route,
  eyebrow,
  title,
  body,
  children,
}: {
  route: string;
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <SiteShell locale="th" route={route}>
      <PageHero>
        <Link href="/tools" className="text-sm font-semibold text-[#F2F8E2]">
          เครื่องมือฟรีสำหรับโรงแรม
        </Link>
        <p className="kpi-kicker mt-4 text-[#F2F8E2]">{eyebrow}</p>
        <h1 className="kpi-h1 mt-3">{title}</h1>
        <p className="kpi-lead mt-4 text-white/72">{body}</p>
        <HeroCta locale="th" className="mt-8" />
      </PageHero>
      <section className="kpi-section">{children}</section>
    </SiteShell>
  );
}
