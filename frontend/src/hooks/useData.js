import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const q = (table, opts = {}) => () =>
  useQuery({
    queryKey: [table, opts],
    queryFn: async () => {
      let req = supabase.from(table).select('*')
      if (opts.visibleOnly) req = req.eq('is_visible', true)
      if (opts.order)       req = req.order(opts.order[0], { ascending: opts.order[1] ?? false })
      const { data, error } = await req
      if (error) throw error
      return data ?? []
    },
  })

export const useEducation    = q('education',       { visibleOnly: true,  order: ['sort_order', true] })
export const useExperience   = q('experience',      { visibleOnly: true,  order: ['sort_order', true] })
export const useResearchAreas= q('research_areas',  { visibleOnly: true,  order: ['sort_order', true] })
export const useAwards       = q('awards',          { visibleOnly: true,  order: ['year', false] })
export const useGrants       = q('research_grants', { visibleOnly: true,  order: ['start_date', false] })
export const usePatents      = q('patents',         { visibleOnly: true,  order: ['year', false] })
export const useCopyrights   = q('copyrights',      { visibleOnly: true,  order: ['year', false] })
export const useActivities   = q('activities',      { visibleOnly: true,  order: ['year', false] })
export const useMemberships  = q('memberships',     { visibleOnly: true,  order: ['year_joined', false] })
export const useSubjectsTaught=q('subjects_taught', { visibleOnly: true,  order: ['level', true] })
export const useStudyMaterials=q('study_materials', { visibleOnly: true,  order: ['year', false] })
export const useProjects     = q('projects_guided', { visibleOnly: true,  order: ['year', false] })
export const useAdminRoles   = q('admin_roles',     { visibleOnly: true,  order: ['year_from', false] })
