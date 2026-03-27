# Vercel Backend Deployment Guide (Root = `BM_Portfolio`, Services at `/api`)

This guide deploys frontend and backend from the same repository root (`BM_Portfolio`) using Vercel Services:

- Web service at `/`
- FastAPI service at `/api`

With this setup, external backend routes are:

- `GET /api/health`
- `GET /api/public/*`
- `GET|POST|PUT|PATCH|DELETE /api/admin/*`

## Prerequisites

- Vercel account and access to the target team/project
- Supabase project values:
  - `DATABASE_URL`
  - `SUPABASE_JWT_SECRET`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Repository connected to Vercel

## Important note about Services access

Vercel Services may not be enabled in all workspaces. Verify your project can use the **Services** framework mode.

- If enabled: continue with this guide.
- If not enabled: use the fallback section at the end (`No Services access`).

## Repository files used by this setup

- Root service config: `vercel.json`
- Backend entrypoint: `api/index.py` (exports FastAPI `app`)
- Backend app: `api/app/main.py`
- **Env template (single file for local dev):** `.env.example` at repo root → copy to `.env` (see [docs/environment.md](environment.md))

## Local `.env` vs Vercel

- **Locally:** one `.env` at the repository root (next to `vercel.json`). Vite and FastAPI are configured to read it.
- **On Vercel:** no `.env` file is deployed; set the same variable names in **Project Settings → Environment Variables** for each service (see table below).

## Environment variables

Set these in Vercel Project Settings -> Environment Variables.

| Variable | Service | Example | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | web | `https://<project>.supabase.co` | Public value for frontend build/runtime |
| `VITE_SUPABASE_ANON_KEY` | web | `<anon-key>` | Public anon key |
| `VITE_API_URL` | web | `/api` | Required for same-domain services routing |
| `DATABASE_URL` | api | `postgresql://...` | Supabase Postgres connection string |
| `SUPABASE_JWT_SECRET` | api | `<jwt-secret>` | For verifying Supabase access tokens |
| `CORS_ORIGINS` | api | `https://your-domain.com,http://localhost:5173` | Explicit allowed origins |
| `CORS_ORIGIN_REGEX` | api | `^https://.*\\.vercel\\.app$` | Optional preview-domain wildcard |

Recommended scopes:

- Production: set production domain values
- Preview: include preview-safe values (`CORS_ORIGIN_REGEX` is useful here)
- Development: keep local values if you use `vercel dev`

## Deploy from Vercel Dashboard (recommended)

1. Import the Git repository into Vercel.
2. Keep **Root Directory** as repository root (`.` / `BM_Portfolio`).
3. Confirm `vercel.json` is present at the root.
4. Ensure framework mode supports Services.
5. Add all environment variables listed above.
6. Deploy.

## Deploy from CLI

```bash
# from repository root
npm i -g vercel
vercel login
vercel link

# add env vars (repeat per variable and scope)
vercel env add VITE_API_URL production
vercel env add VITE_API_URL preview
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
# ...add remaining variables from the matrix

# deploy preview
vercel

# deploy production
vercel --prod
```

## Verification checklist

After deployment, run:

```bash
curl -i https://<deployment-domain>/api/health
curl -i https://<deployment-domain>/api/public/profile
```

Expected:

- `/api/health` returns HTTP 200 and `{"status":"ok"}`
- `/api/public/profile` returns HTTP 200 (or HTTP 404 if profile data is not seeded)

Browser checks:

- Open the frontend domain and confirm public pages load data.
- Sign in as admin and confirm `/api/admin/*` operations work.
- Invalid token should return 401/403 on admin endpoints.

## Local development notes

Local direct FastAPI (without Services mount):

- Backend routes are `/api/health`, `/api/public/*`, `/api/admin/*` on `http://localhost:8000`
- Set frontend `VITE_API_URL=http://localhost:8000/api`

Vercel local emulation:

```bash
vercel dev -L
```

This runs services locally with route prefixes (including `/api`).

## No Services access (fallback)

If Services is unavailable, deploy as two Vercel projects:

1. API project:
   - Root Directory: `api`
   - Entry file exports `app` (`api/index.py`)
   - Configure backend env vars (`DATABASE_URL`, `SUPABASE_JWT_SECRET`, `CORS_*`)
2. Frontend project:
   - Root Directory: `frontend`
   - Set `VITE_API_URL=https://<api-project-domain>`
   - Keep Supabase frontend vars

Because the frontend client normalizes `/api/...` call paths, a base URL without `/api` still works in this fallback mode.

## References

- https://vercel.com/docs/services
- https://vercel.com/docs/services/routing
- https://vercel.com/docs/functions/runtimes/python
- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/frameworks/backend/fastapi