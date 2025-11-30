import { prisma } from "@/lib/prisma";

export async function GET() {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        let closed = false;
        let interval: NodeJS.Timeout;

        const send = async () => {
          if (closed) return;

          const liveLeaderBoard = await prisma.profile.findMany({
            orderBy: { elo: "desc" },
            take: 10,
          });

          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(liveLeaderBoard)}\n\n`)
            );
          } catch (err) {
            closed = true;
            clearInterval(interval);
          }
        };

        send();

        interval = setInterval(send, 3000);

        try {
          controller.enqueue(encoder.encode(": connected\n\n"));
        } catch {}

        return () => {
          closed = true;
          clearInterval(interval);
          try {
            controller.close();
          } catch {}
        };
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
