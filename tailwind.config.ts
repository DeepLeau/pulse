import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#f97316",
          hi: "#fb923c",
          glow: "rgba(249,115,22,0.18)",
        },
      },
      animation: {
        shine: "shine 4s linear infinite",
        "marquee-scroll": "marquee-scroll 25s linear infinite",
        "marquee-scroll-reverse": "marquee-scroll 25s linear infinite reverse",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "marquee-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-100% - 12px))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
