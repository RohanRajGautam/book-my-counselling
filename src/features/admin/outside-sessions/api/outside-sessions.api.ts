// HTTP layer for the `/admin/outside-sessions` endpoint family.
//
// Deliberately separate from `features/admin/bookings/api/bookings.api.ts`:
// outside sessions live in their own DB table and have different
// accounting semantics — see the feature README and `OutsideSessionRow` in
// `types/admin.types.ts`. Do NOT mix requests between the two.

import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import {
  OutsideSessionCreate,
  OutsideSessionRow,
  OutsideSessionStatus,
} from '../../types/admin.types'

export interface AdminListOutsideSessionsParams {
  q?: string
  status?: OutsideSessionStatus
  page?: number
  pageSize?: number
}

/** `GET /admin/outside-sessions` — paginated, with `q` + `status` filters. */
export async function adminListOutsideSessions(
  params: AdminListOutsideSessionsParams,
): Promise<PaginatedResponse<OutsideSessionRow>> {
  const res = await apiClient.get<PaginatedResponse<OutsideSessionRow>>(
    '/admin/outside-sessions',
    {
      params: {
        q: params.q || undefined,
        status: params.status,
        page: params.page ?? 1,
        page_size: params.pageSize ?? 20,
      },
    },
  )
  return res.data
}

/** `GET /admin/outside-sessions/{id}` — full row for the detail modal. */
export async function adminGetOutsideSession(
  sessionId: string,
): Promise<OutsideSessionRow> {
  const res = await apiClient.get<OutsideSessionRow>(
    `/admin/outside-sessions/${sessionId}`,
  )
  return res.data
}

/** `POST /admin/outside-sessions` — create a new row. */
export async function adminCreateOutsideSession(
  payload: OutsideSessionCreate,
): Promise<OutsideSessionRow> {
  const res = await apiClient.post<OutsideSessionRow>(
    '/admin/outside-sessions',
    payload,
  )
  return res.data
}

/**
 * `PATCH /admin/outside-sessions/{id}/complete` — flip a `scheduled` row to
 * `completed`. Idempotent — calling on an already-completed row is a no-op
 * that returns the existing row. Body is empty (`{}`).
 */
export async function adminCompleteOutsideSession(
  sessionId: string,
): Promise<OutsideSessionRow> {
  const res = await apiClient.patch<OutsideSessionRow>(
    `/admin/outside-sessions/${sessionId}/complete`,
    {},
  )
  return res.data
}