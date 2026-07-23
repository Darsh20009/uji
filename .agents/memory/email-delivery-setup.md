---
name: Email delivery setup
description: Production SMTP and email image-delivery constraints for the UJI store.
---

Production email depends on the cPanel SMTP password being configured in Render; Replit secrets are not copied into Render automatically. Email branding should use inline CID attachments because public asset URLs can return 404 or be blocked by mail clients.

**Why:** The custom storefront domain did not serve the expected asset paths, and missing production SMTP credentials caused sending to fail independently of the HTML template.

**How to apply:** When troubleshooting production email, verify the SMTP credentials in the deployment environment first, then confirm both inline logo and banner assets are attached before testing delivery.