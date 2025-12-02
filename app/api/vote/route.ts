import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

function pairKey(a: number, b: number) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

export async function POST(req: NextRequest) {
  try {
    const { winnerId, loserId } = await req.json();

    const cookieStore = await cookies();
    let anonId = cookieStore.get("anon_id")?.value;
    let responseCookies: NextResponse | null = null;

    if (!anonId) {
      anonId = crypto.randomUUID();

      responseCookies = NextResponse.json({});
      responseCookies.cookies.set("anon_id", anonId, {
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: true,
      });
    }

    await prisma.anonymousUser.upsert({
      where: { id: anonId },
      update: {},
      create: { id: anonId },
    });

    const winner = await prisma.profile.findUnique({ where: { id: winnerId } });
    const loser = await prisma.profile.findUnique({ where: { id: loserId } });

    if (!winner || !loser) {
      return NextResponse.json({ error: "Invalid profiles" }, { status: 400 });
    }

    const K = 20;
    const expectedWinner =
      1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
    const expectedLoser =
      1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

    const newWinnerElo = Math.round(winner.elo + K * (1 - expectedWinner));
    const newLoserElo = Math.round(loser.elo + K * (0 - expectedLoser));

    await prisma.$transaction([
      prisma.profile.update({
        where: { id: winnerId },
        data: { elo: newWinnerElo },
      }),

      prisma.profile.update({
        where: { id: loserId },
        data: { elo: newLoserElo },
      }),

      prisma.vote.create({
        data: { userId: anonId, winnerId, loserId },
      }),

      prisma.votePair.create({
        data: {
          userId: anonId,
          profileA: winnerId,
          profileB: loserId,
        },
      }),

      prisma.seenProfile.createMany({
        data: [
          { userId: anonId, profileId: winnerId },
          { userId: anonId, profileId: loserId },
        ],
        skipDuplicates: true,
      }),
    ]);

    const key = pairKey(winnerId, loserId);
    await redis.sadd(`seen_pairs:${anonId}`, key);

    const top10 = await prisma.profile.findMany({
      orderBy: { elo: "desc" },
      take: 10,
    });

    await redis.set("leaderboard:live", JSON.stringify(top10));

    const allProfiles = await prisma.profile.findMany();
    await redis.set("profiles:list", JSON.stringify(allProfiles));


    const response = NextResponse.json(
      {
        success: true,
        updatedWinnerElo: newWinnerElo,
        updatedLoserElo: newLoserElo,
        leaderboard: top10,
      },
      { status: 200 }
    );

    if (responseCookies) {
      response.cookies.set("anon_id", anonId, {
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: true,
      });
    }

    return response;
  } catch (err) {
    console.log("VOTE API ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
