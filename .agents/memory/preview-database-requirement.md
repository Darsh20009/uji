---
name: Preview database requirement
description: Environment constraint for starting the UJI development preview.
---

The UJI development server requires a MongoDB connection before it starts listening for web traffic.

**Why:** The server intentionally fails fast when `MONGODB_URI` is absent, so a missing secret appears as a failed workflow rather than a port or frontend problem.

**How to apply:** When the preview fails before reporting port 5000, verify that the shared `MONGODB_URI` secret exists before changing workflow or port configuration.