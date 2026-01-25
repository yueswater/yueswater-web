import type { Config } from "tailwindcss";

const config: Config & { daisyui?: any } = {
  // darkMode: "class",
  darkMode: ["selector", "[data-theme='dark']"],

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["emerald", { dark: "dim" }],
    darkTheme: "dim",
  },
};
export default config;
