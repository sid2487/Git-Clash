import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'

export async function GET(req: NextRequest){
    const cookieStore = await cookies();
    let anonId = cookieStore.get("anon_id")?.value;

    if(!anonId){
        anonId = crypto.randomUUID();

        const res = NextResponse.json({created: true });
        res.cookies.set("anon_id", anonId, {
            path: "/",
            maxAge: 365* 24* 60* 60,
            httpOnly: true
        });

       await prisma.anonymousUser.create({
        data: {
            id: anonId,
        }
       });
       return res;
    }

    let user = await prisma.anonymousUser.findUnique({
        where: {
            id: anonId,
        },
    });

    if(!user){
        user = await prisma.anonymousUser.create({
            data: {
                id: anonId
            }
        })
    };

    return NextResponse.json({user});
}