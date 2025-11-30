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
    const [previousLeaders, setPreviousLeaders] = useState<Leader[]>([]);


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
      setPreviousLeaders(leaders);
      setLeaders(updated);
    };

    return () => stream.close();
  }, [leaders]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="grid grid-cols-4 py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
        <span>Rank</span>
        <span>Name</span>
        <span className="text-center">Score</span>
        <span className="text-center">GitHub</span>
      </div>

      {leaders.map((user, index) => {
        const old = previousLeaders.find((p) => p.id === user.id);

        const eloChanged = old && old.elo !== user.elo;

        return (
          <div
            key={user.id}
            className={`grid grid-cols-4 py-3 px-3 border-b border-white/10 last:border-none items-center
              transition-all duration-500 ease-out
              ${eloChanged ? "flash-change" : ""}
            `}
          >
            <span
              className={`font-semibold ${
                index < 3 ? "text-emerald-400" : "text-white/70"
              }`}
            >
              #{index + 1}
            </span>

            <span className="text-white">{user.username}</span>

            <span className="text-center text-white/80 font-bold">
              {user.elo}
            </span>

            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              className="text-center text-emerald-400 hover:text-emerald-300"
            >
              Visit →
            </a>
          </div>
        );
      })}
    </div>
  );
}