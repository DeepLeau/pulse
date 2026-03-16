"use client";
import { cn } from "@/lib/utils";

interface LustreTextProps {
  text: string;
  speed?: number;
  mode?: "dark" | "light";
  className?: string;
}

export function LustreText({
  text,
  speed = 5,
  mode = "dark",
  className = "",
}: LustreTextProps) {
  return (
    <span
      className={`animate-shine ${
        mode === "light" ? "lustre-on-white" : "lustre-dark"
      } ${className}`}
      style={{
        animationDuration: `${speed}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      }}
    >
      {text}
    </span>
  );
}
