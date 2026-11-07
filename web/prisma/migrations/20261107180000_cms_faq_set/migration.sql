-- CreateTable
CREATE TABLE IF NOT EXISTS `CmsFaqSet` (
    `id` VARCHAR(191) NOT NULL,
    `route` VARCHAR(255) NOT NULL,
    `itemsJson` LONGTEXT NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CmsFaqSet_route_key`(`route`),
    INDEX `CmsFaqSet_route_idx`(`route`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
