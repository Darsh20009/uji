import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  define: {
    __UJI_APP_VERSION__: JSON.stringify(process.env.APP_VERSION || "1.0.0"),
  },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "client", "src") } },
  root: path.resolve(import.meta.dirname, "client"),
  build: { outDir: path.resolve(import.meta.dirname, "dist/public"), emptyOutDir: true },
  server: { host: "0.0.0.0", allowedHosts: true, hmr: { clientPort: 443 } },
});