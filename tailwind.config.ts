import type { Config } from "tailwindcss";
export default {
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: { extend: { fontFamily: { sans: ["Cairo", "sans-serif"] } } },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;