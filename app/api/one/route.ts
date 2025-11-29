import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: NextRequest){
    try {
        const cookieStore = await cookies();
        let anonId = cookieStore.get("anon_id")?.value;

        let responseCookies: NextResponse | null = null;

        if(!anonId){
            anonId = crypto.randomUUID();
            responseCookies = NextResponse.json({});
            responseCookies.cookies.set("anon_id", anonId, {
              path: "/",
              maxAge: 365 * 24 * 60 * 60,
              httpOnly: true,
            });
        };

        const uploaded = await prisma.uploadedProfile.findMany({
            where: {userId: anonId},
            select: {profileId: true}
        });

        const seen = await prisma.seenProfile.findMany({
            where: {userId: anonId},
            select: {profileId: true}
        });

        const excludedIds = [
            // ...uploaded.map((x) => x.profileId),
            ...seen.map((x) => x.profileId),
        ];

        const nextProfile = await prisma.profile.findFirst({
            where: {id: {notIn: excludedIds}},
            orderBy: {id: "asc"},
        });

        if(!nextProfile){
         return NextResponse.json(
           { error: "No more profiles available" },
           { status: 400 }
         );   
        };

        await prisma.seenProfile.create({
            data: {
                userId: anonId,
                profileId: nextProfile.id,
            }
        });

        const response = NextResponse.json({ result: nextProfile }, {status: 200});

        if (responseCookies) {
          response.cookies.set("anon_id", anonId, {
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
            httpOnly: true,
          });
        }

        return response;


    } catch (err) {
        console.error("PAIR ONE ERROR", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
    }
