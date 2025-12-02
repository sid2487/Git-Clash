"use client";

import axios from "axios";
import { useState } from "react";


export default function UsernameInput() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInput = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`/api/github/upload`, {
        username,
      });
      if (res.data.message === "Profile already exists") {
        alert("This GitHub user is already added!");
      } else {
        alert("Profile uploaded successfully!");
      }

      setUsername(""); 
    } catch (error: any) {
        console.error(error.response.data.error || "Failed to add the username");
        setError(error.response.data.error || "Failed to add the username");
    } finally{
        setLoading(false);
    }
  }

  if (loading) return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="w-full flex justify-center mt-8">
      <form
        onSubmit={handleInput}
        className="
          bg-white/5 backdrop-blur-lg
          border border-white/10 
          shadow-lg rounded-xl
          p-5 sm:p-6 
          w-[88%] sm:w-[360px]
          flex flex-col gap-4
          hover:border-white/20 hover:shadow-emerald-400/10
          transition-all duration-300
        "
      >
        <h2 className="text-white text-lg font-semibold text-center">
          Enter Username To Participate
        </h2>

        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="github username"
          className="
            w-full px-3 py-2.5 rounded-lg
            bg-white/10 text-white placeholder-white/40
            border border-white/20 backdrop-blur-md
            focus:border-emerald-400 focus:ring-0
            outline-none transition-all duration-300
            text-sm
          "
        />

        <button
          type="submit"
          className="
            w-full py-2.5 rounded-lg
            text-sm font-semibold
            bg-emerald-500/10 text-emerald-300
            border border-emerald-500/20
            hover:bg-emerald-500/20 hover:border-emerald-400
            transition-all duration-300 cursor-pointer
          "
        >
          Continue
        </button>
      </form>
    </div>
  );
}
