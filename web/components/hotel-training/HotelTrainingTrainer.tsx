import {
  HOTEL_TRAINING_TRAINER_FIELDS,
  HOTEL_TRAINING_TRAINER_VISUAL,
  hotelTrainingSampleLabel,
  hotelTrainingTrainerPublicSrc,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export type HotelTrainingTrainerProfile = {
  title: string;
  lead?: string;
  note?: string;
  name: string;
  nameEn: string;
  roleTh: string;
  roleEn: string;
  experienceTh: string;
  experienceEn: string;
  topics: ReadonlyArray<{ th: string; en: string }>;
  formatTh: string;
  formatEn: string;
  engagementsTh: string;
  engagementsEn: string;
  qualificationsTh: string;
  qualificationsEn: string;
  languagesTh: string;
  languagesEn: string;
  bioTh?: string;
  bioEn?: string;
  src?: string;
  altTh: string;
  altEn: string;
  status?: string;
  publicationApproved?: boolean;
  sample?: boolean;
};

function pickLocale(thai: boolean, th: string, en: string) {
  return (thai ? th : en).trim();
}

export function HotelTrainingTrainer({ locale, trainer }: { locale: Locale; trainer: HotelTrainingTrainerProfile }) {
  const thai = locale === "th";
  const sample = hotelTrainingSampleLabel(locale);
  const src = hotelTrainingTrainerPublicSrc(trainer);
  const placeholder = src === HOTEL_TRAINING_TRAINER_VISUAL.src;
  const label = thai ? HOTEL_TRAINING_TRAINER_VISUAL.labelTh : HOTEL_TRAINING_TRAINER_VISUAL.labelEn;
  const caption = placeholder
    ? thai
      ? HOTEL_TRAINING_TRAINER_VISUAL.captionTh
      : HOTEL_TRAINING_TRAINER_VISUAL.captionEn
    : pickLocale(thai, trainer.altTh, trainer.altEn);
  const alt = placeholder
    ? thai
      ? HOTEL_TRAINING_TRAINER_VISUAL.altTh
      : HOTEL_TRAINING_TRAINER_VISUAL.altEn
    : pickLocale(thai, trainer.altTh, trainer.altEn) || (thai ? HOTEL_TRAINING_TRAINER_VISUAL.altTh : HOTEL_TRAINING_TRAINER_VISUAL.altEn);
  const name = trainer.name.trim();
  const nameEn = trainer.nameEn.trim();
  const topics = trainer.topics.map((item) => pickLocale(thai, item.th, item.en)).filter(Boolean);
  const fields = [
    { id: "role", label: thai ? HOTEL_TRAINING_TRAINER_FIELDS.role.th : HOTEL_TRAINING_TRAINER_FIELDS.role.en, value: pickLocale(thai, trainer.roleTh, trainer.roleEn) },
    { id: "experience", label: thai ? HOTEL_TRAINING_TRAINER_FIELDS.experience.th : HOTEL_TRAINING_TRAINER_FIELDS.experience.en, value: pickLocale(thai, trainer.experienceTh, trainer.experienceEn) },
    { id: "format", label: thai ? HOTEL_TRAINING_TRAINER_FIELDS.format.th : HOTEL_TRAINING_TRAINER_FIELDS.format.en, value: pickLocale(thai, trainer.formatTh, trainer.formatEn) },
    { id: "engagements", label: thai ? HOTEL_TRAINING_TRAINER_FIELDS.engagements.th : HOTEL_TRAINING_TRAINER_FIELDS.engagements.en, value: pickLocale(thai, trainer.engagementsTh, trainer.engagementsEn) },
    { id: "qualifications", label: thai ? HOTEL_TRAINING_TRAINER_FIELDS.qualifications.th : HOTEL_TRAINING_TRAINER_FIELDS.qualifications.en, value: pickLocale(thai, trainer.qualificationsTh, trainer.qualificationsEn) },
    { id: "languages", label: thai ? HOTEL_TRAINING_TRAINER_FIELDS.languages.th : HOTEL_TRAINING_TRAINER_FIELDS.languages.en, value: pickLocale(thai, trainer.languagesTh, trainer.languagesEn) },
  ].filter((item) => item.value);
  const hasPerson = Boolean(name || nameEn || fields.length || topics.length);

  return (
    <section id="training-trainer" className="kpi-section kpi-train-nate" aria-labelledby="training-trainer-title">
      <div className="kpi-train-nate-grid ht-trainer-profile">
        <figure className="kpi-train-nate-media ht-trainer-media">
          <span className="ht-visual-badge">{placeholder ? sample : thai ? "อนุมัติแล้ว" : "Approved"}</span>
          <img
            src={src}
            alt={alt}
            width={HOTEL_TRAINING_TRAINER_VISUAL.displayWidth}
            height={HOTEL_TRAINING_TRAINER_VISUAL.displayHeight}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="ht-visual-caption">
            <strong>{placeholder ? label : name || nameEn}</strong>
            <span>{caption}</span>
          </figcaption>
        </figure>
        <div className="kpi-train-nate-copy">
          <p className="kpi-latin kpi-train-nate-eyebrow">Facilitator</p>
          <h2 id="training-trainer-title" className="kpi-h2">
            {trainer.title}
          </h2>
          {trainer.lead ? <p className="kpi-train-problems-lead">{trainer.lead}</p> : null}
          {trainer.note ? <p className="ht-gallery-note">{trainer.note}</p> : null}
          <p className="ht-status is-yellow">{sample}</p>
          {hasPerson ? (
            <>
              {name ? <p className="kpi-train-nate-name">{name}</p> : null}
              {nameEn ? <p className="kpi-latin kpi-train-nate-name-en">{nameEn}</p> : null}
              {pickLocale(thai, trainer.bioTh || "", trainer.bioEn || "") ? <p className="kpi-train-nate-body">{pickLocale(thai, trainer.bioTh || "", trainer.bioEn || "")}</p> : null}
              {topics.length ? (
                <ul className="kpi-train-nate-labels">
                  {topics.map((topic) => (
                    <li key={topic} className="kpi-latin">
                      {topic}
                    </li>
                  ))}
                </ul>
              ) : null}
              {fields.length ? (
                <dl className="ht-trainer-fields">
                  {fields.map((item) => (
                    <div key={item.id}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </>
          ) : (
            <p className="kpi-train-nate-body">{thai ? "รายละเอียดวิทยากรแสดงเมื่อมีข้อมูลที่อนุมัติ" : "Facilitator details appear when verified information is approved."}</p>
          )}
        </div>
      </div>
    </section>
  );
}
