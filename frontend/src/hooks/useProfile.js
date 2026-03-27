import { useQuery } from '@tanstack/react-query'
import { apiPublic } from '@/lib/api'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: async () => apiPublic('/api/public/profile'),
  })
