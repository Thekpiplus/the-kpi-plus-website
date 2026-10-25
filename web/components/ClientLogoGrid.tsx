import type { ClientLogo } from "@/lib/clients";

export function ClientLogoGrid({
  logos,
  label,
}: {
  logos: ClientLogo[];
  label: string;
}) {
  if (!logos.length) return null;

  return (
    <ul className="kpi-cs-logo-grid" aria-label={label}>
      {logos.map((client) => (
        <li key={client.src} className="kpi-cs-logo-tile" title={client.name}>
          <img
            src={client.src}
            alt={client.name}
            title={client.name}
            width={240}
            height={80}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}
