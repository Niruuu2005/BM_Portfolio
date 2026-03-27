import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePatents, useCopyrights } from '@/hooks/useData'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

const STATUS_BADGE = {
  granted:   'badge--green',
  published: 'badge--blue',
  filed:     'badge--yellow',
}

const ErrorLine = ({ message }) => (
  <p style={{ textAlign: 'center', color: 'var(--color-danger)', padding: 'var(--space-8) 0' }}>{message}</p>
)

/**
 * Patents + Copyrights sub-tabs (no SectionHeader). Used on Research page and standalone Patents page.
 */
const PatentsCopyrightsPanel = () => {
  const [subTab, setSubTab] = useState('patents')
  const {
    data: patents = [],
    isLoading: loadP,
    isError: errP,
  } = usePatents()
  const {
    data: copyrights = [],
    isLoading: loadC,
    isError: errC,
  } = useCopyrights()

  return (
    <div style={{ marginTop: 'var(--space-8)' }}>
      <div className="tabs">
        <button
          type="button"
          className={`tab-btn ${subTab === 'patents' ? 'tab-btn--active' : ''}`}
          onClick={() => setSubTab('patents')}
        >
          Patents
        </button>
        <button
          type="button"
          className={`tab-btn ${subTab === 'copyrights' ? 'tab-btn--active' : ''}`}
          onClick={() => setSubTab('copyrights')}
        >
          Copyrights
        </button>
      </div>

      {subTab === 'patents' && (
        <motion.div key="patents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
          {loadP && <LoadingSkeleton count={3} />}
          {errP && <ErrorLine message="Failed to load patents. Please try again later." />}
          {!loadP && !errP && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {patents.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8) 0' }}>
                  No patents listed yet.
                </p>
              )}
              {patents.map((p, idx) => (
                <div
                  key={p.id}
                  className="pub-card"
                  style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: 'var(--space-4)', alignItems: 'start' }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-xl)',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h4>
                      <span className={`badge ${STATUS_BADGE[p.status] || 'badge--blue'}`}>{p.status}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                      Inventors: {p.inventors}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      {p.application_number && <span>App No: {p.application_number}</span>}
                      {p.patent_number      && <span>Patent No: {p.patent_number}</span>}
                      {p.filing_date        && <span>Filed: {p.filing_date}</span>}
                      {p.grant_date         && <span>Granted: {p.grant_date}</span>}
                      {p.country            && <span>Country: {p.country}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {subTab === 'copyrights' && (
        <motion.div key="copyrights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
          {loadC && <LoadingSkeleton count={3} />}
          {errC && <ErrorLine message="Failed to load copyrights. Please try again later." />}
          {!loadC && !errC && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {copyrights.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8) 0' }}>
                  No copyrights listed yet.
                </p>
              )}
              {copyrights.map((c, idx) => (
                <div
                  key={c.id}
                  className="pub-card"
                  style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: 'var(--space-4)', alignItems: 'start' }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-xl)',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>{c.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                      Authors: {c.authors}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      {c.registration_number && <span>Reg No: {c.registration_number}</span>}
                      {c.registration_date   && <span>Date: {c.registration_date}</span>}
                      {c.work_type           && <span>Type: {c.work_type}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default PatentsCopyrightsPanel
