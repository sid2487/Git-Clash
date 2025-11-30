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

            await prisma.anonymousUser.create({
              data: {
                id: anonId
              }
            });
        };

       await prisma.anonymousUser.upsert({
         where: { id: anonId },
         update: {},
         create: { id: anonId },
       });


        const loserId = Number(req.nextUrl.searchParams.get("loser"));
        const winnerId = Number(req.nextUrl.searchParams.get("winner"));

        const profiles = await prisma.profile.findMany({
          where: {
            id: {notIn: [winnerId, loserId]}
          }
        });

        if(profiles.length === 0){
                return NextResponse.json(
                  { error: "No more profiles" },
                  { status: 400 }
                );

        };

        const random = Math.floor(Math.random() * profiles.length);
        const nextProfile = profiles[random];


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
