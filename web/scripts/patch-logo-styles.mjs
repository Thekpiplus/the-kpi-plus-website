import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function replaceBetween(file, startMarker, endMarker, replacement) {
  const full = path.join(root, file);
  const src = fs.readFileSync(full, "utf8");
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error(`start not found in ${file}: ${startMarker}`);
  const end = src.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`end not found in ${file}: ${endMarker}`);
  const next = src.slice(0, start) + replacement + src.slice(end);
  fs.writeFileSync(full, next);
  console.log("patched", file);
}

const aboutBlock = `.kpi-about-clients {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.kpi-about-client {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 0;
  aspect-ratio: 2.4 / 1;
  padding: 0.85rem 1rem;
  border: 1px solid var(--kpi-line-grey, #e3e8eb);
  border-radius: 0;
  background: var(--kpi-light-grey, #f4f4f4);
}

.kpi-about-client img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 2.25rem;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1) contrast(0.92);
  opacity: 0.72;
  transition: filter 180ms ease, opacity 180ms ease;
}

@media (hover: hover) {
  .kpi-about-client:hover img,
  .kpi-about-client:focus-within img {
    filter: none;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kpi-about-client img {
    transition: none;
  }
}

@media (min-width: 40rem) {
  .kpi-about-clients {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .kpi-about-client img {
    max-height: 2.4rem;
  }
}

@media (min-width: 64rem) {
  .kpi-about-clients {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .kpi-about-client {
    padding: 0.9rem 0.75rem;
  }

  .kpi-about-client img {
    max-height: 2.15rem;
  }
}

`;

const caseBlock = `.kpi-cs-logo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
}

.kpi-cs-logo-tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  aspect-ratio: 2.2 / 1;
  padding: 0.85rem 1rem;
  margin: 0;
  border: 1px solid #e3e8eb;
  border-radius: 0;
  outline: none;
  background: #fff;
  box-shadow: none;
  cursor: default;
}

.kpi-cs-logo-tile a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.kpi-cs-logo-tile img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 2.35rem;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1) contrast(0.92);
  opacity: 0.7;
  transition: filter 180ms ease, opacity 180ms ease;
}

@media (min-width: 40rem) {
  .kpi-cs-logo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 56rem) {
  .kpi-cs-logo-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
  }
}

@media (min-width: 64rem) {
  .kpi-cs-logo-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.85rem;
    margin-top: 2rem;
  }

  .kpi-cs-logo-tile {
    padding: 0.9rem 0.75rem;
  }

  .kpi-cs-logo-tile img {
    max-height: 2.15rem;
  }
}

@media (hover: hover) {
  .kpi-cs-logo-tile:hover,
  .kpi-cs-logo-tile:focus-within {
    z-index: 2;
  }

  .kpi-cs-logo-tile:hover img,
  .kpi-cs-logo-tile:focus-within img {
    filter: none;
    opacity: 1;
  }

  .kpi-cs-logo-tile:hover::after,
  .kpi-cs-logo-tile:focus-within::after {
    content: attr(title);
    position: absolute;
    left: 50%;
    top: calc(100% + 0.4rem);
    z-index: 3;
    width: max-content;
    max-width: 12.5rem;
    padding: 0.35rem 0.55rem;
    border-radius: 0.45rem;
    background: #0b1f33;
    color: #f2f8e2;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.35;
    text-align: center;
    transform: translateX(-50%);
    pointer-events: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kpi-cs-logo-tile img {
    transition: none;
  }
}

`;

replaceBetween(
  "app/page-about.css",
  ".kpi-about-clients {",
  ".kpi-about-values-list {",
  aboutBlock,
);

replaceBetween(
  "app/page-case-study.css",
  ".kpi-cs-logo-grid {",
  ".kpi-cs-overview {",
  caseBlock,
);

// Soften leftover globals media rules so page CSS wins visually for grayscale base.
const globals = path.join(root, "app/globals.css");
let g = fs.readFileSync(globals, "utf8");
g = g.replace(
  /filter:\s*none;\s*\n\s*mix-blend-mode:\s*darken;/,
  "filter: none;\n    opacity: 1;",
);
fs.writeFileSync(globals, g);
console.log("patched globals hover filter");
