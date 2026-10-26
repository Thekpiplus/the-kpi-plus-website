import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import { ReservationKpiChart } from "@/components/reservations/ReservationKpiChart";
import {
  RESERVATIONS_KPI_LABEL,
  RESERVATIONS_KPI_VISUAL,
  reservationKpiLatestUpdatedAt,
  reservationKpiPublicChart,
  reservationsVisualAlt,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationsKpiVisualProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
};

export function ReservationsKpiVisual({ locale, src }: ReservationsKpiVisualProps) {
  const visual = RESERVATIONS_KPI_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight, status } = visual;
  const alt = reservationsVisualAlt(visual, locale);
  const sampleLabel = locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data";
  const chart = reservationKpiPublicChart();
  const updated = reservationKpiLatestUpdatedAt();
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
          label={RESERVATIONS_KPI_LABEL}
          recommendedSize={recommendedSize}
          ratio={aspectRatio}
          fit="contain"
          locale={locale}
          status={status}
          width={width}
          height={height}
          sampleLabel={sampleLabel}
        />
        <p className="kpi-reservations-kpi-visual-caption">{RESERVATIONS_KPI_LABEL}</p>
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
        statusLabel={sampleLabel}
        periodLabel={periodLabel}
        axisXLabel={thai ? "ช่วงวัด" : "Measurement period"}
        axisYLabel={thai ? "ค่า" : "Value"}
        updatedLabel={updated ? `${thai ? "อัปเดต" : "Updated"} ${updated}` : undefined}
        disclaimer={disclaimer}
      />
      <p className="kpi-reservations-kpi-visual-caption">{RESERVATIONS_KPI_LABEL}</p>
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </div>
  );
}
