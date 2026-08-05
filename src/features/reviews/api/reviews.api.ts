import { PaginatedResponse } from '@/lib/api/api.types'
import apiClient from '@/lib/api/api-client'
import { ReviewResponse, ReviewInvitation, ReviewSubmitRequest } from '../types/reviews.types'

export async function getMentorReviews(
  mentorId: string,
  page: number = 1,
  page_size: number = 1
): Promise<PaginatedResponse<ReviewResponse>> {
  const response = await apiClient.get<PaginatedResponse<ReviewResponse>>(
    `/reviews/mentor/${mentorId}`,
    {
      params: {
        page,
        page_size,
      },
    }
  )

  return response.data
}

// Public, no-auth magic-link endpoints. The Bearer-token interceptor is a
// no-op when no token is in localStorage, which is the case for an
// unauthenticated visit via the emailed link.
export async function getReviewInvitation(token: string): Promise<ReviewInvitation> {
  const response = await apiClient.get<ReviewInvitation>(`/reviews/invitation/${token}`)
  return response.data
}

export async function submitReviewInvitation(
  token: string,
  body: ReviewSubmitRequest
): Promise<ReviewResponse> {
  const response = await apiClient.post<ReviewResponse>(`/reviews/invitation/${token}`, body)
  return response.data
}
