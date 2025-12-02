import { redis } from "@/lib/redis";

export async function GET() {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        let closed = false;
        let interval: NodeJS.Timeout;

        const cleanup = () => {
          if (!closed) {
            closed = true;
            clearInterval(interval);
            try {
              controller.close();
            } catch {}
          }
        };

        const send = async () => {
          if (closed) return;

          let leaderboard = await redis.get("leaderboard:live");
          if (typeof leaderboard === "string") {
            leaderboard = JSON.parse(leaderboard);
          }

          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(leaderboard || [])}\n\n`)
            );
          } catch (err) {
            cleanup(); 
          }
        };

        send(); 
        interval = setInterval(send, 3000);

        return cleanup;
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
