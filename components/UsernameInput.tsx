"use client";

import axios from "axios";
import { useState } from "react";
import Modal from "./Modal";
import Image from "next/image";


export default function UsernameInput() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const handleInput = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`/api/github/upload`, {
        username,
      });
      setProfile(res.data.profile);
      setModalOpen(true);
      // if (res.data.message === "Profile already exists") {
      //   alert("This GitHub user is already added!");
      // } else {
      //   alert("Profile uploaded successfully!");
      // }

      setUsername("");
    } catch (error: any) {
      console.error(
        error.response?.data?.error || "Failed to add the username"
      );
      setError(error.response?.data?.error || "Failed to add the username");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="w-full flex justify-center mt-8 text-white">
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {profile ? (
          <div className="flex flex-col items-center">
            <Image
              src={profile.avatarUrl}
              width={130}
              height={130}
              className="rounded-xl shadow-lg"
              alt="avatar"
            />

            <h2 className="text-xl font-semibold mt-4">{profile.username}</h2>
            <p className="text-sm text-gray-300">
              Rank: #{profile.rank || "N/A"}
            </p>

            <p className="text-sm text-gray-300">
              Followers: {profile.followers}
            </p>

            <p className="text-sm text-gray-300">
              Contributions: {profile.totalContributions}
            </p>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                         border border-white/20 transition-all duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-300">Loading profile...</p>
        )}
      </Modal>

     
      <form
        onSubmit={handleInput}
        className="bg-white/5 backdrop-blur-lg border border-white/10 
          shadow-lg rounded-xl p-5 sm:p-6 w-[88%] sm:w-[360px]
          flex flex-col gap-4 hover:border-white/20"
      >
        <h2 className="text-lg font-semibold text-center">
          Enter Username To Participate
        </h2>

        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="github username"
          className="w-full px-3 py-2.5 rounded-lg bg-white/10 text-white 
                     placeholder-white/40 border border-white/20 
                     focus:border-emerald-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold
                     bg-emerald-500/10 text-emerald-300 
                     border border-emerald-500/20 hover:bg-emerald-500/20 
                     transition-all duration-300 cursor-pointer"
        >
          {loading ? "Uploading..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
