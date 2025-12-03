import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { Profile } from "@prisma/client";


function pairKey(a: number, b: number) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const anonId = cookieStore.get("anon_id")?.value;

    if (!anonId) {
      return NextResponse.json(
        { error: "User not initialized" },
        { status: 400 }
      );
    }

    const winnerId = Number(req.nextUrl.searchParams.get("winner"));
    const loserId = Number(req.nextUrl.searchParams.get("loser"));

    if (!winnerId || !loserId) {
      return NextResponse.json(
        { error: "Winner/loser missing" },
        { status: 400 }
      );
    }

    let allProfiles: Profile[] = await redis.get("profiles:list") as Profile[];

    if (!allProfiles) {
      const fromDB = await prisma.profile.findMany();
      await redis.set("profiles:list", JSON.stringify(fromDB));
      allProfiles = fromDB;
    } else {
      if (typeof allProfiles === "string") {
        allProfiles = JSON.parse(allProfiles);
      }
    }

    let candidates: Profile[] = [];

    for (const p of allProfiles) {
      if (p.id === winnerId || p.id === loserId) continue;

      const seen = await redis.sismember(
        `seen_pairs:${anonId}`,
        pairKey(loserId, p.id)
      );

      if (!seen) candidates.push(p);
    }

    if (candidates.length === 0) {
      const allowWinner = !(await redis.sismember(
        `seen_pairs:${anonId}`,
        pairKey(loserId, winnerId)
      ));

      if (allowWinner) {
        const winnerProfile = allProfiles.find((p) => p.id === winnerId);

        if (!winnerProfile) {
          return NextResponse.json(
            { error: "Winner profile not found" },
            { status: 400 }
          );
        }

        candidates.push(winnerProfile);
      } else {
        return NextResponse.json(
          { error: "No more fresh matches for this loser" },
          { status: 400 }
        );
      }
    }


    const nextProfile =
      candidates[Math.floor(Math.random() * candidates.length)];

    await redis.sadd(`seen_pairs:${anonId}`, pairKey(winnerId, nextProfile.id));

    return NextResponse.json({ result: nextProfile });
  } catch (err) {
    console.error("ONE ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
