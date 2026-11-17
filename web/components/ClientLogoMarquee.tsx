import { clientLogoAlt, type ClientLogo } from "@/lib/clients";

function splitRows(logos: ClientLogo[]): [ClientLogo[], ClientLogo[]] {
  if (logos.length < 4) return [logos, logos];
  const mid = Math.ceil(logos.length / 2);
  return [logos.slice(0, mid), logos.slice(mid)];
}

function MarqueeRow({
  logos,
  direction,
  durationSec,
}: {
  logos: ClientLogo[];
  direction: "left" | "right";
  durationSec: number;
}) {
  // Duplicate once for a seamless -50% translate loop.
  const loop = logos.length ? [...logos, ...logos] : [];
  const animate = logos.length > 2;

  return (
    <div
      className={`kpi-client-marquee-track${animate ? "" : " is-static"}${direction === "right" ? " is-reverse" : ""}`}
      style={animate ? { animationDuration: `${durationSec}s` } : undefined}
    >
      {loop.map((client, index) => {
        const duplicate = index >= logos.length;
        return (
          <div key={`${client.src}-${direction}-${index}`} className="kpi-client-logo" aria-hidden={duplicate || undefined}>
            <img
              src={client.src}
              alt={duplicate ? "" : clientLogoAlt(client)}
              width={220}
              height={88}
              decoding="async"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}

export function ClientLogoMarquee({
  label,
  logos = [],
  className = "",
  rows = 2,
}: {
  label: string;
  logos?: ClientLogo[];
  className?: string;
  rows?: 1 | 2;
}) {
  if (!logos.length) return null;

  const [rowA, rowB] = splitRows(logos);
  const durationA = Math.max(40, rowA.length * 6);
  const durationB = Math.max(48, rowB.length * 6.5);

  return (
    <div className={`kpi-client-marquee${className ? ` ${className}` : ""}`.trim()} role="region" aria-label={label}>
      <MarqueeRow logos={rowA} direction="left" durationSec={durationA} />
      {rows === 2 ? <MarqueeRow logos={rowB} direction="right" durationSec={durationB} /> : null}
    </div>
  );
}
