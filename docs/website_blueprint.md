# 🎓 Ideal Personal Academic Website — Detailed Blueprint

> A comprehensive design blueprint for a personal academic/professor portfolio website with public (user) view and protected admin view.

---

## 🗺️ Site Overview

| Attribute | Detail |
|-----------|--------|
| **Type** | Personal Academic Portfolio |
| **Audience** | Students, recruiters, collaborators, institutions |
| **Platform** | React (Vite) or Next.js frontend |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Routing** | Public routes + `/admin` protected route |
| **Design** | Single-page scrollable with anchor nav OR multi-page SPA |

---

## 🧭 Navigation Structure

### Public Navigation (User View)
```
[Logo / Name]    Home  About  Education  Experience  Research  Publications  Patents  Teaching  Activities  Contact
```

### Admin Navigation (Admin View — after login)
```
[Logo / Admin]   Dashboard  |  [Manage: About | Education | Experience | Research | Publications | Patents | Teaching | Activities | Materials]  |  Logout
```

---

## 📄 Pages & Sections — Public (User) View

---

### 🏠 Page 1 — HOME (Hero Section)

**Purpose:** First impression. Who you are, in 5 seconds.

| Element | Content |
|---------|---------|
| **Profile Photo** | Professional headshot |
| **Name** | Full name (e.g., Dr. / Prof.) |
| **Designation** | Assistant / Associate / Professor |
| **Department** | e.g., Computer Engineering |
| **Institution** | College name + city |
| **Tagline** | 1-line punchy description of your work |
| **CV Download Button** | Downloadable PDF (stored in Supabase Storage) |
| **Quick Links** | Google Scholar · Scopus · ORCID · LinkedIn · ResearchGate |
| **Animated counters** | Years Experience · Publications · Patents · Projects Guided |

---

### 👤 Page 2 — ABOUT

**Purpose:** Deeper introduction, research identity, and profile links.

| Section | Content |
|---------|---------|
| **Personal Statement** | 3–4 paragraph bio |
| **Career Objective** | 1-paragraph statement |
| **Research Interests** | Tag/pill list of research areas |
| **Academic Profiles** | Scopus, WoS, ORCID, Scholar, ResearchGate, Publons |
| **Social Links** | LinkedIn, GitHub, YouTube (if applicable) |

---

### 🎓 Page 3 — EDUCATION

**Purpose:** Academic qualifications, timeline style.

Each entry contains:
| Field | Example |
|-------|---------|
| Degree | Ph.D. / M.E. / B.E. / HSC / SSC |
| Specialization | Computer Engineering |
| University | SPPU, Pune / Mumbai University |
| Institution | College name |
| Year | 2023 |
| Score | CGPA 9.1 / 87.5% |
| Rank / Distinction | 1st Rank in University (if applicable) |
| Thesis / Project | Title (for P.G. only) |

**Layout:** Vertical timeline (most recent first)

---

### 💼 Page 4 — EXPERIENCE

**Purpose:** Teaching and professional work history.

Each entry contains:
| Field | Example |
|-------|---------|
| Designation | Associate Professor |
| Department | Computer Engineering |
| Institution | PCCOE, Pune |
| Duration | Sept 2020 – Present |
| Type | Academic / Industry / Research |
| Key Responsibilities | Bullet list |

**Layout:** Horizontal cards or vertical accordion

---

### 🔬 Page 5 — RESEARCH

**Purpose:** Research areas, awards, funded projects.

| Sub-section | Content |
|-------------|---------|
| **Research Areas** | Tag cloud or icon-based grid |
| **Awards & Recognition** | Award name, body, year, link |
| **Funded Projects / Grants** | Title, funding agency, amount, duration, status |

---

### 📖 Page 6 — PUBLICATIONS

**Purpose:** All research output. Tabbed or filtered view.

**Tabs:**
- Journal Papers
- Conference Papers
- Book Chapters
- Books

Each entry contains:
| Field | Content |
|-------|---------|
| Title | Paper title |
| Authors | All author names (self **bolded**) |
| Journal/Conference | Full name |
| Volume / Issue / Pages | e.g., Vol. 12, Issue 3, pp. 45–58 |
| Year | 2023 |
| Publisher | Elsevier / Springer / IEEE |
| DOI / URL | Clickable link |
| Type | SCI / Scopus / UGC / Others |

**Filter options:** Year · Type · Indexing

---

### 💡 Page 7 — PATENTS & COPYRIGHTS

**Purpose:** IP portfolio.

**Tabs:** Patents · Copyrights

Each patent entry:
| Field | Content |
|-------|---------|
| Title | Patent title |
| Inventors | All names |
| Application No. | Official number |
| Filing Year | 2021 |
| Status | Filed / Published / Granted |
| Country | India / USA / Germany |

Each copyright entry:
| Field | Content |
|-------|---------|
| Title | Work title |
| Registration No. | Govt registration number |
| Date | Date of registration |
| Type | Lab Manual / Software / Research |

---

### 🏫 Page 8 — TEACHING

**Purpose:** Academic teaching profile.

| Sub-section | Content |
|-------------|---------|
| **Subjects Taught** | Table: Subject → Level (UG/PG) → Department → Year |
| **Study Materials** | Subject name + download link (PDF from Supabase Storage) |
| **Projects Guided** | BE Projects, ME Projects — title, year, team, tech |

---

### 🛠️ Page 9 — PROFESSIONAL ACTIVITIES

**Purpose:** All academic service and engagement activities.

**Accordion / Tab sections:**

| Tab | Content |
|-----|---------|
| **FDP/Workshops Attended** | Name, organizer, date, duration, mode |
| **Workshops Organized** | Title, venue, date, audience |
| **Guest Lectures / Talks** | Topic, institution, date |
| **Judge / Mentor Activities** | Event, role, institution, year |
| **Reviewer / TPC / Editor** | Journal / conference name, year |
| **Professional Memberships** | Org name, type, member no., year |
| **Administrative Roles** | Role, scope, institution, year |
| **University Services** | Role, institution, year |

---

### 📬 Page 10 — CONTACT

**Purpose:** Reach out form + address.

| Element | Content |
|---------|---------|
| **Email** | Displayed |
| **Phone** | Displayed (optional) |
| **Office Address** | Room, block, college, city |
| **Office Hours** | e.g., Mon–Fri 10am–5pm |
| **Map embed** | Google Maps embed (optional) |
| **Contact Form** | Name, Email, Subject, Message → sends to your inbox |
| **Social media links** | Full row of icons |

---

## 🔐 Admin View — Protected Route `/admin`

---

### 🔑 Admin Login Page `/admin/login`

| Element | Detail |
|---------|--------|
| **Route** | `/admin` or `/admin/login` |
| **Form** | Username + Password |
| **Auth** | Supabase Auth (email/password) OR custom table check |
| **On Success** | Redirect to `/admin/dashboard` |
| **On Failure** | "Invalid credentials" error |
| **Security** | Rate limiting, no public sign-up |

---

### 🖥️ Admin Dashboard `/admin/dashboard`

Overview cards with quick stats:

| Card | Info |
|------|------|
| Total Publications | Count |
| Total Patents | Count |
| Total Projects Guided | Count |
| Pending / Draft items | Count |
| Last Updated | Timestamp |

Sidebar navigation:
```
Dashboard
├── Manage Profile (About, Photo, CV)
├── Manage Education
├── Manage Experience
├── Manage Research (Areas, Awards, Grants)
├── Manage Publications
├── Manage Patents & Copyrights
├── Manage Teaching & Materials
├── Manage Activities
│   ├── FDPs Attended
│   ├── Workshops Organized
│   ├── Guest Lectures
│   ├── Reviewer Roles
│   └── Admin Roles
└── Logout
```

---

### 🔧 Admin CRUD Interface — Each Section

Each manage page has:

| Action | UI Element |
|--------|-----------|
| **View All** | Table / card list with pagination |
| **Add New** | Modal or dedicated form page |
| **Edit** | Inline edit or modal pre-filled form |
| **Delete** | Confirmation prompt before delete |
| **Upload** | File upload (PDFs, images to Supabase Storage) |
| **Toggle Visibility** | Show/Hide toggle per item (publish/draft) |

---

## 🗂️ Full Section → Database Table Mapping

| Website Section | Supabase Table |
|----------------|---------------|
| Profile / About | `profile` |
| Education | `education` |
| Experience | `experience` |
| Research Areas | `research_areas` |
| Awards | `awards` |
| Grants | `research_grants` |
| Journal Papers | `publications` (type=journal) |
| Conference Papers | `publications` (type=conference) |
| Books / Chapters | `publications` (type=book/chapter) |
| Patents | `patents` |
| Copyrights | `copyrights` |
| Subjects Taught | `subjects_taught` |
| Study Materials | `study_materials` |
| BE Projects Guided | `projects_guided` (level=BE) |
| ME Projects Guided | `projects_guided` (level=ME) |
| FDPs Attended | `activities` (type=fdp_attended) |
| Workshops Organized | `activities` (type=workshop_organized) |
| Guest Lectures | `activities` (type=guest_lecture) |
| Reviewer/TPC Roles | `activities` (type=reviewer) |
| Professional Memberships | `memberships` |
| Admin/University Roles | `admin_roles` |

---

## 🎨 UI Design Principles

| Principle | Recommendation |
|-----------|---------------|
| **Theme** | Light, professional with ultra-light cool-toned background and Deep Indigo/Slate-Teal accent |
| **Font** | Plus Jakarta Sans / Inter Tight (Headings) + Inter / Roboto (Body) |
| **Animations** | Subtle scroll reveals (fade-in + slight lift), glassmorphism navbar, soft hover lift on cards |
| **Responsive** | Mobile-first, tablet & desktop breakpoints |
| **Accessibility** | ARIA labels, keyboard nav, contrast ratios (ensure text over background meets WCAG) |
| **Performance** | Lazy loading, paginated publication lists |

---

*Blueprint version: 1.0 — March 11, 2026*
