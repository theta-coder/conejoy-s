import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Full screen list (not `extend`) so `max-*` variants sort correctly.
    // `xs` covers 320-399px phones, which the nav search bar relies on.
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        ink: "#15150f",
        panel: "#fffdf4",
        line: "rgba(21, 21, 15, 0.18)",
        bg: "#e6f23c",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      transitionTimingFunction: {
        custom: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
