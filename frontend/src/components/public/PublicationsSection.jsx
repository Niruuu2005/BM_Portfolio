import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePublications } from '@/hooks/usePublications'
import SectionHeader from '@/components/shared/SectionHeader'

const PUB_TABS = [
  { key: 'journal',       label: 'Journal Articles' },
  { key: 'conference',    label: 'Conference Papers' },
  { key: 'book_chapter',  label: 'Book Chapters' },
  { key: 'book',          label: 'Books' },
]

const PublicationsSection = () => {
  const [tab, setTab] = useState('journal')
  const [yearFilter, setYearFilter] = useState('all')
  const { data: pubs = [], isLoading } = usePublications(tab)

  const years = ['all', ...Array.from(new Set(pubs.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a)]
  const filtered = yearFilter === 'all' ? pubs : pubs.filter((p) => String(p.year) === yearFilter)

  return (
    <section id="publications" className="section">
      <div className="container">
        <SectionHeader title="Publications" subtitle="Research Output" />

        <div className="tabs">
          {PUB_TABS.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${tab === t.key ? 'tab-btn--active' : ''}`}
              onClick={() => { setTab(t.key); setYearFilter('all') }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="form-control"
            style={{ width: 'fit-content', minWidth: 120 }}
          >
            {years.map((y) => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
          </select>
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 'var(--space-8)' }}>Loading…</p>
        ) : (
          <motion.ol
            key={tab + yearFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ listStyle: 'decimal', paddingLeft: 'var(--space-6)', marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
          >
            {filtered.map((pub) => (
              <li key={pub.id} className="pub-card">
                <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{pub.title}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                  {pub.authors}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', fontSize: 'var(--font-size-sm)' }}>
                  {pub.journal_name && (
                    <em style={{ color: 'var(--color-accent)' }}>{pub.journal_name}</em>
                  )}
                  {pub.year && <span className="badge badge--blue">{pub.year}</span>}
                  {pub.volume && <span style={{ color: 'var(--color-text-muted)' }}>Vol. {pub.volume}</span>}
                  {pub.pages  && <span style={{ color: 'var(--color-text-muted)' }}>pp. {pub.pages}</span>}
                  {pub.impact_factor && (
                    <span className="badge badge--green">IF: {pub.impact_factor}</span>
                  )}
                  {pub.doi && (
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer"
                       style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                      DOI
                    </a>
                  )}
                  {pub.url && !pub.doi && (
                    <a href={pub.url} target="_blank" rel="noreferrer"
                       style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                      Link
                    </a>
                  )}
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)' }}>No publications found.</p>
            )}
          </motion.ol>
        )}
      </div>
    </section>
  )
}

export default PublicationsSection
