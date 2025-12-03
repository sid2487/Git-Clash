import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

function pairKey(a: number, b: number) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    let anonId = cookieStore.get("anon_id")?.value;

    let res: NextResponse | null = null;

    if (!anonId) {
      anonId = crypto.randomUUID();

      res = NextResponse.json({});
      res.cookies.set("anon_id", anonId, {
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: true,
      });

      await prisma.anonymousUser.create({ data: { id: anonId } });
    }

    await prisma.anonymousUser.upsert({
      where: { id: anonId },
      update: {},
      create: { id: anonId },
    });

    let allProfiles: any = await redis.get("profiles:list");

    if (!allProfiles) {
      const fromDB = await prisma.profile.findMany();
      await redis.set("profiles:list", JSON.stringify(fromDB), );
      allProfiles = fromDB;
    } else {
      if (typeof allProfiles === "string") {
        allProfiles = JSON.parse(allProfiles);
      }
    }

    if (allProfiles.length < 2) {
      return NextResponse.json(
        { error: "Not enough profiles" },
        { status: 400 }
      );
    }

    let A = allProfiles[Math.floor(Math.random() * allProfiles.length)];
    let B = allProfiles[Math.floor(Math.random() * allProfiles.length)];

    while (A.id === B.id) {
      B = allProfiles[Math.floor(Math.random() * allProfiles.length)];
    }

    const key = pairKey(A.id, B.id);
    const seen = await redis.sismember(`seen_pairs:${anonId}`, key);

    if (seen) {
      const shuffled = [...allProfiles];

      // Fisher–Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      let found = null;

      for (let i = 0; i < shuffled.length; i++) {
        for (let j = i + 1; j < shuffled.length; j++) {
          const k = pairKey(shuffled[i].id, shuffled[j].id);
          const seenBefore = await redis.sismember(`seen_pairs:${anonId}`, k);

          if (!seenBefore) {
            found = [shuffled[i], shuffled[j]];
            break;
          }
        }
        if (found) break;
      }

      if (!found) {
        return NextResponse.json(
          { error: "No fresh pair available" },
          { status: 400 }
        );
      }

      A = found[0];
      B = found[1];
    }

    await redis.sadd(`seen_pairs:${anonId}`, pairKey(A.id, B.id));

    return NextResponse.json({ result: [A, B] });
  } catch (err) {
    console.error("PAIR ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
