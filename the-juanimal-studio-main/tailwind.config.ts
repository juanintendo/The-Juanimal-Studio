import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Keep original CSS look — Preflight would reset headings/buttons/borders
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#E04E1F",
          deep: "#B93A12",
        },
        cream: {
          DEFAULT: "#F3E9CE",
          dim: "#E6D8B4",
        },
        ink: "#171009",
        tan: "#C9A96B",
        rust: "#6E3410",
      },
      fontFamily: {
        disp: ["var(--font-disp)", "sans-serif"],
        logo: ["var(--font-logo)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
