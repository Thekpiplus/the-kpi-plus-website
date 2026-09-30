import { HeroCta } from "@/components/HeroCta";
import { Network, RouteIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { associationsCopy } from "@/lib/localized-ui";
import { localizePath, type Locale } from "@/lib/seo";

const partners = [
  {
    logo: "/brand/partners/nawa-mark.png",
    alt: "NAWA Smart Hospitality Solutions logo",
    name: "NAWA Smart Hospitality Solutions",
    subtitle: "Smart Technology Solutions for Hospitality Businesses",
    body: "Hospitality technology and digital solutions designed to improve business operations, guest experience, and overall efficiency.",
    href: "https://www.nawaone.co/en",
    tile: "dark",
  },
  {
    logo: "/media/australia-smart-logo_f061fbb2.png",
    alt: "Australia Smart Edu Biz Coach logo",
    name: "Australia Smart Edu Biz Coach",
    subtitle: "International Education & Education Consulting",
    body: "Supporting students, families, educational institutions, and businesses through international education consulting, study pathways, coaching, and education-related services.",
    href: "https://www.australiasmart.com.au",
    tile: "light",
  },
  {
    logo: "/media/top-travel-logo_e8927780.png",
    alt: "Top Travel Thailand logo",
    name: "Top Travel Thailand",
    subtitle: "Travel, Transportation & Destination Services",
    body: "Providing professional travel services including airport transfers, private transportation, tours, activities, and customized travel experiences in Thailand.",
    href: "https://toptravelthailand.com",
    tile: "light",
  },
] as const;

export function AssociationsView({ locale }: { locale: Locale }) {
  const t = associationsCopy[locale];

  return (
    <SiteShell locale={locale} route={localizePath("/associations", locale)}>
      <PageHero>
        <div className="kpi-split-assoc">
          <div>
            <p className="kpi-kicker text-[#F2F8E2]">{t.eyebrow}</p>
            <h1 className="kpi-h1 mt-5">{t.title}</h1>
            <p className="kpi-lead mt-5 text-white/72">{t.body}</p>
            <HeroCta locale={locale} className="mt-8" />
          </div>
          <div className="kpi-hero-visual rounded-[1.25rem] border border-white/12 bg-white/5 p-8">
            <Network className="h-10 w-10 text-[#F2F8E2]" />
            <p className="mt-10 text-sm font-bold leading-7 text-white/80">{t.aside}</p>
          </div>
        </div>
      </PageHero>

      <section className="kpi-section">
        <div className="kpi-grid-3">
          {partners.map((partner) => (
            <article key={partner.name} className="kpi-card flex flex-col p-7">
              <div
                className={`flex h-24 items-center rounded-xl p-5 ${
                  partner.tile === "dark" ? "bg-[#111111]" : "bg-[#eef4f5]"
                }`}
              >
                <img src={partner.logo} alt={partner.alt} className="max-h-14 w-auto max-w-full object-contain" />
              </div>
              <p className="mt-8 text-xs font-extrabold uppercase tracking-[.14em] text-[#0B6660]">{t.badge}</p>
              <h2 className="mt-4 text-2xl font-extrabold tracking-[-.05em]">{partner.name}</h2>
              <h3 className="mt-5 text-sm font-bold leading-6 text-[#234b55]">{partner.subtitle}</h3>
              <p className="mt-4 text-sm leading-7 text-[#555555]">{partner.body}</p>
              <a
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                data-track="association_outbound_click"
                className="mt-8 inline-flex items-center gap-2 text-base font-extrabold text-[#0B6660]"
              >
                {t.visit}
                <RouteIcon className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-6 text-[#555555]">{t.note}</p>
      </section>
    </SiteShell>
  );
}
