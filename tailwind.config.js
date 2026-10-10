/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6A28",
        "primary-dark": "#E4541A",
        navy: "#1B2547",
        surface: "#F4F5F8",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "cloud-drift": {
          "0%, 100%": { transform: "translateX(-3%)" },
          "50%": { transform: "translateX(3%)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" },
        },
        "path-flow": {
          to: { strokeDashoffset: "-48" },
        },
      },
      animation: {
        "cloud-drift": "cloud-drift 18s ease-in-out infinite",
        "cloud-drift-slow": "cloud-drift 26s ease-in-out infinite reverse",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
        "path-flow": "path-flow 3s linear infinite",
      },
    },
  },
  plugins: [],
};
