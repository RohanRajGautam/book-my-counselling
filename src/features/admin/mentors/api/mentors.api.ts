import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { MentorResponse } from '@/features/mentors/types/mentors.types'
import { UserResponse } from '@/features/auth/types/auth.types'
import { AdminMentorCreateResponse } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import {
  AdminMentorProfile,
  AdminUserProfileResponse,
  AdminUserProfileUpdate,
} from '../../types/admin.types'

export async function getAdminMentors(params: {
  q?: string
  isVerified?: boolean
  isRejected?: boolean
  withoutAvailability?: boolean
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<AdminMentorProfile>> {
  const res = await apiClient.get<PaginatedResponse<AdminMentorProfile>>('/admin/mentors', {
    params: {
      q: params.q || undefined,
      is_verified: params.isVerified,
      is_rejected: params.isRejected,
      without_availability: params.withoutAvailability ? true : undefined,
      page: params.page ?? 1,
      page_size: params.pageSize ?? 20,
    },
  })
  return res.data
}

/**
 * Walk every page of `/admin/mentors` and return the flattened list of
 * mentors whose user has an `avatar_url`. Used by the bulk welcome-card
 * download — the admin wants one ZIP, not 20 mentors per page click.
 *
 * The backend paginates at 20 by default, so for ~hundreds of mentors this
 * is a few round-trips at `pageSize=100`. Each call is independent; failures
 * short-circuit and we surface whatever we got back so the caller can decide.
 */
export async function getAllMentorsWithAvatars(params: {
  isVerified?: boolean
  isRejected?: boolean
}): Promise<AdminMentorProfile[]> {
  const pageSize = 100
  const collected: AdminMentorProfile[] = []
  let page = 1
  // Hard cap so a misconfigured backend can't loop us forever.
  for (let safety = 0; safety < 50; safety += 1) {
    const res = await getAdminMentors({
      isVerified: params.isVerified,
      isRejected: params.isRejected,
      page,
      pageSize,
    })
    for (const mentor of res.items) {
      if (mentor.user.avatar_url) collected.push(mentor)
    }
    if (!res.has_next || res.items.length === 0) break
    page += 1
  }
  return collected
}

export async function updateAdminUserProfile(
  userId: string,
  payload: AdminUserProfileUpdate
): Promise<AdminUserProfileResponse> {
  const res = await apiClient.put<AdminUserProfileResponse>(
    `/admin/users/${userId}/profile`,
    payload
  )
  return res.data
}

/**
 * Uploads a new avatar file for any user (mentee, mentor, or admin) on the
 * user's behalf. Returns the full `UserResponse` so callers can read the
 * fresh `avatar_url` immediately.
 *
 * Doc: `POST /api/v1/admin/users/{user_id}/avatar` (multipart, single `file` part).
 */
export async function adminSetUserAvatar(userId: string, file: File): Promise<UserResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient.post<UserResponse>(`/admin/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

/**
 * Uploads a new company logo for a mentor on their behalf. Returns the full
 * `MentorResponse` so callers can read the fresh `company_logo_url` immediately.
 * `mentorId` is the `MentorProfile.id` (not the user id).
 *
 * Doc: `POST /api/v1/admin/mentors/{mentor_id}/logo` (multipart, single `file` part).
 */
export async function adminSetMentorLogo(mentorId: string, file: File): Promise<MentorResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient.post<MentorResponse>(`/admin/mentors/${mentorId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
  featured: boolean
): Promise<{ message: string }> {
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
    }
  )
  return res.data
}

export async function sendAvailabilityReminder(mentorId: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    `/admin/mentors/${mentorId}/availability-reminder`
  )
  return res.data
}

export async function sendBulkAvailabilityReminder(params: {
  isVerified?: boolean
}): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    '/admin/mentors/availability-reminder',
    null,
    { params }
  )
  return res.data
}

/**
 * Creates a mentor on behalf of someone. Sends multipart/form-data with:
 *   - `metadata`: JSON-stringified `AdminMentorCreate` (user + profile)
 *   - `avatar`: optional avatar file
 * Returns the created user, profile, and a one-time `temp_password`.
 */
export async function createAdminMentor(formData: FormData): Promise<AdminMentorCreateResponse> {
  const res = await apiClient.post<AdminMentorCreateResponse>('/admin/mentors', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
