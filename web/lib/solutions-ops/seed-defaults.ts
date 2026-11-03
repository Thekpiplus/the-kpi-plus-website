import { prisma } from "@/lib/crm/db";
import { solutionGroups } from "@/lib/nav";
import { defaultSettings } from "./types";

/**
 * One-time structural seed: categories + service names/routes taken from the public nav.
 * Not an import UI. No descriptions, proof, metrics, or contact data are invented.
 * Runs only when the tables are empty and the settings row has no `seededAt` marker.
 */
const SERVICE_DEPARTMENT: Record<string, string> = {
  "/solutions/revenue-commercial-management": "revenue",
  "/solutions/outsourced-hotel-reservations": "reservations",
  "/solutions/b2b-agent-sales": "sales",
  "/solutions/google-ads-management": "marketing",
  "/solutions/meta-ads-management": "marketing",
  "/solutions/hotel-seo-google-maps-ai-search": "marketing",
  "/solutions/hotel-website-design": "marketing",
  "/solutions/hotel-direct-bookings": "distribution",
  "/solutions/independent-hotel-management": "management",
  "/solutions/hotel-systems-implementation": "systems-it-data",
  "/solutions/hotel-ai-automation": "systems-it-data",
  "/solutions/hotel-training-team-development": "training-hr-ld",
};

const CATEGORY_DEPARTMENT: Record<string, string> = {
  "grow-revenue": "revenue",
  "grow-demand": "marketing",
  "grow-capability": "management",
};

async function count(table: string) {
  const rows = await prisma().$queryRawUnsafe<Array<{ n: number | bigint }>>(`SELECT COUNT(*) AS n FROM ${table}`);
  return Number(rows[0]?.n ?? 0);
}

export async function seedSolutionsDefaultsIfEmpty() {
  const db = prisma();
  const settingsRows = await db.$queryRawUnsafe<Array<{ settingsJson: string | null }>>(
    `SELECT settingsJson FROM SolutionsOpsSettings WHERE id = 'default' LIMIT 1`,
  );
  let settings = defaultSettings();
  if (settingsRows[0]?.settingsJson) {
    try {
      settings = { ...settings, ...(JSON.parse(settingsRows[0].settingsJson) as object) };
    } catch {
      /* keep defaults */
    }
  }
  if (settings.seededAt) return;

  const [categories, services] = await Promise.all([count("SolutionsCategory"), count("SolutionsService")]);

  if (categories === 0) {
    let order = 0;
    for (const group of solutionGroups) {
      order += 1;
      await db.$executeRawUnsafe(
        `INSERT IGNORE INTO SolutionsCategory (id, name, description, ownerDepartment, sortOrder, status, createdBy, updatedBy) VALUES (?, ?, '', ?, ?, 'active', 'system', 'system')`,
        group.id,
        group.title,
        CATEGORY_DEPARTMENT[group.id] ?? "management",
        order,
      );
    }
  }

  if (services === 0) {
    for (const group of solutionGroups) {
      for (const item of group.items) {
        const slug = item.href.split("/").filter(Boolean).pop() ?? item.href;
        await db.$executeRawUnsafe(
          `INSERT IGNORE INTO SolutionsService (id, name, categoryId, ownerDepartment, publicRoute, status, payloadJson, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?, 'draft', '{}', 'system', 'system')`,
          `svc_${slug}`.slice(0, 190),
          item.label,
          group.id,
          SERVICE_DEPARTMENT[item.href] ?? "management",
          item.href,
        );
      }
    }
  }

  const next = { ...settings, seededAt: new Date().toISOString() };
  await db.$executeRawUnsafe(
    `INSERT INTO SolutionsOpsSettings (id, settingsJson, updatedBy) VALUES ('default', ?, 'system')
     ON DUPLICATE KEY UPDATE settingsJson = VALUES(settingsJson)`,
    JSON.stringify(next),
  );
}
