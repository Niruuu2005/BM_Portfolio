import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',     icon: '📊' },
  { to: '/admin/profile',      label: 'Profile',       icon: '👤' },
  { to: '/admin/education',    label: 'Education',     icon: '🎓' },
  { to: '/admin/experience',   label: 'Experience',    icon: '💼' },
  { to: '/admin/research',     label: 'Research',      icon: '🔬' },
  { to: '/admin/publications', label: 'Publications',  icon: '📖' },
  { to: '/admin/patents',      label: 'Patents',       icon: '💡' },
  { to: '/admin/teaching',     label: 'Teaching',      icon: '🏫' },
  { to: '/admin/activities',   label: 'Activities',    icon: '🛠️' },
]

const AdminLayout = ({ title, children }) => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Admin Panel</h2>
          <p>{user?.email}</p>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-nav-item" style={{ marginBottom: 'var(--space-2)' }}>
            <span>🌐</span> View Site
          </a>
          <button className="btn btn-outline btn-full" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{title}</h1>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
