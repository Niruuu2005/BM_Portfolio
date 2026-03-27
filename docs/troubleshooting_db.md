# Database connection issues

## Symptoms

- API returns **503** with `"Database not configured"` or `"DATABASE_URL"`.
- Public pages or admin show errors loading data.

## Checklist

1. **`DATABASE_URL` is set**  
   Use the **repo root** `.env`, or `frontend/.env` / `api/.env` (all are loaded; later files override earlier ones).  
   See [`.env.example`](../.env.example).

2. **Supabase connection string**  
   - Dashboard → **Project Settings** → **Database** → copy **URI** (often port `6543` pooler or `5432` direct).  
   - Include the **database password** (replace `[YOUR-PASSWORD]` if the template shows a placeholder).  
   - The app appends `sslmode=require` automatically for Supabase hosts if your URL omits it.

3. **Run the API from the `api/` folder** (`uvicorn app.main:app`)  
   Env is loaded from `config.py` using absolute paths; **current working directory does not matter**.

4. **Vercel**  
   Do not rely on a committed `.env`. Set **`DATABASE_URL`** on the **API** service in the Vercel project’s **Environment Variables**.

5. **Firewall / IPv6**  
   If connection fails from your network, try a different network or Supabase’s **IPv4 pooler** / connection pooler settings.

## Verify locally

```bash
cd api
python -c "from app.config import settings; print('ok' if settings.database_url_normalized else 'missing DATABASE_URL')"
curl -s http://127.0.0.1:8000/api/health
```

With a valid URL, `GET /api/public/profile` should return JSON or 404 (if no row), not 503.
