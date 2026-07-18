import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminRevenue } from '../api/analytics.api'

export const ADMIN_REVENUE_KEY = ['admin', 'analytics', 'revenue'] as const

export interface UseAdminRevenueParams {
  period?: 'weekly' | 'monthly' | 'yearly' | 'custom'
  /** Required iff `period === 'custom'`. ISO 8601 UTC datetime. */
  startDate?: string
  /** Required iff `period === 'custom'`. ISO 8601 UTC datetime. */
  endDate?: string
}

/**
 * Fetches admin revenue for a chosen period (or custom range). Disable
 * (pass `period: 'custom'` with one of `startDate`/`endDate` missing) and the
 * hook simply does not fire.
 */
export function useAdminRevenue(params: UseAdminRevenueParams) {
  const isCustomReady =
    params.period !== 'custom' || (!!params.startDate && !!params.endDate)

  return useQuery({
    queryKey: [
      ...ADMIN_REVENUE_KEY,
      params.period ?? '',
      params.startDate ?? '',
      params.endDate ?? '',
    ],
    queryFn: () => getAdminRevenue(params),
    enabled: isCustomReady,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}
