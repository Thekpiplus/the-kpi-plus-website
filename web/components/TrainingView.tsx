import Link from "next/link";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import { TrainingEnquiry } from "@/components/TrainingEnquiry";
import { TrainingStickyCta } from "@/components/TrainingStickyCta";
import { HotelTrainingCycle } from "@/components/hotel-training/HotelTrainingCycle";
import { HotelTrainingGallery } from "@/components/hotel-training/HotelTrainingGallery";
import { HotelTrainingMatrix } from "@/components/hotel-training/HotelTrainingMatrix";
import { HotelTrainingOutcomes } from "@/components/hotel-training/HotelTrainingOutcomes";
import { HotelTrainingPrograms } from "@/components/hotel-training/HotelTrainingPrograms";
import { HotelTrainingTrainer } from "@/components/hotel-training/HotelTrainingTrainer";
import { HotelTrainingAssess } from "@/components/hotel-training/HotelTrainingAssess";
import { HotelTrainingRelated } from "@/components/hotel-training/HotelTrainingRelated";
import { HotelTrainingHeroVisual, HotelTrainingNeedsVisual } from "@/components/hotel-training/HotelTrainingVisuals";
import "@/components/hotel-training/hotel-training-visuals.css";
import type { CmsHotelTrainingPage } from "@/lib/cms/hotel-training-page";
import { hotelTrainingFaqsFromCms, hotelTrainingPublicHref, loadHotelTrainingPage } from "@/lib/cms/hotel-training-page-public";
import { solutionNavLabel } from "@/lib/nav";
import {
  HOTEL_TRAINING_ACADEMY_DISCOVER,
  HOTEL_TRAINING_ASSESS,
  HOTEL_TRAINING_FOLLOW,
  HOTEL_TRAINING_FOLLOW_FIELDS,
  HOTEL_TRAINING_GALLERY,
  HOTEL_TRAINING_JOURNEY,
  HOTEL_TRAINING_MATRIX,
  HOTEL_TRAINING_NEEDS,
  HOTEL_TRAINING_OUTCOMES,
  HOTEL_TRAINING_PARTNERS,
  HOTEL_TRAINING_PROGRAMS,
  HOTEL_TRAINING_TRAINER,
  hotelTrainingCopy,
  hotelTrainingEnquiryCopy,
  hotelTrainingRelatedCards,
  hotelTrainingResolveGalleryItem,
  hotelTrainingSampleLabel,
} from "@/lib/hotel-training";
import { localizePath, type Locale } from "@/lib/seo";

function pick(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export async function TrainingView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsHotelTrainingPage;
  embedded?: boolean;
}) {
  const cms = previewContent ? { ...previewContent, fromCms: true } : await loadHotelTrainingPage(locale);
  const fromCms = cms.fromCms;
  const thai = locale === "th";
  const t = thai ? hotelTrainingCopy.th : hotelTrainingCopy.en;
  const sample = hotelTrainingSampleLabel(locale);
  const solutions = localizePath("/solutions", locale);
  const primaryHref = hotelTrainingPublicHref(fromCms ? cms.hero.primaryCta.href : "", locale, "#training-enquiry");
  const secondaryHref = hotelTrainingPublicHref(fromCms ? cms.hero.secondaryCta.href : "", locale, "#training-programs");
  const related = fromCms && cms.related.cards.length ? cms.related.cards : hotelTrainingRelatedCards(locale);
  const needs = fromCms && cms.needs.items.length ? cms.needs.items : HOTEL_TRAINING_NEEDS;
  const journey = fromCms && cms.journey.steps.length ? cms.journey.steps : HOTEL_TRAINING_JOURNEY;
  const programs = fromCms && cms.programs.items.length ? cms.programs.items : HOTEL_TRAINING_PROGRAMS;
  const gallery = (fromCms && cms.gallery.items.length ? cms.gallery.items : HOTEL_TRAINING_GALLERY)
    .slice(0, 6)
    .map((item) => hotelTrainingResolveGalleryItem(item, locale));
  const matrix = fromCms && cms.matrix.items.length ? cms.matrix.items : HOTEL_TRAINING_MATRIX;
  const follow = fromCms && cms.follow.items.length ? cms.follow.items : HOTEL_TRAINING_FOLLOW;
  const outcomes = fromCms && cms.outcomes.items.length ? cms.outcomes.items : HOTEL_TRAINING_OUTCOMES;
  const faqItems = hotelTrainingFaqsFromCms(fromCms ? cms : null, locale);
  const enquiry = hotelTrainingEnquiryCopy(locale);
  const inner = (
    <div className="kpi-train ht-shell">
      <section className="kpi-hero kpi-home-hero-section kpi-train-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-train-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-training-team-development", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{pick(cms.hero.eyebrow, t.eyebrow)}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                <span className="kpi-home-h1-lead">{pick(cms.hero.titleLead, t.titleLead)}</span>
                <span className="kpi-home-h1-rest">
                  <span className="kpi-home-accent">{pick(cms.hero.titleAccent, t.titleAccent)}</span> {pick(cms.hero.titleRest, t.titleRest)}
                </span>
              </h1>
              <p className="kpi-lead kpi-home-lead">{pick(cms.hero.description, t.lead)}</p>
              <p className="kpi-train-lead-close">{pick(cms.hero.close, t.leadClose)}</p>
              <div className="kpi-actions">
                <a href={primaryHref} className="kpi-button bg-[#a2dc25] text-[#1a3a02]">
                  {pick(cms.hero.primaryCta.label, t.cta)}
                </a>
                <a href={secondaryHref} target={secondaryHref.startsWith("http") ? "_blank" : undefined} rel={secondaryHref.startsWith("http") ? "noreferrer" : undefined} className="kpi-button-ghost">
                  {pick(cms.hero.secondaryCta.label, t.secondary)}
                </a>
              </div>
              <p className="kpi-train-hero-note">{pick(cms.hero.underCta, t.underCta)}</p>
              <p className="kpi-tech-hero-trust">
                {(fromCms && cms.hero.trust.length ? cms.hero.trust.map((item) => (thai ? item.th : item.en)) : t.trust).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <HotelTrainingHeroVisual locale={locale} visual={cms.hero.visual} />
            </div>
          </div>
        </div>
      </section>

      <section id="training-needs" className="kpi-section kpi-train-problems">
        <div className="kpi-train-problems-grid">
          <div className="kpi-train-problems-copy">
            <h2 className="kpi-h2">{pick(cms.needs.title, t.needsTitle)}</h2>
            <p className="kpi-train-problems-lead">{pick(cms.needs.lead, t.needsLead)}</p>
            <p className="kpi-train-needs-note">{t.needsNote}</p>
            <p className="ht-status is-yellow">{sample}</p>
            <ol className="kpi-train-problems-list">
              {needs.map((item, index) => (
                <li key={item.id} className="kpi-train-problems-item">
                  <span className="kpi-latin kpi-train-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{thai ? item.th : item.en}</p>
                </li>
              ))}
            </ol>
          </div>
          <HotelTrainingNeedsVisual locale={locale} visual={cms.needs.visual} />
        </div>
      </section>

      <section id="training-approach" className="kpi-train-method border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{pick(cms.journey.title, t.journeyTitle)}</h2>
          <p className="kpi-train-problems-lead">{pick(cms.journey.lead, t.journeyLead)}</p>
          <p className="kpi-train-programs-note">{t.journeyNote}</p>
          <p className="ht-status is-yellow">{sample}</p>
          <HotelTrainingCycle locale={locale} steps={journey} />
        </div>
      </section>

      <section id="training-programs" className="kpi-section kpi-train-topics">
        <h2 className="kpi-h2">{pick(cms.programs.title, t.programsTitle)}</h2>
        <p className="kpi-train-problems-lead">{pick(cms.programs.lead, t.programsLead)}</p>
        <p className="kpi-train-programs-note">{t.programsNote}</p>
        <p className="ht-status is-yellow">{sample}</p>
        <HotelTrainingPrograms locale={locale} items={programs} />
      </section>

      <HotelTrainingAssess
        locale={locale}
        title={pick(cms.assess.title, t.assessTitle)}
        lead={pick(cms.assess.lead, t.assessLead)}
        note={t.assessNote}
        caption={pick(cms.assess.caption, t.assessCaption)}
        empty={t.measureEmpty}
        items={fromCms && cms.assess.items.length ? cms.assess.items : HOTEL_TRAINING_ASSESS}
      />

      <HotelTrainingGallery
        locale={locale}
        title={pick(cms.gallery.title, t.galleryTitle)}
        lead={pick(cms.gallery.lead, t.galleryLead)}
        note={t.galleryNote}
        items={gallery}
        showSample={!cms.approvals.teamPhotos}
      />

      <HotelTrainingMatrix
        locale={locale}
        title={pick(cms.matrix.title, t.matrixTitle)}
        lead={pick(cms.matrix.lead, t.matrixLead)}
        note={t.matrixNote}
        caption={pick(cms.matrix.caption, t.matrixCaption)}
        items={matrix}
      />

      <HotelTrainingOutcomes
        locale={locale}
        title={pick(cms.outcomes.title, t.outcomesTitle)}
        lead={pick(cms.outcomes.lead, t.outcomesLead)}
        note={t.outcomesNote}
        caption={pick(cms.outcomes.caption, t.outcomesCaption)}
        empty={t.measureEmpty}
        items={outcomes}
      />

      <HotelTrainingTrainer
        locale={locale}
        trainer={{
          title: pick(cms.trainer.title, t.trainerTitle),
          lead: pick(cms.trainer.lead, t.trainerLead),
          note: t.trainerNote,
          name: pick(cms.trainer.name, t.trainerName),
          nameEn: pick(cms.trainer.nameEn, t.trainerNameEn),
          roleTh: pick(cms.trainer.roleTh, HOTEL_TRAINING_TRAINER.roleTh),
          roleEn: pick(cms.trainer.roleEn, HOTEL_TRAINING_TRAINER.roleEn),
          experienceTh: cms.trainer.experienceVerified ? pick(cms.trainer.experienceTh, HOTEL_TRAINING_TRAINER.experienceTh) : "",
          experienceEn: cms.trainer.experienceVerified ? pick(cms.trainer.experienceEn, HOTEL_TRAINING_TRAINER.experienceEn) : "",
          topics: cms.trainer.topics?.length ? cms.trainer.topics : HOTEL_TRAINING_TRAINER.topics,
          formatTh: pick(cms.trainer.formatTh, HOTEL_TRAINING_TRAINER.formatTh),
          formatEn: pick(cms.trainer.formatEn, HOTEL_TRAINING_TRAINER.formatEn),
          engagementsTh: pick(cms.trainer.engagementsTh, HOTEL_TRAINING_TRAINER.engagementsTh),
          engagementsEn: pick(cms.trainer.engagementsEn, HOTEL_TRAINING_TRAINER.engagementsEn),
          qualificationsTh: cms.trainer.qualificationsVerified ? cms.trainer.qualificationsTh : "",
          qualificationsEn: cms.trainer.qualificationsVerified ? cms.trainer.qualificationsEn : "",
          languagesTh: cms.trainer.languagesVerified ? cms.trainer.languagesTh : "",
          languagesEn: cms.trainer.languagesVerified ? cms.trainer.languagesEn : "",
          bioTh: cms.trainer.bioTh,
          bioEn: cms.trainer.bioEn,
          src: cms.trainer.src,
          altTh: pick(cms.trainer.altTh, t.trainerAlt),
          altEn: pick(cms.trainer.altEn, t.trainerAlt),
          status: cms.trainer.status,
          publicationApproved: cms.trainer.publicationApproved,
          sample: cms.trainer.sample,
        }}
      />

      <section className="kpi-train-practice border-y border-[#E3E8EB] bg-white" aria-labelledby="training-follow-title">
        <div className="kpi-section">
          <h2 id="training-follow-title" className="kpi-h2">{pick(cms.follow.title, t.followTitle)}</h2>
          <p className="kpi-train-problems-lead">{pick(cms.follow.lead, t.followLead)}</p>
          <div className="ht-follow-wrap">
            <table className="ht-follow-table">
              <caption className="sr-only">{t.followLead}</caption>
              <thead>
                <tr>
                  <th scope="col">{thai ? HOTEL_TRAINING_FOLLOW_FIELDS.field.th : HOTEL_TRAINING_FOLLOW_FIELDS.field.en}</th>
                  <th scope="col">{thai ? HOTEL_TRAINING_FOLLOW_FIELDS.meaning.th : HOTEL_TRAINING_FOLLOW_FIELDS.meaning.en}</th>
                  <th scope="col">{thai ? HOTEL_TRAINING_FOLLOW_FIELDS.value.th : HOTEL_TRAINING_FOLLOW_FIELDS.value.en}</th>
                </tr>
              </thead>
              <tbody>
                {follow.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{thai ? row.labelTh : row.labelEn}</th>
                    <td data-label={thai ? HOTEL_TRAINING_FOLLOW_FIELDS.meaning.th : HOTEL_TRAINING_FOLLOW_FIELDS.meaning.en}>
                      {thai ? row.meaningTh : row.meaningEn}
                    </td>
                    <td data-label={thai ? HOTEL_TRAINING_FOLLOW_FIELDS.value.th : HOTEL_TRAINING_FOLLOW_FIELDS.value.en}>
                      <span className="ht-status is-yellow">{sample}</span> {thai ? row.valueTh : row.valueEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-train-partners">
        <h2 className="kpi-h2">{pick(cms.partners.title, t.partnersTitle)}</h2>
        <p className="kpi-train-partners-body">{pick(cms.partners.body, t.partnersBody)}</p>
        <ul className="kpi-train-partners-list">
          {HOTEL_TRAINING_PARTNERS.map((partner) => (
            <li key={partner.name}>
              <a href={partner.href} target="_blank" rel="noreferrer" className="kpi-train-partner">
                <img src={partner.src} alt={partner.alt} width={partner.width} height={partner.height} loading="lazy" decoding="async" />
                <span className="kpi-latin">{partner.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <aside className="kpi-train-closer">
          <h3>{t.closerTitle}</h3>
          <p>{t.closerBody}</p>
          <div className="kpi-train-closer-actions">
            <a href={primaryHref} className="kpi-button bg-[#a2dc25] text-[#1a3a02]">
              {t.cta} <span aria-hidden="true">↗</span>
            </a>
            <a href={HOTEL_TRAINING_ACADEMY_DISCOVER} target="_blank" rel="noreferrer" className="kpi-train-closer-link">
              {thai ? "ดูหลักสูตรและกิจกรรมของ Academy" : "See Academy courses and events"}
            </a>
          </div>
        </aside>
      </section>

      {related.length ? (
        <HotelTrainingRelated
          locale={locale}
          title={pick(cms.related.title, t.relatedTitle)}
          lead={pick(cms.related.lead, t.relatedLead)}
          cards={related}
        />
      ) : null}

      <TrainingEnquiry
        locale={locale}
        heading={pick(cms.form.heading, enquiry.heading)}
        lead={pick(cms.form.lead, enquiry.lead)}
        submitLabel={pick(thai ? cms.form.labels.submitTh : cms.form.labels.submitEn, enquiry.submit)}
        fieldLabels={{
          consent: pick(thai ? cms.form.labels.consentTh : cms.form.labels.consentEn, enquiry.labels.consent),
          privacy: pick(thai ? cms.form.labels.privacyTh : cms.form.labels.privacyEn, enquiry.labels.privacy),
          required: pick(thai ? cms.form.labels.requiredTh : cms.form.labels.requiredEn, enquiry.labels.required),
          requiredMsg: pick(thai ? cms.form.labels.requiredMsgTh : cms.form.labels.requiredMsgEn, enquiry.labels.requiredMsg),
          consentRequired: pick(thai ? cms.form.labels.consentRequiredTh : cms.form.labels.consentRequiredEn, enquiry.labels.consentRequired),
          secretMsg: pick(thai ? cms.form.labels.secretMsgTh : cms.form.labels.secretMsgEn, enquiry.labels.secretMsg),
        }}
      />
      <PageFaqs items={faqItems} locale={locale} intro={pick(thai ? cms.faqLead : cms.faqLeadEn, t.faqLead)} sectionId="training-faq" />
      <TrainingStickyCta label={pick(cms.hero.primaryCta.label, t.cta)} />
    </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-training-team-development", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}

