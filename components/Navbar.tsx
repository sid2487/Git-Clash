"use client";

import { useState } from "react";
import Image from "next/image";
import logo2 from "@/public/git-clash/logo2.jpg"
import Link from "next/link";

import { Trophy, Github, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        bg-black/60 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_4px_30px_rgba(0,0,0,0.8)]
      "
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="w-12 h-12 cursor-pointer">
          <Link href={"/"}>
            <Image
              className="
              object-cover w-full h-full rounded-full
              border border-white/10
              shadow-md shadow-black/70
            "
              src={logo2}
              alt="jncu"
            />
          </Link>
        </div>

        <ul className="hidden sm:flex gap-4 text-white/80 text-base font-medium items-center">
          <li>
            <Link
              href="/leaderboard"
              className="
                px-4 py-2 rounded-lg flex items-center gap-2
                bg-white/5 border border-white/10 
                hover:bg-emerald-500/20 hover:border-emerald-500/30
                transition-all duration-300
              "
            >
              <Trophy size={18} className="text-emerald-300" />
              <span>Leaderboard</span>
            </Link>
          </li>

          <li>
            <a
              href="https://github.com/sid2487/Git-Clash  "
              target="_blank"
              className="
                px-4 py-2 rounded-lg flex items-center gap-2
                bg-white/5 border border-white/10 
                hover:bg-emerald-500/20 hover:border-emerald-500/30
                transition-all duration-300 cursor-pointer
              "
            >
              <Github size={18} className="text-white/80" />
              <span>Github</span>
            </a>
          </li>

          <li>
            <span
              className="
                px-4 py-2 rounded-lg flex items-center gap-2
                bg-white/5 border border-white/10 
                hover:bg-emerald-500/20 hover:border-emerald-500/30
                transition-all duration-300 cursor-pointer
              "
            >
              <Sun size={18} className="text-yellow-300" />
              <span>Theme</span>
            </span>
          </li>
        </ul>

        <button
          className="sm:hidden text-white/80 text-3xl focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {open && (
        <div
          className="
            sm:hidden
            bg-black/80 backdrop-blur-xl border-t border-white/10
            shadow-[0_4px_20px_rgba(0,0,0,0.6)]
            flex flex-col gap-3 px-6 py-4 text-white/90 text-base
          "
        >
          <Link
            href="/leaderboard"
            onClick={() => setOpen(false)}
            className="
              px-4 py-2 rounded-lg flex items-center gap-3
              bg-white/5 border border-white/10 
              hover:bg-emerald-500/20 hover:border-emerald-500/30
              transition-all duration-300
            "
          >
            <Trophy size={20} className="text-emerald-300" />
            Leaderboard
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            onClick={() => setOpen(false)}
            className="
              px-4 py-2 rounded-lg flex items-center gap-3
              bg-white/5 border border-white/10 
              hover:bg-emerald-500/20 hover:border-emerald-500/30
              transition-all duration-300 cursor-pointer
            "
          >
            <Github size={20} className="text-white/80" />
            Github
          </a>

          <span
            onClick={() => setOpen(false)}
            className="
              px-4 py-2 rounded-lg flex items-center gap-3
              bg-white/5 border border-white/10 
              hover:bg-emerald-500/20 hover:border-emerald-500/30
              transition-all duration-300 cursor-pointer
            "
          >
            <Sun size={20} className="text-yellow-300" />
            Theme
          </span>
        </div>
      )}
    </nav>
  );
}
