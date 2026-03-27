import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from '@/components/shared/BackToTop'

const THEME_KEY = 'bm-portfolio-theme'

const PublicLayout = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem(THEME_KEY) || 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="site-shell__orb site-shell__orb--one" />
      <div className="site-shell__orb site-shell__orb--two" />
      <div className="site-shell__orb site-shell__orb--three" />
      <Navbar theme={theme} onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))} />
      <main id="main-content" className="public-main">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default PublicLayout
