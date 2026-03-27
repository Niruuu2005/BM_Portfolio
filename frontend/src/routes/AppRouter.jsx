import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout       from '@/components/layout/PublicLayout'
import HomePage          from '@/pages/public/HomePage'
import EducationPage     from '@/pages/public/EducationPage'
import ResearchPage      from '@/pages/public/ResearchPage'
import TeachingPage      from '@/pages/public/TeachingPage'
import ProjectsPage      from '@/pages/public/ProjectsPage'
import ContactPage       from '@/pages/public/ContactPage'
import LoginPage         from '@/pages/admin/LoginPage'
import DashboardPage     from '@/pages/admin/DashboardPage'
import ProfilePage       from '@/pages/admin/ProfilePage'
import AdminEducation    from '@/pages/admin/EducationPage'
import AdminExperience   from '@/pages/admin/ExperiencePage'
import AdminPublications from '@/pages/admin/PublicationsPage'
import AdminPatents      from '@/pages/admin/PatentsPage'
import AdminTeaching     from '@/pages/admin/TeachingPage'
import AdminActivities   from '@/pages/admin/ActivitiesPage'
import AdminResearch     from '@/pages/admin/ResearchPage'
import AdminAwards       from '@/pages/admin/AwardsPage'
import AdminGrants       from '@/pages/admin/GrantsPage'
import AdminCopyrights   from '@/pages/admin/CopyrightsPage'
import AdminMemberships  from '@/pages/admin/MembershipsPage'
import AdminProjects     from '@/pages/admin/ProjectsPage'
import AdminRoles        from '@/pages/admin/AdminRolesPage'
import NotFoundPage      from '@/pages/public/NotFoundPage'
import ProtectedRoute    from './ProtectedRoute'
import AdminShell        from './AdminShell'

const AppRouter = () => (
  <Routes>
    {/* PUBLIC — all wrapped in shared Navbar + Footer */}
    <Route element={<PublicLayout />}>
      <Route path="/"            element={<HomePage />} />
      <Route path="/education"   element={<EducationPage />} />
      <Route path="/research"    element={<ResearchPage />} />
      <Route path="/teaching"    element={<TeachingPage />} />
      <Route path="/projects"    element={<ProjectsPage />} />
      <Route path="/contact"     element={<ContactPage />} />
      {/* Legacy public URLs → consolidated nav / Research hub */}
      <Route path="/about"        element={<Navigate to="/" replace />} />
      <Route path="/experience"   element={<Navigate to="/" replace />} />
      <Route path="/activities"   element={<Navigate to="/" replace />} />
      <Route path="/publications" element={<Navigate to="/research?tab=publications" replace />} />
      <Route path="/patents"      element={<Navigate to="/research?tab=ip" replace />} />
    </Route>

    {/* ADMIN — login */}
    <Route path="/admin/login" element={<LoginPage />} />

    {/* ADMIN — protected + sidebar shell */}
    <Route path="/admin" element={<ProtectedRoute />}>
      <Route element={<AdminShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />} />
        <Route path="profile"      element={<ProfilePage />} />
        <Route path="education"    element={<AdminEducation />} />
        <Route path="experience"   element={<AdminExperience />} />
        <Route path="publications" element={<AdminPublications />} />
        <Route path="patents"      element={<AdminPatents />} />
        <Route path="teaching"     element={<AdminTeaching />} />
        <Route path="activities"   element={<AdminActivities />} />
        <Route path="research"     element={<AdminResearch />} />
        <Route path="awards"       element={<AdminAwards />} />
        <Route path="grants"       element={<AdminGrants />} />
        <Route path="copyrights"   element={<AdminCopyrights />} />
        <Route path="memberships"  element={<AdminMemberships />} />
        <Route path="projects"     element={<AdminProjects />} />
        <Route path="admin-roles"  element={<AdminRoles />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default AppRouter
