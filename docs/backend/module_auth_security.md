# Module — Auth & RLS Security

> **Module Goal:** Implement Row Level Security (RLS) on every table so that public visitors only see visible content, and only the authenticated admin can write, update, or delete any data.

---

## 3.1 Security Model Overview

```
                 ┌──────────────────────────────────────┐
                 │            SUPABASE RLS               │
                 │                                       │
 Public User ──► │  SELECT WHERE is_visible = true  ✅   │
                 │  INSERT / UPDATE / DELETE        ❌   │
                 │                                       │
 Admin User  ──► │  SELECT (all rows, any value)    ✅   │
 (JWT session)   │  INSERT / UPDATE / DELETE        ✅   │
                 └──────────────────────────────────────┘
```

The policy logic is simple:
- `auth.uid() IS NOT NULL` → The user is authenticated (admin)
- `is_visible = true` → Row is published and visible to public

---

## 3.2 Step 1: Enable RLS on All Tables

Run this before creating any policies:

```sql
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
```

---

## 3.3 Step 2: Public Read Policy (for tables with `is_visible`)

Apply to: `education`, `experience`, `research_areas`, `awards`, `research_grants`, `publications`, `patents`, `copyrights`, `subjects_taught`, `study_materials`, `projects_guided`, `activities`, `memberships`, `admin_roles`

```sql
-- Template (replace <table_name> for each table)
CREATE POLICY "Public can read visible rows"
ON public.<table_name>
FOR SELECT
USING (is_visible = true);
```

**All 14 policies at once:**

```sql
CREATE POLICY "Public read education"       ON public.education        FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read experience"      ON public.experience       FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read research_areas"  ON public.research_areas   FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read awards"          ON public.awards           FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read research_grants" ON public.research_grants  FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read publications"    ON public.publications     FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read patents"         ON public.patents          FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read copyrights"      ON public.copyrights       FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read subjects_taught" ON public.subjects_taught  FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read study_materials" ON public.study_materials  FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read projects_guided" ON public.projects_guided  FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read activities"      ON public.activities       FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read memberships"     ON public.memberships      FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read admin_roles"     ON public.admin_roles      FOR SELECT USING (is_visible = true);
```

---

## 3.4 Step 3: Special Case — `profile` Table

The `profile` table does not have `is_visible`. All profile data should be publicly readable:

```sql
CREATE POLICY "Public can read profile"
ON public.profile
FOR SELECT
USING (true);
```

---

## 3.5 Step 4: Admin Full-Access Policy (All Tables)

Only authenticated users (the admin) can INSERT, UPDATE, or DELETE. Since sign-ups are disabled, any authenticated session is the admin.

```sql
-- Template (replace <table_name>)
CREATE POLICY "Admin has full access"
ON public.<table_name>
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);
```

**All 15 tables at once:**

```sql
CREATE POLICY "Admin access profile"         ON public.profile          FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access education"       ON public.education        FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access experience"      ON public.experience       FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access research_areas"  ON public.research_areas   FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access awards"          ON public.awards           FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access research_grants" ON public.research_grants  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access publications"    ON public.publications     FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access patents"         ON public.patents          FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access copyrights"      ON public.copyrights       FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access subjects_taught" ON public.subjects_taught  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access study_materials" ON public.study_materials  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access projects_guided" ON public.projects_guided  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access activities"      ON public.activities       FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access memberships"     ON public.memberships      FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin access admin_roles"     ON public.admin_roles      FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 3.6 Step 5: Verify Policies

Check all policies are created:

```sql
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

---

## 3.7 RLS Testing Procedure

### Test 1: Unauthenticated Public Read
Using the Supabase JS client with the **anon key** (no login):
```javascript
// Should return only rows where is_visible = true
const { data, error } = await supabase.from('publications').select('*')
console.log(data)       // Should return visible publications
console.log(error)      // Should be null
```

### Test 2: Unauthenticated Write (Must FAIL)
```javascript
const { error } = await supabase.from('publications').insert({
  type: 'journal', title: 'Hacked!', authors: 'Attacker', year: 2024
})
console.log(error) // Should return "new row violates row-level security policy"
```

### Test 3: Admin Write (Must SUCCEED)
```javascript
await supabase.auth.signInWithPassword({ email: 'admin@email.com', password: '...' })
const { error } = await supabase.from('publications').insert({
  type: 'journal', title: 'My Paper', authors: 'Dr. Name', year: 2024
})
console.log(error) // Should be null (success)
```

### Test 4: Admin Read Hidden Rows
```javascript
// Admin should see all rows including is_visible = false
const { data } = await supabase.from('publications').select('*')
// data includes both visible and hidden rows
```

---

## 3.8 Auth Policies Summary Table

| Table | Public SELECT | Admin ALL |
|-------|:---:|:---:|
| profile | ✅ (all rows) | ✅ |
| education | ✅ (visible only) | ✅ |
| experience | ✅ (visible only) | ✅ |
| research_areas | ✅ (visible only) | ✅ |
| awards | ✅ (visible only) | ✅ |
| research_grants | ✅ (visible only) | ✅ |
| publications | ✅ (visible only) | ✅ |
| patents | ✅ (visible only) | ✅ |
| copyrights | ✅ (visible only) | ✅ |
| subjects_taught | ✅ (visible only) | ✅ |
| study_materials | ✅ (visible only) | ✅ |
| projects_guided | ✅ (visible only) | ✅ |
| activities | ✅ (visible only) | ✅ |
| memberships | ✅ (visible only) | ✅ |
| admin_roles | ✅ (visible only) | ✅ |

---

## 3.9 Module Completion Checklist

```
[ ] RLS enabled on all 15 tables
[ ] Public SELECT policy for profile (all rows)
[ ] Public SELECT policy for 14 other tables (is_visible = true)
[ ] Admin ALL policy for all 15 tables
[ ] Verify policies in pg_policies view — 29 policies total
[ ] Test 1: Anonymous read returns only visible rows ✅
[ ] Test 2: Anonymous insert gets security error ✅
[ ] Test 3: Authenticated admin insert succeeds ✅
[ ] Test 4: Authenticated admin sees all rows (including hidden) ✅
```

---

*Backend Module — Auth & RLS Security | v1.0 — March 2026*
