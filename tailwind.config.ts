import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [{ pattern: /bg-subject_color_\d/, variants: ["hover", "focus"] }],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondaryBackground: "var(--secondary-background)",
        gray: "var(--gray)",
        primary: "var(--primary)",
        "primary-80": "var(--primary-80)",
        secondary: "var(--secondary)",
        textDefault: "var(--text-default)",
        border: "var(--border)",
        surface: "var(--surface)",
        subject_color_1: "var(--subject-color-1)",
        subject_color_2: "var(--subject-color-2)",
        subject_color_3: "var(--subject-color-3)",
        subject_color_4: "var(--subject-color-4)",
        subject_color_5: "var(--subject-color-5)",
        subject_color_6: "var(--subject-color-6)",
        subject_color_7: "var(--subject-color-7)",
        subject_color_8: "var(--subject-color-8)",
        subject_color_9: "var(--subject-color-9)",
        subject_color_10: "var(--subject-color-10)",
        error_red_bg: "var(--error-red-bg)",
        error_red_text: "var(--error-red-text)",
        error_red_border: "var(--error-red-border)",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
