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
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Express session secret (stored as a Replit Secret) |
| `ADMIN_PHONE` | Phone number used to log in to `/admin` |
| `PORT` | Port to listen on (default: 5000) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `APPLE_CLIENT_ID` | Optional Apple OAuth |

## Admin panel

Navigate to `/admin` and enter the admin phone number (`ADMIN_PHONE`).

## Notes

- `postcss.config.cjs` uses `.cjs` extension because `package.json` sets `"type": "module"`
- Uploaded files are stored in the `uploads/` directory at the project root
