/*
  Warnings:

  - Added the required column `updatedAt` to the `sub_sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sub_sections" DROP CONSTRAINT "sub_sections_sectionId_fkey";

-- AlterTable
ALTER TABLE "sub_sections" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "notesUrls" SET DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "sub_sections" ADD CONSTRAINT "sub_sections_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
