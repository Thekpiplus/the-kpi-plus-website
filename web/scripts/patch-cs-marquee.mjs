import fs from "fs";

const p = "app/page-case-study.css";
const cs = fs.readFileSync(p, "utf8");
const start = cs.indexOf(".kpi-cs-marquee.kpi-client-marquee {");
const end = cs.indexOf(".kpi-shell .kpi-cs-grid h2.kpi-h2", start + 1);
if (start < 0 || end < 0) throw new Error(`markers ${start} ${end}`);

const block = `.kpi-cs-marquee.kpi-client-marquee {
  margin-top: 1.75rem;
  margin-inline: 0;
  width: 100%;
  mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
}

.kpi-cs-marquee .kpi-client-marquee-track {
  gap: 2.5rem;
}

.kpi-cs-marquee .kpi-client-logo {
  width: 12.5rem;
  height: 5rem;
  border: 0;
  background: transparent;
}

.kpi-cs-marquee .kpi-client-logo img {
  max-width: 11.25rem;
  max-height: 3.6rem;
  filter: grayscale(1) contrast(0.95);
  opacity: 0.8;
  mix-blend-mode: multiply;
}

@media (min-width: 48rem) {
  .kpi-cs-marquee .kpi-client-logo {
    width: 14rem;
    height: 5.5rem;
  }

  .kpi-cs-marquee .kpi-client-logo img {
    max-width: 12.5rem;
    max-height: 4rem;
  }
}

`;

fs.writeFileSync(p, cs.slice(0, start) + block + cs.slice(end));
console.log("case marquee ok");
