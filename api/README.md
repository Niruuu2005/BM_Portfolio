# Portfolio API (FastAPI)

Server-side access to Postgres (bypasses RLS). Public routes return only visible rows; admin routes require a valid Supabase JWT and a row in `app_admins` with `role` `super` or `editor`.

- **`super`**: all admin routes (profile, stats, every CRUD table).
- **`editor`**: teaching data only - `subjects_taught`, `study_materials`, `projects_guided`, plus `GET /api/admin/subjects_taught/options` and `GET /api/admin/me`.

Run `docs/sql/005_app_admins_role.sql` on databases created before the `role` column existed. Seed users with `npm run create-admins` in `frontend/`.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase Postgres connection string (direct or pooler; server role). |
| `SUPABASE_JWT_SECRET` | Dashboard -> Settings -> API -> JWT Secret (HS256 verification). |
| `CORS_ORIGINS` | Comma-separated browser origins, e.g. `http://localhost:5173,https://your-site.com`. |
| `CORS_ORIGIN_REGEX` | Optional regex for dynamic origins, e.g. `^https://.*\\.vercel\\.app$`. |

Use a **single `.env` at the repository root** (copy from `.env.example`). FastAPI loads it automatically. See [`docs/environment.md`](../docs/environment.md).

## Run locally

**Always run uvicorn from the `api/` folder** (the directory that contains the `app/` package), not from `api/app/`.

If you `cd api/app` and run `uvicorn main:app`, Python cannot resolve `from app.config` and you get `ModuleNotFoundError: No module named 'app'`. Use:

```bash
cd api
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or double-click / run [`run-dev.ps1`](run-dev.ps1) (Windows) or [`run-dev.sh`](run-dev.sh) from the `api/` directory.

### Port already in use or `WinError 10013` (Windows)

Usually **port 8000 is already taken** (another uvicorn, Docker, etc.) or Windows is blocking the bind.

1. **Use another port** (example `8001`):

   ```powershell
   $env:API_PORT = "8001"
   .\run-dev.ps1
   ```

   In the **repo root** `.env`, point Vite at the same port:

   ```env
   VITE_DEV_API_PROXY=http://127.0.0.1:8001
   ```

   If you use `VITE_API_URL=http://localhost:8000/api` instead of `/api`, set that URL to match the port.

2. **Or free port 8000**: in PowerShell, `Get-NetTCPConnection -LocalPort 8000` then `Stop-Process -Id <OwningProcess>` for a stuck old uvicorn.

- Health: `GET http://localhost:<port>/api/health` (e.g. `http://127.0.0.1:8000/api/health`)
- Public: prefix `/api/public` (no auth)
- Admin: prefix `/api/admin` (header `Authorization: Bearer <supabase access_token>`)
- `GET /api/admin/me` returns `{ user_id, role }` for the signed-in admin.

## Frontend

Set `VITE_*` and `VITE_API_URL` in the **repo root** `.env` (same file as backend vars):

- Local direct backend: `VITE_API_URL=http://localhost:8000/api`
- Vercel Services deployment: `VITE_API_URL=/api`

The React app keeps Supabase Auth and Storage uploads; table data goes through this API.

## Deploy on Vercel (Services)

Use the root-level deployment guide: [`docs/vercel_backend_deploy.md`](../docs/vercel_backend_deploy.md).

## SQL

Schema and policies live in `docs/sql/` (see `docs/sql/README.md`).

