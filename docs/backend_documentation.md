# ⚙️ Backend Documentation — Personal Academic Website

> **Stack:** Supabase (PostgreSQL + Auth + Storage + Realtime)
> **Auth Model:** Single admin user (email + password via Supabase Auth)
> **API:** Supabase auto-generated REST + JS SDK (no custom API server needed)

---

## 🏗️ Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │          SUPABASE PROJECT            │
                    │                                      │
  Frontend ─────►  │  ┌───────────┐  ┌───────────────┐   │
  (React/Next)     │  │  Auth     │  │   PostgreSQL  │   │
                   │  │  (Admin)  │  │   (Tables)    │   │
                   │  └───────────┘  └───────────────┘   │
                   │  ┌──────────────────────────────┐    │
                   │  │   Storage Buckets            │    │
                   │  │  - profile-photos            │    │
                   │  │  - cv-documents              │    │
                   │  │  - study-materials           │    │
                   │  └──────────────────────────────┘    │
                   │  ┌──────────────────────────────┐    │
                   │  │   Row Level Security (RLS)   │    │
                   │  │  - Public: READ only         │    │
                   │  │  - Admin: Full CRUD          │    │
                   │  └──────────────────────────────┘    │
                    └─────────────────────────────────────┘
```

---

## 🔐 Authentication Setup

### Auth Strategy
- **Type:** Email + Password (Supabase Auth)
- **Admin:** Single admin account (you — created manually)
- **Public users:** No sign-up. Site is read-only for everyone else.
- **Token:** Supabase JWT stored in browser localStorage / cookie

### Setup Steps

```sql
-- Step 1: Disable public sign-ups in Supabase Dashboard
-- Dashboard → Authentication → Settings → Disable "Enable email confirmations" for dev
-- And TURN OFF "Enable sign ups" so no one else can register

-- Step 2: Create the admin user manually
-- Dashboard → Authentication → Users → Add User
-- Email: your-email@gmail.com
-- Password: StrongPassword123!
```

### Admin Login Flow (Frontend)
```
User visits /admin
    → Login form shown
    → On submit → supabase.auth.signInWithPassword({ email, password })
    → If success → JWT stored → redirect to /admin/dashboard
    → If fail    → show error message
    → On any protected route → check session → if not authed → redirect to /admin/login
```

### Admin Logout
```javascript
await supabase.auth.signOut()
// Then redirect to / (home)
```

---

## 🗄️ Database Schema — All Tables

### Naming Convention
- All table names: `snake_case`
- Primary key: `id UUID DEFAULT gen_random_uuid()`
- All tables have: `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`
- Soft visibility: `is_visible BOOLEAN DEFAULT true` (hides from public without deleting)

---

### Table 1: `profile`
> Single row — your core identity.

```sql
CREATE TABLE profile (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT NOT NULL,
  designation  TEXT,                        -- e.g., "Associate Professor"
  department   TEXT,                        -- e.g., "Computer Engineering"
  institution  TEXT,                        -- e.g., "PCCOE, Pune"
  email        TEXT,
  phone        TEXT,
  office_addr  TEXT,
  tagline      TEXT,                        -- hero one-liner
  bio          TEXT,                        -- long about me paragraph
  career_obj   TEXT,                        -- career objective
  photo_url    TEXT,                        -- URL from Supabase Storage
  cv_url       TEXT,                        -- URL from Supabase Storage
  scholar_url  TEXT,
  scopus_url   TEXT,
  orcid_url    TEXT,
  wos_url      TEXT,
  researchgate_url TEXT,
  publons_url  TEXT,
  linkedin_url TEXT,
  github_url   TEXT,
  youtube_url  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 2: `education`
> Academic qualifications.

```sql
CREATE TABLE education (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree       TEXT NOT NULL,              -- e.g., "Ph.D.", "M.E.", "B.E.", "HSC"
  specialization TEXT,                    -- e.g., "Computer Engineering"
  institution  TEXT,
  university   TEXT,
  year         INT,                        -- graduation year
  score        TEXT,                       -- "9.1 CGPA" or "87.5%"
  rank_distinction TEXT,                   -- "1st Rank in SPPU" or null
  thesis_title TEXT,                       -- for PhD/ME only
  sort_order   INT DEFAULT 0,             -- to control display order
  is_visible   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 3: `experience`
> Work history — academic and industry.

```sql
CREATE TABLE experience (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designation     TEXT NOT NULL,
  department      TEXT,
  institution     TEXT NOT NULL,
  type            TEXT DEFAULT 'academic',  -- 'academic' | 'industry' | 'research'
  start_date      DATE,
  end_date        DATE,                     -- NULL = "Present"
  is_current      BOOLEAN DEFAULT false,
  responsibilities TEXT[],                  -- array of bullet points
  sort_order      INT DEFAULT 0,
  is_visible      BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 4: `research_areas`
> Topics/domains of your research.

```sql
CREATE TABLE research_areas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,               -- e.g., "Machine Learning"
  icon       TEXT,                        -- optional emoji or icon name
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 5: `awards`
> Awards and recognitions.

```sql
CREATE TABLE awards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,              -- Award name
  awarded_by  TEXT,                       -- Awarding organization
  year        INT,
  description TEXT,
  url         TEXT,                       -- proof/link
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 6: `research_grants`
> Funded research projects/proposals.

```sql
CREATE TABLE research_grants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  funding_agency TEXT,                    -- e.g., "UGC", "DST", "SPPU BCUD"
  ref_no         TEXT,                    -- application/reference number
  amount         NUMERIC,                 -- in INR
  duration_from  DATE,
  duration_to    DATE,
  status         TEXT DEFAULT 'submitted', -- 'submitted' | 'received' | 'ongoing' | 'completed'
  role           TEXT DEFAULT 'PI',        -- 'PI' | 'Co-PI'
  description    TEXT,
  is_visible     BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 7: `publications`
> All research papers, books, chapters.

```sql
CREATE TABLE publications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         TEXT NOT NULL,              -- 'journal' | 'conference' | 'book' | 'book_chapter'
  title        TEXT NOT NULL,
  authors      TEXT NOT NULL,             -- comma-separated string
  venue        TEXT,                      -- journal/conference/publisher name
  volume       TEXT,                      -- e.g., "Vol. 12"
  issue        TEXT,                      -- e.g., "Issue 3"
  pages        TEXT,                      -- e.g., "pp. 45-58"
  year         INT,
  doi          TEXT,                      -- DOI string
  url          TEXT,                      -- full URL if no DOI
  publisher    TEXT,                      -- e.g., "Springer", "IEEE", "Elsevier"
  indexing     TEXT,                      -- 'SCI' | 'Scopus' | 'UGC' | 'Others'
  isbn_issn    TEXT,
  is_visible   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_publications_type ON publications(type);
CREATE INDEX idx_publications_year ON publications(year DESC);
```

---

### Table 8: `patents`
> Filed and granted patents.

```sql
CREATE TABLE patents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  inventors       TEXT NOT NULL,          -- comma-separated names
  application_no  TEXT,
  filing_date     DATE,
  year            INT,
  country         TEXT DEFAULT 'India',
  status          TEXT DEFAULT 'filed',   -- 'filed' | 'published' | 'exam' | 'granted'
  description     TEXT,
  is_visible      BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 9: `copyrights`
> Registered copyrights.

```sql
CREATE TABLE copyrights (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  reg_no       TEXT,                      -- e.g., "L-82188/2019"
  reg_date     DATE,
  year         INT,
  type         TEXT,                      -- 'lab_manual' | 'software' | 'research' | 'presentation'
  is_visible   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 10: `subjects_taught`
> Teaching profile.

```sql
CREATE TABLE subjects_taught (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject     TEXT NOT NULL,
  level       TEXT NOT NULL,             -- 'UG' | 'PG'
  department  TEXT,                      -- 'Computer' | 'IT' | 'E&TC'
  year_from   INT,
  year_to     INT,                       -- NULL = present
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 11: `study_materials`
> Downloadable files for students.

```sql
CREATE TABLE study_materials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,             -- e.g., "ML Lab Manual 2023-24"
  subject     TEXT,
  level       TEXT,                      -- 'UG' | 'PG'
  department  TEXT,
  year        INT,
  file_url    TEXT NOT NULL,             -- Supabase Storage URL
  file_type   TEXT DEFAULT 'pdf',        -- 'pdf' | 'ppt' | 'doc'
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 12: `projects_guided`
> BE/ME projects mentored.

```sql
CREATE TABLE projects_guided (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  level        TEXT NOT NULL,            -- 'BE' | 'ME'
  team_members TEXT,                     -- names comma-separated
  team_size    INT,
  year         INT,
  domain       TEXT,
  tech_stack   TEXT,                     -- environment / technologies
  description  TEXT,
  is_visible   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 13: `activities`
> All professional activities — single table with type discrimination.

```sql
CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL,
  -- type values:
  --   'fdp_attended'        → FDP/Workshop/MOOC attended
  --   'workshop_organized'  → Workshops/FDPs organized
  --   'guest_lecture'       → Guest lectures/talks given
  --   'judge_mentor'        → Judging/mentoring events
  --   'reviewer'            → Reviewer/TPC/Editor roles
  title       TEXT NOT NULL,
  organizer   TEXT,                      -- for attended events
  venue       TEXT,                      -- for organized events
  institution TEXT,                      -- for lectures/judge
  journal     TEXT,                      -- for reviewer roles
  date_from   DATE,
  date_to     DATE,
  year        INT,
  duration    TEXT,                      -- e.g., "5 Days"
  mode        TEXT,                      -- 'Online' | 'Offline' | 'Hybrid'
  role        TEXT,                      -- 'Organizer' | 'Resource Person' | 'Reviewer'
  description TEXT,
  certificate_url TEXT,                  -- optional uploaded certificate
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_year ON activities(year DESC);
```

---

### Table 14: `memberships`
> Professional body memberships.

```sql
CREATE TABLE memberships (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization   TEXT NOT NULL,          -- e.g., "ISTE", "IEEE", "ACM"
  type           TEXT DEFAULT 'member',  -- 'life_member' | 'member' | 'fellow'
  member_no      TEXT,
  year_from      INT,
  year_to        INT,                    -- NULL = current
  is_visible     BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now()
);
```

---

### Table 15: `admin_roles`
> Administrative and university service roles.

```sql
CREATE TABLE admin_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        TEXT NOT NULL,             -- e.g., "PG Coordinator", "NBA Coordinator"
  scope       TEXT,                      -- 'Institute' | 'University' | 'Department'
  institution TEXT,
  year_from   INT,
  year_to     INT,                       -- NULL = current
  description TEXT,
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔒 Row Level Security (RLS) Policies

RLS ensures:
- ✅ **Anyone** can READ data where `is_visible = true`
- ✅ **Only the authenticated admin** can INSERT, UPDATE, DELETE

```sql
-- =========================================
-- ENABLE RLS ON ALL TABLES
-- =========================================
ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE education        ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience       ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_areas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards           ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_grants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE patents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE copyrights       ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects_taught  ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_guided  ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles      ENABLE ROW LEVEL SECURITY;

-- =========================================
-- PUBLIC READ POLICY (visible items only)
-- Apply this to EVERY table
-- =========================================
CREATE POLICY "Public can read visible rows"
ON publications FOR SELECT
USING (is_visible = true);

-- (Repeat for each table — example shown for publications)
-- Do the same for: profile, education, experience, research_areas,
-- awards, research_grants, patents, copyrights, subjects_taught,
-- study_materials, projects_guided, activities, memberships, admin_roles

-- Profile is a special case — all fields readable (no is_visible needed):
CREATE POLICY "Public can read profile"
ON profile FOR SELECT USING (true);

-- =========================================
-- ADMIN FULL ACCESS POLICY
-- Apply this to EVERY table
-- =========================================
CREATE POLICY "Admin full access"
ON publications FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- (Repeat for each table)
```

> **Note:** The admin UID is set automatically when the admin logs in. Since sign-ups are disabled, only the pre-created admin user can have a session.

---

## 🪣 Storage Buckets

| Bucket Name | Purpose | Access |
|-------------|---------|--------|
| `profile-photos` | Profile headshot | Public read |
| `cv-documents` | CV PDF | Public read |
| `study-materials` | Lab manuals, notes PDFs | Public read |
| `activity-certificates` | FDP/workshop certificates | Admin only |

### Storage Setup

```sql
-- Create public bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Create public bucket for CV
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-documents', 'cv-documents', true);

-- Create public bucket for study materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', true);

-- Create private bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('activity-certificates', 'activity-certificates', false);
```

### Storage RLS Policies

```sql
-- Public can download from public buckets
CREATE POLICY "Public read profile-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Public read cv-documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-documents');

CREATE POLICY "Public read study-materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'study-materials');

-- Only admin can upload to any bucket
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only admin can delete from any bucket
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
USING (auth.uid() IS NOT NULL);
```

---

## 📡 API Query Reference (JS SDK)

All queries use the Supabase JavaScript client.

### Initialize Client

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables (.env)

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Auth Queries

```javascript
// Admin Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@youremail.com',
  password: 'password'
})

// Admin Logout
await supabase.auth.signOut()

// Check current session (for route protection)
const { data: { session } } = await supabase.auth.getSession()
// if session is null → redirect to /admin/login

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') navigate('/admin/login')
})
```

---

### Profile Queries

```javascript
// GET profile (public)
const { data } = await supabase.from('profile').select('*').single()

// UPDATE profile (admin only)
const { error } = await supabase
  .from('profile')
  .update({ bio: newBio, tagline: newTagline })
  .eq('id', profileId)
```

---

### Publications Queries

```javascript
// GET all visible journal papers, newest first (public)
const { data } = await supabase
  .from('publications')
  .select('*')
  .eq('type', 'journal')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// GET all visible (public) — all types
const { data } = await supabase
  .from('publications')
  .select('*')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ADD new publication (admin)
const { data, error } = await supabase
  .from('publications')
  .insert({
    type: 'journal',
    title: 'My Paper Title',
    authors: 'Author A, Author B',
    venue: 'Journal of XYZ',
    year: 2024,
    doi: '10.1000/xyz123',
    indexing: 'Scopus'
  })

// UPDATE publication (admin)
const { error } = await supabase
  .from('publications')
  .update({ title: 'Updated Title' })
  .eq('id', publicationId)

// SOFT DELETE (toggle visibility)
const { error } = await supabase
  .from('publications')
  .update({ is_visible: false })
  .eq('id', publicationId)

// HARD DELETE (admin)
const { error } = await supabase
  .from('publications')
  .delete()
  .eq('id', publicationId)
```

---

### File Upload (Storage)

```javascript
// Upload CV PDF
const { data, error } = await supabase.storage
  .from('cv-documents')
  .upload('cv.pdf', file, {
    cacheControl: '3600',
    upsert: true   // overwrite if exists
  })

// Get public URL
const { data } = supabase.storage
  .from('cv-documents')
  .getPublicUrl('cv.pdf')
// data.publicUrl → use this in profile.cv_url

// Upload study material
const { data, error } = await supabase.storage
  .from('study-materials')
  .upload(`${subject}-${year}.pdf`, file, { upsert: true })
```

---

### Activities Queries (example — all types follow same pattern)

```javascript
// GET all FDPs attended
const { data } = await supabase
  .from('activities')
  .select('*')
  .eq('type', 'fdp_attended')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ADD an activity
const { data, error } = await supabase
  .from('activities')
  .insert({
    type: 'workshop_organized',
    title: 'National FDP on AI',
    venue: 'PCCOE, Pune',
    year: 2024,
    mode: 'Offline'
  })
```

---

## 🔁 Updated Timestamp Trigger (auto-update `updated_at`)

```sql
-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables that have updated_at
CREATE TRIGGER set_updated_at_profile
  BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- (Repeat for: education, experience, publications, patents,
--  awards, research_grants, study_materials, projects_guided, activities)
```

---

## 🔧 Supabase Project Setup Checklist

```
[ ] Create Supabase project at supabase.com
[ ] Copy Project URL and anon key to .env file
[ ] Run all CREATE TABLE SQL scripts
[ ] Enable RLS on all tables
[ ] Create all RLS policies
[ ] Create storage buckets (profile-photos, cv-documents, study-materials)
[ ] Set storage RLS policies
[ ] Disable public sign-ups in Auth settings
[ ] Create admin user manually in Auth > Users
[ ] Create updated_at trigger function and apply to tables
[ ] Test: read data without login (should work for visible=true rows)
[ ] Test: write data without login (should FAIL)
[ ] Test: login as admin → write/delete (should WORK)
```

---

*Backend Documentation v1.0 — March 11, 2026*
