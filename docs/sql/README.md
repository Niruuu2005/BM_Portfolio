# BM Portfolio — database setup (Supabase / Postgres)

Run these **in order** in **Supabase Dashboard → SQL Editor** (or `psql` as a privileged role):

| Step | File | Purpose |
|------|------|--------|
| **0** (optional) | [000_reset.sql](000_reset.sql) | **Wipe** portfolio tables + `is_app_admin` / `handle_updated_at` (use before 001 to clear an existing project) |
| 1 | [001_schema.sql](001_schema.sql) | Drop old tables, create schema (profile, teaching, study materials, programs, courses, assessments, `app_admins`, …) |
| 2 | [002_policies.sql](002_policies.sql) | RLS: public read of visible rows; **writes only** for users in `public.app_admins` |
| 3 | [003_seed.sql](003_seed.sql) | Sample portfolio + academic catalog + study/assessment seed rows |
| **4** (existing DB only) | [004_migration_study_materials_categories.sql](004_migration_study_materials_categories.sql) | Extend `material_type` for theory / references / assignments + URL comments |

To **fully clear and rebuild**: run `000_reset.sql`, then **1 → 2 → 3**, then `npm run create-admin`.

### Already applied 001–003?

Run **[004_migration_study_materials_categories.sql](004_migration_study_materials_categories.sql)** once to extend `study_materials.material_type` (theory, reference, assignment, reading, etc.) and add column hints for Drive URLs. New projects created from the updated `001_schema.sql` already include this; **004** is only for existing databases.

## Admin user (Auth)

Do **not** insert into `auth.users` by hand. After SQL:

```bash
cd frontend
npm run create-admin
```

Requires `SUPABASE_SERVICE_ROLE_KEY` and `VITE_SUPABASE_URL` in `frontend/.env`. The script creates the user and registers them in `public.app_admins` so the app can INSERT/UPDATE through RLS.

See also: [create_admin_user.sql](../create_admin_user.sql) and [troubleshooting_auth_create_user.md](../troubleshooting_auth_create_user.md).

## Schema highlights

- **Study materials**: `material_type` includes `theory`, `reference`, `reading`, `assignment`, plus `notes`, `slides`, `lab`, etc.; `file_url` / `external_url` for Drive or any HTTPS links; optional `subject_id` → `subjects_taught`.
- **Academic catalog**: `programs`, `courses` (optional FK from `assessments.course_id`).
- **Assessments**: assignments, quizzes, exams, labs (metadata + URLs).
- **Project artifacts**: extra files/decks per guided project.

The legacy monolithic script is kept as a pointer in [../supabase_setup.sql](../supabase_setup.sql).
