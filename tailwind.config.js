/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: { center: true, padding: "1rem" },
      colors: {
        board: {
          bg: "#0a0a0a",
          cell: "#0a0a0a",
          line: "#1a1a1a",
          soft: "#101010",
        },
        uzg: {
          300: "#59f68e",
          400: "#2afc7f",
          500: "#00ff66",
        },
      },
      fontFamily: {
        board: ["var(--font-board)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 8px rgba(0,255,102,0.35), inset 0 0 8px rgba(0,255,102,0.15)",
      },
    },
  },
  plugins: [],
};