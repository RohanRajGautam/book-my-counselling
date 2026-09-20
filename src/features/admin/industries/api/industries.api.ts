import apiClient from '@/lib/api/api-client'
import type { IndustryResponse } from '@/features/industries/types/industries.types'
import type { IndustryCreate } from '../types/industries.types'

export async function createIndustry(
  payload: IndustryCreate,
): Promise<IndustryResponse> {
  const res = await apiClient.post<IndustryResponse>('/admin/industries', payload)
  return res.data
}

export async function deleteIndustry(id: string): Promise<void> {
  await apiClient.delete(`/admin/industries/${id}`)
}