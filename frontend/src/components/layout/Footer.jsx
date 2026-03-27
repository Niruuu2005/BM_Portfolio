import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Education',  to: '/education' },
  { label: 'Teaching',   to: '/teaching' },
  { label: 'Research',   to: '/research' },
  { label: 'Projects',   to: '/projects' },
]

const Footer = ({ name = 'Mrs. B. Mahalakshmi', institution = 'PCCOE, Pune' }) => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand glass-panel section-panel">
            <h3>{name}</h3>
            <p className="prose-academic" style={{ margin: 0 }}>
              Assistant Professor, Department of Computer Engineering
              <br />
              {institution}
            </p>
          </div>
          <div className="footer-col glass-panel section-panel">
            <h4>Explore</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col glass-panel section-panel">
            <h4>Site tools</h4>
            <ul className="footer-links">
              <li><a href="/admin/login">Admin Login</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} {name}. All rights reserved.</p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {institution}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
