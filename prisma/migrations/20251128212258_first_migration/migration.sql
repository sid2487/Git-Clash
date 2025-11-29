-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "followers" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "repos" INTEGER NOT NULL,
    "totalContributions" INTEGER NOT NULL,
    "prs" INTEGER,
    "issues" INTEGER,
    "commits" INTEGER,
    "elo" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousUser" (
    "id" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerId" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyHistory" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "elo" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "WeeklyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllTimeHistory" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "weekCount" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "elo" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "AllTimeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeenProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "SeenProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "UploadedProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyHistory_profileId_week_key" ON "WeeklyHistory"("profileId", "week");

-- CreateIndex
CREATE UNIQUE INDEX "AllTimeHistory_profileId_week_key" ON "AllTimeHistory"("profileId", "week");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyHistory" ADD CONSTRAINT "WeeklyHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllTimeHistory" ADD CONSTRAINT "AllTimeHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenProfile" ADD CONSTRAINT "SeenProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenProfile" ADD CONSTRAINT "SeenProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedProfile" ADD CONSTRAINT "UploadedProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymousUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedProfile" ADD CONSTRAINT "UploadedProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
