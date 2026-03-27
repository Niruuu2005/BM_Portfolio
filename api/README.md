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

```bash
cd api
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health: `GET http://localhost:8000/api/health`
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

