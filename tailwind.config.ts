import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        marino: "#0B3B5C",
        // Teal de la marca: solo en el logo. Las acciones usan marino (agregar) y wa (enviar).
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
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 28px -12px rgba(11, 59, 92, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
