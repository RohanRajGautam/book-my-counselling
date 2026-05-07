import { useQuery } from '@tanstack/react-query'
import { getMentors } from '@/lib/api/mentors'
import { FilterState } from '@/types/filter.types'

export function useMentors(filters: FilterState) {
  return useQuery({
    queryKey: ['mentors', filters],
    queryFn: () => getMentors(filters),
  })
}
