export function B2bFrameworkMatrix({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: { area: string; problem: string; prepare: string; output: string };
  rows: Array<{ id: string; area: string; problem: string; prepare: string; output: string }>;
}) {
  return (
    <div className="kpi-b2b-framework-table-wrap">
      <table className="kpi-b2b-framework-table">
        <caption className="kpi-b2b-framework-caption">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{columns.area}</th>
            <th scope="col">{columns.problem}</th>
            <th scope="col">{columns.prepare}</th>
            <th scope="col">{columns.output}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" data-label={columns.area}>
                <span className="kpi-latin">{row.area}</span>
              </th>
              <td data-label={columns.problem}>{row.problem}</td>
              <td data-label={columns.prepare}>{row.prepare}</td>
              <td data-label={columns.output}>
                <span className="kpi-b2b-framework-output">{row.output}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
