import { ArrowUpRight } from "@/components/Icons";
import {
  websiteRelatedCards,
  websiteRelatedDateLabel,
  websiteRelatedTypeLabel,
  type WebsiteRelatedCard,
} from "@/lib/hotel-website";
import { existingHref, type Locale } from "@/lib/seo";
import Link from "next/link";

function CardBody({ card, locale }: { card: WebsiteRelatedCard; locale: Locale }) {
  const thai = locale === "th";
  const dateLabel = websiteRelatedDateLabel(card, locale);
  const typeLabel = websiteRelatedTypeLabel(card, locale);
  const datetime =
    card.dateKind === "accessed" ? card.accessedAt : card.updatedAt || card.publishedAt;
  return (
    <>
      <p className="kpi-latin web-related-kicker">{thai ? card.categoryTh : card.categoryEn}</p>
      <h3>{thai ? card.titleTh : card.titleEn}</h3>
      <p className="web-related-desc">{thai ? card.descriptionTh : card.descriptionEn}</p>
      {dateLabel || typeLabel ? (
        <p className="web-related-meta">
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
          {dateLabel && typeLabel ? <span aria-hidden="true"> · </span> : null}
          {typeLabel ? <span>{typeLabel}</span> : null}
        </p>
      ) : null}
      <span className="web-related-cta">
        {thai ? card.ctaTh : card.ctaEn} <ArrowUpRight aria-hidden="true" />
      </span>
    </>
  );
}

export function WebsiteRelatedCards({
  locale,
  overrides,
}: {
  locale: Locale;
  overrides?: Array<{ id?: string; title?: string; body?: string; href?: string; cta?: string; featured?: boolean }>;
}) {
  const cards = websiteRelatedCards(locale).map((card) => {
    const override = overrides?.find((row) => row.id === card.id);
    if (!override) return card;
    return {
      ...card,
      titleTh: override.title?.trim() || card.titleTh,
      titleEn: override.title?.trim() || card.titleEn,
      descriptionTh: override.body?.trim() || card.descriptionTh,
      descriptionEn: override.body?.trim() || card.descriptionEn,
      href: override.href?.trim() || card.href,
      ctaTh: override.cta?.trim() || card.ctaTh,
      ctaEn: override.cta?.trim() || card.ctaEn,
      featured: override.featured ?? card.featured,
    };
  });
  const visible = cards.filter((card) => existingHref(card.href, locale));
  const featured = visible.find((card) => card.featured) ?? visible[0];
  const rest = visible.filter((card) => card.id !== featured?.id);
  if (!featured) return null;

  return (
    <div className="web-related-cards">
      <RelatedCard card={featured} locale={locale} featured />
      {rest.length ? (
        <div className="web-related-stack">
          {rest.map((card) => (
            <RelatedCard key={card.id} card={card} locale={locale} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RelatedCard({
  card,
  locale,
  featured = false,
}: {
  card: WebsiteRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const href = existingHref(card.href, locale) ?? card.href;
  return (
    <Link className={`web-related-item${featured ? " is-featured" : ""}`} href={href}>
      {featured ? <span className="web-related-accent" aria-hidden="true" /> : null}
      <CardBody card={card} locale={locale} />
    </Link>
  );
}
