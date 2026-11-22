/**
 * Ensure AppServ DB `kpi_plus_dev` exists (cloned from `kpi_plus` when empty)
 * and write `.env.local` so local Next/Prisma never share the Hostinger DB.
 *
 * Does not modify Hostinger. Does not drop `kpi_plus`.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const localPath = path.join(root, ".env.local");
const mysqlBin = "C:\\AppServ\\MySQL\\bin\\mysql.exe";
const dumpBin = "C:\\AppServ\\MySQL\\bin\\mysqldump.exe";
const LOCAL_DB = "kpi_plus_dev";
const SOURCE_DB = "kpi_plus";

const envText = fs.readFileSync(envPath, "utf8");
const match = envText.match(
  /^DATABASE_URL="(mysql:\/\/root:([^@]+)@127\.0\.0\.1:3306\/)([^?"]+)(\?[^"]*)"/m,
);
if (!match) {
  throw new Error("Expected a local root@127.0.0.1 DATABASE_URL in .env");
}
const [, prefix, password, , query] = match;
const localUrl = `${prefix}${LOCAL_DB}${query}`;

function mysql(args, opts = {}) {
  return spawnSync(mysqlBin, ["--no-defaults", "--host=127.0.0.1", "--user=root", `--password=${password}`, ...args], {
    encoding: "utf8",
    ...opts,
  });
}

if (!fs.existsSync(mysqlBin) || !fs.existsSync(dumpBin)) {
  throw new Error("AppServ MySQL client/dump not found under C:\\AppServ\\MySQL\\bin");
}

const create = mysql(["-e", `CREATE DATABASE IF NOT EXISTS \`${LOCAL_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`]);
if (create.status !== 0) {
  throw new Error(`CREATE DATABASE failed: ${(create.stderr || create.stdout || "").slice(0, 400)}`);
}

const count = mysql(["-N", "-e", `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${LOCAL_DB}';`]);
const tableCount = Number((count.stdout || "").trim() || "0");
if (!Number.isFinite(tableCount)) {
  throw new Error(`Could not count tables in ${LOCAL_DB}`);
}

if (tableCount === 0) {
  const dumpFile = path.join(os.tmpdir(), `${LOCAL_DB}-from-${SOURCE_DB}.sql`);
  const dump = spawnSync(
    dumpBin,
    [
      "--no-defaults",
      "--host=127.0.0.1",
      "--user=root",
      `--password=${password}`,
      "--single-transaction",
      "--routines",
      "--triggers",
      SOURCE_DB,
      `--result-file=${dumpFile}`,
    ],
    { encoding: "utf8" },
  );
  if (dump.status !== 0 || !fs.existsSync(dumpFile)) {
    throw new Error(`mysqldump ${SOURCE_DB} failed: ${(dump.stderr || dump.stdout || "").slice(0, 400)}`);
  }
  const size = fs.statSync(dumpFile).size;
  if (size < 1000) {
    throw new Error(`mysqldump produced a tiny file (${size} bytes)`);
  }
  const imp = spawnSync(
    mysqlBin,
    ["--no-defaults", "--host=127.0.0.1", "--user=root", `--password=${password}`, LOCAL_DB],
    { encoding: "utf8", input: fs.readFileSync(dumpFile) },
  );
  fs.unlinkSync(dumpFile);
  if (imp.status !== 0) {
    throw new Error(`import into ${LOCAL_DB} failed: ${(imp.stderr || imp.stdout || "").slice(0, 400)}`);
  }
  console.log(`Cloned ${SOURCE_DB} → ${LOCAL_DB} (${size} bytes)`);
} else {
  console.log(`${LOCAL_DB} already has ${tableCount} tables — left unchanged`);
}

fs.writeFileSync(
  localPath,
  [
    "# Local-only overrides (gitignored). Never put Hostinger credentials here.",
    "# Production DATABASE_URL stays in Hostinger Node.js environment variables only.",
    `DATABASE_URL="${localUrl}"`,
    'CRM_BASE_URL="http://localhost:3000"',
    "# Leave blank. Set to 1 only if you intentionally need remote MySQL from this PC.",
    "ALLOW_REMOTE_DB=",
    "",
  ].join("\n"),
);

console.log(`Wrote .env.local → ${LOCAL_DB}`);
console.log("Online DB remains separate (Hostinger env only).");
