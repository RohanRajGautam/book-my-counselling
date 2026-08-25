import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import type {
  MentorMatchCreate,
  MentorMatchRequestStatus,
  MentorMatchResponse,
  MentorMatchUpdate,
} from '../types/mentor-match-requests.types'

// ── Public ────────────────────────────────────────────────────────────────

/**
 * Public create. No auth required.
 * Backend lowercases the email and trims every text field.
 */
export async function createMentorMatchRequest(
  payload: MentorMatchCreate,
): Promise<MentorMatchResponse> {
  const response = await apiClient.post<MentorMatchResponse>(
    '/mentor-match-requests',
    payload,
  )
  return response.data
}

// ── Admin ─────────────────────────────────────────────────────────────────

export interface ListAdminMentorMatchRequestsParams {
  status?: MentorMatchRequestStatus
  page?: number
  pageSize?: number
}

export async function listAdminMentorMatchRequests(
  params: ListAdminMentorMatchRequestsParams = {},
): Promise<PaginatedResponse<MentorMatchResponse>> {
  const response = await apiClient.get<PaginatedResponse<MentorMatchResponse>>(
    '/mentor-match-requests/admin',
    {
      params: {
        status: params.status,
        page: params.page ?? 1,
        page_size: params.pageSize ?? 20,
      },
    },
  )
  return response.data
}

export async function getAdminMentorMatchRequest(
  id: string,
): Promise<MentorMatchResponse> {
  const response = await apiClient.get<MentorMatchResponse>(
    `/mentor-match-requests/admin/${id}`,
  )
  return response.data
}

export async function updateAdminMentorMatchRequest(
  id: string,
  payload: MentorMatchUpdate,
): Promise<MentorMatchResponse> {
  const response = await apiClient.patch<MentorMatchResponse>(
    `/mentor-match-requests/admin/${id}`,
    payload,
  )
  return response.data
}

