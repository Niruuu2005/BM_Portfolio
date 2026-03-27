import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MoonStar, SunMedium } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Education',  to: '/education' },
  { label: 'Teaching',   to: '/teaching' },
  { label: 'Research',   to: '/research' },
  { label: 'Projects',   to: '/projects' },
]

const Navbar = ({
  brandName = 'Mrs. B. Mahalakshmi',
  brandTitle = 'Assistant Professor & Researcher',
  theme = 'light',
  onToggleTheme,
}) => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <div className="navbar__brand">
          <Link to="/">
            <span className="brand-name">{brandName}</span>
            <span className="brand-title">{brandTitle}</span>
          </Link>
        </div>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span className="theme-toggle__icon">
            {theme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
          </span>
          <span className="theme-toggle__label">{theme === 'light' ? 'Dark' : 'Light'} mode</span>
        </button>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile-menu">
          <button
            type="button"
            className="theme-toggle theme-toggle--mobile"
            onClick={onToggleTheme}
          >
            <span className="theme-toggle__icon">
              {theme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
            </span>
            <span className="theme-toggle__label">Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
          </button>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
