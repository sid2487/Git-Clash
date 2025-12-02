import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.profile.count();
  const sample = await prisma.profile.findMany({
    select: { id: true, username: true },
    take: 5,
  });
  return Response.json({ count, sample });
}
