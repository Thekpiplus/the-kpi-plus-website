import Link from "next/link";
import {
  HOTEL_TRAINING_RELATED_COVER_ITEMS,
  HOTEL_TRAINING_RELATED_VISUAL,
  hotelTrainingRelatedDateLabel,
  hotelTrainingSampleLabel,
  type HotelTrainingRelatedCard,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export function HotelTrainingRelated({
  locale,
  title,
  lead,
  cards,
}: {
  locale: Locale;
  title: string;
  lead: string;
  cards: readonly HotelTrainingRelatedCard[];
}) {
  const thai = locale === "th";
  const sample = hotelTrainingSampleLabel(locale);
  const label = thai ? HOTEL_TRAINING_RELATED_VISUAL.labelTh : HOTEL_TRAINING_RELATED_VISUAL.labelEn;
  const featured = cards.find((card) => card.featured) || cards[0];
  const supporting = cards.filter((card) => card.id !== featured?.id);
  if (!cards.length) return null;
  return (
    <section id="training-related" className="kpi-train-related border-t border-[#E3E8EB] bg-white" aria-labelledby="training-related-title">
      <div className="kpi-section">
        <h2 id="training-related-title" className="kpi-h2">
          {title}
        </h2>
        {lead ? <p className="kpi-train-problems-lead">{lead}</p> : null}
        <div className="ht-related-layout">
          <figure className="ht-related-visual">
            <div
              className="ht-related-frame"
              role="img"
              aria-label={thai ? HOTEL_TRAINING_RELATED_VISUAL.altTh : HOTEL_TRAINING_RELATED_VISUAL.altEn}
            >
              <span className="ht-visual-badge">{sample}</span>
              <div className="ht-related-cover">
                <p className="ht-related-cover-mark kpi-latin" aria-hidden="true">
                  KP
                </p>
                <p className="ht-related-cover-kicker kpi-latin">Sample cover</p>
                <p className="ht-related-cover-title kpi-latin">{HOTEL_TRAINING_RELATED_VISUAL.labelEn}</p>
                <ol className="ht-related-cover-list">
                  {HOTEL_TRAINING_RELATED_COVER_ITEMS.map((item, index) => (
                    <li key={item.id}>
                      <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                      <strong className="kpi-latin">{item.label}</strong>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <figcaption className="ht-visual-caption">
              <strong>{label}</strong>
              <span>{thai ? HOTEL_TRAINING_RELATED_VISUAL.captionTh : HOTEL_TRAINING_RELATED_VISUAL.captionEn}</span>
            </figcaption>
          </figure>
          <div className="ht-related-cards">
            {featured ? <HotelTrainingRelatedCardLink card={featured} locale={locale} featured /> : null}
            {supporting.length ? (
              <div className="kpi-train-related-stack">
                {supporting.map((card) => (
                  <HotelTrainingRelatedCardLink key={card.id} card={card} locale={locale} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function HotelTrainingRelatedCardLink({
  card,
  locale,
  featured = false,
}: {
  card: HotelTrainingRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const thai = locale === "th";
  const dateLabel = hotelTrainingRelatedDateLabel(card, thai ? "th" : "en");
  const typeLabel = thai ? card.contentTypeTh : card.contentTypeEn;
  const datetime = card.dateKind === "updated" ? card.updatedAt || card.publishedAt : card.publishedAt;
  const className = featured ? "kpi-train-related-primary" : "kpi-train-related-secondary";
  const body = (
    <>
      {featured ? <span className="kpi-train-related-accent" aria-hidden="true" /> : null}
      <p className="ht-related-kicker kpi-latin">{thai ? card.categoryTh : card.categoryEn}</p>
      <h3>{thai ? card.titleTh : card.titleEn}</h3>
      <p>{thai ? card.descriptionTh : card.descriptionEn}</p>
      {typeLabel || dateLabel ? (
        <p className="ht-related-meta">
          {typeLabel ? <span>{typeLabel}</span> : null}
          {typeLabel && dateLabel ? <span aria-hidden="true"> · </span> : null}
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
        </p>
      ) : null}
      <span className="kpi-train-related-cta">
        {thai ? card.ctaTh : card.ctaEn}
        <span aria-hidden="true">↗</span>
      </span>
    </>
  );
  if (card.external) {
    return (
      <a className={className} href={card.href} target="_blank" rel="noreferrer">
        {body}
      </a>
    );
  }
  return (
    <Link className={className} href={card.href}>
      {body}
    </Link>
  );
}
