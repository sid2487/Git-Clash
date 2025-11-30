"use client"

import axios from "axios";
import { useEffect, useState } from "react";

interface Leader {
  id: number;
  rank: number;
  week: number;
  weekCount: number;
  elo: number; 
  profileId: number;
  profile: {
    id: number;
    username: string;
    avatarUrl: string | null;
    elo: number; 
  };
};

interface WLeader{
  id: number;
  rank: number;
  week: number;
  elo: number;
  profileId: number;
  profile: {
    id: number;
    username: string;
    avatarUrl: string;
  }
}


export default function Leaderboard() {
  const [allTime, setAllTime] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weekly, setWeekly] = useState<WLeader[]>([]);
  

  useEffect(() => {
    async function handleAllTime() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/leaderboard/alltime");
        if (res.status === 200) {
          setAllTime(res.data);
          console.log(res.data)
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

  useEffect(() => {
    async function handleWeekly(){
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/leaderboard/weekly");
        if(res.status === 200){
          setWeekly(res.data)
        }
      } catch (error: any) {
        console.error(
          error.response?.data?.message || "Weekly leaderboard Failed to Load"
        );
        setError(
          error.response?.data?.message || "Weekly leaderboard Failed to Load"
        );
      }
    }
    handleWeekly()
  },[])

  return (
    <div className="text-white pt-30 px-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-4 text-emerald-400 tracking-wide">
            🏆 All-Time Leaderboard
          </h1>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="grid grid-cols-5 py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
              <span className="col-span-2">Rank & Name</span>
              <span className="text-center">Score</span>
              <span className="text-center">Weeks Top</span>
              <span className="text-center">GitHub</span>
            </div>

            {loading ? (
              <div className="py-10 flex flex-col items-center gap-3 text-white/60">
                <div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin">
                  <span>Loading....</span>
                </div>
              </div>
            ) : (
              allTime.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-5 py-3 px-3 border-b border-white/10 last:border-none items-center"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        user.rank < 3 ? "text-emerald-400" : "text-white/70"
                      }`}
                    >
                      #{user.rank}
                    </span>
                    <span className="text-white">{user.profile.username}</span>
                  </div>

                  <span className="text-center text-white/80 font-bold">
                    {user.elo}
                  </span>

                  <span className="text-center text-white/80 font-bold">
                    {user.weekCount}
                  </span>

                  <a
                    href={`https://github.com/${user.profile.username}`}
                    target="_blank"
                    className="text-center text-emerald-400 hover:text-emerald-300"
                  >
                    Visit →
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h1 className="text-3xl font-bold mb-4 text-emerald-400 tracking-wide">
            This Week's Leaderboard
          </h1>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="grid grid-cols-5 py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
              <span className="col-span-2">Rank & Name</span>
              <span className="text-center">Score</span>
              <span className="text-center">GitHub</span>
              <span></span>
            </div>

            {loading ? (
              <div className="py-10 flex flex-col items-center gap-3 text-white/60">
                <div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin">
                  <span>Loading....</span>
                </div>
              </div>
            ) : (
              weekly.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-5 py-3 px-3 border-b border-white/10 last:border-none items-center"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        user.rank < 3 ? "text-emerald-400" : "text-white/70"
                      }`}
                    >
                      #{user.rank}
                    </span>
                    <span className="text-white">{user.profile.username}</span>
                  </div>

                  <span className="text-center text-white/80 font-bold">
                    {user.elo}
                  </span>

                  {/* <span className="text-center text-white/80 font-bold">
                    {user.weekCount}
                  </span> */}

                  <a
                    href={`https://github.com/${user.profile.username}`}
                    target="_blank"
                    className="text-center text-emerald-400 hover:text-emerald-300"
                  >
                    Visit →
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );

}
