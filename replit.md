# uji

Arabic-language e-commerce store built by QIROX Studio.

## Stack

- **Frontend**: React 18, TailwindCSS, shadcn/ui components, TanStack Query, Wouter, Zustand
- **Backend**: Express + TypeScript (tsx), Passport.js (local auth)
- **Database**: MongoDB (Mongoose)
- **Build**: Vite (dev server proxied through Express in dev mode)

## Running the app

```bash
npm run dev    # development (port 5000)
npm run build  # production build
npm start      # serve production build
```

The workflow **Start application** runs `npm run dev` and serves on port 5000.

## Environment variables

| Key | Description |
|-----|-------------|
| `MONGODB_URI` | Required MongoDB connection URI; save it as a Replit Secret before starting the preview |
| `SESSION_SECRET` | Express session secret (stored as a Replit Secret) |
| `ADMIN_PHONE` | Phone number used to log in to `/admin` |
| `QIROX_WHATSAPP_PROJECT_ID` | QIROX project ID used by the project WhatsApp integration |
| `QIROX_WHATSAPP_API_KEY` | QIROX project WhatsApp Bearer key (`qrx_project_whatsapp_...`); store it only in Replit Secrets or Render's service Environment |
| `QIROX_WHATSAPP_ENVIRONMENT` | QIROX key environment: `development` for preview, `production` for Render |
| `PORT` | Port to listen on (default: 5000) |
| `APP_VERSION` | Current client/server release version (default: `1.0.0`); bump it to reset old browser cookies and cached app state |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `APPLE_CLIENT_ID` | Optional Apple OAuth |

Customer OTP uses QIROX's project integration endpoint, `/api/v1/projects/{projectId}/whatsapp`, documented at `https://qiroxstudio.online/api/v1/projects/integrations/docs`. This integration sends through the project's connected WhatsApp CRM and does not require a Meta template. QIROX development keys are for testing only; Render must use a production key. Replit Secrets are not automatically copied to Render, so add the production key in the Render service's Environment settings.

## Admin panel

Navigate to `/admin` and enter the admin phone number (`ADMIN_PHONE`).

Customer sign-in defaults to a one-time code delivered through QIROX WhatsApp. Existing customer password login remains available as a fallback, and the separate admin password flow is unchanged. Login codes expire after five minutes, are limited to five sends per hour per customer, and are verified server-side.

## Notes

- `postcss.config.cjs` uses `.cjs` extension because `package.json` sets `"type": "module"`
- Uploaded files are stored in the `uploads/` directory at the project root
- The development server waits for MongoDB before opening port 5000, so the preview will not start until `MONGODB_URI` is configured
