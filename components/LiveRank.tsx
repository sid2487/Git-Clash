"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Image from "next/image";

interface Leader {
  id: number;
  username: string;
  elo: number;
  totalContributions: number;
}

export default function RankPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [previousLeaders, setPreviousLeaders] = useState<Leader[]>([]);
  const leadersRef = useRef<Leader[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Leader | null>(null);

  useEffect(() => {
    leadersRef.current = leaders;
  }, [leaders]);

  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await axios.get("/api/leaderboard/live");
        if (res.status === 200) {
          setLeaders(res.data.liveLeaderBoard || []);
        }
      } catch (error: any) {
        console.error(
          error.response?.data?.message || "Failed to load leaderboard"
        );
      }
    }

    loadInitial();

    const stream = new EventSource("/api/leaderboard/sseLive");

    stream.onmessage = (event) => {
      try {
        const updated: Leader[] = JSON.parse(event.data || "[]");

        setPreviousLeaders(leadersRef.current || []);
        setLeaders(updated || []);
      } catch (e) {
        console.error("Invalid SSE payload", e);
      }
    };

    stream.onerror = () => {};

    return () => {
      stream.close();
    };
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="grid grid-cols-5 py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
        <span>Rank</span>
        <span>Name</span>
        <span className="text-center">Score</span>
        <span className="text-center">GitHub</span>
        <span className="text-center">Profile</span>
      </div>

      {leaders.map((user, index) => {
        const old = previousLeaders.find((p) => p.id === user.id);
        const eloChanged = !!old && old.elo !== user.elo;

        return (
          <div
            key={user.id}
            className={`grid grid-cols-5 py-3 px-3 border-b border-white/10 last:border-none items-center
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
              rel="noreferrer"
            >
              Visit →
            </a>

            <button
              onClick={() => {
                setSelectedUser(user);
                setModalOpen(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 underline text-center cursor-pointer"
            >
              View
            </button>
          </div>
        );
      })}

      <div className="mt-4 flex justify-center">
        <a
          href="/liverank"
          className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition"
        >
          See All Ranks →
        </a>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
      >
        {selectedUser && (
          <div className="flex flex-col items-center text-center">
            <Image
              src={`https://github.com/${selectedUser.username}.png`}
              width={150}
              height={150}
              unoptimized
              alt="avatar"
              className="rounded-xl border border-white/20 shadow-lg"
            />

            <h2 className="text-2xl font-bold mt-4">{selectedUser.username}</h2>

            <p className="text-gray-300 mt-1">
              Rank: #{leaders.findIndex((u) => u.id === selectedUser.id) + 1}
            </p>

            <p className="text-gray-300">Elo: {selectedUser.elo}</p>
            <p className="text-gray-300">
              TotalContributions: {selectedUser.totalContributions}
            </p>

            <a
              href={`https://github.com/${selectedUser.username}`}
              target="_blank"
              className="mt-3 text-emerald-400 hover:text-emerald-300 underline"
            >
              Visit GitHub →
            </a>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                   border border-white/20 transition-all duration-300"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
