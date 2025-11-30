import { weekCount } from "@/lib/weekCount";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const week = weekCount(new Date());
        
        const profiles = await prisma.profile.findMany({
            orderBy: { elo: "desc" },
        });

        if(profiles.length === 0){
            return NextResponse.json({ error: "No Profile exist" });
        };

        const snapshotData = profiles.map((p, index) => ({
            profileId: p.id,
            week: week,
            elo: p.elo,
            rank: index + 1,
        }));

        await prisma.weeklyHistory.createMany({
            data: snapshotData,
            skipDuplicates: true
        });

        const allTimeData = await Promise.all(
          profiles.map(async (p, index) => {
            const previousWeeks = await prisma.allTimeHistory.count({
              where: { profileId: p.id },
            });

            return {
              profileId: p.id,
              week,
              weekCount: previousWeeks + 1,
              rank: index + 1,
              elo: p.elo,
            };
          })
        );

        await prisma.allTimeHistory.createMany({
          data: allTimeData,
          skipDuplicates: true,
        });


        return NextResponse.json({ message: `Weekly Snapshot saved for week ${week}` });


    } catch (error) {
        console.error("Cron Error: ", error);
        return NextResponse.json({ error: "Cron Server Error" }, {status: 500});
    }
}