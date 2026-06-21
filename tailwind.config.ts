import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pv-bg": "#0a0f1e",
        "pv-surface": "#0d1b3e",
        "pv-surface-2": "#112347",
        "pv-border": "#1e3a6e",
        "pv-blue": "#3b82f6",
        "pv-green": "#10b981",
        "pv-amber": "#f59e0b",
        "pv-red": "#ef4444",
        "pv-text": "#e2e8f0",
        "pv-muted": "#64748b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;