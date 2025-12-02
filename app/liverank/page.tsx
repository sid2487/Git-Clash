"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Leader {
  id: number;
  username: string;
  elo: number;
}

export default function AllRanksPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 20; 

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `/api/leaderboard/liveall?page=${page}&limit=${limit}`
        );
        console.log(res.data)
        setLeaders(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to load full leaderboard");
      }
    }

    load();
  }, [page]);

  return (
    <div className="min-h-screen w-full flex justify-center p-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
       
        <div className="grid grid-cols-4 py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
          <span>Rank</span>
          <span>Name</span>
          <span className="text-center">Score</span>
          <span className="text-center">GitHub</span>
        </div>

     
        {leaders.map((user, index) => (
          <div
            key={user.id}
            className="grid grid-cols-4 py-3 px-3 border-b border-white/10 last:border-none items-center"
          >
            <span className="font-semibold text-white/70">
              #{(page - 1) * limit + (index + 1)}
            </span>

            <span className="text-white">{user.username}</span>

            <span className="text-center text-white/80 font-bold">
              {user.elo}
            </span>

            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-center text-emerald-400 hover:text-emerald-300"
            >
              Visit →
            </a>
          </div>
        ))}

        <div className="mt-5 flex justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition
            ${page === 1 ? "opacity-40 cursor-not-allowed" : ""}
          `}
          >
            ← Prev
          </button>

          <span className="text-white/60 self-center">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition
            ${page === totalPages ? "opacity-40 cursor-not-allowed" : ""}
          `}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
