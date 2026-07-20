import type { Config } from "tailwindcss";
export default {
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: { extend: { fontFamily: { sans: ["Alexandria", "sans-serif"] } } },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;