import Link from "next/link";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { PipelineCalendar } from "@/components/crm/PipelineCalendar";
import { PipelineTable } from "@/components/crm/PipelineTable";
import { LeadsPageChrome } from "@/components/crm/leads/LeadsPageChrome";
import { parsePipelineView, stageToneKey } from "@/components/crm/pipeline-types";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
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
      ? "ติดตามลีดตามขั้นขายในตาราง และย้ายขั้นได้จากแต่ละแถว"
      : view === "calendar"
        ? "ดูนัดติดตามรายเดือน แล้วเปิดลีดจากวันที่เกี่ยวข้อง"
        : "ติดตามลีดตามขั้นแบบคานบัน เปิดรายละเอียดหรือย้ายขั้นจากบัตร";

  return (
    <LeadsPageChrome
      tab="pipeline"
      title="Pipeline"
      description={description}
      actions={
        <>
          <NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>
          <Link href="/crm/sales" className="kpi-leads-btn-secondary">
            งานวันนี้
          </Link>
        </>
      }
    >
      <div className="crm-leads crm-pipe-page kpi-leads-pipe">
      <section className="kpi-leads-kpi" aria-label="สรุป Pipeline">
        <div className="kpi-leads-stat is-static">
          <span className="kpi-leads-stat-label">ลีดทั้งหมด</span>
          <strong className="kpi-leads-stat-value">{total}</strong>
          <span className="kpi-leads-stat-hint">ใน Pipeline</span>
        </div>
        <div className="kpi-leads-stat is-today is-static">
          <span className="kpi-leads-stat-label">กำลังติดตาม</span>
          <strong className="kpi-leads-stat-value">{openCount}</strong>
          <span className="kpi-leads-stat-hint">ยังไม่ปิด</span>
        </div>
        <div className="kpi-leads-stat is-new is-static">
          <span className="kpi-leads-stat-label">ปิดได้</span>
          <strong className="kpi-leads-stat-value">{wonCount}</strong>
          <span className="kpi-leads-stat-hint">ขั้นชนะ</span>
        </div>
        <div className="kpi-leads-stat is-waiting is-static">
          <span className="kpi-leads-stat-label">มูลค่ารวม</span>
          <strong className="kpi-leads-stat-value">{formatMoney(pipelineValue)}</strong>
          <span className="kpi-leads-stat-hint">ไม่รวมขั้นแพ้</span>
        </div>
      </section>

      <section className="crm-pipe-toolbar" aria-label="มุมมองและขั้น Pipeline">
        <div className="crm-pipe-toolbar-row">
          <div className="crm-pipe-toolbar-copy">
            <h2 className="crm-pipe-toolbar-title">รายการ Pipeline</h2>
            <p className="crm-pipe-toolbar-desc">
              {view === "table" ? "มุมมองตาราง" : view === "calendar" ? "มุมมองปฏิทิน" : "มุมมองคานบัน"}
              {total > 0 ? ` · ${total} รายการ` : " · ยังไม่มีลีด"}
            </p>
          </div>
          <PipelineViewSwitch view={view} month={month} />
        </div>

        {view !== "calendar" ? (
          <ol className="crm-pipe-steps" aria-label="จำนวนลีดตามขั้น">
            {stages.map((stage, index) => (
              <li key={stage.id} data-stage-tone={stageToneKey(index + 1, stage)}>
                <i className="crm-pipe-stage-bar" aria-hidden="true" />
                <span>{stage.nameTh}</span>
                <b>
                  <span className="sr-only">จำนวน </span>
                  {stage.leads.length}
                </b>
              </li>
            ))}
          </ol>
        ) : null}
      </section>

      <section className="crm-pipe-main" aria-label="ข้อมูล Pipeline">
        {total === 0 && view !== "calendar" ? (
          <EmptyState
            title="ยังไม่มีลีดใน Pipeline"
            body="คีย์ลีดใหม่ หรือเปิดรายการลีดทั้งหมดเพื่อเริ่มติดตาม"
            compact
            action={<NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>}
          />
        ) : view === "table" ? (
          <PipelineTable stages={stages} />
        ) : view === "calendar" ? (
          <PipelineCalendar stages={stages} month={month} />
        ) : (
          <PipelineBoard stages={stages} />
        )}
      </section>
      </div>
    </LeadsPageChrome>
  );
}
