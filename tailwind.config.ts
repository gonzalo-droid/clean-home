import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        marino: "#0B3B5C",
        agua: { DEFAULT: "#0E7C86", dark: "#0A6169" },
        menta: "#DDF3EE",
        espuma: "#F5FAF8",
        papel: "#F4F7F6",
        limon: { DEFAULT: "#F4C542", dark: "#E0AE22" },
        wa: { DEFAULT: "#0F7A40", dark: "#0B6234" },
        grafito: "#1E2A32",
        gris: "#56656F",
        linea: "#DCE6E9",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 36px -18px rgba(11, 59, 92, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
