-- =============================================================================
-- BM Portfolio — SQL setup (split scripts)
-- =============================================================================
-- The full bootstrap is now three small files (easier to read and maintain):
--
--   1) docs/sql/001_schema.sql   — tables + triggers
--   2) docs/sql/002_policies.sql  — RLS + app admin checks
--   3) docs/sql/003_seed.sql      — sample data
--
-- Optional teardown first: docs/sql/000_reset.sql
-- Then run them IN THAT ORDER in Supabase → SQL Editor.
-- Then create the login user from frontend:  npm run create-admin
-- (see docs/sql/README.md and docs/create_admin_user.sql).
-- If you already ran an older 001 once: docs/sql/004_migration_study_materials_categories.sql
-- =============================================================================

SELECT 'Open docs/sql/README.md — fresh: 000(optional)→001→002→003. Existing DB: run 004 if needed.' AS instruction;
