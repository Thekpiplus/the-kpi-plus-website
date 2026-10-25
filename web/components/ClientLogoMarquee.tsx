import { clientLogoAlt, type ClientLogo } from "@/lib/clients";

export function ClientLogoMarquee({
  label,
  logos = [],
  className = "mt-10",
}: {
  label: string;
  logos?: ClientLogo[];
  className?: string;
}) {
  if (!logos.length) return null;

  const loop = logos.length > 3 ? [...logos, ...logos] : logos;

  return (
    <div className={`kpi-client-marquee ${className}`.trim()} role="region" aria-label={label}>
      <div className={`kpi-client-marquee-track${logos.length > 3 ? "" : " is-static"}`}>
        {loop.map((client, index) => {
          const duplicate = index >= logos.length;
          return (
            <div key={`${client.src}-${index}`} className="kpi-client-logo" aria-hidden={duplicate || undefined}>
              <img
                src={client.src}
                alt={duplicate ? "" : clientLogoAlt(client)}
                width={160}
                height={48}
                decoding="async"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
