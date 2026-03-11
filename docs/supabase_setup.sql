-- =============================================================================
-- BM Portfolio – Supabase Full Setup Script
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Utility trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ---------------------------------------------------------------------------
-- 1. PROFILE  (single row)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT,
  designation      TEXT,
  department       TEXT,
  institution      TEXT,
  institution_url  TEXT,
  email            TEXT,
  phone            TEXT,
  address          TEXT,
  tagline          TEXT,
  bio              TEXT,
  career_obj       TEXT,
  photo_url        TEXT,
  cv_url           TEXT,
  scholar_url      TEXT,
  scopus_url       TEXT,
  orcid_url        TEXT,
  wos_url          TEXT,
  researchgate_url TEXT,
  publons_url      TEXT,
  linkedin_url     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 2. EDUCATION
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
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

CREATE OR REPLACE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 3. EXPERIENCE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role                 TEXT NOT NULL,
  organization         TEXT NOT NULL,
  department           TEXT,
  start_date           DATE,
  end_date             DATE,
  is_current           BOOLEAN NOT NULL DEFAULT false,
  responsibilities     JSONB,           -- stored as array of strings
  sort_order           INTEGER NOT NULL DEFAULT 0,
  is_visible           BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_experience_updated_at
  BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 4. RESEARCH AREAS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_areas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  icon        TEXT,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_research_areas_updated_at
  BEFORE UPDATE ON public.research_areas
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 5. AWARDS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.awards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  awarding_body TEXT,
  award_type   TEXT,
  year         INTEGER,
  description  TEXT,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 6. RESEARCH GRANTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_grants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  funding_agency TEXT,
  amount         NUMERIC(15,2),
  status         TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing','completed')),
  start_date     DATE,
  end_date       DATE,
  description    TEXT,
  is_visible     BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_research_grants_updated_at
  BEFORE UPDATE ON public.research_grants
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 7. PUBLICATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.publications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pub_type       TEXT NOT NULL DEFAULT 'journal' CHECK (pub_type IN ('journal','conference','book_chapter','book')),
  title          TEXT NOT NULL,
  authors        TEXT,
  journal_name   TEXT,
  year           INTEGER,
  volume         TEXT,
  issue          TEXT,
  pages          TEXT,
  doi            TEXT,
  url            TEXT,
  publisher      TEXT,
  indexing       TEXT,
  impact_factor  NUMERIC(6,3),
  is_visible     BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 8. PATENTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patents (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  inventors          TEXT,
  application_number TEXT,
  patent_number      TEXT,
  filing_date        DATE,
  grant_date         DATE,
  status             TEXT NOT NULL DEFAULT 'filed' CHECK (status IN ('filed','published','granted')),
  country            TEXT DEFAULT 'India',
  is_visible         BOOLEAN NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_patents_updated_at
  BEFORE UPDATE ON public.patents
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 9. COPYRIGHTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.copyrights (
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

CREATE OR REPLACE TRIGGER trg_copyrights_updated_at
  BEFORE UPDATE ON public.copyrights
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 10. SUBJECTS TAUGHT
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects_taught (
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

CREATE OR REPLACE TRIGGER trg_subjects_taught_updated_at
  BEFORE UPDATE ON public.subjects_taught
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 11. STUDY MATERIALS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_materials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  subject      TEXT,
  year         INTEGER,
  file_url     TEXT,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_study_materials_updated_at
  BEFORE UPDATE ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 12. PROJECTS GUIDED
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects_guided (
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

CREATE OR REPLACE TRIGGER trg_projects_guided_updated_at
  BEFORE UPDATE ON public.projects_guided
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 13. ACTIVITIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('fdp_attended','workshop_organized','guest_lecture','judge_mentor','reviewer')),
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

CREATE OR REPLACE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 14. MEMBERSHIPS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memberships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization    TEXT NOT NULL,
  membership_type TEXT,
  membership_id   TEXT,
  year_joined     INTEGER,
  is_visible      BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ---------------------------------------------------------------------------
-- 15. ADMIN ROLES  (administrative positions held at institution/university)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        TEXT NOT NULL,
  scope       TEXT,           -- Department / Institute / University
  institution TEXT,
  year_from   INTEGER,
  year_to     INTEGER,
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_admin_roles_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_areas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_grants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copyrights       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects_taught  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_guided  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles      ENABLE ROW LEVEL SECURITY;

-- Public read policies (profile has no is_visible, always readable)
CREATE POLICY "Public read profile"
  ON public.profile FOR SELECT USING (true);

CREATE POLICY "Public read education"
  ON public.education FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read experience"
  ON public.experience FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read research_areas"
  ON public.research_areas FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read awards"
  ON public.awards FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read research_grants"
  ON public.research_grants FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read publications"
  ON public.publications FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read patents"
  ON public.patents FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read copyrights"
  ON public.copyrights FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read subjects_taught"
  ON public.subjects_taught FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read study_materials"
  ON public.study_materials FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read projects_guided"
  ON public.projects_guided FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read activities"
  ON public.activities FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read memberships"
  ON public.memberships FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read admin_roles"
  ON public.admin_roles FOR SELECT USING (is_visible = true);

-- Authenticated (admin) full-access policies
CREATE POLICY "Admin access profile"
  ON public.profile FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access education"
  ON public.education FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access experience"
  ON public.experience FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access research_areas"
  ON public.research_areas FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access awards"
  ON public.awards FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access research_grants"
  ON public.research_grants FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access publications"
  ON public.publications FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access patents"
  ON public.patents FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access copyrights"
  ON public.copyrights FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access subjects_taught"
  ON public.subjects_taught FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access study_materials"
  ON public.study_materials FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access projects_guided"
  ON public.projects_guided FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access activities"
  ON public.activities FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access memberships"
  ON public.memberships FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin access admin_roles"
  ON public.admin_roles FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);


-- =============================================================================
-- SEED DATA  (from profile.md)
-- =============================================================================

-- Profile
INSERT INTO public.profile (
  name, designation, department, institution, institution_url,
  email, address, tagline, bio, career_obj,
  scholar_url, scopus_url, wos_url
) VALUES (
  'Mrs. B. Mahalakshmi (Mahalakshmi Bodireddy)',
  'Assistant Professor',
  'Computer Engineering',
  'Pimpri Chinchwad College of Engineering (PCCOE), Nigdi',
  'https://www.pccoepune.com',
  'mahalakshmi.bodireddy@pccoepune.org',
  'Dept. of Computer Engineering, PCCOE, Sector 26, Pradhikaran, Nigdi, Pune – 411044',
  'Empowering learners through Data Science, AI, and over two decades of academic excellence',
  'Mrs. B. Mahalakshmi is a dedicated Assistant Professor in the Department of Computer Engineering at PCCOE, Pune, with over 20 years of teaching experience. She has been an integral part of the institution since approximately 2005, contributing to undergraduate teaching, student mentorship, departmental governance, and applied research. Her work spans the intersection of data analytics, machine learning, and healthcare diagnostics, with notable contributions to biomedical signal processing and automated medical image analysis. She is currently pursuing her Ph.D. while actively serving as an internal member of the Board of Studies (BoS) for the Computer Engineering department.',
  'To foster a culture of innovation and research excellence in Computer Engineering by integrating applied data science methodologies into teaching and contributing to meaningful technological advancements in healthcare and human-computer interaction domains.',
  'https://scholar.google.com/citations?user=HyzudGMAAAAJ',
  'https://www.scopus.com/authid/detail.uri?authorId=57190399971',
  'https://www.webofscience.com/wos/author/record/ACK-3444-2022'
);

-- Education
INSERT INTO public.education (degree, field_of_study, institution, university, start_year, end_year, is_pursuing, sort_order, is_visible) VALUES
  ('Ph.D.',    'Computer Engineering / Data Science', 'PCCOE',  'Savitribai Phule Pune University (SPPU)', NULL,  NULL, true,  1, true),
  ('M.E.',     'Computer Engineering',                NULL,      'Savitribai Phule Pune University (SPPU)', NULL,  NULL, false, 2, true),
  ('B.Tech',   'Computer Science and Engineering',    NULL,      NULL,                                       NULL,  NULL, false, 3, true),
  ('B.E.',     'Computer Engineering',                NULL,      NULL,                                       NULL,  NULL, false, 4, true);

-- Experience
INSERT INTO public.experience (role, organization, department, start_date, is_current, responsibilities, sort_order, is_visible) VALUES
  (
    'Assistant Professor',
    'Pimpri Chinchwad College of Engineering (PCCOE)',
    'Computer Engineering',
    '2005-06-01',
    true,
    '["Teaching UG courses in Data Analytics, Data Science, and System Programming",
      "Student mentoring and career guidance",
      "Higher Studies Cell Coordinator",
      "Internal Member – Board of Studies (BoS), Computer Engineering",
      "NEP 2020 curriculum design and implementation"]'::jsonb,
    1,
    true
  );

-- Research Areas
INSERT INTO public.research_areas (name, icon, sort_order, is_visible) VALUES
  ('Data Analytics',             '📊', 1, true),
  ('Data Science',               '🔬', 2, true),
  ('System Programming',         '💻', 3, true),
  ('Machine Learning',           '🤖', 4, true),
  ('Biomedical Signal Processing','💓', 5, true),
  ('Medical Image Analysis',     '🏥', 6, true),
  ('Computer Vision',            '👁️',  7, true);

-- Publications
INSERT INTO public.publications (pub_type, title, authors, journal_name, year, indexing, is_visible) VALUES
  (
    'conference',
    'A Three Lead Wireless ECG System',
    'B. Mahalakshmi, Ankush Dudani, Chippy Kumar, Avinash Ghatge',
    '3rd International Conference on Computing, Communication, Control and Automation (ICCUBEA-2017)',
    2017,
    'Scopus',
    true
  ),
  (
    'journal',
    'Comparative Study of Automated Glaucoma Detection Using Machine Learning',
    'B. Mahalakshmi et al.',
    NULL,
    NULL,
    NULL,
    true
  ),
  (
    'conference',
    'Real-Time Human Sitting Posture Detection Using YOLOv5',
    'B. Mahalakshmi et al.',
    NULL,
    NULL,
    NULL,
    true
  );

-- Activities
INSERT INTO public.activities (activity_type, title, organizer, venue, year, role, is_visible) VALUES
  ('workshop_organized', 'Seminar on Overseas Education Awareness',                    'PCCOE', 'PCCOE, Pune', 2012, 'Coordinator',    true),
  ('workshop_organized', 'Seminar on TOEFL Scholarship Program & Knowledge Sharing Session', 'PCCOE', 'PCCOE, Pune', 2012, 'Co-coordinator', true),
  ('guest_lecture',      'ICCUBEA-2017 – Paper Presentation',                          'PCCOE', 'PCCOE, Pune', 2017, 'Author/Presenter', true);

-- Subjects Taught
INSERT INTO public.subjects_taught (subject_name, level, year_from, is_visible) VALUES
  ('System Programming',  'UG', 2005, true),
  ('Data Analytics',      'UG', NULL, true),
  ('Data Science',        'UG', NULL, true);

-- Admin Roles
INSERT INTO public.admin_roles (role, scope, institution, year_from, is_visible) VALUES
  ('Internal Member, Board of Studies (BoS) – Computer Engineering', 'Department', 'PCCOE', 2022, true),
  ('Higher Studies Cell Coordinator',                                 'Department', 'PCCOE', 2012, true),
  ('Member, Faculty Development Wing (FDW) Activities',              'Institute',  'PCCOE', NULL, true),
  ('Examiner / Paper Setter',                                         'University', 'SPPU',  NULL, true);
