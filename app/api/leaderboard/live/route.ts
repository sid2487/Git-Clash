import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const cookieStore = await cookies();
        let anonId = cookieStore.get("anon_id")?.value;

        if(!anonId){
            anonId = crypto.randomUUID();
            const res = NextResponse.json({created: true});
            res.cookies.set("anon_id", anonId, {
              path: "/",
              maxAge: 365 * 24 * 60 * 60,
              httpOnly: true,
            });

            await prisma.anonymousUser.findUnique({
                where: {
                    id: anonId
                }
            });

            return res;
        };

        await prisma.anonymousUser.upsert({
          where: { id: anonId },
          update: {},
          create: { id: anonId },
        });

        const liveLeaderBoard = await prisma.profile.findMany({
            orderBy: {
                elo: "desc"
            },
            take: 10
        });

        if(liveLeaderBoard.length === 0){
            return NextResponse.json({error: "Live LeaderBoard not available"});
        }

        return NextResponse.json({liveLeaderBoard}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "liveLeaderboard Error"}, {status: 500});
    }
}