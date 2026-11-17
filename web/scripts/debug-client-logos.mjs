import { createRequire } from "module";

// Use the app's compiled path helpers via dynamic import of store through next isn't easy.
// Hit a tiny debug endpoint pattern: read via prisma from the same env the app uses.
const require = createRequire(import.meta.url);

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const tables = await prisma.$queryRawUnsafe(
      "SHOW TABLES LIKE 'CmsClientLogo'",
    ).catch(() => null);
    console.log("tables", tables);

    const countRows = await prisma.$queryRawUnsafe(
      "SELECT COUNT(*) AS n FROM `CmsClientLogo`",
    );
    console.log("count", countRows);

    const sample = await prisma.$queryRawUnsafe(
      "SELECT name, filePath, permission, isActive FROM `CmsClientLogo` ORDER BY sortOrder ASC LIMIT 12",
    );
    console.log("sample", sample);

    const { existsSync } = await import("fs");
    const { join } = await import("path");
    const missing = [];
    for (const row of sample) {
      const src = String(row.filePath || "");
      const ok =
        src.startsWith("/media/cms/") ||
        existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
      if (!ok) missing.push(src);
    }
    console.log("missingOnDisk", missing);
  } catch (error) {
    console.error("error", error?.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
