"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Card() {
  const [pair, setPair] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showPair = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("/api/pair");

      if (res.status === 200) {
        setPair(res.data.result); 
      }
    } catch (err:any) {
      console.log(err.response.data.error || "failed to laod profiles");
      setError(err.response.data.error || "Failed To load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showPair();
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!pair || pair.length < 2)
    return (
      <p className="text-gray-500 text-center">Not enough profiles found.</p>
    );

  const [p1, p2] = pair; 

  const cardUI = (user: any) => (
    <div
      className="
        flex flex-col items-center 
        bg-white/5 backdrop-blur-xl 
        border border-white/10 rounded-2xl 
        p-5 shadow-lg
        hover:shadow-emerald-500/20 hover:border-white/20
        transition-all duration-300
      "
    >
      <div className="relative group">
        <Image
          src={user.avatarUrl}
          alt={user.username}
          width={260}
          height={260}
          className="
            rounded-2xl object-cover 
            border border-white/20 shadow-xl
            group-hover:scale-[1.04] 
            group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.55)]
            transition-all duration-300
          "
        />

        <div
          className="
            absolute inset-0 rounded-2xl 
            bg-emerald-500/10 blur-xl 
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          "
        ></div>
      </div>

     
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
        className="
          mt-4 text-lg font-semibold 
          px-6 py-2 rounded-xl
          bg-white/10 text-white backdrop-blur-md
          border border-white/20
          hover:bg-white/20 hover:border-white/30
          transition-all duration-300 cursor-pointer
        "
      >
        Vote
      </button>
    </div>
  );

  return (
    <div className="flex gap-8 sm:gap-10 md:gap-16 px-5 sm:px-8 md:px-0 justify-center items-center text-white">
      {cardUI(p1)}
      {cardUI(p2)}
    </div>
  );
}
