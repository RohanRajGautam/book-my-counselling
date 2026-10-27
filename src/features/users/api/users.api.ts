import apiClient from '@/lib/api/api-client'
import type { UserResponse } from '@/features/auth/types/auth.types'
import type { UserUpdatePayload } from '../types/users.types'

/**
 * Updates the signed-in user's own account.
 *
 * Only the fields sent in the body are touched; the rest are preserved.
 * `phone` is trimmed, and sending `null` (or an empty string) clears it.
 *
 * Doc: `PATCH /api/v1/users/me`.
 */
export async function updateMe(payload: UserUpdatePayload): Promise<UserResponse> {
  const res = await apiClient.patch<UserResponse>('/users/me', payload)
  return res.data
}
