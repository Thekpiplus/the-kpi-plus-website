import {
  HOTEL_TRAINING_ASSESS_FIELDS,
  HOTEL_TRAINING_ASSESS_VISUAL,
  hotelTrainingSampleLabel,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export type HotelTrainingAssessRow = {
  id: string;
  label: string;
  meaningTh: string;
  meaningEn: string;
  evidenceTh: string;
  evidenceEn: string;
  statusTh: string;
  statusEn: string;
  sample?: boolean;
};

export function HotelTrainingAssess({
  locale,
  title,
  lead,
  note,
  caption,
  empty,
  items,
}: {
  locale: Locale;
  title: string;
  lead: string;
  note?: string;
  caption: string;
  empty: string;
  items: readonly HotelTrainingAssessRow[];
}) {
  const thai = locale === "th";
  const sample = hotelTrainingSampleLabel(locale);
  const fields = HOTEL_TRAINING_ASSESS_FIELDS;
  const label = thai ? HOTEL_TRAINING_ASSESS_VISUAL.labelTh : HOTEL_TRAINING_ASSESS_VISUAL.labelEn;
  return (
    <section id="training-assess" className="kpi-train-practice border-y border-[#E3E8EB] bg-white" aria-labelledby="training-assess-title">
      <div className="kpi-section">
        <h2 id="training-assess-title" className="kpi-h2">
          {title}
        </h2>
        <p className="kpi-train-problems-lead">{lead}</p>
        {note ? <p className="ht-gallery-note">{note}</p> : null}
        <p className="ht-status is-yellow">{sample}</p>
        <figure className="ht-assess-framework">
          <div className="ht-assess-framework-frame">
            <span className="ht-visual-badge">{sample}</span>
            <p className="ht-cycle-kicker kpi-latin">{label}</p>
            <div className="ht-assess-wrap">
              <table className="ht-assess-table">
                <caption className="sr-only">{caption}</caption>
                <thead>
                  <tr>
                    <th scope="col">{thai ? fields.signal.th : fields.signal.en}</th>
                    <th scope="col">{thai ? fields.meaning.th : fields.meaning.en}</th>
                    <th scope="col">{thai ? fields.evidence.th : fields.evidence.en}</th>
                    <th scope="col">{thai ? fields.status.th : fields.status.en}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const status = (thai ? item.statusTh : item.statusEn).trim() || empty;
                    return (
                      <tr key={item.id}>
                        <th scope="row">
                          <span className="kpi-latin">{item.label}</span>
                          {item.sample ? <span className="ht-status is-yellow">{sample}</span> : null}
                        </th>
                        <td data-label={thai ? fields.meaning.th : fields.meaning.en}>{thai ? item.meaningTh : item.meaningEn}</td>
                        <td data-label={thai ? fields.evidence.th : fields.evidence.en}>{thai ? item.evidenceTh : item.evidenceEn}</td>
                        <td data-label={thai ? fields.status.th : fields.status.en}>
                          <span className="ht-status is-yellow">{sample}</span> {status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <figcaption className="ht-visual-caption">
            <strong>{label}</strong>
            <span>{caption}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
