import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Microscope,
  BookOpen,
  Lightbulb,
  Copyright,
  Trophy,
  Banknote,
  School,
  FolderKanban,
  Wrench,
  Users,
  KeyRound,
  Globe,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const ICON = 18

const NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',        Icon: LayoutDashboard },
  { to: '/admin/profile',      label: 'Profile',          Icon: User },
  { to: '/admin/education',    label: 'Education',        Icon: GraduationCap },
  { to: '/admin/experience',   label: 'Experience',       Icon: Briefcase },
  { to: '/admin/research',     label: 'Research areas',   Icon: Microscope },
  { to: '/admin/publications', label: 'Publications',     Icon: BookOpen },
  { to: '/admin/patents',      label: 'Patents',          Icon: Lightbulb },
  { to: '/admin/copyrights',   label: 'Copyrights',       Icon: Copyright },
  { to: '/admin/awards',       label: 'Awards',           Icon: Trophy },
  { to: '/admin/grants',       label: 'Grants',           Icon: Banknote },
  { to: '/admin/teaching',     label: 'Teaching',         Icon: School },
  { to: '/admin/projects',     label: 'Projects guided',  Icon: FolderKanban },
  { to: '/admin/activities',   label: 'Activities',       Icon: Wrench },
  { to: '/admin/memberships',  label: 'Memberships',      Icon: Users },
  { to: '/admin/admin-roles',  label: 'Admin roles',      Icon: KeyRound },
]

const AdminLayout = ({ title, children }) => {
  const { signOut, user, adminRole } = useAuth()
  const navigate = useNavigate()

  const navItems = adminRole === 'editor' ? NAV.filter((item) => item.to === '/admin/teaching') : NAV

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="sidebar-brand">
          <h2>Portfolio admin</h2>
          <p className="sidebar-brand__email">{user?.email ?? 'Signed in'}</p>
          {adminRole === 'editor' && (
            <p className="sidebar-brand__email" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>
              Teaching editor
            </p>
          )}
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const IconEl = item.Icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <IconEl size={ICON} strokeWidth={2} aria-hidden />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-nav-item" style={{ marginBottom: 'var(--space-2)' }}>
            <Globe size={ICON} strokeWidth={2} aria-hidden />
            View public site
          </a>
          <button type="button" className="btn btn-outline btn-full admin-logout" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={2} aria-hidden />
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{title}</h1>
            <p className="admin-topbar__subtitle text-muted">
              {adminRole === 'editor' ? 'Manage subjects, study materials, and guided projects' : 'Manage portfolio content and visibility'}
            </p>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
