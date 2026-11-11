import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import {
  internalBacklinksCopy,
  internalBacklinksFor,
  usesNativeRelatedSection,
} from "@/lib/internal-backlinks";
import { barePath, type Locale } from "@/lib/seo";

const KIND_LABEL: Record<Locale, Record<string, string>> = {
  th: {
    solution: "โซลูชัน",
    insight: "บทความ",
    tool: "เครื่องมือ",
    page: "หน้าเว็บ",
    case: "ผลงาน",
  },
  en: {
    solution: "Solution",
    insight: "Insight",
    tool: "Tool",
    page: "Page",
    case: "Case study",
  },
  ru: {
    solution: "Решение",
    insight: "Статья",
    tool: "Инструмент",
    page: "Страница",
    case: "Кейс",
  },
  zh: {
    solution: "解決方案",
    insight: "文章",
    tool: "工具",
    page: "頁面",
    case: "案例",
  },
};

export function InternalBacklinks({ route, locale }: { route: string; locale: Locale }) {
  const bare = barePath(route);
  // Keep this path check local so Turbopack cannot serve a stale skip helper.
  if (
    usesNativeRelatedSection(route) ||
    bare === "/" ||
    bare.startsWith("/solutions/") ||
    bare.startsWith("/insights/") ||
    (bare.startsWith("/case-studies/") && bare !== "/case-studies") ||
    bare === "/privacy" ||
    bare === "/cookies"
  ) {
    return null;
  }
  const links = internalBacklinksFor(route, locale);
  if (!links.length) return null;
  const copy = internalBacklinksCopy(locale);
  const kinds = KIND_LABEL[locale] ?? KIND_LABEL.en;

  return (
    <section className="kpi-internal-backlinks" aria-labelledby="kpi-internal-backlinks-title">
      <div className="kpi-section">
        <div className="kpi-internal-backlinks-intro">
          <h2 id="kpi-internal-backlinks-title" className="kpi-h2">
            {copy.title}
          </h2>
          <p>{copy.lead}</p>
        </div>
        <ul className="kpi-internal-backlinks-grid">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="kpi-internal-backlinks-card">
                <span className="kpi-internal-backlinks-kind kpi-latin">{kinds[item.kind] ?? item.kind}</span>
                <span className="kpi-internal-backlinks-label">{item.label}</span>
                <span className="kpi-internal-backlinks-cta" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
