/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7f13ec",
        "primary-glow": "#9d4dff",
        gold: "#FFD700",
        "gold-dim": "#C5A000",
        "background-light": "#f7f6f8",
        "background-dark": "#0e0912",
        "surface-dark": "#1a1122",
        "rarity-gold": "#FFD700",
      },
      fontFamily: {
        display: ["Spline Sans", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        body: ["Noto Sans SC", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      backgroundImage: {
        "cosmic-gradient":
          "radial-gradient(circle at center, #2e1a47 0%, #1a1122 40%, #0e0912 100%)",
        "portal-glow":
          "conic-gradient(from 0deg at 50% 50%, #7f13ec 0%, #FFD700 25%, #7f13ec 50%, #FFD700 75%, #7f13ec 100%)",
        "god-rays":
          "conic-gradient(from 90deg at 50% 50%, #191022 0deg, #2d1b4e 20deg, #191022 40deg, #2d1b4e 60deg, #191022 80deg, #2d1b4e 100deg, #191022 120deg, #2d1b4e 140deg, #191022 160deg, #2d1b4e 180deg, #191022 200deg, #2d1b4e 220deg, #191022 240deg, #2d1b4e 260deg, #191022 280deg, #2d1b4e 300deg, #191022 320deg, #2d1b4e 340deg, #191022 360deg)",
      },
    },
  },
  plugins: [],
}
