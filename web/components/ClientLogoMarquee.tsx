import { clientLogos } from "@/lib/clients";

export function ClientLogoMarquee({
  label,
  className = "mt-10",
}: {
  label: string;
  className?: string;
}) {
  const loop = [...clientLogos, ...clientLogos];
  return (
    <div className={`kpi-client-marquee ${className}`.trim()} role="region" aria-label={label}>
      <div className="kpi-client-marquee-track">
        {loop.map((client, index) => (
          <div key={`${client.name}-${index}`} className="kpi-client-logo" title={client.name}>
            <img src={client.src} alt={client.name} width={160} height={88} decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
}
