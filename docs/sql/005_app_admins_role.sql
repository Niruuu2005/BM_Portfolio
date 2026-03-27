-- =============================================================================
-- BM Portfolio — Migration (run once on existing DB after 001–004)
-- =============================================================================
-- Adds app_admins.role: 'super' (full admin) vs 'editor' (teaching tables only).
-- Idempotent for re-runs.
-- =============================================================================

ALTER TABLE public.app_admins ADD COLUMN IF NOT EXISTS role TEXT;

UPDATE public.app_admins SET role = 'super' WHERE role IS NULL OR trim(role) = '';

ALTER TABLE public.app_admins ALTER COLUMN role SET DEFAULT 'editor';
ALTER TABLE public.app_admins ALTER COLUMN role SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'app_admins' AND c.conname = 'app_admins_role_check'
  ) THEN
    ALTER TABLE public.app_admins
      ADD CONSTRAINT app_admins_role_check CHECK (role IN ('super', 'editor'));
  END IF;
END $$;

COMMENT ON COLUMN public.app_admins.role IS
  'super: all admin API routes; editor: only subjects_taught, study_materials, projects_guided.';

-- After create-admins script: bmahalakshmi should be editor (script sets this).
-- Manual fix:
--   UPDATE public.app_admins SET role = 'editor'
--   WHERE user_id = (SELECT id FROM auth.users WHERE lower(email) = lower('bmahalakshmi@bm-portfolio.org') LIMIT 1);

SELECT 'Migration 005 applied: app_admins.role.' AS status;
