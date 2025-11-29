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
          data: { id: anonId },
        });
      }

      // const uploaded = await prisma.uploadedProfile.findMany({
      //   where: {
      //     userId: anonId,
      //   },
      //   select: {
      //     profileId: true,
      //   },
      // });

      // const voted = await prisma.vote.findMany({
      //   where: {userId: anonId},
      //   select: {
      //     winnerId: true
      //   }
      // })

      // const seen = await prisma.seenProfile.findMany({
      //   where: {
      //     userId: anonId,
      //   },
      //   select: {
      //     profileId: true,
      //   },
      // });

      // const excludedIds = [
      //   // ...uploaded.map((x) => x.profileId),
      //   ...voted.map((x) => x.loserId),
      //   // ...voted.map((x) => x.winnerId),

      //   // ...seen.map((x) => x.profileId),
      // ];

      // const pair = await prisma.profile.findMany({
      //   where: { id: { notIn: excludedIds } },
      //   orderBy: { id: "asc" },
      //   take: 50,
      // });

      const votePairs = await prisma.votePair.findMany({
        where: {
          userId: anonId,
        }
      });

      function alreadyVoted(a: number, b: number){
        return votePairs.some((p) => 
        (p.profileA === a && p.profileB === b) ||
        (p.profileA === b && p.profileB === a)
        )
      }

      const allProfiles = await prisma.profile.findMany(); // later will add paginat

      if (allProfiles.length < 2) {
        console.log("Only Profiles");

        return NextResponse.json(
          { error: "Not enough Profiles to show" },
          { status: 400 }
        );
      }

      // const shuffled = allProfiles.sort(() => Math.random() - 0.5);
      function shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }


      const shuffled = shuffle(allProfiles);

     let result = null;

     for(let i=0; i<shuffled.length; i++){
      for(let j=i+1; j<shuffled.length; j++){
        const A = shuffled[i];
        const B = shuffled[j];

        if(!alreadyVoted(A.id, B.id)){
          result = [A, B];
          break;
        }
      }
      if(result) break;
     }

     if(!result){
      return NextResponse.json({error: "No fresh pair available"}, {status: 400});
     };



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