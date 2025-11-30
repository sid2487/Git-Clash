import { prisma } from "@/lib/prisma";

export async function GET(){
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        start(controller) {
          const send = async () => {
            const liveLeaderBoard = await prisma.profile.findMany({
              orderBy: { elo: "desc" },
              take: 10,
            });

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(liveLeaderBoard)}\n\n`)
            );
          };

          send();
          const interval = setInterval(send, 1000);

          controller.enqueue(encoder.encode(": connected\n\n"));

          return () => clearInterval(interval);
        },
      }),

      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      }
    );
}