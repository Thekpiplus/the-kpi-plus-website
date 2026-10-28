import { ArrowUpRight } from "@/components/Icons";
import {
  hotelSeoRelatedDateLabel,
  hotelSeoRelatedTypeLabel,
  type HotelSeoRelatedCard,
} from "@/lib/hotel-seo";
import { existingHref, type Locale } from "@/lib/seo";
import Link from "next/link";

function CardBody({ card, locale }: { card: HotelSeoRelatedCard; locale: Locale }) {
  const thai = locale === "th";
  const dateLabel = hotelSeoRelatedDateLabel(card, locale);
  const typeLabel = hotelSeoRelatedTypeLabel(card, locale);
  const datetime = card.dateKind === "accessed" ? card.accessedAt : card.updatedAt || card.publishedAt;
  return (
    <>
      <p className="kpi-latin kpi-seo-local-related-kicker">{thai ? card.categoryTh : card.categoryEn}</p>
      <h3>{thai ? card.titleTh : card.titleEn}</h3>
      <p className="kpi-seo-local-related-desc">{thai ? card.descriptionTh : card.descriptionEn}</p>
      {dateLabel || typeLabel ? (
        <p className="kpi-seo-local-related-meta">
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
          {dateLabel && typeLabel ? <span aria-hidden="true"> · </span> : null}
          {typeLabel ? <span>{typeLabel}</span> : null}
        </p>
      ) : null}
      {card.sourceName || card.sourceUrl ? (
        <p className="kpi-seo-local-related-source">
          {thai ? "ที่มา: " : "Source: "}
          <span className="kpi-latin">{card.sourceName || card.sourceUrl}</span>
          {card.sourceUrl && card.sourceUrl !== card.href ? <span className="kpi-latin"> · {card.sourceUrl}</span> : null}
        </p>
      ) : null}
      <span className="kpi-seo-local-related-cta">
        {thai ? card.ctaTh : card.ctaEn} <ArrowUpRight aria-hidden="true" />
      </span>
    </>
  );
}

export function HotelSeoRelatedCards({ locale, cards }: { locale: Locale; cards: HotelSeoRelatedCard[] }) {
  const featured = cards.find((card) => card.featured) ?? cards[0];
  const rest = cards.filter((card) => card.id !== featured?.id);
  if (!featured) return null;

  return (
    <div className="kpi-seo-local-related-cards">
      <RelatedCard card={featured} locale={locale} featured />
      <div className="kpi-seo-local-related-stack">
        {rest.map((card) => (
          <RelatedCard key={card.id} card={card} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function RelatedCard({
  card,
  locale,
  featured = false,
}: {
  card: HotelSeoRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const className = `kpi-seo-local-related-item${featured ? " is-featured" : ""}`;
  const href = card.external ? card.href : existingHref(card.href, locale) ?? card.href;
  if (card.external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {featured ? <span className="kpi-seo-local-related-accent" aria-hidden="true" /> : null}
        <CardBody card={card} locale={locale} />
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {featured ? <span className="kpi-seo-local-related-accent" aria-hidden="true" /> : null}
      <CardBody card={card} locale={locale} />
    </Link>
  );
}
