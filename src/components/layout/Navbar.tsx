"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 flex items-center border-b border-white/[0.06] backdrop-blur-md">
      <div className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Pulse
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {["Features", "Pricing", "Docs", "Changelog"].map((item) => (
            <a
              key={item}
              href="#"
              className="px-3 h-8 flex items-center text-sm text-white-500 hover:text-white-200 rounded-md hover:bg-white/[0.04] transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="text-sm text-white-400 hover:text-white-200 transition-colors px-3"
          >
            Log in
          </a>
          <button className="h-8 px-4 rounded-md bg-red-500 hover:bg-red-400 text-white text-sm font-medium transition-colors duration-150">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
