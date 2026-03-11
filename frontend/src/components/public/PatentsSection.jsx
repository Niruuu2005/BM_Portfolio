import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePatents, useCopyrights } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'

const STATUS_BADGE = {
  granted:   'badge--green',
  published: 'badge--blue',
  filed:     'badge--yellow',
}

const PatentsSection = () => {
  const [tab, setTab] = useState('patents')
  const { data: patents     = [], isLoading: loadP } = usePatents()
  const { data: copyrights  = [], isLoading: loadC } = useCopyrights()

  return (
    <section id="patents" className="section section--alt">
      <div className="container">
        <SectionHeader title="Patents & Copyrights" subtitle="Intellectual Property" />

        <div className="tabs">
          <button className={`tab-btn ${tab === 'patents' ? 'tab-btn--active' : ''}`} onClick={() => setTab('patents')}>
            Patents
          </button>
          <button className={`tab-btn ${tab === 'copyrights' ? 'tab-btn--active' : ''}`} onClick={() => setTab('copyrights')}>
            Copyrights
          </button>
        </div>

        {tab === 'patents' && (
          <motion.div key="patents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadP ? <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {patents.map((p, idx) => (
                  <div key={p.id} className="pub-card" style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: 'var(--space-4)', alignItems: 'start' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)' }}>
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
                {patents.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No patents found.</p>}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'copyrights' && (
          <motion.div key="copyrights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            {loadC ? <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {copyrights.map((c, idx) => (
                  <div key={c.id} className="pub-card" style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: 'var(--space-4)', alignItems: 'start' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)' }}>
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
                {copyrights.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No copyrights found.</p>}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default PatentsSection
