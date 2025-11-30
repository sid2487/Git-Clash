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
              httpOnly: true,
              maxAge: 365 * 24 * 60 * 60,
            });

            await prisma.anonymousUser.create({
                data: {
                    id: anonId
                }
            });

            return res;
        }

        await prisma.anonymousUser.upsert({
          where: { id: anonId },
          update: {},
          create: { id: anonId },
        });

        const allTimeLeaderBoard = await prisma.allTimeHistory.findMany({
            orderBy: [
                {weekCount: "desc"},
                {rank: "asc"}
            ],
            include: {profile: true}
        });

        if (allTimeLeaderBoard.length === 0) {
          return NextResponse.json([], { status: 200 });
        }


        return NextResponse.json(allTimeLeaderBoard, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "AllTimeLeaderBoard Server Error"}, {status: 500});
    }
}