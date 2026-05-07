import { useQuery } from '@tanstack/react-query'
import { getIndustries } from '@/lib/api/mentors'

export function useIndustries() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: getIndustries,
  })
}
