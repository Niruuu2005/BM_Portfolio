import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout       from '@/components/layout/PublicLayout'
import HomePage          from '@/pages/public/HomePage'
import AboutPage         from '@/pages/public/AboutPage'
import EducationPage     from '@/pages/public/EducationPage'
import ExperiencePage    from '@/pages/public/ExperiencePage'
import ResearchPage      from '@/pages/public/ResearchPage'
import PublicationsPage  from '@/pages/public/PublicationsPage'
import PatentsPage       from '@/pages/public/PatentsPage'
import TeachingPage      from '@/pages/public/TeachingPage'
import ActivitiesPage    from '@/pages/public/ActivitiesPage'
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
import ProtectedRoute    from './ProtectedRoute'

const AppRouter = () => (
  <Routes>
    {/* PUBLIC — all wrapped in shared Navbar + Footer */}
    <Route element={<PublicLayout />}>
      <Route path="/"            element={<HomePage />} />
      <Route path="/about"       element={<AboutPage />} />
      <Route path="/education"   element={<EducationPage />} />
      <Route path="/experience"  element={<ExperiencePage />} />
      <Route path="/research"    element={<ResearchPage />} />
      <Route path="/publications" element={<PublicationsPage />} />
      <Route path="/patents"     element={<PatentsPage />} />
      <Route path="/teaching"    element={<TeachingPage />} />
      <Route path="/activities"  element={<ActivitiesPage />} />
      <Route path="/contact"     element={<ContactPage />} />
    </Route>

    {/* ADMIN — login */}
    <Route path="/admin/login" element={<LoginPage />} />

    {/* ADMIN — protected */}
    <Route path="/admin" element={<ProtectedRoute />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard"    element={<DashboardPage />} />
      <Route path="profile"      element={<ProfilePage />} />
      <Route path="education"    element={<AdminEducation />} />
      <Route path="experience"   element={<AdminExperience />} />
      <Route path="publications" element={<AdminPublications />} />
      <Route path="patents"      element={<AdminPatents />} />
      <Route path="teaching"     element={<AdminTeaching />} />
      <Route path="activities"   element={<AdminActivities />} />
      <Route path="research"     element={<AdminResearch />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRouter
