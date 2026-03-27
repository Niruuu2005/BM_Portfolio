# Environment variables (single root `.env`)

## What to edit locally

| Location | Purpose |
|----------|---------|
| **Repository root** | Copy [`.env.example`](../.env.example) to **`.env`** (same folder as `vercel.json`). This is the only file you need for local dev. |

Do **not** commit `.env`. It is listed in the root [`.gitignore`](../.gitignore).

## What loads the root `.env`

| Component | How |
|-----------|-----|
| **Vite** (`npm run dev` / `npm run build` in `frontend/`) | [`frontend/vite.config.js`](../frontend/vite.config.js) sets `envDir` to the repo root so `VITE_*` variables are read from there. |
| **FastAPI** (`uvicorn` from `api/`) | [`api/app/config.py`](../api/app/config.py) loads, in order: root `.env`, root `.env.local`, optional `api/.env` (only files that exist). |
| **`create-admins` script** | [`frontend/scripts/create-supabase-admin.mjs`](../frontend/scripts/create-supabase-admin.mjs) loads root `.env` first, then legacy `frontend/.env` if present. |

First-defined value wins for the script; FastAPI merges env files with Pydantic’s usual rules.

## Variable reference

See the comments in [`.env.example`](../.env.example). In short:

- **`VITE_*`** — used by the browser; only these are exposed to the client.
- **`DATABASE_URL`**, **`SUPABASE_JWT_SECRET`**, **`CORS_*`** — FastAPI only.
- **`SUPABASE_SERVICE_ROLE_KEY`** — Node scripts only (`npm run create-admins`); never expose to the client.

## What to edit on Vercel (deployment)

Vercel does **not** use your committed `.env` file. For each deployment you must set the same logical names in the dashboard:

1. **Vercel** → your project → **Settings** → **Environment Variables**.
2. Add each key from [`.env.example`](../.env.example) for production (and preview if needed).
3. **Web** service needs `VITE_*` and `VITE_API_URL` (typically `/api` for the Services setup).
4. **API** service needs `DATABASE_URL`, `SUPABASE_JWT_SECRET`, `CORS_ORIGINS`, optional `CORS_ORIGIN_REGEX`.

Step-by-step deploy flow: [vercel_backend_deploy.md](vercel_backend_deploy.md).

## What to edit on GitHub

Only **tracked** files (e.g. `.env.example`, docs) are versioned. Push updates to those; never push secrets or `.env`.

```bash
git add .env.example docs/environment.md
git commit -m "docs: env layout"
git push
```
