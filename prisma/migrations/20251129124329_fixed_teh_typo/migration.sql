/*
  Warnings:

  - The primary key for the `VotePair` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VotePair` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `profileA` on the `VotePair` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `profileB` on the `VotePair` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "VotePair" DROP CONSTRAINT "VotePair_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "profileA",
ADD COLUMN     "profileA" INTEGER NOT NULL,
DROP COLUMN "profileB",
ADD COLUMN     "profileB" INTEGER NOT NULL,
ADD CONSTRAINT "VotePair_pkey" PRIMARY KEY ("id");
