import {
  HOTEL_TRAINING_MATRIX_FIELDS,
  HOTEL_TRAINING_MATRIX_VISUAL,
  hotelTrainingSampleLabel,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export type HotelTrainingMatrixRow = {
  id: string;
  roleTh: string;
  roleEn: string;
  skillTh: string;
  skillEn: string;
  activityTh: string;
  activityEn: string;
  assessTh: string;
  assessEn: string;
  sample?: boolean;
};

export function HotelTrainingMatrix({
  locale,
  title,
  lead,
  note,
  caption,
  items,
}: {
  locale: Locale;
  title: string;
  lead: string;
  note?: string;
  caption: string;
  items: readonly HotelTrainingMatrixRow[];
}) {
  const thai = locale === "th";
  const sample = hotelTrainingSampleLabel(locale);
  const fields = HOTEL_TRAINING_MATRIX_FIELDS;
  const label = thai ? HOTEL_TRAINING_MATRIX_VISUAL.labelTh : HOTEL_TRAINING_MATRIX_VISUAL.labelEn;
  return (
    <section id="training-skill-matrix" className="kpi-section kpi-train-measure" aria-labelledby="training-skill-matrix-title">
      <h2 id="training-skill-matrix-title" className="kpi-h2">
        {title}
      </h2>
      <p className="kpi-train-problems-lead">{lead}</p>
      {note ? <p className="ht-gallery-note">{note}</p> : null}
      <p className="ht-status is-yellow">{sample}</p>
      <figure className="ht-skill-matrix">
        <div className="ht-skill-matrix-frame">
          <span className="ht-visual-badge">{sample}</span>
          <p className="ht-cycle-kicker kpi-latin">{label}</p>
          <div className="ht-matrix-wrap">
            <table className="ht-matrix-table">
              <caption className="sr-only">{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{thai ? fields.role.th : fields.role.en}</th>
                  <th scope="col">{thai ? fields.skill.th : fields.skill.en}</th>
                  <th scope="col">{thai ? fields.activity.th : fields.activity.en}</th>
                  <th scope="col">{thai ? fields.assess.th : fields.assess.en}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <span className="kpi-latin">{thai ? item.roleTh : item.roleEn}</span>
                      {item.sample ? <span className="ht-status is-yellow">{sample}</span> : null}
                    </th>
                    <td data-label={thai ? fields.skill.th : fields.skill.en}>{thai ? item.skillTh : item.skillEn}</td>
                    <td data-label={thai ? fields.activity.th : fields.activity.en}>{thai ? item.activityTh : item.activityEn}</td>
                    <td data-label={thai ? fields.assess.th : fields.assess.en}>{thai ? item.assessTh : item.assessEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <figcaption className="ht-visual-caption">
          <strong>{label}</strong>
          <span>{caption}</span>
        </figcaption>
      </figure>
    </section>
  );
}
