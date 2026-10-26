CREATE TABLE `ReservationOperation` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `channel` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `assigneeId` VARCHAR(191) NOT NULL DEFAULT '',
    `dueAt` DATETIME(3) NULL,
    `hotelName` VARCHAR(255) NOT NULL DEFAULT '',
    `guestName` VARCHAR(255) NOT NULL DEFAULT '',
    `guestEmail` VARCHAR(255) NOT NULL DEFAULT '',
    `guestPhone` VARCHAR(64) NOT NULL DEFAULT '',
    `bookingCode` VARCHAR(64) NOT NULL DEFAULT '',
    `notes` TEXT NOT NULL,
    `closedAt` DATETIME(3) NULL,
    `escalatedAt` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT '',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `ReservationOperation_reference_key` ON `ReservationOperation`(`reference`);
CREATE INDEX `ReservationOperation_status_idx` ON `ReservationOperation`(`status`);
CREATE INDEX `ReservationOperation_type_idx` ON `ReservationOperation`(`type`);
CREATE INDEX `ReservationOperation_channel_idx` ON `ReservationOperation`(`channel`);
CREATE INDEX `ReservationOperation_assigneeId_idx` ON `ReservationOperation`(`assigneeId`);
CREATE INDEX `ReservationOperation_dueAt_idx` ON `ReservationOperation`(`dueAt`);

CREATE TABLE `ReservationSubtask` (
    `id` VARCHAR(191) NOT NULL,
    `operationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'open',
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `dueAt` DATETIME(3) NULL,
    `assigneeId` VARCHAR(191) NOT NULL DEFAULT '',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `comments` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `ReservationSubtask_operationId_idx` ON `ReservationSubtask`(`operationId`);
ALTER TABLE `ReservationSubtask` ADD CONSTRAINT `ReservationSubtask_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `ReservationOperation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `ReservationOpComment` (
    `id` VARCHAR(191) NOT NULL,
    `operationId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `ReservationOpComment_operationId_idx` ON `ReservationOpComment`(`operationId`);
ALTER TABLE `ReservationOpComment` ADD CONSTRAINT `ReservationOpComment_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `ReservationOperation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `ReservationOpAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `operationId` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `mime` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `path` VARCHAR(500) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `ReservationOpAttachment_operationId_idx` ON `ReservationOpAttachment`(`operationId`);
ALTER TABLE `ReservationOpAttachment` ADD CONSTRAINT `ReservationOpAttachment_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `ReservationOperation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
