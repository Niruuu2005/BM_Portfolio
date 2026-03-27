import { motion } from 'framer-motion'
import { useProjects } from '@/hooks/useData'
import SectionHeader from '@/components/shared/SectionHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

const parseTech = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  return val.split(',').map((t) => t.trim()).filter(Boolean)
}

const levelLabel = (level) => {
  if (level === 'UG') return 'Undergraduate Projects'
  if (level === 'PG') return 'Postgraduate Projects'
  return `${level} Projects`
}

const ProjectsPage = () => {
  const { data: projects = [], isLoading, isError } = useProjects()

  const grouped = projects.reduce((acc, p) => {
    const key = p.level || 'UG'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <SectionHeader title="Projects Guided" subtitle="Student Work" />

        {isLoading && <LoadingSkeleton count={4} />}

        {isError && (
          <p style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
            Failed to load projects. Please try again later.
          </p>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-12) 0' }}>
            No projects listed yet.
          </p>
        )}

        {!isLoading && !isError && projects.length > 0 && (
          Object.entries(grouped).map(([level, projs], groupIdx) => (
            <div key={level} style={{ marginBottom: 'var(--space-12)' }}>
              <motion.h2
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-2xl)' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: groupIdx * 0.1 }}
              >
                {levelLabel(level)}
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 'var(--space-3)' }}>
                  ({projs.length} project{projs.length !== 1 ? 's' : ''})
                </span>
              </motion.h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {projs.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    className="pub-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)' }}>{p.title}</h4>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {p.level && <span className="badge badge--blue">{p.level}</span>}
                        {p.year  && <span className="badge badge--blue">{p.year}</span>}
                      </div>
                    </div>

                    {p.students && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
                        <strong>Students:</strong> {p.students}
                      </p>
                    )}

                    {p.description && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65, marginBottom: 'var(--space-3)' }}>
                        {p.description}
                      </p>
                    )}

                    {parseTech(p.technologies).length > 0 && (
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        {parseTech(p.technologies).map((tech, i) => (
                          <span key={i} className="badge badge--green">{tech}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default ProjectsPage
