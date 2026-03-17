"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextGenerateProps {
  text: string;
  className?: string;
  textClassName?: string;
  blurEffect?: boolean;
  speed?: number;
  mode?: "dark" | "light";
}

export function AnimatedTextGenerate({
  text,
  className,
  textClassName,
  blurEffect = true,
  speed = 0.5,
  mode = "dark",
}: AnimatedTextGenerateProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    setVisibleCount(0);
    const id = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= words.length) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, Math.max(speed * 200, 100));
    return () => clearInterval(id);
  }, [text, speed, words.length]);

  const wordColor = mode === "light" ? "text-zinc-900" : "text-zinc-50";
  const placeholderColor = mode === "light" ? "bg-zinc-300" : "bg-zinc-600";

  return (
    <div className={cn("font-semibold", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-2 gap-y-1",
          "text-5xl sm:text-6xl tracking-[-0.03em] leading-[1.08]",
          textClassName
        )}
      >
        {words.map((word, idx) => {
          if (idx < visibleCount) {
            return (
              <motion.span
                key={`${word}-${idx}`}
                initial={{
                  opacity: 0,
                  filter: blurEffect ? "blur(10px)" : "none",
                }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: speed * 0.3, ease: "easeOut" }}
                className={wordColor}
              >
                {word}
              </motion.span>
            );
          }
          if (idx < visibleCount + 3) {
            return (
              <motion.div
                key={`ph-${idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-full inline-block",
                  placeholderColor
                )}
                style={{
                  width: `${Math.max(word.length * 0.6, 2)}em`,
                  height: "0.85em",
                }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}