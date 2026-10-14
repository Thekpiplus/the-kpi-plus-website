import Link from "next/link";
import { stageToneKey, type PipelineStage } from "@/components/crm/pipeline-types";
import { changeLeadStage } from "@/lib/crm/actions";
import { formatMoney, formatThaiDateTime } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";

function stageValue(stage: PipelineStage) {
  return stage.leads.reduce((sum, lead) => sum + (lead.estimatedValue ?? 0), 0);
}

export function PipelineBoard({ stages }: { stages: PipelineStage[] }) {
  const columns = Math.max(stages.length, 1);

  return (
    <div className="crm-pipe-tray">
      <div className="crm-pipe" aria-label="กระดาน Pipeline">
        <div className="crm-pipe-board" style={{ ["--pipe-cols" as string]: String(columns) }}>
          {stages.map((stage, index) => {
            const tone = stageToneKey(index + 1, stage);
            const value = stageValue(stage);
            return (
              <section
                key={stage.id}
                className="crm-pipe-col"
                data-stage-tone={tone}
                aria-label={`ลำดับขั้น ${String(index + 1).padStart(2, "0")} ${stage.nameTh}`}
              >
                <header className="crm-pipe-col-head">
                  <div className="crm-pipe-col-title">
                    <span className="crm-pipe-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2>{stage.nameTh}</h2>
                      {value > 0 ? <p>{formatMoney(value)}</p> : <p>ไม่มีมูลค่า</p>}
                    </div>
                  </div>
                  <span className="crm-pipe-count">{stage.leads.length}</span>
                </header>

                <div className="crm-pipe-col-body">
                  {stage.leads.length === 0 ? (
                    <p className="crm-pipe-empty">ว่าง</p>
                  ) : (
                    stage.leads.map((lead) => (
                      <article key={lead.id} className="crm-pipe-card" data-stage-tone={tone}>
                        <Link href={`/crm/leads/${lead.id}`} className="crm-pipe-card-main">
                          <strong>{lead.contactName}</strong>
                          <em>{lead.businessName || "ไม่มีชื่อกิจการ"}</em>
                        </Link>

                        <div className="crm-pipe-card-foot">
                          <span>{sourceLabel(lead.source)}</span>
                          <b>{formatMoney(lead.estimatedValue)}</b>
                        </div>

                        {lead.nextActivityAt ? (
                          <p className="crm-pipe-next">นัด {formatThaiDateTime(lead.nextActivityAt)}</p>
                        ) : null}

                        <form action={changeLeadStage} className="crm-pipe-move">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <label className="sr-only" htmlFor={`stage-${lead.id}`}>
                            ย้ายขั้นของ {lead.contactName}
                          </label>
                          <select
                            id={`stage-${lead.id}`}
                            className="crm-pipe-select"
                            name="stageId"
                            defaultValue={stage.id}
                          >
                            {stages.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.nameTh}
                              </option>
                            ))}
                          </select>
                          <button className="crm-pipe-move-btn" type="submit" title="ย้ายขั้น">
                            ย้าย
                          </button>
                        </form>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
