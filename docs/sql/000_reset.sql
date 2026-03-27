-- =============================================================================
-- BM Portfolio — RESET (teardown public portfolio objects only)
-- =============================================================================
-- Use when you want to wipe portfolio data + tables before re-running setup.
--
-- WHAT THIS REMOVES:
--   • All public tables listed below (CASCADE: policies, triggers, indexes)
--   • Functions: is_app_admin(), handle_updated_at()
--
-- WHAT THIS DOES **NOT** REMOVE:
--   • auth.users (Authentication → delete users in Dashboard if needed)
--   • Storage buckets / files
--   • Other tables you added outside this project
--   • The public schema itself (Supabase needs it)
--
-- AFTER THIS SCRIPT, run in order:
--   001_schema.sql → 002_policies.sql → 003_seed.sql
-- (Skip 004 — that is only for upgrading an existing DB without reset.)
-- Then:  npm run create-admin  (recreates app_admins row for your login)
-- =============================================================================

-- Portfolio tables (dependency-safe order; FKs use CASCADE)
DROP TABLE IF EXISTS public.project_artifacts   CASCADE;
DROP TABLE IF EXISTS public.assessments         CASCADE;
DROP TABLE IF EXISTS public.courses             CASCADE;
DROP TABLE IF EXISTS public.programs            CASCADE;
DROP TABLE IF EXISTS public.app_admins          CASCADE;
DROP TABLE IF EXISTS public.admin_roles         CASCADE;
DROP TABLE IF EXISTS public.memberships         CASCADE;
DROP TABLE IF EXISTS public.activities          CASCADE;
DROP TABLE IF EXISTS public.projects_guided     CASCADE;
DROP TABLE IF EXISTS public.study_materials     CASCADE;
DROP TABLE IF EXISTS public.subjects_taught    CASCADE;
DROP TABLE IF EXISTS public.copyrights          CASCADE;
DROP TABLE IF EXISTS public.patents             CASCADE;
DROP TABLE IF EXISTS public.publications        CASCADE;
DROP TABLE IF EXISTS public.research_grants     CASCADE;
DROP TABLE IF EXISTS public.awards              CASCADE;
DROP TABLE IF EXISTS public.research_areas      CASCADE;
DROP TABLE IF EXISTS public.experience          CASCADE;
DROP TABLE IF EXISTS public.education           CASCADE;
DROP TABLE IF EXISTS public.profile             CASCADE;

-- Functions left from portfolio SQL (safe if already gone)
DROP FUNCTION IF EXISTS public.is_app_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Done. Run 001_schema.sql next.
SELECT 'Reset complete. Next: 001_schema.sql → 002_policies.sql → 003_seed.sql' AS next_step;
