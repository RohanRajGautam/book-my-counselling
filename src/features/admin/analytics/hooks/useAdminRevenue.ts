import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  getAdminRevenue,
  type GetAdminRevenueParams,
} from '../api/analytics.api'
import type {
  AdminRevenue,
  AdminRevenueMulti,
} from '../../types/admin.types'

export const ADMIN_REVENUE_KEY = ['admin', 'analytics', 'revenue'] as const

export interface UseAdminRevenueParams {
  period?: 'weekly' | 'monthly' | 'yearly' | 'custom' | 'all'
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
    queryFn: () => getAdminRevenue(params as GetAdminRevenueParams),
    enabled: isCustomReady,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

/**
 * Bundled fetch — one request returns weekly + monthly + yearly so the
 * period selector on the dashboard switches instantly without refetching.
 * The endpoint (`?period=all`) doesn't accept `startDate`/`endDate`, so this
 * hook only fires when the caller doesn't need a custom range.
 */
export function useAdminRevenueAll() {
  return useQuery<AdminRevenueMulti>({
    queryKey: [...ADMIN_REVENUE_KEY, 'all'],
    queryFn: async () => {
      const res = await getAdminRevenue({ period: 'all' })
      // `period=all` always returns the bundled shape. Narrow for the caller.
      if (!('weekly' in res)) {
        throw new Error('Expected bundled response for period=all')
      }
      return res
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}
