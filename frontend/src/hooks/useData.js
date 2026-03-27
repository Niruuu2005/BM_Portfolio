import { useQuery } from '@tanstack/react-query'
import { apiPublic } from '@/lib/api'

const PATH = {
  education: '/api/public/education',
  experience: '/api/public/experience',
  research_areas: '/api/public/research_areas',
  awards: '/api/public/awards',
  research_grants: '/api/public/research_grants',
  patents: '/api/public/patents',
  copyrights: '/api/public/copyrights',
  activities: '/api/public/activities',
  memberships: '/api/public/memberships',
  subjects_taught: '/api/public/subjects_taught',
  study_materials: '/api/public/study_materials',
  projects_guided: '/api/public/projects_guided',
  admin_roles: '/api/public/admin_roles',
  programs: '/api/public/programs',
  courses: '/api/public/courses',
  assessments: '/api/public/assessments',
}

const makeHook = (key) => () =>
  useQuery({
    queryKey: [key],
    queryFn: async () => {
      const data = await apiPublic(PATH[key])
      return data ?? []
    },
    staleTime: 1000 * 60 * 5,
  })

export const useEducation = makeHook('education')
export const useExperience = makeHook('experience')
export const useResearchAreas = makeHook('research_areas')
export const useAwards = makeHook('awards')
export const useGrants = makeHook('research_grants')
export const usePatents = makeHook('patents')
export const useCopyrights = makeHook('copyrights')
export const useActivities = makeHook('activities')
export const useMemberships = makeHook('memberships')
export const useSubjectsTaught = makeHook('subjects_taught')
export const useStudyMaterials = makeHook('study_materials')
export const useProjects = makeHook('projects_guided')
export const useAdminRoles = makeHook('admin_roles')
export const usePrograms = makeHook('programs')
export const useCourses = makeHook('courses')
export const useAssessments = makeHook('assessments')
