import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { AdminMentorProfile } from '../../types/admin.types'

export async function getAdminMentors(params: {
  isVerified?: boolean
  isRejected?: boolean
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<AdminMentorProfile>> {
  const res = await apiClient.get<PaginatedResponse<AdminMentorProfile>>('/admin/mentors', {
    params: {
      is_verified: params.isVerified,
      is_rejected: params.isRejected,
      page: params.page ?? 1,
      page_size: params.pageSize ?? 20,
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

export async function featureMentor(
  mentorId: string,
  featured: boolean,
): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(
    `/admin/mentors/${mentorId}/feature`,
    null,
    { params: { featured } },
  )
  return res.data
}

export async function reindexElasticsearch(): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>('/admin/es/reindex')
  return res.data
}

export async function getMentorsWithoutAvailability(params: {
  isVerified?: boolean
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<AdminMentorProfile>> {
  const res = await apiClient.get<PaginatedResponse<AdminMentorProfile>>(
    '/admin/mentors/without-availability',
    {
      params: {
        is_verified: params.isVerified,
        page: params.page ?? 1,
        page_size: params.pageSize ?? 20,
      },
    },
  )
  return res.data
}

export async function sendAvailabilityReminder(
  mentorId: string,
): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    `/admin/mentors/${mentorId}/availability-reminder`,
  )
  return res.data
}

export async function sendBulkAvailabilityReminder(params: {
  isVerified?: boolean
}): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    '/admin/mentors/availability-reminder',
    null,
    { params },
  )
  return res.data
}
