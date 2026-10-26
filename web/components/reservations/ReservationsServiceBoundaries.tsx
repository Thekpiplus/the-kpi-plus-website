import Link from "next/link";
import {
  reservationBoundaryIncomplete,
  reservationBoundaryPublicFields,
  reservationConfiguredItems,
  type ReservationServiceBoundaries,
} from "@/lib/reservations";
import { RESERVATIONS_BOUNDARIES_EDIT_HREF } from "@/lib/cms/reservations-boundaries";
import type { Locale } from "@/lib/seo";
import "./reservations-ops.css";

export function ReservationsServiceBoundaries({
  locale,
  boundaries,
  admin = false,
}: {
  locale: Locale;
  boundaries: ReservationServiceBoundaries;
  admin?: boolean;
}) {
  const thai = locale === "th";
  const handles = reservationConfiguredItems(boundaries.handles);
  const hotelOwns = reservationConfiguredItems(boundaries.hotelOwns);
  const fields = reservationBoundaryPublicFields(boundaries, locale);
  const missing = admin ? reservationBoundaryIncomplete(boundaries) : [];
  const hasPublicContent = handles.length > 0 || hotelOwns.length > 0 || fields.length > 0;

  if (!hasPublicContent && !admin) return null;

  return (
    <section id="reservations-boundaries" className="kpi-reservations-boundaries" aria-labelledby="reservations-boundaries-heading">
      <p className="kpi-reservations-boundaries-kicker kpi-latin">SERVICE BOUNDARIES</p>
      <h3 id="reservations-boundaries-heading" className="kpi-h2 kpi-reservations-boundaries-title">
        {thai ? "เส้นแบ่งงาน Reservations" : "Reservation service boundaries"}
      </h3>
      <p className="kpi-reservations-boundaries-lead">
        {thai
          ? "ขอบเขตจริงขึ้นกับข้อตกลงของแต่ละโรงแรม รายการด้านล่างแสดงเฉพาะงานและการตั้งค่าที่ถูกกำหนดแล้ว"
          : "The live split follows each hotel’s agreement. Only configured work and settings are shown here."}
      </p>

      {missing.length ? (
        <p className="kpi-reservations-boundaries-admin" role="status">
          <span className="kpi-latin">Admin</span>
          {thai ? " ฟิลด์ที่จำเป็นยังไม่ครบ: " : " Incomplete required fields: "}
          {missing.join(" · ")}
          <Link href={RESERVATIONS_BOUNDARIES_EDIT_HREF}>{thai ? "แก้ไขใน CMS" : "Edit in CMS"}</Link>
        </p>
      ) : null}

      {handles.length || hotelOwns.length ? (
        <div className={`kpi-reservations-boundaries-grid${handles.length && hotelOwns.length ? "" : " is-single"}`}>
          {handles.length ? (
            <article className="kpi-reservations-boundaries-col is-kpi">
              <h3>
                {thai ? "The KPI Plus ดูแล เมื่อถูกกำหนดแล้ว" : "The KPI Plus handles, only when configured"}
              </h3>
              <ul>
                {handles.map((item) => (
                  <li key={item.id} className="kpi-latin">
                    {item.label}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
          {hotelOwns.length ? (
            <article className="kpi-reservations-boundaries-col is-hotel">
              <h3>
                {thai ? "โรงแรมอนุมัติหรือเป็นเจ้าของ เมื่อถูกกำหนดแล้ว" : "The hotel approves or owns, only when configured"}
              </h3>
              <ul>
                {hotelOwns.map((item) => (
                  <li key={item.id} className="kpi-latin">
                    {item.label}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      ) : null}

      {fields.length ? (
        <dl className="kpi-reservations-boundaries-fields">
          {fields.map((field) => (
            <div key={field.id}>
              <dt>{thai ? field.labelTh : field.labelEn}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
