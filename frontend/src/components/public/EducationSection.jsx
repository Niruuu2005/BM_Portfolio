import { motion } from 'framer-motion'
import { useEducation } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

const EducationSection = () => {
  const { data: items = [], isLoading, isError } = useEducation()

  return (
    <section id="education" className="section section--alt">
      <div className="container">
        <SectionHeader title="Education" subtitle="Academic Background" />

        {isLoading && <LoadingSkeleton count={3} />}

        {isError && (
          <p style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
            Failed to load education records. Please try again later.
          </p>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No education records found.
          </p>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <div className="timeline">
            {items.map((edu, idx) => (
              <motion.div
                key={edu.id}
                className="timeline-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)' }}>{edu.degree}</h3>
                    <span className="badge badge--blue">
                      {edu.start_year}
                      {edu.is_pursuing
                        ? ' – Present'
                        : edu.end_year
                          ? ` – ${edu.end_year}`
                          : ' – Present'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    {edu.field_of_study}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: edu.grade ? 'var(--space-1)' : 0 }}>
                    {edu.institution}
                    {edu.university ? ` — ${edu.university}` : ''}
                  </p>
                  {edu.grade && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                      Grade / CGPA: {edu.grade}
                    </p>
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

export default EducationSection
