import apiClient from '@/lib/api/api-client'
import {
  AdminRevenue,
  AdminRevenueMulti,
  AdminRevenueResponse,
  AdminStats,
  RevenuePeriod,
} from '../../types/admin.types'

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>('/admin/stats')
  return res.data
}

export type GetAdminRevenuePeriod = RevenuePeriod | 'all'

export interface GetAdminRevenueParams {
  /**
   * Preset rolling window (`weekly` / `monthly` / `yearly` / `all`).
   * `all` returns weekly + monthly + yearly bundled in one response. Mutually
   * exclusive with `startDate` + `endDate`.
   */
  period?: GetAdminRevenuePeriod
  /** ISO 8601 UTC datetime. Required iff `period === 'custom'`. */
  startDate?: string
  /** ISO 8601 UTC datetime. Required iff `period === 'custom'`. */
  endDate?: string
}

function isMulti(
  res: AdminRevenueResponse,
): res is AdminRevenueMulti {
  return (
    typeof res === 'object' &&
    res !== null &&
    'weekly' in res &&
    'monthly' in res &&
    'yearly' in res
  )
}

/**
 * Single endpoint, two response shapes. When `period='all'`, the response is
 * `AdminRevenueMulti` (bundled). Otherwise it's the single `AdminRevenue`.
 */
export async function getAdminRevenue(
  params: GetAdminRevenueParams,
): Promise<AdminRevenueResponse> {
  const query: Record<string, string> = {}
  if (params.period) query.period = params.period
  if (params.period === 'custom' && params.startDate && params.endDate) {
    query.start_date = params.startDate
    query.end_date = params.endDate
  }
  const res = await apiClient.get<AdminRevenueResponse>('/admin/revenue', { params: query })
  return res.data
}

export type { AdminRevenue, AdminRevenueMulti, AdminRevenueResponse }
