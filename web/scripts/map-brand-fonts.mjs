import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = [path.join(root, "app"), path.join(root, "components")];
const files = [];

function walk(d) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walk(p);
    } else if (/\.css$/.test(ent.name)) files.push(p);
  }
}
roots.forEach(walk);

let changed = 0;
for (const f of files) {
  const c = fs.readFileSync(f, "utf8");
  const next = c
    .replace(/"Poppins"/g, '"Montserrat"')
    .replace(/Poppins/g, "Montserrat")
    .replace(/"Prompt"/g, '"Noto Sans Thai"')
    .replace(/Prompt/g, '"Noto Sans Thai"')
    .replace(/"Sarabun"/g, '"Noto Sans Thai"')
    .replace(/(?<!["\w])Sarabun(?!["\w])/g, '"Noto Sans Thai"')
    .replace(/""Noto Sans Thai""/g, '"Noto Sans Thai"');
  if (next !== c) {
    fs.writeFileSync(f, next);
    changed += 1;
    console.log("font", path.relative(root, f));
  }
}
console.log("filesChanged", changed);
