import Link from "next/link";

export function PageBreadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="kpi-page-crumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`}>
            {index > 0 ? <span aria-hidden="true"> / </span> : null}
            {index === items.length - 1 ? (
              <span>{item.name}</span>
            ) : (
              <Link href={item.href}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
