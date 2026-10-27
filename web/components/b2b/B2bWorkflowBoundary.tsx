export function B2bWorkflowBoundary({
  kicker,
  note,
  supportTitle,
  approveTitle,
  support,
  approve,
}: {
  kicker: string;
  note: string;
  supportTitle: string;
  approveTitle: string;
  support: string[];
  approve: string[];
}) {
  return (
    <aside className="kpi-b2b-workflow-boundary" aria-label={kicker}>
      <p className="kpi-latin kpi-b2b-workflow-boundary-kicker">{kicker}</p>
      <p className="kpi-b2b-workflow-boundary-note">{note}</p>
      <div className="kpi-b2b-workflow-boundary-grid">
        <article>
          <h3>{supportTitle}</h3>
          <ul>
            {support.map((item) => (
              <li key={item} className="kpi-latin">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{approveTitle}</h3>
          <ul>
            {approve.map((item) => (
              <li key={item} className="kpi-latin">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </aside>
  );
}
