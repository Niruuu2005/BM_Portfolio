# Module — Database Schema

> **Module Goal:** Create all 15 PostgreSQL tables required by the academic website. Every table follows consistent conventions: UUID primary keys, `is_visible` flag for content moderation, and `created_at`/`updated_at` timestamps. Run all SQL in Supabase SQL Editor.

---

## 2.1 Conventions Used Across All Tables

| Convention | Rule |
|------------|------|
| Primary key | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Timestamps | `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at TIMESTAMPTZ DEFAULT now()` |
| Visibility | `is_visible BOOLEAN DEFAULT true` — false hides from public without deleting |
| Sort order | `sort_order INT DEFAULT 0` — for manual ordering where needed |
| Naming | All `snake_case` |

---

## 2.2 Auto-Update `updated_at` Trigger

Run this **first**, before creating any tables:

```sql
-- Create the trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

After creating each table with `updated_at`, apply the trigger:
```sql
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON <table_name>
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
```

---

## 2.3 Table 1: `profile`

The single core identity row. Should always have exactly 1 row.

```sql
CREATE TABLE public.profile (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT NOT NULL,
  designation      TEXT,
  department       TEXT,
  institution      TEXT,
  email            TEXT,
  phone            TEXT,
  office_addr      TEXT,
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
  github_url       TEXT,
  youtube_url      TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profile
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert your initial profile row (edit values before running)
INSERT INTO public.profile (full_name, designation, department, institution, email)
VALUES ('Dr. Your Name', 'Associate Professor', 'Computer Engineering', 'PCCOE, Pune', 'you@email.com');
```

---

## 2.4 Table 2: `education`

```sql
CREATE TABLE public.education (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree           TEXT NOT NULL,         -- "Ph.D.", "M.E.", "B.E.", "HSC"
  specialization   TEXT,
  institution      TEXT,
  university       TEXT,
  year             INT,
  score            TEXT,                  -- "9.1 CGPA" or "87.5%"
  rank_distinction TEXT,                  -- "1st Rank SPPU" or null
  thesis_title     TEXT,                  -- PhD/ME only
  sort_order       INT DEFAULT 0,
  is_visible       BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.5 Table 3: `experience`

```sql
CREATE TABLE public.experience (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designation      TEXT NOT NULL,
  department       TEXT,
  institution      TEXT NOT NULL,
  type             TEXT DEFAULT 'academic', -- 'academic' | 'industry' | 'research'
  start_date       DATE,
  end_date         DATE,                    -- NULL means "Present"
  is_current       BOOLEAN DEFAULT false,
  responsibilities TEXT[],                  -- array of bullet points
  sort_order       INT DEFAULT 0,
  is_visible       BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.experience
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.6 Table 4: `research_areas`

```sql
CREATE TABLE public.research_areas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  icon       TEXT,                          -- e.g., emoji "🤖" or icon name
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 2.7 Table 5: `awards`

```sql
CREATE TABLE public.awards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  awarded_by  TEXT,
  year        INT,
  description TEXT,
  url         TEXT,
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.awards
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.8 Table 6: `research_grants`

```sql
CREATE TABLE public.research_grants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  funding_agency TEXT,
  ref_no         TEXT,
  amount         NUMERIC,
  duration_from  DATE,
  duration_to    DATE,
  status         TEXT DEFAULT 'submitted', -- 'submitted'|'received'|'ongoing'|'completed'
  role           TEXT DEFAULT 'PI',         -- 'PI' | 'Co-PI'
  description    TEXT,
  is_visible     BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.research_grants
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.9 Table 7: `publications`

This is the largest table. Uses a `type` discriminator to cover journals, conferences, books, and book chapters.

```sql
CREATE TABLE public.publications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT NOT NULL CHECK (type IN ('journal','conference','book','book_chapter')),
  title      TEXT NOT NULL,
  authors    TEXT NOT NULL,
  venue      TEXT,
  volume     TEXT,
  issue      TEXT,
  pages      TEXT,
  year       INT,
  doi        TEXT,
  url        TEXT,
  publisher  TEXT,
  indexing   TEXT CHECK (indexing IN ('SCI','Scopus','UGC','Others') OR indexing IS NULL),
  isbn_issn  TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_publications_type ON public.publications(type);
CREATE INDEX idx_publications_year ON public.publications(year DESC);
CREATE INDEX idx_publications_visible ON public.publications(is_visible);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.10 Table 8: `patents`

```sql
CREATE TABLE public.patents (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  inventors      TEXT NOT NULL,
  application_no TEXT,
  filing_date    DATE,
  year           INT,
  country        TEXT DEFAULT 'India',
  status         TEXT DEFAULT 'filed' CHECK (status IN ('filed','published','exam','granted')),
  description    TEXT,
  is_visible     BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.patents
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.11 Table 9: `copyrights`

```sql
CREATE TABLE public.copyrights (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  reg_no     TEXT,
  reg_date   DATE,
  year       INT,
  type       TEXT,       -- 'lab_manual' | 'software' | 'research' | 'presentation'
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 2.12 Table 10: `subjects_taught`

```sql
CREATE TABLE public.subjects_taught (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject    TEXT NOT NULL,
  level      TEXT NOT NULL CHECK (level IN ('UG','PG')),
  department TEXT,
  year_from  INT,
  year_to    INT,           -- NULL means currently teaching
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 2.13 Table 11: `study_materials`

```sql
CREATE TABLE public.study_materials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  subject    TEXT,
  level      TEXT CHECK (level IN ('UG','PG')),
  department TEXT,
  year       INT,
  file_url   TEXT NOT NULL,
  file_type  TEXT DEFAULT 'pdf' CHECK (file_type IN ('pdf','ppt','doc','xlsx')),
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.study_materials
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.14 Table 12: `projects_guided`

```sql
CREATE TABLE public.projects_guided (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  level        TEXT NOT NULL CHECK (level IN ('BE','ME','MTech','PhD')),
  team_members TEXT,
  team_size    INT,
  year         INT,
  domain       TEXT,
  tech_stack   TEXT,
  description  TEXT,
  is_visible   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.projects_guided
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.15 Table 13: `activities`

Single table handles all activity types via a `type` column:

```sql
CREATE TABLE public.activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL CHECK (type IN (
    'fdp_attended',       -- FDPs / Workshops / MOOCs attended
    'workshop_organized', -- Workshops / FDPs organized
    'guest_lecture',      -- Guest lectures / talks given
    'judge_mentor',       -- Judging / mentoring events
    'reviewer'            -- Reviewer / TPC / Editor roles
  )),
  title           TEXT NOT NULL,
  organizer       TEXT,
  venue           TEXT,
  institution     TEXT,
  journal         TEXT,
  date_from       DATE,
  date_to         DATE,
  year            INT,
  duration        TEXT,
  mode            TEXT CHECK (mode IN ('Online','Offline','Hybrid') OR mode IS NULL),
  role            TEXT,
  description     TEXT,
  certificate_url TEXT,
  is_visible      BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activities_type ON public.activities(type);
CREATE INDEX idx_activities_year ON public.activities(year DESC);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 2.16 Table 14: `memberships`

```sql
CREATE TABLE public.memberships (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization TEXT NOT NULL,
  type         TEXT DEFAULT 'member' CHECK (type IN ('life_member','member','senior_member','fellow')),
  member_no    TEXT,
  year_from    INT,
  year_to      INT,
  is_visible   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

---

## 2.17 Table 15: `admin_roles`

```sql
CREATE TABLE public.admin_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        TEXT NOT NULL,
  scope       TEXT CHECK (scope IN ('Institute','University','Department','State','National')),
  institution TEXT,
  year_from   INT,
  year_to     INT,
  description TEXT,
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 2.18 Full Run Order (Copy-Paste This Sequence)

```
1. Create trigger function: handle_updated_at()
2. CREATE TABLE profile          + trigger
3. CREATE TABLE education        + trigger
4. CREATE TABLE experience       + trigger
5. CREATE TABLE research_areas
6. CREATE TABLE awards           + trigger
7. CREATE TABLE research_grants  + trigger
8. CREATE TABLE publications     + indexes + trigger
9. CREATE TABLE patents          + trigger
10. CREATE TABLE copyrights
11. CREATE TABLE subjects_taught
12. CREATE TABLE study_materials  + trigger
13. CREATE TABLE projects_guided  + trigger
14. CREATE TABLE activities       + indexes + trigger
15. CREATE TABLE memberships
16. CREATE TABLE admin_roles
17. INSERT initial profile row
```

---

## 2.19 Verify All Tables

```sql
-- See all tables in the public schema
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Count rows per table (quick health check)
SELECT
  'profile'          AS tbl, COUNT(*) FROM public.profile UNION ALL
  SELECT 'education','',     COUNT(*) FROM public.education UNION ALL
  SELECT 'publications','',  COUNT(*) FROM public.publications UNION ALL
  SELECT 'patents','',       COUNT(*) FROM public.patents UNION ALL
  SELECT 'activities','',    COUNT(*) FROM public.activities;
```

---

## 2.20 Schema Completion Checklist

```
[ ] handle_updated_at() trigger function created
[ ] profile table created + initial row inserted
[ ] education table created
[ ] experience table created
[ ] research_areas table created
[ ] awards table created
[ ] research_grants table created
[ ] publications table + indexes created
[ ] patents table created
[ ] copyrights table created
[ ] subjects_taught table created
[ ] study_materials table created
[ ] projects_guided table created
[ ] activities table + indexes created
[ ] memberships table created
[ ] admin_roles table created
[ ] All updated_at triggers applied
[ ] All 15 tables visible in Table Editor
[ ] Initial profile row exists
```

---

*Backend Module — Database Schema | v1.0 — March 2026*
