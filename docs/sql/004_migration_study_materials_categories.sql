-- =============================================================================
-- BM Portfolio — Migration (run once on existing DB after 001–003)
-- =============================================================================
-- Adds study-material categories for: theory, references/books, assignments,
-- plus Drive-friendly URL usage. Safe to run multiple times (idempotent checks).
--
-- After this: use Admin → Teaching → Study materials with new types.
-- Store Google Drive links in file_url and/or external_url (see column comments).
-- =============================================================================

-- 1) Widen material_type CHECK (drop old auto-named constraint, add new)
ALTER TABLE public.study_materials
  DROP CONSTRAINT IF EXISTS study_materials_material_type_check;

ALTER TABLE public.study_materials
  ADD CONSTRAINT study_materials_material_type_check
  CHECK (material_type IN (
    'notes',
    'slides',
    'lab',
    'video',
    'code',
    'link',
    'theory',
    'reference',
    'assignment',
    'reading',
    'other'
  ));

COMMENT ON COLUMN public.study_materials.file_url IS
  'Direct file or download-style URL (e.g. Google Drive uc?export=download, or any HTTPS file link).';

COMMENT ON COLUMN public.study_materials.external_url IS
  'View / folder / web link (e.g. Drive file view, shared folder, publisher page).';

COMMENT ON COLUMN public.study_materials.material_type IS
  'Category: theory & notes (theory, notes, slides); references (reference, reading); work (assignment, lab); media (video, code, link); other.';

-- 2) Done
SELECT 'Migration 004 applied: study_materials material_type extended.' AS status;
