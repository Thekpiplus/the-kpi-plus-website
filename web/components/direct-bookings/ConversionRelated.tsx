import { ArrowUpRight } from "@/components/Icons";
import {
  DIRECT_BOOKING_RELATED_VISUAL,
  DIRECT_BOOKING_RELATED_VISUAL_OPTIONS,
  directBookingRelatedCards,
  directBookingRelatedDateLabel,
  directBookingRelatedTypeLabel,
  directBookingSampleLabel,
  type DirectBookingRelatedCard,
} from "@/lib/direct-bookings";
import { existingHref, type Locale } from "@/lib/seo";
import Link from "next/link";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

function CardBody({ card, locale }: { card: DirectBookingRelatedCard; locale: Locale }) {
  const thai = locale === "th";
  const dateLabel = directBookingRelatedDateLabel(card, locale);
  const typeLabel = directBookingRelatedTypeLabel(card, locale);
  const datetime = card.updatedAt || card.publishedAt;
  return (
    <>
      <p className="kpi-latin db-related-kicker">{thai ? card.categoryTh : card.categoryEn}</p>
      <h3>{thai ? card.titleTh : card.titleEn}</h3>
      <p className="db-related-desc">{thai ? card.descriptionTh : card.descriptionEn}</p>
      {dateLabel || typeLabel ? (
        <p className="db-related-meta">
          {dateLabel ? datetime ? <time dateTime={datetime}>{dateLabel}</time> : <span>{dateLabel}</span> : null}
          {dateLabel && typeLabel ? <span aria-hidden="true"> · </span> : null}
          {typeLabel ? <span>{typeLabel}</span> : null}
        </p>
      ) : null}
      <span className="db-related-cta">
        {thai ? card.ctaTh : card.ctaEn} <ArrowUpRight aria-hidden="true" />
      </span>
    </>
  );
}

export function ConversionRelated({
  locale,
  src,
  overrides,
  visual,
}: {
  locale: Locale;
  src?: string;
  overrides?: Array<{ id?: string; title?: string; body?: string; href?: string; cta?: string; featured?: boolean }>;
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const known = directBookingRelatedCards(locale);
  const cards = overrides?.length
    ? overrides
        .filter((row) => row.href?.trim() && row.title?.trim())
        .map((row, index) => {
          const match = known.find((card) => card.id === row.id || card.href === row.href);
          return {
            id: row.id || match?.id || `related-${index + 1}`,
            href: row.href?.trim() || match?.href || "/",
            featured: row.featured ?? match?.featured ?? false,
            categoryTh: match?.categoryTh || "",
            categoryEn: match?.categoryEn || "",
            titleTh: row.title?.trim() || match?.titleTh || "",
            titleEn: row.title?.trim() || match?.titleEn || "",
            descriptionTh: row.body?.trim() || match?.descriptionTh || "",
            descriptionEn: row.body?.trim() || match?.descriptionEn || "",
            publishedAt: match?.publishedAt,
            updatedAt: match?.updatedAt,
            dateKind: match?.dateKind,
            contentTypeTh: match?.contentTypeTh || "",
            contentTypeEn: match?.contentTypeEn || "",
            ctaTh: row.cta?.trim() || match?.ctaTh || (thai ? "ดูรายละเอียด" : "Read more"),
            ctaEn: row.cta?.trim() || match?.ctaEn || "Read more",
          } satisfies DirectBookingRelatedCard;
        })
    : known;
  const visible = cards.filter((card) => existingHref(card.href, locale) || card.href.startsWith("http") || card.href.startsWith("/"));
  const featured = visible.find((card) => card.featured) ?? visible[0];
  const rest = visible.filter((card) => card.id !== featured?.id);
  if (!featured) return null;

  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_RELATED_VISUAL.labelTh : DIRECT_BOOKING_RELATED_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_RELATED_VISUAL.captionTh : DIRECT_BOOKING_RELATED_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_RELATED_VISUAL.altTh : DIRECT_BOOKING_RELATED_VISUAL.altEn);
  const status = visual?.status || DIRECT_BOOKING_RELATED_VISUAL.status;

  return (
    <div className="db-related">
      <ConversionVisualFrame
        locale={locale}
        src={src}
        alt={alt}
        label={label}
        caption={caption}
        meta={thai ? DIRECT_BOOKING_RELATED_VISUAL.metaTh : DIRECT_BOOKING_RELATED_VISUAL.metaEn}
        status={status}
        width={DIRECT_BOOKING_RELATED_VISUAL.displayWidth}
        height={DIRECT_BOOKING_RELATED_VISUAL.displayHeight}
        variant="related"
      >
        <div className="db-related-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
          <p className="db-related-mock-kicker kpi-latin">Sample content</p>
          <p className="db-related-mock-title kpi-latin">{DIRECT_BOOKING_RELATED_VISUAL.labelEn}</p>
          <ol className="db-related-mock-list">
            {DIRECT_BOOKING_RELATED_VISUAL_OPTIONS.map((item, index) => (
              <li key={item.id} className={index === 0 ? "is-featured" : undefined}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{item.label}</strong>
              </li>
            ))}
          </ol>
          <p className="db-related-mock-note kpi-latin">Not a hotel booking result</p>
        </div>
      </ConversionVisualFrame>
      <div className="db-related-cards">
        <RelatedCard card={featured} locale={locale} featured />
        {rest.length ? (
          <div className="db-related-stack">
            {rest.map((card) => (
              <RelatedCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RelatedCard({
  card,
  locale,
  featured = false,
}: {
  card: DirectBookingRelatedCard;
  locale: Locale;
  featured?: boolean;
}) {
  const href = existingHref(card.href, locale) ?? card.href;
  return (
    <Link className={`db-related-item${featured ? " is-featured" : ""}`} href={href}>
      {featured ? <span className="db-related-accent" aria-hidden="true" /> : null}
      <CardBody card={card} locale={locale} />
    </Link>
  );
}
