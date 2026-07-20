---
name: UJI Design System & Architecture
description: Brand colors, fonts, transparent assets, email, SEO, and admin architecture decisions for the UJI MATCHA store.
---

# UJI MATCHA — Design System & Architecture

## Brand Palette
- Ivory: `#F2EADB` (background)
- Ivory Warm: `#F7F2E8` (surface)
- Forest Green: `#1F3929` (primary)
- Deep Green: `#16281D` (dark sections, nav overlay, footer)
- Sage: `#9BA17B` (muted/accent)
- Stone: `#C8BBA4` (borders)
- Charcoal: `#1C201B` (foreground)

## Fonts
- Cormorant Garamond (serif) — headings, luxury
- IBM Plex Sans Arabic — Arabic body copy
- Inter — English labels, eyebrows

## Logo Assets (in /assets/brand/)
- Navbar transparent → `uji-logo-white-transparent.png` (on hero) / `uji-logo-charcoal-transparent.png` (scrolled)
- Footer → `uji-logo-forest-green-transparent.png`
- Admin panel → `uji-logo-forest-green-transparent.png`
- Navbar center: CSS-rendered "UJI" + "MATCHA" text (not image)

## Email (cPanel SMTP)
- Host: server222.web-hosting.com, Port: 465 (SSL)
- User: info@qirox.online
- Password: stored as `SMTP_PASS` secret
- Implementation: `server/email.ts` with nodemailer
- Sends: order confirmation (to customer if email provided), admin alert, newsletter welcome

## Admin Authentication
- Admin identified by phone === ADMIN_PHONE env var (0552469643)
- Admin must have a Customer document with that phone + password
- First-time setup: POST /api/auth/admin-setup with { password } creates the Customer
- Login screen has "إعداد حساب المدير لأول مرة" button for bootstrap

## SEO / AEO
- Full OG tags, Twitter cards in client/index.html
- JSON-LD: Organization, WebSite (with SearchAction), Store schemas
- sitemap.xml served at /sitemap.xml (root-level, server/index.ts)
- robots.txt served at /robots.txt (root-level, server/index.ts)
- Target domain: https://ujimatcha.store

## Render Deployment
- render.yaml in project root
- Region: frankfurt (closest to Saudi)
- Build: `npm install && npm run build`
- Start: `node dist/index.js`
- MONGODB_URI and SMTP_PASS must be added manually in Render dashboard

## Key Architectural Decisions
- Routes mounted at /api — sitemap/robots served separately at root
- Shipping threshold configurable via Settings model (key: shippingFreeThreshold)
- Newsletter subscribers stored in Settings model (key: newsletter_subscribers)
- Admin settings tab fully functional (was placeholder before)

**Why:** Keeping SEO routes at root (not /api) ensures crawlers find them. Settings in MongoDB allows changing without redeployment.
