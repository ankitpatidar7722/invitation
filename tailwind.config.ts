import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF7F0",
        cream: "#F4ECDF",
        blush: { 50: "#FDF5F5", 100: "#F9E6E7", 200: "#F2D2D6", 300: "#E8B6BE" },
        rose: { 400: "#D795A2", 500: "#C27688", 600: "#A45A6D" },
        gold: { 300: "#DCC79B", 400: "#C9AC74", 500: "#B39258", 600: "#8E6F3A", 700: "#6E5429" },
        sage: { 300: "#B9C6A8", 400: "#9AAE88", 500: "#7C9169" },
        ink: { DEFAULT: "#3F2F2B", soft: "#5E4B45" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "var(--font-deva-serif)", "Georgia", "serif"],
        script: ["var(--font-script)", "var(--font-deva-script)", "cursive"],
        sans: ["var(--font-sans)", "var(--font-deva-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(110, 84, 41, 0.18)",
        card: "0 2px 0 rgba(255,255,255,0.8) inset, 0 18px 50px -20px rgba(110, 84, 41, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
