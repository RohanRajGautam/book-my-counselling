import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { AdminReviewRow } from '../../types/admin.types'

export interface AdminListReviewsParams {
  q?: string
  /** Mentor profile id. */
  mentorId?: string
  /** Exact rating filter — sent as both min_rating and max_rating. */
  rating?: number
  page?: number
  pageSize?: number
}

/**
 * `GET /admin/reviews` — paginated admin review moderation list.
 *
 * Query params are snake_case to match the backend: `q`, `mentor_id`,
 * `min_rating`, `max_rating`, `page`, `page_size`. Newest first.
 */
export async function adminListReviews(
  params: AdminListReviewsParams,
): Promise<PaginatedResponse<AdminReviewRow>> {
  const res = await apiClient.get<PaginatedResponse<AdminReviewRow>>('/admin/reviews', {
    params: {
      q: params.q?.trim() || undefined,
      mentor_id: params.mentorId || undefined,
      min_rating: params.rating,
      max_rating: params.rating,
      page: params.page ?? 1,
      page_size: params.pageSize ?? 20,
    },
  })
  return res.data
}

/**
 * `DELETE /admin/reviews/{review_id}` — removes any review, whoever wrote it.
 * The backend recomputes the mentor's average rating and review count
 * immediately afterwards.
 */
export async function adminDeleteReview(reviewId: string): Promise<{ message: string }> {
  const res = await apiClient.delete<{ message: string }>(`/admin/reviews/${reviewId}`)
  return res.data
}
