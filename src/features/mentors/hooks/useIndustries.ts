import { useQuery } from '@tanstack/react-query'
import { getIndustries } from '../api/mentor.api'

export function useIndustries() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: getIndustries,
  })
}
