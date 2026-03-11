# Module — Layout & Navigation

> **Module Goal:** Build the structural shell of the website — the public Navbar (sticky, mobile-responsive, with anchor scroll links), Footer (with profile links and copyright), the Admin Sidebar (with nav links and logout), and Admin Topbar (page title + logout button).

---

## 3.1 Public Navbar

### Behavior
- **Sticky:** Stays at top of viewport when scrolling.
- **Glassmorphism:** Slight blur + transparency after scroll.
- **Active Link:** Highlights based on current scroll position (IntersectionObserver).
- **Mobile:** Hamburger menu, collapsible full-screen overlay nav.
- **Smooth Scroll:** Anchor links scroll to sections.

```jsx
// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home',        href: '#home' },
  { label: 'About',       href: '#about' },
  { label: 'Education',   href: '#education' },
  { label: 'Experience',  href: '#experience' },
  { label: 'Research',    href: '#research' },
  { label: 'Publications',href: '#publications' },
  { label: 'Patents',     href: '#patents' },
  { label: 'Teaching',    href: '#teaching' },
  { label: 'Activities',  href: '#activities' },
  { label: 'Contact',     href: '#contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [activeSection, setActive]  = useState('home')

  // Detect scroll to add glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo / Name */}
        <div className="navbar__brand">
          <a href="#home" onClick={() => handleNavClick('#home')}>
            <span className="brand-name">Dr. Your Name</span>
            <span className="brand-title">Professor & Researcher</span>
          </a>
        </div>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.href.slice(1) ? 'nav-link--active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
```

### Navbar CSS
```css
/* Add to global.css or components.css */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--space-3) 0;
  transition: background var(--transition-base), box-shadow var(--transition-base);
}

.navbar--scrolled {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--color-border);
  padding: var(--space-2) 0;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__brand a {
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.brand-name {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.brand-title {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
}

.nav-link {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover { color: var(--color-text); background: rgba(255,255,255,0.05); }
.nav-link--active { color: var(--color-accent) !important; }

/* Hamburger */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
}

.navbar__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all var(--transition-base);
}

/* Mobile menu */
.navbar__mobile-menu {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.mobile-nav-link {
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  font-weight: 500;
  border-radius: var(--radius-md);
  text-decoration: none;
}

.mobile-nav-link:hover { color: var(--color-accent); background: rgba(59,130,246,0.08); }

/* Responsive */
@media (max-width: 768px) {
  .navbar__links { display: none; }
  .navbar__hamburger { display: flex; }
}
```

---

## 3.2 Footer

```jsx
// src/components/layout/Footer.jsx
const PROFILE_LINKS = [
  { label: 'Google Scholar', href: '#', icon: '🎓' },
  { label: 'Scopus',         href: '#', icon: '📊' },
  { label: 'ORCID',          href: '#', icon: '🔬' },
  { label: 'LinkedIn',       href: '#', icon: '💼' },
  { label: 'ResearchGate',   href: '#', icon: '🔭' },
]

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <h3>Dr. Your Name</h3>
          <p>Associate Professor, Department of Computer Engineering</p>
          <p>Your College, Pune</p>
        </div>

        <div className="footer__links">
          <h4>Academic Profiles</h4>
          <div className="footer__profile-links">
            {PROFILE_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="footer-link">
                <span>{link.icon}</span> {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__quick">
          <h4>Quick Links</h4>
          <div className="footer__profile-links">
            <a href="#publications" className="footer-link">📖 Publications</a>
            <a href="#patents" className="footer-link">💡 Patents</a>
            <a href="#contact" className="footer-link">📬 Contact</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Dr. Your Name. All rights reserved.</p>
          <a href="/admin/login" className="footer-admin-link">Admin</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

### Footer CSS
```css
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-16);
}

.footer__inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-12);
  padding: var(--space-16) var(--space-6);
}

.footer__brand h3 {
  font-family: var(--font-heading);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-2);
}

.footer__brand p { color: var(--color-text-muted); font-size: var(--font-size-sm); line-height: 1.6; }

.footer__links h4, .footer__quick h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.footer__profile-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-link {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.footer-link:hover { color: var(--color-accent); text-decoration: none; }

.footer__bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
}

.footer__bottom .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__bottom p { color: var(--color-text-muted); font-size: var(--font-size-sm); }

.footer-admin-link {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  opacity: 0.4;
  transition: opacity var(--transition-fast);
}

.footer-admin-link:hover { opacity: 1; text-decoration: none; }

@media (max-width: 768px) {
  .footer__inner { grid-template-columns: 1fr; gap: var(--space-8); }
}
```

---

## 3.3 Admin Sidebar

```jsx
// src/components/layout/AdminSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Dashboard',    to: '/admin/dashboard',    icon: '📊' },
  { label: 'Profile',      to: '/admin/profile',      icon: '👤' },
  { label: 'Education',    to: '/admin/education',    icon: '🎓' },
  { label: 'Experience',   to: '/admin/experience',   icon: '💼' },
  { label: 'Publications', to: '/admin/publications', icon: '📖' },
  { label: 'Patents',      to: '/admin/patents',      icon: '💡' },
  { label: 'Teaching',     to: '/admin/teaching',     icon: '🏫' },
  { label: 'Activities',   to: '/admin/activities',   icon: '🛠️' },
]

const AdminSidebar = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out.')
    navigate('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar__brand">
        <span>⚙️</span>
        <div>
          <div className="sidebar__title">Admin Panel</div>
          <div className="sidebar__subtitle">Content Manager</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <a href="/" target="_blank" rel="noreferrer" className="sidebar-ext-link">
          🌐 View Website
        </a>
        <button onClick={handleLogout} className="sidebar-logout-btn">
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
```

### Admin Sidebar CSS
```css
.admin-sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: 1.5rem;
}

.sidebar__title { font-family: var(--font-heading); font-weight: 700; font-size: var(--font-size-base); }
.sidebar__subtitle { font-size: var(--font-size-xs); color: var(--color-text-muted); }

.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.sidebar-link:hover { background: rgba(255,255,255,0.05); color: var(--color-text); text-decoration: none; }
.sidebar-link--active { background: rgba(59,130,246,0.15); color: var(--color-accent); }

.sidebar-icon { font-size: 1rem; width: 1.5rem; text-align: center; }

.sidebar__footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar-ext-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-decoration: none;
}

.sidebar-ext-link:hover { color: var(--color-accent); background: rgba(255,255,255,0.04); text-decoration: none; }

.sidebar-logout-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast);
  width: 100%;
  text-align: left;
}

.sidebar-logout-btn:hover { background: rgba(239,68,68,0.1); }
```

---

## 3.4 Admin Layout Wrapper

Wrap all admin pages in a shared layout that includes the sidebar + main content:

```jsx
// src/components/layout/AdminLayout.jsx
import AdminSidebar from './AdminSidebar'

const AdminLayout = ({ title, children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-page-title">{title}</h1>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
```

```css
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.admin-topbar {
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-8);
  z-index: 100;
}

.admin-page-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.admin-content {
  padding: var(--space-8);
  flex: 1;
}
```

---

## 3.5 Layout Completion Checklist

```
[ ] Navbar.jsx — sticky, glassmorphism, anchor scroll
[ ] Active section detection via IntersectionObserver
[ ] Mobile hamburger works, closes on desktop resize
[ ] Footer.jsx — profile links, quick links, admin hint
[ ] AdminSidebar.jsx — NavLink active state, logout
[ ] AdminLayout.jsx wrapper used in all admin pages
[ ] No layout overflow issues on mobile
```

---

*Frontend Module — Layout & Navigation | v1.0 — March 2026*
