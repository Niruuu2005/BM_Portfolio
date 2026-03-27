import { useQuery } from '@tanstack/react-query'
import { apiPublic } from '@/lib/api'

export const usePublications = (type = null) =>
  useQuery({
    queryKey: ['publications', type],
    queryFn: async () => {
      const q = type ? `?pub_type=${encodeURIComponent(type)}` : ''
      const data = await apiPublic(`/api/public/publications${q}`)
      return data ?? []
    },
  })

export const useAllPublications = () =>
  useQuery({
    queryKey: ['publications', 'all'],
    queryFn: async () => {
      const data = await apiPublic('/api/public/publications')
      return data ?? []
    },
  })
