import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { FileQuestion } from 'lucide-react'

/** MT-63: 404 Not Found page */
const NotFoundPage = () => (
  <section className="public-main" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
    <Motion.div
      className="glass-panel section-panel"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: 480 }}
    >
      <FileQuestion size={48} strokeWidth={1.5} color="var(--color-accent)" aria-hidden style={{ margin: '0 auto var(--space-4)' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
        Page not found
      </h1>
      <p className="text-muted" style={{ marginBottom: 'var(--space-8)', lineHeight: 1.65 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </Motion.div>
  </section>
)

export default NotFoundPage
