import express from "express";
import { createServer } from "http";
import path from "path";
import { connectDB } from "./db";
import { setupAuth } from "./auth";
import routes from "./routes";
import helmet from "helmet";
import fs from "fs";
import { Product, Settings } from "./models";
import { trackVisit } from "./visitors";

const app = express();
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// ─── SEO root routes ──────────────────────────────────────────────────────────
app.get("/robots.txt", (_req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: https://ujimatcha.store/sitemap.xml");
});

app.get("/llms.txt", (_req, res) => {
  res.type("text/plain").send(`# UJI MATCHA
UJI MATCHA (أوجي ماتشا) is a Saudi online store for authentic Japanese matcha from Uji, Kyoto.
Arabic: ماتشا، ماتشا يابانية، أوجي ماتشا، اوجي ماتشا، ماتشا الرياض، ماتشا السعودية، ماتشا جدة، ماتشا بارد، ماتشا ساخن، ماتشا لاتيه، مشروب صيفي، مشروب شتوي، طريقة تحضير الماتشا.
English: matcha, uji matcha, matcha Riyadh, matcha Saudi Arabia, ceremonial matcha, Japanese matcha, matcha latte, iced matcha, hot matcha, matcha delivery Saudi.
Canonical website: https://ujimatcha.store
`);
});

app.get("/sitemap.xml", async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select("_id updatedAt");
    const base = "https://ujimatcha.store";
    const staticPages = ["/", "/products", "/about", "/ritual", "/journal"];
    const urls = [
      ...staticPages.map(p => `  <url><loc>${base}${p}</loc><changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`),
      ...products.map(p => `  <url><loc>${base}/products/${p._id}</loc><lastmod>${new Date((p as any).updatedAt).toISOString().split("T")[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
    ];
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`);
  } catch { res.status(500).send(""); }
});

(async () => {
  await connectDB();
  setupAuth(app);

  // ── Visitor tracking middleware (non-API, non-asset requests) ──
  app.use((req, _res, next) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/uploads") && !req.path.startsWith("/assets") && !req.path.includes(".")) {
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "anon";
      trackVisit(ip);
    }
    next();
  });

  app.use("/api", routes);

  const httpServer = createServer(app);
  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./static");
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    console.log(`🚀 Store running on port ${port}`);
  });
})();