"use client";

import Link from "next/link";
import { Fragment, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeLeadStage } from "@/lib/crm/actions";
import {
  formatBaht,
  type PipelineBoardView,
  type PipelineDeal,
  type PipelineSort,
  type PipelineStageOption,
  type PipelineStatFilter,
} from "@/components/crm/pipeline/pipeline-types-ui";
import "./pipeline-a.css";

function hrefPipeline(next: {
  view?: PipelineBoardView;
  q?: string;
  stageId?: string;
  sort?: PipelineSort;
  risk?: boolean;
  stat?: PipelineStatFilter;
}) {
  const params = new URLSearchParams();
  if (next.view && next.view !== "table") params.set("view", next.view);
  if (next.q?.trim()) params.set("q", next.q.trim());
  if (next.stageId) params.set("stageId", next.stageId);
  if (next.sort && next.sort !== "risk") params.set("sort", next.sort);
  if (next.risk) params.set("risk", "1");
  if (next.stat && next.stat !== "all") params.set("stat", next.stat);
  const value = params.toString();
  return value ? `/crm/pipeline?${value}` : "/crm/pipeline";
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

/** Distinct soft fill per pipeline stage for funnel + chips */
function stageToneClass(stage: { sortOrder: number; isWon: boolean; isLost: boolean }) {
  if (stage.isWon) return "tone-won";
  if (stage.isLost) return "tone-lost";
  const tones = ["tone-1", "tone-2", "tone-3", "tone-4", "tone-5", "tone-6"] as const;
  return tones[(Math.max(stage.sortOrder, 1) - 1) % tones.length];
}

const STAGE_FILL: Record<string, string> = {
  "tone-1": "#2563EB",
  "tone-2": "#38BDF8",
  "tone-3": "#D4E813",
  "tone-4": "#EBE722",
  "tone-5": "#EA580C",
  "tone-6": "#7C3AED",
  "tone-won": "#16A34A",
  "tone-lost": "#E11D48",
};

function stageFill(stage: { sortOrder: number; isWon: boolean; isLost: boolean }) {
  return STAGE_FILL[stageToneClass(stage)] ?? "#94A3B8";
}

export function PipelineWorkspace({
  deals: initialDeals,
  stages,
  view,
  q: initialQ,
  stageId: initialStageId,
  sort: initialSort,
  riskOnly: initialRisk,
  stat: initialStat,
}: {
  deals: PipelineDeal[];
  stages: PipelineStageOption[];
  view: PipelineBoardView;
  q: string;
  stageId: string;
  sort: PipelineSort;
  riskOnly: boolean;
  stat: PipelineStatFilter;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQ);
  const [openId, setOpenId] = useState<string | null>(null);
  const [boardSelected, setBoardSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [lostReason, setLostReason] = useState("");

  const totals = useMemo(() => {
    const open = initialDeals.filter((d) => !d.isWon && !d.isLost);
    const contacting = open.filter((d) => d.stageIndex > 1);
    const won = initialDeals.filter((d) => d.isWon);
    const value = open.reduce((sum, d) => sum + (d.estimatedValue ?? 0), 0);
    const risk = open.filter((d) => d.risk === "high").length;
    return {
      all: initialDeals.length,
      contacting: contacting.length,
      won: won.length,
      value,
      risk,
      open: open.length,
    };
  }, [initialDeals]);

  const stageStats = useMemo(() => {
    return stages.map((stage) => {
      const rows = initialDeals.filter((d) => d.stageId === stage.id);
      const value = rows
        .filter((d) => !d.isLost)
        .reduce((sum, d) => sum + (d.estimatedValue ?? 0), 0);
      return { ...stage, count: rows.length, value };
    });
  }, [initialDeals, stages]);

  const chartMax = Math.max(1, ...stageStats.map((s) => s.count));
  const dealTotal = Math.max(1, stageStats.reduce((sum, stage) => sum + stage.count, 0));

  const donutStyle = useMemo(() => {
    const total = stageStats.reduce((sum, stage) => sum + stage.count, 0);
    if (total <= 0) return { background: "conic-gradient(#eef1ee 0 100%)" };
    let cursor = 0;
    const parts: string[] = [];
    for (const stage of stageStats) {
      if (stage.count <= 0) continue;
      const start = cursor;
      const end = cursor + (stage.count / total) * 100;
      parts.push(`${stageFill(stage)} ${start}% ${end}%`);
      cursor = end;
    }
    if (cursor < 100) parts.push(`#eef1ee ${cursor}% 100%`);
    return { background: `conic-gradient(${parts.join(", ")})` };
  }, [stageStats]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let rows = initialDeals.filter((deal) => {
      if (initialStageId && deal.stageId !== initialStageId) return false;
      if (initialRisk && deal.risk !== "high") return false;
      if (initialStat === "contacting" && (deal.isWon || deal.isLost || deal.stageIndex <= 1)) {
        return false;
      }
      if (initialStat === "won" && !deal.isWon) return false;
      if (initialStat === "valued" && !(deal.estimatedValue && deal.estimatedValue > 0)) {
        return false;
      }
      if (!needle) return true;
      const hay = `${deal.contactName} ${deal.businessName} ${deal.sourceLabel} ${deal.id}`.toLowerCase();
      return hay.includes(needle);
    });

    const riskRank = { high: 0, medium: 1, low: 2 };
    rows = [...rows].sort((a, b) => {
      if (initialSort === "value") {
        return (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0);
      }
      if (initialSort === "chance") {
        return b.chance - a.chance;
      }
      const riskDiff = riskRank[a.risk] - riskRank[b.risk];
      if (riskDiff !== 0) return riskDiff;
      const aDue = a.nextActivityAt ? new Date(a.nextActivityAt).getTime() : Number.POSITIVE_INFINITY;
      const bDue = b.nextActivityAt ? new Date(b.nextActivityAt).getTime() : Number.POSITIVE_INFINITY;
      return aDue - bDue;
    });
    return rows;
  }, [initialDeals, initialRisk, initialSort, initialStageId, initialStat, query]);

  function pushState(patch: Partial<{
    view: PipelineBoardView;
    q: string;
    stageId: string;
    sort: PipelineSort;
    risk: boolean;
    stat: PipelineStatFilter;
  }>) {
    const nextStageId =
      patch.stageId !== undefined ? patch.stageId : initialStageId;
    router.push(
      hrefPipeline({
        view: patch.view ?? view,
        q: patch.q ?? query,
        stageId: nextStageId || undefined,
        sort: patch.sort ?? initialSort,
        risk: patch.risk ?? initialRisk,
        stat: patch.stat ?? initialStat,
      }),
    );
  }

  function nextStageFor(deal: PipelineDeal) {
    const idx = stages.findIndex((s) => s.id === deal.stageId);
    if (idx < 0 || idx >= stages.length - 1) return null;
    const next = stages[idx + 1];
    if (next.isLost) return stages.find((s) => s.isWon) ?? next;
    return next;
  }

  function wonStage() {
    return stages.find((s) => s.isWon) ?? null;
  }

  function lostStage() {
    return stages.find((s) => s.isLost) ?? null;
  }

  function moveDeal(deal: PipelineDeal, stageId: string, reason = "") {
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return;
    if (stage.isLost && !reason.trim()) {
      setError("กรอกเหตุผลสั้น ๆ ก่อนทำเครื่องหมายไม่สำเร็จ");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("leadId", deal.id);
    formData.set("stageId", stageId);
    if (reason.trim()) formData.set("outcomeReason", reason.trim());

    startTransition(async () => {
      try {
        const result = await changeLeadStage(formData);
        if (!result || !("ok" in result) || !result.ok) {
          const code = result && "error" in result ? String(result.error) : "";
          setError(
            code === "lost_reason_required"
              ? "กรอกเหตุผลก่อนปิดเป็นไม่สำเร็จ"
              : "ย้ายขั้นไม่สำเร็จ ลองใหม่อีกครั้ง",
          );
          return;
        }
        setNotice(`เลื่อนขั้นแล้ว: ${deal.contactName} → ${stage.nameTh}`);
        setOpenId(null);
        setBoardSelected(null);
        setLostReason("");
        router.refresh();
      } catch {
        setError("ย้ายขั้นไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    });
  }

  const detailDeal =
    filtered.find((d) => d.id === (view === "kanban" ? boardSelected : openId)) ?? null;

  function DetailPanel({ deal }: { deal: PipelineDeal }) {
    const next = nextStageFor(deal);
    const won = wonStage();
    const lost = lostStage();
    return (
      <div className="kpi-pipe-detail" role="region" aria-label={`รายละเอียด ${deal.contactName}`}>
        <header className="kpi-pipe-detail-head">
          <div>
            <h3>{deal.contactName}</h3>
            <p>
              {deal.businessName || "ไม่มีชื่อกิจการ"} · {deal.stageName} · {deal.sourceLabel}
            </p>
          </div>
          <button
            type="button"
            className="kpi-leads-btn-secondary"
            onClick={() => {
              setOpenId(null);
              setBoardSelected(null);
            }}
          >
            ปิดรายละเอียด
          </button>
        </header>

        <dl className="kpi-pipe-detail-dl">
          <div>
            <dt>มูลค่า</dt>
            <dd>{formatBaht(deal.estimatedValue)}</dd>
          </div>
          <div>
            <dt>โอกาสปิด</dt>
            <dd>{deal.chance}%</dd>
          </div>
          <div>
            <dt>ติดต่อครั้งถัดไป</dt>
            <dd>{formatWhen(deal.nextActivityAt)}</dd>
          </div>
          <div>
            <dt>อัปเดตล่าสุด</dt>
            <dd>{formatWhen(deal.updatedAt)}</dd>
          </div>
        </dl>

        <ol className="kpi-pipe-timeline">
          <li>
            <strong>ขั้นปัจจุบัน</strong>
            <span>{deal.stageName}</span>
          </li>
          <li>
            <strong>แหล่งที่มา</strong>
            <span>{deal.sourceLabel}</span>
          </li>
          <li>
            <strong>ความเสี่ยง</strong>
            <span>{deal.risk === "high" ? "สูง — เลยกำหนดหรือรอติดต่อ" : deal.risk === "medium" ? "ปานกลาง" : "ต่ำ"}</span>
          </li>
        </ol>

        {!deal.isWon && !deal.isLost ? (
          <div className="kpi-pipe-detail-actions">
            <label className="kpi-pipe-field">
              ย้ายไปขั้น
              <select
                className="kpi-pipe-select"
                defaultValue={deal.stageId}
                disabled={pending}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === deal.stageId) return;
                  const target = stages.find((s) => s.id === value);
                  if (target?.isLost) {
                    setError("กรอกเหตุผลด้านล่างแล้วกด «ไม่สำเร็จ»");
                    return;
                  }
                  moveDeal(deal, value);
                }}
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.nameTh}
                  </option>
                ))}
              </select>
            </label>

            {next && !next.isLost ? (
              <button
                type="button"
                className="kpi-leads-btn-secondary"
                disabled={pending}
                onClick={() => moveDeal(deal, next.id)}
              >
                ไปขั้น {next.nameTh}
              </button>
            ) : null}

            {won ? (
              <button
                type="button"
                className="kpi-leads-btn-primary"
                disabled={pending}
                onClick={() => moveDeal(deal, won.id)}
              >
                ปิดการขาย
              </button>
            ) : null}

            {lost ? (
              <div className="kpi-pipe-lost-box">
                <label className="kpi-pipe-field">
                  เหตุผลไม่สำเร็จ
                  <input
                    value={lostReason}
                    onChange={(event) => setLostReason(event.target.value)}
                    placeholder="เช่น งบไม่ตรง / เลือกคู่แข่ง"
                  />
                </label>
                <button
                  type="button"
                  className="kpi-pipe-btn-rose"
                  disabled={pending}
                  onClick={() => moveDeal(deal, lost.id, lostReason)}
                >
                  ไม่สำเร็จ
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="kpi-pipe-detail-links">
          <Link href={`/crm/leads/${deal.id}`} className="kpi-leads-btn-secondary">
            เปิดหน้ารายละเอียดลีด
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-pipe-a">
      {(notice || error) && (
        <div
          className={`kpi-pipe-notice${error ? " is-error" : ""}`}
          role={error ? "alert" : "status"}
          aria-live="polite"
        >
          {error || notice}
        </div>
      )}

      <section className="kpi-pipe-stats" aria-label="สถิติ Pipeline — คลิกเพื่อกรอง">
        {(
          [
            { id: "all" as const, label: "ลีดทั้งหมด", value: String(totals.all), hint: "ทุกขั้น", tone: "sky" },
            {
              id: "contacting" as const,
              label: "กำลังติดต่อ",
              value: String(totals.contacting),
              hint: "ยังไม่ปิด",
              tone: "sun",
            },
            { id: "won" as const, label: "ปิดได้", value: String(totals.won), hint: "ขั้นชนะ", tone: "lime" },
            {
              id: "valued" as const,
              label: "มูลค่ารวม",
              value: formatBaht(totals.value),
              hint: "ดีลเปิดที่มีมูลค่า",
              tone: "violet",
            },
          ] as const
        ).map((stat) => {
          const active = initialStat === stat.id;
          return (
            <button
              key={stat.id}
              type="button"
              className={`kpi-pipe-stat is-${stat.tone}${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => pushState({ stat: active ? "all" : stat.id })}
            >
              <span className="kpi-pipe-stat-label">{stat.label}</span>
              <strong className="kpi-pipe-stat-value">{stat.value}</strong>
              <span className="kpi-pipe-stat-hint">{active ? "กำลังกรองรายการด้วยค่านี้" : "คลิกเพื่อกรอง"}</span>
            </button>
          );
        })}
      </section>

      <section className="kpi-pipe-flow" aria-label="การไหลของดีล">
        <header className="kpi-pipe-section-head">
          <h2>การไหลของดีล</h2>
          <p>โดนัทสัดส่วน + กราฟแท่งตามขั้น — คลิกเพื่อกรอง · แต่ละขั้นมีสีเฉพาะ</p>
        </header>

        <div className="kpi-pipe-visual">
          <div className="kpi-pipe-donut-wrap">
            <div
              className="kpi-pipe-donut"
              style={donutStyle}
              role="img"
              aria-label={`สัดส่วนดีลตามขั้น รวม ${totals.all} รายการ`}
            >
              <div className="kpi-pipe-donut-hole">
                <strong className="num">{totals.all}</strong>
                <span>ดีล</span>
              </div>
            </div>
            <ul className="kpi-pipe-legend">
              {stageStats
                .filter((stage) => stage.count > 0)
                .map((stage) => {
                  const tone = stageToneClass(stage);
                  const fill = stageFill(stage);
                  const share = Math.round((stage.count / dealTotal) * 100);
                  return (
                    <li key={stage.id} className={tone} style={{ ["--pipe-tone-fill" as string]: fill }}>
                      <i aria-hidden="true" />
                      <span>{stage.nameTh}</span>
                      <em className="num">{share}%</em>
                    </li>
                  );
                })}
            </ul>
          </div>

          <div
            className="kpi-pipe-chart"
            role="list"
            aria-label="กราฟแท่งจำนวนดีลตามขั้น Pipeline"
          >
            {stageStats.map((stage, index) => {
              const share = Math.round((stage.count / dealTotal) * 100);
              const barWidth =
                stage.count > 0 ? Math.max(8, Math.round((stage.count / chartMax) * 100)) : 0;
              const active = initialStageId === stage.id;
              const tone = stageToneClass(stage);
              const fill = stageFill(stage);
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="listitem"
                  className={`kpi-pipe-chart-row ${tone}${active ? " is-active" : ""}${stage.count === 0 ? " is-empty" : ""}`}
                  style={{ ["--pipe-tone-fill" as string]: fill }}
                  title={`${stage.nameTh}: ${stage.count} ดีล (${share}%) · ${formatBaht(stage.value)}`}
                  aria-label={`${stage.nameTh} ${stage.count} ดีล สัดส่วน ${share} เปอร์เซ็นต์ มูลค่า ${formatBaht(stage.value)}`}
                  aria-pressed={active}
                  onClick={() => pushState({ stageId: active ? "" : stage.id })}
                >
                  <span className="kpi-pipe-chart-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="kpi-pipe-chart-label">{stage.nameTh}</span>
                  <span className="kpi-pipe-chart-track" aria-hidden="true">
                    <span className="kpi-pipe-chart-bar" style={{ width: `${barWidth}%` }} />
                  </span>
                  <span className="kpi-pipe-chart-meta">
                    <strong className="num">{stage.count}</strong>
                    <em className="num">{share}% · {formatBaht(stage.value)}</em>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="kpi-pipe-toolbar" aria-label="ค้นหาและมุมมอง">
        <label className="kpi-pipe-search">
          <span className="sr-only">ค้นหาดีล</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") pushState({ q: query });
            }}
            placeholder="ค้นหาชื่อ โรงแรม รหัส หรือแหล่งที่มา"
          />
          <button type="button" className="kpi-leads-btn-secondary" onClick={() => pushState({ q: query })}>
            ค้นหา
          </button>
        </label>

        <div className="kpi-pipe-sort" role="group" aria-label="เรียงลำดับ">
          {(
            [
              { id: "value" as const, label: "มูลค่าสูง", tone: "is-value" },
              { id: "chance" as const, label: "โอกาสปิดสูง", tone: "is-chance" },
              { id: "risk" as const, label: "เสี่ยงก่อน", tone: "is-risk" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`kpi-pipe-sort-btn ${item.tone}${initialSort === item.id ? " is-active" : ""}`}
              aria-pressed={initialSort === item.id}
              onClick={() => pushState({ sort: item.id })}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`kpi-pipe-risk-btn${initialRisk ? " is-active" : ""}`}
          aria-pressed={initialRisk}
          onClick={() => pushState({ risk: !initialRisk })}
        >
          ดีลเสี่ยง {totals.risk}
        </button>

        <div className="kpi-pipe-view" role="group" aria-label="มุมมอง">
          <Link
            href={hrefPipeline({
              view: "table",
              q: query,
              stageId: initialStageId || undefined,
              sort: initialSort,
              risk: initialRisk,
              stat: initialStat,
            })}
            className={`kpi-pipe-seg${view === "table" ? " is-active" : ""}`}
            aria-current={view === "table" ? "page" : undefined}
          >
            ตาราง
          </Link>
          <Link
            href={hrefPipeline({
              view: "kanban",
              q: query,
              stageId: initialStageId || undefined,
              sort: initialSort,
              risk: initialRisk,
              stat: initialStat,
            })}
            className={`kpi-pipe-seg${view === "kanban" ? " is-active" : ""}`}
            aria-current={view === "kanban" ? "page" : undefined}
          >
            บอร์ด
          </Link>
        </div>
      </section>

      {view === "table" ? (
        <section className="kpi-pipe-table-panel" aria-label="ตารางดีล">
          {filtered.length === 0 ? (
            <div className="kpi-pipe-empty">
              <h3>ไม่พบดีลตามเงื่อนไข</h3>
              <p>ลองล้างตัวกรอง หรือเพิ่มลีดใหม่</p>
            </div>
          ) : (
            <div className="kpi-pipe-table-wrap">
              <table className="kpi-pipe-table">
                <caption className="sr-only">รายการดีลใน Pipeline</caption>
                <colgroup>
                  <col className="is-contact" />
                  <col className="is-stage" />
                  <col className="is-num" />
                  <col className="is-chance" />
                  <col className="is-when" />
                  <col className="is-actions" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col" className="is-contact">
                      ผู้ติดต่อ
                    </th>
                    <th scope="col" className="is-stage">
                      ขั้นตอนนี้
                    </th>
                    <th scope="col" className="is-num">
                      มูลค่า
                    </th>
                    <th scope="col" className="is-chance">
                      โอกาสปิด
                    </th>
                    <th scope="col" className="is-when">
                      ติดต่อครั้งถัดไป
                    </th>
                    <th scope="col" className="is-actions">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((deal) => {
                    const open = openId === deal.id;
                    return (
                      <Fragment key={deal.id}>
                        <tr className={deal.risk === "high" ? "is-risk" : undefined}>
                          <td data-label="ผู้ติดต่อ" className="is-contact">
                            <strong>{deal.contactName}</strong>
                            <span>{deal.businessName || "—"}</span>
                          </td>
                          <td data-label="ขั้นตอนนี้" className="is-stage">
                            <span className="kpi-pipe-stage-pill">{deal.stageName}</span>
                          </td>
                          <td data-label="มูลค่า" className="is-num">
                            {formatBaht(deal.estimatedValue)}
                          </td>
                          <td data-label="โอกาสปิด" className="is-chance">
                            <span>{deal.chance}%</span>
                            <i style={{ width: `${deal.chance}%` }} aria-hidden="true" />
                          </td>
                          <td data-label="ติดต่อครั้งถัดไป" className="is-when">
                            {formatWhen(deal.nextActivityAt)}
                          </td>
                          <td data-label="จัดการ" className="is-actions">
                            <button
                              type="button"
                              className={`kpi-pipe-manage-btn${open ? " is-open" : ""}`}
                              aria-expanded={open}
                              onClick={() => setOpenId(open ? null : deal.id)}
                            >
                              {open ? "ปิด" : "จัดการ"}
                            </button>
                          </td>
                        </tr>
                        {open ? (
                          <tr className="kpi-pipe-detail-row">
                            <td colSpan={6}>
                              <DetailPanel deal={deal} />
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="kpi-pipe-board-panel" aria-label="บอร์ด Pipeline">
          <div className="kpi-pipe-board" style={{ ["--pipe-cols" as string]: String(Math.max(stages.length, 1)) }}>
            {stages.map((stage) => {
              const cards = filtered.filter((d) => d.stageId === stage.id);
              return (
                <section key={stage.id} className="kpi-pipe-col" aria-label={stage.nameTh}>
                  <header className="kpi-pipe-col-head">
                    <h3>{stage.nameTh}</h3>
                    <strong>{cards.length}</strong>
                  </header>
                  <div className="kpi-pipe-col-body">
                    {cards.length === 0 ? (
                      <p className="kpi-pipe-col-empty">ยังไม่มีดีลในขั้น {stage.nameTh}</p>
                    ) : (
                      cards.map((deal) => {
                        const next = nextStageFor(deal);
                        const selected = boardSelected === deal.id;
                        return (
                          <article
                            key={deal.id}
                            className={`kpi-pipe-card${selected ? " is-selected" : ""}${deal.risk === "high" ? " is-risk" : ""}`}
                          >
                            <button
                              type="button"
                              className="kpi-pipe-card-main"
                              onClick={() => setBoardSelected(selected ? null : deal.id)}
                            >
                              <strong>{deal.contactName}</strong>
                              <em>{deal.businessName || "ไม่มีชื่อกิจการ"}</em>
                              <span>
                                {formatBaht(deal.estimatedValue)} · โอกาส {deal.chance}%
                              </span>
                              <span>นัด {formatWhen(deal.nextActivityAt)}</span>
                            </button>
                            <div className="kpi-pipe-card-actions">
                              {next && !deal.isWon && !deal.isLost ? (
                                <button
                                  type="button"
                                  className="kpi-leads-btn-secondary"
                                  disabled={pending}
                                  onClick={() => moveDeal(deal, next.id)}
                                >
                                  ขั้นถัดไป
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className="kpi-leads-btn-secondary"
                                onClick={() => setBoardSelected(deal.id)}
                              >
                                ดู
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              );
            })}
          </div>
          {detailDeal && view === "kanban" ? <DetailPanel deal={detailDeal} /> : null}
        </section>
      )}

      <p className="kpi-pipe-footer">
        โอกาสปิดและความเสี่ยงประมาณจากขั้นขายกับกำหนดติดต่อ · การย้ายขั้นบันทึกลงระบบจริง
      </p>
    </div>
  );
}
