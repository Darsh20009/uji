---
name: App version reset
description: Release-version changes reset stale browser state and server sessions for the UJI store.
---

The application uses a shared `APP_VERSION` release value. Bumping it must invalidate stale browser cookies, local/session storage, service-worker caches, and legacy server sessions before the new app renders.

**Why:** Cached PWA assets and old authenticated sessions can keep devices on an incompatible release after a deployment.

**How to apply:** Change `APP_VERSION` in the deployment environment (and keep the Render value aligned) whenever a release requires a clean client state. The default remains `1.0.0` for local development.