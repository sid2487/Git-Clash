"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Card() {
  const [pair, setPair] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const showPair = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("/api/pair");

      if (res.status === 200) {
        setPair(res.data.result);
      }
    } catch (err: any) {
      console.log(err.response.data.error || "failed to laod profiles");
      setError(err.response.data.error || "Failed To load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showPair();
  }, []);

  const fetchOne = async (loserId: number, winnerId: number) => {
    try {
      const res = await axios.get(`/api/one?winner=${winnerId}&loser=${loserId}`);
      if (res.status === 200) {
        return res.data.result;
      }
    } catch (error) {}
  };

  const handleVote = async (winnerIndex: number) => {
    if (!pair.length) return;
    setError("");
    setLoadingIndex(winnerIndex);

    const loserIndex = winnerIndex === 0 ? 1 : 0;
    const winnerId = pair[winnerIndex].id;
    const loserId = pair[loserIndex].id;

    try {
      const res = await axios.post("/api/vote", {
        winnerId,
        loserId,
      });

      if (res.status === 200) {
        setAnimatingIndex(winnerIndex);
        await new Promise((res) => setTimeout(res, 100));

        const fresh = await fetchOne(loserId, winnerId);

        if (!fresh) {
          setError("No more profiles available.");
          return;
        }

        setPair((prev) => {
          const next = [...prev];
          next[winnerIndex] = fresh;

          next[loserIndex] = {
            ...next[loserIndex],
            elo: res.data.updatedLoserElo,
          };

          return next;
        });
      }
    } catch (err: any) {
      console.error(err.response.data?.error || "failed to vote");
      setError(err.response.data?.error || "failed to vote");
      await showPair();
    } finally {
      setLoadingIndex(null);
      setAnimatingIndex(null);
    }
  };

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!pair || pair.length < 2)
    return (
      <p className="text-gray-500 text-center">Not enough profiles found.</p>
    );

  const [p1, p2] = pair;

  const cardUI = (user: any, index: number) => {
    const isLoading = loadingIndex === index;

    return (
      <div
        className={`
          transition-all duration-300 
          ${animatingIndex === index ? "opacity-0 scale-95" : "opacity-100"}
          flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10
          rounded-2xl p-5 shadow-lg
        `}
      >
        <Image
          src={user.avatarUrl}
          alt={user.username}
          width={260}
          height={260}
          className="rounded-2xl object-cover"
        />

        <div className="flex flex-col items-center mt-4">
          <p className="text-xl font-bold">{user.username}</p>
          <p className="text-sm text-gray-300">
            Contributions: {user.totalContributions}
          </p>
          <p className="text-sm text-gray-300">Followers: {user.followers}</p>
          <p className="text-sm text-gray-300">Repos: {user.repos}</p>
          <p className="text-sm text-gray-300">Elo: {user.elo}</p>
        </div>

        <button
          onClick={() => handleVote(index)}
          disabled={loadingIndex !== null}
          className={`mt-4 text-lg font-semibold px-6 py-2 rounded-xl transition-all duration-300 
            ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "bg-white/10 hover:bg-white/20"
            }
          `}
        >
          {isLoading ? "Voting..." : "Vote"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex gap-10 justify-center items-center text-white">
      {cardUI(pair[0], 0)}
      {cardUI(pair[1], 1)}
    </div>
  );
}