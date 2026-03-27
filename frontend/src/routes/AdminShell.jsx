import { Outlet, useLocation } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

const TITLE_BY_PATH = {
  '/admin/dashboard':    'Dashboard',
  '/admin/profile':      'Profile',
  '/admin/education':    'Education',
  '/admin/experience':   'Experience',
  '/admin/research':     'Research',
  '/admin/publications': 'Publications',
  '/admin/patents':      'Patents',
  '/admin/teaching':     'Teaching',
  '/admin/activities':   'Activities',
  '/admin/awards':       'Awards',
  '/admin/grants':       'Research Grants',
  '/admin/copyrights':   'Copyrights',
  '/admin/memberships':  'Memberships',
  '/admin/projects':     'Projects Guided',
  '/admin/admin-roles':  'Admin Roles',
}

const AdminShell = () => {
  const { pathname } = useLocation()
  const title = TITLE_BY_PATH[pathname] ?? 'Admin'

  return (
    <AdminLayout title={title}>
      <Outlet />
    </AdminLayout>
  )
}

export default AdminShell
