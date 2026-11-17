import { readFileSync } from "node:fs";

const s = readFileSync("lib/insights.ts", "utf8");
const ids = [...s.matchAll(/id: "([^"]+)"/g)].map((x) => x[1]);
console.log("insight ids", ids.length, ids.join(", "));

function chunk(id) {
  const i = s.indexOf(`id: "${id}"`);
  return s.slice(i, i + 900);
}
for (const id of ["hotel-marketing", "hotel-seo", "what-is-ota"]) {
  const c = chunk(id);
  console.log(
    id,
    "related=",
    c.match(/relatedArticleIds: (\[[^\]]*\])/)?.[1],
    "sourcesEmpty=",
    /sources: \[\],/.test(c),
  );
}
