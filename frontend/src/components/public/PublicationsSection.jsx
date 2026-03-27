import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePublications } from '@/hooks/usePublications'
import SectionHeader from '@/components/shared/SectionHeader'

// MT-33: Fixed pub.journal_name → pub.venue (correct DB column)
// MT-35: Removed impact_factor (column doesn't exist in schema)
// MT-37: Fixed className="form-control" → className="year-select"
// MT-49: Replaced inline styles with CSS classes

const PUB_TABS = [
  { key: 'journal',      label: 'Journal Articles' },
  { key: 'conference',   label: 'Conference Papers' },
  { key: 'book_chapter', label: 'Book Chapters' },
  { key: 'book',         label: 'Books' },
]

const PublicationsSection = () => {
  const [tab, setTab]           = useState('journal')
  const [yearFilter, setYearFilter] = useState('all')
  const { data: pubs = [], isLoading } = usePublications(tab)

  const years    = ['all', ...Array.from(new Set(pubs.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a)]
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

        <div className="pub-controls">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="year-select"
            aria-label="Filter by year"
          >
            {years.map((y) => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
          </select>
          <span className="pub-count">{filtered.length} publication{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <div className="spinner spinner-lg" style={{ margin: '0 auto 1rem' }} />
            <p>Loading publications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No publications found for this filter.</p>
          </div>
        ) : (
          <motion.ul
            key={tab + yearFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="publication-list"
          >
            {filtered.map((pub, idx) => (
              <li key={pub.id} className="publication-item">
                <span className="pub-number">{idx + 1}.</span>
                <div className="pub-content">
                  <p className="pub-title">{pub.title}</p>
                  <p className="pub-authors">{pub.authors}</p>
                  {pub.journal_name && <p className="pub-venue"><em>{pub.journal_name}</em></p>}
                  <div className="pub-meta">
                    {pub.year      && <span className="badge badge-accent">{pub.year}</span>}
                    {pub.volume    && <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Vol. {pub.volume}</span>}
                    {pub.pages     && <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>pp. {pub.pages}</span>}
                    {pub.indexing  && <span className="badge badge-indexing">{pub.indexing}</span>}
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="btn-doi">
                        DOI
                      </a>
                    )}
                    {pub.url && !pub.doi && (
                      <a href={pub.url} target="_blank" rel="noreferrer" className="btn-doi">
                        Link
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  )
}

export default PublicationsSection
