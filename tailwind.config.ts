import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dae6ff",
          200: "#bccfff",
          300: "#8eaeff",
          400: "#5b83ff",
          500: "#3a5dff",
          600: "#253df5",
          700: "#1d2dd6",
          800: "#1e29ac",
          900: "#1f2986"
        },
        ink: {
          50: "#f7f8fb",
          100: "#eceef5",
          200: "#d4d8e6",
          400: "#8590ad",
          700: "#3a435e",
          900: "#0f1530"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "Segoe UI", "Roboto", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(36, 53, 120, 0.18)",
        glow: "0 0 0 1px rgba(58,93,255,0.25), 0 8px 30px -10px rgba(58,93,255,0.45)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.4s linear infinite",
        floaty: "floaty 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;