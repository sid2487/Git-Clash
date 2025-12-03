"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";

interface Leader {
  id: number;
  username: string;
  elo: number;
  totalContributions: number
}

export default function AllRanksPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Leader | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `/api/leaderboard/liveall?page=${page}&limit=${limit}`
        );

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
        <div className="grid grid-cols-5 py-2 px-3 text-white/70 font-semibold text-sm border-b border-white/10">
          <span>Rank</span>
          <span>Name</span>
          <span className="text-center">Score</span>
          <span className="text-center">GitHub</span>
          <span className="text-center">Profile</span>
        </div>

        {leaders.map((user, index) => (
          <div
            key={user.id}
            className="grid grid-cols-5 py-3 px-3 border-b border-white/10 last:border-none items-center"
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

            <button
              onClick={() => {
                setSelectedUser(user);
                setModalOpen(true);
              }}
              className="text-center text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              View
            </button>
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
            className={`px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition cursor-pointer
            ${page === totalPages ? "opacity-40 cursor-not-allowed" : ""}
          `}
          >
            Next →
          </button>
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

              <h2 className="text-2xl font-bold mt-4">
                {selectedUser.username}
              </h2>

              <p className="text-gray-300 mt-1">
                Rank: #
                {(page - 1) * limit +
                  (leaders.findIndex((u) => u.id === selectedUser.id) + 1)}
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
    </div>
  );
}
