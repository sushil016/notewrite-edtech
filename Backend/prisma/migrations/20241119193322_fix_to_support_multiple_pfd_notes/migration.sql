/*
  Warnings:

  - You are about to drop the column `notesUrl` on the `sub_sections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sub_sections" DROP COLUMN "notesUrl",
ADD COLUMN     "notesUrls" TEXT[];
