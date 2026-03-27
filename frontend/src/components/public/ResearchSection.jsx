import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useResearchAreas, useAwards, useGrants } from '@/hooks/useData'
import { usePublications } from '@/hooks/usePublications'
import SectionHeader from '@/components/shared/SectionHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import PatentsCopyrightsPanel from '@/components/public/PatentsCopyrightsPanel'
import { formatDate } from '@/lib/utils'

/** URL `?tab=` values for /research (legacy /patents redirects use `ip`) */
export const RESEARCH_TAB_KEYS = ['areas', 'publications', 'ip', 'awards', 'grants']

const isValidResearchTab = (v) => RESEARCH_TAB_KEYS.includes(v)

const EmptyState = ({ message }) => (
  <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>
    {message}
  </p>
)

const ErrorState = ({ message }) => (
  <p style={{ textAlign: 'center', color: 'var(--color-danger)', padding: 'var(--space-8) 0' }}>
    {message}
  </p>
)

/* ── Publications sub-section (embedded in Research) ── */
const PUB_TYPES = [
  { key: 'journal',      label: 'Journal Articles' },
  { key: 'conference',   label: 'Conference Papers' },
  { key: 'book_chapter', label: 'Book Chapters' },
  { key: 'book',         label: 'Books' },
]

const PublicationsTab = () => {
  const [pubType, setPubType]       = useState('journal')
  const [yearFilter, setYearFilter] = useState('all')
  const { data: pubs = [], isLoading, isError } = usePublications(pubType)

  const years    = ['all', ...Array.from(new Set(pubs.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a)]
  const filtered = yearFilter === 'all' ? pubs : pubs.filter((p) => String(p.year) === yearFilter)

  return (
    <div style={{ marginTop: 'var(--space-8)' }}>
      {/* Publication type sub-tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {PUB_TYPES.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${pubType === t.key ? 'tab-btn--active' : ''}`}
            onClick={() => { setPubType(t.key); setYearFilter('all') }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Year filter + count */}
      <div className="pub-controls">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="year-select"
          aria-label="Filter by year"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>
          ))}
        </select>
        {!isLoading && !isError && (
          <span className="pub-count">
            {filtered.length} publication{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoading && <LoadingSkeleton count={4} />}
      {isError   && <ErrorState message="Failed to load publications. Please try again later." />}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState message="No publications found for this filter." />
      )}
      {!isLoading && !isError && filtered.length > 0 && (
        <motion.ul
          key={pubType + yearFilter}
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
                  {pub.year     && <span className="badge badge-accent">{pub.year}</span>}
                  {pub.volume   && <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Vol. {pub.volume}</span>}
                  {pub.pages    && <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>pp. {pub.pages}</span>}
                  {pub.indexing && <span className="badge badge-indexing">{pub.indexing}</span>}
                  {pub.doi && (
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="btn-doi">DOI</a>
                  )}
                  {pub.url && !pub.doi && (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="btn-doi">Link</a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

/* ── Main ResearchSection ── */
const ResearchSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const tab = isValidResearchTab(rawTab) ? rawTab : 'areas'

  const setResearchTab = (key) => {
    if (!isValidResearchTab(key)) return
    if (key === 'areas') {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ tab: key }, { replace: true })
    }
  }

  const { data: areas  = [], isLoading: loadAreas,  isError: errAreas  } = useResearchAreas()
  const { data: awards = [], isLoading: loadAwards, isError: errAwards } = useAwards()
  const { data: grants = [], isLoading: loadGrants, isError: errGrants } = useGrants()

  const tabs = [
    { key: 'areas',        label: 'Research Areas' },
    { key: 'publications', label: 'Publications' },
    { key: 'ip',           label: 'Patents & Copyrights' },
    { key: 'awards',       label: 'Awards & Recognitions' },
    { key: 'grants',       label: 'Funded Projects' },
  ]

  return (
    <section id="research" className="section section--alt">
      <div className="container">
        <SectionHeader title="Research" subtitle="Scholarly Work" />

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`tab-btn ${tab === t.key ? 'tab-btn--active' : ''}`}
              onClick={() => setResearchTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'areas' && (
          <motion.div
            key="areas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 'var(--space-8)' }}
          >
            {loadAreas && <LoadingSkeleton count={4} />}
            {errAreas  && <ErrorState message="Failed to load research areas. Please try again later." />}
            {!loadAreas && !errAreas && areas.length === 0 && (
              <EmptyState message="No research areas listed yet." />
            )}
            {!loadAreas && !errAreas && areas.length > 0 && (
              <div className="research-areas-grid">
                {areas.map((area) => (
                  <div key={area.id} className="research-area-card">
                    <div className="research-area-icon">{area.icon || '🔬'}</div>
                    <div className="research-area-name">{area.name}</div>
                    {area.description && (
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', textAlign: 'center' }}>
                        {area.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'publications' && (
          <motion.div key="publications" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PublicationsTab />
          </motion.div>
        )}

        {tab === 'ip' && (
          <motion.div key="ip" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PatentsCopyrightsPanel />
          </motion.div>
        )}

        {tab === 'awards' && (
          <motion.div key="awards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadAwards && <LoadingSkeleton count={3} />}
            {errAwards  && <ErrorState message="Failed to load awards. Please try again later." />}
            {!loadAwards && !errAwards && awards.length === 0 && (
              <EmptyState message="No awards or recognitions listed yet." />
            )}
            {!loadAwards && !errAwards && awards.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                {awards.map((award) => (
                  <div key={award.id} className="pub-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span className="badge badge--gold">🏆 {award.award_type || 'Award'}</span>
                      {award.year && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{award.year}</span>}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>{award.title}</h4>
                    {award.awarding_body && (
                      <p style={{ color: 'var(--color-accent)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                        {award.awarding_body}
                      </p>
                    )}
                    {award.description && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{award.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'grants' && (
          <motion.div key="grants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadGrants && <LoadingSkeleton count={3} />}
            {errGrants  && <ErrorState message="Failed to load funded projects. Please try again later." />}
            {!loadGrants && !errGrants && grants.length === 0 && (
              <EmptyState message="No funded projects listed yet." />
            )}
            {!loadGrants && !errGrants && grants.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {grants.map((grant) => (
                  <div key={grant.id} className="pub-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)' }}>{grant.title}</h4>
                      <span className={`badge ${grant.status === 'ongoing' ? 'badge--green' : 'badge--blue'}`}>
                        {grant.status || 'completed'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                      {grant.funding_agency}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      {grant.amount && <span>Amount: ₹{Number(grant.amount).toLocaleString('en-IN')}</span>}
                      {grant.start_date && (
                        <span>
                          {formatDate(grant.start_date)} – {grant.end_date ? formatDate(grant.end_date) : 'Ongoing'}
                        </span>
                      )}
                    </div>
                    {grant.description && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
                        {grant.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ResearchSection
