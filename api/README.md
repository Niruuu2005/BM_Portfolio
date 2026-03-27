# Portfolio API (FastAPI)

Server-side access to Postgres (bypasses RLS). Public routes return only visible rows; admin routes require a valid Supabase JWT and membership in `app_admins`.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase Postgres connection string (direct or pooler; server role). |
| `SUPABASE_JWT_SECRET` | Dashboard → Settings → API → JWT Secret (HS256 verification). |
| `CORS_ORIGINS` | Comma-separated browser origins, e.g. `http://localhost:5173,https://your-site.com` |

Optional: copy `.env` in this folder or export variables in your shell.

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

## Frontend

Set `VITE_API_URL` in `frontend/.env` to the same origin as this API (e.g. `http://localhost:8000`). The React app keeps Supabase Auth and Storage uploads; table data goes through this API.

## SQL

Schema and policies live in `docs/sql/` (see `docs/sql/README.md`).
