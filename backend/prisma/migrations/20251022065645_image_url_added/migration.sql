-- AlterTable
ALTER TABLE `parts` ADD COLUMN `image_url` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `parts_category_idx` ON `parts`(`category`);

-- CreateIndex
CREATE INDEX `parts_name_idx` ON `parts`(`name`);
