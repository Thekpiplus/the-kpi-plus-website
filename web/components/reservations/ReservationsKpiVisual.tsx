import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import { ReservationKpiChart } from "@/components/reservations/ReservationKpiChart";
import {
  RESERVATIONS_KPI_LABEL,
  RESERVATIONS_KPI_VISUAL,
  reservationKpiLatestUpdatedAt,
  reservationKpiPublicChart,
  reservationsVisualAlt,
  type ReservationKpi,
  type ReservationsVisualOverride,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationsKpiVisualProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
  kpis?: ReservationKpi[];
  sampleLabel?: string;
  override?: ReservationsVisualOverride;
};

export function ReservationsKpiVisual({ locale, src, kpis, sampleLabel, override }: ReservationsKpiVisualProps) {
  const visual = RESERVATIONS_KPI_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight } = visual;
  const status = override?.status ?? visual.status;
  const alt = override?.alt || reservationsVisualAlt(visual, locale);
  const label = override?.label || RESERVATIONS_KPI_LABEL;
  const resolvedSample = sampleLabel || (locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data");
  const chart = reservationKpiPublicChart(kpis);
  const updated = reservationKpiLatestUpdatedAt(kpis);
  const thai = locale === "th";
  const subtitle = thai
    ? "ตัวชี้วัดงานจองที่วัดได้จากช่องทางและระบบของโรงแรม"
    : "Reservation metrics the hotel’s channels and systems can measure";
  const disclaimer = thai
    ? "ตัวอย่างโครงตัวชี้วัด ไม่ใช่ผลลัพธ์ของโรงแรม และไม่มีค่า SLA"
    : "Sample KPI frame. Not hotel results, and no SLA values.";
  const periodLabel = thai
    ? "รายเดือน เมื่อช่องทางและระบบของโรงแรมมีข้อมูล"
    : "Monthly, when the hotel’s channels and systems provide the data";

  if (src) {
    return (
      <div className="kpi-reservations-kpi-visual">
        <ReservationDummyImage
          className="kpi-reservations-kpi-visual-photo"
          src={src}
          alt={alt}
          label={label}
          recommendedSize={recommendedSize}
          ratio={aspectRatio}
          fit="contain"
          locale={locale}
          status={status}
          width={width}
          height={height}
          sampleLabel={resolvedSample}
        />
        <p className="kpi-reservations-kpi-visual-caption">{label}</p>
      </div>
    );
  }

  return (
    <div className="kpi-reservations-kpi-visual">
      <ReservationKpiChart
        title="Reservation Operations KPI"
        subtitle={subtitle}
        labels={chart?.labels ?? []}
        series={chart?.series ?? []}
        unit={chart?.unit}
        empty={!chart}
        statusLabel={resolvedSample}
        periodLabel={periodLabel}
        axisXLabel={thai ? "ช่วงวัด" : "Measurement period"}
        axisYLabel={thai ? "ค่า" : "Value"}
        updatedLabel={updated ? `${thai ? "อัปเดต" : "Updated"} ${updated}` : undefined}
        disclaimer={disclaimer}
      />
      <p className="kpi-reservations-kpi-visual-caption">{label}</p>
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </div>
  );
}
