import { getIndustries } from '@/features/industries/api/industries.api'
import { useQuery } from '@tanstack/react-query'
import { Industry } from '../types/industries.types'

export function useIndustries() {
  return useQuery<Industry[]>({
    queryKey: ['industries'],
    queryFn: getIndustries,
  })
}
