/*
  Warnings:

  - Made the column `description` on table `sub_sections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timeDuration` on table `sub_sections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `videoUrl` on table `sub_sections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sub_sections" ADD COLUMN     "notesUrl" TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "timeDuration" SET NOT NULL,
ALTER COLUMN "videoUrl" SET NOT NULL;
