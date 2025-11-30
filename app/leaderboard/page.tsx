"use client"

import axios from "axios";
import { useEffect, useState } from "react";

interface Leader {
  id: number;
  username: string;
  elo: number;
}

export default function Leaderboard() {
  const [allTime, setAllTime] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleAllTime() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/leaderboard/alltime");
        if (res.status === 200) {
          setAllTime(res.data.allTimeLeaderBoard);
        }
      } catch (error: any) {
        console.error(
          error.response?.data?.message || "All time leaderboard Failed to Load"
        );
        setError(
          error.response?.data?.message || "All time leaderboard Failed to Load"
        );
      } finally {
        setLoading(false);
      }
    } 
    handleAllTime()
  }, [])

  const weekly = [
    { rank: 1, name: "Rohan", score: 520, github: "https://github.com/rohan" },
    { rank: 2, name: "Ankit", score: 502, github: "https://github.com/ankit" },
    {
      rank: 3,
      name: "Ishaan",
      score: 490,
      github: "https://github.com/ishaan",
    },
    { rank: 4, name: "Maria", score: 472, github: "https://github.com/maria" },
    { rank: 5, name: "Tara", score: 463, github: "https://github.com/tara" },
    { rank: 6, name: "Kabir", score: 458, github: "https://github.com/kabir" },
    { rank: 7, name: "Dev", score: 452, github: "https://github.com/dev" },
    { rank: 8, name: "John", score: 440, github: "https://github.com/john" },
    { rank: 9, name: "Mohan", score: 438, github: "https://github.com/mohan" },
    {
      rank: 10,
      name: "Vikram",
      score: 430,
      github: "https://github.com/vikram",
    },
  ];

  return (
    <div className="text-white pt-30 px-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-4 text-emerald-400 tracking-wide">
            🏆 All-Time Leaderboard
          </h1>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
              <span className="w-36">Rank & Name</span>
              <span className="w-20 text-center">Score</span>
              <span className="w-24 text-center">Weeks Top</span>
              <span className="w-24 text-center">GitHub</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              {allTime.map((user, index) => (
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
        </section>

        <section>
          <h1 className="text-3xl font-bold mb-4 text-emerald-400 tracking-wide">
            This Week's Leaderboard
          </h1>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
              <span className="w-36">Rank & Name</span>
              <span className="w-20 text-center">Score</span>
              <span className="w-24 text-center">GitHub</span>
            </div>

            {weekly.map((user, index) => (
              <div
                key={user.rank}
                className="
                  flex justify-between items-center py-3 px-3
                  border-b border-white/10 last:border-none
                  hover:bg-white/5 transition rounded-lg
                "
              >
                <div className="flex items-center gap-3 w-36">
                  <span
                    className={`font-semibold ${
                      index < 3 ? "text-emerald-400" : "text-white/70"
                    }`}
                  >
                    #{user.rank}
                  </span>
                  <span className="text-white/90">{user.name}</span>
                </div>

                <span className="w-20 text-center text-white/80 font-medium">
                  {user.score}
                </span>

                <a
                  href={user.github}
                  target="_blank"
                  className="w-24 text-center text-emerald-400 hover:text-emerald-300 underline-offset-4 transition"
                >
                  Visit
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
