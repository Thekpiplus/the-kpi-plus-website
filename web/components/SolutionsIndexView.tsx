import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { visibleSolutionGroups } from "@/lib/nav";
import { solutionsIndexCopy } from "@/lib/localized-ui";
import { auditHref, barePath, localizePath, type Locale } from "@/lib/seo";

export function SolutionsIndexView({ locale }: { locale: Locale }) {
  const t = solutionsIndexCopy[locale];
  const audit = auditHref(locale);
  const groups = visibleSolutionGroups(locale).map((group, index) => ({
    id: group.id,
    num: `0${index + 1}`,
    title: t.groups[index]?.title ?? group.title,
    items: group.items.map((item) => ({
      href: item.href,
      label: item.label,
      problem: t.problems[barePath(item.href) as keyof typeof t.problems],
    })),
  }));

  return (
    <SiteShell locale={locale} route={localizePath("/solutions", locale)}>
      <PageHero>
        <div className="kpi-split">
          <div>
            <p className="kpi-kicker text-[#F2F8E2]">{t.eyebrow}</p>
            <h1 className="kpi-h1 mt-5">{t.title}</h1>
            <p className="kpi-lead mt-6 text-white/72">{t.body}</p>
            <div className="kpi-actions">
              <Link href={audit} className="kpi-button">
                {t.audit}
              </Link>
              <Link href="#solutions" className="kpi-button-ghost">
                {t.browse}
              </Link>
            </div>
          </div>
          <img
            src="/media/the-kpi-plus-revenue-scene_4932d3c7.jpg"
            alt={t.title}
            className="kpi-hero-visual w-full rounded-[1.25rem] object-cover"
          />
        </div>
      </PageHero>

      <section id="solutions" className="scroll-mt-28">
        <div className="kpi-section pb-6 lg:pb-8">
          <p className="kpi-kicker text-[#0B6660]">{t.sectionEyebrow}</p>
          <h2 className="kpi-h2 mt-5">{t.sectionTitle}</h2>
        </div>

        {groups.map((group, index) => (
          <div key={group.id} className={index % 2 === 1 ? "bg-white" : undefined}>
            <section id={group.id} className="kpi-section scroll-mt-28">
              <p className="text-sm font-black tracking-[.16em] text-[#0B6660]">{group.num}</p>
              <h3 className="mt-4 max-w-3xl text-2xl font-extrabold leading-[1.2] tracking-[-.02em] text-[#3B3B3B] sm:text-3xl">
                {group.title}
              </h3>
              <div className={`${group.items.length === 4 ? "kpi-grid-2" : "kpi-grid-3"} mt-10`}>
                {group.items.map((item) => (
                  <article key={item.href} className="kpi-card relative flex flex-col overflow-hidden p-7 sm:p-8">
                    <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                    <h4 className={`${locale === "en" ? "kpi-latin " : ""}mt-3 text-xl font-extrabold leading-snug text-[#0B1F33]`}>{item.label}</h4>
                    {item.problem ? <p className="mt-4 text-base leading-8 text-[#555555]">{item.problem}</p> : null}
                    <Link href={item.href} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                      {t.details}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ))}
      </section>

      {t.unsureTitle ? (
        <section className="kpi-section">
          <div className="rounded-[1.5rem] bg-[#F2F8E2] px-6 py-12 sm:px-12 sm:py-14">
            <h2 className="kpi-h2 text-[#0B1F33]">{t.unsureTitle}</h2>
            <p className="kpi-lead mt-5">{t.unsureBody}</p>
            <Link href={audit} className="kpi-button mt-8">
              {t.audit}
            </Link>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
