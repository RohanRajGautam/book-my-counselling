import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedResponse } from '@/lib/api/api.types'
import { adminDeleteReview, adminListReviews, AdminListReviewsParams } from '../api/reviews.api'
import { AdminReviewRow } from '../../types/admin.types'

export interface UseAdminReviewsParams {
  q?: string
  mentorId?: string
  rating?: number
  page?: number
}

export const ADMIN_REVIEWS_KEY = ['admin', 'reviews'] as const

export function useAdminReviews(params: UseAdminReviewsParams) {
  const { q, mentorId, rating, page = 1 } = params
  return useQuery({
    queryKey: [...ADMIN_REVIEWS_KEY, q ?? '', mentorId ?? '', rating ?? 'all', page],
    queryFn: () =>
      adminListReviews({
        q,
        mentorId,
        rating,
        page,
      } satisfies AdminListReviewsParams),
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
  })
}

/**
 * Deletes a review on the mentor's behalf. The row is dropped from the cached
 * list straight away so it disappears without a flash, then the current page
 * is refetched to reconcile the total and the page boundaries.
 *
 * The mentor's average rating and review count change server-side, so the
 * admin mentor list is invalidated too.
 */
export function useDeleteAdminReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: string) => adminDeleteReview(reviewId),
    onSuccess: (_data, reviewId) => {
      removeReviewFromAdminCaches(qc, reviewId)
      void qc.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY })
      void qc.invalidateQueries({ queryKey: ['admin', 'mentors'] })
    },
  })
}

function removeReviewFromAdminCaches(qc: ReturnType<typeof useQueryClient>, reviewId: string) {
  const queries = qc.getQueriesData<PaginatedResponse<AdminReviewRow>>({
    queryKey: ADMIN_REVIEWS_KEY,
  })
  for (const [key, data] of queries) {
    if (!data) continue
    const filtered = data.items.filter((r) => r.id !== reviewId)
    if (filtered.length !== data.items.length) {
      qc.setQueryData(key, {
        ...data,
        items: filtered,
        total: Math.max(0, data.total - 1),
      })
    }
  }
}
