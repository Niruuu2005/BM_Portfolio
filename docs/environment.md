# Environment variables (single root `.env`)

## What to edit locally

| Location | Purpose |
|----------|---------|
| **Repository root** | Copy [`.env.example`](../.env.example) to **`.env`** (same folder as `vercel.json`). This is the only file you need for local dev. |

Do **not** commit `.env`. It is listed in the root [`.gitignore`](../.gitignore).

## What loads the root `.env`

| Component | How |
|-----------|-----|
| **Vite** (`npm run dev` / `npm run build` in `frontend/`) | [`frontend/vite.config.js`](../frontend/vite.config.js) sets `envDir` to the repo root and **proxies `/api`** to FastAPI (default `http://127.0.0.1:8000`, override with `VITE_DEV_API_PROXY`). Without this, `VITE_API_URL=/api` would hit the Vite server and return **404**. |
| **FastAPI** (`uvicorn` from `api/`) | [`api/app/config.py`](../api/app/config.py) loads via **python-dotenv** (in order): root `.env`, root `.env.local`, `api/.env`, `api/.env.local`, `frontend/.env`, `frontend/.env.local`. **Later files override** duplicate keys. |
| **`create-admins` script** | [`frontend/scripts/create-supabase-admin.mjs`](../frontend/scripts/create-supabase-admin.mjs) loads root `.env` first, then legacy `frontend/.env` if present. |

For the admin script, `create-supabase-admin.mjs` loads root first, then legacy `frontend/.env` (first file wins per key). For FastAPI, use the order above. If the DB cannot connect, see [troubleshooting_db.md](troubleshooting_db.md).

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
