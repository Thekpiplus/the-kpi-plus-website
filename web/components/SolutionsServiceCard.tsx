import Link from "next/link";
import type { StandardizedServiceCard } from "@/lib/solutions-service-cards";

type CardCopy = {
  suitableForLabel: string;
  deliverableLabel: string;
  boundaryLabel?: string;
  viewDetails: string;
};

/**
 * Text-first service card with a single interactive target (View details).
 * Stretched hit area covers the card for mouse/touch; keyboard focus stays on the link.
 */
export function SolutionsServiceCard({
  card,
  copy,
}: {
  card: StandardizedServiceCard;
  copy: CardCopy;
}) {
  return (
    <article className="kpi-card kpi-solutions-service-card relative flex flex-col overflow-hidden p-7 sm:p-8">
      <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" aria-hidden="true" />
      <p className="kpi-solutions-service-card-category">{card.category}</p>
      <h4 className={`${card.latinName ? "kpi-latin " : ""}kpi-solutions-service-card-title`}>{card.name}</h4>
      {card.problem ? <p className="kpi-solutions-service-card-problem">{card.problem}</p> : null}
      {card.suitable || card.deliverable || card.boundary ? (
        <dl className="kpi-solutions-service-card-meta">
          {card.suitable ? (
            <div>
              <dt>{copy.suitableForLabel}</dt>
              <dd>{card.suitable}</dd>
            </div>
          ) : null}
          {card.deliverable ? (
            <div>
              <dt>{copy.deliverableLabel}</dt>
              <dd>{card.deliverable}</dd>
            </div>
          ) : null}
          {card.boundary && copy.boundaryLabel ? (
            <div>
              <dt>{copy.boundaryLabel}</dt>
              <dd>{card.boundary}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <Link href={card.href} className="kpi-solutions-service-card-cta">
        {copy.viewDetails}
      </Link>
    </article>
  );
}
