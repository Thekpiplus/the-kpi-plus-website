import Link from "next/link";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { PipelineCalendar } from "@/components/crm/PipelineCalendar";
import { PipelineTable } from "@/components/crm/PipelineTable";
import { parsePipelineView, stageToneKey } from "@/components/crm/pipeline-types";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { PipelineViewSwitch } from "@/components/crm/ui/PipelineViewSwitch";
import { formatMoney, pipelineData } from "@/lib/crm/queries";

function monthKeyNow() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; month?: string }>;
}) {
  const params = await searchParams;
  const view = parsePipelineView(params.view);
  const month = params.month && /^\d{4}-\d{2}$/.test(params.month) ? params.month : monthKeyNow();
  const stages = await pipelineData();
  const total = stages.reduce((sum, stage) => sum + stage.leads.length, 0);
  const openCount = stages
    .filter((stage) => !stage.isWon && !stage.isLost)
    .reduce((sum, stage) => sum + stage.leads.length, 0);
  const wonCount = stages.filter((stage) => stage.isWon).reduce((sum, stage) => sum + stage.leads.length, 0);
  const pipelineValue = stages
    .filter((stage) => !stage.isLost)
    .reduce(
      (sum, stage) => sum + stage.leads.reduce((inner, lead) => inner + (lead.estimatedValue ?? 0), 0),
      0,
    );

  const description =
    view === "table"
      ? "ดูลีดทั้งท่อในตาราง เรียงตามลำดับขั้น และย้ายขั้นได้จากแถว"
      : view === "calendar"
        ? "ดูนัดติดตามรายเดือน เปิดลีดจากวันที่มีนัด"
        : "ติดตามลีดตามขั้นขาย เปิดรายละเอียด หรือย้ายขั้นจากบัตรได้ทันที";

  return (
    <div className="crm-leads crm-pipe-page">
      <PageHeader
        eyebrow="Lead Management"
        title="Pipeline"
        description={description}
        actions={
          <div className="crm-leads-actions">
            <Link href="/crm/sales" className="crm-users-secondary">
              งานวันนี้
            </Link>
            <Link href="/crm/leads" className="crm-users-secondary">
              ลีดทั้งหมด
            </Link>
            <NewLeadOpenButton className="kpi-button">คีย์ลีด</NewLeadOpenButton>
          </div>
        }
      />

      <section className="crm-pipe-bar" aria-label="สรุป Pipeline">
        <div className="crm-pipe-bar-top">
          <div className="crm-pipe-metrics">
            <div>
              <span>ลีดทั้งหมด</span>
              <strong>{total}</strong>
            </div>
            <div>
              <span>กำลังติดตาม</span>
              <strong>{openCount}</strong>
            </div>
            <div>
              <span>ปิดได้</span>
              <strong>{wonCount}</strong>
            </div>
            <div className="is-value">
              <span>มูลค่ารวม</span>
              <strong>{formatMoney(pipelineValue)}</strong>
            </div>
          </div>
          <PipelineViewSwitch view={view} month={month} />
        </div>

        {view !== "calendar" ? (
          <ol className="crm-pipe-steps" aria-label="ลำดับขั้นใน Pipeline">
            {stages.map((stage, index) => (
              <li key={stage.id} data-stage-tone={stageToneKey(index + 1, stage)}>
                <i className="crm-pipe-stage-bar" aria-hidden="true" />
                <span>{stage.nameTh}</span>
                <b>{stage.leads.length}</b>
              </li>
            ))}
          </ol>
        ) : null}
      </section>

      {view === "table" ? (
        <PipelineTable stages={stages} />
      ) : view === "calendar" ? (
        <PipelineCalendar stages={stages} month={month} />
      ) : (
        <PipelineBoard stages={stages} />
      )}
    </div>
  );
}
