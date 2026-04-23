# I.LuxuryEgypt

Bespoke luxury travel website (Express + React + Vite + Drizzle/PostgreSQL).

## Stack
- Node.js 20, TypeScript
- Express server (`server/`) serving the API and Vite middleware in dev
- React + Vite client (`client/`)
- Shared Drizzle schema (`shared/schema.ts`)
- PostgreSQL via Drizzle ORM (auto-detects Neon vs `pg` driver from `DATABASE_URL`)

## Replit Setup
- Workflow: `Server` runs `npm run dev` on port 5000 (webview)
- Port 5000 serves both API and frontend (Vite middleware in dev, static in prod)
- Vite is configured with `allowedHosts: true` so the proxied preview iframe works
- Database: Replit-managed PostgreSQL (`DATABASE_URL` env). Schema applied via `npm run db:push`. Initial data restored from `db-backup.sql`.
- Secrets: `JWT_SECRET` (development env), `DATABASE_URL` (managed)

## Deployment
- Target: `autoscale`
- Build: `npm run build`
- Run: `npm run start`
