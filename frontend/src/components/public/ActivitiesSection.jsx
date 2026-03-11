import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useActivities, useMemberships } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'

const SECTIONS = [
  { key: 'fdp_attended',       label: 'FDP / Training Attended' },
  { key: 'workshop_organized', label: 'Workshops / Seminars Organized' },
  { key: 'guest_lecture',      label: 'Guest Lectures / Expert Talks' },
  { key: 'judge_mentor',       label: 'Judge / Mentor / Coordinator' },
  { key: 'reviewer',           label: 'Reviewer / Editor' },
]

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <ChevronDown size={20} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="accordion-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ActivitiesSection = () => {
  const { data: activities  = [] } = useActivities()
  const { data: memberships = [] } = useMemberships()

  const byType = (type) => activities.filter((a) => a.activity_type === type)

  return (
    <section id="activities" className="section section--alt">
      <div className="container">
        <SectionHeader title="Activities" subtitle="Professional Engagement" />

        <div className="accordion">
          {SECTIONS.map(({ key, label }) => {
            const group = byType(key)
            if (group.length === 0) return null
            return (
              <Accordion key={key} title={`${label} (${group.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {group.map((a) => (
                    <div key={a.id} className="pub-card" style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                        <p style={{ fontWeight: 600 }}>{a.title}</p>
                        {a.year && <span className="badge badge--blue">{a.year}</span>}
                      </div>
                      {a.organizer  && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{a.organizer}</p>}
                      {a.venue      && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{a.venue}</p>}
                      {a.duration   && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Duration: {a.duration}</p>}
                      {a.role       && <span className="badge badge--green" style={{ marginTop: 'var(--space-2)', display: 'inline-block' }}>{a.role}</span>}
                    </div>
                  ))}
                </div>
              </Accordion>
            )
          })}

          {memberships.length > 0 && (
            <Accordion title={`Professional Memberships (${memberships.length})`}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                {memberships.map((m) => (
                  <div key={m.id} className="pub-card" style={{ padding: 'var(--space-4)' }}>
                    <p style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{m.organization}</p>
                    {m.membership_type && <p style={{ color: 'var(--color-accent)', fontSize: 'var(--font-size-sm)' }}>{m.membership_type}</p>}
                    {m.membership_id   && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>ID: {m.membership_id}</p>}
                    {m.year_joined     && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Since: {m.year_joined}</p>}
                  </div>
                ))}
              </div>
            </Accordion>
          )}
        </div>
      </div>
    </section>
  )
}

export default ActivitiesSection
