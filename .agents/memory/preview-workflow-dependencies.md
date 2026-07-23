---
name: Preview workflow dependencies
description: Environment-specific dependency behavior for the isolated mockup preview workflow.
---

The mockup preview workflow runs from the workspace but loads its Vite configuration through the root dependency resolution path. Its package manifest alone may not provide every Vite plugin at runtime; missing plugins can surface one at a time during workflow startup.

**Why:** The preview workflow initially failed on several Vite plugins even though the artifact manifest declared them, while the main store workflow remained healthy.

**How to apply:** When repairing the mockup preview workflow, verify plugin resolution from the root `node_modules` and validate the workflow logs after each dependency change. Keep this separate from the main storefront runtime.