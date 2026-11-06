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
      {logos.map((client) => {
        const image = (
          <img
            src={client.src}
            alt={client.alt || client.name}
            title={client.name}
            width={240}
            height={120}
            loading="lazy"
            decoding="async"
          />
        );
        return (
          <li key={client.src} className="kpi-cs-logo-tile" title={client.name}>
            {client.href ? (
              <a href={client.href} target="_blank" rel="noopener noreferrer">
                {image}
              </a>
            ) : (
              image
            )}
          </li>
        );
      })}
    </ul>
  );
}
