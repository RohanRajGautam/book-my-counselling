import apiClient from '@/lib/api/api-client'
import {
  AdminRevenue,
  AdminStats,
  RevenuePeriod,
} from '../../types/admin.types'

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>('/admin/stats')
  return res.data
}

export interface GetAdminRevenueParams {
  /**
   * Preset rolling window (`weekly` / `monthly` / `yearly`). Mutually exclusive
   * with `startDate` + `endDate` — pass one or the other.
   */
  period?: RevenuePeriod
  /** ISO 8601 UTC datetime. Required iff `period === 'custom'`. */
  startDate?: string
  /** ISO 8601 UTC datetime. Required iff `period === 'custom'`. */
  endDate?: string
}

export async function getAdminRevenue(
  params: GetAdminRevenueParams,
): Promise<AdminRevenue> {
  const query: Record<string, string> = {}
  if (params.period) query.period = params.period
  if (params.period === 'custom' && params.startDate && params.endDate) {
    query.start_date = params.startDate
    query.end_date = params.endDate
  }
  const res = await apiClient.get<AdminRevenue>('/admin/revenue', { params: query })
  return res.data
}
