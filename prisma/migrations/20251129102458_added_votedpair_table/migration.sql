-- CreateTable
CREATE TABLE "VotePair" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileA" TEXT NOT NULL,
    "profileB" TEXT NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotePair_pkey" PRIMARY KEY ("id")
);
