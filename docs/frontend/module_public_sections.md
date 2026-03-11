# Module — Public Sections (User View)

> **Module Goal:** Build every visible public-facing section of the website as a self-contained React component. Each section reads data from Supabase through custom hooks and renders beautifully for the public visitor.

---

## Overview: Section → Component → Hook → Table

| Section | Component | Hook | Supabase Table |
|---------|-----------|------|---------------|
| Hero | `HeroSection` | `useProfile` | `profile` |
| About | `AboutSection` | `useProfile`, `useResearchAreas` | `profile`, `research_areas` |
| Education | `EducationSection` | `useEducation` | `education` |
| Experience | `ExperienceSection` | `useExperience` | `experience` |
| Research | `ResearchSection` | `useResearchAreas`, `useAwards`, `useGrants` | `research_areas`, `awards`, `research_grants` |
| Publications | `PublicationsSection` | `usePublications` | `publications` |
| Patents | `PatentsSection` | `usePatents`, `useCopyrights` | `patents`, `copyrights` |
| Teaching | `TeachingSection` | `useSubjectsTaught`, `useStudyMaterials`, `useProjects` | `subjects_taught`, `study_materials`, `projects_guided` |
| Activities | `ActivitiesSection` | `useActivities`, `useMemberships` | `activities`, `memberships` |
| Contact | `ContactSection` | `useProfile` | `profile` |

---

## 4.1 Shared Hooks (Data Fetching)

All custom hooks follow the same pattern using React Query:

```javascript
// src/hooks/usePublications.js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const usePublications = (type = null) => {
  return useQuery({
    queryKey: ['publications', type],
    queryFn: async () => {
      let query = supabase
        .from('publications')
        .select('*')
        .eq('is_visible', true)
        .order('year', { ascending: false })
      if (type) query = query.eq('type', type)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

// src/hooks/useProfile.js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile').select('*').single()
      if (error) throw error
      return data
    },
  })
}

// Create similar hooks for: useEducation, useExperience, useResearchAreas,
// useAwards, useGrants, usePatents, useCopyrights, useActivities,
// useMemberships, useSubjectsTaught, useStudyMaterials, useProjects
```

---

## 4.2 Hero Section

```jsx
// src/components/public/HeroSection.jsx
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'

const HeroSection = () => {
  const { data: profile, isLoading } = useProfile()

  return (
    <section id="home" className="hero-section">
      <div className="container hero__inner">
        {/* Text Content */}
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="hero__greeting">Hello, I'm</p>
          <h1 className="hero__name">
            {isLoading ? 'Loading...' : profile?.full_name || 'Dr. Your Name'}
          </h1>
          <p className="hero__title">
            {profile?.designation} · {profile?.department}
          </p>
          <p className="hero__institution">{profile?.institution}</p>
          <p className="hero__tagline">{profile?.tagline}</p>

          {/* Action Buttons */}
          <div className="hero__actions">
            {profile?.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                📄 Download CV
              </a>
            )}
            <a href="#contact" className="btn btn-outline">
              📬 Contact Me
            </a>
          </div>

          {/* Academic Profile Links */}
          <div className="hero__links">
            {profile?.scholar_url  && <a href={profile.scholar_url}  target="_blank" rel="noreferrer" className="profile-badge">Scholar</a>}
            {profile?.scopus_url   && <a href={profile.scopus_url}   target="_blank" rel="noreferrer" className="profile-badge">Scopus</a>}
            {profile?.orcid_url    && <a href={profile.orcid_url}    target="_blank" rel="noreferrer" className="profile-badge">ORCID</a>}
            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="profile-badge">LinkedIn</a>}
          </div>
        </motion.div>

        {/* Profile Photo */}
        <motion.div
          className="hero__photo-wrap"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt={profile.full_name} className="hero__photo" />
          ) : (
            <div className="hero__photo-placeholder">👤</div>
          )}
        </motion.div>
      </div>

      {/* Stat counters — filled from DB counts or static */}
      <div className="container hero__stats">
        <StatCard number="15+" label="Years Experience" />
        <StatCard number="50+" label="Publications" />
        <StatCard number="10+" label="Patents" />
        <StatCard number="100+" label="Projects Guided" />
      </div>
    </section>
  )
}

const StatCard = ({ number, label }) => (
  <div className="stat-card">
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </div>
)

export default HeroSection
```

---

## 4.3 Education Section — Timeline Layout

```jsx
// src/components/public/EducationSection.jsx
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/shared/SectionHeader'

const useEducation = () => useQuery({
  queryKey: ['education'],
  queryFn: async () => {
    const { data } = await supabase.from('education').select('*').eq('is_visible', true).order('sort_order')
    return data
  }
})

const EducationSection = () => {
  const { data: education = [], isLoading } = useEducation()

  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeader title="Education" subtitle="Academic Journey" />
        <div className="timeline">
          {education.map((item, idx) => (
            <motion.div
              key={item.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-header">
                  <h3 className="timeline-degree">{item.degree}</h3>
                  <span className="timeline-year">{item.year}</span>
                </div>
                <p className="timeline-specialization">{item.specialization}</p>
                <p className="timeline-institution">{item.institution}</p>
                <p className="timeline-university text-muted">{item.university}</p>
                {item.score && <span className="badge badge-accent">{item.score}</span>}
                {item.rank_distinction && (
                  <span className="badge badge-gold">🏆 {item.rank_distinction}</span>
                )}
                {item.thesis_title && (
                  <p className="timeline-thesis">Thesis: <em>{item.thesis_title}</em></p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EducationSection
```

---

## 4.4 Publications Section — Tabbed, Filtered

```jsx
// src/components/public/PublicationsSection.jsx
import { useState } from 'react'
import { usePublications } from '@/hooks/usePublications'
import SectionHeader from '@/components/shared/SectionHeader'

const TABS = [
  { label: 'Journal Papers', value: 'journal' },
  { label: 'Conference Papers', value: 'conference' },
  { label: 'Book Chapters', value: 'book_chapter' },
  { label: 'Books', value: 'book' },
]

const PublicationsSection = () => {
  const [activeTab, setActiveTab] = useState('journal')
  const [filterYear, setFilterYear] = useState('')
  const { data: publications = [], isLoading } = usePublications(activeTab)

  // Filter by year if selected
  const filtered = filterYear
    ? publications.filter((p) => String(p.year) === filterYear)
    : publications

  // Unique years for filter dropdown
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a)

  return (
    <section id="publications" className="section section--alt">
      <div className="container">
        <SectionHeader title="Publications" subtitle="Research Output" />

        {/* Tabs */}
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`tab-btn ${activeTab === tab.value ? 'tab-btn--active' : ''}`}
              onClick={() => { setActiveTab(tab.value); setFilterYear('') }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Year filter */}
        <div className="pub-controls">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="year-select"
          >
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="pub-count">{filtered.length} paper(s)</span>
        </div>

        {/* Publication List */}
        {isLoading ? (
          <p className="text-muted">Loading publications...</p>
        ) : (
          <ol className="publication-list">
            {filtered.map((pub, idx) => (
              <li key={pub.id} className="publication-item">
                <span className="pub-number">{idx + 1}</span>
                <div className="pub-content">
                  <p className="pub-title">{pub.title}</p>
                  <p className="pub-authors text-muted">{pub.authors}</p>
                  <p className="pub-venue">
                    <em>{pub.venue}</em>
                    {pub.volume && `, ${pub.volume}`}
                    {pub.issue && `, ${pub.issue}`}
                    {pub.pages && `, ${pub.pages}`}
                    {pub.year && ` (${pub.year})`}
                  </p>
                  <div className="pub-meta">
                    {pub.indexing && <span className="badge badge-indexing">{pub.indexing}</span>}
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="btn-doi">
                        DOI ↗
                      </a>
                    )}
                    {pub.url && !pub.doi && (
                      <a href={pub.url} target="_blank" rel="noreferrer" className="btn-doi">
                        Link ↗
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

export default PublicationsSection
```

---

## 4.5 SectionHeader Shared Component

Used at the top of every public section for consistent headings:

```jsx
// src/components/shared/SectionHeader.jsx
import { motion } from 'framer-motion'

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    className="section-header"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <p className="section-subtitle">{subtitle}</p>
    <h2 className="section-title">{title}</h2>
    <div className="section-divider" />
  </motion.div>
)

export default SectionHeader
```

```css
.section-header { margin-bottom: var(--space-12); }
.section-subtitle { color: var(--color-accent); font-size: var(--font-size-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: var(--space-2); }
.section-title { font-family: var(--font-heading); font-size: var(--font-size-4xl); font-weight: 700; margin-bottom: var(--space-4); }
.section-divider { width: 60px; height: 3px; background: var(--color-accent); border-radius: var(--radius-full); }
```

---

## 4.6 Contact Section

```jsx
// src/components/public/ContactSection.jsx
import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import SectionHeader from '@/components/shared/SectionHeader'
import toast from 'react-hot-toast'

const ContactSection = () => {
  const { data: profile } = useProfile()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // In production, send via an edge function or EmailJS
    // For now, open mailto as fallback:
    const mailto = `mailto:${profile?.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    window.open(mailto)
    setSending(false)
    toast.success('Opening email client...')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader title="Contact" subtitle="Get In Touch" />
        <div className="contact-grid">
          {/* Info */}
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p className="text-muted">Feel free to reach out for collaborations, student inquiries, or any academic discussions.</p>
            <div className="contact-details">
              {profile?.email && <div className="contact-item">📧 <a href={`mailto:${profile.email}`}>{profile.email}</a></div>}
              {profile?.phone && <div className="contact-item">📞 {profile.phone}</div>}
              {profile?.office_addr && <div className="contact-item">📍 {profile.office_addr}</div>}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Research Collaboration" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Your message..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? 'Sending...' : '✉️ Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
```

---

## 4.7 Home Page — Assembles All Sections

```jsx
// src/pages/public/HomePage.jsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import EducationSection from '@/components/public/EducationSection'
import ExperienceSection from '@/components/public/ExperienceSection'
import ResearchSection from '@/components/public/ResearchSection'
import PublicationsSection from '@/components/public/PublicationsSection'
import PatentsSection from '@/components/public/PatentsSection'
import TeachingSection from '@/components/public/TeachingSection'
import ActivitiesSection from '@/components/public/ActivitiesSection'
import ContactSection from '@/components/public/ContactSection'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <ResearchSection />
        <PublicationsSection />
        <PatentsSection />
        <TeachingSection />
        <ActivitiesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
```

---

## 4.8 Module Completion Checklist

```
[ ] useProfile, useEducation, useExperience hooks written
[ ] usePublications(type) filter hook written
[ ] usePatents, useCopyrights hooks written
[ ] useActivities, useMemberships hooks written
[ ] useSubjectsTaught, useStudyMaterials, useProjects hooks written
[ ] HeroSection — photo, name, tagline, CV download, profile links
[ ] AboutSection — bio, research areas as pills, social links
[ ] EducationSection — vertical timeline, degree/uni/year/score/rank
[ ] ExperienceSection — cards with designation, institution, duration
[ ] ResearchSection — areas, awards, grants table
[ ] PublicationsSection — tabs, year filter, ordered list with DOI
[ ] PatentsSection — tabbed patents + copyrights
[ ] TeachingSection — subjects table + study material downloads
[ ] ActivitiesSection — accordion tabs per activity type
[ ] ContactSection — info + mailto form
[ ] HomePage.jsx assembles all sections
[ ] padding-top on main to compensate for fixed navbar
[ ] Scroll reveal animations with framer-motion.whileInView
```

---

*Frontend Module — Public Sections | v1.0 — March 2026*
