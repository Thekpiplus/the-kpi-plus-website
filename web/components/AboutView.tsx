import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { loadAboutPageCopy } from "@/lib/cms/about-page-public";
import { loadPublishedClientLogos } from "@/lib/cms/client-logo-public";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

function splitTags(tags: string) {
  return tags.split(" · ");
}

function AboutSlotPhoto({
  className,
  src,
  width,
  height,
  alt,
}: {
  className: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}) {
  return (
    <figure className={`kpi-about-slot ${className}`}>
      <div className="kpi-about-slot-frame">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </div>
    </figure>
  );
}

function AboutPillarPreview({
  index,
  sampleLabel,
  photos,
}: {
  index: number;
  sampleLabel: string;
  photos: [string, string, string];
}) {
  const src = photos[index] ?? photos[0];
  return (
    <div className="kpi-about-deliverable kpi-about-deliverable-photo" aria-hidden="true">
      <span className="kpi-about-deliverable-badge">{sampleLabel}</span>
      <img src={src} alt="" width={1600} height={1000} loading="lazy" decoding="async" />
    </div>
  );
}



export async function AboutView({ locale }: { locale: Locale }) {
  const [publishedLogos, t] = await Promise.all([loadPublishedClientLogos(), loadAboutPageCopy(locale)]);
  const aboutFeaturedClients = t.featuredClientNames.flatMap((name) => {
    const client = publishedLogos.find((item) => item.name === name);
    return client ? [client] : [];
  });
  const audit = auditHref(locale);
  const contact = localizePath("/contact-us", locale);
  const approach = localizePath("/approach", locale);
  const isTh = locale === "th";

  return (
    <SiteShell locale={locale} route={localizePath("/about-us", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-home-landing-hero kpi-about-hero">
        <div className="kpi-wrap">
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className={`kpi-home-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.kicker}</p>
              <h1 className="kpi-h1 kpi-home-h1 kpi-about-hero-title">{t.h1}</h1>
              <p className="kpi-about-hero-highlight">{t.highlight}</p>
              <p className="kpi-lead kpi-home-lead kpi-about-hero-lead">{t.heroBody}</p>
              <div className="kpi-actions">
                <Link href={audit} className="kpi-button">
                  {t.auditCta} <span aria-hidden="true">↗</span>
                </Link>
                <Link href={contact} className="kpi-button-ghost">
                  {t.closerSecondary}
                </Link>
              </div>
            </div>
            <figure className="kpi-home-hero-visual kpi-about-hero-visual">
              {/* Verified real The KPI Plus team photo. Do not replace with AI/stock; leadership uses founders only. */}
              <div className="kpi-about-hero-photo">
                <img
                  src={t.workPhoto}
                  alt={t.workAlt}
                  width={1024}
                  height={682}
                  sizes="(min-width: 64rem) 28rem, min(36rem, 100vw)"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="kpi-about-band kpi-about-philosophy" aria-labelledby="about-partner-title">
        <div className="kpi-section">
          <div className="kpi-about-story">
            <div className="kpi-about-story-copy">
              <p className={`kpi-about-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.partnerEyebrow}</p>
              <h2 id="about-partner-title" className="kpi-h2 kpi-about-h2">
                {t.partnerTitle}
              </h2>
              <p className="kpi-about-lead">{t.partnerLead}</p>
              <p className="kpi-about-goal">
                {t.partnerGoal}{" "}
                <span className="kpi-about-accent">{t.partnerAccent}</span>
              </p>
            </div>
            {/* Option B: three-stage story from existing copy. No verified founding dates — do not invent years. */}
            <ol className="kpi-about-story-visual" aria-label={t.storyVisualLabel}>
              {t.storyStages.map(([num, title, body], index) => (
                <li key={num} className="kpi-about-story-stage">
                  {index < t.storyStages.length - 1 ? (
                    <span className="kpi-about-story-line" aria-hidden="true" />
                  ) : null}
                  <span className="kpi-latin kpi-about-num">{num}</span>
                  <div className="kpi-about-story-stage-copy">
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="kpi-about-vm">
            <article className="kpi-about-vm-item">
              <h3 className="kpi-latin kpi-about-vm-label">{t.visionLabel}</h3>
              <p className="kpi-about-vm-body">{t.vision}</p>
            </article>
            <article className="kpi-about-vm-item">
              <h3 className="kpi-latin kpi-about-vm-label">{t.missionLabel}</h3>
              <p className="kpi-about-vm-body">{t.mission}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="kpi-about-method" aria-labelledby="about-method-title">
        <div className="kpi-section">
          <h2 id="about-method-title" className="kpi-h2 kpi-about-h2">
            {t.methodTitle}
          </h2>
          <AboutSlotPhoto
            className="kpi-about-method-photo"
            src={t.workshopPhoto}
            width={1600}
            height={1067}
            alt={t.workshopAlt}
          />
          <ol className="kpi-about-steps" aria-label={t.methodStepsLabel}>
            {t.methods.map(([num, title, output], index) => (
              <li
                key={num}
                className="kpi-about-step"
                aria-labelledby={`about-method-step-${num}`}
                aria-describedby={`about-method-out-${num}`}
              >
                {index < t.methods.length - 1 ? (
                  <span className="kpi-about-step-connector" aria-hidden="true" />
                ) : null}
                <span className="kpi-latin kpi-about-step-badge" aria-hidden="true">
                  {num}
                </span>
                <div className="kpi-about-step-copy">
                  <h3 id={`about-method-step-${num}`}>{title}</h3>
                  <p id={`about-method-out-${num}`} className="kpi-about-step-output">
                    <span className="sr-only">{t.methodOutput}: </span>
                    {output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="kpi-about-method-foot">
            <p className="kpi-about-note">{t.methodNote}</p>
            <aside className="kpi-about-sample" aria-label={t.sampleFormat}>
              <p className="kpi-about-sample-badge">{t.sampleBadge}</p>
              <p className="kpi-about-sample-title">{t.sampleFormat}</p>
              <p className="kpi-latin kpi-about-sample-period">{t.samplePeriod}</p>
              <dl className="kpi-about-sample-kpis">
                <div>
                  <dt className="kpi-latin">Occupancy</dt>
                  <dd className="kpi-latin">
                    62% <span aria-hidden="true">→</span> 71%
                  </dd>
                </div>
                <div>
                  <dt className="kpi-latin">Room revenue</dt>
                  <dd className="kpi-latin is-up">+8%</dd>
                </div>
                <div className="is-accent">
                  <dt className="kpi-latin">Net after commission</dt>
                  <dd className="kpi-latin">−3%</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="kpi-about-band kpi-about-pillars" aria-labelledby="about-pillars-title">
        <div className="kpi-section">
          <h2 id="about-pillars-title" className="kpi-h2 kpi-about-h2">
            {t.pillarsTitle}
          </h2>
          <div className="kpi-about-pillar-list">
            {t.pillars.map((pillar, index) => (
              <article key={pillar.num} className="kpi-about-pillar">
                <AboutPillarPreview index={index} sampleLabel={t.sampleBadge} photos={t.pillarPhotos} />
                <span className="kpi-latin kpi-about-num">{pillar.num}</span>
                <h3>{pillar.title}</h3>
                <p className="kpi-latin kpi-about-pillar-sub">{pillar.subtitle}</p>
                <p className="kpi-about-pillar-body">{pillar.body}</p>
                <p className="kpi-about-pillar-receive">
                  <span className="kpi-about-pillar-receive-label">{t.pillarReceiveLabel}</span>
                  {pillar.receive}
                </p>
                <ul className="kpi-about-pillar-tags">
                  {splitTags(pillar.tags).map((tag) => (
                    <li key={tag} className="kpi-latin">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-about-experience" aria-labelledby="about-experience-title">
        <div className="kpi-section">
          <h2 id="about-experience-title" className="kpi-h2 kpi-about-h2">
            {t.experienceTitle}
          </h2>
          <div className="kpi-about-experience-row">
            {/* TODO: add a verified measurement period for the 100+ figure when available. Do not invent a date. */}
            <p className="kpi-latin kpi-about-experience-num" aria-label={`${t.experienceMetric}: 100+`}>
              100+
            </p>
            <div className="kpi-about-experience-copy">
              <p className="kpi-about-experience-label">{t.experienceMetric}</p>
              <p className="kpi-about-experience-scope">{t.experienceScope}</p>
              <p className="kpi-about-experience-note">{t.experienceNote}</p>
              <p className="kpi-about-lead">{t.experienceBody}</p>
            </div>
          </div>
          <AboutSlotPhoto
            className="kpi-about-experience-photo"
            src={t.caseHotelPhoto}
            width={1600}
            height={1067}
            alt={t.caseHotelAlt}
          />
          {aboutFeaturedClients.length ? (
            <>
              <p className={`kpi-about-clients-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.clientsEyebrow}</p>
              <ul className="kpi-about-clients" aria-label={t.clientsEyebrow}>
                {aboutFeaturedClients.map((client) => (
                  <li key={client.name} className="kpi-about-client">
                    <img
                      src={client.src}
                      alt={client.alt || `${client.name} logo`}
                      width={160}
                      height={64}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      <section className="kpi-about-band kpi-about-values" aria-labelledby="about-values-title">
        <div className="kpi-section">
          <h2 id="about-values-title" className="kpi-h2 kpi-about-h2">
            {t.valuesTitle}
          </h2>
          <ol className="kpi-about-values-list">
            {t.values.map(([num, title, body]) => (
              <li key={num} className="kpi-about-value">
                <span className="kpi-latin kpi-about-value-num" aria-hidden="true">
                  {num}
                </span>
                <div className="kpi-about-value-copy">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="kpi-about-values-more">
            <Link href={approach}>{t.valuesProcessLink}</Link>
          </p>
        </div>
      </section>

      <section className="kpi-about-leadership" aria-labelledby="about-founders-title">
        <div className="kpi-section">
          <div className="kpi-about-leadership-intro">
            <figure className="kpi-about-leadership-figure">
              {/*
                Preferred work photos (hotel-manager meeting, RM laptop review, site visit, deliverable desk) are not in the verified media set.
                Do not reuse the About Hero team-review photo. Do not use AI/holographic meeting or dashboard images.
                Verified option: founder portrait with confirmed names and roles.
              */}
              <div className="kpi-about-leadership-photo">
                <img
                  src={t.foundersPhoto}
                  alt={t.foundersAlt}
                  width={705}
                  height={1024}
                  sizes="(min-width: 48rem) 22rem, 100vw"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="kpi-about-leadership-caption">{t.foundersCaption}</figcaption>
            </figure>
            <div className="kpi-about-leadership-copy">
              <p className="kpi-latin kpi-about-eyebrow">{t.foundersEyebrow}</p>
              <h2 id="about-founders-title" className="kpi-h2 kpi-about-h2">
                {t.foundersTitle}
              </h2>
              <p className="kpi-about-lead">{t.foundersLead}</p>
              <p className="kpi-about-leadership-help">{t.foundersHelp}</p>
              <div className="kpi-about-leadership-bios">
                <article className="kpi-about-bio">
                  <h3>{t.founderAName}</h3>
                  <p className="kpi-about-bio-role">{t.founderARole}</p>
                  <p className="kpi-about-bio-body">{t.founderABody}</p>
                </article>
                <article className="kpi-about-bio">
                  <h3>{t.founderBName}</h3>
                  <p className="kpi-about-bio-role">{t.founderBRole}</p>
                  <p className="kpi-about-bio-body">{t.founderBBody}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-about-closer" aria-labelledby="about-closer-title">
        <div className="kpi-section">
          <div className="kpi-about-closer-inner">
            <p className="kpi-latin kpi-about-closer-eyebrow">{t.closerEyebrow}</p>
            <h2 id="about-closer-title" className="kpi-h2 kpi-about-closer-title">
              {t.closerTitle}
            </h2>
            <p className="kpi-about-closer-body">{t.closerBody}</p>
            <p className="kpi-about-closer-line">{t.closerLine}</p>
            <ol className="kpi-about-closer-next" aria-label={t.closerNextLabel}>
              {t.closerNext.map((step, index) => (
                <li key={step}>
                  <span className="kpi-latin kpi-about-closer-next-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="kpi-actions">
              <Link href={audit} className="kpi-button">
                {t.auditCta} <span aria-hidden="true">↗</span>
              </Link>
              <Link href={contact} className="kpi-button-ghost">
                {t.closerSecondary}
              </Link>
            </div>
            <p className="kpi-about-closer-note">{t.closerNote}</p>
          </div>
        </div>
      </section>

      <section className="kpi-about-band kpi-about-join" aria-labelledby="about-join-title">
        <div className="kpi-section">
          <div className="kpi-about-join-row">
            <div className="kpi-about-join-copy">
              <h2 id="about-join-title" className="kpi-h2 kpi-about-h2">
                {t.joinTitle}
              </h2>
              <p className="kpi-about-lead">{t.joinBody}</p>
            </div>
            <AboutSlotPhoto
              className="kpi-about-join-photo"
              src={t.teamRealPhoto}
              width={1600}
              height={1067}
              alt={t.teamRealAlt}
            />
            <aside className="kpi-about-join-card" aria-labelledby="about-join-process-title">
              <p id="about-join-process-title" className={`kpi-about-join-card-label${isTh ? "" : " kpi-latin"}`}>
                {t.joinProcessLabel}
              </p>
              <ol>
                {t.joinProcess.map(([num, title, body]) => (
                  <li key={num}>
                    <span className="kpi-latin kpi-about-join-num" aria-hidden="true">
                      {num}
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
            <Link
              href="mailto:info@thekpiplus.com?subject=Join%20The%20KPI%20Plus"
              className="kpi-button kpi-about-join-cta"
            >
              {t.joinCta} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
