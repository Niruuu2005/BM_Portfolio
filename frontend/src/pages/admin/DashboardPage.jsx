import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { BookOpen, Award, Briefcase, GraduationCap, FileText, Lightbulb } from 'lucide-react'

const countTable = (table) => async () => {
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
  return count ?? 0
}

const STATS = [
  { key: 'publications', table: 'publications', label: 'Publications',  icon: BookOpen,     color: '#3B82F6' },
  { key: 'patents',      table: 'patents',      label: 'Patents',       icon: Lightbulb,    color: '#F59E0B' },
  { key: 'education',    table: 'education',    label: 'Degrees',       icon: GraduationCap, color: '#10B981' },
  { key: 'experience',   table: 'experience',   label: 'Positions',     icon: Briefcase,    color: '#8B5CF6' },
  { key: 'awards',       table: 'awards',       label: 'Awards',        icon: Award,        color: '#EF4444' },
  { key: 'activities',   table: 'activities',   label: 'Activities',    icon: FileText,     color: '#06B6D4' },
]

const DashboardPage = () => {
  const counts = STATS.map(({ key, table }) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({ key, table, count: useQuery({ queryKey: [table, 'count'], queryFn: countTable(table) }).data ?? 0 })
  )

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-8)' }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
        {STATS.map(({ key, label, icon: Icon, color }) => {
          const stat = counts.find((c) => c.key === key)
          return (
            <div key={key} className="stat-card">
              <div className="stat-card__icon" style={{ background: color + '22' }}>
                <Icon size={24} color={color} />
              </div>
              <div className="stat-card__value">{stat?.count}</div>
              <div className="stat-card__label">{label}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 'var(--space-10)', color: 'var(--color-text-muted)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)' }}>Quick Start</h2>
        <p>Use the sidebar to manage your portfolio content. Changes are reflected on the public site immediately.</p>
      </div>
    </div>
  )
}

export default DashboardPage
