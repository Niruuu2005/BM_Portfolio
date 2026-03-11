import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSubjectsTaught, useStudyMaterials, useProjects } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'

const TeachingSection = () => {
  const [tab, setTab] = useState('subjects')
  const { data: subjects   = [], isLoading: loadS } = useSubjectsTaught()
  const { data: materials  = [], isLoading: loadM } = useStudyMaterials()
  const { data: projects   = [], isLoading: loadPr } = useProjects()

  const groupedSubjects = subjects.reduce((acc, s) => {
    const key = s.level || 'UG'
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <section id="teaching" className="section">
      <div className="container">
        <SectionHeader title="Teaching" subtitle="Academic Contributions" />

        <div className="tabs">
          <button className={`tab-btn ${tab === 'subjects'  ? 'tab-btn--active' : ''}`} onClick={() => setTab('subjects')}>Subjects Taught</button>
          <button className={`tab-btn ${tab === 'materials' ? 'tab-btn--active' : ''}`} onClick={() => setTab('materials')}>Study Materials</button>
          <button className={`tab-btn ${tab === 'projects'  ? 'tab-btn--active' : ''}`} onClick={() => setTab('projects')}>Projects Guided</button>
        </div>

        {tab === 'subjects' && (
          <motion.div key="subjects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadS ? <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p> : (
              Object.entries(groupedSubjects).map(([level, subs]) => (
                <div key={level} style={{ marginBottom: 'var(--space-8)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
                    {level === 'UG' ? 'Undergraduate' : level === 'PG' ? 'Postgraduate' : level}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                    {subs.map((s) => (
                      <div key={s.id} className="pub-card">
                        <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{s.subject_name}</p>
                        {s.subject_code && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{s.subject_code}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {tab === 'materials' && (
          <motion.div key="materials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadM ? <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {materials.map((m) => (
                  <div key={m.id} className="pub-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{m.title}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                        {m.subject} {m.year ? `• ${m.year}` : ''}
                      </p>
                    </div>
                    {m.file_url && (
                      <a href={m.file_url} target="_blank" rel="noreferrer" className="btn btn--sm btn--outline">
                        Download
                      </a>
                    )}
                  </div>
                ))}
                {materials.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No study materials found.</p>}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'projects' && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadPr ? <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {projects.map((p) => (
                  <div key={p.id} className="pub-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h4>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {p.level && <span className="badge badge--blue">{p.level}</span>}
                        {p.year  && <span className="badge badge--blue">{p.year}</span>}
                      </div>
                    </div>
                    {p.students && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Students: {p.students}</p>
                    )}
                  </div>
                ))}
                {projects.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No projects found.</p>}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default TeachingSection
