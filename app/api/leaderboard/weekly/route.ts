import { prisma } from "@/lib/prisma";
import { weekCount } from "@/lib/weekCount";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const cookieStore = await cookies();
        let anonId = cookieStore.get("anon_id")?.value;

        if(!anonId){
            anonId = crypto.randomUUID();

            const res = NextResponse.json({ created: true });
            res.cookies.set("anon_id", anonId, {
              path: "/",
              maxAge: 365 * 24 * 60 * 60,
              httpOnly: true,
            });

            await prisma.anonymousUser.create({
                data: {
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

        const currentWeek = weekCount(new Date());
        const weeklyHistory = await prisma.weeklyHistory.findMany({
            where: {week: currentWeek},
            orderBy: {rank: "asc"}
        });

        if(weeklyHistory.length === 0){
            return NextResponse.json({error: "No Weekly data available"}, {status: 400});
        };

        return NextResponse.json({weeklyHistory}, {status: 200});


    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Weekly Response Server Failed"}, {status: 500});
    }
}