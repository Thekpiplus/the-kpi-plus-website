import { prisma } from "@/lib/crm/db";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS \`MetaCampaign\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL DEFAULT '',
    \`hotelName\` VARCHAR(255) NOT NULL,
    \`channel\` VARCHAR(191) NOT NULL DEFAULT 'awareness',
    \`objective\` VARCHAR(500) NOT NULL DEFAULT '',
    \`market\` VARCHAR(255) NOT NULL DEFAULT '',
    \`language\` VARCHAR(80) NOT NULL DEFAULT '',
    \`startAt\` DATETIME(3) NULL,
    \`endAt\` DATETIME(3) NULL,
    \`budgetAmount\` VARCHAR(80) NOT NULL DEFAULT '',
    \`budgetPeriod\` VARCHAR(191) NOT NULL DEFAULT 'monthly',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`ownerId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`department\` VARCHAR(191) NOT NULL DEFAULT 'marketing',
    \`priority\` VARCHAR(191) NOT NULL DEFAULT 'normal',
    \`nextAction\` VARCHAR(500) NOT NULL DEFAULT '',
    \`nextActionAt\` DATETIME(3) NULL,
    \`landingUrl\` VARCHAR(500) NOT NULL DEFAULT '',
    \`bookingUrl\` VARCHAR(500) NOT NULL DEFAULT '',
    \`trackingStatus\` VARCHAR(191) NOT NULL DEFAULT 'not_set',
    \`primaryKpi\` VARCHAR(255) NOT NULL DEFAULT '',
    \`kpiTarget\` VARCHAR(255) NOT NULL DEFAULT '',
    \`approvalStatus\` VARCHAR(191) NOT NULL DEFAULT 'not_requested',
    \`notes\` TEXT NOT NULL,
    \`audienceIntent\` TEXT NOT NULL,
    \`adsCreative\` TEXT NOT NULL,
    \`landingNotes\` TEXT NOT NULL,
    \`trackingNotes\` TEXT NOT NULL,
    \`reportNotes\` TEXT NOT NULL,
    \`audienceSegment\` VARCHAR(255) NOT NULL DEFAULT '',
    \`creativeMatrixRef\` VARCHAR(255) NOT NULL DEFAULT '',
    \`remarketingNotes\` TEXT NOT NULL,
    \`pixelRef\` VARCHAR(255) NOT NULL DEFAULT '',
    \`accountRef\` VARCHAR(255) NOT NULL DEFAULT '',
    \`budgetNote\` VARCHAR(255) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`MetaCampaign_status_idx\` (\`status\`),
    INDEX \`MetaCampaign_ownerId_idx\` (\`ownerId\`),
    INDEX \`MetaCampaign_department_idx\` (\`department\`),
    INDEX \`MetaCampaign_channel_idx\` (\`channel\`),
    INDEX \`MetaCampaign_nextActionAt_idx\` (\`nextActionAt\`),
    INDEX \`MetaCampaign_approvalStatus_idx\` (\`approvalStatus\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaSubtask\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`campaignId\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`department\` VARCHAR(191) NOT NULL DEFAULT 'marketing',
    \`ownerId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'not_started',
    \`completed\` BOOLEAN NOT NULL DEFAULT false,
    \`dueAt\` DATETIME(3) NULL,
    \`priority\` VARCHAR(191) NOT NULL DEFAULT 'normal',
    \`comments\` TEXT NOT NULL,
    \`sortOrder\` INT NOT NULL DEFAULT 0,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`MetaSubtask_campaignId_idx\` (\`campaignId\`),
    INDEX \`MetaSubtask_department_idx\` (\`department\`),
    INDEX \`MetaSubtask_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaSubtaskComment\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`subtaskId\` VARCHAR(191) NOT NULL,
    \`authorId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`body\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`MetaSubtaskComment_subtaskId_idx\` (\`subtaskId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaSubtaskFile\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`subtaskId\` VARCHAR(191) NOT NULL,
    \`filename\` VARCHAR(255) NOT NULL,
    \`mime\` VARCHAR(191) NOT NULL,
    \`size\` INT NOT NULL,
    \`path\` VARCHAR(500) NOT NULL,
    \`caption\` VARCHAR(500) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`MetaSubtaskFile_subtaskId_idx\` (\`subtaskId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaActivity\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`campaignId\` VARCHAR(191) NOT NULL,
    \`type\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`dueAt\` DATETIME(3) NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'planned',
    \`notes\` TEXT NOT NULL,
    \`ownerId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`MetaActivity_campaignId_idx\` (\`campaignId\`),
    INDEX \`MetaActivity_dueAt_idx\` (\`dueAt\`),
    INDEX \`MetaActivity_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaKpiEntry\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`campaignId\` VARCHAR(191) NOT NULL,
    \`period\` VARCHAR(120) NOT NULL DEFAULT '',
    \`metric\` VARCHAR(255) NOT NULL DEFAULT '',
    \`value\` VARCHAR(120) NOT NULL DEFAULT '',
    \`target\` VARCHAR(120) NOT NULL DEFAULT '',
    \`dataStatus\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`notes\` TEXT NOT NULL,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`MetaKpiEntry_campaignId_idx\` (\`campaignId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaNote\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`campaignId\` VARCHAR(191) NOT NULL,
    \`kind\` VARCHAR(191) NOT NULL DEFAULT 'note',
    \`title\` VARCHAR(255) NOT NULL DEFAULT '',
    \`body\` TEXT NOT NULL,
    \`url\` VARCHAR(500) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`MetaNote_campaignId_idx\` (\`campaignId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaAuditEvent\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`campaignId\` VARCHAR(191) NOT NULL,
    \`action\` VARCHAR(80) NOT NULL,
    \`detail\` TEXT NOT NULL,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`MetaAuditEvent_campaignId_idx\` (\`campaignId\`),
    INDEX \`MetaAuditEvent_createdAt_idx\` (\`createdAt\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`MetaAccess\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`userId\` VARCHAR(191) NOT NULL,
    \`department\` VARCHAR(191) NOT NULL,
    \`canSeeAccounts\` BOOLEAN NOT NULL DEFAULT false,
    \`canSeeBudget\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`MetaAccess_userId_department_key\` (\`userId\`, \`department\`),
    INDEX \`MetaAccess_userId_idx\` (\`userId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

const COLUMNS: Array<[string, string, string]> = [
  ["MetaCampaign", "name", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "objective", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "market", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "language", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "startAt", "DATETIME(3) NULL"],
  ["MetaCampaign", "endAt", "DATETIME(3) NULL"],
  ["MetaCampaign", "budgetAmount", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "budgetPeriod", "VARCHAR(191) NOT NULL DEFAULT 'monthly'"],
  ["MetaCampaign", "landingUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "bookingUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "trackingStatus", "VARCHAR(191) NOT NULL DEFAULT 'not_set'"],
  ["MetaCampaign", "primaryKpi", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "kpiTarget", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "approvalStatus", "VARCHAR(191) NOT NULL DEFAULT 'not_requested'"],
  ["MetaCampaign", "audienceIntent", "TEXT NULL"],
  ["MetaCampaign", "adsCreative", "TEXT NULL"],
  ["MetaCampaign", "landingNotes", "TEXT NULL"],
  ["MetaCampaign", "trackingNotes", "TEXT NULL"],
  ["MetaCampaign", "reportNotes", "TEXT NULL"],
  ["MetaCampaign", "searchIntent", "TEXT NULL"],
  ["MetaCampaign", "adCopy", "TEXT NULL"],
  ["MetaCampaign", "audience", "TEXT NULL"],
  ["MetaCampaign", "campaignMessaging", "TEXT NULL"],
  ["MetaCampaign", "creativeNotes", "TEXT NULL"],
  ["MetaCampaign", "offerPromotion", "TEXT NULL"],
  ["MetaCampaign", "rateContext", "TEXT NULL"],
  ["MetaCampaign", "roasTarget", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "bookingValueNotes", "TEXT NULL"],
  ["MetaCampaign", "rateFeed", "TEXT NULL"],
  ["MetaCampaign", "hotelAdsQuality", "TEXT NULL"],
  ["MetaCampaign", "channelConsistency", "TEXT NULL"],
  ["MetaCampaign", "bookingEngineNotes", "TEXT NULL"],
  ["MetaCampaign", "landingContent", "TEXT NULL"],
  ["MetaCampaign", "hotelValueProp", "TEXT NULL"],
  ["MetaCampaign", "marketPartnerContext", "TEXT NULL"],
  ["MetaCampaign", "leadFollowUp", "TEXT NULL"],
  ["MetaCampaign", "budgetAuth", "TEXT NULL"],
  ["MetaCampaign", "kpiReview", "TEXT NULL"],
  ["MetaCampaign", "finalDecision", "TEXT NULL"],
  ["MetaCampaign", "escalatedAt", "DATETIME(3) NULL"],
  ["MetaCampaign", "closedAt", "DATETIME(3) NULL"],
  ["MetaCampaign", "audienceSegment", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "creativeMatrixRef", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["MetaCampaign", "remarketingNotes", "TEXT NULL"],
  ["MetaCampaign", "pixelRef", "VARCHAR(255) NOT NULL DEFAULT ''"],
];

async function addColumn(table: string, column: string, definition: string) {
  try {
    await prisma().$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  } catch {
    // Column already exists.
  }
}

async function addForeignKey(name: string, table: string) {
  try {
    await prisma().$executeRawUnsafe(
      `ALTER TABLE \`${table}\` ADD CONSTRAINT \`${name}\` FOREIGN KEY (\`campaignId\`) REFERENCES \`MetaCampaign\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  } catch {
    // Constraint may already exist.
  }
}

export async function ensureMetaOpsSchema() {
  try {
    for (const sql of TABLES) {
      await prisma().$executeRawUnsafe(sql);
    }
    for (const [table, column, definition] of COLUMNS) {
      await addColumn(table, column, definition);
    }
    const textColumns = COLUMNS.filter(([, , definition]) => definition.startsWith("TEXT") || definition.startsWith("VARCHAR")).map(
      ([, column]) => column,
    );
    for (const column of textColumns) {
      try {
        await prisma().$executeRawUnsafe(`UPDATE \`MetaCampaign\` SET \`${column}\` = '' WHERE \`${column}\` IS NULL`);
      } catch {
        // Column may be datetime or missing.
      }
    }
    await addForeignKey("MetaActivity_campaignId_fkey", "MetaActivity");
    await addForeignKey("MetaKpiEntry_campaignId_fkey", "MetaKpiEntry");
    await addForeignKey("MetaNote_campaignId_fkey", "MetaNote");
    await addForeignKey("MetaAuditEvent_campaignId_fkey", "MetaAuditEvent");
    await addForeignKey("MetaSubtask_campaignId_fkey", "MetaSubtask");
    try {
      await prisma().$executeRawUnsafe(
        `ALTER TABLE \`MetaSubtaskComment\` ADD CONSTRAINT \`MetaSubtaskComment_subtaskId_fkey\` FOREIGN KEY (\`subtaskId\`) REFERENCES \`MetaSubtask\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
      );
    } catch {
      // Constraint may already exist.
    }
    try {
      await prisma().$executeRawUnsafe(
        `ALTER TABLE \`MetaSubtaskFile\` ADD CONSTRAINT \`MetaSubtaskFile_subtaskId_fkey\` FOREIGN KEY (\`subtaskId\`) REFERENCES \`MetaSubtask\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
      );
    } catch {
      // Constraint may already exist.
    }
  } catch {
    // Database may be unavailable during build.
  }
}
