/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#38bdf8",
        accent: "#fcd34d",
        bg: "#f8fafc",
      },
    },
  },
  plugins: [],
}
