import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { AdminMentorProfile, AdminStats } from '../types/admin.types'

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>('/admin/stats')
  return res.data
}

export async function getAdminMentors(
  isVerified?: boolean,
  isRejected?: boolean,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<AdminMentorProfile>> {
  const res = await apiClient.get<PaginatedResponse<AdminMentorProfile>>('/admin/mentors', {
    params: {
      is_verified: isVerified,
      is_rejected: isRejected,
      page,
      page_size: pageSize,
    },
  })
  return res.data
}

export async function verifyMentor(mentorId: string): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(`/admin/mentors/${mentorId}/verify`)
  return res.data
}

export async function rejectMentor(mentorId: string): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(`/admin/mentors/${mentorId}/reject`)
  return res.data
}

export async function featureMentor(mentorId: string, featured: boolean): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(
    `/admin/mentors/${mentorId}/feature`,
    null,
    { params: { featured } }
  )
  return res.data
}

export async function reindexElasticsearch(): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/admin/es/reindex')
  return res.data
}
