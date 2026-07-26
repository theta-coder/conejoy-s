/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./cone-scroll.html",
    "./src/**/*.{html,js}"
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
        sans: ["DM Sans", "sans-serif"],
        display: ["Manrope", "sans-serif"]
      },
      transitionTimingFunction: {
        custom: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};
