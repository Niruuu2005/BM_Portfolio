import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  { label: 'Publications', to: '/publications' },
  { label: 'Patents',      to: '/patents' },
  { label: 'Teaching',     to: '/teaching' },
  { label: 'Contact',      to: '/contact' },
]

const Footer = ({ name = 'Mrs. B. Mahalakshmi', institution = 'PCCOE, Pune' }) => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>{name}</h3>
            <p>Assistant Professor, Department of Computer Engineering<br />{institution}</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Admin</h4>
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
