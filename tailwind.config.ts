import type { Config } from "tailwindcss";

const config: Config & { daisyui?: any } = {
  darkMode: ["selector", "[data-theme='dark']"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-gen-jyuu)", "system-ui", "sans-serif"],
        noto: ["var(--font-noto-sans)", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), 
    require("daisyui"),
    function ({ addBase, theme }: any) {
      addBase({
        'body': {
          fontFamily: theme('fontFamily.sans'),
        },
        'b, strong, .font-bold, .font-semibold, .font-black, h1, h2, h3, h4, h5, h6': {
          fontFamily: `${theme('fontFamily.noto')} !important`,
          fontWeight: '700',
        },
        '.prose h1, .prose h2, .prose h3, .prose h4, .prose b, .prose strong': {
          fontFamily: `${theme('fontFamily.noto')} !important`,
        },
        '.prose': {
          fontFamily: theme('fontFamily.sans'),
        }
      });
    },
  ],
  daisyui: {
    themes: ["emerald", { dark: "dim" }],
    darkTheme: "dim",
  },
};

export default config;