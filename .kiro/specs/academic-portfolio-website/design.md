# Design: Academic Portfolio Website

## 1. System Architecture

### 1.1 High-Level Overview

```
React Frontend (Vite + Tailwind)
    ↓ HTTPS
Supabase Backend
    ├── PostgreSQL (15 tables)
    ├── Auth (JWT)
    ├── Storage (3 buckets)
    └── RLS Policies
```

### 1.2 Technology Stack

**Frontend:**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- React Query (server state)
- React Context (auth state)
- React Hook Form + Zod
- Lucide React (icons)
- react-hot-toast

**Backend:**
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security

---

## 2. Database Design

### 2.1 Core Tables (15 total)

1. **profile** - Single row with personal info, links, URLs
2. **education** - Academic qualifications
3. **experience** - Work history
4. **research_areas** - Research topics
5. **awards** - Recognition and awards
6. **research_grants** - Funded projects
7. **publications** - Papers, books, chapters
8. **patents** - Patent applications
9. **copyrights** - Copyright registrations
10. **subjects_taught** - Teaching profile
11. **study_materials** - Downloadable files
12. **projects_guided** - BE/ME projects
13. **activities** - Professional activities (type-discriminated)
14. **memberships** - Professional bodies
15. **admin_roles** - Administrative positions

### 2.2 Common Schema Pattern

All tables (except profile) include:
- `id` UUID PRIMARY KEY
- `is_visible` BOOLEAN DEFAULT true
- `created_at` TIMESTAMPTZ
- `updated_at` TIMESTAMPTZ

### 2.3 RLS Policies

**Public Read:**
```sql
CREATE POLICY "Public can read visible rows"
ON [table] FOR SELECT
USING (is_visible = true);
```

**Admin Full Access:**
```sql
CREATE POLICY "Admin full access"
ON [table] FOR ALL
USING (auth.uid() IS NOT NULL);
```

### 2.4 Storage Buckets

- `profile-photos` (public)
- `cv-documents` (public)
- `study-materials` (public)

---

## 3. Frontend Architecture

### 3.1 Component Structure

```
App
├── AuthProvider
│   ├── PublicLayout
│   │   ├── Header
│   │   ├── HeroSection
│   │   ├── AboutSection
│   │   ├── EducationSection
│   │   ├── PublicationsSection
│   │   └── ContactSection
│   │
│   ├── AdminLoginPage
│   │
│   └── AdminLayout (Protected)
│       ├── AdminSidebar
│       ├── Dashboard
│       ├── ManageProfile
│       ├── ManageEducation
│       ├── ManagePublications
│       └── [Other Manage Pages]
```

### 3.2 Routing

**Public:**
- `/` - Home page (all sections)

**Admin:**
- `/admin/login` - Login page
- `/admin/dashboard` - Stats overview
- `/admin/profile` - Manage profile
- `/admin/education` - Manage education
- `/admin/publications` - Manage publications
- `/admin/[section]` - Manage other sections

### 3.3 State Management

**Auth State (Context):**
```javascript
{
  session: Session | null,
  user: User | null,
  loading: boolean,
  signIn: (email, password) => Promise,
  signOut: () => Promise
}
```

**Server State (React Query):**
- Automatic caching
- Background refetching
- Optimistic updates
- Query invalidation

---

## 4. Authentication Flow

```
User visits /admin
    ↓
Check session
    ↓
No session → Redirect to /admin/login
    ↓
Enter credentials
    ↓
supabase.auth.signInWithPassword()
    ↓
Success → Store JWT → Redirect to /admin/dashboard
```

---

## 5. Data Flow Patterns

### 5.1 Public View

```
Component → useQuery hook → Supabase SELECT
    ↓
RLS: WHERE is_visible = true
    ↓
Return data → Cache → Render
```

### 5.2 Admin CRUD

**Create:**
```
Form → Validate (Zod) → useMutation → INSERT
    ↓
RLS: Check auth.uid()
    ↓
Success → Invalidate cache → Toast
```

**Update:**
```
Edit form → Validate → useMutation → UPDATE
    ↓
Success → Invalidate cache → Toast
```

**Delete:**
```
Confirm → useMutation → DELETE
    ↓
Success → Invalidate cache → Toast
```

**Toggle Visibility:**
```
Toggle → useMutation → UPDATE is_visible
    ↓
Success → Invalidate cache → Update UI
```

### 5.3 File Upload

```
Select file → Validate → Upload to Storage
    ↓
Get public URL
    ↓
Update database record with URL
    ↓
Success toast
```

---

## 6. UI/UX Design

### 6.1 Design System

**Colors:**
- Primary: #0F172A (Slate 900)
- Accent: #4338CA (Deep Indigo)
- Background: #F8FAFC (Slate 50)
- Surface: #FFFFFF (White)
- Border: #E5E7EB (Gray 200)

**Typography:**
- Headings: Plus Jakarta Sans / Inter Tight (600-700)
- Body: Inter / Roboto (400-500)

**Spacing:** 4, 8, 12, 16, 24, 32, 48, 64, 96px

### 6.2 Responsive Breakpoints

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

### 6.3 Animations

- Fade-in on scroll
- Hover lift on cards
- Smooth transitions (200ms)

---

## 7. Key Components

### 7.1 Reusable Components

**DataTable:**
- Displays list of items
- Search, sort, filter
- Edit, delete, toggle visibility actions
- Pagination

**FileUpload:**
- File selection
- Validation (type, size)
- Progress bar
- Upload to Supabase Storage
- Return public URL

**PublicationCard:**
- Title, authors, venue, year
- DOI link
- Indexing badge

**FormModal:**
- Add/Edit forms
- Zod validation
- Submit handling
- Error display

### 7.2 Service Layer

```javascript
// services/publicationService.js
export const publicationService = {
  getAll: async (type) => { /* ... */ },
  create: async (data) => { /* ... */ },
  update: async (id, data) => { /* ... */ },
  delete: async (id) => { /* ... */ },
  toggleVisibility: async (id, visible) => { /* ... */ }
};
```

### 7.3 Custom Hooks

```javascript
// hooks/usePublications.js
export const usePublications = (type = null) => {
  return useQuery({
    queryKey: ['publications', type],
    queryFn: () => publicationService.getAll(type)
  });
};

export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['publications']);
      toast.success('Publication added');
    }
  });
};
```

---

## 8. Security Considerations

1. **Authentication:** JWT tokens via Supabase Auth
2. **Authorization:** RLS policies enforce access control
3. **Input Validation:** Zod schemas on client + database constraints
4. **File Upload:** Type and size validation
5. **HTTPS:** All communications encrypted
6. **No Public Sign-up:** Admin user created manually

---

## 9. Performance Optimizations

1. **React Query Caching:** Reduce database queries
2. **Lazy Loading:** Images and large lists
3. **Code Splitting:** Route-based chunks
4. **Optimistic Updates:** Immediate UI feedback
5. **Debounced Search:** Reduce query frequency

---

## 10. Error Handling

1. **Form Validation:** Zod schemas with clear messages
2. **API Errors:** Try-catch with toast notifications
3. **Loading States:** Spinners during async operations
4. **Empty States:** Friendly messages when no data
5. **404 Pages:** Redirect to home or login

---

## 11. Deployment Architecture

```
GitHub Repository
    ↓
Vercel/Netlify (Auto-deploy on push)
    ↓
Build: npm run build
    ↓
Deploy /dist folder
    ↓
Environment Variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
```

---

*Design Document v1.0 — Created March 11, 2026*
