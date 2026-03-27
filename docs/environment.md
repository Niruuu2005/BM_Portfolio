# Environment variables (single root `.env`)

## What to edit locally

| Location | Purpose |
|----------|---------|
| **Repository root** | Copy [`.env.example`](../.env.example) to **`.env`** (same folder as `vercel.json`). This is the only file you need for local dev. |

Do **not** commit `.env`. It is listed in the root [`.gitignore`](../.gitignore).

## What loads the root `.env`

| Component | How |
|-----------|-----|
| **Vite** (`npm run dev` / `npm run build` in `frontend/`) | [`frontend/vite.config.js`](../frontend/vite.config.js) reads env from repo root, and proxies `/api` to `http://127.0.0.1:<API_PORT>` (default `8000`). Override with `VITE_DEV_API_PROXY` if needed. |
| **FastAPI** (`uvicorn` from `api/`) | [`api/app/config.py`](../api/app/config.py) loads only repo-root `.env` and `.env.local`. |
| **`create-admins` script** | [`frontend/scripts/create-supabase-admin.mjs`](../frontend/scripts/create-supabase-admin.mjs) supports root `.env`; avoid per-folder env files. |

## Variable reference

See [`.env.example`](../.env.example). In short:

- **`VITE_*`** - browser-visible vars.
- **`API_PORT`** - local FastAPI port used by Vite proxy.
- **`DATABASE_URL`**, **`SUPABASE_JWT_SECRET`**, **`CORS_*`** - backend only.
- **`SUPABASE_SERVICE_ROLE_KEY`** - scripts only, never in browser.

## Vercel

Vercel does not read local `.env` files from git. Set values in **Project Settings -> Environment Variables**.

Deployment guide: [vercel_backend_deploy.md](vercel_backend_deploy.md).
