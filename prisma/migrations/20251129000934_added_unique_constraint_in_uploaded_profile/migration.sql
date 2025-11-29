/*
  Warnings:

  - A unique constraint covering the columns `[userId,profileId]` on the table `UploadedProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UploadedProfile_userId_profileId_key" ON "UploadedProfile"("userId", "profileId");
