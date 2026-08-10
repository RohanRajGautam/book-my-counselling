import { useQuery } from '@tanstack/react-query'
import { getMyStats } from '../api/mentor-dashboard.api'

export const MENTOR_STATS_KEY = ['mentor', 'stats'] as const

export function useMentorStats() {
  return useQuery({
    queryKey: MENTOR_STATS_KEY,
    queryFn: getMyStats,
    staleTime: 60 * 1000,
  })
}
