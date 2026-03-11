# Phase 1 — Project Initialization & Environment Setup

> **Phase Goal:** Bootstrap a production-ready React + Vite project with all dependencies, folder structure, environment configuration, and global design tokens in place before writing a single component.

---

## 1.1 Prerequisites

Before starting, ensure the following tools are installed on your machine:

| Tool | Minimum Version | Check With |
|------|----------------|------------|
| Node.js | v18+ | `node -v` |
| npm | v9+ | `npm -v` |
| Git | v2+ | `git --version` |
| VS Code (recommended) | Latest | — |

---

## 1.2 Create the Vite + React Project

```bash
# Navigate to where you want to store the project
cd d:\Projects

# Scaffold a new Vite React project
npm create vite@latest personal-website -- --template react

# Move into the folder
cd personal-website

# Install base dependencies
npm install
```

### Verify the Dev Server Works
```bash
npm run dev
# Should open: http://localhost:5173
```

---

## 1.3 Install All Required Dependencies

Run the following in one command to install every needed package:

```bash
npm install \
  @supabase/supabase-js \
  react-router-dom \
  @tanstack/react-query \
  react-hook-form \
  @hookform/resolvers \
  zod \
  lucide-react \
  react-hot-toast \
  framer-motion \
  clsx
```

### Dependency Breakdown

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Connect to Supabase backend (DB, Auth, Storage) |
| `react-router-dom` | Client-side routing (public + admin protected routes) |
| `@tanstack/react-query` | Server-state management (fetch, cache, sync) |
| `react-hook-form` | Performant form library |
| `@hookform/resolvers` | Bridge between Hook Form and Zod validation |
| `zod` | Schema-based type-safe validation |
| `lucide-react` | Modern minimalist icon set (MIT licensed) |
| `react-hot-toast` | Toast notification system |
| `framer-motion` | Smooth animation (scroll reveal, counters, modals) |
| `clsx` | Conditional className utility |

---

## 1.4 Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Create a `.env.example` for future reference (commit this, not `.env`):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Add `.env` to `.gitignore`:
```
# .gitignore additions
.env
.env.local
dist/
node_modules/
```

> ⚠️ **Important:** Never commit your actual Supabase keys. Only commit `.env.example`.

---

## 1.5 Configure Path Aliases (vite.config.js)

Set up `@/` as an alias for `src/` so imports are clean:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Now you can use:
```javascript
import { supabase } from '@/lib/supabase'
// instead of: ../../lib/supabase
```

---

## 1.6 Folder & File Structure

Create the following structure under `/src`:

```
src/
├── assets/
│   ├── images/           # Profile photos, icons
│   └── fonts/            # Local font files (if any)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── AdminSidebar.jsx
│   │   └── AdminTopbar.jsx
│   ├── shared/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── DataTable.jsx
│   │   ├── FileUpload.jsx
│   │   ├── Badge.jsx
│   │   ├── Spinner.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── SectionHeader.jsx
│   ├── public/
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── ResearchSection.jsx
│   │   ├── PublicationsSection.jsx
│   │   ├── PatentsSection.jsx
│   │   ├── TeachingSection.jsx
│   │   ├── ActivitiesSection.jsx
│   │   └── ContactSection.jsx
│   └── admin/
│       ├── StatsCard.jsx
│       ├── PublicationForm.jsx
│       ├── PatentForm.jsx
│       ├── EducationForm.jsx
│       └── ActivityForm.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useProfile.js
│   ├── usePublications.js
│   ├── usePatents.js
│   ├── useEducation.js
│   ├── useExperience.js
│   ├── useActivities.js
│   └── useStorage.js
│
├── lib/
│   ├── supabase.js        # Supabase client initialization
│   ├── queryClient.js     # React Query client config
│   └── utils.js           # Utility functions (formatDate, etc.)
│
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx
│   │   └── PublicationsPage.jsx  (optional standalone)
│   └── admin/
│       ├── LoginPage.jsx
│       ├── DashboardPage.jsx
│       ├── ProfilePage.jsx
│       ├── EducationPage.jsx
│       ├── ExperiencePage.jsx
│       ├── PublicationsPage.jsx
│       ├── PatentsPage.jsx
│       ├── TeachingPage.jsx
│       └── ActivitiesPage.jsx
│
├── routes/
│   ├── ProtectedRoute.jsx
│   └── AppRouter.jsx
│
├── schemas/
│   ├── publicationSchema.js
│   ├── patentSchema.js
│   ├── educationSchema.js
│   └── activitySchema.js
│
├── styles/
│   ├── global.css          # Imports, CSS variables, base resets
│   └── components.css      # Shared reusable class styles
│
├── App.jsx
└── main.jsx
```

### Create Directories in Terminal
```bash
mkdir -p src/{assets/{images,fonts},components/{layout,shared,public,admin},context,hooks,lib,pages/{public,admin},routes,schemas,styles}
```

---

## 1.7 Initialize Supabase Client

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,     // Keep session in localStorage
    autoRefreshToken: true,   // Auto-refresh JWT before expiry
  }
})
```

---

## 1.8 Initialize React Query Client

```javascript
// src/lib/queryClient.js
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes — data fresh window
      gcTime: 1000 * 60 * 10,      // 10 minutes — garbage collection
      retry: 2,                    // Retry failed queries twice
      refetchOnWindowFocus: false, // Don't refetch on tab switch
    },
    mutations: {
      retry: 1,
    }
  }
})
```

---

## 1.9 Set Up Main Entry Points

### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import App from './App'
import '@/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              borderRadius: '8px',
              border: '1px solid #334155',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
```

---

## 1.10 Global CSS / Design System Variables

```css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap');

/* ============================================
   CSS DESIGN TOKENS
   ============================================ */
:root {
  /* Colors */
  --color-bg:          #0F172A;     /* main dark background */
  --color-surface:     #1E293B;     /* card/panel background */
  --color-border:      #334155;     /* borders */
  --color-accent:      #3B82F6;     /* blue - primary accent */
  --color-accent-hover:#2563EB;
  --color-text:        #F1F5F9;     /* primary text (light) */
  --color-text-muted:  #94A3B8;     /* secondary text */
  --color-success:     #10B981;
  --color-warn:        #F59E0B;
  --color-danger:      #EF4444;

  /* Typography */
  --font-body:    'Inter', sans-serif;
  --font-heading: 'Outfit', sans-serif;
  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;
  --font-size-3xl:  1.875rem;
  --font-size-4xl:  2.25rem;
  --font-size-5xl:  3rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Borders & Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.3);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.5);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* Layout */
  --max-width: 1200px;
  --section-padding: var(--space-24) 0;
}

/* ============================================
   BASE RESETS
   ============================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}

/* ============================================
   LAYOUT UTILITIES
   ============================================ */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section {
  padding: var(--section-padding);
}

.section--alt {
  background: var(--color-surface);
}

/* ============================================
   TYPOGRAPHY UTILITIES
   ============================================ */
.heading-1 { font-family: var(--font-heading); font-size: var(--font-size-5xl); font-weight: 700; line-height: 1.1; }
.heading-2 { font-family: var(--font-heading); font-size: var(--font-size-4xl); font-weight: 700; line-height: 1.2; }
.heading-3 { font-family: var(--font-heading); font-size: var(--font-size-2xl); font-weight: 600; }
.text-muted { color: var(--color-text-muted); }
.text-accent { color: var(--color-accent); }

/* ============================================
   SCROLLBAR STYLING
   ============================================ */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--color-surface); }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: var(--radius-full); }
::-webkit-scrollbar-thumb:hover { background: var(--color-accent); }
```

---

## 1.11 `App.jsx` — Root Component with Router

```jsx
// src/App.jsx
import { BrowserRouter } from 'react-router-dom'
import AppRouter from '@/routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
```

---

## 1.12 Phase 1 Completion Checklist

```
[ ] npm create vite done, npm install completed
[ ] All dependencies installed (supabase, react-query, hook-form, zod, etc.)
[ ] .env file created with Supabase credentials
[ ] .env added to .gitignore
[ ] vite.config.js alias @ → src set up
[ ] Folder structure created
[ ] src/lib/supabase.js initialized
[ ] src/lib/queryClient.js configured
[ ] src/main.jsx wired up with providers
[ ] global.css with design tokens written
[ ] App.jsx with BrowserRouter created
[ ] npm run dev works without errors
```

---

*Frontend Phase 1 — Initialization | v1.0 — March 2026*
