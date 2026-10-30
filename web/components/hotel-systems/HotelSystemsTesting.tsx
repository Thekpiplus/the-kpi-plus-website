import type { CmsSystemsLine, CmsSystemsTestCase } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_TESTING_COLUMNS,
  SYSTEMS_TESTING_ERROR_FLOW,
  SYSTEMS_TESTING_ISSUE_FIELDS,
  SYSTEMS_TESTING_STATUSES,
  SYSTEMS_TESTING_VISUAL,
  systemsRenderableSrc,
  systemsTestingPassedIsSample,
  systemsTestingSeverity,
  systemsTestingStatus,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

const QA_RETEST_FALLBACK = "Sample — not a live retest date";

function needsIssue(status: string) {
  return status === "failed" || status === "retest_required" || status === "blocked" || status === "requires_provider_support";
}

function caseCopy(row: CmsSystemsTestCase, thai: boolean, sample: boolean) {
  const rawStatus = String(row.status || "not_tested");
  const labelledSample = systemsTestingPassedIsSample(
    `${row.actualEn || ""} ${row.actualTh || ""}`,
    `${row.evidenceEn || ""} ${row.evidenceTh || ""}`,
  );
  const statusId = sample && rawStatus === "passed" && !labelledSample ? "not_tested" : rawStatus;
  return {
    id: row.id,
    name: thai ? row.caseTh || row.caseEn : row.caseEn || row.caseTh,
    trigger: thai ? row.triggerTh || row.triggerEn : row.triggerEn || row.triggerTh,
    expected: thai ? row.expectedTh || row.expectedEn : row.expectedEn || row.expectedTh,
    actual: thai ? row.actualTh || row.actualEn : row.actualEn || row.actualTh,
    status: systemsTestingStatus(statusId),
    owner: thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh,
    evidence: thai ? row.evidenceTh || row.evidenceEn : row.evidenceEn || row.evidenceTh,
    testedDate: row.testedDate,
    issue: thai ? row.issueTh || row.issueEn : row.issueEn || row.issueTh,
    severity: systemsTestingSeverity(row.severity),
    provider: thai ? row.providerTh || row.providerEn : row.providerEn || row.providerTh,
    next: thai ? row.nextTh || row.nextEn : row.nextEn || row.nextTh,
    retestDate: row.retestDate,
    showIssue: needsIssue(statusId),
  };
}

export function HotelSystemsTesting({
  locale,
  src,
  status,
  label,
  caption,
  casesTitle,
  errorTitle,
  cases,
  errorSteps,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  label?: string;
  caption?: string;
  casesTitle?: string;
  errorTitle?: string;
  cases: CmsSystemsTestCase[];
  errorSteps: CmsSystemsLine[];
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const cols = SYSTEMS_TESTING_COLUMNS;
  const issueCols = SYSTEMS_TESTING_ISSUE_FIELDS;
  const displayLabel = label?.trim() || SYSTEMS_TESTING_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_TESTING_VISUAL.captionTh : SYSTEMS_TESTING_VISUAL.captionEn);
  const copies = cases.map((row) => caseCopy(row, thai, sample));
  const flow = errorSteps.length
    ? errorSteps
    : SYSTEMS_TESTING_ERROR_FLOW.map((item) => ({ id: item.id, th: item.th, en: item.en }));
  const usedStatuses = SYSTEMS_TESTING_STATUSES.filter((item) => copies.some((row) => row.status.id === item.id));

  return (
    <div className="hsi-qa">
      <ul className="hsi-qa-flags" aria-label={thai ? "ป้ายข้อมูลตัวอย่าง" : "Sample data labels"}>
        <li className="kpi-latin">{thai ? "ข้อมูลตัวอย่าง" : "Sample data"}</li>
        <li className="kpi-latin">{thai ? "แทนที่ด้วยผลทดสอบที่อนุมัติ" : "Replace with approved test results"}</li>
        <li className="kpi-latin">{thai ? "ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน" : "No guest or payment data"}</li>
      </ul>

      <figure className="hsi-qa-figure">
        {fileSrc ? (
          <div className="hsi-qa-photo">
            <img
              src={fileSrc}
              alt={thai ? SYSTEMS_TESTING_VISUAL.altTh : SYSTEMS_TESTING_VISUAL.altEn}
              width={SYSTEMS_TESTING_VISUAL.displayWidth}
              height={SYSTEMS_TESTING_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_TESTING_VISUAL.displayWidth} / ${SYSTEMS_TESTING_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Systems Test Cases and QA — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-qa-board" role="img" aria-label={thai ? SYSTEMS_TESTING_VISUAL.altTh : SYSTEMS_TESTING_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">Hotel Systems Test Cases and QA — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Sample data · No guest or payment data</p>
            <p className="hsi-qa-board-title">{thai ? "เคสทดสอบ ไม่ใช่ผลโรงแรมจริง" : "Test cases, not a live hotel result"}</p>
            <ol className="hsi-qa-flow-preview">
              {SYSTEMS_TESTING_ERROR_FLOW.map((item) => (
                <li key={item.id}>
                  <span className="kpi-latin">{item.num}</span>
                  <strong className="kpi-latin">{item.label}</strong>
                </li>
              ))}
            </ol>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_TESTING_VISUAL.metaTh : SYSTEMS_TESTING_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <p className="hsi-qa-note kpi-latin">
        Sample data. Do not mark Passed unless labelled Sample. Evidence must not include guest or payment data.
      </p>

      <ul className="hsi-qa-legend" aria-label={thai ? "คำอธิบายสถานะทดสอบตัวอย่าง" : "Sample test status legend"}>
        {usedStatuses.map((item) => (
          <li key={item.id}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="hsi-qa-block">
        <h3 className="hsi-qa-heading kpi-latin">{errorTitle?.trim() || "Error Handling"}</h3>
        <ol className="hsi-qa-flow">
          {flow.map((item, index) => {
            const step = SYSTEMS_TESTING_ERROR_FLOW[index] || SYSTEMS_TESTING_ERROR_FLOW.find((row) => row.id === item.id);
            const detail = thai ? item.th : item.en;
            const heading = step?.label || item.en;
            return (
              <li key={item.id}>
                <span className="kpi-latin">{step?.num || String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{heading}</strong>
                {detail && detail !== heading ? <small>{detail}</small> : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hsi-qa-block">
        <h3 className="hsi-qa-heading kpi-latin">{casesTitle?.trim() || "Test Cases"}</h3>
        <div className="hsi-qa-table-wrap">
          <table className="hsi-qa-table">
            <caption className="sr-only">
              {thai
                ? "ตารางตัวอย่างเคสทดสอบระบบโรงแรม แสดงเคส ตัวกระตุ้น ผลที่คาดหวัง ผลจริง สถานะ ผู้รับผิดชอบ หลักฐาน วันที่ทดสอบ และงานถัดไป ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน"
                : "Sample hotel systems test-case table of test case, trigger, expected result, actual result, status, owner, evidence, tested date, and next action. No guest or payment data."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? cols.case.th : cols.case.en}</th>
                <th scope="col">{thai ? cols.trigger.th : cols.trigger.en}</th>
                <th scope="col">{thai ? cols.expected.th : cols.expected.en}</th>
                <th scope="col">{thai ? cols.actual.th : cols.actual.en}</th>
                <th scope="col">{thai ? cols.status.th : cols.status.en}</th>
                <th scope="col">{thai ? cols.owner.th : cols.owner.en}</th>
                <th scope="col">{thai ? cols.evidence.th : cols.evidence.en}</th>
                <th scope="col">{thai ? cols.tested.th : cols.tested.en}</th>
                <th scope="col">{thai ? cols.next.th : cols.next.en}</th>
              </tr>
            </thead>
            <tbody>
              {copies.map((row) => (
                <tr key={row.id} className={row.showIssue ? "is-issue" : undefined}>
                  <th scope="row">{row.name}</th>
                  <td data-label={thai ? cols.trigger.th : cols.trigger.en}>{row.trigger}</td>
                  <td data-label={thai ? cols.expected.th : cols.expected.en}>{row.expected}</td>
                  <td data-label={thai ? cols.actual.th : cols.actual.en}>{row.actual}</td>
                  <td data-label={thai ? cols.status.th : cols.status.en}>
                    <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
                  </td>
                  <td data-label={thai ? cols.owner.th : cols.owner.en}>{row.owner}</td>
                  <td data-label={thai ? cols.evidence.th : cols.evidence.en}>{row.evidence}</td>
                  <td data-label={thai ? cols.tested.th : cols.tested.en} className="kpi-latin">
                    {row.testedDate}
                  </td>
                  <td data-label={thai ? cols.next.th : cols.next.en}>{row.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hsi-qa-issues">
        <h3 className="hsi-qa-heading">
          {thai ? "เคสที่ล้มต้องมีเจ้าของและความรุนแรง" : "Failed tests require an owner and severity"}
        </h3>
        <p className="hsi-qa-issue-lead">
          {thai
            ? "ทุกเคส Failed ต้องมีคำอธิบายปัญหา ความรุนแรง ผู้รับผิดชอบ การพึ่งพาผู้ให้บริการ งานถัดไป และวันที่ทดสอบซ้ำ"
            : "Every Failed test requires an issue description, severity, owner, provider dependency, next action, and retest date."}
        </p>
        {copies
          .filter((row) => row.showIssue)
          .map((row) => (
            <article key={`issue-${row.id}`} className="hsi-qa-issue">
              <p className="hsi-qa-issue-name">
                <strong>{row.name}</strong>
                <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
              </p>
              <dl>
                <div>
                  <dt>{thai ? issueCols.issue.th : issueCols.issue.en}</dt>
                  <dd>{row.issue || (thai ? "ต้องระบุคำอธิบายปัญหา" : "Issue description is required")}</dd>
                </div>
                <div>
                  <dt>{thai ? issueCols.severity.th : issueCols.severity.en}</dt>
                  <dd className="kpi-latin">{row.severity.label}</dd>
                </div>
                <div>
                  <dt>{thai ? issueCols.owner.th : issueCols.owner.en}</dt>
                  <dd>{row.owner}</dd>
                </div>
                <div>
                  <dt>{thai ? issueCols.provider.th : issueCols.provider.en}</dt>
                  <dd>{row.provider || (thai ? "ต้องระบุการพึ่งพาผู้ให้บริการ" : "Provider dependency is required")}</dd>
                </div>
                <div>
                  <dt>{thai ? issueCols.next.th : issueCols.next.en}</dt>
                  <dd>{row.next}</dd>
                </div>
                <div>
                  <dt>{thai ? issueCols.retest.th : issueCols.retest.en}</dt>
                  <dd className="kpi-latin">{row.retestDate || QA_RETEST_FALLBACK}</dd>
                </div>
              </dl>
            </article>
          ))}
      </div>
    </div>
  );
}
