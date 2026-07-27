import type { Express } from "express";
import path from "path";
import express from "express";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html") || filePath.endsWith("sw.js")) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      }
    },
  }));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}