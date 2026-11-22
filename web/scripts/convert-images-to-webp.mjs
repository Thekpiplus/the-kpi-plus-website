import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const EXT = /\.(jpe?g|png|gif)$/i;
const SKIP_DIRS = new Set(["node_modules", ".next"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.test(entry.name)) out.push(full);
  }
  return out;
}

function webpPath(file) {
  return file.replace(EXT, ".webp");
}

async function convertFile(file) {
  const target = webpPath(file);
  const input = sharp(file);
  const meta = await input.metadata();
  const pipeline =
    meta.hasAlpha || /\.png$/i.test(file)
      ? input.webp({ quality: 82, alphaQuality: 90, effort: 4 })
      : input.webp({ quality: 82, effort: 4 });
  await pipeline.toFile(target);
  return target;
}

function collectTextFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTextFiles(full, out);
      continue;
    }
    if (/\.(ts|tsx|js|jsx|mjs|cjs|json|md|css|html|txt|svg)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function rewriteContent(text, renames) {
  let next = text;
  let hits = 0;
  for (const [from, to] of renames) {
    if (!next.includes(from)) continue;
    const parts = next.split(from);
    hits += parts.length - 1;
    next = parts.join(to);
  }
  return { next, hits };
}

const files = walk(publicDir);
console.log(`Found ${files.length} raster images under public/`);

const renames = [];
let converted = 0;
let failed = 0;

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const target = webpPath(file);
  const relWebp = path.relative(root, target).replace(/\\/g, "/");
  try {
    await convertFile(file);
    converted += 1;
    // Public URL paths (without public/)
    const urlFrom = "/" + path.relative(publicDir, file).replace(/\\/g, "/");
    const urlTo = "/" + path.relative(publicDir, target).replace(/\\/g, "/");
    renames.push([urlFrom, urlTo]);
    // Also absolute site URLs used in seo-manifest
    renames.push([`https://thekpiplus.com${urlFrom}`, `https://thekpiplus.com${urlTo}`]);
    // Absolute filesystem-ish and relative without leading slash variants
    renames.push([urlFrom.slice(1), urlTo.slice(1)]);
    console.log(`OK  ${rel} -> ${path.basename(relWebp)}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${rel}: ${error.message}`);
  }
}

// Longer paths first so nested replacements are stable
renames.sort((a, b) => b[0].length - a[0].length);

const textRoots = [path.join(root, "app"), path.join(root, "components"), path.join(root, "content"), path.join(root, "lib"), path.join(root, "public")];
let filesTouched = 0;
let replaceHits = 0;

for (const base of textRoots) {
  if (!fs.existsSync(base)) continue;
  for (const file of collectTextFiles(base)) {
    const before = fs.readFileSync(file, "utf8");
    const { next, hits } = rewriteContent(before, renames);
    if (!hits) continue;
    fs.writeFileSync(file, next, "utf8");
    filesTouched += 1;
    replaceHits += hits;
    console.log(`REF ${path.relative(root, file).replace(/\\/g, "/")} (${hits})`);
  }
}

// Also patch next.config.ts / package root configs if they reference images
for (const name of ["next.config.ts", "next.config.js", "middleware.ts"]) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const { next, hits } = rewriteContent(before, renames);
  if (!hits) continue;
  fs.writeFileSync(file, next, "utf8");
  filesTouched += 1;
  replaceHits += hits;
  console.log(`REF ${name} (${hits})`);
}

// Delete originals after successful conversion
let deleted = 0;
for (const file of files) {
  const target = webpPath(file);
  if (!fs.existsSync(target)) continue;
  fs.unlinkSync(file);
  deleted += 1;
}

console.log(
  JSON.stringify(
    {
      converted,
      failed,
      deleted,
      filesTouched,
      replaceHits,
    },
    null,
    2,
  ),
);
