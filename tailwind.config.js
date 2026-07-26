/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./cone-scroll.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15150f",
        panel: "#fffdf4",
        line: "rgba(21, 21, 15, 0.18)",
        bg: "#e6f23c"
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "sans-serif"]
      },
      transitionTimingFunction: {
        custom: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};
