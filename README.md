# Fast Lost & Found

Next.js/Vercel Lost & Found app for reporting lost or found items, matching them by tags, and verifying claims through an admin dashboard.

## Database

The app now supports MongoDB Atlas for real persistent signup/login data. Storage priority is:

1. MongoDB Atlas when `MONGODB_URI` is set
2. Vercel KV / Upstash when KV env vars are set
3. Local `data/db.json` during development

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Demo accounts:

```txt
Admin: admin@fastfound.local / Admin@12345
User:  student@fastfound.local / Student@12345
```

## Vercel Env Vars

Add these in Vercel project settings:

```txt
SESSION_SECRET=your-long-random-secret
ADMIN_EMAIL=admin@fastfound.local
ADMIN_PASSWORD=Admin@12345
MONGODB_URI=your-mongodb-atlas-connection-string
MONGODB_DB=fast_lost_found
```

Without MongoDB or KV, signup/login data on Vercel is demo-only and may reset.
