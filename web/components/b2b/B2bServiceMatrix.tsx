"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { B2bScopeOwnerKind, B2bServiceRow } from "@/lib/b2b";

type Columns = {
  area: string;
  action: string;
  input: string;
  output: string;
  owner: string;
};

function AreaTag({ children }: { children: string }) {
  return <span className="kpi-latin kpi-b2b-service-area">{children}</span>;
}

function OutputChip({ children }: { children: string }) {
  return <span className="kpi-latin kpi-b2b-service-output">{children}</span>;
}

function OwnerChip({ kind, children }: { kind: B2bScopeOwnerKind; children: string }) {
  return <span className={`kpi-b2b-service-owner kpi-b2b-service-owner--${kind}`}>{children}</span>;
}

function RelatedLink({ href, label, related }: { href: string; label: string; related: string }) {
  if (!href || !label) return null;
  return (
    <Link className="kpi-b2b-service-link" href={href}>
      <span className="kpi-b2b-service-link-kicker">{related}</span>
      <span>{label}</span>
    </Link>
  );
}

function ServiceCard({
  row,
  columns,
  expand,
  collapse,
  related,
}: {
  row: B2bServiceRow;
  columns: Columns;
  expand: string;
  collapse: string;
  related: string;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  return (
    <details
      className="kpi-b2b-service-card"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary aria-expanded={open} aria-controls={bodyId} aria-label={`${row.area}: ${row.output}`}>
        <span className="kpi-b2b-service-card-tags" aria-hidden="true">
          <AreaTag>{row.area}</AreaTag>
          <OutputChip>{row.output}</OutputChip>
        </span>
        <span className="kpi-b2b-service-expand kpi-b2b-service-expand--open" aria-hidden="true">
          {expand}
        </span>
        <span className="kpi-b2b-service-expand kpi-b2b-service-expand--close" aria-hidden="true">
          {collapse}
        </span>
      </summary>
      <div id={bodyId}>
        <dl className="kpi-b2b-service-card-body">
          <div>
            <dt>{columns.action}</dt>
            <dd>{row.action}</dd>
          </div>
          <div>
            <dt>{columns.input}</dt>
            <dd>{row.input}</dd>
          </div>
          <div>
            <dt>{columns.owner}</dt>
            <dd>
              <OwnerChip kind={row.ownerKind}>{row.owner}</OwnerChip>
            </dd>
          </div>
        </dl>
        <RelatedLink href={row.href} label={row.linkLabel} related={related} />
      </div>
    </details>
  );
}

export function B2bServiceMatrix({
  caption,
  columns,
  rows,
  expand,
  collapse,
  related,
}: {
  caption: string;
  columns: Columns;
  rows: B2bServiceRow[];
  expand: string;
  collapse: string;
  related: string;
}) {
  return (
    <div className="kpi-b2b-service-matrix">
      <ul className="kpi-b2b-service-cards">
        {rows.map((row, index) => (
          <li key={`${row.id}-${index}`}>
            <ServiceCard row={row} columns={columns} expand={expand} collapse={collapse} related={related} />
          </li>
        ))}
      </ul>

      <div className="kpi-b2b-service-table-wrap">
        <table className="kpi-b2b-service-table">
          <caption className="kpi-b2b-service-caption">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">{columns.area}</th>
              <th scope="col">{columns.action}</th>
              <th scope="col">{columns.input}</th>
              <th scope="col">{columns.output}</th>
              <th scope="col">{columns.owner}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.id}-${index}`}>
                <th scope="row">
                  <AreaTag>{row.area}</AreaTag>
                  <RelatedLink href={row.href} label={row.linkLabel} related={related} />
                </th>
                <td>{row.action}</td>
                <td>{row.input}</td>
                <td>
                  <OutputChip>{row.output}</OutputChip>
                </td>
                <td>
                  <OwnerChip kind={row.ownerKind}>{row.owner}</OwnerChip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
