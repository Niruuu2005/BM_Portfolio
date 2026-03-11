# Module — API Queries Reference

> **Module Goal:** A complete reference guide for all Supabase JavaScript SDK queries used in the application — covering reads (public), writes (admin), filtering, pagination, and file storage operations for every table.

---

## 5.1 Client Setup (Reminder)

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
)
```

---

## 5.2 Auth Queries

```javascript
// ─── Sign In (Admin) ──────────────────────────────────────
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@youremail.com',
  password: 'SecurePassword123!'
})
// data.session.access_token → JWT stored in localStorage automatically

// ─── Sign Out ─────────────────────────────────────────────
const { error } = await supabase.auth.signOut()

// ─── Get Current Session ──────────────────────────────────
const { data: { session } } = await supabase.auth.getSession()
// session is null if not logged in

// ─── Get Current User ─────────────────────────────────────
const { data: { user } } = await supabase.auth.getUser()

// ─── Listen to Auth Changes ───────────────────────────────
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    // event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED'
    console.log(event, session)
  }
)
// Cleanup: subscription.unsubscribe()
```

---

## 5.3 Profile Queries

```javascript
// ─── GET profile (public) ────────────────────────────────
const { data: profile, error } = await supabase
  .from('profile')
  .select('*')
  .single()

// ─── UPDATE profile (admin) ──────────────────────────────
const { error } = await supabase
  .from('profile')
  .update({
    full_name:    'Dr. Mahalakshmi Bodireddy',
    designation:  'Assistant Professor',
    department:   'Computer Engineering',
    institution:  'PCCOE, Pune',
    email:        'mahalakshmi.bodireddy@pccoepune.org',
    tagline:      'Driving innovation through Data Science and AI',
    bio:          'Full biography text...',
    scholar_url:  'https://scholar.google.com/citations?user=HyzudGMAAAAJ',
    scopus_url:   'https://www.scopus.com/authid/detail.uri?authorId=57190399971',
  })
  .eq('id', profileId)
```

---

## 5.4 Education Queries

```javascript
// ─── GET (public) — ordered by sort_order ────────────────
const { data } = await supabase
  .from('education')
  .select('*')
  .eq('is_visible', true)
  .order('sort_order', { ascending: true })

// ─── GET ALL (admin — includes hidden) ───────────────────
const { data } = await supabase
  .from('education')
  .select('*')
  .order('sort_order', { ascending: true })

// ─── INSERT (admin) ───────────────────────────────────────
const { data, error } = await supabase.from('education').insert({
  degree: 'Ph.D.',
  specialization: 'Computer Engineering',
  institution: 'PCCOE, Pune',
  university: 'SPPU',
  year: 2026,
  score: null,
  thesis_title: 'Thesis title here',
  sort_order: 1
})

// ─── UPDATE (admin) ───────────────────────────────────────
const { error } = await supabase
  .from('education')
  .update({ score: '9.2 CGPA', rank_distinction: '1st Rank SPPU' })
  .eq('id', educationId)

// ─── DELETE (admin) ───────────────────────────────────────
const { error } = await supabase
  .from('education')
  .delete()
  .eq('id', educationId)

// ─── TOGGLE VISIBILITY (admin) ────────────────────────────
const { error } = await supabase
  .from('education')
  .update({ is_visible: false })
  .eq('id', educationId)
```

---

## 5.5 Experience Queries

```javascript
// ─── GET (public) ─────────────────────────────────────────
const { data } = await supabase
  .from('experience')
  .select('*')
  .eq('is_visible', true)
  .order('start_date', { ascending: false })   // most recent first

// ─── INSERT (admin) ───────────────────────────────────────
const { error } = await supabase.from('experience').insert({
  designation: 'Assistant Professor',
  department:  'Computer Engineering',
  institution: 'PCCOE, Pune',
  type:        'academic',
  start_date:  '2005-06-01',
  end_date:    null,       // null = "Present"
  is_current:  true,
  responsibilities: ['Teaching UG/PG courses', 'Mentoring students', 'BoS Member']
})
```

---

## 5.6 Publications Queries

```javascript
// ─── GET all visible by type (public) ────────────────────
const { data } = await supabase
  .from('publications')
  .select('*')
  .eq('type', 'journal')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ─── GET all visible (all types) (public) ─────────────────
const { data } = await supabase
  .from('publications')
  .select('*')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ─── GET with year filter ─────────────────────────────────
const { data } = await supabase
  .from('publications')
  .select('*')
  .eq('is_visible', true)
  .eq('year', 2024)
  .order('type')

// ─── COUNT by type (for dashboard stats) ─────────────────
const { count } = await supabase
  .from('publications')
  .select('id', { count: 'exact', head: true })
  .eq('type', 'journal')
  .eq('is_visible', true)

// ─── INSERT (admin) ───────────────────────────────────────
const { data, error } = await supabase.from('publications').insert({
  type:      'conference',
  title:     'A Three Lead Wireless ECG System',
  authors:   'B. Mahalakshmi, Ankush Dudani, Chippy Kumar, Avinash Ghatge',
  venue:     '3rd International Conference on Computing, Communication, Control and Automation (ICCUBEA)',
  year:      2017,
  publisher: 'IEEE',
  indexing:  'Scopus'
})

// ─── UPDATE visibility (soft delete) ─────────────────────
const { error } = await supabase
  .from('publications')
  .update({ is_visible: false })
  .eq('id', publicationId)

// ─── Hard DELETE (admin) ──────────────────────────────────
const { error } = await supabase
  .from('publications')
  .delete()
  .eq('id', publicationId)
```

---

## 5.7 Patents Queries

```javascript
// ─── GET all visible (public) ─────────────────────────────
const { data } = await supabase
  .from('patents')
  .select('*')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ─── INSERT ───────────────────────────────────────────────
const { error } = await supabase.from('patents').insert({
  title:          'Patent Title Here',
  inventors:      'B. Mahalakshmi, Co-Inventor Name',
  application_no: 'IN202121012345',
  year:           2021,
  country:        'India',
  status:         'published'
})
```

---

## 5.8 Activities Queries

```javascript
// ─── GET by type (public) ─────────────────────────────────
const { data } = await supabase
  .from('activities')
  .select('*')
  .eq('type', 'fdp_attended')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ─── All activity types ────────────────────────────────────
// types: 'fdp_attended' | 'workshop_organized' | 'guest_lecture' | 'judge_mentor' | 'reviewer'

// ─── INSERT (admin) ───────────────────────────────────────
const { error } = await supabase.from('activities').insert({
  type:      'fdp_attended',
  title:     'National FDP on Data Science and Machine Learning',
  organizer: 'IIT Bombay',
  year:      2023,
  duration:  '5 Days',
  mode:      'Online',
  role:      'Participant'
})

// ─── GET workshop organized ───────────────────────────────
const { data } = await supabase
  .from('activities')
  .select('*')
  .eq('type', 'workshop_organized')
  .eq('is_visible', true)
  .order('year', { ascending: false })
```

---

## 5.9 Study Materials Queries

```javascript
// ─── GET all visible (public) ─────────────────────────────
const { data } = await supabase
  .from('study_materials')
  .select('*')
  .eq('is_visible', true)
  .order('year', { ascending: false })

// ─── GET filtered by subject ──────────────────────────────
const { data } = await supabase
  .from('study_materials')
  .select('*')
  .eq('subject', 'Data Analytics')
  .eq('is_visible', true)

// ─── INSERT with file URL (after upload) ──────────────────
const { error } = await supabase.from('study_materials').insert({
  title:      'Data Analytics Lab Manual 2024-25',
  subject:    'Data Analytics',
  level:      'UG',
  department: 'Computer Engineering',
  year:       2024,
  file_url:   'https://xxx.supabase.co/storage/v1/object/public/study-materials/da_lab_2024.pdf',
  file_type:  'pdf'
})
```

---

## 5.10 Research Areas Queries

```javascript
// ─── GET all visible (public) ─────────────────────────────
const { data } = await supabase
  .from('research_areas')
  .select('*')
  .eq('is_visible', true)
  .order('sort_order', { ascending: true })

// ─── INSERT ───────────────────────────────────────────────
const { error } = await supabase.from('research_areas').insert([
  { name: 'Data Analytics',           icon: '📊', sort_order: 1 },
  { name: 'Data Science',             icon: '🔬', sort_order: 2 },
  { name: 'System Programming',       icon: '💻', sort_order: 3 },
  { name: 'Machine Learning',         icon: '🤖', sort_order: 4 },
  { name: 'Biomedical Signal Processing', icon: '💓', sort_order: 5 },
])
```

---

## 5.11 Dashboard Count Queries

Fetch counts for all tables in one shot using `Promise.all`:

```javascript
// src/hooks/useDashboardStats.js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const countFrom = async (table) => {
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
  return count || 0
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [publications, patents, copyrights, activities, projects] = await Promise.all([
        countFrom('publications'),
        countFrom('patents'),
        countFrom('copyrights'),
        countFrom('activities'),
        countFrom('projects_guided'),
      ])
      return { publications, patents, copyrights, activities, projects }
    }
  })
}
```

---

## 5.12 Pagination Pattern (for Long Lists)

```javascript
// Page-based pagination using Supabase range
const PAGE_SIZE = 10

const fetchPage = async (page = 1) => {
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from('publications')
    .select('*', { count: 'exact' })
    .eq('is_visible', true)
    .order('year', { ascending: false })
    .range(from, to)

  return {
    data,
    totalCount: count,
    totalPages: Math.ceil(count / PAGE_SIZE),
    currentPage: page,
  }
}
```

---

## 5.13 Error Handling Pattern

Wrap all Supabase calls with consistent error handling:

```javascript
// Helper: extract error message
const handleSupabaseError = (error) => {
  if (!error) return null
  console.error('[Supabase Error]', error)
  if (error.code === 'PGRST301') return 'Access denied. Please log in.'
  if (error.code === '23505')    return 'Duplicate entry. This record already exists.'
  if (error.code === '23503')    return 'Referenced record not found.'
  return error.message || 'An unexpected error occurred.'
}

// Usage in a mutation
const { error } = await supabase.from('publications').insert(values)
if (error) {
  toast.error(handleSupabaseError(error))
  return
}
toast.success('Publication added!')
```

---

## 5.14 Real-time Subscription (Optional)

If you want the public view to update live when the admin adds content:

```javascript
// Listen for changes on publications table
const channel = supabase.channel('publications-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'publications' },
    (payload) => {
      console.log('Change received!', payload)
      queryClient.invalidateQueries(['publications'])
    }
  )
  .subscribe()

// Cleanup:
supabase.removeChannel(channel)
```

---

## 5.15 Module Completion Checklist

```
[ ] Supabase client initialized in src/lib/supabase.js
[ ] Auth: signIn, signOut, getSession, onAuthStateChange tested
[ ] Profile: GET public, UPDATE admin tested
[ ] Education: full CRUD tested
[ ] Experience: full CRUD + is_current flag tested
[ ] Publications: GET by type, year filter, INSERT, UPDATE, soft delete, hard delete tested
[ ] Patents: CRUD tested
[ ] Copyrights: CRUD tested
[ ] Activities: GET by type, INSERT for each type tested
[ ] Study materials: GET + INSERT with file_url tested
[ ] Research areas: GET + INSERT bulk tested
[ ] Dashboard counts: Promise.all parallel fetch tested
[ ] Pagination: range() based pattern implemented
[ ] Error handling: handleSupabaseError helper used everywhere
[ ] Real-time subscription: set up (optional)
```

---

*Backend Module — API Queries Reference | v1.0 — March 2026*
