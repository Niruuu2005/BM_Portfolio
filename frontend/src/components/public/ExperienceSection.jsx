import { motion } from 'framer-motion'
import { useExperience } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'
import { formatYear } from '@/lib/utils'

const ExperienceSection = () => {
  const { data: items = [], isLoading } = useExperience()

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeader title="Experience" subtitle="Professional Journey" />

        {isLoading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</p>
        ) : (
          <div className="timeline">
            {items.map((exp, idx) => (
              <motion.div
                key={exp.id}
                className="timeline-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="timeline-dot" style={exp.is_current ? { background: 'var(--color-accent)' } : {}} />
                <div className="timeline-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)' }}>{exp.role}</h3>
                    <span className={`badge ${exp.is_current ? 'badge--green' : 'badge--blue'}`}>
                      {formatYear(exp.start_date)}
                      {exp.is_current ? ' – Present' : exp.end_date ? ` – ${formatYear(exp.end_date)}` : ''}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    {exp.organization}
                  </p>
                  {exp.department && (
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      {exp.department}
                    </p>
                  )}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-5)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                      {(Array.isArray(exp.responsibilities) ? exp.responsibilities : [exp.responsibilities]).map((r, i) => (
                        <li key={i} style={{ marginBottom: 'var(--space-1)' }}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ExperienceSection
