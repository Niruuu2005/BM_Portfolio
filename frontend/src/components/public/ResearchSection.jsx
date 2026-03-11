import { useState } from 'react'
import { motion } from 'framer-motion'
import { useResearchAreas, useAwards, useGrants } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'
import { formatDate } from '@/lib/utils'

const ResearchSection = () => {
  const { data: areas  = [] } = useResearchAreas()
  const { data: awards = [] } = useAwards()
  const { data: grants = [] } = useGrants()
  const [tab, setTab] = useState('areas')

  const tabs = [
    { key: 'areas',  label: 'Research Areas' },
    { key: 'awards', label: 'Awards & Recognitions' },
    { key: 'grants', label: 'Funded Projects' },
  ]

  return (
    <section id="research" className="section section--alt">
      <div className="container">
        <SectionHeader title="Research" subtitle="Scholarly Work" />

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${tab === t.key ? 'tab-btn--active' : ''}`}
              onClick={() => setTab(t.key)}
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
            className="research-areas-grid"
            style={{ marginTop: 'var(--space-8)' }}
          >
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
          </motion.div>
        )}

        {tab === 'awards' && (
          <motion.div key="awards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
              {awards.map((award) => (
                <div key={award.id} className="pub-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge--yellow">🏆 {award.award_type || 'Award'}</span>
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
          </motion.div>
        )}

        {tab === 'grants' && (
          <motion.div key="grants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-8)' }}>
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
                    {grant.start_date && <span>{formatDate(grant.start_date)} – {grant.end_date ? formatDate(grant.end_date) : 'Ongoing'}</span>}
                  </div>
                  {grant.description && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>{grant.description}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ResearchSection
