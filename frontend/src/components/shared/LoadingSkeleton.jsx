/**
 * MT-115: LoadingSkeleton — reusable skeleton loader for list/card loading states.
 * Usage: <LoadingSkeleton count={3} />
 */
const LoadingSkeleton = ({ count = 3, className = '' }) => (
  <div className={`skeleton-container ${className}`} aria-busy="true" aria-label="Loading content">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="skeleton-card" style={{ marginBottom: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', border: '1px solid var(--color-border)' }}>
        <div className="skeleton skeleton-line" style={{ width: '60%', height: '1.2em' }} />
        <div className="skeleton skeleton-line" style={{ width: '40%', height: '0.9em' }} />
        <div className="skeleton skeleton-line" style={{ width: '80%', height: '0.9em' }} />
        <div className="skeleton skeleton-line" style={{ width: '50%', height: '0.9em' }} />
      </div>
    ))}
  </div>
)

export default LoadingSkeleton
