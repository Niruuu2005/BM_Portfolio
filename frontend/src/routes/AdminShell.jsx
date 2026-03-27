import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import Spinner from '@/components/shared/Spinner'
import { useAuth } from '@/context/AuthContext'

const TITLE_BY_PATH = {
  '/admin/dashboard': 'Dashboard',
  '/admin/profile': 'Profile',
  '/admin/education': 'Education',
  '/admin/experience': 'Experience',
  '/admin/research': 'Research',
  '/admin/publications': 'Publications',
  '/admin/patents': 'Patents',
  '/admin/teaching': 'Teaching',
  '/admin/activities': 'Activities',
  '/admin/awards': 'Awards',
  '/admin/grants': 'Research Grants',
  '/admin/copyrights': 'Copyrights',
  '/admin/memberships': 'Memberships',
  '/admin/projects': 'Projects Guided',
  '/admin/admin-roles': 'Admin Roles',
}

const AdminShell = () => {
  const { pathname } = useLocation()
  const { adminRole, adminMeReady } = useAuth()

  if (!adminMeReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!adminRole) {
    return <Navigate to="/admin/login" replace />
  }

  const isTeachingPath = pathname === '/admin/teaching' || pathname.startsWith('/admin/teaching/')
  if (adminRole === 'editor' && !isTeachingPath) {
    return <Navigate to="/admin/teaching" replace />
  }

  const title = TITLE_BY_PATH[pathname] ?? 'Admin'

  return (
    <AdminLayout title={title}>
      <Outlet />
    </AdminLayout>
  )
}

export default AdminShell
