"use client";
import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

const MARQUEE_STYLE = `
@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-100% - 12px)); }
}
.marquee-track {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  animation: marquee-scroll 25s linear infinite;
}
.marquee-track-reverse {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  animation: marquee-scroll 25s linear infinite reverse;
}
.marquee-root:hover .marquee-track,
.marquee-root:hover .marquee-track-reverse {
  animation-play-state: paused;
}
`;

export function AnimatedCanopy({
  children,
  reverse = false,
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  const id = useId();

  return (
    <>
      <style>{MARQUEE_STYLE}</style>
      <div
        className={cn("relative flex w-full overflow-hidden", className)}
        style={{ gap: "12px" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={reverse ? "marquee-track-reverse" : "marquee-track"}
          >
            {children}
          </div>
        ))}
      </div>
    </>
  );
}
