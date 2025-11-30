import { weekCount } from "@/lib/weekCount";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const week = weekCount(new Date());
        
        const profiles = await prisma.profile.findMany({
            orderBy: { elo: "desc" },
        });

        if(!profiles){
            return NextResponse.json({ error: "No Profile exist" });
        };

        const snapshotData = profiles.map((p, index) => ({
            profileId: p.id,
            week: week,
            elo: p.elo,
            rank: index + 1,
            username: p.username,
        }));

        await prisma.weeklyHistory.createMany({
            data: snapshotData,
            skipDuplicates: true
        });

        return NextResponse.json({ message: `Weekly Snapshot saved for week ${week}` });


    } catch (error) {
        console.error("Cron Error: ", error);
        return NextResponse.json({ error: "Cron Server Error" }, {status: 500});
    }
}