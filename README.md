# BM Portfolio

Academic portfolio site: **React (Vite)** frontend, **FastAPI** backend on **Supabase Postgres**, **Supabase Auth** (and optional Storage for uploads).

## Layout

- [`frontend/`](frontend/) — public site + admin UI; `npm install` / `npm run dev`
- [`api/`](api/) — REST API; see [`api/README.md`](api/README.md)
- [`docs/sql/`](docs/sql/README.md) — database schema, RLS notes, seeds

Configure `frontend/.env` from `frontend/.env.example` (`VITE_SUPABASE_*`, `VITE_API_URL`).
