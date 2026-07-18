import { useQuery } from '@tanstack/react-query'
import { getAdminStats } from '../api/analytics.api'

export const ADMIN_STATS_KEY = ['admin', 'analytics', 'stats'] as const

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_KEY,
    queryFn: getAdminStats,
    staleTime: 30 * 1000,
  })
}
