import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * MT-43: ErrorBoundary — catches runtime errors in React component tree.
 * Wrap <App> or individual page-level components to prevent full white-screen crashes.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="login-page" style={{ background: 'var(--color-bg)' }}>
          <div className="glass-panel section-panel" style={{ maxWidth: 520, textAlign: 'center' }}>
            <AlertTriangle size={40} strokeWidth={1.75} color="var(--color-warn)" aria-hidden style={{ marginBottom: 'var(--space-4)' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>
              Something went wrong
            </h1>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.65 }}>
              An unexpected error occurred. Try refreshing the page.
            </p>
            {import.meta.env.DEV && (
              <pre
                className="surface-elevated"
                style={{
                  padding: 'var(--space-4)',
                  fontSize: 'var(--font-size-xs)',
                  textAlign: 'left',
                  maxWidth: 640,
                  overflow: 'auto',
                  color: 'var(--color-danger)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {this.state.error?.toString()}
              </pre>
            )}
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Refresh page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
