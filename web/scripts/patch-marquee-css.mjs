import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "app/globals.css");
const src = fs.readFileSync(file, "utf8");

const start = src.indexOf("/* About — client logo marquee");
if (start < 0) throw new Error("marquee start not found");

const endToken = "@media (max-width: 22.5rem)";
let end = src.indexOf(endToken, start + 1);
while (end >= 0 && !src.slice(end, end + 80).includes(".kpi-cs-line")) {
  end = src.indexOf(endToken, end + 1);
}
if (end < 0) throw new Error("marquee end not found");

const replacement = `/* Client logo marquee — two rows, seamless loop */
.kpi-client-marquee {
  display: grid;
  gap: 0.85rem;
  overflow: hidden;
  margin-inline: calc(50% - 50vw);
  width: 100vw;
  padding-block: 0.35rem;
  mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
}

.kpi-client-marquee-track {
  display: flex;
  width: max-content;
  gap: 2.25rem;
  align-items: center;
  animation: kpi-client-marquee 60s linear infinite;
  will-change: transform;
}

.kpi-client-marquee-track.is-reverse {
  animation-name: kpi-client-marquee-reverse;
}

.kpi-client-marquee-track.is-static {
  animation: none;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem 2rem;
}

.kpi-client-marquee:hover .kpi-client-marquee-track {
  animation-play-state: paused;
}

.kpi-client-logo {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 11.5rem;
  height: 4.75rem;
  padding: 0.35rem 0.5rem;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.kpi-client-logo img {
  display: block;
  width: auto;
  height: auto;
  max-width: 10.5rem;
  max-height: 3.35rem;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1) contrast(0.95);
  opacity: 0.8;
  mix-blend-mode: multiply;
  transition: filter 180ms ease, opacity 180ms ease;
}

@media (hover: hover) {
  .kpi-client-logo:hover img {
    filter: none;
    opacity: 1;
  }
}

@keyframes kpi-client-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes kpi-client-marquee-reverse {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

@media (min-width: 48rem) {
  .kpi-client-marquee {
    gap: 1.1rem;
  }

  .kpi-client-marquee-track {
    gap: 2.75rem;
  }

  .kpi-client-logo {
    width: 13.5rem;
    height: 5.25rem;
  }

  .kpi-client-logo img {
    max-width: 12rem;
    max-height: 3.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kpi-client-marquee {
    margin-inline: 0;
    width: 100%;
    mask-image: none;
  }

  .kpi-client-marquee-track,
  .kpi-client-marquee-track.is-reverse {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }
}

`;

fs.writeFileSync(file, src.slice(0, start) + replacement + src.slice(end));
console.log("globals marquee patched");

const caseCssPath = path.join(root, "app/page-case-study.css");
let cs = fs.readFileSync(caseCssPath, "utf8");
const csStart = cs.indexOf(".kpi-cs-marquee.kpi-client-marquee {");
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

if (csStart < 0) {
  const insertAt = cs.indexOf(".kpi-cs-overview {");
  fs.writeFileSync(caseCssPath, cs.slice(0, insertAt) + block + cs.slice(insertAt));
  console.log("case marquee inserted");
} else {
  const markers = [".kpi-cs-overview {", ".kpi-cs-overview-title", ".kpi-cs-logo-grid {"];
  let csEnd = -1;
  for (const m of markers) {
    const i = cs.indexOf(m, csStart + 10);
    if (i > csStart) {
      csEnd = i;
      break;
    }
  }
  if (csEnd < 0) throw new Error("case marquee end not found");
  fs.writeFileSync(caseCssPath, cs.slice(0, csStart) + block + cs.slice(csEnd));
  console.log("case marquee replaced");
}
