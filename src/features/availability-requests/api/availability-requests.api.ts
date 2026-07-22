import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  AvailabilityRequestResponse,
  AvailabilityRequestStatus,
  AvailabilityRequestCreate,
  AvailabilityRequestReject,
} from '../types/availability-requests.types'

// ── Public ────────────────────────────────────────────────────────────────

/**
 * Public create. No auth required.
 * Backend lowercases the email and trims name + message server-side.
 */
export async function createAvailabilityRequest(
  payload: AvailabilityRequestCreate,
): Promise<AvailabilityRequestResponse> {
  const response = await apiClient.post<AvailabilityRequestResponse>(
    '/availability-requests',
    payload,
  )
  return response.data
}

// ── Mentor ────────────────────────────────────────────────────────────────

export interface ListAvailabilityRequestsParams {
  status?: AvailabilityRequestStatus
  page?: number
  pageSize?: number
}

export async function listMyAvailabilityRequests(
  params: ListAvailabilityRequestsParams = {},
): Promise<PaginatedResponse<AvailabilityRequestResponse>> {
  const response = await apiClient.get<PaginatedResponse<AvailabilityRequestResponse>>(
    '/availability-requests',
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

export async function confirmAvailabilityRequest(
  id: string,
): Promise<AvailabilityRequestResponse> {
  const response = await apiClient.post<AvailabilityRequestResponse>(
    `/availability-requests/${id}/confirm`,
    {},
  )
  return response.data
}

export async function rejectAvailabilityRequest(
  id: string,
  payload: AvailabilityRequestReject = {},
): Promise<AvailabilityRequestResponse> {
  const response = await apiClient.post<AvailabilityRequestResponse>(
    `/availability-requests/${id}/reject`,
    payload,
  )
  return response.data
}

// ── Admin ─────────────────────────────────────────────────────────────────

export async function listAllAvailabilityRequests(
  params: ListAvailabilityRequestsParams = {},
): Promise<PaginatedResponse<AvailabilityRequestResponse>> {
  const response = await apiClient.get<PaginatedResponse<AvailabilityRequestResponse>>(
    '/availability-requests/admin',
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
