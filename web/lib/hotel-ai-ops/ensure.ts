import { prisma } from "@/lib/crm/db";

const WORKFLOW_COLUMNS: Array<[string, string]> = [
  ["createdBy", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["updatedBy", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["problem", "TEXT NULL"],
  ["currentProcess", "TEXT NULL"],
  ["frequency", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["systems", "TEXT NULL"],
  ["dataClass", "VARCHAR(32) NOT NULL DEFAULT 'internal'"],
  ["sourceOfTruth", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["manualSteps", "TEXT NULL"],
  ["exceptions", "TEXT NULL"],
  ["userImpact", "TEXT NULL"],
  ["objective", "TEXT NULL"],
  ["approach", "VARCHAR(32) NOT NULL DEFAULT 'do_not_automate'"],
  ["reviewer", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["fallback", "TEXT NULL"],
  ["risk", "VARCHAR(32) NOT NULL DEFAULT 'medium'"],
  ["nextActionAt", "DATETIME NULL"],
  ["vaultRef", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["archived", "BOOLEAN NOT NULL DEFAULT false"],
  ["charterJson", "LONGTEXT NULL"],
  ["useCasesJson", "LONGTEXT NULL"],
  ["accessJson", "LONGTEXT NULL"],
  ["testsJson", "LONGTEXT NULL"],
  ["issuesJson", "LONGTEXT NULL"],
  ["metricsJson", "LONGTEXT NULL"],
  ["handoverJson", "LONGTEXT NULL"],
  ["approvalsJson", "LONGTEXT NULL"],
  ["commentsJson", "LONGTEXT NULL"],
];

async function addColumn(table: string, name: string, definition: string) {
  try {
    await prisma().$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  } catch {
    /* already present */
  }
}

export async function ensureHotelAiOpsSchema() {
  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelAiWorkflow (
      id VARCHAR(191) NOT NULL,
      name VARCHAR(191) NOT NULL DEFAULT '',
      hotelName VARCHAR(191) NOT NULL DEFAULT '',
      department VARCHAR(64) NOT NULL DEFAULT 'operations',
      ownerId VARCHAR(191) NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'backlog',
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      nextAction VARCHAR(500) NOT NULL DEFAULT '',
      notes TEXT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelAiWorkflow_status_idx (status),
      INDEX HotelAiWorkflow_department_idx (department),
      INDEX HotelAiWorkflow_owner_idx (ownerId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  for (const [name, definition] of WORKFLOW_COLUMNS) {
    await addColumn("HotelAiWorkflow", name, definition);
  }

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelAiAccess (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      department VARCHAR(64) NOT NULL,
      canSeePrivateIds BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelAiAccess_userId_idx (userId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelAiSettings (
      id VARCHAR(191) NOT NULL,
      extraDepartmentsJson LONGTEXT NULL,
      secretVaultLabel VARCHAR(191) NOT NULL DEFAULT '',
      secretVaultUrl VARCHAR(500) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelAiAudit (
      id VARCHAR(191) NOT NULL,
      workflowId VARCHAR(191) NOT NULL,
      action VARCHAR(191) NOT NULL DEFAULT '',
      detail TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelAiAudit_workflowId_idx (workflowId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelAiSubtask (
      id VARCHAR(191) NOT NULL,
      workflowId VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(64) NOT NULL DEFAULT 'operations',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'not_started',
      completed BOOLEAN NOT NULL DEFAULT false,
      dueAt DATETIME NULL,
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      comments TEXT NULL,
      evidence VARCHAR(500) NOT NULL DEFAULT '',
      sortOrder INT NOT NULL DEFAULT 0,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelAiSubtask_workflowId_idx (workflowId),
      INDEX HotelAiSubtask_department_idx (department)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await addColumn("HotelAiSubtask", "reviewerId", "VARCHAR(191) NOT NULL DEFAULT ''");
  await addColumn("HotelAiSubtask", "gateKind", "VARCHAR(32) NOT NULL DEFAULT 'none'");

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelAiSubtaskComment (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelAiSubtaskComment_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
