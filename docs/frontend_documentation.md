# 💻 Frontend Documentation — Personal Academic Website

> **Stack:** React + Vite + Tailwind CSS
> **State Management:** React Query (Server State) + React Context (Auth State)
> **Forms:** React Hook Form + Zod (Validation)
> **Icons:** Lucide React
> **Notifications:** react-hot-toast

---

## 🎨 Design System

### Color Palette (Premium / Academic)
- **Primary:** `#0F172A` (Slate 900) — Deep, rich slate for high-end editorial feel on text/headers
- **Accent:** `#4338CA` (Deep Indigo) or `#0F766E` (Slate-Teal) — Serious, professional academic tone for links, buttons, highlights
- **Background:** `#F8FAFC` (Slate 50) or `#F9FAFB` (Gray 50) — Ultra-light, cool-toned off-white to reduce eye strain
- **Surface:** `#FFFFFF` (White) — Pure white for cards and sections
- **Border:** `#E5E7EB` (Gray 200) — Very subtle borders for separating surface from background

### Typography
- **Headings:** *Plus Jakarta Sans* or *Inter Tight* (Bold/Semi-bold) — Clean, modern geometric structure
- **Body:** *Inter* or *Roboto* (Regular/Medium) — Highly optimized for legibility in dense academic texts

---

## 📂 Project Structure

```
src/
├── assets/             # Global images, SVGs
├── components/         # Reusable UI components
│   ├── layout/         # Header, Footer, AdminSidebar
│   ├── shared/         # Button, Input, Modal, DataTable
│   ├── public/         # Components specific to user view
│   └── admin/          # Components specific to admin panel
├── context/            # AuthContext, ThemeContext
├── hooks/              # Custom hooks (e.g., useAuth, usePublications)
├── lib/                # Third-party config (supabase.js, utils.ts)
├── pages/              # Page components
│   ├── public/         # Home, About, Publications, etc.
│   └── admin/          # Dashboard, ManagePublications, etc.
├── services/           # Supabase data fetching logic
├── styles/             # Global CSS
├── App.jsx             # Main router
└── main.jsx            # Entry point
```

---

## 🧭 Routing (React Router)

### Public Routes
- `/` — Combined single-page view or Home
- `/publications` — Full filtered list (optional if not on home)
- `/admin/login` — Login page

### Protected Admin Routes (`/admin/*`)
- `/admin/dashboard` — Stats overview
- `/admin/profile` — About me, Photo, CV upload
- `/admin/education` — Academic history CRUD
- `/admin/experience` — Work history CRUD
- `/admin/publications` — Research papers CRUD
- `/admin/patents` — Patents & Copyrights CRUD
- `/admin/teaching` — Subjects & Materials CRUD
- `/admin/activities` — Professional activities CRUD

---

## 🔐 Route Protection (Auth)

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!session) return <Navigate to="/admin/login" replace />;

  return children;
};
```

---

## 🛠️ Key Components Detail

### 1. `DataTable` (Generic Admin List)
Used across all manage pages to list items.
- **Props:** `columns`, `data`, `onEdit`, `onDelete`, `onToggleVisibility`.
- **Features:** Search filtering, pagination, sort by year.

### 2. `FileUpload` (Supabase Storage)
Handles file selection, upload to Supabase, and progress bar.
- **Usage:**
  - `profile-photos` (Bucket: `profile-photos`)
  - `cv-documents` (Bucket: `cv-documents`)
  - `study-materials` (Bucket: `study-materials`)

### 3. `PublicationCard` (Public View)
- Displays: Title, Authors (Bold self), Venue, Year, DOI link, Indexing badge (SCI/Scopus).

---

## 📈 State Management (React Query)

Using `@tanstack/react-query` for all data fetching to benefit from caching and auto-loading states.

```javascript
// hooks/usePublications.js
export const usePublications = () => {
  return useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('publications')
        .select('*')
        .eq('is_visible', true)
        .order('year', { ascending: false });
      return data;
    }
  });
};
```

---

## 📝 Form Handling (React Hook Form + Zod)

```javascript
// schemas/publicationSchema.ts
import { z } from "zod";

export const publicationSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  type: z.enum(['journal', 'conference', 'book', 'book_chapter']),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  doi: z.string().url().optional().or(z.literal('')),
  // ... other fields
});
```

---

## 🚀 Deployment

1. **Build:** `npm run build` (Vite creates `/dist` folder)
2. **Platform:** Vercel (recommended) or Netlify
3. **Environment Setup:** Connect repository and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

*Frontend Documentation v1.0 — March 11, 2026*
