import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profile').select('*').single()
      if (error) throw error
      return data
    },
  })
