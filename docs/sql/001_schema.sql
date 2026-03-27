-- BM Portfolio — Schema only (fresh install)
-- Run after: none. Next: 002_policies.sql then 003_seed.sql
-- WARNING: Drops listed tables. Use only on empty / reset projects.

-- ── 0) Drop (dependency order) ───────────────────────────────
DROP TABLE IF EXISTS public.project_artifacts    CASCADE;
DROP TABLE IF EXISTS public.assessments          CASCADE;
DROP TABLE IF EXISTS public.courses              CASCADE;
DROP TABLE IF EXISTS public.programs             CASCADE;
DROP TABLE IF EXISTS public.app_admins           CASCADE;
DROP TABLE IF EXISTS public.admin_roles          CASCADE;
DROP TABLE IF EXISTS public.memberships          CASCADE;
DROP TABLE IF EXISTS public.activities           CASCADE;
DROP TABLE IF EXISTS public.projects_guided      CASCADE;
DROP TABLE IF EXISTS public.study_materials      CASCADE;
DROP TABLE IF EXISTS public.subjects_taught     CASCADE;
DROP TABLE IF EXISTS public.copyrights           CASCADE;
DROP TABLE IF EXISTS public.patents              CASCADE;
DROP TABLE IF EXISTS public.publications         CASCADE;
DROP TABLE IF EXISTS public.research_grants      CASCADE;
DROP TABLE IF EXISTS public.awards               CASCADE;
DROP TABLE IF EXISTS public.research_areas       CASCADE;
DROP TABLE IF EXISTS public.experience           CASCADE;
DROP TABLE IF EXISTS public.education           CASCADE;
DROP TABLE IF EXISTS public.profile             CASCADE;

-- ── 1) Utilities ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Who may edit content (filled by npm run create-admin → service role)
CREATE TABLE public.app_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2) Core portfolio tables ───────────────────────────────
CREATE TABLE public.profile (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT,
  designation          TEXT,
  department           TEXT,
  institution          TEXT,
  institution_url      TEXT,
  institution_logo_url TEXT,
  email                TEXT,
  phone                TEXT,
  address              TEXT,
  tagline              TEXT,
  bio                  TEXT,
  career_obj           TEXT,
  photo_url            TEXT,
  cv_url               TEXT,
  scholar_url          TEXT,
  scopus_url           TEXT,
  orcid_url            TEXT,
  wos_url              TEXT,
  researchgate_url     TEXT,
  publons_url          TEXT,
  linkedin_url         TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.education (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree         TEXT NOT NULL,
  field_of_study TEXT,
  institution    TEXT,
  university     TEXT,
  start_year     INTEGER,
  end_year       INTEGER,
  grade          TEXT,
  is_pursuing    BOOLEAN NOT NULL DEFAULT false,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_visible     BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.experience (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role             TEXT NOT NULL,
  organization     TEXT NOT NULL,
  department       TEXT,
  start_date       DATE,
  end_date         DATE,
  is_current       BOOLEAN NOT NULL DEFAULT false,
  responsibilities JSONB,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  is_visible       BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_experience_updated_at
  BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.research_areas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  icon        TEXT,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_research_areas_updated_at
  BEFORE UPDATE ON public.research_areas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.awards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  awarding_body TEXT,
  award_type    TEXT,
  year          INTEGER,
  description   TEXT,
  is_visible    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.research_grants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  funding_agency TEXT,
  amount         NUMERIC(15,2),
  status         TEXT NOT NULL DEFAULT 'ongoing'
    CHECK (status IN ('ongoing','completed')),
  start_date     DATE,
  end_date       DATE,
  description    TEXT,
  is_visible     BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_research_grants_updated_at
  BEFORE UPDATE ON public.research_grants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.publications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pub_type      TEXT NOT NULL DEFAULT 'journal'
    CHECK (pub_type IN ('journal','conference','book_chapter','book')),
  title         TEXT NOT NULL,
  authors       TEXT,
  journal_name  TEXT,
  year          INTEGER,
  volume        TEXT,
  issue         TEXT,
  pages         TEXT,
  doi           TEXT,
  url           TEXT,
  publisher     TEXT,
  indexing      TEXT,
  impact_factor NUMERIC(6,3),
  is_visible    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.patents (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  inventors          TEXT,
  application_number TEXT,
  patent_number      TEXT,
  filing_date        DATE,
  grant_date         DATE,
  status             TEXT NOT NULL DEFAULT 'filed'
    CHECK (status IN ('filed','published','granted')),
  country            TEXT DEFAULT 'India',
  is_visible         BOOLEAN NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_patents_updated_at
  BEFORE UPDATE ON public.patents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.copyrights (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  authors             TEXT,
  registration_number TEXT,
  registration_date   DATE,
  work_type           TEXT,
  year                INTEGER,
  is_visible          BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_copyrights_updated_at
  BEFORE UPDATE ON public.copyrights
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.subjects_taught (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name TEXT NOT NULL,
  subject_code TEXT,
  level        TEXT,
  year_from    INTEGER,
  year_to      INTEGER,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_subjects_taught_updated_at
  BEFORE UPDATE ON public.subjects_taught
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Academic structure (optional links from courses / assessments)
CREATE TABLE public.programs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  level       TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.courses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs (id) ON DELETE SET NULL,
  code       TEXT,
  name       TEXT NOT NULL,
  credits    NUMERIC(4,1),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Study materials: extended metadata + optional link to subject row
CREATE TABLE public.study_materials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  subject        TEXT,
  subject_id     UUID REFERENCES public.subjects_taught (id) ON DELETE SET NULL,
  description    TEXT,
  material_type  TEXT NOT NULL DEFAULT 'notes'
    CHECK (material_type IN (
      'notes','slides','lab','video','code','link',
      'theory','reference','assignment','reading','other'
    )),
  file_url       TEXT,
  external_url   TEXT,
  academic_term  TEXT,
  year           INTEGER,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_visible     BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_study_materials_updated_at
  BEFORE UPDATE ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.projects_guided (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  students     TEXT,
  level        TEXT NOT NULL DEFAULT 'UG' CHECK (level IN ('UG','PG')),
  year         INTEGER,
  description  TEXT,
  technologies TEXT,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_projects_guided_updated_at
  BEFORE UPDATE ON public.projects_guided
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.project_artifacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects_guided (id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  artifact_type TEXT,
  file_url    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_project_artifacts_updated_at
  BEFORE UPDATE ON public.project_artifacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Quizzes, assignments, exams (metadata; files via URL)
CREATE TABLE public.assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'assignment'
    CHECK (assessment_type IN ('assignment','quiz','exam','lab','project')),
  course_id       UUID REFERENCES public.courses (id) ON DELETE SET NULL,
  subject_hint    TEXT,
  description     TEXT,
  file_url        TEXT,
  external_url    TEXT,
  year            INTEGER,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_visible      BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'fdp_attended','workshop_organized','guest_lecture','judge_mentor','reviewer'
  )),
  title         TEXT NOT NULL,
  organizer     TEXT,
  venue         TEXT,
  year          INTEGER,
  duration      TEXT,
  role          TEXT,
  is_visible    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.memberships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization    TEXT NOT NULL,
  membership_type TEXT,
  membership_id   TEXT,
  year_joined     INTEGER,
  is_visible      BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.admin_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        TEXT NOT NULL,
  scope       TEXT,
  institution TEXT,
  year_from   INTEGER,
  year_to     INTEGER,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_admin_roles_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
