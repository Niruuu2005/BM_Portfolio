# Phase 1 — Supabase Project Setup

> **Phase Goal:** Create and fully configure your Supabase project — enabling the database, Auth, and Storage services, setting environment variables, and verifying connectivity before writing any SQL.

---

## 1.1 What is Supabase?

Supabase is an open-source Firebase alternative that provides:

| Service | What We Use It For |
|---------|-------------------|
| **PostgreSQL** | Storing all website content (publications, patents, etc.) |
| **Auth** | Admin login (email + password) |
| **Storage** | File uploads (CV, photos, study materials) |
| **REST API** | Auto-generated from the database schema |
| **RLS (Row Level Security)** | Per-row access control policies |

All services are managed from one dashboard and accessed via the same project URL and API key.

---

## 1.2 Create a Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and click **Start your project**
2. Sign in with GitHub (recommended)
3. Click **New Project**
4. Fill in:
   - **Organization:** Personal (create one if needed)
   - **Name:** `academic-website` (or any name)
   - **Database Password:** Generate a strong password and SAVE IT
   - **Region:** Select the region closest to your users (e.g., `ap-south-1` Mumbai for India)
5. Click **Create new project** — wait ~2 minutes for provisioning

---

## 1.3 Get Your API Keys

After the project is ready:
1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Keep this secret, only for server-side use (not needed for this project)

```env
# .env (Frontend)
VITE_SUPABASE_URL=https://xyzabcdef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Never expose the `service_role` key** on the frontend. Only use the `anon` key in the browser.

---

## 1.4 Disable Public Sign-Ups (Critical Security Step)

1. Go to **Authentication** → **Settings** (in Supabase dashboard)
2. Scroll to **User Signups**
3. Toggle **OFF** → "Enable email confirmations" (for local dev convenience)
4. Toggle **OFF** → "Allow new users to sign up"
   - This ensures no one can self-register; only manually added users can log in

---

## 1.5 Create the Admin User

1. Go to **Authentication** → **Users**
2. Click **Invite user** or **Add user**
3. Enter your email and a strong password
4. Record these credentials securely — this is the only admin account

---

## 1.6 Access the SQL Editor

All database operations are performed in the SQL Editor:

1. Left sidebar → **SQL Editor**
2. Click **New query**
3. Paste and run each SQL block from the schema module

Or use the **Table Editor** for quick visual table creation, but SQL is recommended for precision.

---

## 1.7 Install and Test the Supabase JS Client

In your frontend project:

```bash
npm install @supabase/supabase-js
```

Test connectivity:

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Quick test in browser console:
```javascript
import { supabase } from './lib/supabase'
const { data } = await supabase.from('profile').select('*')
console.log(data)
// Should return [] (empty array) if table exists, or an error if not yet created
```

---

## 1.8 Phase 1 Completion Checklist

```
[ ] Supabase account created
[ ] New project created, region selected
[ ] Database password saved securely
[ ] Project URL and anon key copied to .env
[ ] .env file added to .gitignore
[ ] Public sign-ups DISABLED in Auth settings
[ ] Admin user created manually in Auth → Users
[ ] SQL Editor accessible and working
[ ] Supabase JS client installed in frontend
[ ] Basic connectivity test passes (query returns no error)
```

---

*Backend Phase 1 — Supabase Project Setup | v1.0 — March 2026*
