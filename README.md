# BM Portfolio

Academic portfolio site: **React (Vite)** frontend, **FastAPI** backend on **Supabase Postgres**, **Supabase Auth** (and optional Storage for uploads).

## Layout

| Path | Role |
|------|------|
| [`frontend/`](frontend/) | Public site + admin UI (`npm install`, `npm run dev`) |
| [`api/`](api/) | REST API (`uvicorn`); see [`api/README.md`](api/README.md) |
| [`docs/sql/`](docs/sql/README.md) | Database schema, RLS, migrations |
| [`vercel.json`](vercel.json) | Vercel Services: frontend `/`, API `/api` |

## Configuration

1. Copy [`.env.example`](.env.example) to **`.env`** at the **repository root** (next to `vercel.json`).
2. Set **`DATABASE_URL`** from Supabase → **Project Settings → Database** (connection string). Use the **pooler** or **direct** URI with the correct password.
3. Set **`VITE_*`** and **`SUPABASE_JWT_SECRET`** as needed.

See [`docs/environment.md`](docs/environment.md) for how Vite, FastAPI, and scripts load env files; [`docs/troubleshooting_db.md`](docs/troubleshooting_db.md) if the API cannot connect to Postgres.
