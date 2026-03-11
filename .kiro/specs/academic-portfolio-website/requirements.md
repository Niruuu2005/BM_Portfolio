# Requirements: Academic Portfolio Website

## 1. Overview

### 1.1 Purpose
Build a complete academic portfolio website for Mrs. B. Mahalakshmi (Assistant Professor, Computer Engineering, PCCOE Pune) with a public-facing view and protected admin panel for content management.

### 1.2 Target Users
- **Public Users**: Students, recruiters, collaborators, institutions (read-only access)
- **Admin User**: Single authenticated admin (full CRUD access)

### 1.3 Technology Stack
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Frontend**: React + Vite + Tailwind CSS
- **State Management**: React Query + React Context
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: react-hot-toast

---

## 2. User Stories

### 2.1 Public User Stories

**US-1**: As a visitor, I want to view the professor's profile information so I can learn about their background and expertise.

**US-2**: As a visitor, I want to see educational qualifications in timeline format so I can understand their academic journey.

**US-3**: As a visitor, I want to browse publications filtered by type (journal/conference/book) and year so I can find relevant research.

**US-4**: As a visitor, I want to view patents and copyrights so I can see their intellectual property contributions.

**US-5**: As a visitor, I want to see teaching experience and download study materials so I can access educational resources.

**US-6**: As a visitor, I want to view professional activities (workshops, guest lectures, reviewer roles) so I can understand their academic engagement.

**US-7**: As a visitor, I want to access contact information and academic profile links (Google Scholar, Scopus, ORCID) so I can connect or verify credentials.

**US-8**: As a visitor, I want to download the CV PDF so I can have offline access to complete credentials.

**US-9**: As a visitor, I want the website to be responsive so I can view it on mobile, tablet, or desktop devices.

### 2.2 Admin User Stories

**US-10**: As an admin, I want to log in securely with email and password so only I can manage content.

**US-11**: As an admin, I want to update profile information (bio, tagline, contact details, academic links) so I can keep my information current.

**US-12**: As an admin, I want to add/edit/delete education entries so I can maintain my academic qualifications.

**US-13**: As an admin, I want to manage work experience entries so I can update my professional history.

**US-14**: As an admin, I want to add/edit/delete publications with full metadata (title, authors, venue, year, DOI, indexing) so I can showcase my research output.

**US-15**: As an admin, I want to manage patents and copyrights so I can track my intellectual property.

**US-16**: As an admin, I want to manage teaching information (subjects taught, study materials) so I can share educational resources.

**US-17**: As an admin, I want to upload files (profile photo, CV, study materials) to Supabase Storage so they are publicly accessible.

**US-18**: As an admin, I want to toggle visibility of items without deleting them so I can control what appears publicly.

**US-19**: As an admin, I want to manage professional activities (FDPs attended, workshops organized, guest lectures, reviewer roles) so I can document my academic service.

**US-20**: As an admin, I want to see a dashboard with statistics (total publications, patents, projects) so I can get a quick overview.

**US-21**: As an admin, I want to log out securely so my session ends properly.

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

**FR-1.1**: System shall provide email/password authentication via Supabase Auth.

**FR-1.2**: System shall support only one admin user (no public sign-ups).

**FR-1.3**: System shall protect all `/admin/*` routes requiring authentication.

**FR-1.4**: System shall redirect unauthenticated users to `/admin/login` when accessing protected routes.

**FR-1.5**: System shall provide logout functionality that clears session and redirects to home.

### 3.2 Public View Features

**FR-2.1**: System shall display a hero section with profile photo, name, designation, institution, tagline, and CV download button.

**FR-2.2**: System shall display About section with bio, career objective, research interests, and academic profile links.

**FR-2.3**: System shall display Education section in timeline format with degree, specialization, institution, year, and score.

**FR-2.4**: System shall display Experience section with designation, institution, duration, and responsibilities.

**FR-2.5**: System shall display Research section with research areas, awards, and funded grants.

**FR-2.6**: System shall display Publications section with filtering by type (journal/conference/book/chapter) and year.

**FR-2.7**: System shall display Patents & Copyrights section with status and filing details.

**FR-2.8**: System shall display Teaching section with subjects taught and downloadable study materials.

**FR-2.9**: System shall display Projects Guided section (BE/ME projects).

**FR-2.10**: System shall display Professional Activities section with tabs for different activity types.

**FR-2.11**: System shall display Contact section with email, office address, and academic profile links.

**FR-2.12**: System shall only display items where `is_visible = true`.

### 3.3 Admin Panel Features

**FR-3.1**: System shall provide a dashboard with statistics cards (total publications, patents, projects, last updated).

**FR-3.2**: System shall provide CRUD interface for profile management (single record).

**FR-3.3**: System shall provide CRUD interface for education entries with sort order control.

**FR-3.4**: System shall provide CRUD interface for experience entries.

**FR-3.5**: System shall provide CRUD interface for publications with type selection and metadata fields.

**FR-3.6**: System shall provide CRUD interface for patents and copyrights.

**FR-3.7**: System shall provide CRUD interface for teaching (subjects taught and study materials).

**FR-3.8**: System shall provide CRUD interface for projects guided.

**FR-3.9**: System shall provide CRUD interface for activities with type discrimination.

**FR-3.10**: System shall provide CRUD interface for research areas, awards, and grants.

**FR-3.11**: System shall provide CRUD interface for memberships and admin roles.

**FR-3.12**: System shall provide file upload functionality for profile photos, CV, and study materials.

**FR-3.13**: System shall provide visibility toggle for all items (soft delete).

**FR-3.14**: System shall provide hard delete option with confirmation prompt.

### 3.4 Data Management

**FR-4.1**: System shall store all data in Supabase PostgreSQL database.

**FR-4.2**: System shall enforce Row Level Security (RLS) policies:
- Public users: SELECT only where `is_visible = true`
- Admin users: Full CRUD access

**FR-4.3**: System shall auto-update `updated_at` timestamp on record modifications.

**FR-4.4**: System shall store uploaded files in Supabase Storage buckets:
- `profile-photos` (public)
- `cv-documents` (public)
- `study-materials` (public)

**FR-4.5**: System shall generate and store public URLs for uploaded files.

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-1.1**: Public pages shall load within 2 seconds on standard broadband.

**NFR-1.2**: System shall implement lazy loading for images and large lists.

**NFR-1.3**: System shall use React Query caching to minimize database queries.

### 4.2 Security

**NFR-2.1**: System shall use HTTPS for all communications.

**NFR-2.2**: System shall store authentication tokens securely in browser storage.

**NFR-2.3**: System shall implement rate limiting on login attempts.

**NFR-2.4**: System shall validate all user inputs on both client and server side.

**NFR-2.5**: System shall prevent SQL injection through Supabase parameterized queries.

### 4.3 Usability

**NFR-3.1**: System shall be responsive and work on mobile (320px+), tablet (768px+), and desktop (1024px+).

**NFR-3.2**: System shall follow WCAG 2.1 Level AA accessibility guidelines where possible.

**NFR-3.3**: System shall provide clear error messages for failed operations.

**NFR-3.4**: System shall provide loading indicators for async operations.

**NFR-3.5**: System shall provide success notifications for completed actions.

### 4.4 Maintainability

**NFR-4.1**: Code shall follow React best practices and component composition patterns.

**NFR-4.2**: System shall use TypeScript for type safety (optional but recommended).

**NFR-4.3**: System shall have reusable components for common UI patterns.

**NFR-4.4**: System shall have clear separation between data fetching logic and UI components.

### 4.5 Design

**NFR-5.1**: System shall use the specified color palette:
- Primary: #0F172A (Slate 900)
- Accent: #4338CA (Deep Indigo) or #0F766E (Slate-Teal)
- Background: #F8FAFC (Slate 50)
- Surface: #FFFFFF (White)
- Border: #E5E7EB (Gray 200)

**NFR-5.2**: System shall use Plus Jakarta Sans or Inter Tight for headings.

**NFR-5.3**: System shall use Inter or Roboto for body text.

**NFR-5.4**: System shall implement subtle animations (fade-in, hover effects).

**NFR-5.5**: System shall use consistent spacing and layout patterns.

---

## 5. Database Schema Requirements

### 5.1 Core Tables

**Table: profile** (single row)
- Fields: full_name, designation, department, institution, email, phone, office_addr, tagline, bio, career_obj, photo_url, cv_url, scholar_url, scopus_url, orcid_url, wos_url, researchgate_url, publons_url, linkedin_url, github_url, youtube_url

**Table: education**
- Fields: degree, specialization, institution, university, year, score, rank_distinction, thesis_title, sort_order, is_visible

**Table: experience**
- Fields: designation, department, institution, type, start_date, end_date, is_current, responsibilities (array), sort_order, is_visible

**Table: research_areas**
- Fields: name, icon, sort_order, is_visible

**Table: awards**
- Fields: title, awarded_by, year, description, url, is_visible

**Table: research_grants**
- Fields: title, funding_agency, ref_no, amount, duration_from, duration_to, status, role, description, is_visible

**Table: publications**
- Fields: type, title, authors, venue, volume, issue, pages, year, doi, url, publisher, indexing, isbn_issn, is_visible

**Table: patents**
- Fields: title, inventors, application_no, filing_date, year, country, status, description, is_visible

**Table: copyrights**
- Fields: title, reg_no, reg_date, year, type, is_visible

**Table: subjects_taught**
- Fields: subject, level, department, year_from, year_to, is_visible

**Table: study_materials**
- Fields: title, subject, level, department, year, file_url, file_type, is_visible

**Table: projects_guided**
- Fields: title, level, team_members, team_size, year, domain, tech_stack, description, is_visible

**Table: activities**
- Fields: type, title, organizer, venue, institution, journal, date_from, date_to, year, duration, mode, role, description, certificate_url, is_visible

**Table: memberships**
- Fields: organization, type, member_no, year_from, year_to, is_visible

**Table: admin_roles**
- Fields: role, scope, institution, year_from, year_to, description, is_visible

### 5.2 Common Fields

All tables shall include:
- `id` (UUID, primary key, auto-generated)
- `created_at` (timestamp, auto-set on insert)
- `updated_at` (timestamp, auto-updated on modification)

---

## 6. Acceptance Criteria

### AC-1: Authentication
- Admin can log in with valid credentials
- Invalid credentials show error message
- Protected routes redirect to login when not authenticated
- Admin can log out and session is cleared

### AC-2: Public View
- All public sections display correctly with visible data
- Publications can be filtered by type and year
- CV download button works and opens PDF
- Academic profile links open in new tabs
- Page is responsive on mobile, tablet, and desktop
- Only items with `is_visible = true` are shown

### AC-3: Admin Panel
- Dashboard shows correct statistics
- All CRUD operations work for each section
- File uploads succeed and generate public URLs
- Visibility toggle works without deleting data
- Delete operations show confirmation prompt
- Success/error notifications appear for all actions
- Forms validate inputs before submission

### AC-4: Data Persistence
- All changes persist after page refresh
- RLS policies prevent unauthorized access
- Public users cannot modify data
- Admin can perform all CRUD operations

### AC-5: UI/UX
- Design matches specified color palette
- Typography uses specified fonts
- Animations are subtle and smooth
- Loading states appear during async operations
- Error messages are clear and helpful
- Layout is consistent across all pages

---

## 7. Out of Scope

- Multi-user admin system
- Public user registration/login
- Comments or feedback system
- Blog functionality
- Email contact form backend (can be added later)
- Analytics dashboard
- SEO optimization (can be added later)
- Internationalization (i18n)
- Dark mode toggle

---

## 8. Dependencies

### 8.1 External Services
- Supabase account and project
- Domain name (optional for deployment)
- Vercel/Netlify account for hosting

### 8.2 NPM Packages
- React, React DOM, React Router
- Vite
- Tailwind CSS
- @supabase/supabase-js
- @tanstack/react-query
- react-hook-form
- zod
- lucide-react
- react-hot-toast

---

## 9. Constraints

- Single admin user only (no multi-admin support)
- No offline functionality
- Requires modern browser (ES6+ support)
- File uploads limited by Supabase Storage quotas
- Database limited by Supabase free tier (if applicable)

---

## 10. Assumptions

- Admin has basic technical knowledge to use CRUD interface
- Profile data is provided in docs/profile.md
- Supabase project can be created and configured
- Admin will manually populate initial data
- Users have stable internet connection

---

*Requirements Document v1.0 — Created March 11, 2026*
