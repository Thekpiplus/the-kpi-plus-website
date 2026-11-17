/**
 * Split page-specific rules out of globals.css so every route does not download
 * every solution page's CSS.
 *
 * Re-run from the pre-extract backup when adjusting buckets:
 *   copy app/globals.css.bak-speed app/globals.css
 *   node scripts/extract-page-css.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const globalsPath = path.join(root, "app", "globals.css");
const backupPath = path.join(root, "app", "globals.css.bak-speed");

function extractMatchingRules(source, testSel) {
  const keep = [];
  const move = [];
  let i = 0;
  const n = source.length;

  while (i < n) {
    if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      const block = source.slice(i, end < 0 ? n : end + 2);
      keep.push(block);
      i = end < 0 ? n : end + 2;
      continue;
    }

    if (source[i] === "@") {
      let j = i;
      while (j < n && source[j] !== "{" && source[j] !== ";") j++;
      if (j < n && source[j] === ";") {
        keep.push(source.slice(i, j + 1));
        i = j + 1;
        continue;
      }
      let depth = 0;
      let k = j;
      for (; k < n; k++) {
        if (source[k] === "{") depth++;
        else if (source[k] === "}") {
          depth--;
          if (depth === 0) {
            k++;
            break;
          }
        }
      }
      keep.push(source.slice(i, k));
      i = k;
      continue;
    }

    let j = i;
    while (j < n && source[j] !== "{") j++;
    if (j >= n) {
      keep.push(source.slice(i));
      break;
    }

    const selector = source.slice(i, j).trim();
    let depth = 0;
    let k = j;
    for (; k < n; k++) {
      if (source[k] === "{") depth++;
      else if (source[k] === "}") {
        depth--;
        if (depth === 0) {
          k++;
          break;
        }
      }
    }
    const block = source.slice(i, k);
    if (selector && testSel(selector)) move.push(block);
    else keep.push(block);
    i = k;
  }

  return { keep: keep.join("\n"), move: move.join("\n") };
}

if (!fs.existsSync(backupPath)) {
  console.error("Missing backup:", backupPath);
  process.exit(1);
}

fs.copyFileSync(backupPath, globalsPath);
const css = fs.readFileSync(globalsPath, "utf8");
const importRe = /^((?:@import[^;]+;\s*)+)/;
const headerMatch = css.match(importRe);
const headerStr = headerMatch ? headerMatch[1] : "";
let rest = headerMatch ? css.slice(headerMatch[1].length) : css;

const has = (s, token) => new RegExp(`(?:^|[\\s,#.>+~:\\[])(${token})(?:$|[\\s,#.>+~:\\[])`).test(s) || s.includes(`.${token}`);

const buckets = [
  {
    file: "app/page-conversion.css",
    test: (s) => /kpi-conversion/.test(s) || /\.db-/.test(s) || has(s, "db-"),
  },
  {
    file: "app/page-seo-local.css",
    test: (s) => /kpi-seo-local|seo-visual/.test(s),
  },
  {
    file: "app/page-google-ads.css",
    test: (s) => /kpi-google-ads|\.ads-/.test(s) && !/kpi-meta-ads/.test(s),
  },
  {
    file: "app/page-meta-ads.css",
    test: (s) => /kpi-meta-ads/.test(s),
  },
  {
    file: "app/page-b2b.css",
    test: (s) => /kpi-b2b/.test(s),
  },
  {
    file: "app/page-reservations.css",
    test: (s) => /kpi-reservations/.test(s),
  },
  {
    file: "app/page-systems.css",
    test: (s) => /kpi-systems/.test(s),
  },
  {
    file: "app/page-revenue.css",
    test: (s) => /kpi-revenue/.test(s),
  },
  {
    file: "app/page-website.css",
    test: (s) => /kpi-website/.test(s),
  },
  {
    file: "app/page-independent.css",
    test: (s) => /kpi-independent/.test(s),
  },
  {
    file: "app/page-training.css",
    test: (s) => /kpi-train/.test(s),
  },
  {
    file: "app/page-article.css",
    test: (s) => /kpi-article/.test(s),
  },
  {
    file: "app/page-about.css",
    test: (s) => /kpi-about/.test(s),
  },
  {
    file: "app/page-contact.css",
    test: (s) => /kpi-contact/.test(s),
  },
  {
    file: "app/page-case-study.css",
    test: (s) => /kpi-cs-/.test(s) || /kpi-cs\b/.test(s),
  },
  {
    file: "app/page-ai.css",
    test: (s) => /kpi-tech|kpi-search|kpi-ai-/.test(s),
  },
];

const report = [];
for (const bucket of buckets) {
  const { keep, move } = extractMatchingRules(rest, bucket.test);
  const out = path.join(root, bucket.file);
  fs.writeFileSync(
    out,
    `/* Extracted from globals.css — import only from the matching page view */\n${move}\n`,
  );
  rest = keep;
  report.push({ file: bucket.file, movedBytes: move.length });
}

fs.writeFileSync(globalsPath, `${headerStr}${rest}`);
report.push({ file: "app/globals.css", bytes: (headerStr + rest).length });
console.log(JSON.stringify(report, null, 2));
