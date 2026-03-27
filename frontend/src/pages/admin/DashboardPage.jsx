import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { apiAdmin } from '@/lib/api'
import { BookOpen, Award, Briefcase, GraduationCap, FileText, Lightbulb, Trophy, FlaskConical, FolderOpen, BookMarked } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const STATS = [
  { key: 'publications', label: 'Publications', icon: BookOpen, color: '#3B82F6' },
  { key: 'patents', label: 'Patents', icon: Lightbulb, color: '#F59E0B' },
  { key: 'education', label: 'Degrees', icon: GraduationCap, color: '#10B981' },
  { key: 'experience', label: 'Positions', icon: Briefcase, color: '#8B5CF6' },
  { key: 'awards', label: 'Awards', icon: Award, color: '#EF4444' },
  { key: 'activities', label: 'Activities', icon: FileText, color: '#06B6D4' },
  { key: 'research_grants', label: 'Grants', icon: Trophy, color: '#84CC16' },
  { key: 'projects_guided', label: 'Projects', icon: FolderOpen, color: '#F97316' },
  { key: 'copyrights', label: 'Copyrights', icon: BookMarked, color: '#A855F7' },
  { key: 'research_areas', label: 'Research Areas', icon: FlaskConical, color: '#14B8A6' },
]

const QUICK_LINKS = [
  { to: '/admin/profile', label: '👤 Profile' },
  { to: '/admin/education', label: '🎓 Education' },
  { to: '/admin/experience', label: '💼 Experience' },
  { to: '/admin/research', label: '🔬 Research areas' },
  { to: '/admin/publications', label: '📖 Publications' },
  { to: '/admin/patents', label: '💡 Patents' },
  { to: '/admin/copyrights', label: '©️ Copyrights' },
  { to: '/admin/awards', label: '🏆 Awards' },
  { to: '/admin/grants', label: '💰 Grants' },
  { to: '/admin/teaching', label: '🏫 Teaching' },
  { to: '/admin/projects', label: '📁 Projects guided' },
  { to: '/admin/activities', label: '🛠️ Activities' },
  { to: '/admin/memberships', label: '🤝 Memberships' },
  { to: '/admin/admin-roles', label: '🔑 Admin roles' },
]

const DashboardPage = () => {
  const { accessToken } = useAuth()
  const { data: counts = {}, isLoading } = useQuery({
    queryKey: ['admin-stats-counts'],
    enabled: !!accessToken,
    queryFn: () => apiAdmin('/api/admin/stats/counts', { token: accessToken }),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-8)' }}>
        Dashboard
      </h1>

      <div className="stats-grid">
        {STATS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="stats-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div style={{ background: color + '22', borderRadius: 'var(--radius-md)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            <div className="stats-card-value">{isLoading ? '…' : (counts[key] ?? '—')}</div>
            <div className="stats-card-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-10)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)', color: 'var(--color-text)' }}>
          Quick Navigation
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
          {QUICK_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={{ display: 'block', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)', textDecoration: 'none' }}
              className="sidebar-nav-item"
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
