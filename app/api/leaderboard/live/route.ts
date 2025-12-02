import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    let anonId = cookieStore.get("anon_id")?.value;

    if (!anonId) {
      anonId = crypto.randomUUID();
      const res = NextResponse.json({ created: true });
      res.cookies.set("anon_id", anonId, {
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: true,
      });
      return res;
    }

   
    let leaderboard: any = await redis.get("leaderboard:live");

    if (leaderboard) {
      if (typeof leaderboard === "string")
        leaderboard = JSON.parse(leaderboard);
      return NextResponse.json(
        { liveLeaderBoard: leaderboard },
        { status: 200 }
      );
    }

    const liveLeaderBoard = await prisma.profile.findMany({
      orderBy: { elo: "desc" },
      take: 10,
    });

    await redis.set("leaderboard:live", JSON.stringify(liveLeaderBoard));

    return NextResponse.json({ liveLeaderBoard }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "liveLeaderboard Error" },
      { status: 500 }
    );
  }
}
