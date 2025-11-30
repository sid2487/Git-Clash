"use client"

import axios from "axios";
import { useEffect, useState } from "react";

interface Leader {
  id: number;
  username: string;
  elo: number;
}


export default function RankPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await axios.get("/api/leaderboard/live");
        if (res.status === 200) {
          setLeaders(res.data.liveLeaderBoard);
        }
      } catch (error: any) {
        console.error(
          error.response?.data?.message || "Failed to load leaderboard"
        );
      }
    }
    loadInitial();

    // open sse stream
    const stream = new EventSource("api/leaderboard/sseLive");
    stream.onmessage = (event) => {
      const updated = JSON.parse(event.data);
      setLeaders(updated);
    };

    return () => stream.close();
  }, []);

  return (
    <div className="text-white pt-24 px-4 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400 tracking-wide">
          Live Top 10 Rankings
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          {leaders.map((user, index) => (
            <div
              key={user.id}
              className="flex justify-between py-3 border-b border-white/10 last:border-none"
            >
              <span
                className={`font-semibold w-8 ${
                  index < 3 ? "text-emerald-400" : "text-white/70"
                }`}
              >
                #{index + 1}
              </span>
              <span>{user.username}</span>
              <span className="text-white/80 font-bold">{user.elo}</span>
              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Github →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}