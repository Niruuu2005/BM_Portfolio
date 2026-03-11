import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const usePublications = (type = null) =>
  useQuery({
    queryKey: ['publications', type],
    queryFn: async () => {
      let q = supabase.from('publications').select('*').eq('is_visible', true).order('year', { ascending: false })
      if (type) q = q.eq('pub_type', type)
      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
  })

export const useAllPublications = () =>
  useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('publications').select('*').order('year', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
