import {
  HOTEL_TRAINING_PROGRAM_FIELDS,
  HOTEL_TRAINING_PROGRAM_FORMATS,
  HOTEL_TRAINING_PROGRAM_VISUAL,
  hotelTrainingSampleLabel,
  type HotelTrainingProgramFormatId,
} from "@/lib/hotel-training";
import { hotelTrainingPublicHref } from "@/lib/cms/hotel-training-page-public";
import type { Locale } from "@/lib/seo";

export type HotelTrainingProgramCard = {
  id: string;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  audienceTh: string;
  audienceEn: string;
  problemTh: string;
  problemEn: string;
  outcomes: ReadonlyArray<{ th: string; en: string }>;
  formats: readonly string[];
  durationTh?: string;
  durationEn?: string;
  durationVerified?: boolean;
  groupSizeTh?: string;
  groupSizeEn?: string;
  groupSizeVerified?: boolean;
  activityTh: string;
  activityEn: string;
  assessTh: string;
  assessEn: string;
  href: string;
  ctaTh: string;
  ctaEn: string;
  sample?: boolean;
};

function formatLabel(id: string, thai: boolean) {
  const format = HOTEL_TRAINING_PROGRAM_FORMATS[id as HotelTrainingProgramFormatId];
  if (!format) return "";
  return thai ? format.th : format.en;
}

function ProgramIcon({ id }: { id: string }) {
  return (
    <svg className="ht-program-icon" viewBox="0 0 360 240" aria-hidden="true" focusable="false">
      <rect width="360" height="240" rx="16" fill="#0B1F33" />
      <rect x="16" y="16" width="328" height="208" rx="12" fill="#071C30" stroke="#A2DC25" strokeOpacity="0.35" />
      {id === "service" ? (
        <>
          <circle cx="180" cy="100" r="36" fill="#0B6660" />
          <path d="M156 100h48M180 76v48" stroke="#EBE722" strokeWidth="8" strokeLinecap="round" />
        </>
      ) : null}
      {id === "commercial" ? (
        <>
          <rect x="118" y="120" width="28" height="40" rx="4" fill="#0B6660" />
          <rect x="166" y="96" width="28" height="64" rx="4" fill="#A2DC25" />
          <rect x="214" y="76" width="28" height="84" rx="4" fill="#EBE722" />
        </>
      ) : null}
      {id === "teambuilding" ? (
        <>
          <circle cx="148" cy="100" r="22" fill="#0B6660" />
          <circle cx="212" cy="100" r="22" fill="#A2DC25" />
          <circle cx="180" cy="140" r="22" fill="#EBE722" />
        </>
      ) : null}
      {id === "leadership" ? (
        <>
          <rect x="132" y="78" width="96" height="64" rx="12" fill="#0B6660" />
          <circle cx="164" cy="110" r="10" fill="#EBE722" />
          <circle cx="196" cy="110" r="10" fill="#A2DC25" />
        </>
      ) : null}
      {id === "digital" ? (
        <>
          <rect x="128" y="78" width="104" height="72" rx="10" fill="#0B6660" />
          <rect x="148" y="96" width="64" height="8" rx="4" fill="#EBE722" />
          <rect x="148" y="114" width="40" height="8" rx="4" fill="#A2DC25" />
          <circle cx="232" cy="78" r="10" fill="#EBE722" />
        </>
      ) : null}
      {id === "academy" ? (
        <>
          <rect x="124" y="84" width="112" height="72" rx="8" fill="#0B6660" />
          <path d="M136 100h88L212 140H136z" fill="#EBE722" />
          <rect x="168" y="108" width="44" height="8" rx="4" fill="#0B1F33" />
        </>
      ) : null}
    </svg>
  );
}

export function HotelTrainingPrograms({
  locale,
  items,
}: {
  locale: Locale;
  items: readonly HotelTrainingProgramCard[];
}) {
  const thai = locale === "th";
  const fields = HOTEL_TRAINING_PROGRAM_FIELDS;
  const sample = hotelTrainingSampleLabel(locale);
  return (
    <ul className="ht-programs">
      {items.map((item) => {
        const href = hotelTrainingPublicHref(item.href, locale, "#training-enquiry");
        const external = /^https?:\/\//i.test(href);
        const duration = item.durationVerified ? (thai ? item.durationTh : item.durationEn) : "";
        const groupSize = item.groupSizeVerified ? (thai ? item.groupSizeTh : item.groupSizeEn) : "";
        const formats = item.formats.map((id) => formatLabel(id, thai)).filter(Boolean);
        const cta = thai ? item.ctaTh : item.ctaEn;
        return (
          <li key={item.id} className="ht-program">
            <article>
              <div className="ht-program-visual">
                <span className="ht-visual-badge">{item.sample ? (thai ? "ตัวอย่าง" : "Sample") : sample}</span>
                <ProgramIcon id={item.id} />
                <p className="ht-program-visual-label">
                  {thai ? HOTEL_TRAINING_PROGRAM_VISUAL.labelTh : HOTEL_TRAINING_PROGRAM_VISUAL.labelEn}
                </p>
              </div>
              <p className="ht-program-category kpi-latin">{thai ? item.categoryTh : item.categoryEn}</p>
              <h3>{thai ? item.titleTh : item.titleEn}</h3>
              {formats.length ? (
                <ul className="ht-program-formats">
                  {formats.map((format) => (
                    <li key={format} className="kpi-latin">
                      {format}
                    </li>
                  ))}
                </ul>
              ) : null}
              <dl>
                <div>
                  <dt>{thai ? fields.audience.th : fields.audience.en}</dt>
                  <dd>{thai ? item.audienceTh : item.audienceEn}</dd>
                </div>
                <div>
                  <dt>{thai ? fields.problem.th : fields.problem.en}</dt>
                  <dd>{thai ? item.problemTh : item.problemEn}</dd>
                </div>
                <div>
                  <dt>{thai ? fields.outcomes.th : fields.outcomes.en}</dt>
                  <dd>
                    <ol>
                      {(thai ? item.outcomes.map((row) => row.th) : item.outcomes.map((row) => row.en))
                        .filter((row) => row.trim())
                        .map((row) => (
                          <li key={row}>{row}</li>
                        ))}
                    </ol>
                  </dd>
                </div>
                {duration?.trim() ? (
                  <div>
                    <dt>{thai ? fields.duration.th : fields.duration.en}</dt>
                    <dd>{duration.trim()}</dd>
                  </div>
                ) : null}
                {groupSize?.trim() ? (
                  <div>
                    <dt>{thai ? fields.groupSize.th : fields.groupSize.en}</dt>
                    <dd>{groupSize.trim()}</dd>
                  </div>
                ) : null}
                {(thai ? item.activityTh : item.activityEn).trim() ? (
                  <div>
                    <dt>{thai ? fields.activity.th : fields.activity.en}</dt>
                    <dd>{thai ? item.activityTh : item.activityEn}</dd>
                  </div>
                ) : null}
                {(thai ? item.assessTh : item.assessEn).trim() ? (
                  <div>
                    <dt>{thai ? fields.assess.th : fields.assess.en}</dt>
                    <dd>{thai ? item.assessTh : item.assessEn}</dd>
                  </div>
                ) : null}
              </dl>
              {cta.trim() && href.trim() ? (
                <a
                  className="ht-program-cta"
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {cta.trim()}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
