# Troubleshooting: `createUser failed: Database error checking email`

This message is returned by **Supabase Auth (GoTrue)** when a **Postgres query fails** while creating or validating a user. Your app script is fine; the failure is in the **hosted database / auth schema**.

## 1. Get the real error (required)

1. Open **Supabase Dashboard** → **Logs** → **Postgres Logs**.
2. Run `npm run create-admin` again.
3. Refresh logs and look for **ERROR** lines at the same timestamp (often mentions `auth.users`, a **trigger**, **permission**, or **constraint**).

Also check **Logs** → **Auth Logs** for the same time.

The script prints `code` / `status` when available; the **Postgres log line** is what fixes the root cause.

## 2. Common causes

| Cause | What to do |
|--------|------------|
| **Custom trigger** on `auth.users` (or related) | Drop or fix the trigger / function (see SQL below). |
| **Auth Hook** (HTTP hook on sign-up) | Temporarily disable in **Authentication** → **Hooks** and retry. |
| **Broken / partial user** from old SQL experiments | **Authentication** → **Users**: delete that email (and any duplicates). Retry `create-admin`. |
| **Prisma or manual changes** to `auth` schema | Restore default permissions / schema per [Supabase troubleshooting](https://supabase.com/docs/guides/troubleshooting). |

## 3. List triggers on `auth` tables

Run in **SQL Editor** (as project owner):

```sql
SELECT
  n.nspname   AS schema,
  c.relname   AS table_name,
  t.tgname    AS trigger_name,
  pg_get_triggerdef(t.oid, true) AS definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
  AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;
```

Triggers **you** added (not Supabase core) are the usual suspects. Do not drop core Supabase triggers unless support tells you to.

## 4. Try a different email

To see if the problem is specific to one address:

```bash
set ADMIN_EMAIL=test-admin@yourdomain.com
set ADMIN_PASSWORD=YourSecurePass123
npm run create-admin
```

(PowerShell: `$env:ADMIN_EMAIL="..."`; `$env:ADMIN_PASSWORD="..."`.)

If that works, delete the broken user for `nirruu20@bm-portfolio.org` in the Dashboard and run again with the default email.

## 5. Create user in the Dashboard

**Authentication** → **Users** → **Add user** → email + password → **Auto Confirm User**.

- If **Dashboard creation also fails**, the issue is 100% project/DB (triggers, hooks, or schema) — use Postgres logs.
- If **Dashboard works** but the script fails, compare timestamps in Auth logs and open an issue with Supabase including the **request id** from logs.

## 6. New Supabase project (last resort)

If the project was used for experiments and `auth` is corrupted, create a **new Supabase project**, run `docs/sql/001_schema.sql` → `002_policies.sql` → `003_seed.sql` (see [sql/README.md](sql/README.md)), then `npm run create-admin` — only after you have exported anything you still need.

## 7. Signed in but saves fail (`permission denied` / RLS)

If you applied `docs/sql/002_policies.sql`, **only** users listed in `public.app_admins` may INSERT/UPDATE/DELETE portfolio tables.

- Run `npm run create-admin` after the SQL scripts (it upserts the new user into `app_admins`).
- Or if you created the user in the Dashboard only, add the row manually:

```sql
INSERT INTO public.app_admins (user_id)
SELECT id FROM auth.users WHERE email = 'your@email.com' LIMIT 1
ON CONFLICT (user_id) DO NOTHING;
```

(Run in SQL Editor with sufficient privileges, or use the **service role** in a script.)
