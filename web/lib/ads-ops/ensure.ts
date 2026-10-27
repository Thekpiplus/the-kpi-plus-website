import { prisma } from "@/lib/crm/db";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS \`AdsCampaign\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL DEFAULT '',
    \`hotelName\` VARCHAR(255) NOT NULL,
    \`channel\` VARCHAR(191) NOT NULL DEFAULT 'search_ads',
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
    \`accountRef\` VARCHAR(255) NOT NULL DEFAULT '',
    \`budgetNote\` VARCHAR(255) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`AdsCampaign_status_idx\` (\`status\`),
    INDEX \`AdsCampaign_ownerId_idx\` (\`ownerId\`),
    INDEX \`AdsCampaign_department_idx\` (\`department\`),
    INDEX \`AdsCampaign_channel_idx\` (\`channel\`),
    INDEX \`AdsCampaign_nextActionAt_idx\` (\`nextActionAt\`),
    INDEX \`AdsCampaign_approvalStatus_idx\` (\`approvalStatus\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsSubtask\` (
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
    INDEX \`AdsSubtask_campaignId_idx\` (\`campaignId\`),
    INDEX \`AdsSubtask_department_idx\` (\`department\`),
    INDEX \`AdsSubtask_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsSubtaskComment\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`subtaskId\` VARCHAR(191) NOT NULL,
    \`authorId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`body\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`AdsSubtaskComment_subtaskId_idx\` (\`subtaskId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsSubtaskFile\` (
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
    INDEX \`AdsSubtaskFile_subtaskId_idx\` (\`subtaskId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsActivity\` (
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
    INDEX \`AdsActivity_campaignId_idx\` (\`campaignId\`),
    INDEX \`AdsActivity_dueAt_idx\` (\`dueAt\`),
    INDEX \`AdsActivity_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsKpiEntry\` (
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
    INDEX \`AdsKpiEntry_campaignId_idx\` (\`campaignId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsNote\` (
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
    INDEX \`AdsNote_campaignId_idx\` (\`campaignId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsAuditEvent\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`campaignId\` VARCHAR(191) NOT NULL,
    \`action\` VARCHAR(80) NOT NULL,
    \`detail\` TEXT NOT NULL,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`AdsAuditEvent_campaignId_idx\` (\`campaignId\`),
    INDEX \`AdsAuditEvent_createdAt_idx\` (\`createdAt\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`AdsAccess\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`userId\` VARCHAR(191) NOT NULL,
    \`department\` VARCHAR(191) NOT NULL,
    \`canSeeAccounts\` BOOLEAN NOT NULL DEFAULT false,
    \`canSeeBudget\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`AdsAccess_userId_department_key\` (\`userId\`, \`department\`),
    INDEX \`AdsAccess_userId_idx\` (\`userId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

const COLUMNS: Array<[string, string, string]> = [
  ["AdsCampaign", "name", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "objective", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "market", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "language", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "startAt", "DATETIME(3) NULL"],
  ["AdsCampaign", "endAt", "DATETIME(3) NULL"],
  ["AdsCampaign", "budgetAmount", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "budgetPeriod", "VARCHAR(191) NOT NULL DEFAULT 'monthly'"],
  ["AdsCampaign", "landingUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "bookingUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "trackingStatus", "VARCHAR(191) NOT NULL DEFAULT 'not_set'"],
  ["AdsCampaign", "primaryKpi", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "kpiTarget", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "approvalStatus", "VARCHAR(191) NOT NULL DEFAULT 'not_requested'"],
  ["AdsCampaign", "audienceIntent", "TEXT NULL"],
  ["AdsCampaign", "adsCreative", "TEXT NULL"],
  ["AdsCampaign", "landingNotes", "TEXT NULL"],
  ["AdsCampaign", "trackingNotes", "TEXT NULL"],
  ["AdsCampaign", "reportNotes", "TEXT NULL"],
  ["AdsCampaign", "searchIntent", "TEXT NULL"],
  ["AdsCampaign", "adCopy", "TEXT NULL"],
  ["AdsCampaign", "audience", "TEXT NULL"],
  ["AdsCampaign", "campaignMessaging", "TEXT NULL"],
  ["AdsCampaign", "creativeNotes", "TEXT NULL"],
  ["AdsCampaign", "offerPromotion", "TEXT NULL"],
  ["AdsCampaign", "rateContext", "TEXT NULL"],
  ["AdsCampaign", "roasTarget", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["AdsCampaign", "bookingValueNotes", "TEXT NULL"],
  ["AdsCampaign", "rateFeed", "TEXT NULL"],
  ["AdsCampaign", "hotelAdsQuality", "TEXT NULL"],
  ["AdsCampaign", "channelConsistency", "TEXT NULL"],
  ["AdsCampaign", "bookingEngineNotes", "TEXT NULL"],
  ["AdsCampaign", "landingContent", "TEXT NULL"],
  ["AdsCampaign", "hotelValueProp", "TEXT NULL"],
  ["AdsCampaign", "marketPartnerContext", "TEXT NULL"],
  ["AdsCampaign", "leadFollowUp", "TEXT NULL"],
  ["AdsCampaign", "budgetAuth", "TEXT NULL"],
  ["AdsCampaign", "kpiReview", "TEXT NULL"],
  ["AdsCampaign", "finalDecision", "TEXT NULL"],
  ["AdsCampaign", "escalatedAt", "DATETIME(3) NULL"],
  ["AdsCampaign", "closedAt", "DATETIME(3) NULL"],
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
      `ALTER TABLE \`${table}\` ADD CONSTRAINT \`${name}\` FOREIGN KEY (\`campaignId\`) REFERENCES \`AdsCampaign\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  } catch {
    // Constraint may already exist.
  }
}

export async function ensureAdsOpsSchema() {
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
        await prisma().$executeRawUnsafe(`UPDATE \`AdsCampaign\` SET \`${column}\` = '' WHERE \`${column}\` IS NULL`);
      } catch {
        // Column may be datetime or missing.
      }
    }
    await addForeignKey("AdsActivity_campaignId_fkey", "AdsActivity");
    await addForeignKey("AdsKpiEntry_campaignId_fkey", "AdsKpiEntry");
    await addForeignKey("AdsNote_campaignId_fkey", "AdsNote");
    await addForeignKey("AdsAuditEvent_campaignId_fkey", "AdsAuditEvent");
    await addForeignKey("AdsSubtask_campaignId_fkey", "AdsSubtask");
    try {
      await prisma().$executeRawUnsafe(
        `ALTER TABLE \`AdsSubtaskComment\` ADD CONSTRAINT \`AdsSubtaskComment_subtaskId_fkey\` FOREIGN KEY (\`subtaskId\`) REFERENCES \`AdsSubtask\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
      );
    } catch {
      // Constraint may already exist.
    }
    try {
      await prisma().$executeRawUnsafe(
        `ALTER TABLE \`AdsSubtaskFile\` ADD CONSTRAINT \`AdsSubtaskFile_subtaskId_fkey\` FOREIGN KEY (\`subtaskId\`) REFERENCES \`AdsSubtask\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
      );
    } catch {
      // Constraint may already exist.
    }
  } catch {
    // Database may be unavailable during build.
  }
}
