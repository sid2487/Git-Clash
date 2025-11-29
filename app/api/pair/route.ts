import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

        await prisma.anonymousUser.create({
          data: {
            id: anonId,
          },
        });
        return res;
      }

      let anonUser = await prisma.anonymousUser.findUnique({
        where: { id: anonId },
      });

      if (!anonUser) {
        await prisma.anonymousUser.create({
          data: { id: anonId! },
        });
      }

      const uploaded = await prisma.uploadedProfile.findMany({
        where: {
          userId: anonId,
        },
        select: {
          profileId: true,
        },
      });

      const seen = await prisma.seenProfile.findMany({
        where: {
          userId: anonId,
        },
        select: {
          profileId: true,
        },
      });

      const excludedIds = [
        // ...uploaded.map((x) => x.profileId),
        ...seen.map((x) => x.profileId),
      ];

      const pair = await prisma.profile.findMany({
        where: { id: { notIn: excludedIds } },
        orderBy: { id: "asc" },
        take: 50,
      });

      if (pair.length < 2) {
        console.log("Only Profiles", pair);

        return NextResponse.json(
          { error: "Not enough Profiles to show" },
          { status: 400 }
        );
      }

      const shuffled = pair.sort(() => Math.random() - 0.5);
      const result = [shuffled[0], shuffled[1]];

      await prisma.seenProfile.createMany({
        data: result.map((p) => ({
          userId: anonId,
          profileId: p.id,
        })),
      });

      return NextResponse.json({ result }, { status: 200 });
    } catch (err: any) {
        console.log("Server Error from api/pair", err);
        return NextResponse.json({
            error: "Server Crashed",
            details: err?.message,
        }, {status: 500 });
    }
}